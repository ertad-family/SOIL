/**
 * POST /api/cenotaph/select
 * Select a design option as the final cenotaph
 * Issue: #23 Cenotaph creation wizard
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { SelectDesignRequest, SelectDesignResponse, CenotaphDesign } from '@/types/cenotaph'

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

    // Fetch memorial with design options
    const { data: memorial, error: fetchError } = await supabase
      .from('memorials')
      .select('id, design_status, cenotaph_design')
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

    // Update memorial with selection
    const { error: updateError } = await supabase
      .from('memorials')
      .update({
        design_status: 'completed',
        cenotaph_image_url: selectedDesign.url,
        cenotaph_design: {
          ...design,
          selectedId: selectedDesignId
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
