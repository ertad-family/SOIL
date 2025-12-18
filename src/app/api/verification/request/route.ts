import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Types for request body
interface VerificationContact {
  email: string
  name?: string
  relationship: 'colleague' | 'customer' | 'supplier' | 'partner' | 'investor' | 'other'
  details?: string
}

interface CreateVerificationRequestBody {
  organizationId: string
  contacts: VerificationContact[]
}

// POST /api/verification/request - Create verification requests
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse body
    const body: CreateVerificationRequestBody = await request.json()
    const { organizationId, contacts } = body

    if (!organizationId || !contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json(
        { error: 'organizationId and contacts array are required' },
        { status: 400 }
      )
    }

    // Validate contacts (max 10)
    if (contacts.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 contacts allowed per request' },
        { status: 400 }
      )
    }

    // Check organization ownership
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('id, created_by, name')
      .eq('id', organizationId)
      .single()

    if (orgError || !organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    if (organization.created_by !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Create verification requests
    const requestsToInsert = contacts.map(contact => ({
      organization_id: organizationId,
      requester_id: user.id,
      verifier_email: contact.email.toLowerCase().trim(),
      verifier_name: contact.name?.trim() || null,
      relationship: contact.relationship,
      relationship_details: contact.details?.trim() || null,
    }))

    const { data: createdRequests, error: insertError } = await supabase
      .from('verification_requests')
      .insert(requestsToInsert)
      .select()

    if (insertError) {
      // Handle duplicate email error
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'Some contacts have already been invited for this organization' },
          { status: 409 }
        )
      }
      console.error('Failed to create verification requests:', insertError)
      return NextResponse.json({ error: 'Failed to create requests' }, { status: 500 })
    }

    // TODO: Send verification emails to contacts
    // For now, just return the created requests

    return NextResponse.json({
      success: true,
      requests: createdRequests,
      message: `${createdRequests?.length || 0} verification request(s) created`,
    })
  } catch (err) {
    console.error('Verification request error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/verification/request?organizationId=xxx - Get verification requests for organization
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')

    if (!organizationId) {
      return NextResponse.json({ error: 'organizationId is required' }, { status: 400 })
    }

    // Check organization ownership
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('id, created_by')
      .eq('id', organizationId)
      .single()

    if (orgError || !organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    if (organization.created_by !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get verification requests
    const { data: requests, error: requestsError } = await supabase
      .from('verification_requests')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })

    if (requestsError) {
      console.error('Failed to fetch verification requests:', requestsError)
      return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 })
    }

    return NextResponse.json({ requests })
  } catch (err) {
    console.error('Verification GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
