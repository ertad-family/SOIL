'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useInterview } from '@/contexts/InterviewContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { ChevronLeft, Construction } from 'lucide-react'

/**
 * Module 3: Dynamic Picture (Placeholder)
 * TODO: Implement pattern-based questions and internal events timeline
 */
export default function DynamicPage() {
  const router = useRouter()
  const { story, isLoading, completeModule } = useInterview()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleComplete = async () => {
    setIsSubmitting(true)
    try {
      await completeModule('dynamic')
      router.push(`/interview/${story?.id}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || !story) {
    return (
      <div className="min-h-screen bg-marble-gradient flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-marble-gradient">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => router.push(`/interview/${story.id}`)}
          className="inline-flex items-center text-sm text-marble-600 hover:text-marble-900 mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Overview
        </button>

        <Card className="p-8 text-center">
          <Construction className="h-16 w-16 mx-auto text-gold-500 mb-4" />
          <h1 className="font-serif text-2xl font-semibold text-marble-950 mb-2">
            Dynamic Picture
          </h1>
          <p className="text-marble-600 mb-6">
            This module will capture the degradation story from peak to closure,
            including pattern-based questions and internal events timeline.
          </p>
          <p className="text-sm text-marble-500 mb-8">
            Full implementation coming soon. For now, you can mark this module as complete to continue.
          </p>

          <div className="flex justify-center gap-4">
            <Button
              variant="secondary"
              onClick={() => router.push(`/interview/${story.id}`)}
            >
              Return to Overview
            </Button>
            <Button
              variant="primary"
              onClick={handleComplete}
              isLoading={isSubmitting}
            >
              Mark as Complete
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
