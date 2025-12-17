'use client'

import { useState } from 'react'
import { SectionLabel } from '@/components/ui/section-label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Users,
  Target,
  HeartHandshake,
  Stethoscope,
  ArrowRight,
  CheckCircle,
  Clock,
  Activity,
  GraduationCap,
  Shield,
  Database,
  Microscope,
} from 'lucide-react'
import Link from 'next/link'

// ============================================================================
// HERO SECTION
// ============================================================================
function HeroSection() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="w-full px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left: Content - 1/3 width */}
          <div className="flex flex-col animate-fade-in-up lg:w-1/3">
            {/* Text content with left padding */}
            <div className="flex-1 pl-4 lg:pl-8">
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-wide mb-6 text-marble-100 leading-tight">
                Targeted{' '}
                <span className="text-gradient-gold">Intervention</span>{' '}
                for Organizations
              </h1>
              <p className="text-base lg:text-lg text-slate-400 mb-8 leading-relaxed">
                We are building toward a clinic staffed by a new class of professionals —
                organizational medicine specialists trained to diagnose and treat organizational
                health issues using evidence-based protocols from our research.
              </p>

              {/* CTA Button */}
              <a href="#waitlist">
                <Button
                  variant="dark-primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Join the Waitlist
                </Button>
              </a>
            </div>

            {/* Status Card */}
            <Card variant="dark" padding="lg" className="mt-8">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-gold-500 animate-pulse" />
                <span className="text-slate-400">Building the foundation</span>
              </div>
            </Card>
          </div>

          {/* Right: Decorative Graphic - 2/3 width */}
          <div className="animate-fade-in-up stagger-1 lg:w-2/3">
            <Card variant="dark-elevated" padding="none" className="h-full max-h-[70vh] relative overflow-hidden flex items-center justify-center">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-radial from-gold-500/10 via-transparent to-transparent" />

              {/* Decorative SVG - Connection/matching themed */}
              <svg
                viewBox="0 0 400 400"
                className="w-auto h-full max-h-[65vh] scale-110"
                fill="none"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Central hub */}
                <circle
                  cx="200"
                  cy="200"
                  r="40"
                  fill="rgba(196,161,90,0.1)"
                  stroke="rgba(196,161,90,0.5)"
                  strokeWidth="2"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="15"
                  fill="rgba(196,161,90,0.3)"
                />

                {/* Outer nodes (organizations seeking help) */}
                {[
                  { cx: 100, cy: 100, label: 'org' },
                  { cx: 300, cy: 100, label: 'org' },
                  { cx: 100, cy: 300, label: 'org' },
                  { cx: 300, cy: 300, label: 'org' },
                ].map((node, i) => (
                  <g key={`org-${i}`}>
                    {/* Connection line */}
                    <line
                      x1={node.cx}
                      y1={node.cy}
                      x2="200"
                      y2="200"
                      stroke="rgba(196,161,90,0.2)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    {/* Node */}
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r="25"
                      fill="rgba(196,161,90,0.1)"
                      stroke="rgba(196,161,90,0.3)"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r="8"
                      fill="rgba(196,161,90,0.4)"
                    />
                  </g>
                ))}

                {/* Expert nodes (trained specialists) */}
                {[
                  { cx: 200, cy: 80 },
                  { cx: 320, cy: 200 },
                  { cx: 200, cy: 320 },
                  { cx: 80, cy: 200 },
                ].map((node, i) => (
                  <g key={`expert-${i}`}>
                    {/* Connection line */}
                    <line
                      x1={node.cx}
                      y1={node.cy}
                      x2="200"
                      y2="200"
                      stroke="rgba(196,161,90,0.4)"
                      strokeWidth="2"
                    />
                    {/* Node */}
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r="20"
                      fill="rgba(196,161,90,0.15)"
                      stroke="rgba(196,161,90,0.5)"
                      strokeWidth="2"
                    />
                    {/* Star indicator */}
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r="6"
                      fill="rgba(196,161,90,0.6)"
                    />
                  </g>
                ))}

                {/* Matching arrows */}
                <path
                  d="M115,115 Q200,150 185,185"
                  fill="none"
                  stroke="rgba(196,161,90,0.3)"
                  strokeWidth="1.5"
                  markerEnd="url(#arrowhead)"
                />
                <path
                  d="M285,285 Q200,250 215,215"
                  fill="none"
                  stroke="rgba(196,161,90,0.3)"
                  strokeWidth="1.5"
                />

                {/* Arrow marker definition */}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="rgba(196,161,90,0.3)"
                    />
                  </marker>
                </defs>
              </svg>

              {/* Floating labels */}
              <div className="absolute top-6 right-6 text-xs text-gold-400/60 font-mono">
                EXPERT MATCHING
              </div>
              <div className="absolute bottom-6 left-6 text-xs text-gold-400/60 font-mono">
                TARGETED INTERVENTION
              </div>
              <div className="absolute top-1/2 right-6 -translate-y-1/2 text-xs text-gold-400/60 font-mono">
                RECOVERY SUPPORT
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Decorative divider */}
      <div className="divider-roman mt-16 md:mt-20 animate-fade-in-up stagger-2">
        <span className="text-gold-400 font-serif text-sm tracking-[0.3em] px-6">MMXXV</span>
      </div>
    </section>
  )
}

// ============================================================================
// VISION SECTION
// ============================================================================
function VisionSection() {
  return (
    <section className="py-16 md:py-24 animate-fade-in-up">
      <div className="max-w-content mx-auto px-6">
        <SectionLabel>our vision</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
          From Diagnosis to Recovery
        </h2>
        <p className="text-lg text-slate-400 max-w-3xl mb-12">
          The Clinic represents the treatment arm of organizational medicine. Where the{' '}
          <Link href="/diagnostics" className="text-gold-400 hover:text-gold-300 transition-colors">
            Diagnostics Center
          </Link>{' '}
          identifies issues, the Clinic provides targeted intervention — connecting
          organizations with experts who have firsthand experience overcoming similar challenges.
        </p>

        {/* Diagnostics → Matching → Treatment flow */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Activity className="w-8 h-8" />,
              step: 'I',
              title: 'Diagnosis',
              description: 'The Diagnostics Center identifies specific organizational health issues and risk patterns.',
              status: 'Future',
            },
            {
              icon: <Target className="w-8 h-8" />,
              step: 'II',
              title: 'Specialist Assignment',
              description: 'Trained organizational medicine specialists are assigned based on the specific diagnosis and treatment requirements.',
              status: 'Future',
            },
            {
              icon: <HeartHandshake className="w-8 h-8" />,
              step: 'III',
              title: 'Guided Recovery',
              description: 'Structured intervention protocols guide organizations through treatment and recovery.',
              status: 'Future',
            },
          ].map((item, index) => (
            <div key={index} className="relative">
              {/* Connection line */}
              {index < 2 && (
                <div className="hidden md:block absolute top-12 left-full w-8 h-[2px] bg-gradient-to-r from-gold-500/50 to-transparent -translate-x-4" />
              )}

              <div className="space-y-4">
                {/* Icon with step */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400">
                    {item.icon}
                  </div>
                  <span className="font-serif text-3xl text-gold-500/30">{item.step}</span>
                </div>

                {/* Status badge */}
                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium bg-slate-700/50 text-slate-500">
                  <Clock className="w-3 h-3" />
                  {item.status}
                </div>

                <h3 className="font-display text-xl font-medium text-marble-100">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// POTENTIAL CAPABILITIES SECTION
// ============================================================================
function PotentialCapabilitiesSection() {
  const capabilities = [
    {
      icon: <Target className="w-7 h-7" />,
      title: 'Specialist-Led Consulting',
      description: 'Organizations receive care from trained professionals who specialize in specific organizational conditions and treatment protocols.',
    },
    {
      icon: <Stethoscope className="w-7 h-7" />,
      title: 'Treatment Protocols',
      description: 'Research-based intervention frameworks tailored to specific organizational conditions and their severity.',
    },
    {
      icon: <HeartHandshake className="w-7 h-7" />,
      title: 'Recovery Support',
      description: 'Ongoing guidance for organizations in crisis, with structured milestones and progress tracking.',
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: 'Prevention Programs',
      description: 'For organizations showing early warning signs, intervention before issues become critical.',
    },
  ]

  return (
    <>
      {/* Gradient transition into section */}
      <div className="h-24 bg-gradient-to-b from-slate-900 to-marble-950" />

      <section className="py-16 md:py-24 bg-marble-950 relative">
        <div className="max-w-content mx-auto px-6">
          <SectionLabel>potential capabilities</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
            What the Clinic May Offer
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mb-12">
            When the research foundation and diagnostic capabilities are in place, the Clinic
            aims to provide these services. These represent our goals, not current offerings.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {capabilities.map((capability, index) => (
              <Card key={index} variant="dark-elevated" padding="lg" className="h-full">
                <CardHeader>
                  <div className="w-14 h-14 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 mb-2">
                    {capability.icon}
                  </div>
                  <CardTitle variant="dark">{capability.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 leading-relaxed">{capability.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gradient transition out of section */}
      <div className="h-24 bg-gradient-to-b from-marble-950 to-slate-900" />
    </>
  )
}

// ============================================================================
// NEW PROFESSION SECTION
// ============================================================================
function NewProfessionSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left column: Content */}
          <div>
            <SectionLabel>a new profession</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
              Organizational Medicine Specialists
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              The Clinic represents the pinnacle of our research mission — enabling a new class
              of professionals trained in organizational medicine. These specialists will diagnose
              and treat organizational health issues using evidence-based protocols derived from
              our mortality research.
            </p>

            <ul className="space-y-4 mb-8">
              {[
                'Rigorous training based on research findings',
                'Evidence-based treatment protocols',
                'Professional certification in organizational medicine',
                'Continuous education as research evolves',
              ].map((point, index) => (
                <li key={index} className="flex items-start gap-3 text-slate-400">
                  <CheckCircle className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <Link href="/research">
              <Button
                variant="dark-secondary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Learn About Our Research
              </Button>
            </Link>
          </div>

          {/* Right column: Visual */}
          <div className="flex items-center justify-center">
            <Card variant="dark-elevated" padding="lg" className="w-full">
              <div className="space-y-6">
                {/* Training pipeline illustration */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 mb-4">
                    <Database className="w-5 h-5 text-gold-400" />
                    <span className="text-marble-100 font-medium">Research Foundation</span>
                  </div>

                  <div className="flex items-center justify-center gap-4 my-6">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center mb-2">
                        <Microscope className="w-6 h-6 text-slate-400" />
                      </div>
                      <span className="text-xs text-slate-500">Patterns</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gold-500/50" />
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center mb-2">
                        <GraduationCap className="w-6 h-6 text-gold-400" />
                      </div>
                      <span className="text-xs text-slate-500">Training</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gold-500/50" />
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center mb-2">
                        <Stethoscope className="w-6 h-6 text-slate-400" />
                      </div>
                      <span className="text-xs text-slate-500">Treatment</span>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500/10 border border-gold-500/30">
                    <Users className="w-5 h-5 text-gold-400" />
                    <span className="text-marble-100 font-medium">Certified Specialists</span>
                  </div>
                </div>

                <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-700">
                  Research transforms into professional practice
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// CURRENT STATUS SECTION
// ============================================================================
function CurrentStatusSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left column: Content */}
          <div>
            <SectionLabel>where we are today</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
              Honest About Our Progress
            </h2>
            <p className="text-lg text-slate-400">
              The Clinic requires a research foundation, diagnostic capabilities, and trained
              specialists. We are building these prerequisites in sequence — research data informs
              protocols, protocols enable training, training produces specialists.
            </p>
          </div>

          {/* Right column: Status items */}
          <div className="space-y-6">
            {[
              {
                status: 'progress',
                label: 'Collecting organizational autopsy data',
              },
              {
                status: 'progress',
                label: 'Building research foundation',
              },
              {
                status: 'future',
                label: 'Diagnostics Center capabilities',
              },
              {
                status: 'future',
                label: 'Treatment protocol development',
              },
              {
                status: 'future',
                label: 'Specialist training curriculum',
              },
              {
                status: 'future',
                label: 'Clinic launch',
              },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                  item.status === 'complete'
                    ? 'bg-success-500'
                    : item.status === 'progress'
                    ? 'bg-gold-500 animate-pulse'
                    : 'bg-slate-600'
                }`} />
                <span className={
                  item.status === 'future' ? 'text-slate-500' : 'text-marble-100'
                }>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// WAITLIST SECTION
// ============================================================================
function WaitlistSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual waitlist submission
    if (email) {
      setSubmitted(true)
    }
  }

  return (
    <section id="waitlist" className="py-16 md:py-24 bg-slate-900/50">
      <div className="max-w-content mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <SectionLabel>stay informed</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
            Join the Waitlist
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            Be the first to know when the Clinic becomes available.
            We&apos;ll send occasional updates on our progress — no spam, ever.
          </p>

          {submitted ? (
            <Card variant="dark-elevated" padding="lg">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-success-500/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-success-500" />
                </div>
                <h3 className="font-display text-xl font-medium text-marble-100">
                  You&apos;re on the list
                </h3>
                <p className="text-slate-400">
                  We&apos;ll keep you updated on our progress.
                </p>
              </div>
            </Card>
          ) : (
            <Card variant="dark-elevated" padding="lg">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    variant="dark"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                    required
                  />
                  <Button
                    type="submit"
                    variant="dark-primary"
                    size="lg"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Join Waitlist
                  </Button>
                </div>
                <p className="text-xs text-slate-500">
                  Your email will only be used for Clinic updates.
                  You can unsubscribe at any time.
                </p>
              </form>
            </Card>
          )}

          {/* Alternative CTAs */}
          <div className="mt-12 pt-8 border-t border-slate-800">
            <p className="text-slate-500 mb-6">Want to help build this future?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/community">
                <Button variant="dark-secondary" size="lg">
                  Join the Community
                </Button>
              </Link>
              <Link href="/memorials/cenotaphery">
                <Button variant="dark-ghost" size="lg">
                  Contribute Data
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// CLINIC PAGE
// ============================================================================
export default function ClinicPage() {
  return (
    <>
      <HeroSection />
      <VisionSection />
      <PotentialCapabilitiesSection />
      <NewProfessionSection />
      <CurrentStatusSection />
      <WaitlistSection />
    </>
  )
}
