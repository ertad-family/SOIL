'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Colors matching the original VoidGrid aesthetic
const LINE_COLOR = '#888888'
const ROAD_COLOR = '#aaaaaa'

// Helper for clamping
function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max)
}

// Height function for Tuscan landscape matching the reference image
// Reference: Val d'Orcia / Terrapille - road on LEFT, hill with house on RIGHT
// Dodecahedron position: RIGHT side of frame, on the rolling hills
function getTerrainHeight(x: number, z: number): number {
  // Main terrain profile:
  // - Left side (x < 0): Lower, where the road runs
  // - Right side (x > 0): Higher rolling hills where dodecahedron sits
  // - Far distance (z < -50): Rises to hill with "house"

  // Base slope: terrain rises from left to right
  const leftToRightSlope = x * 0.08

  // Rolling hills - more prominent on the right side
  const hillScale = 0.03
  const rollingHills = Math.sin(x * hillScale + 0.5) * Math.cos(z * hillScale * 0.7) * 8
    * (1 + clamp(x / 50, 0, 1)) // More amplitude on right

  // Valley where the road goes (left side, x around -20 to -40)
  const roadValleyCenter = -30
  const roadValleyWidth = 25
  const distFromRoadValley = Math.abs(x - roadValleyCenter)
  const roadValley = distFromRoadValley < roadValleyWidth
    ? -Math.cos((distFromRoadValley / roadValleyWidth) * Math.PI * 0.5) * 4
    : 0

  // Distant hill (where farmhouse would be) - rises in far distance, more on right
  const distantHillStart = -60
  const distantHillHeight = z < distantHillStart
    ? Math.pow(Math.abs(z - distantHillStart) / 50, 1.3) * 12 * (1 + clamp(x / 40, 0, 1))
    : 0

  // Small undulations for natural feel
  const smallWaves = Math.sin(x * 0.05 + 1.3) * Math.cos(z * 0.04 + 0.7) * 2
  const fineDetail = Math.sin(x * 0.1 + z * 0.08) * 0.8

  // Combine all height components
  const height = leftToRightSlope + rollingHills + roadValley + distantHillHeight + smallWaves + fineDetail

  return height
}

// Road path control points - matching reference image
// Road is on the LEFT side of the frame, winding from foreground up to distant hill
const ROAD_CONTROL_POINTS = [
  new THREE.Vector3(-20, 0, 60),    // Start: foreground, left side
  new THREE.Vector3(-25, 0, 45),    // Coming from bottom-left
  new THREE.Vector3(-30, 0, 30),    // Slight curve
  new THREE.Vector3(-28, 0, 15),    // Winding up
  new THREE.Vector3(-32, 0, 0),     // Continuing
  new THREE.Vector3(-28, 0, -20),   // Curve right slightly
  new THREE.Vector3(-25, 0, -40),   // Into middle distance
  new THREE.Vector3(-20, 0, -60),   // Curving toward center-right
  new THREE.Vector3(-10, 0, -80),   // Heading to distant hill
  new THREE.Vector3(5, 0, -100),    // Approaching farmhouse area
  new THREE.Vector3(15, 0, -120),   // Up to the hill
]

// Create the road curve for tree positioning
function createRoadCurve(): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3(ROAD_CONTROL_POINTS)
}

// Cypress tree positions - along the LEFT side of the road (matching reference)
// In the reference, cypresses line the road on its left edge
function getTreePositionsAlongRoad(roadCurve: THREE.CatmullRomCurve3): { x: number; z: number; scale: number }[] {
  const positions: { x: number; z: number; scale: number }[] = []

  // Trees only on the LEFT side of the road (side = -1)
  // This matches the reference image where cypresses are on the left edge of the road
  const treePlacements = [
    { t: 0.08, side: -1, dist: 4, scale: 1.0 },   // First tree, closest
    { t: 0.15, side: -1, dist: 5, scale: 0.98 },
    { t: 0.22, side: -1, dist: 4, scale: 0.95 },
    { t: 0.30, side: -1, dist: 5, scale: 0.92 },
    { t: 0.38, side: -1, dist: 4, scale: 0.88 },
    { t: 0.46, side: -1, dist: 5, scale: 0.84 },
    { t: 0.54, side: -1, dist: 4, scale: 0.78 },
    { t: 0.62, side: -1, dist: 5, scale: 0.72 },
    { t: 0.70, side: -1, dist: 4, scale: 0.65 },  // Getting distant
    { t: 0.78, side: -1, dist: 5, scale: 0.55 },  // Far
  ]

  for (const placement of treePlacements) {
    const point = roadCurve.getPoint(placement.t)
    const tangent = roadCurve.getTangent(placement.t)

    // Perpendicular direction (to the side of the road)
    const perp = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize()

    const x = point.x + perp.x * placement.dist * placement.side
    const z = point.z + perp.z * placement.dist * placement.side

    positions.push({ x, z, scale: placement.scale })
  }

  return positions
}

// Generate terrain grid as line segments
function createTerrainGeometry(size: number, segments: number): THREE.BufferGeometry {
  const positions: number[] = []
  const step = size / segments
  const halfSize = size / 2

  // Lines along X direction (horizontal from top view)
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

  // Lines along Z direction (vertical from top view)
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

// Generate Italian Cypress tree wireframe
// Cupressus sempervirens - COLUMNAR shape (tall narrow cylinder), NOT conical
function createCypressGeometry(height: number, radius: number): THREE.BufferGeometry {
  const positions: number[] = []

  const trunkHeight = height * 0.1
  const crownHeight = height * 0.9
  const trunkRadius = radius * 0.15

  // Cypress crown is a narrow cylinder with rounded top
  const crownRadius = radius * 0.4
  const radialSegments = 6
  const heightSegments = 8

  // Trunk - simple vertical lines
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2
    const x = Math.cos(angle) * trunkRadius
    const z = Math.sin(angle) * trunkRadius

    positions.push(x, 0, z)
    positions.push(x, trunkHeight, z)
  }

  // Crown - vertical lines (the columnar shape)
  for (let i = 0; i < radialSegments; i++) {
    const angle = (i / radialSegments) * Math.PI * 2
    const x = Math.cos(angle) * crownRadius
    const z = Math.sin(angle) * crownRadius

    positions.push(x, trunkHeight, z)
    positions.push(x, trunkHeight + crownHeight * 0.85, z)
  }

  // Crown - horizontal rings at different heights
  for (let h = 0; h <= heightSegments; h++) {
    const t = h / heightSegments
    const ringY = trunkHeight + t * crownHeight

    let ringRadius = crownRadius
    if (t > 0.8) {
      const topT = (t - 0.8) / 0.2
      ringRadius = crownRadius * (1 - topT * 0.7)
    }

    for (let i = 0; i < radialSegments; i++) {
      const angle1 = (i / radialSegments) * Math.PI * 2
      const angle2 = ((i + 1) / radialSegments) * Math.PI * 2

      positions.push(
        Math.cos(angle1) * ringRadius, ringY, Math.sin(angle1) * ringRadius
      )
      positions.push(
        Math.cos(angle2) * ringRadius, ringY, Math.sin(angle2) * ringRadius
      )
    }
  }

  // Top point
  const topY = trunkHeight + crownHeight
  for (let i = 0; i < radialSegments; i++) {
    const angle = (i / radialSegments) * Math.PI * 2
    const nearTopRadius = crownRadius * 0.3

    positions.push(
      Math.cos(angle) * nearTopRadius, topY - crownHeight * 0.15, Math.sin(angle) * nearTopRadius
    )
    positions.push(0, topY, 0)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

  return geometry
}

// Generate winding road as parallel edge lines
function createRoadGeometry(roadCurve: THREE.CatmullRomCurve3, width: number): THREE.BufferGeometry {
  const positions: number[] = []
  const points = roadCurve.getPoints(120)

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i]
    const p2 = points[i + 1]

    const y1 = getTerrainHeight(p1.x, p1.z) + 0.2
    const y2 = getTerrainHeight(p2.x, p2.z) + 0.2

    const tangent = new THREE.Vector3().subVectors(p2, p1).normalize()
    const perp = new THREE.Vector3(-tangent.z, 0, tangent.x).multiplyScalar(width / 2)

    // Left edge
    positions.push(
      p1.x + perp.x, y1, p1.z + perp.z,
      p2.x + perp.x, y2, p2.z + perp.z
    )

    // Right edge
    positions.push(
      p1.x - perp.x, y1, p1.z - perp.z,
      p2.x - perp.x, y2, p2.z - perp.z
    )

    // Cross-hatching for texture
    if (i % 8 === 0) {
      positions.push(
        p1.x + perp.x, y1, p1.z + perp.z,
        p1.x - perp.x, y1, p1.z - perp.z
      )
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

  return geometry
}

interface TuscanLandscapeProps {
  size?: number
  segments?: number
  treeCount?: number
  roadWidth?: number
  lineColor?: string
  roadColor?: string
  baseOpacity?: number
}

export function TuscanLandscape({
  size = 250,
  segments = 60,
  treeCount = 10,
  roadWidth = 3.5,
  lineColor = LINE_COLOR,
  roadColor = ROAD_COLOR,
  baseOpacity = 0.4,
}: TuscanLandscapeProps) {
  const terrainRef = useRef<THREE.LineSegments>(null)
  const roadRef = useRef<THREE.LineSegments>(null)
  const treeRefs = useRef<(THREE.LineSegments | null)[]>([])

  const roadCurve = useMemo(() => createRoadCurve(), [])

  const terrainGeometry = useMemo(
    () => createTerrainGeometry(size, segments),
    [size, segments]
  )

  const roadGeometry = useMemo(
    () => createRoadGeometry(roadCurve, roadWidth),
    [roadCurve, roadWidth]
  )

  const trees = useMemo(() => {
    const treePositions = getTreePositionsAlongRoad(roadCurve)
    const visibleTrees = treePositions.slice(0, Math.min(treeCount, 10))

    return visibleTrees.map((pos) => {
      const baseHeight = 12
      const baseRadius = 1.5
      const height = baseHeight * pos.scale
      const radius = baseRadius * pos.scale

      return {
        geometry: createCypressGeometry(height, radius),
        position: new THREE.Vector3(
          pos.x,
          getTerrainHeight(pos.x, pos.z),
          pos.z
        ),
      }
    })
  }, [roadCurve, treeCount])

  useFrame((state) => {
    const opacity = 0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1

    if (terrainRef.current) {
      const material = terrainRef.current.material as THREE.LineBasicMaterial
      material.opacity = opacity
    }

    if (roadRef.current) {
      const material = roadRef.current.material as THREE.LineBasicMaterial
      material.opacity = opacity + 0.15
    }

    treeRefs.current.forEach((treeRef) => {
      if (treeRef) {
        const material = treeRef.material as THREE.LineBasicMaterial
        material.opacity = opacity + 0.1
      }
    })
  })

  return (
    <group position={[0, -15, 0]}>
      {/* Terrain */}
      <lineSegments ref={terrainRef} geometry={terrainGeometry}>
        <lineBasicMaterial
          color={lineColor}
          transparent
          opacity={baseOpacity}
        />
      </lineSegments>

      {/* Road */}
      <lineSegments ref={roadRef} geometry={roadGeometry}>
        <lineBasicMaterial
          color={roadColor}
          transparent
          opacity={baseOpacity + 0.15}
        />
      </lineSegments>

      {/* Cypress trees */}
      {trees.map((tree, idx) => (
        <lineSegments
          key={idx}
          ref={(el) => { treeRefs.current[idx] = el }}
          geometry={tree.geometry}
          position={tree.position}
        >
          <lineBasicMaterial
            color={lineColor}
            transparent
            opacity={baseOpacity + 0.1}
          />
        </lineSegments>
      ))}
    </group>
  )
}
