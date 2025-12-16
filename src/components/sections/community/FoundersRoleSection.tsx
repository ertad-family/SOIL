'use client'

import { SectionLabel } from '@/components/ui/section-label'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, Landmark, Heart, DollarSign, RefreshCw } from 'lucide-react'

// Custom SVG illustration for Founders
function FoundersIllustrationSVG() {
  return (
    <svg viewBox="0 0 300 300" className="w-full h-full" fill="none">
      {/* Memorial/Temple structure - representing cenotaph */}
      <g>
        {/* Base platform */}
        <rect x="60" y="220" width="180" height="12" fill="rgba(196,161,90,0.2)" stroke="rgba(196,161,90,0.4)" strokeWidth="1" />
        <rect x="75" y="208" width="150" height="12" fill="rgba(196,161,90,0.15)" stroke="rgba(196,161,90,0.3)" strokeWidth="1" />

        {/* Columns */}
        <rect x="85" y="120" width="16" height="88" fill="rgba(196,161,90,0.25)" stroke="rgba(196,161,90,0.4)" strokeWidth="1" />
        <rect x="199" y="120" width="16" height="88" fill="rgba(196,161,90,0.25)" stroke="rgba(196,161,90,0.4)" strokeWidth="1" />

        {/* Column capitals */}
        <rect x="82" y="115" width="22" height="8" fill="rgba(196,161,90,0.3)" stroke="rgba(196,161,90,0.5)" strokeWidth="1" />
        <rect x="196" y="115" width="22" height="8" fill="rgba(196,161,90,0.3)" stroke="rgba(196,161,90,0.5)" strokeWidth="1" />

        {/* Pediment (triangular top) */}
        <polygon points="150,55 70,105 230,105" fill="rgba(196,161,90,0.15)" stroke="rgba(196,161,90,0.4)" strokeWidth="1.5" />
        <line x1="150" y1="65" x2="150" y2="95" stroke="rgba(196,161,90,0.3)" strokeWidth="1" />

        {/* Architrave */}
        <rect x="70" y="105" width="160" height="10" fill="rgba(196,161,90,0.2)" stroke="rgba(196,161,90,0.4)" strokeWidth="1" />

        {/* Central niche with cenotaph symbol */}
        <rect x="115" y="135" width="70" height="73" fill="rgba(74,53,40,0.6)" stroke="rgba(196,161,90,0.3)" strokeWidth="1" rx="2" />
        <circle cx="150" cy="165" r="18" fill="rgba(196,161,90,0.15)" stroke="rgba(196,161,90,0.5)" strokeWidth="1.5" />
        <circle cx="150" cy="165" r="8" fill="rgba(196,161,90,0.6)" />

        {/* Flame symbol above cenotaph */}
        <path d="M150 140 Q145 148 150 155 Q155 148 150 140" fill="rgba(196,161,90,0.5)" />
      </g>

      {/* Radiating lines from center - representing legacy/impact */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <line
          key={i}
          x1="150"
          y1="165"
          x2={150 + Math.cos((angle * Math.PI) / 180) * 100}
          y2={165 + Math.sin((angle * Math.PI) / 180) * 100}
          stroke={`rgba(196,161,90,${0.1 - i * 0.01})`}
          strokeWidth="1"
          strokeDasharray="4 8"
        />
      ))}

      {/* Floating wisdom particles */}
      {[
        { cx: 80, cy: 60, r: 3 },
        { cx: 220, cy: 70, r: 2 },
        { cx: 45, cy: 150, r: 2.5 },
        { cx: 255, cy: 160, r: 2 },
        { cx: 60, cy: 260, r: 2 },
        { cx: 240, cy: 250, r: 3 },
      ].map((p, i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill="rgba(196,161,90,0.4)" />
      ))}
    </svg>
  )
}

const valueProps = [
  {
    icon: <Landmark className="w-5 h-5" />,
    title: 'Digital Memorial',
    description: 'Preserve your organization\'s story in a beautiful, permanent cenotaph.',
  },
  {
    icon: <DollarSign className="w-5 h-5" />,
    title: 'Passive Asset',
    description: 'Receive consultation requests from those seeking your specific experience.',
  },
  {
    icon: <Heart className="w-5 h-5" />,
    title: 'Peer Support',
    description: 'Connect with others who understand the emotional weight of closure.',
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    title: 'Redemption',
    description: 'Transform the pain of ending into value for others starting fresh.',
  },
]

const steps = [
  'Create your cenotaph — share your organization\'s story',
  'Opt into the consultation network to receive relevant requests',
  'Connect with peers for support and knowledge exchange',
]

export function FoundersRoleSection() {
  return (
    <section id="founders" className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="animate-fade-in-up">
            <SectionLabel>for founders</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
              Your Experience Has Value
            </h2>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              You built something. You learned things that can&apos;t be found in any book.
              Whether your organization ended last month or years ago, your experience
              can help others avoid the same pitfalls and find their way forward.
            </p>

            {/* Value propositions */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {valueProps.map((prop, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 flex-shrink-0">
                    {prop.icon}
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-medium text-marble-100 mb-1">
                      {prop.title}
                    </h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      {prop.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Steps */}
            <Card variant="dark" padding="md" className="mb-8">
              <p className="text-gold-400/80 text-sm font-medium mb-3">How to participate:</p>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-slate-300 text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* CTA */}
            <a href="/memorials">
              <Button
                variant="dark-primary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Create Your Cenotaph
              </Button>
            </a>
          </div>

          {/* Right: Illustration */}
          <div className="animate-fade-in-up stagger-1">
            <Card variant="dark-elevated" padding="none" className="aspect-square relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-radial from-gold-500/5 via-transparent to-transparent" />
              <FoundersIllustrationSVG />

              {/* Corner label */}
              <div className="absolute bottom-4 right-4 text-xs text-gold-400/50 font-mono">
                LEGACY PRESERVED
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
