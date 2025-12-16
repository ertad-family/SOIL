import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AccountClient } from './account-client'

interface MemorialData {
  id: string
  slug: string
  organization_name: string
  organization_type: string
  epitaph: string | null
  founded_date: string | null
  closed_date: string | null
  status: string
  views_count: number
  respects_count: number
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

  // Fetch user's memorials (cenotaphs) from Supabase
  const { data: memorials } = await supabase
    .from('memorials')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

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
      memorials={(memorials as MemorialData[]) || []}
    />
  )
}
