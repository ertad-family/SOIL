'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { SectionLabel } from '@/components/ui/section-label'
import { FeatureCard, FeatureCardGrid } from '@/components/ui/feature-card'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  Users,
  Heart,
  Award,
  Globe,
  FlaskConical,
  Landmark,
  Stethoscope,
  GraduationCap,
  HeartHandshake,
  Calendar,
  Shield,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react'


// ============================================================================
// HERO SECTION (Two-column: 2.3:1.3 ratio - text left, CTAs right)
// ============================================================================
function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-[3fr_1fr] gap-12 lg:gap-16 items-end">
          {/* Left: Headline */}
          <div className="animate-fade-in-up">
            <h1 className="font-display text-4xl md:text-6xl lg:text-[100px] font-semibold leading-[1.1] text-marble-100">
              <span className="text-gradient-gold">Advancing Organizations Theory </span>
              
              <span className="text-marble-100">with the Power of Community and AI</span>
            </h1>
          </div>

          {/* Right: Description and CTAs */}
          <div className="animate-fade-in-up stagger-1">
            <p className="text-slate-400 leading-relaxed mb-8">
              Join a pioneering research initiative transforming how we understand organizations.
              Your experience becomes part of a growing body of knowledge that will help future generations of founders
              navigate their journeys with greater insight.
            </p>

            <div className="flex flex-col gap-4">
              <Button variant="dark-primary" size="lg" className="w-full sm:w-auto">
                Coin Your Story
              </Button>
              <Button variant="dark-secondary" size="lg" className="w-full sm:w-auto">
                Explore the Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width decorative divider under entire section */}
      <div className="divider-roman mt-24 md:mt-32 animate-fade-in-up stagger-3">
        <span className="text-gold-400 font-serif text-sm tracking-[0.3em] px-6">MMXXV</span>
      </div>
    </section>
  )
}

// ============================================================================
// THREE MISSIONS SECTION (Pillars with Roman numerals)
// ============================================================================
function MissionsSection() {
  const missions = [
    {
      numeral: 'I',
      title: 'Scientific Rigor',
      description:
        'We apply systematic, evidence-based methodology to data collection and analysis. From structured interviews to emerging patterns, we let the data speak — no preconceptions, no shortcuts.',
    },
    {
      numeral: 'II',
      title: 'Founder Healing',
      description:
        'Providing founders with closure and dignity after the end of their ventures. Through structured storytelling, we transform painful experiences into meaningful contributions.',
    },
    {
      numeral: 'III',
      title: 'Respect',
      description:
        'Entrepreneurs are undervalued by society despite their sacrifices and contributions. We work to restore the recognition they deserve — from communities, institutions, and governments.',
    },
  ]

  return (
    <section className="pt-0 pb-20 md:pb-32 animate-fade-in-up">
      <div className="max-w-content mx-auto px-6">
        <SectionLabel>our mission</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium mt-4 mb-16 text-marble-100">
          Three Pillars of Change
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {missions.map((mission, index) => (
            <div
              key={index}
              className="relative bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border border-slate-700/80 border-l-[3px] border-l-gold-500 rounded-xl p-8 md:p-10 min-h-[400px] flex flex-col overflow-hidden"
            >
              {/* Large Roman numeral as background pillar */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none select-none">
                <span
                  className="font-serif text-[180px] md:text-[260px] font-bold leading-none"
                  style={{
                    WebkitTextStroke: '3px rgba(201, 148, 61, 0.2)',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {mission.numeral}
                </span>
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                <h3 className="font-display text-2xl md:text-3xl font-semibold text-marble-100 mb-6 max-w-[70%]">
                  {mission.title}
                </h3>
                <p className="text-slate-400 leading-relaxed text-lg max-w-[85%]">
                  {mission.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// METHODOLOGY SECTION
// ============================================================================
function MethodologySection() {
  const steps = [
    {
      title: 'Structured Data Collection',
      description: 'Our interview framework captures comprehensive organizational data through guided conversations with founders.',
    },
    {
      title: 'Anonymization',
      description: 'Privacy by default. All sensitive information is protected, ensuring safe participation for every contributor.',
    },
    {
      title: 'Pattern Emergence',
      description: 'Framework-agnostic analysis lets the data speak. We avoid imposing theories, allowing patterns to emerge naturally.',
    },
    {
      title: 'Open Research',
      description: 'Anonymized datasets available to researchers worldwide, enabling collaborative advancement of organizational science.',
    },
    {
      title: 'Machine Learning',
      description: 'Building specialized AI models trained on organizational data for future diagnostic and analytical tools.',
    },
  ]

  return (
    <section className="py-16 md:py-24 animate-fade-in-up">
      <div className="max-w-content mx-auto px-6">
        <SectionLabel>methodology</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-12 text-marble-100">
          How We Work
        </h2>

        <div className="grid md:grid-cols-5 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative p-6 bg-slate-800/30 rounded-xl border border-slate-700/50"
            >
              {/* Step number */}
              <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 font-display font-semibold text-lg mb-4">
                {index + 1}
              </div>

              <h3 className="font-display text-lg font-medium text-marble-100 mb-2">
                {step.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// COMMUNITY SECTION (VISUALLY PROMINENT)
// ============================================================================
function CommunitySection() {
  const communityElements = [
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Founder Community',
      description: 'Peer support, shared experiences, and consulting from those who understand the journey.',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Keepers',
      description: 'Local leaders and guardians who nurture regional communities and preserve organizational memories.',
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Day of the Dead Venture',
      description: 'Annual celebration honoring organizations that have passed, their founders, and their contributions.',
    },
  ]

  return (
    <section className="py-20 md:py-32 animate-fade-in-up">
      <div className="max-w-content mx-auto px-6">
        <div className="text-center mb-16">
          <SectionLabel>community</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium mt-4 mb-6 text-marble-100">
            The Heart of SOIL
          </h2>
          <p className="text-lg text-marble-400 max-w-2xl mx-auto">
            Our success is measured by the strength of our community. Together, we transform individual
            experiences into collective wisdom.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {communityElements.map((element, index) => (
            <div key={index} className="text-center space-y-4 p-6">
              <div className="w-16 h-16 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 mx-auto">
                {element.icon}
              </div>
              <h3 className="font-display text-xl font-medium text-marble-100">{element.title}</h3>
              <p className="text-marble-400 leading-relaxed">{element.description}</p>
            </div>
          ))}
        </div>

        {/* Central message - updated quote */}
        <div className="mt-16 text-center">
          <div className="inline-block px-8 py-6 border border-gold-500/30 rounded-sm max-w-2xl">
            <p className="font-serif text-lg md:text-xl text-gold-400 italic leading-relaxed">
              &ldquo;Failure is not the opposite of success; it is part of success. By burying our dead properly, we fertilize the soil for new growth.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// SCOPE SECTION (with Community added, badges changed to "under construction")
// ============================================================================
function ScopeSection() {
  const ecosystem = [
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community',
      description: 'The heart of SOIL — founders supporting founders through shared experience.',
      status: 'active',
    },
    {
      icon: <FlaskConical className="w-8 h-8" />,
      title: 'Research Center',
      description: 'Academic research, data analysis, and publication of findings.',
      status: 'active',
    },
    {
      icon: <Landmark className="w-8 h-8" />,
      title: 'Cenotaphery',
      description: 'Digital memorials honoring organizations and preserving their stories.',
      status: 'active',
    },
    {
      icon: <Stethoscope className="w-8 h-8" />,
      title: 'Diagnostics Center',
      description: 'Tools for organizational health assessment and early warning systems.',
      status: 'construction',
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: 'Educational Institute',
      description: 'Courses and resources teaching organizational resilience and recovery.',
      status: 'construction',
    },
    {
      icon: <HeartHandshake className="w-8 h-8" />,
      title: 'Clinic',
      description: 'Personalized consulting and intervention for struggling organizations.',
      status: 'construction',
    },
  ]

  return (
    <section className="py-16 md:py-24 animate-fade-in-up">
      <div className="max-w-content mx-auto px-6">
        <SectionLabel>ecosystem</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-12 text-marble-100">
          What We&apos;re Building
        </h2>

        <FeatureCardGrid columns={3}>
          {ecosystem.map((item, index) => (
            <div key={index} className="relative">
              <FeatureCard
                icon={item.icon}
                title={item.title}
                description={item.description}
                variant="dark"
              />
              <div className="absolute top-4 right-4">
                <Badge
                  variant={item.status === 'active' ? 'dark-success' : 'dark-warning'}
                  size="sm"
                >
                  {item.status === 'active' ? 'Active' : 'Under Construction'}
                </Badge>
              </div>
            </div>
          ))}
        </FeatureCardGrid>
      </div>
    </section>
  )
}

// ============================================================================
// GET INVOLVED SECTION (reordered: founders, business, researchers)
// ============================================================================
function GetInvolvedSection() {
  const audiences = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'For Founders',
      description:
        'Coin your story and transform your experience into knowledge that helps others. Become a volunteer, mentor, or community keeper.',
      cta: 'Coin Your Story',
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'For Business Community',
      description:
        'Support groundbreaking research, join our advisory board, or sponsor initiatives that advance organizational science and help future founders.',
      cta: 'Support Research',
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'For Researchers',
      description:
        'Access anonymized datasets, collaborate on publications, and join our research network. We welcome partnerships with academic institutions worldwide.',
      cta: 'Partner With Us',
    },
  ]

  return (
    <section className="py-16 md:py-24 animate-fade-in-up">
      <div className="max-w-content mx-auto px-6">
        <SectionLabel>get involved</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-12 text-marble-100">
          Join the Movement
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {audiences.map((audience, index) => (
            <Card key={index} variant="dark-elevated" className="h-full flex flex-col">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 mb-4">
                  {audience.icon}
                </div>
                <CardTitle variant="dark">{audience.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-slate-400 leading-relaxed flex-1">{audience.description}</p>
                <div className="mt-6">
                  <Button variant="dark-secondary" size="sm" className="w-full">
                    {audience.cta}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// ABOUT SECTION
// ============================================================================
function AboutSection() {
  const principles = [
    { label: 'Dignity', description: 'Every organization and founder deserves respect' },
    { label: 'Truth', description: 'Let data reveal patterns, not preconceptions' },
    { label: 'Service', description: 'Research that serves the community first' },
    { label: 'Rigor', description: 'Scientific standards in everything we do' },
  ]

  return (
    <section className="py-16 md:py-24 animate-fade-in-up">
      <div className="max-w-content mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <SectionLabel>about soil</SectionLabel>

          <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
            Social Organizational Intelligence Lab
          </h2>

          <p className="text-lg text-slate-400 leading-relaxed mb-12">
            S.O.I.L. is a research initiative dedicated to understanding how organizations end — and
            what we can learn from their journeys. We believe that every closure holds lessons that can
            help future founders, researchers, and society at large.
          </p>

          {/* Principles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {principles.map((principle, index) => (
              <div key={index} className="text-center">
                <div className="font-serif text-xl font-medium text-gold-400 mb-2">{principle.label}</div>
                <p className="text-sm text-slate-500">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// TEMPORARY FOOTER (will be replaced with wireframe landscape)
// ============================================================================
function TemporaryFooter() {
  return (
    <footer className="border-t border-slate-700/50 bg-slate-900">
      <div className="max-w-content mx-auto px-6 py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="font-serif text-xl tracking-wider text-slate-400">
            S<span className="text-gold-400">·</span>O<span className="text-gold-400">·</span>I
            <span className="text-gold-400">·</span>L
          </div>
          <p className="font-ui text-sm uppercase tracking-widest text-slate-500">
            Social Organizational Intelligence Lab
          </p>
          <p className="text-xs text-slate-600">© 2025 SOIL. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(true) // Dark by default

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-900 dark:bg-slate-900 text-marble-100">
        {/* Header with theme toggle */}
        <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-lg">
          <div className="max-w-content mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="font-serif text-2xl font-semibold tracking-wider">
                S<span className="text-gold-400">·</span>O<span className="text-gold-400">·</span>I
                <span className="text-gold-400">·</span>L
              </div>
              <div className="flex items-center gap-4">
                {/* Theme toggle */}
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-sm text-slate-400 hover:text-gold-400 transition-colors"
                  aria-label="Toggle theme"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <Button variant="dark-secondary" size="sm">
                  Menu
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main>
          <HeroSection />
          <MissionsSection />
          <MethodologySection />
          <CommunitySection />
          <ScopeSection />
          <GetInvolvedSection />
          <AboutSection />
        </main>

        <TemporaryFooter />
      </div>
    </div>
  )
}
