'use client'

import { SectionLabel } from '@/components/ui/section-label'
import { Card } from '@/components/ui/card'
import { NewsletterWidget } from '@/components/ui/newsletter-widget'
import {
  Landmark,
  FlaskConical,
  Shield,
  Wrench,
  ArrowRight,
} from 'lucide-react'

const roleCTAs = [
  {
    id: 'founders',
    title: "I'm a Founder",
    description: 'Share your story and create a digital memorial',
    icon: <Landmark className="w-6 h-6" />,
    href: '/memorials',
    color: 'gold',
  },
  {
    id: 'researchers',
    title: "I'm a Researcher",
    description: 'Access data and collaborate on publications',
    icon: <FlaskConical className="w-6 h-6" />,
    href: '/research',
    color: 'purple',
  },
  {
    id: 'keepers',
    title: 'I Want to be a Keeper',
    description: 'Lead your regional community',
    icon: <Shield className="w-6 h-6" />,
    href: '/keepers',
    color: 'emerald',
  },
  {
    id: 'contributors',
    title: 'I Want to Contribute',
    description: 'Help build the platform and community',
    icon: <Wrench className="w-6 h-6" />,
    href: '/challenges',
    color: 'orange',
  },
]

const colorClasses = {
  gold: {
    bg: 'bg-gold-500/20',
    text: 'text-gold-400',
    border: 'hover:border-gold-500/50',
    ring: 'focus-within:ring-gold-500/30',
  },
  purple: {
    bg: 'bg-purple-500/20',
    text: 'text-purple-400',
    border: 'hover:border-purple-500/50',
    ring: 'focus-within:ring-purple-500/30',
  },
  emerald: {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    border: 'hover:border-emerald-500/50',
    ring: 'focus-within:ring-emerald-500/30',
  },
  orange: {
    bg: 'bg-orange-500/20',
    text: 'text-orange-400',
    border: 'hover:border-orange-500/50',
    ring: 'focus-within:ring-orange-500/30',
  },
}

export function CommunityJoinSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-900 to-marble-950">
      <div className="max-w-content mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>get started</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
            Ready to Join?
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Choose your path in the community. Every role contributes to preserving organizational wisdom.
          </p>
        </div>

        {/* Role CTAs */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {roleCTAs.map((role) => {
            const colors = colorClasses[role.color as keyof typeof colorClasses]
            return (
              <a key={role.id} href={role.href} className="group">
                <Card
                  variant="dark"
                  padding="lg"
                  className={`h-full text-center transition-all duration-300 hover:-translate-y-1 ${colors.border}`}
                >
                  <div
                    className={`w-14 h-14 rounded-full ${colors.bg} flex items-center justify-center ${colors.text} mx-auto mb-4 transition-transform group-hover:scale-110`}
                  >
                    {role.icon}
                  </div>
                  <h3 className="font-display text-lg font-medium text-marble-100 mb-2 group-hover:text-gold-400 transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-sm text-slate-400">{role.description}</p>
                  <div className={`mt-4 ${colors.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <ArrowRight className="w-5 h-5 mx-auto" />
                  </div>
                </Card>
              </a>
            )
          })}
        </div>

        {/* Newsletter Signup */}
        <NewsletterWidget
          variant="full"
          title="Stay Connected"
          className="mx-auto"
        />
      </div>
    </section>
  )
}
