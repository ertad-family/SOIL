/**
 * POST /api/cenotaph/generate-titles
 * Generate short artistic titles for design options that don't have them
 * Uses Gemini 2.0 Flash (cheap & fast) to create painting-like titles
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { generateDesignTitle } from "@/lib/cenotaph/gemini";
import type { DesignOption } from "@/types/cenotaph";

// Service client bypasses RLS for admin operations
const serviceSupabase = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface GenerateTitlesRequest {
  memorialId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateTitlesRequest = await request.json();
    const { memorialId } = body;

    if (!memorialId) {
      return NextResponse.json(
        { success: false, error: "Memorial ID is required" },
        { status: 400 }
      );
    }

    // Auth check
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

    // Fetch memorial with design options
    const { data: memorial, error: fetchError } = await serviceSupabase
      .from("memorials")
      .select("id, user_id, cenotaph_design")
      .eq("id", memorialId)
      .single();

    if (fetchError || !memorial) {
      console.error("Failed to fetch memorial:", fetchError);
      return NextResponse.json({ success: false, error: "Memorial not found" }, { status: 404 });
    }

    // Verify ownership
    if (memorial.user_id !== user.id) {
      return NextResponse.json(
        { success: false, error: "You don't have permission to modify this memorial" },
        { status: 403 }
      );
    }

    // Check if there are options without titles
    const cenotaphDesign = memorial.cenotaph_design as {
      options: DesignOption[];
      selectedId: string | null;
    } | null;

    if (!cenotaphDesign?.options || cenotaphDesign.options.length === 0) {
      return NextResponse.json({ success: true, options: [], message: "No design options found" });
    }

    // Find options without titles
    const optionsWithoutTitles = cenotaphDesign.options.filter(
      (opt) => !opt.title || opt.title.trim() === ""
    );

    if (optionsWithoutTitles.length === 0) {
      // All options already have titles
      return NextResponse.json({
        success: true,
        options: cenotaphDesign.options,
        message: "All options already have titles",
      });
    }

    console.log(`Generating titles for ${optionsWithoutTitles.length} design options...`);

    // Generate titles for options that don't have them
    const updatedOptions = [...cenotaphDesign.options];

    for (const option of optionsWithoutTitles) {
      const title = await generateDesignTitle(option.prompt);
      if (title) {
        const optionIndex = updatedOptions.findIndex((o) => o.id === option.id);
        if (optionIndex !== -1) {
          updatedOptions[optionIndex] = { ...updatedOptions[optionIndex], title };
        }
      }
    }

    // Update the database with generated titles
    const { error: updateError } = await serviceSupabase
      .from("memorials")
      .update({
        cenotaph_design: {
          ...cenotaphDesign,
          options: updatedOptions,
        },
      })
      .eq("id", memorialId);

    if (updateError) {
      console.error("Failed to update design titles:", updateError);
      return NextResponse.json(
        { success: false, error: "Failed to save generated titles" },
        { status: 500 }
      );
    }

    console.log("Successfully generated and saved design titles");

    return NextResponse.json({
      success: true,
      options: updatedOptions,
    });
  } catch (error) {
    console.error("Generate titles API error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
