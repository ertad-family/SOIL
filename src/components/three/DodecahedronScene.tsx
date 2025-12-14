'use client'

import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, useFont } from '@react-three/drei'
import { Suspense, useCallback, useRef, useEffect, useState } from 'react'

// Preload the font used by Text3D in portal labels
// This prevents black screen flash when first hovering over a portal
useFont.preload('/fonts/Cinzel/Cinzel SemiBold_Regular.json')
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Dodecahedron, type PortalClickData, getPortalDataBySection, RADIUS } from './Dodecahedron'
import { VoidEnvironment } from './VoidEnvironment'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'

// Dodecahedron is positioned at [0, 8, 0] in the scene
const DODECAHEDRON_Y_OFFSET = 8

// Animation state for camera fly-through
interface FlyThroughState {
  isAnimating: boolean
  startTime: number
  startPos: THREE.Vector3
  startQuaternion: THREE.Quaternion  // Camera rotation at start (for smooth turn)
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
const FLYOUT_DURATION = 3.5     // Fly-out duration (arc trajectory)

// Component to track camera position and rotation continuously (for smooth animation start)
interface CameraTrackerProps {
  cameraPositionRef: React.MutableRefObject<THREE.Vector3>
  cameraQuaternionRef: React.MutableRefObject<THREE.Quaternion>
}

function CameraTracker({ cameraPositionRef, cameraQuaternionRef }: CameraTrackerProps) {
  const { camera } = useThree()
  const lastLoggedY = useRef(camera.position.y)

  useFrame(() => {
    // Log significant Y position changes
    if (Math.abs(camera.position.y - lastLoggedY.current) > 0.5) {
      console.log('[CameraTracker] Camera Y changed:', lastLoggedY.current.toFixed(2), '->', camera.position.y.toFixed(2))
      lastLoggedY.current = camera.position.y
    }
    // Continuously track camera position and rotation so we always have the latest
    cameraPositionRef.current.copy(camera.position)
    cameraQuaternionRef.current.copy(camera.quaternion)
  })

  return null
}

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

    // Initialize waypoints on first frame of animation
    // NOTE: startPos should already be set by handlePortalClick using cameraPositionRef
    if (fs.startTime === 0) {
      fs.startTime = state.clock.elapsedTime

      // Calculate waypoints for the journey
      // Dodecahedron center (where camera should end up)
      const dodecahedronCenter = new THREE.Vector3(0, DODECAHEDRON_Y_OFFSET, 0)

      fs.waypoints = {
        portalApproach: fs.targetPortalCenter.clone()
          .add(fs.targetPortalNormal.clone().multiplyScalar(3)),
        portalEntry: fs.targetPortalCenter.clone()
          .add(fs.targetPortalNormal.clone().multiplyScalar(0.3)),
        inside: dodecahedronCenter,  // End at center, not 2 units from portal
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

      // Camera rotation logic:
      // Smoothly interpolate from starting rotation to looking at portal
      // This prevents the jarring "snap" when animation starts

      // Calculate target quaternion (looking at portal)
      const targetQuaternion = new THREE.Quaternion()
      const tempCamera = camera.clone()

      if (t < 0.75) {
        // Approaching and entering: look at portal center
        tempCamera.position.copy(pos)
        tempCamera.lookAt(fs.targetPortalCenter)
        targetQuaternion.copy(tempCamera.quaternion)
      } else {
        // Inside: look in the direction we're flying (opposite to portal normal)
        // This prevents the 180° flip - we continue looking forward
        const lookAhead = pos.clone().sub(fs.targetPortalNormal.clone().multiplyScalar(5))
        tempCamera.position.copy(pos)
        tempCamera.lookAt(lookAhead)
        targetQuaternion.copy(tempCamera.quaternion)
      }

      // Smoothly interpolate rotation
      // Use faster interpolation at the start (first 20%) to turn toward portal
      // then slower for the rest of the journey
      const rotationT = t < 0.2
        ? easeInOutSine(t / 0.2)  // Quick turn in first 20%
        : 1  // After that, always look at target

      camera.quaternion.slerpQuaternions(fs.startQuaternion, targetQuaternion, rotationT)

      // Start fade when entering portal (at 70% of flight)
      if (t > 0.7) {
        const fadeT = (t - 0.7) / 0.3 // 0→1 over last 30%
        onFadeProgress(fadeT * 0.5) // Fade to 50% during flight
      }

      if (t >= 1) {
        console.log('[FlyIn] Flythrough complete, camera at:', camera.position.toArray().map(n => n.toFixed(2)))
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
        console.log('[FlyIn] Fadeout complete, camera at:', camera.position.toArray().map(n => n.toFixed(2)))
        if (controlsRef.current) {
          console.log('[FlyIn] OrbitControls target:', controlsRef.current.target.toArray().map(n => n.toFixed(2)))
        }
        fs.phase = 'idle'
        fs.isAnimating = false

        // DON'T re-enable controls after fly-in - scene is hidden and will show fly-out next time
        // Keeping controls disabled prevents them from moving the camera during navigation
        // Controls will be re-enabled after fly-out completes

        // Call completion callback
        if (fs.onComplete) {
          fs.onComplete(fs.targetFaceId, fs.targetSection)
        }
      }
    }
  })

  return null
}

// Animation state for camera fly-OUT (reverse of fly-through)
interface FlyOutState {
  isAnimating: boolean
  startTime: number
  phase: 'idle' | 'flyout'
  // Portal to exit through
  portalCenter: THREE.Vector3
  portalNormal: THREE.Vector3
  // Waypoints for fly-out trajectory
  waypoints: {
    inside: THREE.Vector3           // Start: inside dodecahedron (center)
    exitPoint: THREE.Vector3        // Exit point outside portal (along portal normal)
    pivotPoint: THREE.Vector3       // Pivot point where camera slows down and turns
    observer: THREE.Vector3         // End: observer position
  } | null
  // Store initial quaternion for smooth rotation
  startQuaternion: THREE.Quaternion
  onComplete: (() => void) | null
}

// Camera animator for fly-OUT animation (exiting dodecahedron)
interface CameraFlyOutAnimatorProps {
  flyOutState: React.MutableRefObject<FlyOutState>
  controlsRef: React.RefObject<OrbitControlsImpl | null>
  onFadeProgress: (progress: number) => void
}

function CameraFlyOutAnimator({ flyOutState, controlsRef, onFadeProgress }: CameraFlyOutAnimatorProps) {
  const { camera } = useThree()

  useFrame((state) => {
    const fs = flyOutState.current
    if (!fs.isAnimating || fs.phase === 'idle') return

    // Initialize waypoints on first frame
    if (fs.startTime === 0) {
      console.log('[FlyOut] Starting fly-out, camera was at:', camera.position.toArray().map(n => n.toFixed(2)))
      fs.startTime = state.clock.elapsedTime

      // Trajectory: center → through portal → arc to side → observer
      const portalCenterWorld = fs.portalCenter.clone()
      portalCenterWorld.y += DODECAHEDRON_Y_OFFSET

      const dodecahedronCenter = new THREE.Vector3(0, DODECAHEDRON_Y_OFFSET, 0)

      // Exit point: just outside the portal along its normal
      const exitPoint = portalCenterWorld.clone()
        .add(fs.portalNormal.clone().multiplyScalar(4))

      // Fixed final observer position (side view showing landscape)
      const observerPos = new THREE.Vector3(-2.63, 15.86, 23.59)

      // Pivot point: intermediate point for the arc
      // Must be OFFSET from the line exitPoint→observer to create actual curve
      const pivotPoint = new THREE.Vector3().lerpVectors(exitPoint, observerPos, 0.5)
      // Offset sideways (negative X) and up to create arc that swings around
      pivotPoint.x -= 15  // Swing far to the left
      pivotPoint.y += 8   // Go higher for more dramatic arc

      fs.waypoints = {
        inside: dodecahedronCenter.clone(),
        exitPoint,
        pivotPoint,
        observer: observerPos,
      }

      // Start camera inside, looking toward the portal
      console.log('[FlyOut] Moving camera to center:', fs.waypoints.inside.toArray().map(n => n.toFixed(2)))
      camera.position.copy(fs.waypoints.inside)
      camera.lookAt(portalCenterWorld)
      fs.startQuaternion.copy(camera.quaternion)
    }

    const elapsed = state.clock.elapsedTime - fs.startTime

    // Disable orbit controls during animation
    if (controlsRef.current) {
      controlsRef.current.enabled = false
    }

    if (fs.phase === 'flyout' && fs.waypoints) {
      const t = Math.min(elapsed / FLYOUT_DURATION, 1)

      // Two-phase animation:
      // Phase 1 (0-0.25): Linear through portal center (inside → exitPoint)
      // Phase 2 (0.25-1.0): Quadratic Bezier arc (exitPoint → pivotPoint → observer)

      let pos: THREE.Vector3
      const dodecahedronCenter = new THREE.Vector3(0, DODECAHEDRON_Y_OFFSET, 0)

      if (t < 0.25) {
        // Phase 1: Straight line through portal
        const segmentT = t / 0.25
        const eased = easeInOutCubic(segmentT)
        pos = new THREE.Vector3().lerpVectors(fs.waypoints.inside, fs.waypoints.exitPoint, eased)
      } else {
        // Phase 2: Quadratic Bezier arc from exit to observer via pivot
        const segmentT = (t - 0.25) / 0.75
        const eased = easeInOutCubic(segmentT)

        // Quadratic Bezier: B(t) = (1-t)²P0 + 2(1-t)tP1 + t²P2
        const oneMinusT = 1 - eased
        const p0 = fs.waypoints.exitPoint
        const p1 = fs.waypoints.pivotPoint
        const p2 = fs.waypoints.observer

        pos = new THREE.Vector3(
          oneMinusT * oneMinusT * p0.x + 2 * oneMinusT * eased * p1.x + eased * eased * p2.x,
          oneMinusT * oneMinusT * p0.y + 2 * oneMinusT * eased * p1.y + eased * eased * p2.y,
          oneMinusT * oneMinusT * p0.z + 2 * oneMinusT * eased * p1.z + eased * eased * p2.z
        )
      }

      camera.position.copy(pos)

      // Camera always looks at dodecahedron center
      camera.lookAt(dodecahedronCenter)

      // Fade OUT the overlay during fly-out (1 → 0)
      // Start fading immediately, complete by 30% so user sees the fly-out animation
      if (t < 0.3) {
        const fadeT = t / 0.3 // 0→1 over first 30%
        onFadeProgress(1 - fadeT) // 1→0
      } else {
        onFadeProgress(0)
      }

      if (t >= 1) {
        // Animation complete
        console.log('[FlyOut] Fly-out complete, camera at:', camera.position.toArray().map(n => n.toFixed(2)))
        fs.phase = 'idle'
        fs.isAnimating = false

        // Re-enable controls
        if (controlsRef.current) {
          controlsRef.current.enabled = true
          // Reset target to dodecahedron center
          controlsRef.current.target.set(0, DODECAHEDRON_Y_OFFSET, 0)
        }

        // Call completion callback
        if (fs.onComplete) {
          fs.onComplete()
        }
      }
    }
  })

  return null
}

// Main directional light with shadow casting
// Positioned at upper-right-front to create dramatic shadows on the dodecahedron
function MainDirectionalLight() {
  const lightRef = useRef<THREE.DirectionalLight>(null)

  useEffect(() => {
    if (lightRef.current) {
      // Configure shadow camera frustum to cover the dodecahedron area
      // Dodecahedron is at Y=8, radius ~4.5 with spheres
      const shadow = lightRef.current.shadow
      shadow.mapSize.width = 2048
      shadow.mapSize.height = 2048
      shadow.camera.near = 0.5
      shadow.camera.far = 60
      // Frustum must cover dodecahedron at Y=8, radius ~5
      shadow.camera.left = -12
      shadow.camera.right = 12
      shadow.camera.top = 20  // Above dodecahedron center
      shadow.camera.bottom = -4  // Below dodecahedron
      // Bias to prevent shadow acne on curved surfaces
      shadow.bias = -0.0001
      shadow.normalBias = 0.02
      // Update shadow camera projection
      shadow.camera.updateProjectionMatrix()
    }
  }, [])

  return (
    <directionalLight
      ref={lightRef}
      position={[15, 12, 8]}
      intensity={2.0}
      color="#fff5e6"
      castShadow
      target-position={[0, DODECAHEDRON_Y_OFFSET, 0]}
    />
  )
}

// Fill light (no shadows) for softer illumination on shadow side
function FillLight() {
  return (
    <directionalLight
      position={[-8, 5, -10]}
      intensity={0.4}
      color="#e6f0ff"
    />
  )
}

// Setup fog in the scene
function SceneFog() {
  const { scene } = useThree()

  useEffect(() => {
    // Linear fog: starts at 80 units, fully opaque at 200 units
    // Pushed back to see more of the Tuscan landscape
    // Color: deep dark blue (#000510)
    scene.fog = new THREE.Fog('#000510', 80, 240)

    return () => {
      scene.fog = null
    }
  }, [scene])

  return null
}

interface DodecahedronSceneProps {
  className?: string
  onPortalClick?: (faceId: number, section: string | null) => void
  // NEW: For menu transition
  initialView?: 'outside' | 'inside'  // 'inside' = start inside for fly-out animation
  exitPortalSection?: string  // Which portal to fly out through (e.g., 'home', 'research')
  onFlyOutComplete?: () => void  // Called when fly-out animation finishes
  onFlyInStart?: (faceId: number, section: string | null) => void  // Called when fly-in starts (portal double-clicked)
  initialFadeOpacity?: number  // Initial fade overlay opacity (1 for menu transition)
  onExternalFadeProgress?: (progress: number) => void  // Report fade progress to parent (for external overlay sync)
  hideInternalOverlay?: boolean  // If true, don't render internal fade overlay (parent handles it)
  onReady?: () => void  // Called when scene is ready (preloaded)
  triggerFlyOutRef?: React.MutableRefObject<(() => void) | null>  // Ref to trigger fly-out externally
}

export function DodecahedronScene({
  className,
  onPortalClick,
  initialView = 'outside',
  exitPortalSection = 'home',
  onFlyOutComplete,
  onFlyInStart,
  initialFadeOpacity = 0,
  onExternalFadeProgress,
  hideInternalOverlay = false,
  onReady,
  triggerFlyOutRef,
}: DodecahedronSceneProps) {
  // Ref for OrbitControls (to disable during animation)
  const controlsRef = useRef<OrbitControlsImpl | null>(null)

  // Continuously tracked camera position and rotation (updated every frame by CameraTracker)
  // This allows us to capture the exact camera state at the moment of click
  const cameraPositionRef = useRef<THREE.Vector3>(new THREE.Vector3(0, DODECAHEDRON_Y_OFFSET, 18))
  const cameraQuaternionRef = useRef<THREE.Quaternion>(new THREE.Quaternion())

  // Fade overlay opacity (0 = transparent, 1 = fully purple fog)
  const [fadeOpacity, setFadeOpacity] = useState(initialFadeOpacity)

  // Track if we're navigating (to pause dodecahedron rotation)
  const [isNavigating, setIsNavigating] = useState(initialView === 'inside')

  // Track if fly-out has been initialized
  const flyOutInitializedRef = useRef(false)

  // Fly-OUT animation state (for exiting dodecahedron)
  const flyOutStateRef = useRef<FlyOutState>({
    isAnimating: false,
    startTime: 0,
    phase: 'idle',
    portalCenter: new THREE.Vector3(),
    portalNormal: new THREE.Vector3(),
    waypoints: null,
    startQuaternion: new THREE.Quaternion(),
    onComplete: null,
  })

  // Function to trigger fly-out animation externally
  const triggerFlyOut = useCallback(() => {
    if (flyOutStateRef.current.isAnimating) return // Already animating

    // Get portal data for the exit portal
    const portalData = getPortalDataBySection(exitPortalSection)
    if (!portalData) {
      console.warn(`Portal not found for section: ${exitPortalSection}, using home`)
      const homePortal = getPortalDataBySection('home')
      if (homePortal) {
        flyOutStateRef.current.portalCenter.copy(homePortal.center)
        flyOutStateRef.current.portalNormal.copy(homePortal.normal)
      }
    } else {
      flyOutStateRef.current.portalCenter.copy(portalData.center)
      flyOutStateRef.current.portalNormal.copy(portalData.normal)
    }

    // Stop dodecahedron rotation
    setIsNavigating(true)

    // Start fly-out animation
    flyOutStateRef.current.isAnimating = true
    flyOutStateRef.current.phase = 'flyout'
    flyOutStateRef.current.startTime = 0
    flyOutStateRef.current.waypoints = null
    flyOutStateRef.current.onComplete = () => {
      setIsNavigating(false)
      onFlyOutComplete?.()
    }
  }, [exitPortalSection, onFlyOutComplete])

  // Expose triggerFlyOut via ref
  useEffect(() => {
    if (triggerFlyOutRef) {
      triggerFlyOutRef.current = triggerFlyOut
    }
    return () => {
      if (triggerFlyOutRef) {
        triggerFlyOutRef.current = null
      }
    }
  }, [triggerFlyOut, triggerFlyOutRef])

  // Call onReady when scene mounts
  useEffect(() => {
    onReady?.()
  }, [onReady])

  // Initialize fly-out animation when starting from inside (legacy support)
  // Skip auto-trigger if parent controls fly-out via triggerFlyOutRef
  useEffect(() => {
    if (initialView === 'inside' && !flyOutInitializedRef.current && !triggerFlyOutRef) {
      flyOutInitializedRef.current = true
      triggerFlyOut()
    }
  }, [initialView, triggerFlyOut, triggerFlyOutRef])

  // Fly-through animation state (ref to avoid re-renders during animation)
  const flyStateRef = useRef<FlyThroughState>({
    isAnimating: false,
    startTime: 0,
    startPos: new THREE.Vector3(),
    startQuaternion: new THREE.Quaternion(),
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
    // Don't start new animation if already animating
    if (flyStateRef.current.isAnimating) return

    // Notify parent that fly-in is STARTING (before animation begins)
    // This allows parent to set phase='flyingIn' to receive fade progress updates
    onFlyInStart?.(data.faceId, data.section)

    // IMPORTANT: Disable OrbitControls IMMEDIATELY to prevent damping
    // from moving the camera between click and first animation frame
    if (controlsRef.current) {
      controlsRef.current.enabled = false
    }

    // Stop dodecahedron rotation during navigation
    setIsNavigating(true)

    // Initialize animation state with world coordinates from Portal
    const fs = flyStateRef.current
    fs.isAnimating = true
    fs.phase = 'flythrough'
    fs.startTime = 0 // Will be set on first frame
    fs.waypoints = null // Will be created on first frame
    // IMPORTANT: Capture camera position AND rotation NOW, not on first animation frame
    // This prevents the "jump" caused by OrbitControls damping and sudden lookAt change
    fs.startPos.copy(cameraPositionRef.current)
    fs.startQuaternion.copy(cameraQuaternionRef.current)
    fs.targetPortalCenter.copy(data.worldCenter)
    fs.targetPortalNormal.copy(data.worldNormal)
    fs.targetFaceId = data.faceId
    fs.targetSection = data.section
    fs.onComplete = onPortalClick ?? null

    // Reset fade
    setFadeOpacity(0)
  }, [onPortalClick, onFlyInStart])

  // Handle fade progress updates from CameraAnimator
  const handleFadeProgress = useCallback((progress: number) => {
    setFadeOpacity(progress)
    // Also report to parent for external overlay sync
    onExternalFadeProgress?.(progress)
  }, [onExternalFadeProgress])

  // Determine initial camera position based on initialView
  const initialCameraPosition: [number, number, number] = initialView === 'inside'
    ? [0, DODECAHEDRON_Y_OFFSET, 0]  // Inside dodecahedron center
    : [0, DODECAHEDRON_Y_OFFSET, 18] // Normal observer position

  return (
    <div className={className} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: initialCameraPosition, fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        shadows="soft"
      >
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.05}
          minDistance={8}
          maxDistance={35}
          target={[0, DODECAHEDRON_Y_OFFSET, 0]}
          enabled={initialView !== 'inside'} // Disable during fly-out
        />

        {/* Track camera position and rotation continuously for smooth animation start */}
        <CameraTracker cameraPositionRef={cameraPositionRef} cameraQuaternionRef={cameraQuaternionRef} />

        {/* Camera animator - handles fly-through (entering portal) */}
        <CameraAnimator
          flyState={flyStateRef}
          controlsRef={controlsRef}
          onFadeProgress={handleFadeProgress}
        />

        {/* Camera fly-OUT animator - handles exiting dodecahedron */}
        <CameraFlyOutAnimator
          flyOutState={flyOutStateRef}
          controlsRef={controlsRef}
          onFadeProgress={handleFadeProgress}
        />

        {/* Lighting with shadows */}
        <ambientLight intensity={0.3} />
        <MainDirectionalLight />
        <FillLight />

        {/* Accent point lights for metallic reflections (no shadows for performance) */}
        {/* Back rim light - creates edge highlights */}
        <pointLight position={[2, 12, -8]} intensity={30} color="#ffcc80" distance={25} decay={2} />
        {/* Bottom accent - subtle fill from below */}
        <pointLight position={[0, 2, 8]} intensity={20} color="#ffd699" distance={20} decay={2} />

        {/* Background */}
        <color attach="background" args={['#0a0a0f']} />

        {/* Fog for depth fade */}
        <SceneFog />

        <Suspense fallback={null}>
          {/* Void environment: Tuscan landscape + golden particles */}
          <VoidEnvironment
            landscapeSize={500}
            particleCount={25}
          />

          {/* Main dodecahedron - raised to sit above the landscape */}
          <group position={[0, DODECAHEDRON_Y_OFFSET, 0]}>
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
      {/* Hidden when parent handles the overlay (hideInternalOverlay=true) */}
      {!hideInternalOverlay && fadeOpacity > 0 && (
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

      {/* Navigation hint */}
      <div
        className="absolute bottom-8 right-8 pointer-events-none select-none text-right"
        style={{ color: '#666666', fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}
      >
        <div>DRAG TO ROTATE</div>
        <div>DOUBLE-CLICK PORTAL TO ENTER</div>
      </div>
    </div>
  )
}
