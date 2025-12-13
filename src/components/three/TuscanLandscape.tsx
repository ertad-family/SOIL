'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

// Colors matching the original VoidGrid aesthetic
const LINE_COLOR = '#888888'
const ROAD_COLOR = '#aaaaaa'

// Road texture paths
const ROAD_TEXTURE_BASE = '/textures/Ground048_1K-JPG/Ground048_1K-JPG'

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
  const distantHillStart = -80
  const distantHillHeight = z < distantHillStart
    ? Math.pow(Math.abs(z - distantHillStart) / 80, 1.3) * 15 * (1 + clamp(x / 60, 0, 1))
    : 0

  // Small undulations for natural feel
  const smallWaves = Math.sin(x * 0.05 + 1.3) * Math.cos(z * 0.04 + 0.7) * 2
  const fineDetail = Math.sin(x * 0.1 + z * 0.08) * 0.8

  // Combine all height components
  const height = leftToRightSlope + rollingHills + roadValley + distantHillHeight + smallWaves + fineDetail

  return height
}

// Main road path control points - on the LEFT side of the frame
const MAIN_ROAD_POINTS = [
  // Near foreground (behind camera, into fog)
  new THREE.Vector3(-45, 0, 220),   // Start: far behind, coming from left
  new THREE.Vector3(-35, 0, 180),   // Curving right
  new THREE.Vector3(-20, 0, 140),   // S-curve toward center
  new THREE.Vector3(-40, 0, 100),   // Back to left through valley
  new THREE.Vector3(-55, 0, 60),    // Far left, following hill contour
  // Middle section (visible area) - pronounced S-curves
  new THREE.Vector3(-35, 0, 30),    // Curve right through low point
  new THREE.Vector3(-25, 0, 0),     // Near center-left (BRANCH POINT)
  new THREE.Vector3(-45, 0, -30),   // Swing left around hill
  new THREE.Vector3(-55, 0, -60),   // Follow valley on left
  new THREE.Vector3(-35, 0, -90),   // Curve right toward distant hill
  // Far distance (toward farmhouse hill, into fog)
  new THREE.Vector3(-20, 0, -130),  // Coming toward center
  new THREE.Vector3(-10, 0, -170),  // Heading to distant hill
  new THREE.Vector3(10, 0, -210),   // Approaching farmhouse area
  new THREE.Vector3(25, 0, -250),   // Up to the hill (deep into fog)
]

// Secondary road - branches off from main road further along and goes to the RIGHT side of scene
// Branch point at z=-60 (deeper into the scene)
const SECONDARY_ROAD_POINTS = [
  new THREE.Vector3(-55, 0, -60),   // Branch point (on main road, in the valley)
  new THREE.Vector3(-40, 0, -65),   // Start curving away to the right
  new THREE.Vector3(-15, 0, -75),   // Heading right
  new THREE.Vector3(10, 0, -85),    // Into the right side
  new THREE.Vector3(35, 0, -95),    // Further right, following terrain
  new THREE.Vector3(60, 0, -110),   // Winding through hills
  new THREE.Vector3(80, 0, -130),   // Continuing right
  new THREE.Vector3(95, 0, -155),   // Into the distance
  new THREE.Vector3(105, 0, -190),  // Far right, into fog
]

// Create road curves
function createMainRoadCurve(): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3(MAIN_ROAD_POINTS)
}

function createSecondaryRoadCurve(): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3(SECONDARY_ROAD_POINTS)
}

// Seeded random for consistent tree placement
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

// Cypress tree positions - along BOTH sides of the road, from horizon to horizon
// seedOffset allows different random sequences for different roads
function getTreePositionsAlongRoadWithSeed(
  roadCurve: THREE.CatmullRomCurve3,
  seedOffset: number = 0,
  count: number = 20
): { x: number; z: number; scale: number }[] {
  const positions: { x: number; z: number; scale: number }[] = []

  // Generate trees along the entire road length
  // t from 0.05 to 0.95 covers the whole road
  const tStart = 0.05
  const tEnd = 0.95

  for (let i = 0; i < count; i++) {
    const seed = seedOffset + i * 7.31 // Unique seed per tree

    // Position along the road with some randomness
    const baseT = tStart + (i / (count - 1)) * (tEnd - tStart)
    const tOffset = (seededRandom(seed) - 0.5) * 0.03 // Small random offset
    const t = clamp(baseT + tOffset, 0.02, 0.98)

    // Alternate sides with some randomness
    // -1 = left, +1 = right
    const side = seededRandom(seed + 100) > 0.5 ? 1 : -1

    // Distance from road edge (varies for natural look)
    const baseDist = 4 + seededRandom(seed + 200) * 3 // 4-7 units from road

    // Scale based on distance from camera (z position on road)
    // Trees near camera (high t, positive z) are larger
    // Trees far away (low t, negative z) are smaller
    const point = roadCurve.getPoint(t)
    const distanceScale = clamp(1 - Math.abs(point.z) / 250, 0.3, 1.0)
    const randomScale = 0.85 + seededRandom(seed + 300) * 0.3 // 0.85-1.15 variation
    const scale = distanceScale * randomScale

    const tangent = roadCurve.getTangent(t)
    const perp = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize()

    const x = point.x + perp.x * baseDist * side
    const z = point.z + perp.z * baseDist * side

    positions.push({ x, z, scale })
  }

  return positions
}

// Shorthand for main road with default parameters
function getTreePositionsAlongRoad(roadCurve: THREE.CatmullRomCurve3): { x: number; z: number; scale: number }[] {
  return getTreePositionsAlongRoadWithSeed(roadCurve, 0, 20)
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

// Cypress shape variants based on the 3D model collection
// Each variant has different proportions matching real Italian cypress varieties
type CypressVariant = 'classic' | 'slender' | 'bushy' | 'young' | 'tallTrunk' | 'elegant'

// Crown profile functions for each variant
// Returns radius multiplier at normalized height t (0 = bottom, 1 = top)
const CYPRESS_PROFILES: Record<CypressVariant, (t: number) => number> = {
  // Classic flame shape - the most common Tuscan cypress
  classic: (t: number) => {
    if (t < 0.15) return 0.2 + 0.5 * (t / 0.15)
    if (t < 0.4) return 0.7 + 0.15 * Math.sin(((t - 0.15) / 0.25) * Math.PI)
    if (t < 0.75) return 0.7 * (1 - ((t - 0.4) / 0.35) * 0.4)
    return 0.42 * (1 - ((t - 0.75) / 0.25) * 0.95)
  },

  // Slender/tall - very narrow, columnar shape (like back row in the image)
  slender: (t: number) => {
    if (t < 0.1) return 0.15 + 0.25 * (t / 0.1)
    if (t < 0.5) return 0.4 + 0.08 * Math.sin(((t - 0.1) / 0.4) * Math.PI)
    if (t < 0.85) return 0.48 * (1 - ((t - 0.5) / 0.35) * 0.3)
    return 0.34 * (1 - ((t - 0.85) / 0.15) * 0.9)
  },

  // Bushy/full - wider, more foliage (like left tree in the image)
  bushy: (t: number) => {
    if (t < 0.12) return 0.25 + 0.55 * (t / 0.12)
    if (t < 0.35) return 0.8 + 0.2 * Math.sin(((t - 0.12) / 0.23) * Math.PI)
    if (t < 0.6) return 0.85 * (1 - ((t - 0.35) / 0.25) * 0.15)
    if (t < 0.8) return 0.72 * (1 - ((t - 0.6) / 0.2) * 0.35)
    return 0.47 * (1 - ((t - 0.8) / 0.2) * 0.92)
  },

  // Young/compact - shorter proportionally, rounder top
  young: (t: number) => {
    if (t < 0.2) return 0.2 + 0.45 * (t / 0.2)
    if (t < 0.5) return 0.65 + 0.1 * Math.sin(((t - 0.2) / 0.3) * Math.PI)
    if (t < 0.8) return 0.7 * (1 - ((t - 0.5) / 0.3) * 0.25)
    return 0.52 * (1 - ((t - 0.8) / 0.2) * 0.85)
  },

  // Tall trunk - crown starts at ~50% height, classic shape above
  // Like the right-side trees in the collection
  tallTrunk: (t: number) => {
    if (t < 0.1) return 0.15 + 0.55 * (t / 0.1)
    if (t < 0.35) return 0.7 + 0.2 * Math.sin(((t - 0.1) / 0.25) * Math.PI)
    if (t < 0.7) return 0.75 * (1 - ((t - 0.35) / 0.35) * 0.3)
    return 0.52 * (1 - ((t - 0.7) / 0.3) * 0.92)
  },

  // Elegant - tall trunk with slender crown, very refined look
  elegant: (t: number) => {
    if (t < 0.08) return 0.1 + 0.35 * (t / 0.08)
    if (t < 0.4) return 0.45 + 0.1 * Math.sin(((t - 0.08) / 0.32) * Math.PI)
    if (t < 0.8) return 0.5 * (1 - ((t - 0.4) / 0.4) * 0.25)
    return 0.38 * (1 - ((t - 0.8) / 0.2) * 0.9)
  },
}

// Variant-specific parameters
// trunkRatio: how much of total height is bare trunk (0.08 = 8%, 0.45 = 45%)
const CYPRESS_PARAMS: Record<CypressVariant, { trunkRatio: number; wobbleAmount: number }> = {
  classic: { trunkRatio: 0.08, wobbleAmount: 0.08 },
  slender: { trunkRatio: 0.06, wobbleAmount: 0.05 },
  bushy: { trunkRatio: 0.1, wobbleAmount: 0.12 },
  young: { trunkRatio: 0.12, wobbleAmount: 0.1 },
  tallTrunk: { trunkRatio: 0.45, wobbleAmount: 0.08 },  // Crown starts at 45% height
  elegant: { trunkRatio: 0.5, wobbleAmount: 0.06 },     // Crown starts at 50% height
}

// Generate Italian Cypress tree wireframe with variant support
// Based on the 3D model collection - 4 distinct shape variations
function createCypressGeometry(
  height: number,
  radius: number,
  variant: CypressVariant = 'classic'
): THREE.BufferGeometry {
  const positions: number[] = []
  const profile = CYPRESS_PROFILES[variant]
  const params = CYPRESS_PARAMS[variant]

  const trunkHeight = height * params.trunkRatio
  const crownHeight = height * (1 - params.trunkRatio)
  const trunkRadius = radius * 0.12

  // Get crown radius at height t using the variant's profile
  const getCrownRadius = (t: number): number => {
    return radius * profile(t)
  }

  // Add slight irregularity for organic look
  const wobble = (angle: number, h: number, seed: number): number => {
    const amount = params.wobbleAmount
    return 1 + Math.sin(angle * 3 + seed) * amount + Math.sin(h * 5 + seed * 2) * (amount * 0.6)
  }

  const radialSegments = 8
  const heightSegments = 12

  // Trunk - simple vertical lines
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2
    const x = Math.cos(angle) * trunkRadius
    const z = Math.sin(angle) * trunkRadius

    positions.push(x, 0, z)
    positions.push(x, trunkHeight, z)
  }

  // Crown - vertical profile lines following the shape
  for (let i = 0; i < radialSegments; i++) {
    const angle = (i / radialSegments) * Math.PI * 2
    const seed = i * 1.7

    for (let h = 0; h < heightSegments; h++) {
      const t1 = h / heightSegments
      const t2 = (h + 1) / heightSegments

      const r1 = getCrownRadius(t1) * wobble(angle, t1, seed)
      const r2 = getCrownRadius(t2) * wobble(angle, t2, seed)

      const y1 = trunkHeight + t1 * crownHeight
      const y2 = trunkHeight + t2 * crownHeight

      positions.push(
        Math.cos(angle) * r1, y1, Math.sin(angle) * r1,
        Math.cos(angle) * r2, y2, Math.sin(angle) * r2
      )
    }
  }

  // Crown - horizontal rings at key heights
  const ringHeights = [0.0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.88, 0.96]
  for (const t of ringHeights) {
    const ringY = trunkHeight + t * crownHeight
    const baseRadius = getCrownRadius(t)

    for (let i = 0; i < radialSegments; i++) {
      const angle1 = (i / radialSegments) * Math.PI * 2
      const angle2 = ((i + 1) / radialSegments) * Math.PI * 2

      const r1 = baseRadius * wobble(angle1, t, i * 1.3)
      const r2 = baseRadius * wobble(angle2, t, (i + 1) * 1.3)

      positions.push(
        Math.cos(angle1) * r1, ringY, Math.sin(angle1) * r1,
        Math.cos(angle2) * r2, ringY, Math.sin(angle2) * r2
      )
    }
  }

  // Top point - converge to apex
  const topY = trunkHeight + crownHeight
  const nearTopY = trunkHeight + crownHeight * 0.96
  const nearTopRadius = getCrownRadius(0.96)

  for (let i = 0; i < radialSegments; i++) {
    const angle = (i / radialSegments) * Math.PI * 2
    const r = nearTopRadius * wobble(angle, 0.96, i)

    positions.push(
      Math.cos(angle) * r, nearTopY, Math.sin(angle) * r,
      0, topY, 0
    )
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

  return geometry
}

// Get a deterministic variant based on tree index for consistent results
function getCypressVariant(index: number): CypressVariant {
  // Mix of variants with natural distribution:
  // - More classics and slenders (common)
  // - Some with tall trunks (elegant mature trees)
  // - Fewer bushy and young
  const distribution: CypressVariant[] = [
    'classic',    // 0
    'tallTrunk',  // 1 - tall trunk variety
    'slender',    // 2
    'elegant',    // 3 - elegant with high crown
    'slender',    // 4
    'bushy',      // 5
    'tallTrunk',  // 6 - another tall trunk
    'young',      // 7
    'classic',    // 8
    'slender',    // 9
  ]
  return distribution[index % distribution.length]
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

// Generate road mesh (solid surface) with UV coordinates for texturing
function createRoadMeshGeometry(roadCurve: THREE.CatmullRomCurve3, width: number): THREE.BufferGeometry {
  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  const points = roadCurve.getPoints(120)

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
    const y = getTerrainHeight(p.x, p.z) + 0.15 // Slightly below the lines

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
  size = 500,
  segments = 100,
  treeCount = 20,  // Trees along entire road, both sides
  roadWidth = 4,
  lineColor = LINE_COLOR,
  roadColor = ROAD_COLOR,
  baseOpacity = 0.4,
}: TuscanLandscapeProps) {
  const terrainRef = useRef<THREE.LineSegments>(null)
  const mainRoadRef = useRef<THREE.LineSegments>(null)
  const secondaryRoadRef = useRef<THREE.LineSegments>(null)
  const treeRefs = useRef<(THREE.LineSegments | null)[]>([])

  // Create both road curves
  const mainRoadCurve = useMemo(() => createMainRoadCurve(), [])
  const secondaryRoadCurve = useMemo(() => createSecondaryRoadCurve(), [])

  const terrainGeometry = useMemo(
    () => createTerrainGeometry(size, segments),
    [size, segments]
  )

  // Geometry for both roads
  const mainRoadGeometry = useMemo(
    () => createRoadGeometry(mainRoadCurve, roadWidth),
    [mainRoadCurve, roadWidth]
  )

  const secondaryRoadGeometry = useMemo(
    () => createRoadGeometry(secondaryRoadCurve, roadWidth * 0.85), // Secondary road slightly narrower
    [secondaryRoadCurve, roadWidth]
  )

  // Mesh geometry for road fill (solid surface)
  const mainRoadMeshGeometry = useMemo(
    () => createRoadMeshGeometry(mainRoadCurve, roadWidth),
    [mainRoadCurve, roadWidth]
  )

  const secondaryRoadMeshGeometry = useMemo(
    () => createRoadMeshGeometry(secondaryRoadCurve, roadWidth * 0.85),
    [secondaryRoadCurve, roadWidth]
  )

  const trees = useMemo(() => {
    // Get tree positions along main road
    const mainRoadTrees = getTreePositionsAlongRoad(mainRoadCurve)
    // Get tree positions along secondary road (fewer trees, different seed offset)
    const secondaryRoadTrees = getTreePositionsAlongRoadWithSeed(secondaryRoadCurve, 1000, 12)

    // Combine trees from both roads
    const allTrees = [...mainRoadTrees.slice(0, treeCount), ...secondaryRoadTrees]

    return allTrees.map((pos, idx) => {
      const baseHeight = 12
      const baseRadius = 1.5
      const height = baseHeight * pos.scale
      const radius = baseRadius * pos.scale
      // Each tree gets a different variant based on its index
      const variant = getCypressVariant(idx)

      return {
        geometry: createCypressGeometry(height, radius, variant),
        position: new THREE.Vector3(
          pos.x,
          getTerrainHeight(pos.x, pos.z),
          pos.z
        ),
        variant,
      }
    })
  }, [mainRoadCurve, secondaryRoadCurve, treeCount])

  useFrame((state) => {
    const opacity = 0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1

    if (terrainRef.current) {
      const material = terrainRef.current.material as THREE.LineBasicMaterial
      material.opacity = opacity
    }

    if (mainRoadRef.current) {
      const material = mainRoadRef.current.material as THREE.LineBasicMaterial
      material.opacity = opacity + 0.15
    }

    if (secondaryRoadRef.current) {
      const material = secondaryRoadRef.current.material as THREE.LineBasicMaterial
      material.opacity = opacity + 0.12 // Slightly dimmer than main road
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

      {/* Main Road Fill (textured surface) */}
      <TexturedRoadMesh geometry={mainRoadMeshGeometry} />

      {/* Main Road Lines */}
      <lineSegments ref={mainRoadRef} geometry={mainRoadGeometry}>
        <lineBasicMaterial
          color={roadColor}
          transparent
          opacity={baseOpacity + 0.15}
        />
      </lineSegments>

      {/* Secondary Road Fill (textured surface) */}
      <TexturedRoadMesh geometry={secondaryRoadMeshGeometry} />

      {/* Secondary Road Lines */}
      <lineSegments ref={secondaryRoadRef} geometry={secondaryRoadGeometry}>
        <lineBasicMaterial
          color={roadColor}
          transparent
          opacity={baseOpacity + 0.12}
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
