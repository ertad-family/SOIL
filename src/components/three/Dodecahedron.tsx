'use client'

import { useRef, useMemo, useState, useCallback } from 'react'
import { useFrame, ThreeEvent, useThree } from '@react-three/fiber'
import { useTexture, Text3D, Center } from '@react-three/drei'
import * as THREE from 'three'
import { Brush, Evaluator, SUBTRACTION } from 'three-bvh-csg'

// Portal configuration for each face with varying hole sizes
export const FACE_CONFIG = [
  { id: 0, name: 'Home', section: 'home', active: true, holeRadius: 1.3 },
  { id: 1, name: 'Research', section: 'research', active: true, holeRadius: 1.1 },
  { id: 2, name: 'Memorials', section: 'memorials', active: true, holeRadius: 1.4 },
  { id: 3, name: 'Diagnostics', section: 'diagnostics', active: true, holeRadius: 1.0 },
  { id: 4, name: 'Education', section: 'education', active: true, holeRadius: 1.2 },
  { id: 5, name: 'Clinic', section: 'clinic', active: true, holeRadius: 1.3 },
  { id: 6, name: 'Community', section: 'community', active: true, holeRadius: 1.1 },
  { id: 7, name: 'Future 1', section: null, active: false, holeRadius: 1.4 },
  { id: 8, name: 'Future 2', section: null, active: false, holeRadius: 1.0 },
  { id: 9, name: 'Future 3', section: null, active: false, holeRadius: 1.2 },
  { id: 10, name: 'Future 4', section: null, active: false, holeRadius: 1.3 },
  { id: 11, name: 'Future 5', section: null, active: false, holeRadius: 1.1 },
]

// Vertex sphere configuration
export const SPHERE_CONFIG = [
  { id: 0, name: 'Profile', active: true },
  { id: 1, name: 'Settings', active: true },
  { id: 2, name: 'Search', active: true },
  { id: 3, name: 'Notifications', active: true },
  { id: 4, name: 'Help', active: true },
  { id: 5, name: 'Language', active: true },
  // Reserved (6-19)
  ...Array.from({ length: 14 }, (_, i) => ({
    id: i + 6,
    name: `Reserved ${i + 1}`,
    active: false,
  })),
]

const RADIUS = 4
const WALL_THICKNESS = 0.15 // Thin walls like original artifact

// For a regular dodecahedron, the inscribed circle radius of each pentagonal face
// is approximately: r_inscribed = R * 0.795 * tan(54°) where R is circumradius
// For RADIUS=4: 4 * 0.795 * 1.376 ≈ 4.37, but face is at ~3.18 from center
// The inscribed circle of pentagon on that face ≈ 1.85
const PENTAGON_INSCRIBED_RADIUS = 1.85

// Ring groove parameters
const GROOVE_WIDTH = 0.02
const RING_WIDTH = 0.015
const GROOVE_OFFSET = 0.04
const INNER_RING_OFFSET = 0.1 // how far inner ring is from hole edge
const MIN_GAP_BETWEEN_RINGS = 0.1 // minimum space between ring systems

// Extract unique vertices from Three.js DodecahedronGeometry
function getDodecahedronVertices(radius: number): THREE.Vector3[] {
  const geometry = new THREE.DodecahedronGeometry(radius, 0)
  const positionAttr = geometry.getAttribute('position')

  const uniqueVertices: THREE.Vector3[] = []
  const seen = new Set<string>()

  for (let i = 0; i < positionAttr.count; i++) {
    const x = positionAttr.getX(i)
    const y = positionAttr.getY(i)
    const z = positionAttr.getZ(i)

    const key = `${x.toFixed(4)},${y.toFixed(4)},${z.toFixed(4)}`

    if (!seen.has(key)) {
      seen.add(key)
      uniqueVertices.push(new THREE.Vector3(x, y, z))
    }
  }

  geometry.dispose()
  return uniqueVertices
}

// Get face centers of dodecahedron (12 pentagonal faces)
// DodecahedronGeometry with detail=0 has 36 triangles = 12 faces × 3 triangles per face
// Triangles are stored sequentially per face, so we take every 3 triangles as one face
function getDodecahedronFaceCenters(radius: number): { center: THREE.Vector3; normal: THREE.Vector3 }[] {
  const geometry = new THREE.DodecahedronGeometry(radius, 0)
  const positionAttr = geometry.getAttribute('position')

  const faces: { center: THREE.Vector3; normal: THREE.Vector3 }[] = []
  const TRIANGLES_PER_FACE = 3
  const VERTICES_PER_TRIANGLE = 3

  // Process triangles in groups of 3 (one pentagonal face = 3 triangles)
  for (let faceIdx = 0; faceIdx < 12; faceIdx++) {
    const baseIdx = faceIdx * TRIANGLES_PER_FACE * VERTICES_PER_TRIANGLE

    // Get first triangle vertices to compute proper normal
    const v0 = new THREE.Vector3(
      positionAttr.getX(baseIdx),
      positionAttr.getY(baseIdx),
      positionAttr.getZ(baseIdx)
    )
    const v1 = new THREE.Vector3(
      positionAttr.getX(baseIdx + 1),
      positionAttr.getY(baseIdx + 1),
      positionAttr.getZ(baseIdx + 1)
    )
    const v2 = new THREE.Vector3(
      positionAttr.getX(baseIdx + 2),
      positionAttr.getY(baseIdx + 2),
      positionAttr.getZ(baseIdx + 2)
    )

    // Compute proper normal from triangle edges (cross product)
    const edge1 = new THREE.Vector3().subVectors(v1, v0)
    const edge2 = new THREE.Vector3().subVectors(v2, v0)
    const normal = new THREE.Vector3().crossVectors(edge1, edge2).normalize()

    // Ensure normal points outward (away from origin)
    const centerDir = new THREE.Vector3().addVectors(v0, v1).add(v2).normalize()
    if (normal.dot(centerDir) < 0) {
      normal.negate()
    }

    // Compute face center as average of all 9 vertices
    const center = new THREE.Vector3()
    for (let i = 0; i < TRIANGLES_PER_FACE * VERTICES_PER_TRIANGLE; i++) {
      center.x += positionAttr.getX(baseIdx + i)
      center.y += positionAttr.getY(baseIdx + i)
      center.z += positionAttr.getZ(baseIdx + i)
    }
    center.divideScalar(TRIANGLES_PER_FACE * VERTICES_PER_TRIANGLE)

    faces.push({ center, normal })
  }

  geometry.dispose()

  // Sort faces for consistent ordering with FACE_CONFIG
  faces.sort((a, b) => {
    if (Math.abs(a.normal.y - b.normal.y) > 0.01) return b.normal.y - a.normal.y
    if (Math.abs(a.normal.x - b.normal.x) > 0.01) return a.normal.x - b.normal.x
    return a.normal.z - b.normal.z
  })

  return faces
}

// Face data with hole radius attached
interface FaceWithHole {
  center: THREE.Vector3
  normal: THREE.Vector3
  holeRadius: number
}

// Props for Portal component
interface PortalProps {
  face: {
    center: THREE.Vector3
    normal: THREE.Vector3
    holeRadius: number
    config?: typeof FACE_CONFIG[number]
  }
  idx: number
  textures: {
    map: THREE.Texture
    normalMap: THREE.Texture
  }
  onPortalClick?: (faceId: number, section: string | null) => void
}

// Animation state stored per-face (persists across hover states)
interface LabelAnimState {
  currentAngle: number
  velocity: number
  initialized: boolean
}

// Animated label that swings to upright position like a pendulum
interface PendulumLabelProps {
  name: string
  faceNormal: THREE.Vector3
  animState: React.MutableRefObject<LabelAnimState>
}

function PendulumLabel({ name, faceNormal, animState }: PendulumLabelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()

  useFrame((_, delta) => {
    if (!groupRef.current) return

    const state = animState.current

    // Calculate target angle to make text upright relative to camera
    // Strategy: find the "up" direction on the face plane that best aligns with world up
    // as seen from camera perspective

    // Get world up projected onto face plane
    const worldUp = new THREE.Vector3(0, 1, 0)

    // Project world up onto the face plane
    let projectedUp = worldUp.clone()
      .sub(faceNormal.clone().multiplyScalar(worldUp.dot(faceNormal)))

    // If projection is too small (face is nearly horizontal), use camera's right vector
    if (projectedUp.length() < 0.1) {
      // For horizontal faces, use camera right to determine orientation
      const cameraRight = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion)
      // Cross product of face normal and camera right gives "up" on face
      projectedUp = new THREE.Vector3().crossVectors(faceNormal, cameraRight)
    }

    projectedUp.normalize()

    // Now we need to find angle in face-local coordinates
    // The face has been rotated so its normal points along local Z
    // We need to find how much to rotate around Z to align local Y with projectedUp

    // Transform projectedUp to face-local space
    // Face quaternion rotates (0,0,1) to faceNormal
    const faceQuat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      faceNormal
    )
    const invFaceQuat = faceQuat.clone().invert()

    // Transform projectedUp to face-local coordinates
    const localUp = projectedUp.clone().applyQuaternion(invFaceQuat)

    // Calculate angle from local Y axis (0, 1, 0) to localUp (in XY plane)
    const targetAngle = Math.atan2(-localUp.x, localUp.y)

    if (!state.initialized) {
      // Start with some offset to create initial swing
      state.currentAngle = targetAngle + Math.PI * 0.3
      state.initialized = true
    }

    // Physics: damped harmonic oscillator
    const stiffness = 15 // Spring stiffness
    const damping = 4   // Damping factor

    const angleDiff = targetAngle - state.currentAngle
    const springForce = angleDiff * stiffness
    const dampingForce = -state.velocity * damping

    state.velocity += (springForce + dampingForce) * delta
    state.currentAngle += state.velocity * delta

    // Apply rotation around Z axis (face normal direction)
    groupRef.current.rotation.z = state.currentAngle
  })

  return (
    <group ref={groupRef} position={[0, 0, 0.25]}>
      <Center>
        <Text3D
          font="/fonts/Cinzel/Cinzel SemiBold_Regular.json"
          size={0.3}
          height={0.03}
          letterSpacing={0.05}
          bevelEnabled
          bevelSize={0.005}
          bevelThickness={0.005}
        >
          {name}
          <meshStandardMaterial color="#C9943D" metalness={0.8} roughness={0.3} />
        </Text3D>
      </Center>
    </group>
  )
}

// Interactive Portal component with hover/click
function Portal({ face, idx, textures, onPortalClick }: PortalProps) {
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef<THREE.Group>(null)

  // Persist animation state across hover on/off cycles
  const labelAnimState = useRef<LabelAnimState>({
    currentAngle: 0,
    velocity: 0,
    initialized: false,
  })

  // Ring dimensions based on face data
  const outerRingRadius = PENTAGON_INSCRIBED_RADIUS
  const innerRingRadius = face.holeRadius + INNER_RING_OFFSET

  // Position rings slightly above face surface (along normal direction)
  const RING_OFFSET = 0.03
  const ringPos = useMemo(
    () => face.center.clone().add(face.normal.clone().multiplyScalar(RING_OFFSET)),
    [face.center, face.normal]
  )

  // Create rotation to align with face
  const quaternion = useMemo(() => {
    const up = new THREE.Vector3(0, 0, 1)
    return new THREE.Quaternion().setFromUnitVectors(up, face.normal)
  }, [face.normal])

  // Calculate if inner ring fits between hole edge and outer ring
  const innerRingOuterEdge = innerRingRadius + GROOVE_OFFSET
  const outerRingInnerEdge = outerRingRadius - GROOVE_OFFSET
  const gapBetweenRings = outerRingInnerEdge - innerRingOuterEdge
  const showInnerRing = gapBetweenRings > MIN_GAP_BETWEEN_RINGS

  // Hover handlers
  const handlePointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    if (face.config?.active) {
      setHovered(true)
      document.body.style.cursor = 'pointer'
    }
  }, [face.config?.active])

  const handlePointerOut = useCallback(() => {
    setHovered(false)
    document.body.style.cursor = 'auto'
  }, [])

  // Click handler
  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (face.config?.active && onPortalClick) {
      onPortalClick(face.config.id, face.config.section)
    }
  }, [face.config, onPortalClick])

  // Emissive color for hover state
  const innerRingEmissive = hovered ? '#4a8a6a' : (face.config?.active ? '#2a4a3a' : '#000000')
  const innerRingEmissiveIntensity = hovered ? 0.4 : (face.config?.active ? 0.1 : 0)

  return (
    <group ref={groupRef} position={ringPos} quaternion={quaternion}>
      {/* Invisible hitbox for portal (circle in the hole) */}
      <mesh
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <circleGeometry args={[face.holeRadius, 32]} />
        <meshBasicMaterial transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>

      {/* === OUTER RING (inscribed in pentagon) === */}
      <mesh>
        <torusGeometry args={[outerRingRadius + GROOVE_OFFSET, GROOVE_WIDTH, 8, 32]} />
        <meshStandardMaterial color="#4a3528" metalness={0.6} roughness={0.7} />
      </mesh>
      <mesh>
        <torusGeometry args={[outerRingRadius, RING_WIDTH, 8, 32]} />
        <meshStandardMaterial
          map={textures.map}
          normalMap={textures.normalMap}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
      <mesh>
        <torusGeometry args={[outerRingRadius - GROOVE_OFFSET, GROOVE_WIDTH, 8, 32]} />
        <meshStandardMaterial color="#4a3528" metalness={0.6} roughness={0.7} />
      </mesh>

      {/* === INNER RING (at hole edge) === */}
      {showInnerRing && (
        <>
          <mesh>
            <torusGeometry args={[innerRingRadius + GROOVE_OFFSET, GROOVE_WIDTH, 8, 32]} />
            <meshStandardMaterial color="#4a3528" metalness={0.6} roughness={0.7} />
          </mesh>
          <mesh>
            <torusGeometry args={[innerRingRadius, RING_WIDTH, 8, 32]} />
            <meshStandardMaterial
              map={textures.map}
              normalMap={textures.normalMap}
              metalness={0.9}
              roughness={0.2}
              emissive={innerRingEmissive}
              emissiveIntensity={innerRingEmissiveIntensity}
            />
          </mesh>
          <mesh>
            <torusGeometry args={[innerRingRadius - GROOVE_OFFSET, GROOVE_WIDTH, 8, 32]} />
            <meshStandardMaterial color="#4a3528" metalness={0.6} roughness={0.7} />
          </mesh>
        </>
      )}

      {/* Label shown on hover with pendulum animation */}
      {hovered && face.config?.name && (
        <PendulumLabel name={face.config.name} faceNormal={face.normal} animState={labelAnimState} />
      )}
    </group>
  )
}

// Create hollow dodecahedron with holes using CSG
// Takes pre-computed faces with hole radii to ensure consistency
function createHollowDodecahedronWithHoles(
  outerRadius: number,
  wallThickness: number,
  faces: FaceWithHole[]
): THREE.BufferGeometry {
  const evaluator = new Evaluator()

  // Create outer dodecahedron
  const outerGeo = new THREE.DodecahedronGeometry(outerRadius, 0)
  const outerBrush = new Brush(outerGeo)
  outerBrush.updateMatrixWorld()

  // Create inner dodecahedron (to hollow out)
  const innerRadius = outerRadius - wallThickness
  const innerGeo = new THREE.DodecahedronGeometry(innerRadius, 0)
  const innerBrush = new Brush(innerGeo)
  innerBrush.updateMatrixWorld()

  // Subtract inner from outer to create shell
  let result = evaluator.evaluate(outerBrush, innerBrush, SUBTRACTION)

  // Subtract cylinder for each face to create holes
  for (const face of faces) {
    const cylinderGeo = new THREE.CylinderGeometry(face.holeRadius, face.holeRadius, outerRadius, 32)
    const cylinderBrush = new Brush(cylinderGeo)

    // Position cylinder at face center
    cylinderBrush.position.copy(face.center)

    // Rotate cylinder to align with face normal
    const up = new THREE.Vector3(0, 1, 0)
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, face.normal)
    cylinderBrush.quaternion.copy(quaternion)

    cylinderBrush.updateMatrixWorld()

    // Subtract cylinder
    result = evaluator.evaluate(result, cylinderBrush, SUBTRACTION)
  }

  return result.geometry
}

interface DodecahedronProps {
  onPortalClick?: (faceId: number, section: string | null) => void
}

export function Dodecahedron({ onPortalClick }: DodecahedronProps) {
  const groupRef = useRef<THREE.Group>(null)

  // Load only color and normal textures, control metalness/roughness manually
  const textures = useTexture({
    map: '/textures/Metal047A_1K-JPG/Metal047A_1K-JPG_Color.jpg',
    normalMap: '/textures/Metal047A_1K-JPG/Metal047A_1K-JPG_NormalGL.jpg',
  })

  // Configure texture wrapping
  useMemo(() => {
    Object.values(textures).forEach(tex => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping
      tex.repeat.set(2, 2)
    })
  }, [textures])

  // Get vertices for spheres
  const vertices = useMemo(() => getDodecahedronVertices(RADIUS), [])

  // Get face centers and attach hole radii from config
  // This ensures CSG and ring rendering use the same data
  const facesWithHoles = useMemo(() => {
    const faces = getDodecahedronFaceCenters(RADIUS)
    return faces.map((face, idx) => ({
      ...face,
      holeRadius: FACE_CONFIG[idx]?.holeRadius ?? 1.0,
      config: FACE_CONFIG[idx]
    }))
  }, [])

  // Create hollow geometry with holes (CSG operation)
  const holedGeometry = useMemo(
    () => createHollowDodecahedronWithHoles(RADIUS, WALL_THICKNESS, facesWithHoles),
    [facesWithHoles]
  )

  // Very slow idle rotation (5x slower)
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.03
    }
  })

  return (
    <>
      <group ref={groupRef}>
        {/* Main dodecahedron with holes - bronze material */}
        <mesh geometry={holedGeometry}>
          <meshStandardMaterial
            map={textures.map}
            normalMap={textures.normalMap}
            metalness={0.9}
            roughness={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Interactive portals with hover/click */}
        {facesWithHoles.map((face, idx) => (
          <Portal
            key={`portal-${idx}`}
            face={face}
            idx={idx}
            textures={textures}
            onPortalClick={onPortalClick}
          />
        ))}

        {/* Vertex spheres */}
        {vertices.map((vertex, idx) => {
          const config = SPHERE_CONFIG[idx]
          const pos = vertex.clone().normalize().multiplyScalar(vertex.length() + 0.15)

          return (
            <mesh key={`sphere-${idx}`} position={pos}>
              <sphereGeometry args={[0.25, 16, 16]} />
              <meshStandardMaterial
                map={textures.map}
                normalMap={textures.normalMap}
                metalness={1}
                roughness={0.4}
                emissive={config?.active ? '#2a4a3a' : '#000000'}
                emissiveIntensity={config?.active ? 0.15 : 0}
              />
            </mesh>
          )
        })}
      </group>
    </>
  )
}
