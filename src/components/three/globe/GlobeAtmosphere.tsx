"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GLOBE_RADIUS } from "./Globe";

/**
 * Simple atmospheric glow effect around the globe
 * Uses a slightly larger translucent sphere with additive blending
 */
export function GlobeAtmosphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  // Update the glow to always face the camera for fresnel-like effect
  useFrame(() => {
    if (meshRef.current && meshRef.current.material) {
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      // Subtle pulsing effect
      const time = Date.now() * 0.001;
      material.opacity = 0.15 + Math.sin(time * 0.5) * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} scale={1.08}>
      <sphereGeometry args={[GLOBE_RADIUS, 32, 32]} />
      <meshBasicMaterial
        color="#729BBB"
        transparent
        opacity={0.15}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}
