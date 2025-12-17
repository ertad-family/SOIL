'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

// Map portal sections to page routes
const SECTION_TO_ROUTE: Record<string, string> = {
  home: '/',
  research: '/research',
  community: '/community',
  memorials: '/memorials',
  account: '/account',
  diagnostics: '/diagnostics',
  education: '/education',
  clinic: '/clinic',
}

// Map routes to sections (reverse lookup)
const ROUTE_TO_SECTION: Record<string, string> = {
  '/': 'home',
  '/research': 'research',
  '/community': 'community',
  '/memorials': 'memorials',
  '/account': 'account',
  '/login': 'account',
  '/signup': 'account',
  '/diagnostics': 'diagnostics',
  '/education': 'education',
  '/clinic': 'clinic',
}

interface MenuContextType {
  isOpen: boolean
  currentSection: string
  openMenu: () => void
  closeMenu: () => void
  navigateViaPortal: (section: string | null) => void
}

const MenuContext = createContext<MenuContextType | null>(null)

export function MenuProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Derive current section from pathname
  const currentSection = ROUTE_TO_SECTION[pathname] || 'home'

  const openMenu = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Called when user clicks a portal in the menu
  // Navigation happens under the opaque overlay, then overlay fades out
  const navigateViaPortal = useCallback((section: string | null) => {
    if (!section) return

    const route = SECTION_TO_ROUTE[section]
    const currentRoute = SECTION_TO_ROUTE[currentSection]

    if (route && route !== currentRoute) {
      // Navigate to different page
      router.push(route)
    }
    // Menu will be closed by the MenuTransition after fade-out completes
  }, [router, currentSection])

  return (
    <MenuContext.Provider
      value={{
        isOpen,
        currentSection,
        openMenu,
        closeMenu,
        navigateViaPortal,
      }}
    >
      {children}
    </MenuContext.Provider>
  )
}

export function useMenu() {
  const context = useContext(MenuContext)
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider')
  }
  return context
}
