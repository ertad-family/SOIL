'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, useEffect } from 'react'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { TestPentagonalStructure } from './PentagonalStructure'
import { INNER_RADIUS, LEVEL_HEIGHT } from './config'

/**
 * СЦЕНА КЕНОТАФАРИЯ
 *
 * Система координат: XY плоскость (пентагон), Z вверх (высота)
 * Камера находится ВНУТРИ пятиугольной структуры
 * Пользователь стоит в центре на уровне глаз и смотрит на стены
 */

// Setup fog in the scene
function SceneFog() {
  const { scene } = useThree()

  useEffect(() => {
    // Interior fog - soft atmospheric haze
    scene.fog = new THREE.Fog('#0a0a12', 5, 50)
    return () => {
      scene.fog = null
    }
  }, [scene])

  return null
}

// Lighting for the scene - Z is up
function SceneLighting() {
  return (
    <group>
      {/* Main central point light - illuminates all inner walls and niches */}
      <pointLight
        position={[0, 0, LEVEL_HEIGHT / 2]}
        intensity={200}
        color="#fff5e6"
        decay={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Secondary central light lower down */}
      <pointLight
        position={[0, 0, 0.5]}
        intensity={100}
        color="#ffd699"
        decay={1}
      />

      {/* Ambient fill for soft shadows */}
      <ambientLight intensity={0.4} />
    </group>
  )
}

interface CenotapherySceneProps {
  className?: string
}

export function CenotapheryScene({ className }: CenotapherySceneProps) {
  return (
    <div className={className} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{
          // Камера смотрит сверху вниз на XY плоскость (Z = высота)
          position: [0, -20, 15],  // Позиция: немного назад по Y, выше по Z
          fov: 60,
          near: 0.1,
          far: 200,
          up: [0, 0, 1],  // Z вверх
        }}
        gl={{ antialias: true, alpha: false }}
        shadows="soft"
      >
        {/* Camera controls */}
        <OrbitControls
          target={[0, 0, LEVEL_HEIGHT / 2]}  // Смотрим на центр уровня
          minDistance={5}
          maxDistance={50}
          enablePan={true}
          enableDamping
          dampingFactor={0.05}
        />

        {/* Lighting */}
        <SceneLighting />

        {/* Fog for atmosphere */}
        <SceneFog />

        {/* Background color */}
        <color attach="background" args={['#050508']} />

        <Suspense fallback={null}>
          {/* Main structure - тестовая с 5 нишами */}
          <TestPentagonalStructure />
        </Suspense>

        {/* Post-processing */}
        <EffectComposer>
          <Bloom
            intensity={0.4}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
