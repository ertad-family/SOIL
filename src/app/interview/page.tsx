'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Plus, FileText, ChevronRight, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StoryListItem, ModuleId } from '@/types/interview'
import { MODULES, calculateProgress } from '@/types/interview'
import { ORG_TYPE_LABELS } from '@/data/function-matrix'

/**
 * Interview Dashboard - Lists user's stories and allows creating new ones
 */
export default function InterviewPage() {
  const router = useRouter()
  const supabase = createClient()

  const [stories, setStories] = React.useState<StoryListItem[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isCreating, setIsCreating] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Load user's stories
  React.useEffect(() => {
    async function loadStories() {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          router.push('/login?redirect=/interview')
          return
        }

        const { data, error: fetchError } = await supabase
          .from('stories')
          .select(`
            id,
            status,
            current_module,
            completed_modules,
            basic_info,
            created_at,
            updated_at,
            coined_at
          `)
          .eq('user_id', user.id)
          .neq('status', 'archived')
          .order('updated_at', { ascending: false })

        if (fetchError) {
          throw new Error(fetchError.message)
        }

        const transformedStories: StoryListItem[] = (data || []).map(story => ({
          id: story.id,
          status: story.status,
          organizationName: story.basic_info?.organizationName || null,
          organizationType: story.basic_info?.organizationType || null,
          currentModule: story.current_module,
          completedModules: story.completed_modules || [],
          createdAt: story.created_at,
          updatedAt: story.updated_at,
          coinedAt: story.coined_at,
        }))

        setStories(transformedStories)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stories')
      } finally {
        setIsLoading(false)
      }
    }

    loadStories()
  }, [supabase, router])

  // Create new story
  const handleCreateStory = async () => {
    setIsCreating(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login?redirect=/interview')
        return
      }

      const { data, error: insertError } = await supabase
        .from('stories')
        .insert({
          user_id: user.id,
        })
        .select('id')
        .single()

      if (insertError) {
        throw new Error(insertError.message)
      }

      if (data?.id) {
        router.push(`/interview/${data.id}/basic-info`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create story')
      setIsCreating(false)
    }
  }

  // Format relative time
  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-marble-200 text-marble-700">
            Draft
          </span>
        )
      case 'in_progress':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gold-100 text-gold-700">
            In Progress
          </span>
        )
      case 'coined':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-100 text-success-700">
            Coined
          </span>
        )
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-marble-gradient flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-marble-gradient">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-semibold text-marble-950 tracking-wide">
            Your Stories
          </h1>
          <p className="mt-2 text-marble-600">
            Document your organizational journey and preserve its legacy.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-md text-error-700">
            {error}
          </div>
        )}

        {/* Create new story button */}
        <Button
          variant="primary"
          size="lg"
          onClick={handleCreateStory}
          disabled={isCreating}
          isLoading={isCreating}
          className="mb-8"
        >
          <Plus className="h-5 w-5 mr-2" />
          Start a New Story
        </Button>

        {/* Stories list */}
        {stories.length === 0 ? (
          <Card className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-marble-400 mb-4" />
            <h3 className="font-serif text-lg font-medium text-marble-900 mb-2">
              No stories yet
            </h3>
            <p className="text-marble-600 mb-6">
              Begin documenting your first organizational story.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {stories.map(story => {
              const progress = calculateProgress(story.completedModules as ModuleId[])
              const orgTypeLabel = story.organizationType
                ? ORG_TYPE_LABELS[story.organizationType]
                : null

              return (
                <Link
                  key={story.id}
                  href={`/interview/${story.id}`}
                  className="block"
                >
                  <Card
                    className={cn(
                      'p-4 hover:shadow-md transition-shadow cursor-pointer',
                      'border border-marble-200 hover:border-gold-300'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-medium text-marble-900 truncate">
                            {story.organizationName || 'Untitled Story'}
                          </h3>
                          {getStatusBadge(story.status)}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-marble-500">
                          {orgTypeLabel && (
                            <span>{orgTypeLabel}</span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {formatRelativeTime(story.updatedAt)}
                          </span>
                        </div>

                        {/* Progress bar */}
                        {story.status !== 'coined' && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs text-marble-500 mb-1">
                              <span>{progress}% complete</span>
                              <span>
                                {story.completedModules.length} of {MODULES.length} modules
                              </span>
                            </div>
                            <div className="h-1.5 bg-marble-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gold-500 transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <ChevronRight className="h-5 w-5 text-marble-400 ml-4 flex-shrink-0" />
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
