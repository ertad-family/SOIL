'use client'

import {
  MemorialsHeroSection,
  GlobeSection,
  FeaturedStoriesSection,
  MemorialsCTASection,
} from '@/components/sections/memorials'
import { mockCenotapheries, globalStats, featuredStories } from '@/data/mock-cenotapheries'

/**
 * Memorials page - Global memorial with interactive 3D globe navigation
 *
 * Features:
 * - Hero section with animated statistics
 * - Interactive 3D globe with cenotaphery markers
 * - Side panel with memorial details
 * - Featured stories section
 * - CTA for creating cenotaphs
 *
 * Header, Footer, MenuTransition, and GlobalParticles are provided by AppShell.
 */
export default function MemorialsPage() {
  return (
    <>
      {/* Hero with title and animated stats */}
      <MemorialsHeroSection stats={globalStats} />

      {/* Interactive 3D Globe with markers */}
      <GlobeSection markers={mockCenotapheries} globalStats={globalStats} />

      {/* Featured stories from cenotaphs */}
      <FeaturedStoriesSection stories={featuredStories} />

      {/* CTA to create cenotaph */}
      <MemorialsCTASection />
    </>
  )
}
