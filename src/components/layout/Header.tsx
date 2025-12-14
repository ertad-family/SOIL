'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sun, Moon } from 'lucide-react'
import { useMenu } from '@/contexts/MenuContext'

const NAV_LINKS = [
  { href: '/research', label: 'Research' },
  { href: '/memorials', label: 'Memorials' },
  { href: '/community', label: 'Community' },
]

interface HeaderProps {
  isDarkMode: boolean
  onThemeToggle: () => void
  showThemeToggle?: boolean
}

export function Header({ isDarkMode, onThemeToggle, showThemeToggle = true }: HeaderProps) {
  const { openMenu } = useMenu()
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-lg">
      <div className="max-w-content mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-serif text-2xl font-semibold tracking-wider !text-marble-100 hover:!text-marble-100">
            S<span className="text-gold-400">&middot;</span>O<span className="text-gold-400">&middot;</span>I
            <span className="text-gold-400">&middot;</span>L
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-sans text-sm font-bold uppercase tracking-wide transition-colors ${
                    isActive
                      ? '!text-gold-400'
                      : '!text-slate-400 hover:!text-marble-100'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
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
