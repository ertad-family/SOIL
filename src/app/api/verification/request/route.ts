import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { triggerEmailWorkerAsync } from "@/lib/worker";

// Types for request body
interface VerificationContact {
  email: string;
  name?: string;
  relationship: "colleague" | "customer" | "supplier" | "partner" | "investor" | "other";
  details?: string;
}

interface CreateVerificationRequestBody {
  organizationId: string;
  contacts: VerificationContact[];
}

// POST /api/verification/request - Create verification requests
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse body
    const body: CreateVerificationRequestBody = await request.json();
    const { organizationId, contacts } = body;

    if (!organizationId || !contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json(
        { error: "organizationId and contacts array are required" },
        { status: 400 }
      );
    }

    // Validate contacts (max 10)
    if (contacts.length > 10) {
      return NextResponse.json(
        { error: "Maximum 10 contacts allowed per request" },
        { status: 400 }
      );
    }

    // Check organization ownership
    const { data: organization, error: orgError } = await supabase
      .from("organizations")
      .select("id, created_by, name")
      .eq("id", organizationId)
      .single();

    if (orgError || !organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    if (organization.created_by !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch user's profile for display name
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single();

    // Fetch user's story for this organization to get their claimed role
    const { data: story } = await supabase
      .from("stories")
      .select("founder_role, author_role")
      .eq("organization_id", organizationId)
      .eq("user_id", user.id)
      .single();

    // Determine requester name and claimed role
    const requesterName = profile?.display_name || user.email?.split("@")[0] || "Unknown";
    // Use author_role if set, fallback to founder_role, then null
    const claimedRole = story?.author_role || story?.founder_role || null;

    // Create verification requests
    const requestsToInsert = contacts.map((contact) => ({
      organization_id: organizationId,
      requester_id: user.id,
      requester_name: requesterName,
      claimed_role: claimedRole,
      verifier_email: contact.email.toLowerCase().trim(),
      verifier_name: contact.name?.trim() || null,
      relationship: contact.relationship,
      relationship_details: contact.details?.trim() || null,
    }));

    const { data: createdRequests, error: insertError } = await supabase
      .from("verification_requests")
      .insert(requestsToInsert)
      .select();

    if (insertError) {
      // Handle duplicate email error
      if (insertError.code === "23505") {
        return NextResponse.json(
          { error: "Some contacts have already been invited for this organization" },
          { status: 409 }
        );
      }
      console.error("Failed to create verification requests:", insertError);
      return NextResponse.json({ error: "Failed to create requests" }, { status: 500 });
    }

    // Trigger email worker immediately (fire-and-forget)
    // If this fails, the cron job will pick up pending emails
    triggerEmailWorkerAsync();

    return NextResponse.json({
      success: true,
      requests: createdRequests,
      message: `${createdRequests?.length || 0} verification request(s) created`,
    });
  } catch (err) {
    console.error("Verification request error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/verification/request?organizationId=xxx - Get verification requests for organization
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId");

    if (!organizationId) {
      return NextResponse.json({ error: "organizationId is required" }, { status: 400 });
    }

    // Check organization ownership
    const { data: organization, error: orgError } = await supabase
      .from("organizations")
      .select("id, created_by")
      .eq("id", organizationId)
      .single();

    if (orgError || !organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    if (organization.created_by !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get verification requests
    const { data: requests, error: requestsError } = await supabase
      .from("verification_requests")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (requestsError) {
      console.error("Failed to fetch verification requests:", requestsError);
      return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
    }

    return NextResponse.json({ requests });
  } catch (err) {
    console.error("Verification GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/verification/request?id=xxx - Cancel a verification request
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get("id");

    if (!requestId) {
      return NextResponse.json({ error: "Request ID is required" }, { status: 400 });
    }

    // Fetch the request to verify ownership and check if it can be cancelled
    const { data: verificationRequest, error: fetchError } = await supabase
      .from("verification_requests")
      .select("id, requester_id, email_sent_at, status")
      .eq("id", requestId)
      .single();

    if (fetchError || !verificationRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Only the requester can cancel their own request
    if (verificationRequest.requester_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Can only cancel if email hasn't been sent yet
    if (verificationRequest.email_sent_at) {
      return NextResponse.json(
        { error: "Cannot cancel - email has already been sent" },
        { status: 400 }
      );
    }

    // Can only cancel pending requests
    if (verificationRequest.status !== "pending") {
      return NextResponse.json(
        { error: "Cannot cancel - request is no longer pending" },
        { status: 400 }
      );
    }

    // Delete the request
    const { error: deleteError } = await supabase
      .from("verification_requests")
      .delete()
      .eq("id", requestId);

    if (deleteError) {
      console.error("Failed to delete verification request:", deleteError);
      return NextResponse.json({ error: "Failed to cancel request" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Request cancelled" });
  } catch (err) {
    console.error("Verification DELETE error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
