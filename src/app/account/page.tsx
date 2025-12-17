import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AccountClient } from './account-client'
import type { StoryStatus, ModuleId, OrganizationType } from '@/types/interview'

interface StoryData {
  id: string
  status: StoryStatus
  current_module: ModuleId
  completed_modules: ModuleId[]
  basic_info: {
    organizationName: string
    organizationType: OrganizationType | null
    description: string
    foundedDate: string | null
    closedDate: string | null
  }
  created_at: string
  updated_at: string
  coined_at: string | null
}

// For now, memorials are separate - later we'll link them to stories
interface MemorialData {
  id: string
  slug: string
  organization_name: string
  story_id: string | null
}

export default async function AccountPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Fetch user's stories (organizations)
  const { data: stories } = await supabase
    .from('stories')
    .select('id, status, current_module, completed_modules, basic_info, created_at, updated_at, coined_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  // Fetch user's memorials (cenotaphs) - for now separate, will link later
  const { data: memorials } = await supabase
    .from('memorials')
    .select('id, slug, organization_name, story_id')
    .eq('user_id', user.id)

  // Get profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <AccountClient
      user={{
        id: user.id,
        email: user.email || '',
        name: profile?.display_name || user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
        avatarUrl: profile?.avatar_url,
      }}
      stories={(stories as StoryData[]) || []}
      memorials={(memorials as MemorialData[]) || []}
    />
  )
}
