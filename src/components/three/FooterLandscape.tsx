'use client'

import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'

// Wireframe colors (dimmer for footer)
const LINE_COLOR = '#555555'
const ROAD_COLOR = '#666666'

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

// Road path for footer (extra wide S-curve spanning full width)
const ROAD_POINTS = [
  new THREE.Vector3(-180, 0, 60),
  new THREE.Vector3(-90, 0, 30),
  new THREE.Vector3(0, 0, 5),
  new THREE.Vector3(90, 0, -20),
  new THREE.Vector3(180, 0, -45),
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

      {/* Road */}
      <lineSegments geometry={roadGeometry}>
        <lineBasicMaterial color={ROAD_COLOR} transparent opacity={0.5} />
      </lineSegments>

      {/* Trees */}
      {trees.map((tree, idx) => (
        <lineSegments key={idx} geometry={tree.geometry} position={tree.position}>
          <lineBasicMaterial color={LINE_COLOR} transparent opacity={0.4} />
        </lineSegments>
      ))}
    </group>
  )
}

interface FooterLandscapeProps {
  className?: string
}

export function FooterLandscape({ className }: FooterLandscapeProps) {
  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{
          position: [0, 30, 60],
          fov: 65,
          near: 0.1,
          far: 500,
        }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        {/* Minimal lighting */}
        <ambientLight intensity={0.5} />

        {/* Background color matching marble-950 */}
        <color attach="background" args={['#252220']} />

        <LandscapeScene />
      </Canvas>
    </div>
  )
}
