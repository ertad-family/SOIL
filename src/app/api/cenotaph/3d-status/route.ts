/**
 * GET /api/cenotaph/3d-status
 * Poll 3D model generation status
 *
 * Issue: #254 - AI Pipeline for 3D Cenotaph Model Generation
 *
 * When status is pending/processing, queries the provider API for updates.
 * When status is success, downloads and stores the model to Supabase.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Model3DService } from "@/lib/cenotaph/model3d";
import type { Model3DProviderType, Model3DGenerationStatus } from "@/lib/cenotaph/model3d";
import type { CenotaphRenderSettings } from "@/components/organization/types";

/**
 * Default render settings for stone/marble cenotaph models
 * These are saved with the 3D model and can be customized per memorial
 */
const DEFAULT_CENOTAPH_RENDER_SETTINGS: CenotaphRenderSettings = {
  material: {
    metalness: 0.1, // Stone is not metallic
    roughness: 0.75, // Stone is matte/rough
    envMapIntensity: 0.8, // Subtle reflections
  },
  environment: "studio", // Neutral studio lighting
  lighting: {
    keyLight: { intensity: 1.8, color: "#e8e8f0" },
    fillLight: { intensity: 0.6, color: "#d0d5e0" },
    rimLight: { intensity: 0.8, color: "#f0f0ff" },
  },
  exposure: 1.1,
};

interface StatusResponse {
  success: boolean;
  status: Model3DGenerationStatus | null;
  modelUrl?: string | null;
  error?: string;
  progress?: number;
}

export async function GET(request: NextRequest): Promise<NextResponse<StatusResponse>> {
  try {
    // Initialize authenticated client
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, status: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get memorial ID from query params
    const { searchParams } = new URL(request.url);
    const memorialId = searchParams.get("memorialId");

    if (!memorialId) {
      return NextResponse.json(
        { success: false, status: null, error: "Memorial ID is required" },
        { status: 400 }
      );
    }

    // Fetch memorial
    const { data: memorial, error: memorialError } = await supabase
      .from("memorials")
      .select(
        `
        id,
        user_id,
        cenotaph_model_url,
        model_generation_status,
        model_generation_task_id,
        model_generation_provider
      `
      )
      .eq("id", memorialId)
      .single();

    if (memorialError || !memorial) {
      return NextResponse.json(
        { success: false, status: null, error: "Memorial not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (memorial.user_id !== user.id) {
      return NextResponse.json(
        { success: false, status: null, error: "Forbidden" },
        { status: 403 }
      );
    }

    // If no generation in progress, return current status
    if (
      !memorial.model_generation_task_id ||
      !memorial.model_generation_provider ||
      memorial.model_generation_status === "success" ||
      memorial.model_generation_status === "failed"
    ) {
      return NextResponse.json({
        success: true,
        status: memorial.model_generation_status as Model3DGenerationStatus | null,
        modelUrl: memorial.cenotaph_model_url,
      });
    }

    // Query provider for latest status
    const service = new Model3DService(memorial.model_generation_provider as Model3DProviderType);
    const taskResult = await service.checkStatus(memorial.model_generation_task_id);

    console.log(
      `[3d-status] Task ${memorial.model_generation_task_id} status: ${taskResult.state}`
    );

    // Handle different states
    if (taskResult.state === "success" && taskResult.modelUrl) {
      // Check if another request is already downloading (prevent race condition)
      if (memorial.model_generation_status === "downloading") {
        console.log(`[3d-status] Download already in progress, skipping`);
        return NextResponse.json({
          success: true,
          status: "downloading",
        });
      }

      // Atomically update status to "downloading" to prevent parallel downloads
      const { error: lockError } = await supabase
        .from("memorials")
        .update({ model_generation_status: "downloading" })
        .eq("id", memorialId)
        .eq("model_generation_status", "processing"); // Only if still processing

      if (lockError) {
        console.log(`[3d-status] Could not acquire download lock, another request is handling it`);
        return NextResponse.json({
          success: true,
          status: "downloading",
        });
      }

      // Download and store the model
      console.log(`[3d-status] Model ready, downloading and storing...`);
      try {
        const storedUrl = await service.downloadAndStore(taskResult.modelUrl, memorialId);

        // Update memorial with final status, model URL, and render settings
        const { error: updateError } = await supabase
          .from("memorials")
          .update({
            model_generation_status: "success",
            cenotaph_model_url: storedUrl,
            cenotaph_render_settings: DEFAULT_CENOTAPH_RENDER_SETTINGS,
            model_generated_at: new Date().toISOString(),
          })
          .eq("id", memorialId);

        if (updateError) {
          console.error("[3d-status] Failed to update memorial:", updateError);
        }

        return NextResponse.json({
          success: true,
          status: "success",
          modelUrl: storedUrl,
        });
      } catch (downloadError) {
        // If download fails, reset status to allow retry
        console.error("[3d-status] Download failed:", downloadError);
        await supabase
          .from("memorials")
          .update({ model_generation_status: "failed" })
          .eq("id", memorialId);

        return NextResponse.json({
          success: true,
          status: "failed",
          error: downloadError instanceof Error ? downloadError.message : "Download failed",
        });
      }
    }

    if (taskResult.state === "failed") {
      // Update memorial with failed status
      await supabase
        .from("memorials")
        .update({
          model_generation_status: "failed",
        })
        .eq("id", memorialId);

      return NextResponse.json({
        success: true,
        status: "failed",
        error: taskResult.error || "Model generation failed",
      });
    }

    // Still processing - update status in DB
    const newStatus = taskResult.state === "pending" ? "pending" : "processing";
    if (memorial.model_generation_status !== newStatus) {
      await supabase
        .from("memorials")
        .update({
          model_generation_status: newStatus,
        })
        .eq("id", memorialId);
    }

    return NextResponse.json({
      success: true,
      status: newStatus,
      progress: taskResult.progress,
    });
  } catch (error) {
    console.error("[3d-status] Error:", error);
    return NextResponse.json(
      {
        success: false,
        status: null,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
