/**
 * POST /api/cenotaph/select
 * Select a design option as the final cenotaph
 * Also saves the selected concept to the catalog for future diversity
 * Issue: #23 Cenotaph creation wizard
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { SelectDesignRequest, SelectDesignResponse, CenotaphDesign, DesignConcept } from '@/types/cenotaph'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest): Promise<NextResponse<SelectDesignResponse>> {
  try {
    const body: SelectDesignRequest = await request.json()
    const { memorialId, selectedDesignId } = body

    if (!memorialId || !selectedDesignId) {
      return NextResponse.json(
        { success: false, error: 'Memorial ID and selected design ID are required' },
        { status: 400 }
      )
    }

    // Fetch memorial with design options and organization data
    const { data: memorial, error: fetchError } = await supabase
      .from('memorials')
      .select(`
        id,
        design_status,
        cenotaph_design,
        organization_type,
        organization:organizations (
          organization_type,
          industry
        )
      `)
      .eq('id', memorialId)
      .single()

    if (fetchError || !memorial) {
      return NextResponse.json(
        { success: false, error: 'Memorial not found' },
        { status: 404 }
      )
    }

    if (memorial.design_status !== 'options_ready') {
      return NextResponse.json(
        { success: false, error: 'No design options available to select' },
        { status: 400 }
      )
    }

    const design = memorial.cenotaph_design as CenotaphDesign | null
    if (!design?.options || design.options.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No design options found' },
        { status: 400 }
      )
    }

    // Find selected design
    const selectedDesign = design.options.find(opt => opt.id === selectedDesignId)
    if (!selectedDesign) {
      return NextResponse.json(
        { success: false, error: 'Selected design not found in options' },
        { status: 400 }
      )
    }

    // Find the concept that generated this design
    let selectedConcept: DesignConcept | undefined

    // First check if design has conceptId reference
    if (selectedDesign.conceptId) {
      // Look for concept in pendingConcepts or try to reconstruct from design data
      const allConcepts = design.pendingConcepts || []
      selectedConcept = allConcepts.find(c => c.id === selectedDesign.conceptId)
    }

    // If concept found, save to catalog for future diversity
    if (selectedConcept || selectedDesign.prompt) {
      const orgData = memorial.organization as { organization_type?: string; industry?: string } | null

      const conceptToSave = {
        memorial_id: memorialId,
        concept_title: selectedConcept?.title || 'Untitled Concept',
        concept_description: selectedConcept?.description || selectedDesign.prompt || '',
        style_keywords: selectedConcept?.styleKeywords || [],
        organization_type: orgData?.organization_type || memorial.organization_type,
        industry: orgData?.industry
      }

      // Save to used concepts catalog (async, non-blocking)
      supabase
        .from('used_cenotaph_concepts')
        .insert(conceptToSave)
        .then(({ error }) => {
          if (error) {
            console.error('Failed to save concept to catalog:', error)
          } else {
            console.log(`Saved concept "${conceptToSave.concept_title}" to catalog`)
          }
        })
    }

    // Update memorial with selection (keep only selected option, clear pending concepts)
    const { error: updateError } = await supabase
      .from('memorials')
      .update({
        design_status: 'completed',
        cenotaph_image_url: selectedDesign.url,
        cenotaph_design: {
          options: [selectedDesign],
          selectedId: selectedDesignId,
          selectedConcept: selectedConcept,
          pendingConcepts: []  // Clear pending concepts
        }
      })
      .eq('id', memorialId)

    if (updateError) {
      console.error('Failed to update memorial:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to save selection' },
        { status: 500 }
      )
    }

    // Clean up unselected images from storage (async, non-blocking)
    const unselectedOptions = design.options.filter(opt => opt.id !== selectedDesignId)
    if (unselectedOptions.length > 0) {
      const filesToDelete = unselectedOptions
        .map(opt => {
          // Extract path from URL: .../cenotaph-designs/memorialId/filename.png
          const match = opt.url.match(/cenotaph-designs\/(.+)$/)
          return match ? match[1] : null
        })
        .filter((path): path is string => path !== null)

      if (filesToDelete.length > 0) {
        console.log(`Cleaning up ${filesToDelete.length} unselected designs...`)
        supabase.storage
          .from('cenotaph-designs')
          .remove(filesToDelete)
          .then(({ error }) => {
            if (error) {
              console.error('Failed to clean up some files:', error)
            } else {
              console.log(`Successfully deleted ${filesToDelete.length} unselected designs`)
            }
          })
      }
    }

    return NextResponse.json({
      success: true,
      imageUrl: selectedDesign.url
    })

  } catch (error) {
    console.error('Design selection error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      },
      { status: 500 }
    )
  }
}
