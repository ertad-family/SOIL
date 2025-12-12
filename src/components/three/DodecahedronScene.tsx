'use client'

import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, useCallback, useRef, useEffect, useState } from 'react'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Dodecahedron, type PortalClickData } from './Dodecahedron'
import { VoidEnvironment } from './VoidEnvironment'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'

// Animation state for camera fly-through
interface FlyThroughState {
  isAnimating: boolean
  startTime: number
  startPos: THREE.Vector3
  targetPortalCenter: THREE.Vector3
  targetPortalNormal: THREE.Vector3
  phase: 'idle' | 'flythrough' | 'fadeout'
  targetFaceId: number
  targetSection: string | null
  onComplete: ((faceId: number, section: string | null) => void) | null
  // Waypoints for smooth path
  waypoints: {
    portalApproach: THREE.Vector3  // Point just outside portal
    portalEntry: THREE.Vector3     // Point at portal
    inside: THREE.Vector3          // Point inside dodecahedron
  } | null
}

// Easing: smooth acceleration then deceleration, but NO stop in middle
// Using sine easing for very smooth continuous motion
function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2
}

// Easing for fade (smooth in-out)
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// Animation durations (seconds)
const FLYTHROUGH_DURATION = 2.2  // Total flight time (approach + enter combined)
const FADEOUT_DURATION = 0.4    // Fog fills screen after entering

// Camera animator component - handles fly-through animation
interface CameraAnimatorProps {
  flyState: React.MutableRefObject<FlyThroughState>
  controlsRef: React.RefObject<OrbitControlsImpl | null>
  onFadeProgress: (progress: number) => void
}

function CameraAnimator({ flyState, controlsRef, onFadeProgress }: CameraAnimatorProps) {
  const { camera } = useThree()

  useFrame((state) => {
    const fs = flyState.current
    if (!fs.isAnimating || fs.phase === 'idle') return

    // Initialize waypoints on first frame
    if (fs.startTime === 0) {
      fs.startTime = state.clock.elapsedTime
      fs.startPos.copy(camera.position)

      // Calculate waypoints for the journey
      fs.waypoints = {
        portalApproach: fs.targetPortalCenter.clone()
          .add(fs.targetPortalNormal.clone().multiplyScalar(3)),
        portalEntry: fs.targetPortalCenter.clone()
          .add(fs.targetPortalNormal.clone().multiplyScalar(0.3)),
        inside: fs.targetPortalCenter.clone()
          .sub(fs.targetPortalNormal.clone().multiplyScalar(2)),
      }
    }

    const elapsed = state.clock.elapsedTime - fs.startTime

    // Disable orbit controls during animation
    if (controlsRef.current) {
      controlsRef.current.enabled = false
    }

    if (fs.phase === 'flythrough' && fs.waypoints) {
      // Single continuous flight with three segments blended together
      const t = Math.min(elapsed / FLYTHROUGH_DURATION, 1)

      // Blend between waypoints using smooth step functions
      // Segment 1: start → approach (t: 0 to 0.5)
      // Segment 2: approach → entry (t: 0.5 to 0.75)
      // Segment 3: entry → inside (t: 0.75 to 1.0)

      let pos: THREE.Vector3

      if (t < 0.5) {
        // First half: start → approach point
        const segmentT = t / 0.5
        const segmentEased = easeInOutSine(segmentT)
        pos = new THREE.Vector3().lerpVectors(fs.startPos, fs.waypoints.portalApproach, segmentEased)
      } else if (t < 0.75) {
        // Middle: approach → entry (through portal)
        const segmentT = (t - 0.5) / 0.25
        const segmentEased = easeInOutSine(segmentT)
        pos = new THREE.Vector3().lerpVectors(fs.waypoints.portalApproach, fs.waypoints.portalEntry, segmentEased)
      } else {
        // Final: entry → inside
        const segmentT = (t - 0.75) / 0.25
        const segmentEased = easeInOutSine(segmentT)
        pos = new THREE.Vector3().lerpVectors(fs.waypoints.portalEntry, fs.waypoints.inside, segmentEased)
      }

      camera.position.copy(pos)

      // Camera lookAt logic:
      // - Before entering portal (t < 0.75): look at portal center
      // - After entering (t >= 0.75): look in direction of movement (away from portal)
      if (t < 0.75) {
        // Approaching and entering: look at portal
        camera.lookAt(fs.targetPortalCenter)
      } else {
        // Inside: look in the direction we're flying (opposite to portal normal)
        // This prevents the 180° flip - we continue looking forward
        const lookAhead = pos.clone().sub(fs.targetPortalNormal.clone().multiplyScalar(5))
        camera.lookAt(lookAhead)
      }

      // Start fade when entering portal (at 70% of flight)
      if (t > 0.7) {
        const fadeT = (t - 0.7) / 0.3 // 0→1 over last 30%
        onFadeProgress(fadeT * 0.5) // Fade to 50% during flight
      }

      if (t >= 1) {
        fs.phase = 'fadeout'
        fs.startTime = state.clock.elapsedTime
      }
    } else if (fs.phase === 'fadeout') {
      // Fog fills the screen completely
      const t = Math.min(elapsed / FADEOUT_DURATION, 1)
      const eased = easeInOutCubic(t)

      // Continue fade from 50% to 100%
      onFadeProgress(0.5 + eased * 0.5)

      if (t >= 1) {
        // Animation complete - trigger callback
        fs.phase = 'idle'
        fs.isAnimating = false

        // Re-enable controls
        if (controlsRef.current) {
          controlsRef.current.enabled = true
        }

        // Call completion callback
        if (fs.onComplete) {
          fs.onComplete(fs.targetFaceId, fs.targetSection)
        }
      }
    }
  })

  return null
}

// Key light that follows camera with offset (prevents frontal overexposure)
function KeyLight() {
  const { camera } = useThree()
  const lightRef = useRef<THREE.DirectionalLight>(null)

  useFrame(() => {
    if (lightRef.current) {
      // Get camera's right and up vectors in world space
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion)
      const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion)

      // Position light offset from camera: right +5, up +8 (upper-right)
      lightRef.current.position.copy(camera.position)
        .add(right.multiplyScalar(5))
        .add(up.multiplyScalar(8))
    }
  })

  return <directionalLight ref={lightRef} intensity={1.2} color="#fff5e6" />
}

// Fill light on the opposite side for softer shadows
function FillLight() {
  const { camera } = useThree()
  const lightRef = useRef<THREE.DirectionalLight>(null)

  useFrame(() => {
    if (lightRef.current) {
      // Get camera's left and down vectors
      const left = new THREE.Vector3(-1, 0, 0).applyQuaternion(camera.quaternion)
      const down = new THREE.Vector3(0, -1, 0).applyQuaternion(camera.quaternion)

      // Position light offset: left +6, down +3 (lower-left)
      lightRef.current.position.copy(camera.position)
        .add(left.multiplyScalar(6))
        .add(down.multiplyScalar(3))
    }
  })

  return <directionalLight ref={lightRef} intensity={0.4} color="#e6f0ff" />
}

// Setup fog in the scene
function SceneFog() {
  const { scene } = useThree()

  useEffect(() => {
    // Linear fog: starts at 30 units, fully opaque at 100 units
    // Color: deep dark blue (#000510)
    scene.fog = new THREE.Fog('#000510', 30, 120)

    return () => {
      scene.fog = null
    }
  }, [scene])

  return null
}

interface DodecahedronSceneProps {
  className?: string
  onPortalClick?: (faceId: number, section: string | null) => void
}

export function DodecahedronScene({ className, onPortalClick }: DodecahedronSceneProps) {
  // Ref for OrbitControls (to disable during animation)
  const controlsRef = useRef<OrbitControlsImpl | null>(null)

  // Fade overlay opacity (0 = transparent, 1 = fully purple fog)
  const [fadeOpacity, setFadeOpacity] = useState(0)

  // Track if we're navigating (to pause dodecahedron rotation)
  const [isNavigating, setIsNavigating] = useState(false)

  // Fly-through animation state (ref to avoid re-renders during animation)
  const flyStateRef = useRef<FlyThroughState>({
    isAnimating: false,
    startTime: 0,
    startPos: new THREE.Vector3(),
    targetPortalCenter: new THREE.Vector3(),
    targetPortalNormal: new THREE.Vector3(),
    phase: 'idle',
    targetFaceId: 0,
    targetSection: null,
    onComplete: null,
    waypoints: null,
  })

  // Handle portal click - starts fly-through animation
  // Portal now passes world coordinates directly
  const handlePortalClick = useCallback((data: PortalClickData) => {
    console.log(`Portal clicked: Face ${data.faceId}, Section: ${data.section}`)

    // Don't start new animation if already animating
    if (flyStateRef.current.isAnimating) return

    // Stop dodecahedron rotation during navigation
    setIsNavigating(true)

    // Initialize animation state with world coordinates from Portal
    const fs = flyStateRef.current
    fs.isAnimating = true
    fs.phase = 'flythrough'
    fs.startTime = 0 // Will be set on first frame
    fs.waypoints = null // Will be created on first frame
    fs.targetPortalCenter.copy(data.worldCenter)
    fs.targetPortalNormal.copy(data.worldNormal)
    fs.targetFaceId = data.faceId
    fs.targetSection = data.section
    fs.onComplete = onPortalClick ?? null

    // Reset fade
    setFadeOpacity(0)
  }, [onPortalClick])

  // Handle fade progress updates from CameraAnimator
  const handleFadeProgress = useCallback((progress: number) => {
    setFadeOpacity(progress)
  }, [])

  return (
    <div className={className} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 8, 18], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
      >
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.05}
          minDistance={8}
          maxDistance={35}
          target={[0, 8, 0]}
        />

        {/* Camera animator - handles fly-through */}
        <CameraAnimator
          flyState={flyStateRef}
          controlsRef={controlsRef}
          onFadeProgress={handleFadeProgress}
        />

        {/* Multi-point lighting for metallic reflections */}
        <ambientLight intensity={0.2} />
        <KeyLight />
        <FillLight />

        {/* Fixed point lights close to object for visible specular highlights */}
        {/* Top-right warm key light */}
        <pointLight position={[5, 6, 4]} intensity={60} color="#fff5e6" distance={20} decay={2} />
        {/* Left cool fill */}
        <pointLight position={[-5, 2, 3]} intensity={30} color="#e6f0ff" distance={20} decay={2} />
        {/* Bottom accent */}
        <pointLight position={[0, -5, 5]} intensity={25} color="#ffd699" distance={15} decay={2} />
        {/* Back rim light */}
        <pointLight position={[2, 3, -6]} intensity={40} color="#ffcc80" distance={20} decay={2} />

        {/* Background */}
        <color attach="background" args={['#0a0a0f']} />

        {/* Fog for depth fade */}
        <SceneFog />

        <Suspense fallback={null}>
          {/* Void environment: Tuscan landscape + golden particles */}
          <VoidEnvironment
            landscapeSize={200}
            particleCount={50}
          />

          {/* Main dodecahedron - raised to sit above the landscape */}
          <group position={[0, 8, 0]}>
            <Dodecahedron onPortalClick={handlePortalClick} isNavigating={isNavigating} />
          </group>
        </Suspense>

        {/* Post-processing effects */}
        <EffectComposer>
          <Bloom
            intensity={0.8}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>

      {/* Fog transition overlay: purple → white-gold (subtle inner glow) */}
      {fadeOpacity > 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            // Transition from purple at edges to warm white-gold center
            // Center: warm white with subtle gold glow (#FFFAF0 - floral white)
            // Middle ring: soft lavender-gold blend
            // Outer: purple fading to dark
            background: `radial-gradient(circle at center,
              rgba(255, 250, 240, ${fadeOpacity}) 0%,
              rgba(255, 248, 230, ${fadeOpacity * 0.95}) 15%,
              rgba(245, 235, 210, ${fadeOpacity * 0.9}) 30%,
              rgba(201, 180, 150, ${fadeOpacity * 0.8}) 50%,
              rgba(160, 140, 170, ${fadeOpacity * 0.6}) 70%,
              rgba(80, 70, 100, ${fadeOpacity * 0.4}) 85%,
              rgba(10, 10, 15, ${fadeOpacity * 0.3}) 100%)`,
            transition: 'opacity 0.1s ease-out',
          }}
        />
      )}

      {/* SOIL Logo - static overlay below the scene */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none select-none"
      >
        <h1
          className="font-serif text-5xl font-semibold tracking-wider"
          style={{ color: '#B8ADA0' }}
        >
          S<span style={{ color: '#C9943D' }}>·</span>O<span style={{ color: '#C9943D' }}>·</span>I<span style={{ color: '#C9943D' }}>·</span>L
        </h1>
      </div>
    </div>
  )
}
