/**
 * POST /api/cenotaph/generate
 * Generate AI cenotaph design options using two-step creative process:
 * 1. Gemini generates 9 unique creative concepts
 * 2. Imagen renders first 3 (or next 3 from pending) as images
 *
 * Issue: #23 Cenotaph creation wizard
 * Security: #78 - Added authentication and ownership verification
 * Cost control: #234 - Limited to MAX_GENERATIONS per memorial
 */

// Base generation limit per memorial (cost control)
// Each generation = 3 images ≈ $0.12, base limit 2 = max 6 designs ≈ $0.24 per memorial
// Bonus attempts can be earned: +1 for verified organization, +1 for coined story
const BASE_GENERATIONS = 2;

import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { buildOrganizationContext, validateUserPrompt } from "@/lib/cenotaph/prompt-builder";
import {
  generateCreativeConcepts,
  generateImagesFromConcepts,
  processAndUploadDesigns,
  estimateCost,
  type GenerationProgressCallback,
} from "@/lib/cenotaph/gemini";
import type {
  GenerateDesignRequest,
  GenerateDesignResponse,
  OrganizationContext,
  StoryContext,
  DesignConcept,
} from "@/types/cenotaph";

// Service role client for storage operations only
const serviceSupabase = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest): Promise<NextResponse<GenerateDesignResponse>> {
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
    const body: GenerateDesignRequest = await request.json();
    const { memorialId, userPrompt } = body;

    if (!memorialId) {
      return NextResponse.json(
        { success: false, error: "Memorial ID is required" },
        { status: 400 }
      );
    }

    // Validate user prompt
    const validation = validateUserPrompt(userPrompt);
    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    // Fetch memorial with organization and story data, including user_id for ownership check
    const { data: memorial, error: memorialError } = await supabase
      .from("memorials")
      .select(
        `
        id,
        slug,
        user_id,
        organization_name,
        organization_type,
        epitaph,
        main_lesson,
        closure_type,
        design_status,
        cenotaph_design,
        design_metadata,
        organization_id,
        story_id,
        cenotaphery_id
      `
      )
      .eq("id", memorialId)
      .single();

    if (memorialError || !memorial) {
      return NextResponse.json({ success: false, error: "Memorial not found" }, { status: 404 });
    }

    // Verify ownership - user must own the memorial
    if (memorial.user_id !== user.id) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    // Check generation limit (cost control - Issue #234)
    // Use Math.floor to handle any legacy float values in DB
    const currentAttempts = Math.floor(memorial.design_metadata?.attempts || 0);
    // Calculate max generations: base + bonus attempts (from verification/coined story)
    const bonusAttempts = Math.floor(memorial.design_metadata?.bonusAttempts || 0);
    const maxGenerations = BASE_GENERATIONS + bonusAttempts;

    if (currentAttempts >= maxGenerations) {
      return NextResponse.json(
        {
          success: false,
          error: `Maximum design generations reached (${maxGenerations}). You have used all available generation attempts.`,
          attemptsUsed: currentAttempts,
          maxAttempts: maxGenerations,
        },
        { status: 429 }
      );
    }

    // Check if already generating
    if (memorial.design_status === "generating") {
      return NextResponse.json(
        { success: false, error: "Design generation already in progress", status: "generating" },
        { status: 409 }
      );
    }

    // Fetch organization data if available
    let organization: OrganizationContext = {
      name: memorial.organization_name,
      type: memorial.organization_type,
      industry: null,
      foundedDate: null,
      closedDate: null,
      peakTeamSize: null,
      location: null,
    };

    if (memorial.organization_id) {
      const { data: orgData } = await supabase
        .from("organizations")
        .select(
          "name, organization_type, industry, founded_date, closed_date, peak_team_size, location_country, location_city"
        )
        .eq("id", memorial.organization_id)
        .single();

      if (orgData) {
        organization = {
          name: orgData.name,
          type: orgData.organization_type,
          industry: orgData.industry,
          foundedDate: orgData.founded_date,
          closedDate: orgData.closed_date,
          peakTeamSize: orgData.peak_team_size,
          location:
            [orgData.location_city, orgData.location_country].filter(Boolean).join(", ") || null,
        };
      }
    }

    // Fetch story narrative data if available
    let story: StoryContext = {
      epitaph: memorial.epitaph,
      mainLesson: memorial.main_lesson,
      closureType: memorial.closure_type,
      keyEvents: [],
    };

    if (memorial.story_id) {
      const { data: storyData } = await supabase
        .from("stories")
        .select("narrative, ai_summary")
        .eq("id", memorial.story_id)
        .single();

      if (storyData) {
        const narrative = storyData.narrative;
        const aiSummary = storyData.ai_summary;

        story = {
          epitaph: narrative?.epitaph || memorial.epitaph,
          mainLesson: narrative?.mainLesson || memorial.main_lesson,
          closureType: narrative?.closureType || memorial.closure_type,
          keyEvents: narrative?.keyEvents || [],
          // Include AI-generated summary for richer context
          aiSummary: aiSummary
            ? {
                text: aiSummary.text || null,
                keyFacts: aiSummary.keyFacts || [],
                closurePattern: aiSummary.closurePattern || null,
              }
            : null,
        };
      }
    }

    // Fetch cenotaphery data for regional character in design (Issue #233)
    let cenotapheryLocation: string | null = null;
    if (memorial.cenotaphery_id) {
      const { data: cenotapheryData } = await supabase
        .from("cenotapheries")
        .select("name, location, level")
        .eq("id", memorial.cenotaphery_id)
        .single();

      if (cenotapheryData) {
        // Build location context string
        cenotapheryLocation = cenotapheryData.location;
        console.log(
          `Cenotaphery: ${cenotapheryData.name} (${cenotapheryData.level} level, location: ${cenotapheryData.location})`
        );
      }
    }

    // Update status to generating
    await supabase
      .from("memorials")
      .update({
        design_status: "generating",
        user_design_prompt: userPrompt || null,
      })
      .eq("id", memorialId);

    // Check if we have pending concepts to render
    let pendingConcepts: DesignConcept[] = memorial.cenotaph_design?.pendingConcepts || [];
    let conceptsToRender: DesignConcept[];
    let remainingConcepts: DesignConcept[];

    if (pendingConcepts.length >= 3) {
      // Use existing pending concepts
      console.log(`Using ${pendingConcepts.length} pending concepts...`);
      conceptsToRender = pendingConcepts.slice(0, 3);
      remainingConcepts = pendingConcepts.slice(3);
    } else {
      // Generate new concepts
      console.log("Generating new creative concepts...");

      // Update progress: concepts stage
      const { error: conceptsProgressError } = await supabase
        .from("memorials")
        .update({
          design_metadata: {
            ...(memorial.design_metadata || {}),
            attempts: currentAttempts,
            generation_progress: { stage: "concepts", current: 0, total: 3 },
          },
        })
        .eq("id", memorialId);

      if (conceptsProgressError) {
        console.error("Failed to update concepts progress:", conceptsProgressError);
      }

      // Fetch all previously used concepts to avoid repetition
      const { data: usedConcepts } = await supabase
        .from("used_cenotaph_concepts")
        .select("concept_title, concept_description, style_keywords")
        .order("created_at", { ascending: false })
        .limit(100); // Get last 100 used concepts

      // Build organization context for concept generation (including cenotaphery location for regional character)
      const orgContext = buildOrganizationContext(
        organization,
        story,
        userPrompt,
        cenotapheryLocation
      );

      // Generate 9 unique concepts
      const allConcepts = await generateCreativeConcepts(orgContext, usedConcepts || []);

      if (allConcepts.length === 0) {
        await supabase
          .from("memorials")
          .update({
            design_status: "failed",
            design_metadata: {
              attempts: 1,
              lastError: "Failed to generate creative concepts",
              modelUsed: "gemini-2.5-flash",
              costEstimate: 0,
              generatedAt: new Date().toISOString(),
            },
          })
          .eq("id", memorialId);

        return NextResponse.json(
          { success: false, error: "Failed to generate creative concepts. Please try again." },
          { status: 500 }
        );
      }

      conceptsToRender = allConcepts.slice(0, 3);
      remainingConcepts = allConcepts.slice(3);
      console.log(
        `Generated ${allConcepts.length} concepts. Rendering first 3, saving ${remainingConcepts.length} for later.`
      );
    }

    // Progress callback to update DB with real-time progress
    const updateProgress: GenerationProgressCallback = async (stage, current, total) => {
      const progressData = {
        ...(memorial.design_metadata || {}),
        attempts: currentAttempts,
        generation_progress: { stage, current, total },
      };

      const { error: updateError } = await supabase
        .from("memorials")
        .update({ design_metadata: progressData })
        .eq("id", memorialId);

      if (updateError) {
        console.error("Failed to update progress:", updateError);
      }
    };

    // Generate images from the first 3 concepts
    console.log(`Generating images for ${conceptsToRender.length} concepts...`);
    const designs = await generateImagesFromConcepts(conceptsToRender, memorialId, updateProgress);

    if (designs.length === 0) {
      await supabase
        .from("memorials")
        .update({
          design_status: "failed",
          design_metadata: {
            attempts: 1,
            lastError: "Failed to generate any images",
            modelUsed: "imagen-4.0-generate-001",
            costEstimate: 0,
            generatedAt: new Date().toISOString(),
          },
        })
        .eq("id", memorialId);

      return NextResponse.json(
        { success: false, error: "Failed to generate design images. Please try again." },
        { status: 500 }
      );
    }

    // Upload designs to storage
    console.log(`Uploading ${designs.length} designs to storage...`);
    const processedDesigns = await processAndUploadDesigns(serviceSupabase, memorialId, designs);

    // Get existing options and append new ones
    const existingOptions = memorial.cenotaph_design?.options || [];
    const allOptions = [...existingOptions, ...processedDesigns];

    // Calculate new attempts count (increment by 1 for each generation batch)
    const newAttemptsCount = currentAttempts + 1;

    // Update memorial with design options and pending concepts
    await supabase
      .from("memorials")
      .update({
        design_status: "options_ready",
        cenotaph_design: {
          options: allOptions,
          selectedId: memorial.cenotaph_design?.selectedId || null,
          pendingConcepts: remainingConcepts, // Save remaining concepts for "Generate More"
        },
        design_metadata: {
          attempts: newAttemptsCount, // Increment attempts count
          lastError: null,
          modelUsed: "imagen-4.0-generate-001",
          costEstimate: estimateCost(allOptions.length),
          generatedAt: new Date().toISOString(),
          pendingConceptsCount: remainingConcepts.length,
        },
      })
      .eq("id", memorialId);

    console.log(
      `Generated ${processedDesigns.length} new designs. Total: ${allOptions.length} options. Pending concepts: ${remainingConcepts.length}. Attempts: ${newAttemptsCount}/${maxGenerations}`
    );

    return NextResponse.json({
      success: true,
      options: allOptions,
      newOptions: processedDesigns,
      status: "options_ready",
      attemptsUsed: newAttemptsCount,
      maxAttempts: maxGenerations,
    });
  } catch (error) {
    console.error("Cenotaph generation error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
