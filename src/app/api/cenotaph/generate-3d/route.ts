/**
 * POST /api/cenotaph/generate-3d
 * Start 3D model generation for a cenotaph
 *
 * Issue: #254 - AI Pipeline for 3D Cenotaph Model Generation
 *
 * Requirements:
 * - User must be authenticated and own the memorial
 * - Organization must be verified
 * - Must have at least one coined story
 * - Must have multiple perspectives (≥2 stories)
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSettingsMap } from "@/lib/settings.server";
import {
  getModel3dProvider,
  getModel3dResolution,
  getModel3dPolygonCount,
  isModel3dEnabled,
} from "@/lib/settings";
import { Model3DService, check3DModelEligibility } from "@/lib/cenotaph/model3d";
import type { Model3DProviderType } from "@/lib/cenotaph/model3d";
import type { StoryStatus, VerificationStatus } from "@/types/interview";

interface Generate3DRequest {
  memorialId: string;
}

interface Generate3DResponse {
  success: boolean;
  taskId?: string;
  provider?: string;
  error?: string;
  eligibility?: {
    eligible: boolean;
    reasons: string[];
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<Generate3DResponse>> {
  try {
    // Initialize authenticated client
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body: Generate3DRequest = await request.json();
    const { memorialId } = body;

    if (!memorialId) {
      return NextResponse.json(
        { success: false, error: "Memorial ID is required" },
        { status: 400 }
      );
    }

    // Check if 3D generation is enabled
    const settings = await getSettingsMap();
    if (!isModel3dEnabled(settings)) {
      return NextResponse.json(
        { success: false, error: "3D model generation is currently disabled" },
        { status: 503 }
      );
    }

    // Fetch memorial with organization
    const { data: memorial, error: memorialError } = await supabase
      .from("memorials")
      .select(
        `
        id,
        user_id,
        cenotaph_image_url,
        cenotaph_model_url,
        model_generation_status,
        model_generation_task_id,
        model_generation_provider,
        organization_id
      `
      )
      .eq("id", memorialId)
      .single();

    if (memorialError || !memorial) {
      return NextResponse.json({ success: false, error: "Memorial not found" }, { status: 404 });
    }

    // Verify ownership
    if (memorial.user_id !== user.id) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    // Check if already generating or downloading
    if (
      memorial.model_generation_status === "pending" ||
      memorial.model_generation_status === "processing" ||
      memorial.model_generation_status === "downloading"
    ) {
      return NextResponse.json(
        { success: false, error: "3D model generation already in progress" },
        { status: 409 }
      );
    }

    // Check if already has a 3D model
    if (memorial.cenotaph_model_url) {
      return NextResponse.json(
        { success: false, error: "Memorial already has a 3D model" },
        { status: 409 }
      );
    }

    // If previous task failed but task_id exists, try to recover it instead of creating new
    if (
      memorial.model_generation_status === "failed" &&
      memorial.model_generation_task_id &&
      memorial.model_generation_provider
    ) {
      console.log(`[generate-3d] Recovering failed task ${memorial.model_generation_task_id}`);
      // Reset status to processing so polling will try to download again
      await supabase
        .from("memorials")
        .update({ model_generation_status: "processing" })
        .eq("id", memorialId);

      return NextResponse.json({
        success: true,
        taskId: memorial.model_generation_task_id,
        provider: memorial.model_generation_provider,
        recovered: true,
      });
    }

    // Check if has 2D image
    if (!memorial.cenotaph_image_url) {
      return NextResponse.json(
        { success: false, error: "Memorial must have a 2D cenotaph image first" },
        { status: 400 }
      );
    }

    // Fetch organization and stories for eligibility check
    if (!memorial.organization_id) {
      return NextResponse.json(
        { success: false, error: "Memorial is not linked to an organization" },
        { status: 400 }
      );
    }

    const { data: organization, error: orgError } = await supabase
      .from("organizations")
      .select("verification_status")
      .eq("id", memorial.organization_id)
      .single();

    if (orgError || !organization) {
      return NextResponse.json(
        { success: false, error: "Organization not found" },
        { status: 404 }
      );
    }

    const { data: stories, error: storiesError } = await supabase
      .from("stories")
      .select("status")
      .eq("organization_id", memorial.organization_id);

    if (storiesError) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch stories" },
        { status: 500 }
      );
    }

    // Check eligibility
    const eligibility = check3DModelEligibility(
      { verification_status: organization.verification_status as VerificationStatus },
      (stories || []).map((s) => ({ status: s.status as StoryStatus })),
      settings
    );

    if (!eligibility.eligible) {
      return NextResponse.json(
        {
          success: false,
          error: "Not eligible for 3D model generation",
          eligibility: {
            eligible: false,
            reasons: eligibility.reasons,
          },
        },
        { status: 403 }
      );
    }

    // Get provider settings
    const providerType = getModel3dProvider(settings) as Model3DProviderType;
    const resolution = getModel3dResolution(settings);
    const polygonCount = getModel3dPolygonCount(settings);

    // Create service and submit task
    const service = new Model3DService(providerType);
    const taskId = await service.submitTask(memorial.cenotaph_image_url, {
      resolution,
      polygonCount,
      outputFormat: "glb",
    });

    // Update memorial with task info
    const { error: updateError } = await supabase
      .from("memorials")
      .update({
        model_generation_status: "pending",
        model_generation_task_id: taskId,
        model_generation_provider: providerType,
      })
      .eq("id", memorialId);

    if (updateError) {
      console.error("[generate-3d] Failed to update memorial:", updateError);
      return NextResponse.json(
        { success: false, error: "Failed to save task status" },
        { status: 500 }
      );
    }

    console.log(`[generate-3d] Started 3D generation for memorial ${memorialId}, task ${taskId}`);

    return NextResponse.json({
      success: true,
      taskId,
      provider: providerType,
    });
  } catch (error) {
    console.error("[generate-3d] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
