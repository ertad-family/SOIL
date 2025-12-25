/**
 * POST /api/cenotaph/add-story-bonus
 * Add +1 bonus generation attempt when story is coined (completed)
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface AddStoryBonusRequest {
  storyId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AddStoryBonusRequest = await request.json();
    const { storyId } = body;

    if (!storyId) {
      return NextResponse.json({ success: false, error: "Story ID is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // Fetch story to get organization_id and verify ownership
    const { data: story, error: storyError } = await supabase
      .from("stories")
      .select("id, organization_id, status, user_id")
      .eq("id", storyId)
      .single();

    if (storyError || !story) {
      return NextResponse.json({ success: false, error: "Story not found" }, { status: 404 });
    }

    // Verify ownership
    if (story.user_id !== user.id) {
      return NextResponse.json(
        { success: false, error: "You don't have permission to modify this story" },
        { status: 403 }
      );
    }

    // Only add bonus if story is coined
    if (story.status !== "coined") {
      return NextResponse.json(
        { success: false, error: "Story must be coined to receive bonus" },
        { status: 400 }
      );
    }

    if (!story.organization_id) {
      return NextResponse.json(
        { success: false, error: "Story has no associated organization" },
        { status: 400 }
      );
    }

    // Find memorial for this organization
    const { data: memorial, error: memorialError } = await supabase
      .from("memorials")
      .select("id, design_metadata")
      .eq("organization_id", story.organization_id)
      .single();

    if (memorialError || !memorial) {
      // No memorial yet - that's OK, bonus will be applied when memorial is created
      return NextResponse.json({
        success: true,
        message: "No memorial found for organization",
      });
    }

    // Check if bonus already applied
    const storyBonus = memorial.design_metadata?.storyBonus || false;
    if (storyBonus) {
      return NextResponse.json({
        success: true,
        message: "Story bonus already applied",
      });
    }

    // Add +1 bonus attempt for completed story
    const bonusAttempts = memorial.design_metadata?.bonusAttempts || 0;
    const { error: updateError } = await supabase
      .from("memorials")
      .update({
        design_metadata: {
          ...memorial.design_metadata,
          bonusAttempts: bonusAttempts + 1,
          storyBonus: true,
        },
      })
      .eq("id", memorial.id);

    if (updateError) {
      console.error("Failed to add story bonus:", updateError);
      return NextResponse.json({ success: false, error: "Failed to add bonus" }, { status: 500 });
    }

    console.log(`Added story bonus attempt to memorial ${memorial.id} (story: ${storyId})`);

    return NextResponse.json({
      success: true,
      message: "Story completion bonus added",
    });
  } catch (error) {
    console.error("Add story bonus error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
