'use client'

import { useMemo, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Create glow texture
function createGlowTexture(): THREE.CanvasTexture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  const gradient = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  )

  gradient.addColorStop(0, 'rgba(255, 220, 150, 1)')
  gradient.addColorStop(0.15, 'rgba(255, 200, 100, 0.7)')
  gradient.addColorStop(0.4, 'rgba(201, 148, 61, 0.3)')
  gradient.addColorStop(0.7, 'rgba(201, 148, 61, 0.05)')
  gradient.addColorStop(1, 'rgba(201, 148, 61, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

let glowTexture: THREE.CanvasTexture | null = null
function getGlowTexture(): THREE.CanvasTexture {
  if (!glowTexture) {
    glowTexture = createGlowTexture()
  }
  return glowTexture
}

function noise(x: number, y: number): number {
  return Math.sin(x * 1.2 + y * 0.9) * 0.5 + Math.sin(y * 1.1 + x * 0.8) * 0.3
}

interface VisitorParticleProps {
  seed: number
  scrollY: number
  documentHeight: number
  viewportHeight: number
  viewportWidth: number
}

function VisitorParticle({ seed, scrollY, documentHeight, viewportHeight, viewportWidth }: VisitorParticleProps) {
  const spriteRef = useRef<THREE.Sprite>(null)
  const texture = useMemo(() => getGlowTexture(), [])

  // Unique config per particle
  const config = useRef({
    speed: 35 + seed * 25 + Math.random() * 25, // 35-110 px/sec
    xBase: (0.15 + Math.random() * 0.7) * viewportWidth, // 15-85% of screen width
    yOffset: seed * 1200 + Math.random() * 800, // Staggered start positions
    // Curve parameters - each particle has unique curve shape
    curveAmplitude: 80 + Math.random() * 120, // How wide the curves are (80-200px)
    curveFrequency: 0.0008 + Math.random() * 0.0006, // How often it curves
    curvePhase: Math.random() * Math.PI * 2, // Starting phase
    // Secondary wobble for organic feel
    wobbleAmp: 15 + Math.random() * 20,
    wobbleFreq: 0.003 + Math.random() * 0.002,
    // Random stop chance per particle (some particles stop more often)
    stopChance: 0.002 + Math.random() * 0.003, // 0.2-0.5% chance per frame when moving
    // Chance to reverse direction
    reverseChance: 0.001 + Math.random() * 0.002, // 0.1-0.3% chance per frame
  })

  const state = useRef({
    documentY: config.current.yOffset % documentHeight,
    pauseUntil: 0,
    lastStopY: -1000, // Last Y where we stopped (to avoid stopping too close)
    lastTime: 0,
    currentSpeed: config.current.speed, // For smooth acceleration/deceleration
    targetSpeed: config.current.speed,
    direction: 1, // 1 = down, -1 = up
    reverseUntil: 0, // Time until we stop going in reverse
  })

  useFrame((frameState) => {
    if (!spriteRef.current) return

    const time = frameState.clock.elapsedTime
    const deltaTime = Math.min(time - state.current.lastTime, 0.1)
    state.current.lastTime = time

    const s = state.current
    const c = config.current

    const isPaused = time < s.pauseUntil

    // Check if reverse period ended
    if (s.direction === -1 && time > s.reverseUntil) {
      s.direction = 1 // Back to going down
    }

    // Smooth speed transitions (ease in/out)
    const speedLerpFactor = 2.5 * deltaTime // How fast to change speed
    if (isPaused) {
      s.targetSpeed = 0
    } else {
      s.targetSpeed = c.speed * s.direction
    }
    s.currentSpeed += (s.targetSpeed - s.currentSpeed) * speedLerpFactor

    // Move with current (smoothed) speed
    s.documentY += s.currentSpeed * deltaTime

    if (!isPaused && s.direction === 1) {
      // Random chance to stop (if far enough from last stop)
      const distanceFromLastStop = Math.abs(s.documentY - s.lastStopY)
      if (distanceFromLastStop > 600 && Math.random() < c.stopChance) {
        s.pauseUntil = time + 2 + Math.random() * 4 // Stop for 2-6 seconds
        s.lastStopY = s.documentY
      }

      // Random chance to reverse (scroll back up)
      if (s.documentY > 400 && Math.random() < c.reverseChance) {
        s.direction = -1
        s.reverseUntil = time + 1 + Math.random() * 3 // Go up for 1-4 seconds
      }
    }

    // Keep in bounds
    if (s.documentY < -100) {
      s.documentY = -100
      s.direction = 1
    }

    // Reset when past document
    if (s.documentY > documentHeight + 100) {
      s.documentY = -100
      s.lastStopY = -1000
      s.direction = 1
    }

    // Calculate curved X position based on documentY
    // Main curve - smooth S-curves through the page
    const mainCurve = Math.sin(s.documentY * c.curveFrequency + c.curvePhase) * c.curveAmplitude
    // Secondary wobble for organic movement
    const wobble = Math.sin(s.documentY * c.wobbleFreq + time * 0.5) * c.wobbleAmp
    // Combine for final X
    const curvedX = c.xBase + mainCurve + wobble

    // Keep X in bounds
    const finalX = Math.max(40, Math.min(viewportWidth - 40, curvedX))

    // Convert document Y to screen Y
    const screenY = (viewportHeight / 2) - (s.documentY - scrollY)

    // Convert to centered coordinates for Three.js
    const threeX = finalX - viewportWidth / 2
    const threeY = screenY

    spriteRef.current.position.set(threeX, threeY, 0)

    // Opacity pulsing
    const material = spriteRef.current.material as THREE.SpriteMaterial
    const basePulse = Math.sin(time * (0.6 + seed * 0.15) + seed * 5) * 0.12
    const pauseBoost = isPaused ? 0.25 : 0
    // Fade out when off screen
    const onScreen = screenY > -viewportHeight / 2 - 50 && screenY < viewportHeight / 2 + 50
    material.opacity = onScreen ? (0.5 + basePulse + pauseBoost) : 0
  })

  const size = 30 + seed * 12

  return (
    <sprite ref={spriteRef} scale={[size, size, 1]}>
      <spriteMaterial
        map={texture}
        transparent
        opacity={0.6}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </sprite>
  )
}

function ParticlesScene({ scrollY, documentHeight }: { scrollY: number; documentHeight: number }) {
  const { size } = useThree()

  return (
    <>
      <VisitorParticle
        seed={0}
        scrollY={scrollY}
        documentHeight={documentHeight}
        viewportHeight={size.height}
        viewportWidth={size.width}
      />
      <VisitorParticle
        seed={1}
        scrollY={scrollY}
        documentHeight={documentHeight}
        viewportHeight={size.height}
        viewportWidth={size.width}
      />
      <VisitorParticle
        seed={2}
        scrollY={scrollY}
        documentHeight={documentHeight}
        viewportHeight={size.height}
        viewportWidth={size.width}
      />
      <VisitorParticle
        seed={3}
        scrollY={scrollY}
        documentHeight={documentHeight}
        viewportHeight={size.height}
        viewportWidth={size.width}
      />
    </>
  )
}

export function GlobalParticles() {
  const [scrollY, setScrollY] = useState(0)
  const [documentHeight, setDocumentHeight] = useState(5000)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    const updateHeight = () => {
      setDocumentHeight(document.documentElement.scrollHeight)
    }

    handleScroll()
    updateHeight()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', updateHeight)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateHeight)
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      <Canvas
        orthographic
        camera={{
          zoom: 1,
          position: [0, 0, 100],
          near: 0.1,
          far: 1000,
        }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent', pointerEvents: 'none' }}
      >
        <ParticlesScene scrollY={scrollY} documentHeight={documentHeight} />
      </Canvas>
    </div>
  )
}
