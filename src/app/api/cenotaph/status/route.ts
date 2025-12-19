/**
 * GET /api/cenotaph/status?memorialId=xxx
 * Get design generation status for a memorial
 * Issue: #23 Cenotaph creation wizard
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { DesignStatusResponse, CenotaphDesign, DesignStatus } from '@/types/cenotaph'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest): Promise<NextResponse<DesignStatusResponse>> {
  try {
    const { searchParams } = new URL(request.url)
    const memorialId = searchParams.get('memorialId')

    if (!memorialId) {
      return NextResponse.json(
        {
          status: 'not_started',
          options: null,
          selectedId: null,
          imageUrl: null,
          error: 'Memorial ID is required'
        },
        { status: 400 }
      )
    }

    const { data: memorial, error } = await supabase
      .from('memorials')
      .select('design_status, cenotaph_design, cenotaph_image_url')
      .eq('id', memorialId)
      .single()

    if (error || !memorial) {
      return NextResponse.json(
        {
          status: 'not_started',
          options: null,
          selectedId: null,
          imageUrl: null,
          error: 'Memorial not found'
        },
        { status: 404 }
      )
    }

    const design = memorial.cenotaph_design as CenotaphDesign | null

    return NextResponse.json({
      status: (memorial.design_status || 'not_started') as DesignStatus,
      options: design?.options || null,
      selectedId: design?.selectedId || null,
      imageUrl: memorial.cenotaph_image_url || null
    })

  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      {
        status: 'failed',
        options: null,
        selectedId: null,
        imageUrl: null,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      },
      { status: 500 }
    )
  }
}
