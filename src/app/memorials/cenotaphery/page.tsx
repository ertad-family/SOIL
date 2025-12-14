'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

// Dynamic import to avoid SSR issues with Three.js
const CenotapheryScene = dynamic(
  () => import('@/components/three/cenotaphery/CenotapheryScene').then(mod => ({ default: mod.CenotapheryScene })),
  { ssr: false }
)

/**
 * Cenotaphery page - 3D pentagonal memorial space
 * Route: /memorials/cenotaphery
 *
 * Renders as a full-screen overlay (like MenuTransition)
 * to cover the AppShell header/footer completely.
 */
export default function CenotapheryPage() {
  return (
    <div className="fixed inset-0 z-50 bg-[#050508]">
      <Suspense fallback={
        <div className="flex items-center justify-center h-full">
          <div className="text-marble-400 font-display text-xl tracking-wide">
            Loading Cenotaphery...
          </div>
        </div>
      }>
        <CenotapheryScene className="w-full h-full" />
      </Suspense>

      {/* Overlay UI */}
      <div className="absolute top-6 left-6 pointer-events-none">
        <p className="text-gold-500 text-sm font-sans uppercase tracking-widest mb-1">
          [ cenotaphery ]
        </p>
        <h1 className="text-marble-100 font-display text-2xl font-semibold tracking-wide">
          Federal Cenotaphery
        </h1>
      </div>

      {/* Navigation hint */}
      <div className="absolute bottom-6 right-6 text-right pointer-events-none">
        <p className="text-slate-500 text-xs font-mono uppercase tracking-wider">
          Drag: rotate view
        </p>
        <p className="text-slate-500 text-xs font-mono uppercase tracking-wider">
          Scroll: zoom
        </p>
        <p className="text-slate-500 text-xs font-mono uppercase tracking-wider">
          WASD / Arrows: move
        </p>
        <p className="text-slate-500 text-xs font-mono uppercase tracking-wider">
          Q/E: up/down
        </p>
      </div>

      {/* Back link */}
      <Link
        href="/memorials"
        className="absolute top-6 right-6 text-marble-400 hover:text-gold-500 transition-colors text-sm font-sans"
      >
        &larr; Back to Memorials
      </Link>
    </div>
  )
}
