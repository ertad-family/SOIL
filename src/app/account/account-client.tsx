'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SwitchWithLabel } from '@/components/ui/switch'
import {
  Plus,
  Building2,
  FileText,
  Calendar,
  ExternalLink,
  Settings,
  ChevronRight,
  CheckCircle2,
  Clock,
  Landmark,
} from 'lucide-react'
import type {
  StoryStatus,
  ModuleId,
  OrganizationType,
  VerificationStatus,
} from '@/types/interview'
import { MODULES } from '@/types/interview'

interface AccountUser {
  id: string
  email: string
  name: string
  avatarUrl?: string
}

interface OrganizationData {
  id: string
  slug: string
  name: string
  organization_type: OrganizationType | null
  description: string | null
  founded_date: string | null
  closed_date: string | null
  verification_status: VerificationStatus
  is_public: boolean
}

interface StoryData {
  id: string
  organization_id: string
  status: StoryStatus
  current_module: ModuleId
  completed_modules: ModuleId[]
  created_at: string
  updated_at: string
  coined_at: string | null
  organization: OrganizationData
}

interface MemorialData {
  id: string
  slug: string
  organization_id: string | null
}

interface AccountClientProps {
  user: AccountUser
  stories: StoryData[]
  memorials: MemorialData[]
}

const ORG_TYPE_LABELS: Record<OrganizationType, string> = {
  tech_product: 'Tech Product',
  services: 'Services',
  ecommerce: 'E-commerce',
  manufacturing: 'Manufacturing',
  ngo: 'NGO',
  media: 'Media',
}

export function AccountClient({ user, stories, memorials }: AccountClientProps) {
  const [notifications, setNotifications] = useState({
    newRespects: true,
    newCondolences: true,
    weeklyDigest: false,
  })

  // Categorize stories
  const inProgressStories = stories.filter(s => s.status === 'draft' || s.status === 'in_progress')
  const coinedStories = stories.filter(s => s.status === 'coined')

  // Find which organizations have cenotaphs
  const getMemorialForOrganization = (organizationId: string) =>
    memorials.find(m => m.organization_id === organizationId)

  const stats = {
    totalOrganizations: stories.length,
    inProgress: inProgressStories.length,
    coined: coinedStories.length,
    cenotaphs: memorials.length,
  }

  return (
    <DashboardLayout
      variant="dark"
      pageTitle={`Welcome, ${user.name}`}
      pageDescription="Manage your organizations and cenotaphs"
      pageActions={
        <a href="/interview">
          <Button variant="dark-primary" size="sm" rightIcon={<Plus className="w-4 h-4" />}>
            Share Your Story
          </Button>
        </a>
      }
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card variant="dark">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-marble-100">
                  {stats.totalOrganizations}
                </p>
                <p className="text-sm text-slate-400">Organizations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="dark">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-marble-100">
                  {stats.inProgress}
                </p>
                <p className="text-sm text-slate-400">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="dark">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-marble-100">
                  {stats.coined}
                </p>
                <p className="text-sm text-slate-400">Stories Coined</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="dark">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                <Landmark className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-marble-100">
                  {stats.cenotaphs}
                </p>
                <p className="text-sm text-slate-400">Cenotaphs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Organizations Tabs */}
      <Card variant="dark">
        <CardHeader>
          <CardTitle variant="dark">My Organizations</CardTitle>
          <CardDescription variant="dark">
            Your organizational stories and their cenotaphs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="in_progress">
            <TabsList variant="dark">
              <TabsTrigger value="in_progress" variant="dark">
                In Progress ({inProgressStories.length})
              </TabsTrigger>
              <TabsTrigger value="coined" variant="dark">
                Coined ({coinedStories.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="in_progress" variant="dark" className="mt-6">
              {inProgressStories.length === 0 ? (
                <EmptyState
                  icon={<FileText className="w-12 h-12" />}
                  title="No stories in progress"
                  description="Start sharing your organization's story to preserve its legacy"
                  actionLabel="Share Your Story"
                  actionHref="/interview"
                />
              ) : (
                <div className="space-y-4">
                  {inProgressStories.map((story) => (
                    <StoryCard key={story.id} story={story} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="coined" variant="dark" className="mt-6">
              {coinedStories.length === 0 ? (
                <EmptyState
                  icon={<CheckCircle2 className="w-12 h-12" />}
                  title="No coined stories yet"
                  description="Complete an interview to coin your organization's story"
                  actionLabel="Continue Interview"
                  actionHref="/interview"
                />
              ) : (
                <div className="space-y-4">
                  {coinedStories.map((story) => (
                    <CoinedStoryCard
                      key={story.id}
                      story={story}
                      memorial={getMemorialForOrganization(story.organization_id)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card variant="dark" className="mt-8">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
              <Settings className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <CardTitle variant="dark">Account Settings</CardTitle>
              <CardDescription variant="dark">{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-marble-100 mb-4">Email Notifications</h4>
              <div className="space-y-4">
                <SwitchWithLabel
                  variant="dark"
                  label="New respects"
                  description="Get notified when someone pays respect to your cenotaph"
                  checked={notifications.newRespects}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, newRespects: checked }))
                  }
                />
                <SwitchWithLabel
                  variant="dark"
                  label="New condolences"
                  description="Get notified when someone leaves a condolence message"
                  checked={notifications.newCondolences}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, newCondolences: checked }))
                  }
                />
                <SwitchWithLabel
                  variant="dark"
                  label="Weekly digest"
                  description="Receive a weekly summary of activity on your cenotaphs"
                  checked={notifications.weeklyDigest}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, weeklyDigest: checked }))
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

// Empty state component
function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: React.ReactNode
  title: string
  description: string
  actionLabel: string
  actionHref: string
}) {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-4">
        {icon}
      </div>
      <h3 className="font-display text-lg font-medium text-marble-100 mb-2">
        {title}
      </h3>
      <p className="text-slate-400 mb-6">{description}</p>
      <a href={actionHref}>
        <Button variant="dark-primary" rightIcon={<Plus className="w-4 h-4" />}>
          {actionLabel}
        </Button>
      </a>
    </div>
  )
}

// Story card for in-progress stories
function StoryCard({ story }: { story: StoryData }) {
  const progress = Math.round((story.completed_modules.length / MODULES.length) * 100)
  const org = story.organization
  const orgName = org?.name || 'Untitled Organization'
  const orgType = org?.organization_type
    ? ORG_TYPE_LABELS[org.organization_type]
    : null

  return (
    <div className="p-4 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-display text-lg font-medium text-marble-100">
              {orgName}
            </h3>
            <Badge variant="dark-outline" size="sm">
              {story.status === 'draft' ? 'Draft' : 'In Progress'}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-3">
            {orgType && (
              <span className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {orgType}
              </span>
            )}
            {org?.founded_date && org?.closed_date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {org.founded_date} - {org.closed_date}
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm text-slate-400">{progress}%</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {story.completed_modules.length} of {MODULES.length} modules complete
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a href={`/interview/${story.id}`}>
            <Button variant="dark-primary" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
              Continue
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}

// Coined story card with cenotaph status
function CoinedStoryCard({
  story,
  memorial
}: {
  story: StoryData
  memorial?: MemorialData
}) {
  const org = story.organization
  const orgName = org?.name || 'Untitled Organization'
  const orgType = org?.organization_type
    ? ORG_TYPE_LABELS[org.organization_type]
    : null
  const hasCenotaph = !!memorial

  return (
    <div className="p-4 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-display text-lg font-medium text-marble-100">
              {orgName}
            </h3>
            <Badge variant="dark-success" size="sm">
              Story Coined
            </Badge>
            {hasCenotaph && (
              <Badge variant="dark-outline" size="sm">
                <Landmark className="w-3 h-3 mr-1" />
                Cenotaph
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            {orgType && (
              <span className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {orgType}
              </span>
            )}
            {org?.founded_date && org?.closed_date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {org.founded_date} - {org.closed_date}
              </span>
            )}
            {story.coined_at && (
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Coined {new Date(story.coined_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasCenotaph ? (
            <a href={`/memorials/${memorial.slug}`}>
              <Button variant="dark-secondary" size="sm" rightIcon={<ExternalLink className="w-4 h-4" />}>
                View Cenotaph
              </Button>
            </a>
          ) : (
            <a href={`/create?story=${story.id}`}>
              <Button variant="dark-primary" size="sm" rightIcon={<Landmark className="w-4 h-4" />}>
                Create Cenotaph
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
