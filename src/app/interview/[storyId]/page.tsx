'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useInterview } from '@/contexts/InterviewContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import {
  Check,
  Circle,
  ArrowRight,
  ChevronLeft,
  Clock,
  Building2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { MODULES, type ModuleId } from '@/types/interview'
import { ORG_TYPE_LABELS } from '@/data/function-matrix'

/**
 * Story Overview Dashboard
 * Shows completion progress and allows navigation to modules.
 */
export default function StoryOverviewPage() {
  const router = useRouter()
  const {
    story,
    isLoading,
    error,
    progress,
    isModuleComplete,
    canNavigateToModule,
    navigateToModule,
  } = useInterview()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-marble-gradient flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-marble-gradient flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="font-serif text-xl font-medium text-marble-900 mb-2">
            Story Not Found
          </h2>
          <p className="text-marble-600 mb-4">
            {error || 'Unable to load this story.'}
          </p>
          <Button variant="primary" onClick={() => router.push('/interview')}>
            Return to Stories
          </Button>
        </Card>
      </div>
    )
  }

  const orgName = story.basicInfo.organizationName || 'Your Story'
  const orgType = story.basicInfo.organizationType
  const orgTypeLabel = orgType ? ORG_TYPE_LABELS[orgType] : null

  // Find the next incomplete module
  const nextIncompleteModule = MODULES.find(m => !isModuleComplete(m.id))

  // Calculate total estimated time remaining
  const remainingMinutes = MODULES
    .filter(m => !isModuleComplete(m.id))
    .reduce((sum, m) => sum + m.estimatedMinutes, 0)

  const handleContinue = () => {
    if (nextIncompleteModule) {
      navigateToModule(nextIncompleteModule.id)
    }
  }

  return (
    <div className="min-h-screen bg-marble-gradient">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/interview"
          className="inline-flex items-center text-sm text-marble-600 hover:text-marble-900 mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          All Stories
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-marble-950 tracking-wide">
                {orgName}
              </h1>
              {orgTypeLabel && (
                <p className="mt-1 text-marble-600 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {orgTypeLabel}
                </p>
              )}
            </div>

            {/* Status badge */}
            {story.status === 'coined' ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success-100 text-success-700">
                <Check className="h-4 w-4 mr-1" />
                Story Coined
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gold-100 text-gold-700">
                In Progress
              </span>
            )}
          </div>
        </div>

        {/* Progress summary */}
        {story.status !== 'coined' && (
          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-medium text-marble-900">Your Progress</h2>
                <p className="text-sm text-marble-600">
                  {story.completedModules.length} of {MODULES.length} modules complete
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-gold-600">{progress}%</p>
                {remainingMinutes > 0 && (
                  <p className="text-sm text-marble-500 flex items-center justify-end gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    ~{remainingMinutes} min remaining
                  </p>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-marble-200 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gold-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Continue button */}
            {nextIncompleteModule && (
              <Button
                variant="primary"
                size="lg"
                onClick={handleContinue}
                className="w-full"
              >
                Continue: {nextIncompleteModule.name}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </Card>
        )}

        {/* Coined celebration */}
        {story.status === 'coined' && (
          <Card className="p-6 mb-8 bg-gradient-to-br from-gold-50 to-marble-50 border-gold-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-gold-600" />
              </div>
              <h2 className="font-serif text-xl font-medium text-marble-900 mb-2">
                Your Story is Coined
              </h2>
              <p className="text-marble-600 mb-4">
                Thank you for preserving the legacy of {orgName}.
                Your experience will help others learn and grow.
              </p>
              <Button
                variant="primary"
                onClick={() => router.push(`/interview/${story.id}/complete`)}
              >
                View Summary
              </Button>
            </div>
          </Card>
        )}

        {/* Module list */}
        <div className="space-y-3">
          <h2 className="font-medium text-marble-900 mb-4">Modules</h2>

          {MODULES.map((module, index) => {
            const isComplete = isModuleComplete(module.id)
            const canNavigate = canNavigateToModule(module.id)
            const isCurrent = story.currentModule === module.id

            return (
              <button
                key={module.id}
                onClick={() => canNavigate && navigateToModule(module.id)}
                disabled={!canNavigate}
                className={cn(
                  'w-full text-left p-4 rounded-lg border transition-all',
                  canNavigate
                    ? 'hover:border-gold-300 hover:shadow-sm cursor-pointer'
                    : 'cursor-not-allowed opacity-60',
                  isComplete
                    ? 'bg-success-50 border-success-200'
                    : isCurrent
                      ? 'bg-gold-50 border-gold-300'
                      : 'bg-white border-marble-200'
                )}
              >
                <div className="flex items-center gap-4">
                  {/* Step number / check */}
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                      isComplete
                        ? 'bg-success-500 text-white'
                        : isCurrent
                          ? 'bg-gold-500 text-white'
                          : 'bg-marble-200 text-marble-600'
                    )}
                  >
                    {isComplete ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>

                  {/* Module info */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={cn(
                        'font-medium',
                        isComplete ? 'text-success-700' : 'text-marble-900'
                      )}
                    >
                      {module.name}
                    </h3>
                    <p className="text-sm text-marble-600 truncate">
                      {module.description}
                    </p>
                  </div>

                  {/* Time estimate */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-marble-500">
                      ~{module.estimatedMinutes} min
                    </p>
                  </div>

                  {/* Arrow */}
                  {canNavigate && (
                    <ArrowRight
                      className={cn(
                        'h-5 w-5 flex-shrink-0',
                        isComplete ? 'text-success-400' : 'text-marble-400'
                      )}
                    />
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Help text */}
        <p className="mt-8 text-center text-sm text-marble-500">
          Your progress is saved automatically. You can return anytime to continue.
        </p>
      </div>
    </div>
  )
}
