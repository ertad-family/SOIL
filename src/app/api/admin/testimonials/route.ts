/**
 * Admin API for listing testimonials
 *
 * GET /api/admin/testimonials - List all testimonials (including unapproved)
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface Testimonial {
  id: string;
  content: string;
  rating: number | null;
  type: string;
  display_name: string | null;
  is_public: boolean;
  is_approved: boolean;
  is_featured: boolean;
  created_at: string;
  user_id: string | null;
}

interface GetTestimonialsResponse {
  success: boolean;
  testimonials?: Testimonial[];
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
 * GET /api/admin/testimonials
 * List all testimonials for admin moderation
 */
export async function GET(request: NextRequest): Promise<NextResponse<GetTestimonialsResponse>> {
  try {
    const supabase = await createClient();

    // Check admin access
    if (!(await isAdmin(supabase))) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    // Parse query params
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "all"; // all, pending, approved, featured

    // Build query
    let query = supabase
      .from("testimonials")
      .select(
        "id, content, rating, type, display_name, is_public, is_approved, is_featured, created_at, user_id"
      )
      .order("created_at", { ascending: false });

    // Apply filters
    if (filter === "pending") {
      query = query.eq("is_approved", false);
    } else if (filter === "approved") {
      query = query.eq("is_approved", true);
    } else if (filter === "featured") {
      query = query.eq("is_featured", true);
    }

    const { data: testimonials, error } = await query;

    if (error) {
      console.error("Failed to fetch testimonials:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch testimonials" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      testimonials: testimonials || [],
    });
  } catch (err) {
    console.error("Admin testimonials error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
