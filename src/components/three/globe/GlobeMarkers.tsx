"use client";

import { useRef, useMemo, useCallback } from "react";
import { useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { GLOBE_RADIUS } from "./Globe";
import type { CenotapheryMarker } from "@/types/cenotaphery";
import { latLngToVector3, getMarkerColor, getMarkerSize } from "@/types/cenotaphery";

interface GlobeMarkersProps {
  markers: CenotapheryMarker[];
  selectedMarkerId: string | null;
  hoveredMarkerId: string | null;
  activeMarkerId: string | null;
  onMarkerSelect: (marker: CenotapheryMarker | null) => void;
  onMarkerHover: (marker: CenotapheryMarker | null) => void;
}

// Marker height above globe surface
const MARKER_HEIGHT = 3;

/**
 * Individual marker component with glow effect and enhanced active state
 */
function Marker({
  marker,
  isSelected,
  isHovered,
  isActive,
  onSelect,
  onHover,
}: {
  marker: CenotapheryMarker;
  isSelected: boolean;
  isHovered: boolean;
  isActive: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const { gl } = useThree();

  // Animated values for smooth transitions
  const animatedScale = useRef(1);
  const animatedEmissive = useRef(0.2);

  // Calculate 3D position from lat/lng
  const position = useMemo(() => {
    const [x, y, z] = latLngToVector3(
      marker.coordinates.lat,
      marker.coordinates.lng,
      GLOBE_RADIUS + MARKER_HEIGHT
    );
    return new THREE.Vector3(x, y, z);
  }, [marker.coordinates]);

  // Get color and size based on marker state
  const color = useMemo(() => getMarkerColor(marker), [marker]);
  const baseSize = useMemo(() => getMarkerSize(marker), [marker]);

  // Target scale based on state: active > selected > hovered > normal
  const getTargetScale = () => {
    if (isSelected) return 1.3;
    if (isActive) return 1.8; // Bigger when auto-highlighted
    if (isHovered) return 1.2;
    return 1.0;
  };

  // Target emissive intensity
  const getTargetEmissive = () => {
    if (isSelected) return 0.6;
    if (isActive) return 0.8; // Brighter when auto-highlighted
    if (isHovered) return 0.5;
    return 0.2;
  };

  // Smooth animation with ease-in-ease-out using lerp
  useFrame((state) => {
    const targetScale = getTargetScale();
    const targetEmissive = getTargetEmissive();

    // Ease-in-ease-out lerp factor (slower for smoother transitions)
    const lerpFactor = 0.08;

    // Animate scale
    animatedScale.current = THREE.MathUtils.lerp(animatedScale.current, targetScale, lerpFactor);

    // Animate emissive
    animatedEmissive.current = THREE.MathUtils.lerp(
      animatedEmissive.current,
      targetEmissive,
      lerpFactor
    );

    // Apply animated values
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = animatedEmissive.current;

      // Pulse animation for full markers or active markers
      if (marker.status === "full" || isActive) {
        const pulseIntensity = isActive ? 0.15 : 0.1;
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * pulseIntensity;
        meshRef.current.scale.setScalar(baseSize * animatedScale.current * pulse);
      } else {
        meshRef.current.scale.setScalar(baseSize * animatedScale.current);
      }
    }

    // Glow intensity animation
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      const targetOpacity = isActive ? 0.7 : isHovered || isSelected ? 0.6 : 0.3;
      material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity, lerpFactor);

      // Scale glow with marker
      glowRef.current.scale.setScalar(baseSize * animatedScale.current * 1.5);
    }
  });

  const handlePointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      onHover(true);
      // Override grab cursor from globe rotation - use canvas directly
      gl.domElement.style.cursor = "pointer";
    },
    [onHover, gl]
  );

  const handlePointerOut = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      onHover(false);
      // Restore grab cursor for globe rotation
      gl.domElement.style.cursor = "grab";
    },
    [onHover, gl]
  );

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      onSelect();
    },
    [onSelect]
  );

  // Hitbox size - larger than visual for easier clicking
  const hitboxSize = 3;

  return (
    <group position={position}>
      {/* Invisible hitbox for easier clicking */}
      <mesh
        scale={hitboxSize}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Glow sphere (behind marker) - scale controlled by useFrame */}
      <mesh ref={glowRef} scale={baseSize * 1.5}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} depthWrite={false} />
      </mesh>

      {/* Main marker sphere - scale and emissive controlled by useFrame for smooth animation */}
      <mesh ref={meshRef} scale={baseSize}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>

      {/* Selection ring - small and subtle */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={baseSize * 1.8}>
          <ringGeometry args={[1.3, 1.5, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Hover tooltip - using Html from drei */}
      {isHovered && !isSelected && (
        <Html
          position={[0, baseSize * 2 + 2, 0]}
          center
          style={{
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          <div className="px-3 py-2 bg-slate-900/95 border border-gold-500/30 rounded-lg shadow-xl">
            <p className="text-marble-100 text-sm font-medium">{marker.name}</p>
            <p className="text-slate-400 text-xs">
              {marker.statistics.cenotaphCount} / {marker.statistics.capacity}
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}

/**
 * Container component for all globe markers
 */
export function GlobeMarkers({
  markers,
  selectedMarkerId,
  hoveredMarkerId,
  activeMarkerId,
  onMarkerSelect,
  onMarkerHover,
}: GlobeMarkersProps) {
  return (
    <group>
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          marker={marker}
          isSelected={selectedMarkerId === marker.id}
          isHovered={hoveredMarkerId === marker.id}
          isActive={activeMarkerId === marker.id}
          onSelect={() => onMarkerSelect(marker)}
          onHover={(hovered) => onMarkerHover(hovered ? marker : null)}
        />
      ))}
    </group>
  );
}
