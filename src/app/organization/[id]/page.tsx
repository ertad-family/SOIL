import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OrganizationClient } from './organization-client'
import type {
  StoryStatus,
  ModuleId,
  OrganizationType,
  LifecycleStage,
  VerificationStatus,
} from '@/types/interview'

interface OrganizationData {
  id: string
  slug: string
  name: string
  organization_type: OrganizationType | null
  business_model: string | null
  industry: string | null
  description: string | null
  location_country: string | null
  location_city: string | null
  founded_date: string | null
  closed_date: string | null
  stage_at_closure: LifecycleStage | null
  peak_team_size: number | null
  verification_status: VerificationStatus
  verification_count: number
  is_public: boolean
  created_by: string
  created_at: string
  updated_at: string
}

interface StoryData {
  id: string
  user_id: string
  status: StoryStatus
  current_module: ModuleId
  completed_modules: ModuleId[]
  coined_at: string | null
  created_at: string
  updated_at: string
  // Joined profile data
  profile: {
    display_name: string | null
  } | null
}

interface MemorialData {
  id: string
  slug: string
  epitaph: string | null
  tombstone_style: string
  tombstone_color: string
  views_count: number
  respects_count: number
  cenotaph_image_url: string | null
  design_status: string | null
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function OrganizationPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Check auth
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Fetch organization
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', id)
    .single()

  if (orgError || !organization) {
    notFound()
  }

  // Check if user owns this organization
  const isOwner = organization.created_by === user.id

  // If not owner and not public, deny access
  if (!isOwner && !organization.is_public) {
    notFound()
  }

  // Fetch all stories for this organization
  const { data: stories, error: storiesError } = await supabase
    .from('stories')
    .select(`
      id,
      user_id,
      status,
      current_module,
      completed_modules,
      coined_at,
      created_at,
      updated_at
    `)
    .eq('organization_id', id)
    .order('created_at', { ascending: false })

  // Log any errors for debugging
  if (storiesError) {
    console.error('Stories fetch error:', storiesError)
  }

  // Fetch profile data for story authors
  const userIds = stories?.map(s => s.user_id).filter(Boolean) || []
  const { data: profiles } = userIds.length > 0
    ? await supabase
        .from('profiles')
        .select('id, display_name')
        .in('id', userIds)
    : { data: [] }

  // Map profiles to stories
  const profileMap = new Map(profiles?.map(p => [p.id, p]) || [])
  const storiesWithProfiles = stories?.map(story => ({
    ...story,
    profile: profileMap.get(story.user_id) || null,
  })) || []

  // Fetch memorial/cenotaph if exists
  const { data: memorial } = await supabase
    .from('memorials')
    .select('id, slug, epitaph, tombstone_style, tombstone_color, views_count, respects_count, cenotaph_image_url, design_status')
    .eq('organization_id', id)
    .single()

  // Fetch current user's profile and story for verification modal
  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', user.id)
    .single()

  const { data: currentUserStory } = await supabase
    .from('stories')
    .select('founder_role, author_role')
    .eq('organization_id', id)
    .eq('user_id', user.id)
    .single()

  const currentUserData = {
    name: currentUserProfile?.display_name || user.email?.split('@')[0] || 'Unknown',
    role: currentUserStory?.author_role || currentUserStory?.founder_role || null,
  }

  return (
    <OrganizationClient
      organization={organization as OrganizationData}
      stories={storiesWithProfiles as StoryData[]}
      memorial={memorial as MemorialData | null}
      currentUserId={user.id}
      currentUserData={currentUserData}
      isOwner={isOwner}
    />
  )
}
