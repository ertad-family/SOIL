'use client'

import { CommunityTestimonialsSection } from '@/components/sections/CommunityTestimonialsSection'
import { PageLayout } from '@/components/layout/PageLayout'

export default function CommunityPage() {
  return (
    <PageLayout currentSection="community">
      <main>
        <CommunityTestimonialsSection />
      </main>
    </PageLayout>
  )
}
