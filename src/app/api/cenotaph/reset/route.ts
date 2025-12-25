/**
 * POST /api/cenotaph/reset
 * Reset a stuck generation to allow retry
 *
 * Issue: Cenotaph wizard recovery from stuck state
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

// Service client bypasses RLS for admin operations
const serviceSupabase = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ResetRequest {
  memorialId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ResetRequest = await request.json();
    const { memorialId } = body;

    if (!memorialId) {
      return NextResponse.json(
        { success: false, error: "Memorial ID is required" },
        { status: 400 }
      );
    }

    // Auth check - get current user
    const supabase = await createClient();
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

    // Verify ownership - fetch memorial (has user_id directly)
    const { data: memorial, error: fetchError } = await serviceSupabase
      .from("memorials")
      .select("id, user_id, design_status, design_metadata")
      .eq("id", memorialId)
      .single();

    if (fetchError || !memorial) {
      console.error("Failed to fetch memorial:", fetchError);
      return NextResponse.json({ success: false, error: "Memorial not found" }, { status: 404 });
    }

    // Check ownership - memorial has user_id directly
    if (memorial.user_id !== user.id) {
      return NextResponse.json(
        { success: false, error: "You don't have permission to modify this memorial" },
        { status: 403 }
      );
    }

    // Only allow reset if status is "generating" or "failed"
    if (memorial.design_status !== "generating" && memorial.design_status !== "failed") {
      return NextResponse.json(
        { success: false, error: "Generation is not in a stuck state" },
        { status: 400 }
      );
    }

    // Reset the design status to "not_started"
    // Valid values: "not_started" | "generating" | "options_ready" | "completed" | "failed"
    const { error: updateError } = await serviceSupabase
      .from("memorials")
      .update({
        design_status: "not_started",
        design_metadata: {
          ...(memorial.design_metadata || {}),
          lastError: null,
          generation_progress: null,
        },
      })
      .eq("id", memorialId);

    if (updateError) {
      console.error("Failed to reset generation:", updateError);
      return NextResponse.json(
        { success: false, error: "Failed to reset generation status" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset API error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
