'use client'

import { SectionLabel } from '@/components/ui/section-label'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  BookOpen,
  Database,
  TrendingUp,
  Users,
  FileText,
  Handshake,
  GraduationCap,
  Shield,
  Heart,
  Globe,
  Mail,
  ArrowRight,
} from 'lucide-react'

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
                Building the Future of{' '}
                <span className="text-gradient-gold">Organizational Science</span>
              </h1>
              <p className="text-base lg:text-lg text-slate-400 mb-8 leading-relaxed">
                A new scientific discipline based on systematic study of organizational mortality.
                Join us in creating the infrastructure for Organizational Biology, Health, and Medicine.
              </p>

              {/* CTA Button */}
              <a href="#get-involved">
                <Button
                  variant="dark-primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Get Involved
                </Button>
              </a>
            </div>

            {/* Email Contact Card - Full width, less padding */}
            <Card variant="dark" padding="lg" className="mt-8 flex items-center justify-between">
              <span className="text-slate-400 text-lg">Contact us:</span>
              <a
                href="mailto:research@soil.rip"
                className="text-gold-400 text-xl font-medium hover:text-gold-300 transition-colors"
              >
                research@soil.rip
              </a>
            </Card>
          </div>

          {/* Right: Decorative Graphic in Card - 2/3 width */}
          <div className="animate-fade-in-up stagger-1 lg:w-2/3">
            <Card variant="dark-elevated" padding="none" className="h-full max-h-[70vh] relative overflow-hidden flex items-center justify-center">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-radial from-gold-500/10 via-transparent to-transparent" />

              {/* Decorative SVG - Dodecahedron portal themed */}
              <svg
                viewBox="0 0 400 400"
                className="w-auto h-full max-h-[65vh] scale-110"
                fill="none"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Outer rotating ellipses - data orbits (+20% radius) */}
                {[...Array(6)].map((_, i) => (
                  <ellipse
                    key={`orbit-${i}`}
                    cx="200"
                    cy="200"
                    rx={84 + i * 24}
                    ry={42 + i * 12}
                    fill="none"
                    stroke="rgba(196,161,90,0.12)"
                    strokeWidth="1"
                    transform={`rotate(${i * 30} 200 200)`}
                  />
                ))}

                {/* Pentagon - dodecahedron face (regular pentagon) */}
                <polygon
                  points="200,115 280,173 249,268 151,268 120,173"
                  fill="none"
                  stroke="rgba(196,161,90,0.5)"
                  strokeWidth="2"
                />

                {/* Outer ring (inscribed in pentagon) - apothem = circumradius × cos(36°) = 85 × 0.809 ≈ 68 */}
                <circle
                  cx="200"
                  cy="200"
                  r="68"
                  fill="none"
                  stroke="rgba(196,161,90,0.4)"
                  strokeWidth="3"
                />
                {/* Outer ring grooves */}
                <circle
                  cx="200"
                  cy="200"
                  r="73"
                  fill="none"
                  stroke="rgba(74,53,40,0.6)"
                  strokeWidth="1"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="63"
                  fill="none"
                  stroke="rgba(74,53,40,0.6)"
                  strokeWidth="1"
                />

                {/* Inner ring (around portal hole) */}
                <circle
                  cx="200"
                  cy="200"
                  r="45"
                  fill="none"
                  stroke="rgba(196,161,90,0.5)"
                  strokeWidth="3"
                />
                {/* Inner ring grooves */}
                <circle
                  cx="200"
                  cy="200"
                  r="50"
                  fill="none"
                  stroke="rgba(74,53,40,0.6)"
                  strokeWidth="1"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="40"
                  fill="none"
                  stroke="rgba(74,53,40,0.6)"
                  strokeWidth="1"
                />

                {/* Portal hole (center) */}
                <circle
                  cx="200"
                  cy="200"
                  r="30"
                  fill="rgba(147,112,219,0.15)"
                  stroke="rgba(147,112,219,0.3)"
                  strokeWidth="1"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="15"
                  fill="rgba(147,112,219,0.25)"
                />

                {/* Data points on orbits around pentagon (radii 100-170 from center) */}
                {[
                  // Inner orbit (r~100)
                  { cx: 300, cy: 200, r: 4 },
                  { cx: 169, cy: 305, r: 3 },
                  { cx: 100, cy: 200, r: 4 },
                  // Middle orbit (r~130)
                  { cx: 330, cy: 200, r: 5 },
                  { cx: 240, cy: 320, r: 4 },
                  { cx: 80, cy: 245, r: 3 },
                  { cx: 130, cy: 90, r: 4 },
                  // Outer orbit (r~160)
                  { cx: 360, cy: 200, r: 4 },
                  { cx: 295, cy: 330, r: 5 },
                  { cx: 105, cy: 330, r: 3 },
                  { cx: 50, cy: 170, r: 4 },
                  { cx: 200, cy: 45, r: 5 },
                ].map((point, i) => (
                  <circle
                    key={`point-${i}`}
                    cx={point.cx}
                    cy={point.cy}
                    r={point.r}
                    fill="rgba(196,161,90,0.6)"
                  />
                ))}

                {/* Pentagon vertex accents */}
                <circle cx="200" cy="115" r="5" fill="rgba(196,161,90,0.5)" />
                <circle cx="280" cy="173" r="5" fill="rgba(196,161,90,0.5)" />
                <circle cx="249" cy="268" r="5" fill="rgba(196,161,90,0.5)" />
                <circle cx="151" cy="268" r="5" fill="rgba(196,161,90,0.5)" />
                <circle cx="120" cy="173" r="5" fill="rgba(196,161,90,0.5)" />
              </svg>

              {/* Floating labels */}
              <div className="absolute top-6 right-6 text-xs text-gold-400/60 font-mono">
                DATA COLLECTION
              </div>
              <div className="absolute bottom-6 left-6 text-xs text-gold-400/60 font-mono">
                PATTERN ANALYSIS
              </div>
              <div className="absolute top-1/2 right-6 -translate-y-1/2 text-xs text-gold-400/60 font-mono">
                FRAMEWORKS
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
// THE RESEARCH GAP SECTION
// ============================================================================
function ResearchGapSection() {
  const problems = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'No Systematic Study',
      description:
        'Organizations close every day, yet there is no systematic approach to studying why and how they end. Each closure is treated as an isolated event.',
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: 'Fragmented Knowledge',
      description:
        'What we know about organizational closure is scattered across anecdotes, case studies, and personal stories — never aggregated or analyzed at scale.',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Missing Data Approach',
      description:
        'Organizational theory lacks the structured data collection methods that transformed other fields. We need a systematic framework to understand patterns.',
    },
  ]

  return (
    <section className="py-16 md:py-24 animate-fade-in-up">
      <div className="max-w-content mx-auto px-6">
        <SectionLabel>the research gap</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
          Why This Research Matters
        </h2>
        <p className="text-lg text-slate-400 max-w-3xl mb-12">
          Every year, millions of organizations die. Startups, NGOs, agencies, ventures of all
          kinds — they close, dissolve, or simply fade away. Yet unlike medicine, which has
          centuries of autopsy data informing how we understand human health, organizational
          science has almost no systematic data on organizational death.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div key={index} className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400">
                {problem.icon}
              </div>
              <h3 className="font-display text-xl font-medium text-marble-100">{problem.title}</h3>
              <p className="text-slate-400 leading-relaxed">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// WHAT SOIL IS BUILDING SECTION
// ============================================================================
function WhatWeAreBuildingSection() {
  const metrics = [
    {
      value: 'XX',
      valueStyle: 'roman',
      label: 'Target: 20,000 Autopsies',
      description: 'Comprehensive organizational autopsies to build statistical power for pattern recognition and predictive modeling.',
    },
    {
      value: 'Global',
      valueStyle: 'text',
      label: 'Worldwide Coverage',
      description: 'Data collection across all countries, regions, and cities for truly representative insights.',
    },
    {
      value: '∞',
      valueStyle: 'symbol',
      label: 'Open Access',
      description: 'Anonymized datasets available to qualified researchers worldwide.',
    },
  ]

  // Custom SVG icons in Hero section style
  const DataCollectionIcon = () => (
    <svg viewBox="0 0 64 64" className="w-36 h-36" fill="none">
      {/* Concentric orbits */}
      {[0, 1, 2].map((i) => (
        <ellipse
          key={i}
          cx="32"
          cy="32"
          rx={12 + i * 8}
          ry={6 + i * 4}
          fill="none"
          stroke="rgba(196,161,90,0.3)"
          strokeWidth="1"
          transform={`rotate(${i * 20} 32 32)`}
        />
      ))}
      {/* Center pentagon */}
      <polygon
        points="32,20 40,26 38,36 26,36 24,26"
        fill="none"
        stroke="rgba(196,161,90,0.6)"
        strokeWidth="1.5"
      />
      {/* Data points */}
      <circle cx="32" cy="12" r="2" fill="rgba(196,161,90,0.8)" />
      <circle cx="50" cy="32" r="2" fill="rgba(196,161,90,0.8)" />
      <circle cx="14" cy="32" r="2" fill="rgba(196,161,90,0.8)" />
      <circle cx="44" cy="48" r="1.5" fill="rgba(196,161,90,0.6)" />
      <circle cx="20" cy="48" r="1.5" fill="rgba(196,161,90,0.6)" />
    </svg>
  )

  const FrameworkIcon = () => (
    <svg viewBox="0 0 64 64" className="w-36 h-36" fill="none">
      {/* Multiple overlapping frameworks (circles) */}
      <circle cx="32" cy="24" r="14" fill="none" stroke="rgba(196,161,90,0.4)" strokeWidth="1" />
      <circle cx="24" cy="38" r="14" fill="none" stroke="rgba(196,161,90,0.4)" strokeWidth="1" />
      <circle cx="40" cy="38" r="14" fill="none" stroke="rgba(196,161,90,0.4)" strokeWidth="1" />
      {/* Center intersection - neutral zone */}
      <circle cx="32" cy="32" r="6" fill="rgba(147,112,219,0.15)" stroke="rgba(147,112,219,0.4)" strokeWidth="1.5" />
      {/* Radial lines showing multiple perspectives */}
      <line x1="32" y1="32" x2="32" y2="10" stroke="rgba(196,161,90,0.3)" strokeWidth="1" />
      <line x1="32" y1="32" x2="13" y2="43" stroke="rgba(196,161,90,0.3)" strokeWidth="1" />
      <line x1="32" y1="32" x2="51" y2="43" stroke="rgba(196,161,90,0.3)" strokeWidth="1" />
    </svg>
  )

  const ScaleIcon = () => (
    <svg viewBox="0 0 64 64" className="w-36 h-36" fill="none">
      {/* Expanding rings representing scale */}
      {[0, 1, 2, 3].map((i) => (
        <circle
          key={i}
          cx="32"
          cy="32"
          r={8 + i * 7}
          fill="none"
          stroke={`rgba(196,161,90,${0.5 - i * 0.1})`}
          strokeWidth="1.5"
        />
      ))}
      {/* Data points at different scales */}
      <circle cx="32" cy="32" r="3" fill="rgba(196,161,90,0.8)" />
      <circle cx="32" cy="18" r="2" fill="rgba(196,161,90,0.6)" />
      <circle cx="46" cy="32" r="2" fill="rgba(196,161,90,0.6)" />
      <circle cx="32" cy="46" r="2" fill="rgba(196,161,90,0.6)" />
      <circle cx="18" cy="32" r="2" fill="rgba(196,161,90,0.6)" />
      {/* Outer points */}
      <circle cx="32" cy="4" r="1.5" fill="rgba(196,161,90,0.4)" />
      <circle cx="60" cy="32" r="1.5" fill="rgba(196,161,90,0.4)" />
      <circle cx="32" cy="60" r="1.5" fill="rgba(196,161,90,0.4)" />
      <circle cx="4" cy="32" r="1.5" fill="rgba(196,161,90,0.4)" />
    </svg>
  )

  const approaches = [
    {
      icon: <DataCollectionIcon />,
      title: 'Systematic Data Collection',
      points: [
        'Structured organizational autopsies',
        'Full organizational state capture',
        'Functional structure analysis',
        'Environmental context mapping',
      ],
    },
    {
      icon: <FrameworkIcon />,
      title: 'Framework-Agnostic Methodology',
      points: [
        'No predetermined theoretical lens',
        'Neutral data collection formats',
        'Multi-framework post-hoc analysis',
        'Pattern-driven theory development',
      ],
    },
    {
      icon: <ScaleIcon />,
      title: 'Scale and Depth',
      points: [
        'Thousands of comprehensive cases',
        'Statistical power for patterns',
        'Predictive modeling capability',
        'Intervention design foundation',
      ],
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        <SectionLabel>what we are building</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-12 text-marble-100">
          Infrastructure for a New Discipline
        </h2>

        {/* Metrics row - first card larger */}
        <div className="grid md:grid-cols-[2fr_1fr_1fr] gap-6 mb-16">
          {metrics.map((metric, index) => (
            <Card
              key={index}
              variant={index === 0 ? 'dark-elevated' : 'dark'}
              padding="lg"
              className="h-full"
            >
              <span
                className={`inline-block mb-4 ${
                  metric.valueStyle === 'roman'
                    ? 'relative font-serif text-7xl md:text-8xl lg:text-9xl font-normal select-none leading-none [color:transparent] [-webkit-text-stroke:1.5px_rgba(226,176,85,0.25)] before:absolute before:top-[0.05em] before:left-0 before:w-full before:h-[2px] before:bg-[rgba(226,176,85,0.25)]'
                    : 'font-display text-4xl md:text-5xl font-semibold text-gold-400'
                }`}
              >
                {metric.value}
              </span>
              <h3 className="font-display text-lg font-medium text-marble-100 mb-2">
                {metric.label}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">{metric.description}</p>
            </Card>
          ))}
        </div>

        {/* Approaches row - 3 columns with icons and bullet points */}
        <div className="grid md:grid-cols-3 gap-8">
          {approaches.map((approach, index) => (
            <div key={index} className="space-y-6">
              <div className="w-36 h-36">
                {approach.icon}
              </div>
              <h3 className="font-display text-xl font-medium text-marble-100">
                {approach.title}
              </h3>
              <ul className="space-y-3">
                {approach.points.map((point, pointIndex) => (
                  <li key={pointIndex} className="flex items-start gap-3 text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// RESEARCH QUESTIONS SECTION
// ============================================================================
function ResearchQuestionsSection() {
  const questions = [
    'What are the common failure modes across organizational types?',
    'Can we identify early warning signals that predict organizational mortality?',
    'How do different functional systems (financial, operational, cultural) interact in organizational decline?',
    'What environmental conditions correlate with higher mortality rates?',
    'Do existing organizational frameworks (McKinsey 7S, Porter\'s Five Forces, etc.) predict failure better than alternatives?',
    'Can we develop diagnostic tools for organizational health?',
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        <SectionLabel>research questions</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
          What We&apos;re Exploring
        </h2>
        <p className="text-lg text-slate-400 max-w-3xl mb-12">
          Our research agenda focuses on fundamental questions that have never been systematically
          addressed in organizational science.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {questions.map((question, index) => {
            const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
            return (
              <div
                key={index}
                className="relative p-6 pl-20 bg-slate-800/30 rounded-xl border border-slate-700/50 overflow-hidden"
              >
                {/* Large background Roman numeral */}
                <span
                  aria-hidden="true"
                  className="absolute -left-2 top-1/2 -translate-y-1/2 font-serif text-8xl font-normal select-none pointer-events-none [color:transparent] [-webkit-text-stroke:1.5px_rgba(226,176,85,0.25)]"
                >
                  {romanNumerals[index]}
                </span>
                <p className="text-marble-100 leading-relaxed relative z-10">{question}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// COLLABORATION OPPORTUNITIES SECTION
// ============================================================================
function CollaborationSection() {
  const opportunities = [
    {
      icon: <Database className="w-7 h-7" />,
      title: 'Data Access Partnership',
      description:
        'Academic researchers can apply for access to anonymized SOIL datasets for scholarly research. We prioritize projects that advance fundamental understanding of organizational mortality.',
    },
    {
      icon: <Handshake className="w-7 h-7" />,
      title: 'Methodology Co-Development',
      description:
        'We\'re actively seeking input on our data collection instruments, analytical frameworks, and research protocols. Published methodological papers will include academic co-authors.',
    },
    {
      icon: <FileText className="w-7 h-7" />,
      title: 'Joint Publications',
      description:
        'We welcome collaboration on peer-reviewed publications. Our commitment: rigorous methods, transparent limitations, and contribution to open science.',
    },
    {
      icon: <GraduationCap className="w-7 h-7" />,
      title: 'Visiting Researcher Program',
      description:
        'Spend time with the SOIL team, work directly with emerging data, and contribute to building the field.',
      comingSoon: true,
    },
  ]

  return (
    <>
      {/* Gradient transition into section */}
      <div className="h-24 bg-gradient-to-b from-slate-900 to-marble-950" />

      <section className="py-16 md:py-24 bg-marble-950 relative">
        <div className="max-w-content mx-auto px-6">
          <h2 className="font-display text-3xl md:text-4xl font-medium mb-6 text-marble-100">
            Collaboration Opportunities
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mb-12">
            We believe in open science and collaborative research. Join us in building a new field.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {opportunities.map((opportunity, index) => (
              <Card key={index} variant="dark-elevated" padding="lg" className="h-full">
                <CardHeader>
                  <div className="w-14 h-14 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 mb-2">
                    {opportunity.icon}
                  </div>
                  <div className="flex items-center gap-3">
                    <CardTitle variant="dark">{opportunity.title}</CardTitle>
                    {opportunity.comingSoon && (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-gold-500/20 text-gold-400">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 leading-relaxed">{opportunity.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gradient transition out of section */}
      <div className="h-24 bg-gradient-to-b from-marble-950 to-slate-900" />

      {/* Decorative divider */}
      <div className="divider-roman py-12 md:py-16">
        <span className="text-gold-400 font-serif text-sm tracking-[0.3em] px-6">✦</span>
      </div>
    </>
  )
}

// ============================================================================
// WHAT MAKES SOIL DIFFERENT - COMPARISON TABLE
// ============================================================================
function ComparisonSection() {
  const comparisons = [
    {
      traditional: 'Case studies of notable failures',
      soil: 'Systematic data across hundreds/thousands of organizations',
    },
    {
      traditional: 'Post-hoc narrative reconstruction',
      soil: 'Structured data collection with consistent methodology',
    },
    {
      traditional: 'Single theoretical framework',
      soil: 'Multi-framework analysis, letting data reveal patterns',
    },
    {
      traditional: 'Focus on what went wrong',
      soil: 'Comprehensive organizational state at peak and decline',
    },
    {
      traditional: 'Anecdotal lessons',
      soil: 'Statistical patterns and predictive models',
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>our approach</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
            What Makes SOIL Different
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            We&apos;re not just studying failure differently — we&apos;re building the infrastructure
            for an entirely new approach to organizational science.
          </p>
        </div>

        <div className="flex justify-center">
          <Card variant="dark-elevated" padding="lg" className="w-full max-w-4xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-4 px-6 font-display text-lg font-medium text-slate-400">
                      Traditional Failure Research
                    </th>
                    <th className="text-left py-4 px-6 font-display text-lg font-medium text-gold-400">
                      SOIL Approach
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((row, index) => (
                    <tr key={index} className="border-b border-slate-800/50 last:border-b-0">
                      <td className="py-4 px-6 text-slate-400">{row.traditional}</td>
                      <td className="py-4 px-6 text-marble-100">{row.soil}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// OUR COMMITMENTS SECTION
// ============================================================================
function CommitmentsSection() {
  const commitments = [
    {
      icon: <Shield className="w-7 h-7" />,
      title: 'Research Integrity',
      points: [
        'Transparent methodology, publicly documented',
        'Honest about limitations and selection biases',
        'Peer review for all major publications',
        'No predetermined conclusions',
      ],
    },
    {
      icon: <Heart className="w-7 h-7" />,
      title: 'Data Ethics',
      points: [
        'Founder consent and control over their data',
        'Anonymization by default for research use',
        'No harmful applications (discrimination, exploitation)',
        'Clear separation between research and commercial operations',
      ],
    },
    {
      icon: <Globe className="w-7 h-7" />,
      title: 'Open Science',
      points: [
        'Methodological papers publicly available',
        'Anonymized datasets released for replication',
        'Research findings shared with academic community',
      ],
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        <SectionLabel>our principles</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
          Our Commitments
        </h2>
        <p className="text-lg text-slate-400 max-w-3xl mb-12">
          Building trust through transparency and ethical practice.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {commitments.map((commitment, index) => (
            <div key={index} className="space-y-6">
              <div className="w-14 h-14 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400">
                {commitment.icon}
              </div>
              <h3 className="font-display text-xl font-medium text-marble-100">
                {commitment.title}
              </h3>
              <ul className="space-y-3">
                {commitment.points.map((point, pointIndex) => (
                  <li key={pointIndex} className="flex items-start gap-3 text-slate-400">
                    <span className="text-gold-500 mt-1.5">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// CURRENT STATUS SECTION
// ============================================================================
function CurrentStatusSection() {
  const statusItems = [
    'Building data collection infrastructure',
    'Conducting initial organizational autopsies',
    'Forming academic advisory relationships',
    'Preparing first methodological publications',
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left column: Label, Title, Description */}
          <div>
            <SectionLabel>current status</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
              Ground Floor of a New Field
            </h2>
            <p className="text-lg text-slate-400">
              SOIL is in active development. This is the ground floor of a new field. The
              foundational papers haven&apos;t been written. The canonical datasets don&apos;t exist. The
              theoretical frameworks haven&apos;t been tested.
            </p>
          </div>

          {/* Right column: Status items */}
          <div>
            <p className="text-lg text-gold-400/80 italic mb-6">
              We are currently:
            </p>
            <div className="space-y-4">
              {statusItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-gold-500" />
                  <span className="text-marble-100">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// GET INVOLVED SECTION
// ============================================================================
function GetInvolvedSection() {
  const audiences = [
    {
      icon: <Users className="w-7 h-7" />,
      title: 'For Academic Researchers',
      description: 'Email us with your research interests and how they connect to organizational mortality, your institutional affiliation, and what form of collaboration interests you.',
      email: 'research@soil.rip',
    },
    {
      icon: <GraduationCap className="w-7 h-7" />,
      title: 'For PhD Students',
      description: 'We welcome dissertation projects using SOIL data and methodology. Contact us to discuss possibilities for your research.',
      email: 'research@soil.rip',
    },
    {
      icon: <Handshake className="w-7 h-7" />,
      title: 'For Institutional Partners',
      description: 'Universities and research institutes interested in formal partnerships are welcome to reach out.',
      email: 'partnerships@soil.rip',
    },
  ]

  return (
    <section id="get-involved" className="py-16 md:py-24 bg-slate-900/50">
      <div className="max-w-content mx-auto px-6">
        <SectionLabel>get involved</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
          Join the Research Community
        </h2>
        <p className="text-lg text-slate-400 max-w-3xl mb-12">
          We&apos;re building something new. If you&apos;re interested in being part of it, reach out.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {audiences.map((audience, index) => (
            <Card key={index} variant="dark-elevated" padding="lg" className="h-full flex flex-col">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 mb-2">
                  {audience.icon}
                </div>
                <CardTitle variant="dark">{audience.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-slate-400 leading-relaxed flex-1 mb-6">{audience.description}</p>
                <a href={`mailto:${audience.email}`}>
                  <Button
                    variant={index === 2 ? 'light-primary' : 'dark-primary'}
                    size="lg"
                    className="w-full"
                    rightIcon={<Mail className="w-4 h-4" />}
                  >
                    {audience.email}
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// ADVISORY BOARD SECTION
// ============================================================================
// Team Member Card Component
interface TeamMemberProps {
  name: string
  role: string
  imageUrl?: string
  accentWord?: string
}

function TeamMemberCard({ name, role, accentWord }: TeamMemberProps) {
  return (
    <div className="relative group">
      {/* Card with image placeholder */}
      <div className="relative bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-2xl overflow-hidden aspect-[3/4] w-full max-w-[280px]">
        {/* Vertical accent word */}
        {accentWord && (
          <span
            className="absolute right-4 top-1/2 -translate-y-1/2 font-display text-6xl font-bold select-none pointer-events-none opacity-10 [writing-mode:vertical-rl] text-marble-100"
          >
            {accentWord}
          </span>
        )}

        {/* Placeholder for photo - decorative pattern */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-slate-600/50 flex items-center justify-center">
            <span className="text-4xl text-slate-500 font-display font-semibold">
              {name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        </div>

        {/* Gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-900/90 to-transparent" />
      </div>

      {/* Name and role below card */}
      <div className="mt-4">
        <h3 className="font-display text-lg font-medium text-marble-100">{name}</h3>
        <p className="text-slate-500 text-sm">/ {role} /</p>
      </div>
    </div>
  )
}

function AdvisoryBoardSection() {
  // Placeholder advisors - to be replaced with real data
  const advisors: TeamMemberProps[] = [
    { name: 'To Be Announced', role: 'Organizational Studies', accentWord: 'Research' },
    { name: 'To Be Announced', role: 'Entrepreneurship', accentWord: 'Strategy' },
    { name: 'To Be Announced', role: 'Data Science', accentWord: 'Analytics' },
    { name: 'To Be Announced', role: 'Systems Theory', accentWord: 'Systems' },
    { name: 'To Be Announced', role: 'Economics', accentWord: 'Economics' },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-16">
          {/* Left column: Content */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <SectionLabel>advisory board</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
              Research Advisory Board
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              We are actively forming our research advisory board. If you&apos;re a senior scholar in
              organizational studies, entrepreneurship, or related fields and interested in shaping a
              new discipline, we&apos;d welcome a conversation.
            </p>

            {/* Stats placeholder */}
            <div className="mb-8">
              <span className="font-display text-5xl md:text-6xl font-semibold text-gradient-gold">
                +5
              </span>
              <p className="text-marble-100 mt-2">Advisory positions forming</p>
            </div>

            <Button
              variant="dark-secondary"
              size="lg"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Join Advisory Board
            </Button>
          </div>

          {/* Right column: Staggered team cards grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {/* First column - starts at top */}
            <div className="space-y-6">
              <TeamMemberCard {...advisors[0]} />
            </div>

            {/* Second column - offset down */}
            <div className="space-y-6 mt-16">
              <TeamMemberCard {...advisors[1]} />
              <TeamMemberCard {...advisors[3]} />
            </div>

            {/* Third column - slight offset */}
            <div className="space-y-6 mt-8 hidden md:block">
              <TeamMemberCard {...advisors[2]} />
              <TeamMemberCard {...advisors[4]} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// RESEARCH PAGE
// Header, Footer, MenuTransition, and GlobalParticles are provided by AppShell.
// ============================================================================
export default function ResearchPage() {
  return (
    <>
      <HeroSection />
      <ResearchGapSection />
      <WhatWeAreBuildingSection />
      <ResearchQuestionsSection />
      <CollaborationSection />
      <ComparisonSection />
      <CommitmentsSection />
      <CurrentStatusSection />
      <AdvisoryBoardSection />
      <GetInvolvedSection />
    </>
  )
}
