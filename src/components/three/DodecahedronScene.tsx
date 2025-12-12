'use client'

import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, useCallback, useRef, useEffect } from 'react'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Dodecahedron } from './Dodecahedron'
import { VoidEnvironment } from './VoidEnvironment'
import * as THREE from 'three'

// Key light that follows camera with offset (prevents frontal overexposure)
function KeyLight() {
  const { camera } = useThree()
  const lightRef = useRef<THREE.DirectionalLight>(null)

  useFrame(() => {
    if (lightRef.current) {
      // Get camera's right and up vectors in world space
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion)
      const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion)

      // Position light offset from camera: right +5, up +8 (upper-right)
      lightRef.current.position.copy(camera.position)
        .add(right.multiplyScalar(5))
        .add(up.multiplyScalar(8))
    }
  })

  return <directionalLight ref={lightRef} intensity={1.2} color="#fff5e6" />
}

// Fill light on the opposite side for softer shadows
function FillLight() {
  const { camera } = useThree()
  const lightRef = useRef<THREE.DirectionalLight>(null)

  useFrame(() => {
    if (lightRef.current) {
      // Get camera's left and down vectors
      const left = new THREE.Vector3(-1, 0, 0).applyQuaternion(camera.quaternion)
      const down = new THREE.Vector3(0, -1, 0).applyQuaternion(camera.quaternion)

      // Position light offset: left +6, down +3 (lower-left)
      lightRef.current.position.copy(camera.position)
        .add(left.multiplyScalar(6))
        .add(down.multiplyScalar(3))
    }
  })

  return <directionalLight ref={lightRef} intensity={0.4} color="#e6f0ff" />
}

// Setup fog in the scene
function SceneFog() {
  const { scene } = useThree()

  useEffect(() => {
    // Linear fog: starts at 30 units, fully opaque at 100 units
    // Color: deep dark blue (#000510)
    scene.fog = new THREE.Fog('#000510', 30, 120)

    return () => {
      scene.fog = null
    }
  }, [scene])

  return null
}

interface DodecahedronSceneProps {
  className?: string
  onPortalClick?: (faceId: number, section: string | null) => void
}

export function DodecahedronScene({ className, onPortalClick }: DodecahedronSceneProps) {
  // Default handler logs to console if no callback provided
  const handlePortalClick = useCallback((faceId: number, section: string | null) => {
    console.log(`Portal clicked: Face ${faceId}, Section: ${section}`)
    onPortalClick?.(faceId, section)
  }, [onPortalClick])

  return (
    <div className={className} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 18], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
      >
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={8}
          maxDistance={35}
        />

        {/* Multi-point lighting for metallic reflections */}
        <ambientLight intensity={0.2} />
        <KeyLight />
        <FillLight />

        {/* Fixed point lights close to object for visible specular highlights */}
        {/* Top-right warm key light */}
        <pointLight position={[5, 6, 4]} intensity={60} color="#fff5e6" distance={20} decay={2} />
        {/* Left cool fill */}
        <pointLight position={[-5, 2, 3]} intensity={30} color="#e6f0ff" distance={20} decay={2} />
        {/* Bottom accent */}
        <pointLight position={[0, -5, 5]} intensity={25} color="#ffd699" distance={15} decay={2} />
        {/* Back rim light */}
        <pointLight position={[2, 3, -6]} intensity={40} color="#ffcc80" distance={20} decay={2} />

        {/* Background */}
        <color attach="background" args={['#0a0a0f']} />

        {/* Fog for depth fade */}
        <SceneFog />

        <Suspense fallback={null}>
          {/* Void environment: grid + golden particles */}
          <VoidEnvironment
            gridSize={200}
            gridDivisions={13}
            particleCount={50}
          />

          {/* Main dodecahedron */}
          <Dodecahedron onPortalClick={handlePortalClick} />
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
    </div>
  )
}
