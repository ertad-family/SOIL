'use client'

import { useState, Suspense, ReactNode } from 'react'
import { MenuProvider } from '@/contexts/MenuContext'
import { Header } from './Header'
import { Footer } from './Footer'
import { MenuTransition } from '@/components/transitions/MenuTransition'
import { GlobalParticles } from '@/components/three/GlobalParticles'
import { ContributionFab } from '@/components/ui/contribution-fab'

interface AppShellProps {
  children: ReactNode
}

/**
 * AppShell - Global layout wrapper for all pages.
 *
 * Provides:
 * - MenuProvider (global menu state)
 * - Header (sticky, with menu button)
 * - Footer (with 3D landscape)
 * - MenuTransition (single global instance)
 * - GlobalParticles (floating visitor particles)
 * - Dark mode state
 */
export function AppShell({ children }: AppShellProps) {
  const [isDarkMode, setIsDarkMode] = useState(true)

  return (
    <MenuProvider>
      <div className={isDarkMode ? 'dark' : ''}>
        {/* Global floating particles */}
        <Suspense fallback={null}>
          <GlobalParticles />
        </Suspense>

        {/* Global menu transition - single instance for entire app */}
        <MenuTransition />

        <div className="min-h-screen bg-slate-900 dark:bg-slate-900 text-marble-100 flex flex-col">
          <Header
            isDarkMode={isDarkMode}
            onThemeToggle={() => setIsDarkMode(!isDarkMode)}
          />

          {/* Page content */}
          <main className="flex-1 relative">
            {children}
            {/* Auto gradient transition to footer - applies to all pages */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-marble-950 pointer-events-none z-10" />
          </main>

          <Footer />

          {/* Floating contribution button - visible on all pages */}
          <ContributionFab />
        </div>
      </div>
    </MenuProvider>
  )
}
