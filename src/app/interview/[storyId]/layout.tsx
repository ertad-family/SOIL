'use client'

import * as React from 'react'
import { InterviewProvider } from '@/contexts/InterviewContext'

interface InterviewLayoutProps {
  children: React.ReactNode
  params: Promise<{ storyId: string }>
}

/**
 * Layout for interview wizard pages.
 * Wraps all module pages with InterviewProvider for shared state.
 */
export default function InterviewLayout({
  children,
  params,
}: InterviewLayoutProps) {
  const [storyId, setStoryId] = React.useState<string | null>(null)

  React.useEffect(() => {
    params.then(p => setStoryId(p.storyId))
  }, [params])

  if (!storyId) {
    return null
  }

  return (
    <InterviewProvider storyId={storyId}>
      {children}
    </InterviewProvider>
  )
}
