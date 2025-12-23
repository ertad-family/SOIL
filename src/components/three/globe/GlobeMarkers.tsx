"use client";

import { useMemo, useCallback } from "react";
import { useThree, ThreeEvent } from "@react-three/fiber";
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

// Obelisk dimensions - scaled down by 50%
const OBELISK_HEIGHT = 4; // Total height of obelisk shaft
const OBELISK_BASE_WIDTH = 0.8; // Width at base
const OBELISK_TOP_WIDTH = 0.4; // Width at top (before pyramidion)
const PYRAMIDION_HEIGHT = 1; // Height of the pyramidal top

// Distance from globe surface to obelisk base
const MARKER_HEIGHT = 1;

/**
 * Individual obelisk marker component - Classic Egyptian style
 * Tall, four-sided tapering pillar with pyramidal top (pyramidion)
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
  const { gl } = useThree();

  // Calculate 3D position from lat/lng (base of obelisk)
  const position = useMemo(() => {
    const [x, y, z] = latLngToVector3(
      marker.coordinates.lat,
      marker.coordinates.lng,
      GLOBE_RADIUS + MARKER_HEIGHT
    );
    return new THREE.Vector3(x, y, z);
  }, [marker.coordinates]);

  // Calculate rotation to point obelisk radially outward from globe center
  const rotation = useMemo(() => {
    // The obelisk should point in the direction of the position vector
    // Default cylinder points along Y axis, we need to rotate it to point along position
    const up = new THREE.Vector3(0, 1, 0);
    const direction = position.clone().normalize();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction);
    const euler = new THREE.Euler().setFromQuaternion(quaternion);
    return euler;
  }, [position]);

  // Get color and size based on marker state
  const color = useMemo(() => getMarkerColor(marker), [marker]);
  const sizeMultiplier = useMemo(() => getMarkerSize(marker), [marker]);

  // Scale obelisk based on marker importance (0.5 to 1.5 range)
  const obeliskScale = 0.5 + sizeMultiplier * 0.3;

  // Static scale based on state (no animation for performance)
  const stateScale = isSelected ? 1.2 : isActive ? 1.4 : isHovered ? 1.1 : 1.0;
  const finalScale = obeliskScale * stateScale;

  const emissiveIntensity = isSelected ? 0.6 : isActive ? 0.8 : isHovered ? 0.5 : 0.2;
  const glowOpacity = isActive ? 0.5 : isHovered || isSelected ? 0.4 : 0.2;

  const handlePointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      onHover(true);
      gl.domElement.style.cursor = "pointer";
    },
    [onHover, gl]
  );

  const handlePointerOut = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      onHover(false);
    },
    [onHover]
  );

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      onSelect();
    },
    [onSelect]
  );

  // Obelisk shaft dimensions (in local space, will be scaled)
  const shaftHeight = OBELISK_HEIGHT;
  const shaftBaseRadius = OBELISK_BASE_WIDTH / 2;
  const shaftTopRadius = OBELISK_TOP_WIDTH / 2;

  // Pyramidion (top pyramid) dimensions
  const pyramidionHeight = PYRAMIDION_HEIGHT;

  return (
    <group position={position} rotation={rotation}>
      {/* Invisible hitbox for easier clicking - elongated box */}
      <mesh
        position={[0, (shaftHeight / 2) * finalScale, 0]}
        scale={[3, shaftHeight * finalScale, 3]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Glow effect - soft sphere around obelisk */}
      <mesh position={[0, (shaftHeight / 2) * finalScale, 0]} scale={finalScale * 2}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={glowOpacity} depthWrite={false} />
      </mesh>

      {/* Obelisk shaft - tapered cylinder with 4 sides */}
      <mesh position={[0, (shaftHeight / 2) * finalScale, 0]} scale={finalScale}>
        <cylinderGeometry args={[shaftTopRadius, shaftBaseRadius, shaftHeight, 4]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      {/* Pyramidion (top pyramid) - 4-sided cone */}
      <mesh position={[0, (shaftHeight + pyramidionHeight / 2) * finalScale, 0]} scale={finalScale}>
        <coneGeometry args={[shaftTopRadius, pyramidionHeight, 4]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity * 1.2}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>

      {/* Selection ring at base */}
      {isSelected && (
        <mesh scale={finalScale * 2}>
          <ringGeometry args={[1.5, 2, 4]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Tooltip - positioned above obelisk tip, clickable to open card */}
      {(isHovered || isActive) && !isSelected && (
        <Html
          position={[0, (shaftHeight + pyramidionHeight + 3) * finalScale, 0]}
          center
          style={{
            whiteSpace: "nowrap",
          }}
        >
          <div
            className="px-3 py-2 bg-slate-900/95 border border-gold-500/30 rounded-lg shadow-xl cursor-pointer hover:border-gold-500/50 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
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
