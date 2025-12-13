'use client'

import { useState, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Sun, Moon } from 'lucide-react'
import {
  HeroSection,
  MissionsSection,
  MethodologySection,
  PartnersSection,
  CommunitySection,
  TestimonialsSliderSection,
  ScopeSection,
  GetInvolvedSection,
} from '@/components/sections'
import { FooterLandscape } from '@/components/three/FooterLandscape'

// ============================================================================
// FOOTER - Black marble with wireframe landscape
// ============================================================================
function Footer() {
  return (
    <footer className="bg-marble-950 relative">
      {/* Wireframe landscape background */}
      <div className="absolute inset-0 overflow-hidden">
        <Suspense fallback={null}>
          <FooterLandscape className="w-full h-full" />
        </Suspense>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 max-w-content mx-auto px-6 py-32">
        <div className="flex flex-col items-center gap-6">
          <div className="font-serif text-2xl tracking-wider text-marble-300">
            S<span className="text-gold-500">·</span>O<span className="text-gold-500">·</span>I
            <span className="text-gold-500">·</span>L
          </div>
          <p className="font-ui text-sm uppercase tracking-widest text-marble-500">
            Social Organizational Intelligence Lab
          </p>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
          <p className="text-xs text-marble-600">© 2025 SOIL. All rights reserved.</p>
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
          <TestimonialsSliderSection />

          {/* Decorative divider between Testimonials and Ecosystem */}
          <div className="divider-roman py-12 md:py-16">
            <span className="text-gold-400 font-serif text-sm tracking-[0.3em] px-6">✦</span>
          </div>

          <ScopeSection />
          <GetInvolvedSection />
        </main>

        <Footer />
      </div>
    </div>
  )
}
