'use client'

import { Button } from '@/components/ui/button'
import { Sun, Moon } from 'lucide-react'
import { useMenu } from '@/contexts/MenuContext'

interface HeaderProps {
  isDarkMode: boolean
  onThemeToggle: () => void
  showThemeToggle?: boolean
}

export function Header({ isDarkMode, onThemeToggle, showThemeToggle = true }: HeaderProps) {
  const { openMenu } = useMenu()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-lg">
      <div className="max-w-content mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="font-serif text-2xl font-semibold tracking-wider">
            S<span className="text-gold-400">&middot;</span>O<span className="text-gold-400">&middot;</span>I
            <span className="text-gold-400">&middot;</span>L
          </div>
          <div className="flex items-center gap-4">
            {showThemeToggle && (
              <button
                onClick={onThemeToggle}
                className="p-2 rounded-sm text-slate-400 hover:text-gold-400 transition-colors"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}
            <Button variant="dark-secondary" size="sm" onClick={openMenu}>
              Menu
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
