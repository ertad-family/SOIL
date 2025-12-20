/**
 * POST /api/story/[storyId]/summary
 * Generate AI summary for a story after module completion
 *
 * Issue: #20 Update the story page
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateStorySummary } from "@/lib/summary/generate-summary";
import type { Story, ModuleId, AISummary, AISummaryStatus } from "@/types/interview";

// Initialize Supabase client with service role for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface GenerateSummaryRequest {
  lastCompletedModule: ModuleId;
}

interface GenerateSummaryResponse {
  success: boolean;
  summary?: AISummary;
  status?: AISummaryStatus;
  error?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ storyId: string }> }
): Promise<NextResponse<GenerateSummaryResponse>> {
  try {
    const { storyId } = await params;
    const body: GenerateSummaryRequest = await request.json();
    const { lastCompletedModule } = body;

    if (!storyId) {
      return NextResponse.json({ success: false, error: "Story ID is required" }, { status: 400 });
    }

    if (!lastCompletedModule) {
      return NextResponse.json(
        { success: false, error: "Last completed module is required" },
        { status: 400 }
      );
    }

    // Fetch the story
    const { data: storyData, error: storyError } = await supabase
      .from("stories")
      .select("*")
      .eq("id", storyId)
      .single();

    if (storyError || !storyData) {
      return NextResponse.json({ success: false, error: "Story not found" }, { status: 404 });
    }

    // Check if already generating
    if (storyData.ai_summary_status === "generating") {
      return NextResponse.json(
        { success: false, error: "Summary generation already in progress", status: "generating" },
        { status: 409 }
      );
    }

    // Update status to generating
    await supabase.from("stories").update({ ai_summary_status: "generating" }).eq("id", storyId);

    // Transform database story to TypeScript Story type
    const story: Story = {
      id: storyData.id,
      organizationId: storyData.organization_id,
      userId: storyData.user_id,
      status: storyData.status,
      currentModule: storyData.current_module,
      completedModules: storyData.completed_modules || [],
      founderRole: storyData.founder_role,
      publicNaming: storyData.public_naming,
      basicInfo: storyData.basic_info,
      functionalMapping: storyData.functional_mapping,
      financialPicture: storyData.financial_picture,
      dynamicPicture: storyData.dynamic_picture,
      environment: storyData.environment,
      founderContext: storyData.founder_context,
      narrative: storyData.narrative,
      createdAt: storyData.created_at,
      updatedAt: storyData.updated_at,
      coinedAt: storyData.coined_at,
      aiSummary: storyData.ai_summary,
      aiSummaryStatus: storyData.ai_summary_status || "idle",
      aiSummaryUpdatedAt: storyData.ai_summary_updated_at,
    };

    // Generate the summary
    const summary = await generateStorySummary(story, lastCompletedModule);

    // Save the summary to the database
    const { error: updateError } = await supabase
      .from("stories")
      .update({
        ai_summary: summary,
        ai_summary_status: "ready",
        ai_summary_updated_at: new Date().toISOString(),
      })
      .eq("id", storyId);

    if (updateError) {
      console.error("Error saving summary:", updateError);
      // Update status to failed
      await supabase.from("stories").update({ ai_summary_status: "failed" }).eq("id", storyId);

      return NextResponse.json(
        { success: false, error: "Failed to save summary" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      summary,
      status: "ready",
    });
  } catch (error) {
    console.error("Error generating summary:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate summary",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/story/[storyId]/summary
 * Get the current summary status and data
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storyId: string }> }
): Promise<NextResponse<GenerateSummaryResponse>> {
  try {
    const { storyId } = await params;

    if (!storyId) {
      return NextResponse.json({ success: false, error: "Story ID is required" }, { status: 400 });
    }

    // Fetch the story summary fields
    const { data: storyData, error: storyError } = await supabase
      .from("stories")
      .select("ai_summary, ai_summary_status, ai_summary_updated_at")
      .eq("id", storyId)
      .single();

    if (storyError || !storyData) {
      return NextResponse.json({ success: false, error: "Story not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      summary: storyData.ai_summary,
      status: storyData.ai_summary_status || "idle",
    });
  } catch (error) {
    console.error("Error fetching summary:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch summary",
      },
      { status: 500 }
    );
  }
}
