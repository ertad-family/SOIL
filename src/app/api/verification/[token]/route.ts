import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ token: string }>;
}

// GET /api/verification/[token] - Get verification request info by token
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { token } = await params;
    const supabase = await createClient();

    // Fetch verification request by token
    // Note: This query bypasses RLS because it's for public verification page
    const { data: verificationRequest, error } = await supabase
      .from("verification_requests")
      .select(
        `
        id,
        verifier_email,
        verifier_name,
        relationship,
        status,
        expires_at,
        requester_name,
        claimed_role,
        organization:organizations (
          id,
          name,
          organization_type,
          founded_date,
          closed_date
        )
      `
      )
      .eq("token", token)
      .single();

    if (error || !verificationRequest) {
      return NextResponse.json({ error: "Verification request not found" }, { status: 404 });
    }

    // Check if expired
    if (new Date(verificationRequest.expires_at) < new Date()) {
      return NextResponse.json({ error: "Verification request has expired" }, { status: 410 });
    }

    // Check if already responded
    if (verificationRequest.status !== "pending") {
      return NextResponse.json(
        {
          error: "Verification request has already been responded to",
          status: verificationRequest.status,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      request: {
        id: verificationRequest.id,
        verifierEmail: verificationRequest.verifier_email,
        verifierName: verificationRequest.verifier_name,
        relationship: verificationRequest.relationship,
        requesterName: verificationRequest.requester_name,
        claimedRole: verificationRequest.claimed_role,
        organization: verificationRequest.organization,
      },
    });
  } catch (err) {
    console.error("Verification GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/verification/[token] - Confirm or decline verification
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { token } = await params;
    const supabase = await createClient();

    // Parse body
    const body = await request.json();
    const { action, message } = body; // action: 'confirm' | 'decline'

    if (!action || !["confirm", "decline"].includes(action)) {
      return NextResponse.json({ error: 'action must be "confirm" or "decline"' }, { status: 400 });
    }

    // Fetch verification request
    const { data: verificationRequest, error: fetchError } = await supabase
      .from("verification_requests")
      .select("id, status, expires_at, organization_id")
      .eq("token", token)
      .single();

    if (fetchError || !verificationRequest) {
      return NextResponse.json({ error: "Verification request not found" }, { status: 404 });
    }

    // Check if expired
    if (new Date(verificationRequest.expires_at) < new Date()) {
      return NextResponse.json({ error: "Verification request has expired" }, { status: 410 });
    }

    // Check if already responded
    if (verificationRequest.status !== "pending") {
      return NextResponse.json(
        {
          error: "Verification request has already been responded to",
          status: verificationRequest.status,
        },
        { status: 400 }
      );
    }

    // Update verification request
    const newStatus = action === "confirm" ? "confirmed" : "declined";
    const { error: updateError } = await supabase
      .from("verification_requests")
      .update({
        status: newStatus,
        responded_at: new Date().toISOString(),
        response_message: message?.trim() || null,
      })
      .eq("id", verificationRequest.id);

    if (updateError) {
      console.error("Failed to update verification request:", updateError);
      return NextResponse.json({ error: "Failed to process verification" }, { status: 500 });
    }

    // The trigger will automatically update organization verification_count and status

    return NextResponse.json({
      success: true,
      status: newStatus,
      message:
        action === "confirm"
          ? "Thank you for verifying this organization!"
          : "Your response has been recorded.",
    });
  } catch (err) {
    console.error("Verification POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
