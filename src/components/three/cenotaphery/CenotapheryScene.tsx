"use client";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import { Suspense, useEffect, useRef, useMemo } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useIsMobile } from "@/lib/utils";
import * as THREE from "three";
import { TestPentagonalStructure } from "./PentagonalStructure";
import { LEVEL_HEIGHT, WALL_HEIGHT, OUTER_RADIUS } from "./config";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

/**
 * СЦЕНА КЕНОТАФАРИЯ
 *
 * Система координат: Y вверх (стандарт Three.js)
 *
 * Управление:
 * - Мышь: вращение вокруг точки (drag) + зум (scroll)
 * - WASD / Стрелки: перемещение камеры и точки обзора вместе
 * - Q/E: вверх/вниз
 */

// Combined OrbitControls + WASD movement
function CameraControls({ speed = 0.5 }: { speed?: number }) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const keysPressed = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.code);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.code);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame(() => {
    const keys = keysPressed.current;
    const controls = controlsRef.current;
    if (keys.size === 0 || !controls) return;

    const moveVector = new THREE.Vector3();

    // Вперёд/назад (W/S или Up/Down) - по оси Z
    if (keys.has("KeyW") || keys.has("ArrowUp")) {
      moveVector.z -= speed;
    }
    if (keys.has("KeyS") || keys.has("ArrowDown")) {
      moveVector.z += speed;
    }

    // Влево/вправо (A/D или Left/Right) - по оси X
    if (keys.has("KeyA") || keys.has("ArrowLeft")) {
      moveVector.x -= speed;
    }
    if (keys.has("KeyD") || keys.has("ArrowRight")) {
      moveVector.x += speed;
    }

    // Вверх/вниз (Q/E) - по оси Y
    if (keys.has("KeyQ")) {
      moveVector.y -= speed;
    }
    if (keys.has("KeyE")) {
      moveVector.y += speed;
    }

    // Двигаем и камеру, и target вместе
    camera.position.add(moveVector);
    controls.target.add(moveVector);
  });

  return <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />;
}

// Setup fog in the scene
function SceneFog() {
  const { scene } = useThree();

  useEffect(() => {
    // Interior fog - soft atmospheric haze
    scene.fog = new THREE.Fog("#0a0a12", 5, 50);
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  return null;
}

// Lighting for the scene - Y is up
function SceneLighting() {
  return (
    <group>
      {/* Main central point light - illuminates all inner walls and niches */}
      <pointLight
        position={[0, LEVEL_HEIGHT / 2, 0]}
        intensity={200}
        color="#fff5e6"
        decay={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Secondary central light lower down */}
      <pointLight position={[0, 0.5, 0]} intensity={100} color="#ffd699" decay={1} />

      {/* Hemisphere light - natural sky/ground lighting */}
      <hemisphereLight
        color="#87CEEB" // Sky color (light blue)
        groundColor="#3d2817" // Ground color (warm brown)
        intensity={0.8}
        position={[0, 50, 0]}
      />

      {/* Ambient fill for soft shadows */}
      <ambientLight intensity={0.2} />
    </group>
  );
}

/**
 * Пентагональный пол
 * Геометрия в плоскости XY (как структура), затем поворачивается вместе со структурой
 */
function PentagonFloor() {
  // Загружаем текстуры плитки
  const textures = useTexture({
    map: "/textures/Tiles079_1K-JPG/Tiles079_1K-JPG_Color.jpg",
    normalMap: "/textures/Tiles079_1K-JPG/Tiles079_1K-JPG_NormalGL.jpg",
    roughnessMap: "/textures/Tiles079_1K-JPG/Tiles079_1K-JPG_Roughness.jpg",
    displacementMap: "/textures/Tiles079_1K-JPG/Tiles079_1K-JPG_Displacement.jpg",
  });

  // Настраиваем повторение текстуры
  useMemo(() => {
    Object.values(textures).forEach((texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(8, 8);
    });
  }, [textures]);

  // Создаём пентагональную форму в плоскости XY
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();

    // Вершины правильного пятиугольника
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2; // Начинаем с вершины направленной вверх
      const x = OUTER_RADIUS * Math.cos(angle);
      const y = OUTER_RADIUS * Math.sin(angle);

      if (i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    }
    shape.closePath();

    // ShapeGeometry создаёт плоскость в XY
    const geo = new THREE.ShapeGeometry(shape);

    // Добавляем UV координаты для текстуры (нормализуем к размеру)
    const uvAttribute = geo.getAttribute("uv");
    const posAttribute = geo.getAttribute("position");
    for (let i = 0; i < uvAttribute.count; i++) {
      const x = posAttribute.getX(i);
      const y = posAttribute.getY(i);
      // Нормализуем UV так, чтобы текстура масштабировалась правильно
      uvAttribute.setXY(i, x / 10, y / 10);
    }

    return geo;
  }, []);

  return (
    <mesh geometry={geometry} receiveShadow position={[0, 0, 0]}>
      <meshStandardMaterial {...textures} displacementScale={0} roughness={0.7} metalness={0.1} />
    </mesh>
  );
}

interface CenotapherySceneProps {
  className?: string;
}

export function CenotapheryScene({ className }: CenotapherySceneProps) {
  // Mobile detection for performance optimization
  const isMobile = useIsMobile();

  return (
    <div className={className} style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas
        camera={{
          // Стандартная система координат: Y вверх
          position: [0, 15, 40], // Позиция: выше по Y, назад по Z
          fov: 60,
          near: 0.1,
          far: 500,
          up: [0, 1, 0], // Y вверх (стандарт Three.js)
        }}
        gl={{ antialias: !isMobile, alpha: false }}
        shadows={isMobile ? false : "soft"}
      >
        {/* Combined mouse + keyboard controls */}
        <CameraControls speed={0.8} />

        {/* Lighting */}
        <SceneLighting />

        {/* Fog for atmosphere */}
        <SceneFog />

        {/* Background color */}
        <color attach="background" args={["#050508"]} />

        <Suspense fallback={null}>
          {/* Main structure - повёрнута чтобы Y была вверх (исходно Z вверх) */}
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <TestPentagonalStructure />
            <PentagonFloor />
          </group>
        </Suspense>

        {/* Post-processing - disabled on mobile for performance */}
        {!isMobile && (
          <EffectComposer>
            <Bloom intensity={0.4} luminanceThreshold={0.3} luminanceSmoothing={0.9} mipmapBlur />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
