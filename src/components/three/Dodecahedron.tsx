'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Brush, Evaluator, SUBTRACTION } from 'three-bvh-csg'

// Portal configuration for each face
export const FACE_CONFIG = [
  { id: 0, name: 'Home', section: 'home', active: true },
  { id: 1, name: 'Research', section: 'research', active: true },
  { id: 2, name: 'Memorials', section: 'memorials', active: true },
  { id: 3, name: 'Diagnostics', section: 'diagnostics', active: true },
  { id: 4, name: 'Education', section: 'education', active: true },
  { id: 5, name: 'Clinic', section: 'clinic', active: true },
  { id: 6, name: 'Community', section: 'community', active: true },
  { id: 7, name: 'Future 1', section: null, active: false },
  { id: 8, name: 'Future 2', section: null, active: false },
  { id: 9, name: 'Future 3', section: null, active: false },
  { id: 10, name: 'Future 4', section: null, active: false },
  { id: 11, name: 'Future 5', section: null, active: false },
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
const HOLE_RADIUS = 1.0 // Size of portal holes

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
function getDodecahedronFaceCenters(radius: number): { center: THREE.Vector3; normal: THREE.Vector3 }[] {
  const geometry = new THREE.DodecahedronGeometry(radius, 0)
  const positionAttr = geometry.getAttribute('position')

  const faces: { center: THREE.Vector3; normal: THREE.Vector3 }[] = []
  const seen = new Set<string>()

  // Each face is made of triangles, compute face normals and centers
  for (let i = 0; i < positionAttr.count; i += 3) {
    const v1 = new THREE.Vector3(
      positionAttr.getX(i),
      positionAttr.getY(i),
      positionAttr.getZ(i)
    )
    const v2 = new THREE.Vector3(
      positionAttr.getX(i + 1),
      positionAttr.getY(i + 1),
      positionAttr.getZ(i + 1)
    )
    const v3 = new THREE.Vector3(
      positionAttr.getX(i + 2),
      positionAttr.getY(i + 2),
      positionAttr.getZ(i + 2)
    )

    // Compute normal
    const edge1 = new THREE.Vector3().subVectors(v2, v1)
    const edge2 = new THREE.Vector3().subVectors(v3, v1)
    const normal = new THREE.Vector3().crossVectors(edge1, edge2).normalize()

    // Round normal for grouping triangles by face
    const normalKey = `${normal.x.toFixed(3)},${normal.y.toFixed(3)},${normal.z.toFixed(3)}`

    if (!seen.has(normalKey)) {
      seen.add(normalKey)
      // Face center is along the normal direction
      const center = normal.clone().multiplyScalar(radius * 0.795) // Approximate inscribed radius
      faces.push({ center, normal })
    }
  }

  geometry.dispose()
  return faces
}

// Create hollow dodecahedron with holes using CSG
function createHollowDodecahedronWithHoles(
  outerRadius: number,
  wallThickness: number,
  holeRadius: number
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

  // Get face centers for holes
  const faces = getDodecahedronFaceCenters(outerRadius)

  // Subtract cylinder for each face to create holes
  for (const face of faces) {
    const cylinderGeo = new THREE.CylinderGeometry(holeRadius, holeRadius, outerRadius, 32)
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

export function Dodecahedron() {
  const groupRef = useRef<THREE.Group>(null)

  // Get vertices for spheres
  const vertices = useMemo(() => getDodecahedronVertices(RADIUS), [])

  // Get face centers for rings
  const faceCenters = useMemo(() => getDodecahedronFaceCenters(RADIUS), [])

  // Create hollow geometry with holes (CSG operation)
  const holedGeometry = useMemo(() => createHollowDodecahedronWithHoles(RADIUS, WALL_THICKNESS, HOLE_RADIUS), [])

  // Very slow idle rotation (5x slower)
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.03
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main dodecahedron with holes */}
      <mesh geometry={holedGeometry}>
        <meshStandardMaterial
          color="#5c4a32"
          metalness={0.85}
          roughness={0.45}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Portal rings (torus around each hole) */}
      {faceCenters.map((face, idx) => {
        const config = FACE_CONFIG[idx]
        // Position ring at face center
        const ringPos = face.center.clone().multiplyScalar(1.01)

        // Create rotation to align torus with face
        const up = new THREE.Vector3(0, 0, 1)
        const quaternion = new THREE.Quaternion().setFromUnitVectors(up, face.normal)

        return (
          <mesh
            key={`ring-${idx}`}
            position={ringPos}
            quaternion={quaternion}
          >
            <torusGeometry args={[HOLE_RADIUS + 0.08, 0.06, 16, 32]} />
            <meshStandardMaterial
              color={config?.active ? '#8b7355' : '#4a3d2e'}
              metalness={0.9}
              roughness={0.3}
              emissive={config?.active ? '#c4a15a' : '#000000'}
              emissiveIntensity={config?.active ? 0.15 : 0}
            />
          </mesh>
        )
      })}

      {/* Vertex spheres */}
      {vertices.map((vertex, idx) => {
        const config = SPHERE_CONFIG[idx]
        const pos = vertex.clone().normalize().multiplyScalar(vertex.length() + 0.15)

        return (
          <mesh key={`sphere-${idx}`} position={pos}>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial
              color={config?.active ? '#6b5a42' : '#3d3226'}
              metalness={0.8}
              roughness={config?.active ? 0.35 : 0.6}
              emissive={config?.active ? '#c4a15a' : '#000000'}
              emissiveIntensity={config?.active ? 0.2 : 0}
            />
          </mesh>
        )
      })}
    </group>
  )
}
