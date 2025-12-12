'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { FACE_CONFIG, RADIUS, getDodecahedronFaceCenters } from './Dodecahedron'

// Dim white color for grid lines
const GRID_COLOR = '#888888' // Light gray

// Get active portals (faces with holes that particles can pass through)
const ACTIVE_PORTALS = (() => {
  const faces = getDodecahedronFaceCenters(RADIUS)
  return faces
    .map((face, idx) => ({
      center: face.center,
      normal: face.normal,
      config: FACE_CONFIG[idx],
    }))
    .filter(p => p.config?.active)
})()

// Get a random active portal
function getRandomPortal() {
  return ACTIVE_PORTALS[Math.floor(Math.random() * ACTIVE_PORTALS.length)]
}

interface VoidGridProps {
  size?: number // Total grid size
  divisions?: number // Number of grid divisions
}

// Infinite-style grid with dim white lines
export function VoidGrid({
  size = 200,
  divisions = 13, // ~15 units per cell
}: VoidGridProps) {
  const linesRef = useRef<THREE.LineSegments>(null)

  // Generate simple grid geometry
  const geometry = useMemo(() => {
    const positions: number[] = []

    const step = size / divisions
    const halfSize = size / 2

    // Create lines along X axis (horizontal)
    for (let i = 0; i <= divisions; i++) {
      const z = -halfSize + i * step
      positions.push(-halfSize, 0, z)
      positions.push(halfSize, 0, z)
    }

    // Create lines along Z axis (vertical from top view)
    for (let i = 0; i <= divisions; i++) {
      const x = -halfSize + i * step
      positions.push(x, 0, -halfSize)
      positions.push(x, 0, halfSize)
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

    return geo
  }, [size, divisions])

  // Animate subtle opacity pulsing
  useFrame((state) => {
    if (linesRef.current) {
      const material = linesRef.current.material as THREE.LineBasicMaterial
      material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <lineSegments ref={linesRef} geometry={geometry} position={[0, -15, 0]}>
      <lineBasicMaterial
        color={GRID_COLOR}
        transparent
        opacity={0.4}
      />
    </lineSegments>
  )
}

// SOIL Gold color from logo interpuncts
const SOIL_GOLD = new THREE.Color('#C9943D')

// Simple 3D noise function (based on sin combinations for organic movement)
function noise3D(x: number, y: number, z: number): number {
  return (
    Math.sin(x * 1.2 + y * 0.9) * 0.5 +
    Math.sin(y * 1.1 + z * 0.8) * 0.3 +
    Math.sin(z * 0.9 + x * 1.3) * 0.2
  )
}

// Glowing gold sphere particle (SOIL interpunct style)
interface GlowingSphereProps {
  position: THREE.Vector3
  size: number
  seed: number // Unique seed for each particle
}

// Dodecahedron surface radius (where portals are)
const DODECA_SURFACE = RADIUS * 0.8 // Approximate distance to face centers

function GlowingSphere({ position, size, seed }: GlowingSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Pick a random portal for this particle to use
  const assignedPortal = useRef(getRandomPortal())

  // Store current velocity and position for physics-based movement
  const state = useRef({
    pos: position.clone(),
    vel: new THREE.Vector3(
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02
    ),
    targetVel: new THREE.Vector3(),
    nextActionTime: Math.random() * 5 + 2,
    // Navigation state: 'wandering' | 'approaching' | 'entering' | 'inside' | 'exiting' | 'leaving'
    navState: position.length() < DODECA_SURFACE ? 'inside' : 'wandering',
    targetPortal: assignedPortal.current,
  })

  useFrame((frameState, delta) => {
    if (meshRef.current) {
      const time = frameState.clock.elapsedTime
      const s = state.current
      const distFromCenter = s.pos.length()

      // State machine for visitor navigation through portals
      if (s.navState === 'wandering') {
        // Wandering outside - use noise for organic movement
        const noiseScale = 0.15
        const noiseX = noise3D(time * 0.12 + seed, seed * 10, 0) * noiseScale
        const noiseY = noise3D(seed * 10, time * 0.1 + seed, 0) * noiseScale
        const noiseZ = noise3D(0, seed * 10, time * 0.11 + seed) * noiseScale
        s.targetVel.set(noiseX, noiseY, noiseZ)

        // Randomly decide to enter the dodecahedron
        if (time > s.nextActionTime) {
          if (Math.random() < 0.4) {
            s.navState = 'approaching'
            // Pick a random portal to enter through
            s.targetPortal = getRandomPortal()
          }
          s.nextActionTime = time + Math.random() * 8 + 4
        }

        // Keep away from dodecahedron surface
        if (distFromCenter < DODECA_SURFACE + 5) {
          const pushOut = s.pos.clone().normalize().multiplyScalar(0.02)
          s.vel.add(pushOut)
        }

      } else if (s.navState === 'approaching') {
        // Flying toward the portal from outside
        // Target point is just outside the portal
        const portalOutside = s.targetPortal.center.clone()
          .add(s.targetPortal.normal.clone().multiplyScalar(2))

        const toPortal = portalOutside.clone().sub(s.pos)
        const distToPortal = toPortal.length()

        s.targetVel.copy(toPortal.normalize().multiplyScalar(0.2))

        // Close enough to portal? Start entering
        if (distToPortal < 1.5) {
          s.navState = 'entering'
        }

      } else if (s.navState === 'entering') {
        // Flying through the portal hole into the dodecahedron
        // Target is inside, along the portal normal (inverted)
        const insideTarget = s.targetPortal.center.clone()
          .sub(s.targetPortal.normal.clone().multiplyScalar(3))

        const toInside = insideTarget.clone().sub(s.pos)
        s.targetVel.copy(toInside.normalize().multiplyScalar(0.25))

        // Fully inside?
        if (distFromCenter < DODECA_SURFACE - 1) {
          s.navState = 'inside'
          s.nextActionTime = time + Math.random() * 10 + 5 // Stay 5-15 seconds
        }

      } else if (s.navState === 'inside') {
        // Browsing inside - gentle floating
        const noiseScale = 0.06
        const noiseX = noise3D(time * 0.25 + seed, seed * 5, 0) * noiseScale
        const noiseY = noise3D(seed * 5, time * 0.2 + seed, 0) * noiseScale
        const noiseZ = noise3D(0, seed * 5, time * 0.22 + seed) * noiseScale
        s.targetVel.set(noiseX, noiseY, noiseZ)

        // Keep inside dodecahedron - soft boundary
        if (distFromCenter > DODECA_SURFACE - 1.5) {
          const pushIn = s.pos.clone().normalize().multiplyScalar(-0.03)
          s.vel.add(pushIn)
        }

        // Time to leave?
        if (time > s.nextActionTime) {
          s.navState = 'exiting'
          // Pick a random portal to exit through
          s.targetPortal = getRandomPortal()
        }

      } else if (s.navState === 'exiting') {
        // Flying toward portal from inside
        const portalInside = s.targetPortal.center.clone()
          .sub(s.targetPortal.normal.clone().multiplyScalar(1))

        const toPortal = portalInside.clone().sub(s.pos)
        const distToPortal = toPortal.length()

        s.targetVel.copy(toPortal.normalize().multiplyScalar(0.2))

        // Close to portal? Start leaving
        if (distToPortal < 1) {
          s.navState = 'leaving'
        }

      } else if (s.navState === 'leaving') {
        // Flying out through the portal
        const outsideTarget = s.targetPortal.center.clone()
          .add(s.targetPortal.normal.clone().multiplyScalar(15))

        const toOutside = outsideTarget.clone().sub(s.pos)
        s.targetVel.copy(toOutside.normalize().multiplyScalar(0.2))

        // Fully outside?
        if (distFromCenter > DODECA_SURFACE + 8) {
          s.navState = 'wandering'
          s.nextActionTime = time + Math.random() * 12 + 6
        }
      }

      // Smoothly interpolate velocity toward target (easing)
      const lerpFactor = 1 - Math.pow(0.93, delta * 60)
      s.vel.lerp(s.targetVel, lerpFactor)

      // Apply velocity with non-linear damping
      const speed = s.vel.length()
      const isTransiting = s.navState === 'entering' || s.navState === 'exiting' ||
                          s.navState === 'approaching' || s.navState === 'leaving'
      const maxSpeed = isTransiting ? 0.22 : 0.1
      if (speed > maxSpeed) {
        s.vel.multiplyScalar(maxSpeed / speed)
      }

      // Update position
      s.pos.add(s.vel.clone().multiplyScalar(delta * 60))

      // Soft boundary - keep in general area
      if (distFromCenter > 60) {
        const pushBack = s.pos.clone().normalize().multiplyScalar(-0.015 * (distFromCenter - 60))
        s.vel.add(pushBack)
      }

      // Apply position
      meshRef.current.position.copy(s.pos)

      // Pulsing emissive intensity - brighter when inside
      const material = meshRef.current.material as THREE.MeshStandardMaterial
      const basePulse = Math.sin(time * 2 + seed) * 0.5
      const insideBoost = s.navState === 'inside' ? 1.5 : 0
      const randomFlicker = Math.random() < 0.02 ? Math.random() * 2 : 0
      material.emissiveIntensity = 2 + basePulse + insideBoost + randomFlicker
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 12, 12]} />
      <meshStandardMaterial
        color={SOIL_GOLD}
        emissive={SOIL_GOLD}
        emissiveIntensity={2.5}
        toneMapped={false}
      />
    </mesh>
  )
}

interface VoidParticlesProps {
  count?: number
  spread?: number
}

// Floating golden glowing spheres (SOIL interpuncts representing visitors)
// Some particles navigate in/out of dodecahedron like real site visitors
export function VoidParticles({ count = 50, spread = 60 }: VoidParticlesProps) {
  // Generate particle data
  const particles = useMemo(() => {
    const result: { position: THREE.Vector3; size: number; seed: number }[] = []

    for (let i = 0; i < count; i++) {
      // Some particles start inside dodecahedron (viewing pages)
      // Some start outside (approaching/leaving)
      const isInside = Math.random() < 0.3 // 30% inside

      let position: THREE.Vector3

      if (isInside) {
        // Inside dodecahedron (radius ~4-5 from center)
        const r = Math.random() * 3 + 1
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        position = new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        )
      } else {
        // Outside - distributed in space
        const r = Math.random() * spread + 15 // Start outside dodecahedron
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        position = new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta) - 5,
          r * Math.cos(phi)
        )
      }

      // Very small size for glowing spheres (0.03 - 0.08)
      const size = Math.random() * 0.05 + 0.03

      // Unique seed for each particle
      const seed = i * 0.7 + Math.random() * 100

      result.push({ position, size, seed })
    }

    return result
  }, [count, spread])

  return (
    <group>
      {particles.map((particle, idx) => (
        <GlowingSphere
          key={idx}
          position={particle.position}
          size={particle.size}
          seed={particle.seed}
        />
      ))}
    </group>
  )
}

interface VoidEnvironmentProps {
  gridSize?: number
  gridDivisions?: number
  particleCount?: number
  showGrid?: boolean
  showParticles?: boolean
}

// Complete void environment component
export function VoidEnvironment({
  gridSize = 200,
  gridDivisions = 13, // ~15 units per cell (3x larger than before)
  particleCount = 50,
  showGrid = true,
  showParticles = true,
}: VoidEnvironmentProps) {
  return (
    <group>
      {showGrid && (
        <VoidGrid size={gridSize} divisions={gridDivisions} />
      )}
      {showParticles && (
        <VoidParticles count={particleCount} spread={50} />
      )}
    </group>
  )
}
