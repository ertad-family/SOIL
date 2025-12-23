/**
 * API endpoint to check if user has already submitted feedback for a specific type
 *
 * GET /api/testimonials/check?type=story_contribution
 *
 * Returns { hasSubmitted: true/false } for authenticated users
 * Anonymous users always get { hasSubmitted: false }
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type TestimonialType =
  | "story_contribution"
  | "chapter_completion"
  | "cenotaph_design"
  | "general"
  | "community"
  | "organization";

interface CheckFeedbackResponse {
  success: boolean;
  hasSubmitted?: boolean;
  submittedTypes?: string[];
  error?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<CheckFeedbackResponse>> {
  try {
    const supabase = await createClient();

    // Check auth - only works for authenticated users
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // Anonymous users - we can't check, so return false
      return NextResponse.json({
        success: true,
        hasSubmitted: false,
        submittedTypes: [],
      });
    }

    // Parse query params
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as TestimonialType | null;

    if (type) {
      // Check for specific type
      const { data, error } = await supabase
        .from("testimonials")
        .select("id")
        .eq("user_id", user.id)
        .eq("type", type)
        .limit(1);

      if (error) {
        console.error("Failed to check testimonial:", error);
        return NextResponse.json(
          { success: false, error: "Failed to check feedback status" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        hasSubmitted: data && data.length > 0,
      });
    } else {
      // Return all types that user has submitted
      const { data, error } = await supabase
        .from("testimonials")
        .select("type")
        .eq("user_id", user.id);

      if (error) {
        console.error("Failed to check testimonials:", error);
        return NextResponse.json(
          { success: false, error: "Failed to check feedback status" },
          { status: 500 }
        );
      }

      const submittedTypes = [...new Set((data || []).map((t) => t.type))];

      return NextResponse.json({
        success: true,
        hasSubmitted: submittedTypes.length > 0,
        submittedTypes,
      });
    }
  } catch (err) {
    console.error("Check testimonial error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
