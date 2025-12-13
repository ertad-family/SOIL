'use client'

import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import DodecahedronScene to avoid SSR issues with Three.js
const DodecahedronScene = dynamic(
  () => import('@/components/three/DodecahedronScene').then(mod => ({ default: mod.DodecahedronScene })),
  { ssr: false }
)

// Animation durations (ms)
const FADE_IN_DURATION = 600  // Fade in overlay
const FADE_OUT_DURATION = 600 // Fade out overlay

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

  // Ref to trigger fly-out animation in the scene
  const triggerFlyOutRef = useRef<(() => void) | null>(null)

  // Track if scene is ready (preloaded)
  const [sceneReady, setSceneReady] = useState(false)

  // Start transition when isActive changes to true
  useEffect(() => {
    if (isActive && phase === 'idle') {
      // Start fade-in animation
      setPhase('fadingIn')

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
          setPhase('flyingOut')

          // Trigger fly-out animation in the scene
          // Small delay to ensure scene is visible
          setTimeout(() => {
            triggerFlyOutRef.current?.()
          }, 50)
        }
      }

      requestAnimationFrame(animateFadeIn)
    }
  }, [isActive, phase])

  // Handle fade progress from scene during fly-out
  const handleSceneFadeProgress = useCallback((progress: number) => {
    if (phase === 'flyingOut') {
      setFadeOpacity(progress)
    }
  }, [phase])

  // Handle fly-out completion
  const handleFlyOutComplete = useCallback(() => {
    setPhase('menu')
    setFadeOpacity(0)
    onTransitionComplete?.()
  }, [onTransitionComplete])

  // Handle fly-in START (portal double-clicked, animation about to begin)
  // This is called BEFORE animation starts, so we can set phase to receive fade progress
  const handleFlyInStart = useCallback((faceId: number, section: string | null) => {
    setPhase('flyingIn')
    onNavigate?.(section)
  }, [onNavigate])

  // Handle fly-in fade progress (scene reports 0→1)
  const handleFlyInFadeProgress = useCallback((progress: number) => {
    if (phase === 'flyingIn') {
      setFadeOpacity(progress)

      // When fade reaches 1, start fading out to reveal page
      if (progress >= 1) {
        setPhase('fadingOut')
        setSceneVisible(false)

        let startTime: number | null = null
        const animateFadeOut = (currentTime: number) => {
          if (startTime === null) {
            startTime = currentTime
          }

          const elapsed = currentTime - startTime
          const prog = Math.min(elapsed / FADE_OUT_DURATION, 1)

          const eased = prog < 0.5
            ? 4 * prog * prog * prog
            : 1 - Math.pow(-2 * prog + 2, 3) / 2

          setFadeOpacity(1 - eased)

          if (prog < 1) {
            requestAnimationFrame(animateFadeOut)
          } else {
            setPhase('idle')
            setFadeOpacity(0)
            onClose?.()
          }
        }

        requestAnimationFrame(animateFadeOut)
      }
    }
  }, [phase, onClose])

  // Handle closing menu without navigation (when isActive becomes false while in menu)
  useEffect(() => {
    if (!isActive && phase === 'menu') {
      // Fade in overlay, hide scene, fade out overlay
      setPhase('fadingOut')

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
              setPhase('idle')
              setFadeOpacity(0)
              onClose?.()
            }
          }

          requestAnimationFrame(animateFadeOut)
        }
      }

      requestAnimationFrame(animateFadeIn)
    }
  }, [isActive, phase, onClose])

  // Combined fade progress handler
  const handleFadeProgress = useCallback((progress: number) => {
    if (phase === 'flyingOut') {
      handleSceneFadeProgress(progress)
    } else if (phase === 'flyingIn') {
      handleFlyInFadeProgress(progress)
    }
  }, [phase, handleSceneFadeProgress, handleFlyInFadeProgress])

  return (
    <>
      {/* Fade overlay - FULLY OPAQUE, z-[100] to cover header */}
      {fadeOpacity > 0 && (
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
          }}
        />
      )}

      {/* DodecahedronScene - ALWAYS MOUNTED (preloaded), visibility controlled */}
      <div
        className="fixed inset-0 z-[90]"
        style={{
          visibility: sceneVisible ? 'visible' : 'hidden',
          pointerEvents: sceneVisible ? 'auto' : 'none',
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
    </>
  )
}
