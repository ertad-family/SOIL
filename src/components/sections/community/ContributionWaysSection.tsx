'use client'

import { SectionLabel } from '@/components/ui/section-label'
import { ContributionWidget } from '@/components/ui/contribution-widget'

export function ContributionWaysSection() {
  return (
    <>
      {/* Gradient transition into section */}
      <div className="h-16 bg-gradient-to-b from-slate-900 to-marble-950" />

      <section id="contribution" className="py-16 md:py-24 bg-marble-950">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-12">
            <SectionLabel>all ways to contribute</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
              Support SOIL Your Way
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Every contribution matters. Whether you invest social capital, time, knowledge, or money —
              you help preserve organizational wisdom for future generations.
            </p>
          </div>

          <ContributionWidget />
        </div>
      </section>

      {/* Gradient transition out of section */}
      <div className="h-16 bg-gradient-to-b from-marble-950 to-slate-900" />

      {/* Decorative divider */}
      <div className="divider-roman py-8">
        <span className="text-gold-400 text-lg px-6">✦</span>
      </div>
    </>
  )
}
