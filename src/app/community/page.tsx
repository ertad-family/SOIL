'use client'

import {
  CommunityHeroSection,
  FoundersRoleSection,
  ResearchersRoleSection,
  KeepersRoleSection,
  ContributorsRoleSection,
  GiversRoleSection,
  ContributionWaysSection,
  EventsSection,
  CommunityJoinSection,
} from '@/components/sections/community'
import { CommunityTestimonialsSection } from '@/components/sections/CommunityTestimonialsSection'

/**
 * Community page.
 * Header, Footer, MenuTransition, and GlobalParticles are provided by AppShell.
 */
export default function CommunityPage() {
  return (
    <>
      <CommunityHeroSection />
      <FoundersRoleSection />
      <ResearchersRoleSection />
      <KeepersRoleSection />
      <ContributorsRoleSection />
      <GiversRoleSection />
      <ContributionWaysSection />
      <EventsSection />
      <CommunityTestimonialsSection />
      <CommunityJoinSection />
    </>
  )
}
