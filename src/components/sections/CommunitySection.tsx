'use client'

import { useState } from 'react'
import { Users, Shield, Code, GraduationCap } from 'lucide-react'
import { SectionLabel } from '@/components/ui/section-label'

const communityFeatures = [
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Founders',
    description:
      'Peer support, shared experiences, and consulting from those who understand the journey.',
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: 'Researchers',
    description:
      'Global community of academics and analysts exploring organizational patterns through our research datasets.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Keepers',
    description:
      'Local leaders and guardians who nurture regional communities and preserve organizational memories.',
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: 'Contributors',
    description:
      'Join our open source community. Earn Respects, build your portfolio, and shape the platform that serves founders worldwide.',
  },
]

export function CommunitySection() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="py-16 md:py-24 bg-marble-900">
      <div className="max-w-content mx-auto px-6">
        {/* Header: Two columns */}
        <div className="grid lg:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-8 mb-16">
          {/* Left: Label + Title */}
          <div>
            {/*<SectionLabel>community</SectionLabel>*/}
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium mt-4 text-marble-100 leading-tight">
              The Heart of SOIL: building together
            </h2>
          </div>

          {/* Right: Large outline text + description */}
          <div>
            {/* Large outline "SOIL" text */}
            <span
              aria-hidden="true"
              className="font-display text-6xl md:text-7xl lg:text-8xl font-medium select-none leading-none [color:transparent] [-webkit-text-stroke:1.5px_rgba(226,176,85,0.3)]"
            >
              COMMUNITY
            </span>
            <p className="text-marble-100 text-lg leading-relaxed mt-4">
              Our success is measured by the strength of our community. Together, we transform
              individual efforts into collective wisdom that benefits future generations.
            </p>
          </div>
        </div>

      </div>

      {/* Content: Full-width left image, contained right tabs */}
      <div className="grid lg:grid-cols-2 gap-6 min-h-[500px]">
        {/* Left: Image placeholder (full width to edge) */}
        <div className="relative rounded-r-2xl overflow-hidden bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border border-slate-700/50 border-l-0">
          {/* Placeholder content - can be replaced with actual images */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400">
                {communityFeatures[activeIndex].icon}
              </div>
              <h3 className="font-display text-2xl font-medium text-marble-100 mb-2">
                {communityFeatures[activeIndex].title}
              </h3>
              <p className="text-slate-400 text-lg max-w-sm mx-auto">
                {communityFeatures[activeIndex].description}
              </p>
            </div>
          </div>
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none" />
        </div>

        {/* Right: Feature cards (tabs) - contained */}
        <div className="flex flex-col gap-4 px-6 lg:pl-0 lg:pr-[max(1.5rem,calc((100vw-1200px)/2+1.5rem))]">
          {communityFeatures.map((feature, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`text-left p-6 rounded-xl border transition-all duration-300 ${
                activeIndex === index
                  ? 'bg-slate-800/80 border-gold-500/50 border-l-[3px] border-l-gold-500'
                  : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600/50'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    activeIndex === index
                      ? 'bg-gold-500/20 text-gold-400'
                      : 'bg-slate-700/50 text-slate-400'
                  }`}
                >
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-display text-lg font-medium text-marble-100 mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-slate-400 text-lg leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
