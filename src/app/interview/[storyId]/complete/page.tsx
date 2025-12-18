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
  Calendar,
  Users,
  Layers,
  FileText,
  ArrowRight,
  Home,
} from 'lucide-react'
import { ORG_TYPE_LABELS } from '@/data/function-matrix'

/**
 * Story Coined - Completion/Celebration Page (Dark Theme)
 */
export default function CompletePage() {
  const router = useRouter()
  const { story, isLoading } = useInterview()

  if (isLoading || !story) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  // If story is not coined, redirect to overview
  if (story.status !== 'coined') {
    router.push(`/interview/${story.id}`)
    return null
  }

  const orgName = story.basicInfo.organizationName || 'Your Organization'
  const orgType = story.basicInfo.organizationType
    ? ORG_TYPE_LABELS[story.basicInfo.organizationType]
    : null

  // Calculate stats
  const lifespanMonths = (() => {
    if (!story.basicInfo.foundedDate || !story.basicInfo.closedDate) return null
    const founded = new Date(story.basicInfo.foundedDate)
    const closed = new Date(story.basicInfo.closedDate)
    const months = (closed.getFullYear() - founded.getFullYear()) * 12 +
      (closed.getMonth() - founded.getMonth())
    return months
  })()

  const formatLifespan = (months: number | null): string => {
    if (!months) return 'Unknown'
    if (months < 12) return `${months} months`
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''}`
    return `${years} year${years > 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`
  }

  const functionsCount = story.functionalMapping.functions.filter(f => f.isActive).length
  const eventsCount =
    (story.financialPicture.events?.length || 0) +
    (story.dynamicPicture.events?.length || 0) +
    (story.environment.events?.length || 0) +
    (story.founderContext.events?.length || 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Celebration header */}
        <div className="text-center mb-12">
          {/* Checkmark animation */}
          <div className="w-24 h-24 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-gold-500/30 animate-in zoom-in duration-500">
            <Check className="h-12 w-12 text-white" />
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-marble-100 mb-4">
            Your Story is Coined
          </h1>

          <p className="text-lg text-slate-400">
            Thank you for honoring <span className="font-medium text-gold-400">{orgName}</span> with this memorial.
          </p>
        </div>

        {/* Stats card */}
        <Card variant="dark" className="p-6 mb-8">
          <h2 className="font-serif text-lg font-medium text-marble-100 mb-4 text-center">
            Story Summary
          </h2>

          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-2">
                <Calendar className="h-6 w-6 text-gold-400" />
              </div>
              <p className="text-2xl font-semibold text-marble-100">
                {formatLifespan(lifespanMonths)}
              </p>
              <p className="text-sm text-slate-400">Lifespan</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="h-6 w-6 text-gold-400" />
              </div>
              <p className="text-2xl font-semibold text-marble-100">
                {story.basicInfo.peakTeamSize || '—'}
              </p>
              <p className="text-sm text-slate-400">Peak team size</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-2">
                <Layers className="h-6 w-6 text-gold-400" />
              </div>
              <p className="text-2xl font-semibold text-marble-100">
                {functionsCount}
              </p>
              <p className="text-sm text-slate-400">Functions mapped</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-2">
                <FileText className="h-6 w-6 text-gold-400" />
              </div>
              <p className="text-2xl font-semibold text-marble-100">
                {eventsCount}
              </p>
              <p className="text-sm text-slate-400">Events recorded</p>
            </div>
          </div>
        </Card>

        {/* Affirmation */}
        <div className="text-center mb-8 p-6 bg-slate-800/50 rounded-lg border border-slate-700">
          <p className="text-slate-300 italic">
            &ldquo;Every venture that closes makes room for what comes next — for you,
            and for everyone who learns from your experience.&rdquo;
          </p>
        </div>

        {/* What's next */}
        <div className="space-y-4">
          <h3 className="font-medium text-marble-100 text-center mb-4">
            What&apos;s Next?
          </h3>

          <Card variant="dark" className="p-4 opacity-60">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-slate-400">🏛️</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-marble-100">Create Cenotaph</h4>
                <p className="text-sm text-slate-400">
                  Build a visual memorial for your organization
                </p>
              </div>
              <span className="text-xs text-slate-500 px-2 py-1 bg-slate-700 rounded">
                Coming Soon
              </span>
            </div>
          </Card>

          <Link href={`/interview/${story.id}`}>
            <Card variant="dark" className="p-4 hover:border-gold-500/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gold-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-gold-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-marble-100">Review Your Story</h4>
                  <p className="text-sm text-slate-400">
                    Look back at what you&apos;ve documented
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-500" />
              </div>
            </Card>
          </Link>

          <Link href="/interview">
            <Card variant="dark" className="p-4 hover:border-gold-500/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <Home className="h-5 w-5 text-slate-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-marble-100">Return to Dashboard</h4>
                  <p className="text-sm text-slate-400">
                    Start another story or view all your stories
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-500" />
              </div>
            </Card>
          </Link>
        </div>

        {/* Footer message */}
        <p className="mt-12 text-center text-sm text-slate-500">
          Every ending deserves dignity. Thank you for being part of SOIL.
        </p>
      </div>
    </div>
  )
}
