'use client'

import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, useCallback, useRef } from 'react'
import { Dodecahedron } from './Dodecahedron'
import * as THREE from 'three'

// Light that follows the camera
function CameraLight() {
  const { camera } = useThree()
  const lightRef = useRef<THREE.DirectionalLight>(null)

  useFrame(() => {
    if (lightRef.current) {
      // Position light relative to camera
      lightRef.current.position.copy(camera.position)
    }
  })

  return <directionalLight ref={lightRef} intensity={2} />
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

        {/* Ambient + camera-following light for consistent bronze look */}
        <ambientLight intensity={0.6} />
        <CameraLight />

        {/* Background */}
        <color attach="background" args={['#0a0a0f']} />

        <Suspense fallback={null}>
          <Dodecahedron onPortalClick={handlePortalClick} />
        </Suspense>
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
