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

// Height function for Tuscan landscape matching Gladiator scene:
// Camera looks at terrain that DESCENDS into a valley, then RISES to a distant hill (with house)
// The road follows this U-shape through the landscape
function getTerrainHeight(x: number, z: number): number {
  // Base terrain: U-shaped valley along Z axis
  // z > 0 (near camera): starts high
  // z ~ -30 to -50: valley bottom
  // z < -70: rises again to distant hill

  // Main U-shape profile along Z (the valley)
  // Parabola-like shape: high near camera, low in middle, high in distance
  const valleyCenter = -40 // Center of valley
  const valleyDepth = 8    // How deep the valley goes
  const valleyWidth = 60   // Width of valley transition

  // Smooth valley profile using cosine
  const distFromValleyCenter = z - valleyCenter
  const valleyProfile = Math.cos(Math.PI * clamp(distFromValleyCenter / valleyWidth, -1, 1)) * 0.5 + 0.5
  const valleyHeight = -valleyDepth * (1 - valleyProfile)

  // Side hills (X axis) - hills on left and right sides
  const sideHillScale = 0.025
  const sideHills = Math.sin(x * sideHillScale * 2 + 0.3) * 6 * Math.abs(x / 50)

  // Distant hill (where the "house" would be) - rises more in the far distance
  const distantHillStart = -60
  const distantHillHeight = z < distantHillStart
    ? Math.pow(Math.abs(z - distantHillStart) / 40, 1.5) * 10
    : 0

  // Small undulations for natural feel
  const scale2 = 0.04
  const scale3 = 0.08
  const smallUndulation = Math.sin(x * scale2 + 1.3) * Math.cos(z * scale2 * 1.1 + 0.7) * 2
  const fineDetail = Math.sin(x * scale3 * 1.2 + z * scale3 * 0.8) * 1

  // Slight depression along the road path (x near 0) so road sits in a natural groove
  const roadGroove = Math.exp(-x * x / 150) * 1.5

  // Combine all height components
  let height = valleyHeight + sideHills + distantHillHeight + smallUndulation + fineDetail - roadGroove

  return height
}


// Road path control points - iconic S-curve from Gladiator
// The road winds through the hills, cypress trees line it
const ROAD_CONTROL_POINTS = [
  new THREE.Vector3(8, 0, 50),     // Start (foreground, slightly right)
  new THREE.Vector3(3, 0, 35),     // Coming toward viewer
  new THREE.Vector3(-5, 0, 20),    // First curve left
  new THREE.Vector3(-2, 0, 5),     // Straighten
  new THREE.Vector3(5, 0, -15),    // Curve right
  new THREE.Vector3(0, 0, -35),    // Back toward center
  new THREE.Vector3(-8, 0, -55),   // Curve left into distance
  new THREE.Vector3(-5, 0, -80),   // Continue
  new THREE.Vector3(0, 0, -110),   // Disappears into fog
]

// Create the road curve for tree positioning
function createRoadCurve(): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3(ROAD_CONTROL_POINTS)
}

// Cypress tree positions - ALONG THE ROAD like in Gladiator
// Trees are placed on alternating sides of the road at specific distances
function getTreePositionsAlongRoad(roadCurve: THREE.CatmullRomCurve3): { x: number; z: number; scale: number }[] {
  const positions: { x: number; z: number; scale: number }[] = []

  // Tree placement along the road - like the iconic Gladiator scene
  // Format: [t position along curve (0-1), side (1=right, -1=left), distance from road]
  const treePlacements = [
    { t: 0.15, side: -1, dist: 6, scale: 1.0 },   // First tree, left side, close
    { t: 0.22, side: 1, dist: 5, scale: 0.95 },   // Right side
    { t: 0.30, side: -1, dist: 7, scale: 0.92 },  // Left side
    { t: 0.38, side: 1, dist: 6, scale: 0.88 },   // Right side
    { t: 0.48, side: -1, dist: 5, scale: 0.85 },  // Left side - the curve
    { t: 0.55, side: 1, dist: 6, scale: 0.82 },   // Right side
    { t: 0.65, side: -1, dist: 7, scale: 0.78 },  // Left, getting distant
    { t: 0.72, side: 1, dist: 5, scale: 0.72 },   // Right
    { t: 0.80, side: -1, dist: 6, scale: 0.65 },  // Left, far
    { t: 0.88, side: 1, dist: 7, scale: 0.58 },   // Right, very far (in fog)
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
// These trees are like tall green columns/pillars
function createCypressGeometry(height: number, radius: number): THREE.BufferGeometry {
  const positions: number[] = []

  const trunkHeight = height * 0.1
  const crownHeight = height * 0.9
  const trunkRadius = radius * 0.15

  // Cypress crown is a narrow cylinder with rounded top
  // Much narrower than a conical fir tree
  const crownRadius = radius * 0.4 // Narrow columnar shape
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

    // Vertical line from base of crown to near top
    positions.push(x, trunkHeight, z)
    positions.push(x, trunkHeight + crownHeight * 0.85, z)
  }

  // Crown - horizontal rings at different heights (cylindrical, not tapered)
  for (let h = 0; h <= heightSegments; h++) {
    const t = h / heightSegments
    const ringY = trunkHeight + t * crownHeight

    // Cypress columns are almost the same width throughout
    // Only taper slightly at the very top (last 20%)
    let ringRadius = crownRadius
    if (t > 0.8) {
      // Rounded top - taper in the last 20%
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

  // Top point (cypress comes to a soft point)
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
  const points = roadCurve.getPoints(100) // 100 segments for smooth curve

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i]
    const p2 = points[i + 1]

    // Get terrain height at road position (road follows terrain)
    const y1 = getTerrainHeight(p1.x, p1.z) + 0.2 // Slightly above terrain
    const y2 = getTerrainHeight(p2.x, p2.z) + 0.2

    // Calculate perpendicular direction for road width
    const tangent = new THREE.Vector3().subVectors(p2, p1).normalize()
    const perp = new THREE.Vector3(-tangent.z, 0, tangent.x).multiplyScalar(width / 2)

    // Left edge line segment
    positions.push(
      p1.x + perp.x, y1, p1.z + perp.z,
      p2.x + perp.x, y2, p2.z + perp.z
    )

    // Right edge line segment
    positions.push(
      p1.x - perp.x, y1, p1.z - perp.z,
      p2.x - perp.x, y2, p2.z - perp.z
    )

    // Cross-hatching every 10 segments for dirt road texture
    if (i % 10 === 0) {
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
  size?: number           // Total terrain size (default: 200)
  segments?: number       // Grid segments (default: 50)
  treeCount?: number      // Number of trees to show (default: 10, max: 10)
  roadWidth?: number      // Road width (default: 3)
  lineColor?: string      // Color for terrain/trees (default: '#888888')
  roadColor?: string      // Color for road (default: '#aaaaaa')
  baseOpacity?: number    // Base opacity (default: 0.4)
}

export function TuscanLandscape({
  size = 200,
  segments = 50,
  treeCount = 10,
  roadWidth = 3,
  lineColor = LINE_COLOR,
  roadColor = ROAD_COLOR,
  baseOpacity = 0.4,
}: TuscanLandscapeProps) {
  const terrainRef = useRef<THREE.LineSegments>(null)
  const roadRef = useRef<THREE.LineSegments>(null)
  const treeRefs = useRef<(THREE.LineSegments | null)[]>([])

  // Create road curve (shared between road geometry and tree positioning)
  const roadCurve = useMemo(() => createRoadCurve(), [])

  // Generate terrain geometry (memoized)
  const terrainGeometry = useMemo(
    () => createTerrainGeometry(size, segments),
    [size, segments]
  )

  // Generate road geometry (memoized)
  const roadGeometry = useMemo(
    () => createRoadGeometry(roadCurve, roadWidth),
    [roadCurve, roadWidth]
  )

  // Generate tree geometries with positions along the road (memoized)
  const trees = useMemo(() => {
    const treePositions = getTreePositionsAlongRoad(roadCurve)
    const visibleTrees = treePositions.slice(0, Math.min(treeCount, 10))

    return visibleTrees.map((pos) => {
      const baseHeight = 12  // Tall cypress trees
      const baseRadius = 1.5 // Narrow
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

  // Animate subtle opacity pulsing (matching original VoidGrid behavior)
  useFrame((state) => {
    const opacity = 0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1

    if (terrainRef.current) {
      const material = terrainRef.current.material as THREE.LineBasicMaterial
      material.opacity = opacity
    }

    if (roadRef.current) {
      const material = roadRef.current.material as THREE.LineBasicMaterial
      material.opacity = opacity + 0.15 // Road more visible
    }

    treeRefs.current.forEach((treeRef) => {
      if (treeRef) {
        const material = treeRef.material as THREE.LineBasicMaterial
        material.opacity = opacity + 0.1 // Trees slightly more visible
      }
    })
  })

  return (
    <group position={[0, -15, 0]}>
      {/* Terrain (rolling hills) */}
      <lineSegments ref={terrainRef} geometry={terrainGeometry}>
        <lineBasicMaterial
          color={lineColor}
          transparent
          opacity={baseOpacity}
        />
      </lineSegments>

      {/* Winding road */}
      <lineSegments ref={roadRef} geometry={roadGeometry}>
        <lineBasicMaterial
          color={roadColor}
          transparent
          opacity={baseOpacity + 0.15}
        />
      </lineSegments>

      {/* Cypress trees along the road */}
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
