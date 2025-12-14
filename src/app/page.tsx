'use client'

import {
  HeroSection,
  MissionsSection,
  MethodologySection,
  PartnersSection,
  CommunitySection,
  TestimonialsSliderSection,
  ScopeSection,
  GetInvolvedSection,
} from '@/components/sections'

/**
 * Home page - Landing page for SOIL.
 * Header, Footer, MenuTransition, and GlobalParticles are provided by AppShell.
 */
export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <MissionsSection />
      <MethodologySection />
      <PartnersSection />
      <CommunitySection />
      <TestimonialsSliderSection />

      {/* Decorative divider between Testimonials and Ecosystem */}
      <div className="divider-roman py-12 md:py-16">
        <span className="text-gold-400 font-serif text-sm tracking-[0.3em] px-6">✦</span>
      </div>

      <ScopeSection />
      <GetInvolvedSection />
    </>
  )
}
