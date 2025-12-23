/**
 * API routes for testimonials
 *
 * POST /api/testimonials - Create a new testimonial
 * GET /api/testimonials - Fetch approved public testimonials
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getVisitorFingerprint } from "@/lib/visitor";

// Types for testimonial operations
type TestimonialType =
  | "story_contribution"
  | "chapter_completion"
  | "cenotaph_design"
  | "general"
  | "community"
  | "organization";

interface CreateTestimonialRequest {
  content: string;
  rating?: number;
  type: TestimonialType;
  contextId?: string;
  contextMetadata?: Record<string, unknown>;
  isPublic?: boolean;
  displayName?: string;
}

interface CreateTestimonialResponse {
  success: boolean;
  testimonialId?: string;
  error?: string;
}

interface PublicTestimonial {
  id: string;
  content: string;
  rating: number | null;
  type: string;
  display_name: string | null;
  is_featured: boolean;
  created_at: string;
}

interface GetTestimonialsResponse {
  success: boolean;
  testimonials?: PublicTestimonial[];
  error?: string;
}

/**
 * POST /api/testimonials
 * Create a new testimonial (authenticated or anonymous)
 */
export async function POST(request: NextRequest): Promise<NextResponse<CreateTestimonialResponse>> {
  try {
    const supabase = await createClient();

    // Parse request body
    const body: CreateTestimonialRequest = await request.json();
    const { content, rating, type, contextId, contextMetadata, isPublic, displayName } = body;

    // Validate required fields
    if (!content || content.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Content is required" }, { status: 400 });
    }

    if (!type) {
      return NextResponse.json(
        { success: false, error: "Testimonial type is required" },
        { status: 400 }
      );
    }

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Get visitor fingerprint for anonymous tracking
    const visitorFingerprint = await getVisitorFingerprint();

    // Check auth (optional)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Insert testimonial
    const { data: testimonial, error: insertError } = await supabase
      .from("testimonials")
      .insert({
        user_id: user?.id || null,
        content: content.trim(),
        rating: rating || null,
        type,
        context_id: contextId || null,
        context_metadata: contextMetadata || {},
        is_public: isPublic || false,
        display_name: isPublic ? displayName || null : null,
        visitor_fingerprint: visitorFingerprint,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Failed to create testimonial:", insertError);
      return NextResponse.json(
        { success: false, error: "Failed to submit feedback" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      testimonialId: testimonial.id,
    });
  } catch (err) {
    console.error("Create testimonial error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

/**
 * GET /api/testimonials
 * Fetch approved public testimonials
 *
 * Query params:
 * - type: Filter by testimonial type
 * - featured: If "true", only return featured testimonials
 * - limit: Number of testimonials to return (default: 10, max: 50)
 */
export async function GET(request: NextRequest): Promise<NextResponse<GetTestimonialsResponse>> {
  try {
    const supabase = await createClient();

    // Parse query params
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const featuredOnly = searchParams.get("featured") === "true";
    const limitParam = searchParams.get("limit");
    const limit = Math.min(Math.max(parseInt(limitParam || "10", 10), 1), 50);

    // Build query
    let query = supabase
      .from("testimonials")
      .select("id, content, rating, type, display_name, is_featured, created_at")
      .eq("is_public", true)
      .eq("is_approved", true)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (type) {
      query = query.eq("type", type);
    }

    if (featuredOnly) {
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
    console.error("Get testimonials error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
