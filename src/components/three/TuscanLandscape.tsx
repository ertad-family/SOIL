'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Colors matching the original VoidGrid aesthetic
const LINE_COLOR = '#888888'
const ROAD_COLOR = '#aaaaaa'

// Height function for rolling Tuscan hills
function getTerrainHeight(x: number, z: number): number {
  const scale1 = 0.02 // Large hills
  const scale2 = 0.05 // Medium variation
  const scale3 = 0.1  // Small ripples

  let height = 0
  // Main rolling hills
  height += Math.sin(x * scale1) * Math.cos(z * scale1 * 0.7) * 6
  // Secondary undulation
  height += Math.sin(x * scale2 + 1.3) * Math.cos(z * scale2 * 1.2) * 2
  // Fine detail
  height += Math.sin(x * scale3 * 1.1 + z * scale3 * 0.9) * 0.5

  // Fade out toward edges for horizon effect
  const dist = Math.sqrt(x * x + z * z)
  const edgeFade = Math.max(0, 1 - dist / 100)

  return height * edgeFade
}

// Predefined cypress tree positions (iconic Tuscan arrangement)
const TREE_POSITIONS = [
  // Near the road, leading into distance
  { x: -12, z: -25, scale: 1.0 },
  { x: 18, z: -40, scale: 0.95 },
  { x: -22, z: -55, scale: 0.9 },
  // Cluster on right hill
  { x: 32, z: -22, scale: 1.05 },
  { x: 38, z: -28, scale: 0.92 },
  // Left side scattered
  { x: -38, z: -18, scale: 1.0 },
  { x: -48, z: -45, scale: 0.88 },
  // Distant trees (smaller due to perspective)
  { x: 8, z: -75, scale: 0.75 },
  { x: -28, z: -80, scale: 0.7 },
  { x: 42, z: -70, scale: 0.78 },
]

// Road path control points (S-curve disappearing into fog)
const ROAD_CONTROL_POINTS = [
  new THREE.Vector3(5, 0, 35),    // Start (near camera)
  new THREE.Vector3(-3, 0, 15),   // First gentle curve
  new THREE.Vector3(6, 0, -10),   // S-bend
  new THREE.Vector3(-8, 0, -35),  // Continue winding
  new THREE.Vector3(2, 0, -65),   // Into the distance
  new THREE.Vector3(8, 0, -95),   // Disappears into fog
]

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

// Generate cypress tree wireframe (tall narrow cone + short trunk)
function createTreeGeometry(height: number, baseRadius: number): THREE.BufferGeometry {
  const positions: number[] = []

  // Cone parameters
  const coneHeight = height * 0.85
  const trunkHeight = height * 0.15
  const radialSegments = 8
  const heightSegments = 6

  // Trunk (simple vertical lines)
  const trunkRadius = baseRadius * 0.2
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2
    const x = Math.cos(angle) * trunkRadius
    const z = Math.sin(angle) * trunkRadius

    // Vertical trunk line
    positions.push(x, 0, z)
    positions.push(x, trunkHeight, z)
  }

  // Trunk top ring
  for (let i = 0; i < 4; i++) {
    const angle1 = (i / 4) * Math.PI * 2
    const angle2 = ((i + 1) / 4) * Math.PI * 2

    positions.push(
      Math.cos(angle1) * trunkRadius, trunkHeight, Math.sin(angle1) * trunkRadius
    )
    positions.push(
      Math.cos(angle2) * trunkRadius, trunkHeight, Math.sin(angle2) * trunkRadius
    )
  }

  // Cone body - vertical ribs
  for (let i = 0; i < radialSegments; i++) {
    const angle = (i / radialSegments) * Math.PI * 2
    const x = Math.cos(angle) * baseRadius
    const z = Math.sin(angle) * baseRadius

    // Line from base to apex
    positions.push(x, trunkHeight, z)
    positions.push(0, height, 0)
  }

  // Cone body - horizontal rings at different heights
  for (let h = 0; h < heightSegments; h++) {
    const t = h / heightSegments
    const ringY = trunkHeight + t * coneHeight
    const ringRadius = baseRadius * (1 - t) // Tapers toward top

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

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

  return geometry
}

// Generate winding road as parallel edge lines
function createRoadGeometry(width: number): THREE.BufferGeometry {
  const positions: number[] = []

  // Create smooth curve from control points
  const curve = new THREE.CatmullRomCurve3(ROAD_CONTROL_POINTS)
  const points = curve.getPoints(80) // 80 segments for smooth curve

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i]
    const p2 = points[i + 1]

    // Get terrain height at road position (road follows terrain)
    const y1 = getTerrainHeight(p1.x, p1.z) + 0.15 // Slightly above terrain
    const y2 = getTerrainHeight(p2.x, p2.z) + 0.15

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

    // Cross-hatching every 8 segments for texture (like gravel road)
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
  size?: number           // Total terrain size (default: 200)
  segments?: number       // Grid segments (default: 40)
  treeCount?: number      // Number of trees to show (default: 10, max: 10)
  roadWidth?: number      // Road width (default: 3)
  lineColor?: string      // Color for terrain/trees (default: '#888888')
  roadColor?: string      // Color for road (default: '#aaaaaa')
  baseOpacity?: number    // Base opacity (default: 0.4)
}

export function TuscanLandscape({
  size = 200,
  segments = 40,
  treeCount = 10,
  roadWidth = 3,
  lineColor = LINE_COLOR,
  roadColor = ROAD_COLOR,
  baseOpacity = 0.4,
}: TuscanLandscapeProps) {
  const terrainRef = useRef<THREE.LineSegments>(null)
  const roadRef = useRef<THREE.LineSegments>(null)
  const treeRefs = useRef<(THREE.LineSegments | null)[]>([])

  // Generate terrain geometry (memoized)
  const terrainGeometry = useMemo(
    () => createTerrainGeometry(size, segments),
    [size, segments]
  )

  // Generate road geometry (memoized)
  const roadGeometry = useMemo(
    () => createRoadGeometry(roadWidth),
    [roadWidth]
  )

  // Generate tree geometries with positions (memoized)
  const trees = useMemo(() => {
    const visibleTrees = TREE_POSITIONS.slice(0, Math.min(treeCount, 10))

    return visibleTrees.map((pos) => {
      const baseHeight = 10
      const baseRadius = 2
      const height = baseHeight * pos.scale
      const radius = baseRadius * pos.scale

      return {
        geometry: createTreeGeometry(height, radius),
        position: new THREE.Vector3(
          pos.x,
          getTerrainHeight(pos.x, pos.z),
          pos.z
        ),
      }
    })
  }, [treeCount])

  // Animate subtle opacity pulsing (matching original VoidGrid behavior)
  useFrame((state) => {
    const opacity = 0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1

    if (terrainRef.current) {
      const material = terrainRef.current.material as THREE.LineBasicMaterial
      material.opacity = opacity
    }

    if (roadRef.current) {
      const material = roadRef.current.material as THREE.LineBasicMaterial
      material.opacity = opacity + 0.1 // Road slightly more visible
    }

    treeRefs.current.forEach((treeRef) => {
      if (treeRef) {
        const material = treeRef.material as THREE.LineBasicMaterial
        material.opacity = opacity
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
          opacity={baseOpacity + 0.1}
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
            opacity={baseOpacity}
          />
        </lineSegments>
      ))}
    </group>
  )
}
