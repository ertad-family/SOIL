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

      {/* Cenotaphery Entry */}
      <section className="py-16 md:py-24 border-t border-slate-800">
        <div className="max-w-content mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Cenotaphery Card */}
            <a
              href="/memorials/cenotaphery"
              className="group relative block p-8 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-gold-500/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
              <div className="relative">
                <p className="text-gold-500 text-sm font-sans uppercase tracking-widest mb-2">
                  [ explore ]
                </p>
                <h2 className="font-display text-2xl font-semibold tracking-wide text-marble-100 mb-3">
                  Federal Cenotaphery
                </h2>
                <p className="text-slate-400 mb-4">
                  Enter the pentagonal memorial chamber. 1,225 niches arranged across 8 levels, each awaiting the story of an organization.
                </p>
                <div className="flex items-center text-gold-500 group-hover:text-gold-400 transition-colors">
                  <span className="text-sm font-sans">Enter 3D Space</span>
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </div>
            </a>

            {/* Coming Soon Card */}
            <div className="p-8 bg-slate-900/30 border border-slate-800/50 rounded-lg opacity-60">
              <p className="text-slate-500 text-sm font-sans uppercase tracking-widest mb-2">
                [ coming soon ]
              </p>
              <h2 className="font-display text-2xl font-semibold tracking-wide text-marble-400 mb-3">
                Create a Cenotaph
              </h2>
              <p className="text-slate-500">
                Honor your organization with a digital memorial. Share your story, preserve your lessons, help others learn.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
