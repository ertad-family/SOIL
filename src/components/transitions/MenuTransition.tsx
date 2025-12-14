'use client'

import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import DodecahedronScene to avoid SSR issues with Three.js
const DodecahedronScene = dynamic(
  () => import('@/components/three/DodecahedronScene').then(mod => ({ default: mod.DodecahedronScene })),
  { ssr: false }
)

// Animation durations (ms)
const FADE_IN_DURATION = 600   // Fade in overlay
const FADE_OUT_DURATION = 1200 // Fade out overlay (slower for smoother reveal)

// Transition phases
export type TransitionPhase =
  | 'idle'           // Scene hidden, page visible
  | 'fadingIn'       // Fading in overlay over page
  | 'flyingOut'      // Overlay opaque, camera flying out of dodecahedron
  | 'menu'           // Menu is active, user can interact
  | 'flyingIn'       // Camera flying into dodecahedron
  | 'fadingOut'      // Fading out overlay to reveal page

export interface MenuTransitionProps {
  isActive: boolean                              // true when menu should be shown
  exitPortalSection?: string                     // Which portal to exit through (default: 'home')
  onTransitionComplete?: () => void              // Called when fully transitioned to menu
  onNavigate?: (section: string | null) => void  // Called when portal clicked in menu
  onClose?: () => void                           // Called when returning to page completes
}

export function MenuTransition({
  isActive,
  exitPortalSection = 'home',
  onTransitionComplete,
  onNavigate,
  onClose,
}: MenuTransitionProps) {
  const [phase, setPhase] = useState<TransitionPhase>('idle')
  const [fadeOpacity, setFadeOpacity] = useState(0)
  const [sceneVisible, setSceneVisible] = useState(false)

  // Ref to track phase without stale closure issues in callbacks
  const phaseRef = useRef<TransitionPhase>('idle')

  // Ref to trigger fly-out animation in the scene
  const triggerFlyOutRef = useRef<(() => void) | null>(null)

  // Track if scene is ready (preloaded)
  const [sceneReady, setSceneReady] = useState(false)

  // Store target section for navigation (called when fade completes)
  const pendingNavigationRef = useRef<string | null>(null)

  // Helper to update both phase state and ref
  const updatePhase = useCallback((newPhase: TransitionPhase) => {
    phaseRef.current = newPhase
    setPhase(newPhase)
  }, [])

  // Track if we're using CSS transition for fade-out (arrival from menu)
  const [useCssTransition, setUseCssTransition] = useState(false)

  // Check on mount if we're arriving from menu navigation (need to fade-out)
  useEffect(() => {
    const transitionFlag = sessionStorage.getItem('menuTransition')
    if (transitionFlag === 'fadeOut') {
      sessionStorage.removeItem('menuTransition')

      // Start with full opacity overlay
      setFadeOpacity(1)
      updatePhase('fadingOut')
      setUseCssTransition(true)

      // CRITICAL: We need TWO animation frames to ensure CSS sees opacity=1 first
      // Frame 1: Browser paints with opacity=1
      // Frame 2: We set opacity=0, CSS transition kicks in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFadeOpacity(0)
        })
      })

      // Clean up after transition completes
      const timer = setTimeout(() => {
        updatePhase('idle')
        setUseCssTransition(false)
      }, FADE_OUT_DURATION + 100) // Add small buffer

      return () => clearTimeout(timer)
    }
  }, [updatePhase])

  // Start transition when isActive changes to true
  useEffect(() => {
    if (isActive && phase === 'idle') {
      // Start fade-in animation
      updatePhase('fadingIn')

      let startTime: number | null = null
      const animateFadeIn = (currentTime: number) => {
        // Initialize startTime on first frame to ensure proper timing
        if (startTime === null) {
          startTime = currentTime
        }

        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / FADE_IN_DURATION, 1)

        // Ease in-out cubic
        const eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2

        setFadeOpacity(eased)

        if (progress < 1) {
          requestAnimationFrame(animateFadeIn)
        } else {
          // Fade complete - show scene and start fly-out
          setFadeOpacity(1)
          setSceneVisible(true)
          updatePhase('flyingOut')

          // Trigger fly-out animation in the scene
          // Small delay to ensure scene is visible
          setTimeout(() => {
            triggerFlyOutRef.current?.()
          }, 50)
        }
      }

      requestAnimationFrame(animateFadeIn)
    }
  }, [isActive, phase, updatePhase])

  // Handle fade progress from scene during fly-out
  const handleSceneFadeProgress = useCallback((progress: number) => {
    if (phaseRef.current === 'flyingOut') {
      setFadeOpacity(progress)
    }
  }, [])

  // Handle fly-out completion
  const handleFlyOutComplete = useCallback(() => {
    updatePhase('menu')
    setFadeOpacity(0)
    onTransitionComplete?.()
  }, [onTransitionComplete, updatePhase])

  // Handle fly-in START (portal double-clicked, animation about to begin)
  // This is called BEFORE animation starts, so we can set phase to receive fade progress
  // NOTE: We don't navigate immediately - we store the section and navigate when fade = 1
  const handleFlyInStart = useCallback((faceId: number, section: string | null) => {
    pendingNavigationRef.current = section
    updatePhase('flyingIn')
  }, [updatePhase])

  // Track if we've already triggered navigation (prevent double-fire)
  const hasNavigatedRef = useRef(false)

  // Handle fly-in fade progress (scene reports 0→1)
  const handleFlyInFadeProgress = useCallback((progress: number) => {
    if (phaseRef.current === 'flyingIn') {
      setFadeOpacity(progress)

      // When fade reaches 1, navigate to new page (under the overlay)
      // Only do this once!
      if (progress >= 1 && !hasNavigatedRef.current) {
        hasNavigatedRef.current = true
        console.log('[MenuTransition] Fade complete, navigating to:', pendingNavigationRef.current)

        // Store flag so new page knows to fade-out on mount
        sessionStorage.setItem('menuTransition', 'fadeOut')

        // Navigate NOW while overlay is fully opaque
        const targetSection = pendingNavigationRef.current
        pendingNavigationRef.current = null

        // Hide scene AFTER initiating navigation to avoid breaking the animation loop
        // Use setTimeout to ensure navigation starts first
        setTimeout(() => {
          setSceneVisible(false)
        }, 50)

        onNavigate?.(targetSection)

        // Note: fade-out will be handled by the new page's MenuTransition
        // via the sessionStorage flag check on mount
      }
    }
  }, [onNavigate])

  // Handle closing menu without navigation (when isActive becomes false while in menu)
  useEffect(() => {
    if (!isActive && phase === 'menu') {
      // Fade in overlay, hide scene, fade out overlay
      updatePhase('fadingOut')

      let startTime: number | null = null
      const animateFadeIn = (currentTime: number) => {
        if (startTime === null) {
          startTime = currentTime
        }

        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / (FADE_OUT_DURATION / 2), 1)

        const eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2

        setFadeOpacity(eased)

        if (progress < 1) {
          requestAnimationFrame(animateFadeIn)
        } else {
          // Hide scene
          setSceneVisible(false)

          // Fade out
          let startTime2: number | null = null
          const animateFadeOut = (currentTime: number) => {
            if (startTime2 === null) {
              startTime2 = currentTime
            }

            const elapsed = currentTime - startTime2
            const prog = Math.min(elapsed / FADE_OUT_DURATION, 1)

            const eased = prog < 0.5
              ? 4 * prog * prog * prog
              : 1 - Math.pow(-2 * prog + 2, 3) / 2

            setFadeOpacity(1 - eased)

            if (prog < 1) {
              requestAnimationFrame(animateFadeOut)
            } else {
              updatePhase('idle')
              setFadeOpacity(0)
              onClose?.()
            }
          }

          requestAnimationFrame(animateFadeOut)
        }
      }

      requestAnimationFrame(animateFadeIn)
    }
  }, [isActive, phase, onClose, updatePhase])

  // Combined fade progress handler
  // Note: We call both handlers and let them check phase internally
  // This avoids stale closure issues with phase
  const handleFadeProgress = useCallback((progress: number) => {
    handleSceneFadeProgress(progress)
    handleFlyInFadeProgress(progress)
  }, [handleSceneFadeProgress, handleFlyInFadeProgress])

  return (
    <>
      {/* Fade overlay - FULLY OPAQUE, z-[100] to cover header */}
      {console.log('[MenuTransition] Render - fadeOpacity:', fadeOpacity, 'phase:', phase, 'useCssTransition:', useCssTransition)}
      {(fadeOpacity > 0 || useCssTransition) && (
        <div
          className="fixed inset-0 z-[100] pointer-events-none"
          style={{
            background: `radial-gradient(circle at center,
              rgba(255, 250, 240, 1) 0%,
              rgba(255, 248, 230, 1) 15%,
              rgba(245, 235, 210, 1) 30%,
              rgba(201, 180, 150, 1) 50%,
              rgba(160, 140, 170, 1) 70%,
              rgba(80, 70, 100, 1) 85%,
              rgba(20, 18, 25, 1) 100%)`,
            opacity: fadeOpacity,
            // Use CSS transition for smooth fade-out during page arrival
            // (requestAnimationFrame gets throttled during heavy rendering)
            transition: useCssTransition ? `opacity ${FADE_OUT_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)` : 'none',
          }}
        />
      )}

      {/* DodecahedronScene - Only mount when needed to avoid WebGL context conflicts */}
      {sceneVisible && (
        <div
          className="fixed inset-0 z-[90]"
          style={{
            pointerEvents: 'auto',
          }}
        >
          <Suspense fallback={null}>
            <DodecahedronScene
              className="w-full h-full"
              initialView="outside"
              exitPortalSection={exitPortalSection}
              onFlyOutComplete={handleFlyOutComplete}
              onFlyInStart={handleFlyInStart}
              initialFadeOpacity={0}
              onExternalFadeProgress={handleFadeProgress}
              hideInternalOverlay={true}
              onReady={() => setSceneReady(true)}
              triggerFlyOutRef={triggerFlyOutRef}
            />
          </Suspense>
        </div>
      )}
    </>
  )
}
