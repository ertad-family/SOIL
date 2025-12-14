'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { FooterLandscape } from '@/components/three/FooterLandscape'

export function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!footerRef.current) return

      const rect = footerRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const footerHeight = rect.height

      // Calculate how much of footer is scrolled
      // When footer top is at viewport bottom: progress = 0
      // When footer bottom is at viewport bottom: progress = 1
      const footerVisibleTop = viewportHeight - rect.top
      const scrollableDistance = footerHeight

      const progress = Math.max(0, Math.min(1, footerVisibleTop / scrollableDistance))
      setScrollProgress(progress)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <footer ref={footerRef} className="bg-marble-950 relative">
      {/* Wireframe landscape background */}
      <div className="absolute inset-0 overflow-hidden">
        <Suspense fallback={null}>
          <FooterLandscape className="w-full h-full" scrollProgress={scrollProgress} />
        </Suspense>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 max-w-content mx-auto px-6 py-48">
        <div className="flex flex-col items-center gap-6">
          <div className="font-serif text-2xl tracking-wider text-marble-300">
            S<span className="text-gold-500">&middot;</span>O<span className="text-gold-500">&middot;</span>I
            <span className="text-gold-500">&middot;</span>L
          </div>
          <p className="font-ui text-sm uppercase tracking-widest text-marble-500">
            Social Organizational Intelligence Lab
          </p>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
          <p className="text-xs text-marble-600">&copy; 2025 SOIL. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
