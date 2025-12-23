/**
 * Admin API for testimonial moderation
 *
 * PATCH /api/admin/testimonials/[id] - Approve or feature a testimonial
 * DELETE /api/admin/testimonials/[id] - Delete a testimonial
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface ModerateTestimonialRequest {
  isApproved?: boolean;
  isFeatured?: boolean;
}

interface ModerateTestimonialResponse {
  success: boolean;
  error?: string;
}

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
 * PATCH /api/admin/testimonials/[id]
 * Approve or feature a testimonial
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ModerateTestimonialResponse>> {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Check admin access
    if (!(await isAdmin(supabase))) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    // Parse request body
    const body: ModerateTestimonialRequest = await request.json();
    const { isApproved, isFeatured } = body;

    // Build update object
    const updates: Record<string, boolean> = {};
    if (typeof isApproved === "boolean") {
      updates.is_approved = isApproved;
    }
    if (typeof isFeatured === "boolean") {
      updates.is_featured = isFeatured;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid updates provided" },
        { status: 400 }
      );
    }

    // Update testimonial
    const { error: updateError } = await supabase.from("testimonials").update(updates).eq("id", id);

    if (updateError) {
      console.error("Failed to update testimonial:", updateError);
      return NextResponse.json(
        { success: false, error: "Failed to update testimonial" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Moderate testimonial error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/testimonials/[id]
 * Delete a testimonial
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ModerateTestimonialResponse>> {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Check admin access
    if (!(await isAdmin(supabase))) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    // Delete testimonial
    const { error: deleteError } = await supabase.from("testimonials").delete().eq("id", id);

    if (deleteError) {
      console.error("Failed to delete testimonial:", deleteError);
      return NextResponse.json(
        { success: false, error: "Failed to delete testimonial" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete testimonial error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
