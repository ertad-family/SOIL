'use client'

import { Button } from '@/components/ui/button'
import { SectionLabel } from '@/components/ui/section-label'
import { BookOpen, Database, TrendingUp } from 'lucide-react'

// ============================================================================
// THE RESEARCH GAP SECTION (moved from Landing)
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
          Despite decades of organizational research, we still lack systematic understanding of how and why organizations end.
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
// RESEARCH PAGE (placeholder for now)
// ============================================================================
export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-marble-100">
      {/* Temporary header */}
      <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-lg">
        <div className="max-w-content mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="font-serif text-2xl font-semibold tracking-wider">
              S<span className="text-gold-400">·</span>O<span className="text-gold-400">·</span>I
              <span className="text-gold-400">·</span>L
            </a>
            <Button variant="dark-secondary" size="sm">
              Menu
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="py-20 md:py-28">
          <div className="max-w-content mx-auto px-6">
            <SectionLabel>research center</SectionLabel>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-wide mt-4 mb-6 text-marble-100">
              Research Center
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl">
              Advancing organizational theory through systematic data collection and analysis.
            </p>
          </div>
        </section>

        <ResearchGapSection />

        {/* More sections will be added later */}
        <section className="py-16 md:py-24 border-t border-slate-800">
          <div className="max-w-content mx-auto px-6 text-center">
            <p className="text-slate-500 italic">More research content coming soon...</p>
          </div>
        </section>
      </main>

      {/* Temporary footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900">
        <div className="max-w-content mx-auto px-6 py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="font-serif text-xl tracking-wider text-slate-400">
              S<span className="text-gold-400">·</span>O<span className="text-gold-400">·</span>I
              <span className="text-gold-400">·</span>L
            </div>
            <p className="text-xs text-slate-600">© 2025 SOIL. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
