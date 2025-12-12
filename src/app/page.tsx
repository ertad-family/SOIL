'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sun, Moon } from 'lucide-react'
import {
  HeroSection,
  MissionsSection,
  MethodologySection,
  PartnersSection,
  CommunitySection,
  ScopeSection,
  GetInvolvedSection,
  AboutSection,
} from '@/components/sections'

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
          <PartnersSection />
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
