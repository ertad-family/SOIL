'use client'

import { useMemo, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

// Wireframe colors (dimmer for footer)
const LINE_COLOR = '#555555'
const ROAD_COLOR = '#666666'

// Road texture paths (same as TuscanLandscape)
const ROAD_TEXTURE_BASE = '/textures/Ground048_1K-JPG/Ground048_1K-JPG'

// Helper for clamping
function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max)
}

// Height function for footer landscape - pronounced rolling hills
function getTerrainHeight(x: number, z: number): number {
  // Main rolling hills - more pronounced
  const hillScale = 0.035
  const rollingHills = Math.sin(x * hillScale + 0.5) * Math.cos(z * hillScale * 0.7) * 8

  // Secondary undulations
  const mediumWaves = Math.sin(x * 0.05 + 1.3) * Math.cos(z * 0.04 + 0.7) * 4

  // Fine detail
  const smallWaves = Math.sin(x * 0.08 + z * 0.06) * 1.5

  return rollingHills + mediumWaves + smallWaves
}

// Road path for footer (wide S-curve spanning full width)
const ROAD_POINTS = [
  new THREE.Vector3(-200, 0, 70),
  new THREE.Vector3(-100, 0, 35),
  new THREE.Vector3(0, 0, 5),
  new THREE.Vector3(100, 0, -20),
  new THREE.Vector3(200, 0, -50),
]

function createRoadCurve(): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3(ROAD_POINTS)
}

// Seeded random for consistent tree placement
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

// Generate terrain grid
function createTerrainGeometry(size: number, segments: number): THREE.BufferGeometry {
  const positions: number[] = []
  const step = size / segments
  const halfSize = size / 2

  // Lines along X
  for (let zi = 0; zi <= segments; zi++) {
    for (let xi = 0; xi < segments; xi++) {
      const x1 = -halfSize + xi * step
      const x2 = -halfSize + (xi + 1) * step
      const z = -halfSize + zi * step

      const y1 = getTerrainHeight(x1, z)
      const y2 = getTerrainHeight(x2, z)

      positions.push(x1, y1, z)
      positions.push(x2, y2, z)
    }
  }

  // Lines along Z
  for (let xi = 0; xi <= segments; xi++) {
    for (let zi = 0; zi < segments; zi++) {
      const x = -halfSize + xi * step
      const z1 = -halfSize + zi * step
      const z2 = -halfSize + (zi + 1) * step

      const y1 = getTerrainHeight(x, z1)
      const y2 = getTerrainHeight(x, z2)

      positions.push(x, y1, z1)
      positions.push(x, y2, z2)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  return geometry
}

// Generate road as line segments
function createRoadGeometry(roadCurve: THREE.CatmullRomCurve3, width: number): THREE.BufferGeometry {
  const positions: number[] = []
  const points = roadCurve.getPoints(60)

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i]
    const p2 = points[i + 1]

    const y1 = getTerrainHeight(p1.x, p1.z) + 0.1
    const y2 = getTerrainHeight(p2.x, p2.z) + 0.1

    const tangent = new THREE.Vector3().subVectors(p2, p1).normalize()
    const perp = new THREE.Vector3(-tangent.z, 0, tangent.x).multiplyScalar(width / 2)

    // Left edge
    positions.push(p1.x + perp.x, y1, p1.z + perp.z)
    positions.push(p2.x + perp.x, y2, p2.z + perp.z)

    // Right edge
    positions.push(p1.x - perp.x, y1, p1.z - perp.z)
    positions.push(p2.x - perp.x, y2, p2.z - perp.z)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  return geometry
}

// Generate road mesh (solid surface) with UV coordinates for texturing
function createRoadMeshGeometry(roadCurve: THREE.CatmullRomCurve3, width: number): THREE.BufferGeometry {
  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  const points = roadCurve.getPoints(60)

  // Calculate total road length for UV scaling
  let totalLength = 0
  const segmentLengths: number[] = [0]
  for (let i = 1; i < points.length; i++) {
    totalLength += points[i].distanceTo(points[i - 1])
    segmentLengths.push(totalLength)
  }

  // UV repeat: texture repeats every ~10 units along the road
  const uvScale = totalLength / 10

  // Build vertices along both edges of the road
  for (let i = 0; i < points.length; i++) {
    const p = points[i]
    const y = getTerrainHeight(p.x, p.z) + 0.05 // Slightly below the lines

    // Calculate perpendicular direction
    let tangent: THREE.Vector3
    if (i < points.length - 1) {
      tangent = new THREE.Vector3().subVectors(points[i + 1], p).normalize()
    } else {
      tangent = new THREE.Vector3().subVectors(p, points[i - 1]).normalize()
    }
    const perp = new THREE.Vector3(-tangent.z, 0, tangent.x).multiplyScalar(width / 2)

    // Left vertex
    positions.push(p.x + perp.x, y, p.z + perp.z)
    // Right vertex
    positions.push(p.x - perp.x, y, p.z - perp.z)

    // UV coordinates: V along road length, U across width
    const v = (segmentLengths[i] / totalLength) * uvScale
    uvs.push(0, v) // Left edge
    uvs.push(1, v) // Right edge
  }

  // Build triangles connecting the vertices
  for (let i = 0; i < points.length - 1; i++) {
    const leftCurrent = i * 2
    const rightCurrent = i * 2 + 1
    const leftNext = (i + 1) * 2
    const rightNext = (i + 1) * 2 + 1

    // Two triangles per quad
    indices.push(leftCurrent, rightCurrent, leftNext)
    indices.push(rightCurrent, rightNext, leftNext)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()

  return geometry
}

// Textured road mesh component
interface TexturedRoadMeshProps {
  geometry: THREE.BufferGeometry
}

function TexturedRoadMesh({ geometry }: TexturedRoadMeshProps) {
  // Load PBR textures
  const textures = useTexture({
    map: `${ROAD_TEXTURE_BASE}_Color.jpg`,
    normalMap: `${ROAD_TEXTURE_BASE}_NormalGL.jpg`,
    roughnessMap: `${ROAD_TEXTURE_BASE}_Roughness.jpg`,
    aoMap: `${ROAD_TEXTURE_BASE}_AmbientOcclusion.jpg`,
  })

  // Configure texture wrapping for repeat
  useMemo(() => {
    Object.values(textures).forEach((texture) => {
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
    })
  }, [textures])

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        {...textures}
        side={THREE.DoubleSide}
        roughness={0.9}
      />
    </mesh>
  )
}

// Simple cypress tree wireframe
function createCypressGeometry(height: number, radius: number): THREE.BufferGeometry {
  const positions: number[] = []
  const trunkHeight = height * 0.1
  const crownHeight = height * 0.9
  const trunkRadius = radius * 0.12
  const radialSegments = 6
  const heightSegments = 8

  // Trunk
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2
    const x = Math.cos(angle) * trunkRadius
    const z = Math.sin(angle) * trunkRadius
    positions.push(x, 0, z)
    positions.push(x, trunkHeight, z)
  }

  // Crown profile (flame shape)
  const getCrownRadius = (t: number): number => {
    if (t < 0.15) return 0.2 + 0.5 * (t / 0.15)
    if (t < 0.4) return 0.7 + 0.15 * Math.sin(((t - 0.15) / 0.25) * Math.PI)
    if (t < 0.75) return 0.7 * (1 - ((t - 0.4) / 0.35) * 0.4)
    return 0.42 * (1 - ((t - 0.75) / 0.25) * 0.95)
  }

  // Crown vertical lines
  for (let i = 0; i < radialSegments; i++) {
    const angle = (i / radialSegments) * Math.PI * 2

    for (let h = 0; h < heightSegments; h++) {
      const t1 = h / heightSegments
      const t2 = (h + 1) / heightSegments

      const r1 = getCrownRadius(t1) * radius
      const r2 = getCrownRadius(t2) * radius

      const y1 = trunkHeight + t1 * crownHeight
      const y2 = trunkHeight + t2 * crownHeight

      positions.push(
        Math.cos(angle) * r1, y1, Math.sin(angle) * r1,
        Math.cos(angle) * r2, y2, Math.sin(angle) * r2
      )
    }
  }

  // Crown horizontal rings
  const ringHeights = [0.0, 0.2, 0.4, 0.6, 0.8, 0.95]
  for (const t of ringHeights) {
    const ringY = trunkHeight + t * crownHeight
    const baseRadius = getCrownRadius(t) * radius

    for (let i = 0; i < radialSegments; i++) {
      const angle1 = (i / radialSegments) * Math.PI * 2
      const angle2 = ((i + 1) / radialSegments) * Math.PI * 2

      positions.push(
        Math.cos(angle1) * baseRadius, ringY, Math.sin(angle1) * baseRadius,
        Math.cos(angle2) * baseRadius, ringY, Math.sin(angle2) * baseRadius
      )
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  return geometry
}

// ============================================================================
// GLOWING PARTICLES (same as VoidEnvironment)
// ============================================================================

// Create glow texture for particles (soft radial gradient)
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

  // Gold color with alpha falloff
  gradient.addColorStop(0, 'rgba(255, 220, 150, 1)')
  gradient.addColorStop(0.1, 'rgba(255, 200, 100, 0.8)')
  gradient.addColorStop(0.3, 'rgba(201, 148, 61, 0.4)')
  gradient.addColorStop(0.6, 'rgba(201, 148, 61, 0.1)')
  gradient.addColorStop(1, 'rgba(201, 148, 61, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

// Shared glow texture
let glowTexture: THREE.CanvasTexture | null = null
function getGlowTexture(): THREE.CanvasTexture {
  if (!glowTexture) {
    glowTexture = createGlowTexture()
  }
  return glowTexture
}

// Simple 3D noise function for organic movement
function noise3D(x: number, y: number, z: number): number {
  return (
    Math.sin(x * 1.2 + y * 0.9) * 0.5 +
    Math.sin(y * 1.1 + z * 0.8) * 0.3 +
    Math.sin(z * 0.9 + x * 1.3) * 0.2
  )
}

// Glowing gold sphere particle
interface GlowingSphereProps {
  position: THREE.Vector3
  size: number
  seed: number
}

function GlowingSphere({ position, size, seed }: GlowingSphereProps) {
  const spriteRef = useRef<THREE.Sprite>(null)
  const texture = useMemo(() => getGlowTexture(), [])

  // Store current velocity and position for physics-based movement
  const state = useRef({
    pos: position.clone(),
    vel: new THREE.Vector3(
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02
    ),
    targetVel: new THREE.Vector3(),
  })

  useFrame((frameState, delta) => {
    if (spriteRef.current) {
      const clampedDelta = Math.min(delta, 0.1)
      const time = frameState.clock.elapsedTime
      const s = state.current

      // Wandering movement using noise
      const noiseScale = 0.08
      const noiseX = noise3D(time * 0.1 + seed, seed * 10, 0) * noiseScale
      const noiseY = noise3D(seed * 10, time * 0.08 + seed, 0) * noiseScale * 0.5
      const noiseZ = noise3D(0, seed * 10, time * 0.09 + seed) * noiseScale
      s.targetVel.set(noiseX, noiseY, noiseZ)

      // Add attraction back to center when far from origin
      const maxDistX = 100
      const maxDistZ = 50
      const attractionStrength = 0.02

      if (Math.abs(s.pos.x) > maxDistX * 0.7) {
        s.targetVel.x -= Math.sign(s.pos.x) * attractionStrength * (Math.abs(s.pos.x) / maxDistX)
      }
      if (Math.abs(s.pos.z) > maxDistZ * 0.7) {
        s.targetVel.z -= Math.sign(s.pos.z) * attractionStrength * (Math.abs(s.pos.z) / maxDistZ)
      }

      // Smoothly interpolate velocity
      const lerpFactor = 1 - Math.pow(0.93, clampedDelta * 60)
      s.vel.lerp(s.targetVel, lerpFactor)

      // Limit speed
      const speed = s.vel.length()
      const maxSpeed = 0.06
      if (speed > maxSpeed) {
        s.vel.multiplyScalar(maxSpeed / speed)
      }

      // Update position
      s.pos.add(s.vel.clone().multiplyScalar(clampedDelta * 60))

      // Keep particles above terrain and within bounds
      const terrainY = getTerrainHeight(s.pos.x, s.pos.z) - 5
      const minY = terrainY + 3
      const maxY = terrainY + 20
      s.pos.y = Math.max(minY, Math.min(maxY, s.pos.y))

      // Hard clamp horizontal bounds
      s.pos.x = Math.max(-maxDistX, Math.min(maxDistX, s.pos.x))
      s.pos.z = Math.max(-maxDistZ, Math.min(maxDistZ, s.pos.z))

      // Apply position
      spriteRef.current.position.copy(s.pos)

      // Pulsing opacity
      const material = spriteRef.current.material as THREE.SpriteMaterial
      const basePulse = Math.sin(time * 2 + seed) * 0.15
      const randomFlicker = Math.random() < 0.02 ? Math.random() * 0.3 : 0
      material.opacity = 0.6 + basePulse + randomFlicker
    }
  })

  const glowSize = size * 12

  return (
    <sprite ref={spriteRef} position={position} scale={[glowSize, glowSize, 1]}>
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

// Floating particles component
interface FooterParticlesProps {
  count?: number
}

function FooterParticles({ count = 30 }: FooterParticlesProps) {
  const particles = useMemo(() => {
    const result: { position: THREE.Vector3; size: number; seed: number }[] = []

    for (let i = 0; i < count; i++) {
      // Distribute particles in visible area (smaller bounds)
      const x = (Math.random() - 0.5) * 160
      const z = (Math.random() - 0.5) * 80
      const terrainY = getTerrainHeight(x, z) - 5
      const y = terrainY + 4 + Math.random() * 12

      const position = new THREE.Vector3(x, y, z)
      const size = Math.random() * 0.06 + 0.03 // Larger particles
      const seed = i * 0.7 + Math.random() * 100

      result.push({ position, size, seed })
    }

    return result
  }, [count])

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

// ============================================================================
// TREES
// ============================================================================

// Get tree positions along road
function getTreePositions(roadCurve: THREE.CatmullRomCurve3, count: number): { x: number; z: number; scale: number }[] {
  const positions: { x: number; z: number; scale: number }[] = []

  for (let i = 0; i < count; i++) {
    const seed = i * 7.31
    const t = 0.1 + (i / (count - 1)) * 0.8
    const side = seededRandom(seed + 100) > 0.5 ? 1 : -1
    const dist = 3 + seededRandom(seed + 200) * 2

    const point = roadCurve.getPoint(t)
    const tangent = roadCurve.getTangent(t)
    const perp = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize()

    const scale = 0.6 + seededRandom(seed + 300) * 0.4

    positions.push({
      x: point.x + perp.x * dist * side,
      z: point.z + perp.z * dist * side,
      scale,
    })
  }

  return positions
}

// Setup fog in the scene
function SceneFog() {
  const { scene } = useThree()

  useEffect(() => {
    // Linear fog matching marble-950 background for seamless fade
    // Starts at 40 units, fully opaque at 120 units
    scene.fog = new THREE.Fog('#252220', 40, 120)

    return () => {
      scene.fog = null
    }
  }, [scene])

  return null
}

// Static landscape scene (no animation)
function LandscapeScene() {
  const roadCurve = useMemo(() => createRoadCurve(), [])

  const terrainGeometry = useMemo(
    () => createTerrainGeometry(400, 80),
    []
  )

  const roadGeometry = useMemo(
    () => createRoadGeometry(roadCurve, 3),
    [roadCurve]
  )

  // Mesh geometry for textured road surface
  const roadMeshGeometry = useMemo(
    () => createRoadMeshGeometry(roadCurve, 3),
    [roadCurve]
  )

  const trees = useMemo(() => {
    const treePositions = getTreePositions(roadCurve, 8)
    return treePositions.map((pos) => ({
      geometry: createCypressGeometry(6 * pos.scale, 0.8 * pos.scale),
      position: new THREE.Vector3(pos.x, getTerrainHeight(pos.x, pos.z), pos.z),
    }))
  }, [roadCurve])

  return (
    <group position={[0, -5, 0]}>
      {/* Terrain */}
      <lineSegments geometry={terrainGeometry}>
        <lineBasicMaterial color={LINE_COLOR} transparent opacity={0.3} />
      </lineSegments>

      {/* Road wireframe lines */}
      <lineSegments geometry={roadGeometry}>
        <lineBasicMaterial color={ROAD_COLOR} transparent opacity={0.5} />
      </lineSegments>

      {/* Trees */}
      {trees.map((tree, idx) => (
        <lineSegments key={idx} geometry={tree.geometry} position={tree.position}>
          <lineBasicMaterial color={LINE_COLOR} transparent opacity={0.4} />
        </lineSegments>
      ))}

      {/* Floating golden particles */}
      <FooterParticles count={25} />
    </group>
  )
}

// Camera controller that responds to scroll progress
interface CameraControllerProps {
  scrollProgress: number
}

function CameraController({ scrollProgress }: CameraControllerProps) {
  const { camera } = useThree()
  const targetRef = useRef({ z: 35, y: 20 })

  useFrame(() => {
    // Scroll down (progress 0->1) = camera zooms out (z increases)
    // scrollProgress 0 = close (z=25), scrollProgress 1 = far (z=55)
    const minZ = 25
    const maxZ = 55
    const minY = 15
    const maxY = 28

    targetRef.current.z = minZ + scrollProgress * (maxZ - minZ)
    targetRef.current.y = minY + scrollProgress * (maxY - minY)

    // Different speeds for zoom in vs zoom out
    const deltaZ = targetRef.current.z - camera.position.z
    const deltaY = targetRef.current.y - camera.position.y

    // Zoom in (scrolling up, deltaZ < 0) is faster
    const lerpZ = deltaZ < 0 ? 0.15 : 0.08
    const lerpY = deltaY < 0 ? 0.15 : 0.08

    camera.position.z += deltaZ * lerpZ
    camera.position.y += deltaY * lerpY
  })

  return null
}

interface FooterLandscapeProps {
  className?: string
  scrollProgress?: number
}

export function FooterLandscape({ className, scrollProgress = 0 }: FooterLandscapeProps) {
  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{
          position: [0, 20, 35],
          fov: 60,
          near: 0.1,
          far: 500,
        }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        {/* Camera zoom based on scroll */}
        <CameraController scrollProgress={scrollProgress} />

        {/* Minimal lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} intensity={0.3} />

        {/* Background color matching marble-950 */}
        <color attach="background" args={['#252220']} />

        <LandscapeScene />
      </Canvas>
    </div>
  )
}
