"use client";

import {
  MemorialsHeroSection,
  GlobeSection,
  FeaturedStoriesSection,
  GetInvolvedSection,
  MemorialsCTASection,
} from "@/components/sections/memorials";
import {
  mockCenotapheries,
  globalStats,
  sidePanelStats,
  featuredStories,
} from "@/data/mock-cenotapheries";

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
      <GlobeSection markers={mockCenotapheries} globalStats={sidePanelStats} />

      {/* Featured stories from cenotaphs */}
      <FeaturedStoriesSection stories={featuredStories} />

      {/* CTA to create cenotaph */}
      <MemorialsCTASection />

      {/* Roman separator */}
      <div className="divider-roman py-12 md:py-16 bg-slate-950">
        <span className="text-gold-400 font-serif text-sm tracking-[0.3em] px-6">✦</span>
      </div>

      {/* Get Involved - appeal to future Keepers */}
      <GetInvolvedSection />
    </>
  );
}
