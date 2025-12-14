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
} from 'lucide-react'

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
    <section className="py-16 md:py-24 border-t border-slate-800 bg-slate-900/50">
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
      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="max-w-content mx-auto px-6">
          <SectionLabel>soil research program</SectionLabel>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-wide mt-4 mb-6 text-marble-100">
            Research Program
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl">
            Building the foundation for Organizational Biology, Health, and Medicine — a new
            scientific discipline based on systematic study of organizational mortality.
          </p>
        </div>
      </section>

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
