'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import { Dodecahedron } from './Dodecahedron'

interface DodecahedronSceneProps {
  className?: string
}

export function DodecahedronScene({ className }: DodecahedronSceneProps) {
  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
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

        {/* Lighting - simple setup */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-5, -5, -10]} intensity={0.3} />

        {/* Background */}
        <color attach="background" args={['#0a0a0f']} />

        <Suspense fallback={null}>
          <Dodecahedron />
        </Suspense>
      </Canvas>
    </div>
  )
}
