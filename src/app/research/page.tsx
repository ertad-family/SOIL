'use client'

import { SectionLabel } from '@/components/ui/section-label'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  BookOpen,
  Database,
  TrendingUp,
  FlaskConical,
  Scale,
  Layers,
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
  const approaches = [
    {
      icon: <FlaskConical className="w-6 h-6" />,
      title: 'Systematic Data Collection',
      description:
        'We conduct structured "autopsies" of failed organizations — capturing not just what happened, but the full organizational state: functional structure, financial dynamics, environmental conditions, founder context, and narrative meaning.',
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: 'Framework-Agnostic Methodology',
      description:
        "We don't impose a single theoretical lens. Data is collected in neutral formats and analyzed through multiple frameworks post-hoc — testing existing theories against real patterns rather than confirming preconceptions.",
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: 'Scale and Depth',
      description:
        'Our goal is thousands of comprehensive organizational autopsies, creating statistical power that enables pattern recognition, predictive modeling, and eventually intervention design.',
    },
  ]

  return (
    <section className="py-16 md:py-24 border-t border-slate-800">
      <div className="max-w-content mx-auto px-6">
        <SectionLabel>what we are building</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
          Infrastructure for a New Discipline
        </h2>
        <p className="text-lg text-slate-400 max-w-3xl mb-12">
          SOIL (Social Organizational Intelligence Lab) is creating the infrastructure for a new
          scientific discipline: <span className="text-marble-100 font-medium">Organizational Biology, Health, and Medicine</span>.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {approaches.map((approach, index) => (
            <Card key={index} variant="dark" padding="lg" className="h-full">
              <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 mb-6">
                {approach.icon}
              </div>
              <h3 className="font-display text-xl font-medium text-marble-100 mb-3">
                {approach.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">{approach.description}</p>
            </Card>
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
    <section className="py-16 md:py-24 border-t border-slate-800">
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
          {questions.map((question, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-6 bg-slate-800/30 rounded-xl border border-slate-700/50"
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 font-display text-sm font-medium">
                {index + 1}
              </span>
              <p className="text-marble-100 leading-relaxed">{question}</p>
            </div>
          ))}
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
    <section className="py-16 md:py-24 border-t border-slate-800">
      <div className="max-w-content mx-auto px-6">
        <SectionLabel>collaboration</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
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
    <section className="py-16 md:py-24 border-t border-slate-800">
      <div className="max-w-content mx-auto px-6">
        <SectionLabel>our approach</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
          What Makes SOIL Different
        </h2>
        <p className="text-lg text-slate-400 max-w-3xl mb-12">
          We&apos;re not just studying failure differently — we&apos;re building the infrastructure
          for an entirely new approach to organizational science.
        </p>

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
                <tr key={index} className="border-b border-slate-800/50">
                  <td className="py-4 px-6 text-slate-400">{row.traditional}</td>
                  <td className="py-4 px-6 text-marble-100">{row.soil}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
    <section className="py-16 md:py-24 border-t border-slate-800">
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
    <section className="py-16 md:py-24 border-t border-slate-800">
      <div className="max-w-content mx-auto px-6">
        <div className="max-w-3xl">
          <SectionLabel>current status</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
            Ground Floor of a New Field
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            SOIL is in active development. This is the ground floor of a new field. The
            foundational papers haven&apos;t been written. The canonical datasets don&apos;t exist. The
            theoretical frameworks haven&apos;t been tested.
          </p>

          <div className="space-y-4 mb-8">
            {statusItems.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-gold-500" />
                <span className="text-marble-100">{item}</span>
              </div>
            ))}
          </div>

          <p className="text-lg text-gold-400/80 italic">
            We are currently:
          </p>
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
    <section id="get-involved" className="py-16 md:py-24 border-t border-slate-800 bg-slate-900/50">
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
                  <Button variant="dark-primary" size="lg" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
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
function AdvisoryBoardSection() {
  return (
    <section className="py-16 md:py-24 border-t border-slate-800">
      <div className="max-w-content mx-auto px-6">
        <div className="max-w-3xl">
          <SectionLabel>advisory board</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
            Research Advisory Board
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            We are actively forming our research advisory board. If you&apos;re a senior scholar in
            organizational studies, entrepreneurship, or related fields and interested in shaping a
            new discipline, we&apos;d welcome a conversation.
          </p>
          <p className="text-xl text-slate-500 italic">To be announced</p>
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
      <GetInvolvedSection />
      <AdvisoryBoardSection />
    </>
  )
}
