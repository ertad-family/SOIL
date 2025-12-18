/**
 * POST /api/cenotaph/generate
 * Generate AI cenotaph design options
 * Issue: #23 Cenotaph creation wizard
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { buildCenotaphPrompt, validateUserPrompt } from '@/lib/cenotaph/prompt-builder'
import {
  generateCenotaphDesigns,
  processAndUploadDesigns,
  estimateCost
} from '@/lib/cenotaph/gemini'
import type {
  GenerateDesignRequest,
  GenerateDesignResponse,
  OrganizationContext,
  StoryContext
} from '@/types/cenotaph'

// Initialize Supabase client with service role for storage operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest): Promise<NextResponse<GenerateDesignResponse>> {
  try {
    // Parse request body
    const body: GenerateDesignRequest = await request.json()
    const { memorialId, userPrompt } = body

    if (!memorialId) {
      return NextResponse.json(
        { success: false, error: 'Memorial ID is required' },
        { status: 400 }
      )
    }

    // Validate user prompt
    const validation = validateUserPrompt(userPrompt)
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }

    // Fetch memorial with organization and story data
    const { data: memorial, error: memorialError } = await supabase
      .from('memorials')
      .select(`
        id,
        slug,
        organization_name,
        organization_type,
        epitaph,
        main_lesson,
        closure_type,
        design_status,
        cenotaph_design,
        organization_id,
        story_id
      `)
      .eq('id', memorialId)
      .single()

    if (memorialError || !memorial) {
      return NextResponse.json(
        { success: false, error: 'Memorial not found' },
        { status: 404 }
      )
    }

    // Check if already generating
    if (memorial.design_status === 'generating') {
      return NextResponse.json(
        { success: false, error: 'Design generation already in progress', status: 'generating' },
        { status: 409 }
      )
    }

    // Fetch organization data if available
    let organization: OrganizationContext = {
      name: memorial.organization_name,
      type: memorial.organization_type,
      industry: null,
      foundedDate: null,
      closedDate: null,
      peakTeamSize: null,
      location: null
    }

    if (memorial.organization_id) {
      const { data: orgData } = await supabase
        .from('organizations')
        .select('name, organization_type, industry, founded_date, closed_date, peak_team_size, location_country, location_city')
        .eq('id', memorial.organization_id)
        .single()

      if (orgData) {
        organization = {
          name: orgData.name,
          type: orgData.organization_type,
          industry: orgData.industry,
          foundedDate: orgData.founded_date,
          closedDate: orgData.closed_date,
          peakTeamSize: orgData.peak_team_size,
          location: [orgData.location_city, orgData.location_country].filter(Boolean).join(', ') || null
        }
      }
    }

    // Fetch story narrative data if available
    let story: StoryContext = {
      epitaph: memorial.epitaph,
      mainLesson: memorial.main_lesson,
      closureType: memorial.closure_type,
      keyEvents: []
    }

    if (memorial.story_id) {
      const { data: storyData } = await supabase
        .from('stories')
        .select('narrative')
        .eq('id', memorial.story_id)
        .single()

      if (storyData?.narrative) {
        const narrative = storyData.narrative
        story = {
          epitaph: narrative.epitaph || memorial.epitaph,
          mainLesson: narrative.mainLesson || memorial.main_lesson,
          closureType: narrative.closureType || memorial.closure_type,
          keyEvents: narrative.keyEvents || []
        }
      }
    }

    // Update status to generating
    await supabase
      .from('memorials')
      .update({
        design_status: 'generating',
        user_design_prompt: userPrompt || null,
        design_metadata: {
          attempts: 1,
          lastError: null,
          modelUsed: 'imagen-4.0-generate-001',
          costEstimate: estimateCost(3),
          generatedAt: new Date().toISOString()
        }
      })
      .eq('id', memorialId)

    // Build prompts for 3 variations
    const prompts = [0, 1, 2].map(i =>
      buildCenotaphPrompt(organization, story, userPrompt, i)
    )

    // Generate designs
    console.log(`Generating cenotaph designs for memorial ${memorialId}...`)
    const designs = await generateCenotaphDesigns(prompts, memorialId)

    if (designs.length === 0) {
      // Update status to failed
      await supabase
        .from('memorials')
        .update({
          design_status: 'failed',
          design_metadata: {
            attempts: 1,
            lastError: 'Failed to generate any design options',
            modelUsed: 'imagen-4.0-generate-001',
            costEstimate: 0,
            generatedAt: new Date().toISOString()
          }
        })
        .eq('id', memorialId)

      return NextResponse.json(
        { success: false, error: 'Failed to generate design options. Please try again.' },
        { status: 500 }
      )
    }

    // Upload designs to storage and get public URLs
    console.log(`Uploading ${designs.length} designs to storage...`)
    const processedDesigns = await processAndUploadDesigns(supabase, memorialId, designs)

    // Get existing options and append new ones
    const existingOptions = memorial.cenotaph_design?.options || []
    const allOptions = [...existingOptions, ...processedDesigns]

    // Update memorial with combined design options
    await supabase
      .from('memorials')
      .update({
        design_status: 'options_ready',
        cenotaph_design: {
          options: allOptions,
          selectedId: memorial.cenotaph_design?.selectedId || null
        },
        design_metadata: {
          attempts: (memorial.cenotaph_design?.options?.length || 0) / 3 + 1,
          lastError: null,
          modelUsed: 'imagen-4.0-generate-001',
          costEstimate: estimateCost(allOptions.length),
          generatedAt: new Date().toISOString()
        }
      })
      .eq('id', memorialId)

    console.log(`Generated ${processedDesigns.length} new designs. Total: ${allOptions.length} options`)

    return NextResponse.json({
      success: true,
      options: allOptions,
      newOptions: processedDesigns,
      status: 'options_ready'
    })

  } catch (error) {
    console.error('Cenotaph generation error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      },
      { status: 500 }
    )
  }
}
