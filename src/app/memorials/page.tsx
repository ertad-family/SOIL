'use client'

import { SectionLabel } from '@/components/ui/section-label'

/**
 * Memorials page - Digital cenotaphs for organizations that have ended.
 * Header, Footer, MenuTransition, and GlobalParticles are provided by AppShell.
 */
export default function MemorialsPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="max-w-content mx-auto px-6">
          <SectionLabel>memorials</SectionLabel>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-wide mt-4 mb-6 text-marble-100">
            Digital Cenotaphs
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl">
            A sacred space honoring organizations that have completed their journey. Each memorial preserves their legacy and lessons for future generations.
          </p>
        </div>
      </section>

      {/* Placeholder */}
      <section className="py-16 md:py-24 border-t border-slate-800">
        <div className="max-w-content mx-auto px-6 text-center">
          <p className="text-slate-500 italic">Memorial cemetery visualization coming soon...</p>
        </div>
      </section>
    </>
  )
}
