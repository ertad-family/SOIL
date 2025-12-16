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
  Eye,
  Heart,
  Building2,
  FileText,
  Calendar,
  ExternalLink,
  Settings,
} from 'lucide-react'

interface AccountUser {
  id: string
  email: string
  name: string
  avatarUrl?: string
}

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

interface AccountClientProps {
  user: AccountUser
  memorials: MemorialData[]
}

export function AccountClient({ user, memorials }: AccountClientProps) {
  const [notifications, setNotifications] = useState({
    newRespects: true,
    newCondolences: true,
    weeklyDigest: false,
  })

  const publishedMemorials = memorials.filter((m) => m.status === 'published')
  const draftMemorials = memorials.filter((m) => m.status === 'draft')

  const stats = {
    totalMemorials: publishedMemorials.length,
    totalViews: memorials.reduce((acc, m) => acc + (m.views_count || 0), 0),
    totalRespects: memorials.reduce((acc, m) => acc + (m.respects_count || 0), 0),
    drafts: draftMemorials.length,
  }

  return (
    <DashboardLayout
      variant="dark"
      pageTitle={`Welcome, ${user.name}`}
      pageDescription="Manage your cenotaphs and account settings"
      pageActions={
        <a href="/create">
          <Button variant="dark-primary" size="sm" rightIcon={<Plus className="w-4 h-4" />}>
            New Cenotaph
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
                  {stats.totalMemorials}
                </p>
                <p className="text-sm text-slate-400">Cenotaphs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="dark">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                <Eye className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-marble-100">
                  {stats.totalViews.toLocaleString()}
                </p>
                <p className="text-sm text-slate-400">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="dark">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                <Heart className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-marble-100">
                  {stats.totalRespects.toLocaleString()}
                </p>
                <p className="text-sm text-slate-400">Respects</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="dark">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-marble-100">
                  {stats.drafts}
                </p>
                <p className="text-sm text-slate-400">Drafts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cenotaphs Tabs */}
      <Card variant="dark">
        <CardHeader>
          <CardTitle variant="dark">My Cenotaphs</CardTitle>
          <CardDescription variant="dark">
            Manage your digital memorials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="published">
            <TabsList variant="dark">
              <TabsTrigger value="published" variant="dark">
                Published ({publishedMemorials.length})
              </TabsTrigger>
              <TabsTrigger value="drafts" variant="dark">
                Drafts ({draftMemorials.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="published" variant="dark" className="mt-6">
              {publishedMemorials.length === 0 ? (
                <EmptyState
                  icon={<Building2 className="w-12 h-12" />}
                  title="No published cenotaphs"
                  description="Create your first cenotaph to honor an organization"
                  actionLabel="Create Cenotaph"
                  actionHref="/create"
                />
              ) : (
                <div className="space-y-4">
                  {publishedMemorials.map((memorial) => (
                    <MemorialCard key={memorial.id} memorial={memorial} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="drafts" variant="dark" className="mt-6">
              {draftMemorials.length === 0 ? (
                <EmptyState
                  icon={<FileText className="w-12 h-12" />}
                  title="No drafts"
                  description="Start creating a cenotaph and save it as a draft"
                  actionLabel="Start New"
                  actionHref="/create"
                />
              ) : (
                <div className="space-y-4">
                  {draftMemorials.map((memorial) => (
                    <MemorialCard key={memorial.id} memorial={memorial} isDraft />
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

// Memorial card component
function MemorialCard({
  memorial,
  isDraft = false,
}: {
  memorial: MemorialData
  isDraft?: boolean
}) {
  return (
    <div className="p-4 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-display text-lg font-medium text-marble-100">
              {memorial.organization_name}
            </h3>
            <Badge variant={isDraft ? 'dark-outline' : 'dark-success'} size="sm">
              {isDraft ? 'Draft' : 'Published'}
            </Badge>
          </div>

          {memorial.epitaph && (
            <p className="text-slate-400 text-sm mb-3 line-clamp-2">
              {memorial.epitaph}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {memorial.founded_date} - {memorial.closed_date}
            </span>
            {!isDraft && (
              <>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {memorial.views_count.toLocaleString()} views
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {memorial.respects_count.toLocaleString()} respects
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isDraft ? (
            <a href={`/create?edit=${memorial.id}`}>
              <Button variant="dark-primary" size="sm">
                Continue Editing
              </Button>
            </a>
          ) : (
            <a href={`/memorials/${memorial.slug}`}>
              <Button variant="dark-secondary" size="sm" rightIcon={<ExternalLink className="w-4 h-4" />}>
                View
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
