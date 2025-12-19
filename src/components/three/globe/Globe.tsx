"use client";

import { useRef } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const GLOBE_RADIUS = 100;
const GLOBE_SEGMENTS = 64;

/**
 * Earth globe with NASA Blue Marble texture
 * Slightly desaturated for a subdued, elegant look
 */
export function Globe() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Load NASA Blue Marble texture
  const texture = useTexture("/textures/earth-blue-marble.jpg");

  // Configure texture for proper mapping
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[GLOBE_RADIUS, GLOBE_SEGMENTS, GLOBE_SEGMENTS]} />
      <meshStandardMaterial map={texture} metalness={0} roughness={1} />
    </mesh>
  );
}

export { GLOBE_RADIUS };
