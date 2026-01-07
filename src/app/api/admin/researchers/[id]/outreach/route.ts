/**
 * Admin API for updating researcher outreach status
 * Issue #279: Researcher Outreach Tracking System
 *
 * PATCH /api/admin/researchers/[id]/outreach - Update outreach status for a researcher
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface UpdateOutreachRequest {
  outreach_status?: string;
  outreach_notes?: string;
  last_contacted_at?: string;
  follow_up_date?: string | null;
}

interface UpdateOutreachResponse {
  success: boolean;
  error?: string;
}

const VALID_STATUSES = [
  "not_contacted",
  "contacted",
  "responded",
  "interested",
  "declined",
  "joined",
];

/**
 * Check if the current user is an admin
 */
async function isAdmin(supabase: Awaited<ReturnType<typeof createClient>>): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "admin";
}

/**
 * PATCH /api/admin/researchers/[id]/outreach
 * Update outreach status for a researcher
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<UpdateOutreachResponse>> {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Check admin access
    if (!(await isAdmin(supabase))) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    // Parse request body
    const body: UpdateOutreachRequest = await request.json();
    const { outreach_status, outreach_notes, last_contacted_at, follow_up_date } = body;

    // Validate status if provided
    if (outreach_status && !VALID_STATUSES.includes(outreach_status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    // Build update object
    const updates: Record<string, string | null> = {};

    if (outreach_status !== undefined) {
      updates.outreach_status = outreach_status;
    }
    if (outreach_notes !== undefined) {
      updates.outreach_notes = outreach_notes;
    }
    if (last_contacted_at !== undefined) {
      updates.last_contacted_at = last_contacted_at;
    }
    if (follow_up_date !== undefined) {
      updates.follow_up_date = follow_up_date;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid updates provided" },
        { status: 400 }
      );
    }

    // Update researcher
    const { error: updateError } = await supabase.from("researchers").update(updates).eq("id", id);

    if (updateError) {
      console.error("Failed to update researcher outreach:", updateError);
      return NextResponse.json(
        { success: false, error: "Failed to update outreach status" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update outreach error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
