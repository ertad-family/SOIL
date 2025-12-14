'use client'

import { useState, useCallback, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sun, Moon } from 'lucide-react'
import { MenuTransition } from '@/components/transitions/MenuTransition'
import { GlobalParticles } from '@/components/three/GlobalParticles'

// Map portal sections to page routes
const SECTION_TO_ROUTE: Record<string, string> = {
  home: '/',
  research: '/research',
  community: '/community',
  memorials: '/', // TODO: create page
  diagnostics: '/', // TODO: create page
  education: '/', // TODO: create page
  clinic: '/', // TODO: create page
}

interface PageLayoutProps {
  children: React.ReactNode
  currentSection: string  // Which portal this page corresponds to (for exit animation)
  showParticles?: boolean
  showThemeToggle?: boolean
}

export function PageLayout({
  children,
  currentSection,
  showParticles = true,
  showThemeToggle = true,
}: PageLayoutProps) {
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  // Handle menu button click
  const handleMenuClick = useCallback(() => {
    setMenuOpen(true)
  }, [])

  // Handle navigation from menu (portal click)
  const handleMenuNavigate = useCallback((section: string | null) => {
    if (!section) return

    const route = SECTION_TO_ROUTE[section]
    if (route && route !== SECTION_TO_ROUTE[currentSection]) {
      // Navigate to different page
      router.push(route)
    }
    // If same page, just close menu (handled by onClose)
  }, [router, currentSection])

  // Handle menu close (transition complete back to page)
  const handleMenuClose = useCallback(() => {
    setMenuOpen(false)
  }, [])

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      {/* Global floating particles */}
      {showParticles && (
        <Suspense fallback={null}>
          <GlobalParticles />
        </Suspense>
      )}

      {/* Menu transition overlay */}
      <MenuTransition
        isActive={menuOpen}
        exitPortalSection={currentSection}
        onTransitionComplete={() => {}}
        onNavigate={handleMenuNavigate}
        onClose={handleMenuClose}
      />

      <div className="min-h-screen bg-slate-900 dark:bg-slate-900 text-marble-100">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-lg">
          <div className="max-w-content mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="font-serif text-2xl font-semibold tracking-wider">
                S<span className="text-gold-400">·</span>O<span className="text-gold-400">·</span>I
                <span className="text-gold-400">·</span>L
              </Link>
              <div className="flex items-center gap-4">
                {showThemeToggle && (
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="p-2 rounded-sm text-slate-400 hover:text-gold-400 transition-colors"
                    aria-label="Toggle theme"
                  >
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                )}
                <Button variant="dark-secondary" size="sm" onClick={handleMenuClick}>
                  Menu
                </Button>
              </div>
            </div>
          </div>
        </header>

        {children}
      </div>
    </div>
  )
}
