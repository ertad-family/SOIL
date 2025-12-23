"use client";

import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stats } from "@react-three/drei";
// Post-processing imports - currently disabled for performance (#200)
// import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useIsMobile } from "@/lib/utils";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { Globe, GLOBE_RADIUS } from "./Globe";
import { GlobeAtmosphere } from "./GlobeAtmosphere";
import { GlobeMarkers } from "./GlobeMarkers";
import type { CenotapheryMarker } from "@/types/cenotaphery";

// Camera configuration from spec
const CAMERA_CONFIG = {
  fov: 45,
  near: 1,
  far: 1000,
  initialDistance: 300,
  minDistance: 160, // Increased from 120 to prevent zooming too close
  maxDistance: 400,
};

// OrbitControls - only for zoom now, rotation handled by globe itself
const CONTROLS_CONFIG = {
  enableRotate: false, // Disabled - globe rotates instead
  enableZoom: true,
  zoomSpeed: 0.8,
  enablePan: false,
  enableDamping: true,
  dampingFactor: 0.05,
};

interface GlobeSceneProps {
  markers: CenotapheryMarker[];
  selectedMarkerId: string | null;
  hoveredMarkerId: string | null;
  activeMarkerId: string | null;
  tooltipCooldownUntil: number; // Timestamp until which tooltip shouldn't reappear
  onMarkerSelect: (marker: CenotapheryMarker | null) => void;
  onMarkerHover: (marker: CenotapheryMarker | null) => void;
  onActiveMarkerChange: (marker: CenotapheryMarker | null) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}

// Auto-rotation speed (radians per second)
const AUTO_ROTATE_SPEED = 0.1;

/**
 * Rotatable globe group - handles drag-to-rotate and auto-rotation
 * Globe rotates around Y axis (longitude) and X axis (latitude)
 * Only activates when mouse is hovering over the globe area
 */
function RotatableGlobe({
  children,
  globeRef,
  autoRotate,
  setAutoRotate,
  isGlobeHovered,
  setIsGlobeHovered,
  hoveredMarkerId,
}: {
  children: React.ReactNode;
  globeRef: React.RefObject<THREE.Group | null>;
  autoRotate: boolean;
  setAutoRotate: (value: boolean) => void;
  isGlobeHovered: boolean;
  setIsGlobeHovered: (value: boolean) => void;
  hoveredMarkerId: string | null;
}) {
  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const { gl } = useThree();

  // Handle pointer events for drag rotation - only when hovering over globe
  useEffect(() => {
    const canvas = gl.domElement;

    const onPointerDown = (e: PointerEvent) => {
      // Only start drag if hovering over globe or a marker (markers are on the globe)
      if (!isGlobeHovered && !hoveredMarkerId) return;

      isDragging.current = true;
      previousMouse.current = { x: e.clientX, y: e.clientY };
      velocity.current = { x: 0, y: 0 };
      setAutoRotate(false);
      canvas.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current || !globeRef.current) return;

      const deltaX = e.clientX - previousMouse.current.x;
      const deltaY = e.clientY - previousMouse.current.y;

      // Rotate globe (invert X for natural feel)
      const rotateSpeed = 0.005;
      globeRef.current.rotation.y += deltaX * rotateSpeed;
      globeRef.current.rotation.x += deltaY * rotateSpeed;

      // Clamp X rotation to prevent flipping
      globeRef.current.rotation.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, globeRef.current.rotation.x)
      );

      // Store velocity for inertia
      velocity.current = { x: deltaX * rotateSpeed, y: deltaY * rotateSpeed };

      previousMouse.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        // Restore cursor based on hover state (globe or marker)
        canvas.style.cursor = isGlobeHovered || hoveredMarkerId ? "grab" : "default";
      }
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerUp);
    };
  }, [gl, globeRef, setAutoRotate, isGlobeHovered, hoveredMarkerId]);

  // Update cursor when hover state changes
  useEffect(() => {
    const canvas = gl.domElement;
    if (!isDragging.current) {
      // When hovering a marker, the marker sets cursor to "pointer"
      // When hovering globe (not marker), show "grab"
      // When hovering neither, show "default"
      if (!hoveredMarkerId && isGlobeHovered) {
        canvas.style.cursor = "grab";
      } else if (!hoveredMarkerId && !isGlobeHovered) {
        canvas.style.cursor = "default";
      }
      // When hoveredMarkerId is set, marker already set cursor to "pointer"
    }
  }, [gl, isGlobeHovered, hoveredMarkerId]);

  // Auto-rotation and inertia
  useFrame((_, delta) => {
    if (!globeRef.current) return;

    if (!isDragging.current) {
      // Apply inertia (velocity decay)
      if (Math.abs(velocity.current.x) > 0.0001 || Math.abs(velocity.current.y) > 0.0001) {
        globeRef.current.rotation.y += velocity.current.x;
        globeRef.current.rotation.x += velocity.current.y;

        // Clamp X rotation
        globeRef.current.rotation.x = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, globeRef.current.rotation.x)
        );

        // Decay velocity
        velocity.current.x *= 0.95;
        velocity.current.y *= 0.95;
      } else {
        // Inertia has stopped - re-enable auto-rotation
        if (!autoRotate) {
          setAutoRotate(true);
        }
        // Auto-rotate when not dragging, no inertia, and not hovering a marker
        if (!hoveredMarkerId) {
          globeRef.current.rotation.y += AUTO_ROTATE_SPEED * delta;
        }
      }
    }
  });

  // Hit detection sphere radius - slightly larger than globe for easier targeting
  const hitSphereRadius = GLOBE_RADIUS * 1.15;

  return (
    <group ref={globeRef}>
      {/* Invisible hit detection sphere - slightly larger than globe */}
      <mesh
        onPointerEnter={() => setIsGlobeHovered(true)}
        onPointerLeave={() => setIsGlobeHovered(false)}
      >
        <sphereGeometry args={[hitSphereRadius, 32, 32]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {children}
    </group>
  );
}

/**
 * Component to handle fly-to animation when a marker is selected
 * Now rotates globe to show marker instead of moving camera
 */
function FlyToController({
  selectedMarker,
  globeRef,
  setAutoRotate,
}: {
  selectedMarker: CenotapheryMarker | null;
  globeRef: React.RefObject<THREE.Group | null>;
  setAutoRotate: (value: boolean) => void;
}) {
  const animationRef = useRef({
    isAnimating: false,
    startTime: 0,
    startRotation: new THREE.Euler(),
    targetRotation: new THREE.Euler(),
  });

  useEffect(() => {
    if (!selectedMarker || !globeRef.current) return;

    // Calculate target rotation to bring marker to front
    // Convert lat/lng to rotation angles
    const lat = selectedMarker.coordinates.lat * (Math.PI / 180);
    const lng = selectedMarker.coordinates.lng * (Math.PI / 180);

    // Target rotation: negate longitude and add -90° offset
    // The -π/2 offset accounts for the camera being on the +Z axis
    // while latLngToVector3 places lng=0 on the +X axis
    const targetY = -lng - Math.PI / 2;
    const targetX = lat;

    // Start animation
    animationRef.current = {
      isAnimating: true,
      startTime: 0,
      startRotation: globeRef.current.rotation.clone(),
      targetRotation: new THREE.Euler(targetX, targetY, 0),
    };

    setAutoRotate(false);
  }, [selectedMarker, globeRef, setAutoRotate]);

  useFrame((state) => {
    const anim = animationRef.current;
    if (!anim.isAnimating || !globeRef.current) return;

    if (anim.startTime === 0) {
      anim.startTime = state.clock.elapsedTime;
    }

    const elapsed = state.clock.elapsedTime - anim.startTime;
    const duration = 1.2;
    const t = Math.min(elapsed / duration, 1);

    // Ease in-out cubic
    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    // Interpolate rotation
    globeRef.current.rotation.x = THREE.MathUtils.lerp(
      anim.startRotation.x,
      anim.targetRotation.x,
      eased
    );
    globeRef.current.rotation.y = THREE.MathUtils.lerp(
      anim.startRotation.y,
      anim.targetRotation.y,
      eased
    );

    if (t >= 1) {
      anim.isAnimating = false;
    }
  });

  return null;
}

/**
 * Lighting setup for the globe scene
 */
function Lighting() {
  return (
    <>
      {/* Main directional light (sun) */}
      <directionalLight position={[200, 100, 200]} intensity={3} color="#ffffff" />
      {/* Fill light from opposite side */}
      <directionalLight position={[-200, -50, -200]} intensity={1} color="#a0c0ff" />
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={1} color="#ffffff" />
    </>
  );
}

/**
 * Loading fallback component
 */
function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[GLOBE_RADIUS, 32, 32]} />
      <meshBasicMaterial color="#1a2a3a" wireframe />
    </mesh>
  );
}

/**
 * Performance logger - logs renderer stats every 2 seconds (development only)
 */
function PerformanceLogger() {
  const { gl } = useThree();
  const lastLogTime = useRef(0);

  useFrame((state) => {
    const now = state.clock.elapsedTime;
    if (now - lastLogTime.current > 2) {
      lastLogTime.current = now;
      const info = gl.info;
      console.log("[GlobeScene Performance]", {
        drawCalls: info.render.calls,
        triangles: info.render.triangles,
        points: info.render.points,
        lines: info.render.lines,
        textures: info.memory.textures,
        geometries: info.memory.geometries,
        programs: info.programs?.length || 0,
      });
    }
  });

  return null;
}

/**
 * Component to handle zoom events from UI buttons
 */
function ZoomHandler({ controlsRef }: { controlsRef: React.RefObject<OrbitControlsImpl | null> }) {
  const { camera } = useThree();

  useEffect(() => {
    const handleZoom = (e: Event) => {
      const customEvent = e as CustomEvent<{ direction: "in" | "out" }>;
      const direction = customEvent.detail.direction;

      if (!controlsRef.current) return;

      // Get current distance from target
      const currentPos = camera.position.clone();
      const target = controlsRef.current.target.clone();
      const currentDistance = currentPos.distanceTo(target);

      // Calculate new distance
      const factor = direction === "in" ? 0.8 : 1.25;
      const newDistance = Math.max(
        CAMERA_CONFIG.minDistance,
        Math.min(CAMERA_CONFIG.maxDistance, currentDistance * factor)
      );

      // Move camera along the same direction
      const directionVec = currentPos.sub(target).normalize();
      const newPos = target.clone().add(directionVec.multiplyScalar(newDistance));

      camera.position.copy(newPos);
      controlsRef.current.update();
    };

    window.addEventListener("globe-zoom", handleZoom);
    return () => window.removeEventListener("globe-zoom", handleZoom);
  }, [camera, controlsRef]);

  return null;
}

// Auto-cycle interval in seconds
const AUTO_CYCLE_INTERVAL = 4;

/**
 * Component to handle auto-cycling through visible markers during rotation
 */
function AutoCycleController({
  markers,
  globeRef,
  autoRotate,
  selectedMarkerId,
  hoveredMarkerId,
  tooltipCooldownUntil,
  onActiveMarkerChange,
}: {
  markers: CenotapheryMarker[];
  globeRef: React.RefObject<THREE.Group | null>;
  autoRotate: boolean;
  selectedMarkerId: string | null;
  hoveredMarkerId: string | null;
  tooltipCooldownUntil: number;
  onActiveMarkerChange: (marker: CenotapheryMarker | null) => void;
}) {
  const lastCycleTime = useRef(0);
  const currentActiveIndex = useRef(0);
  const { camera } = useThree();

  useFrame((state) => {
    if (!globeRef.current) return;

    // Don't show tooltip if user has selected or is hovering a marker
    if (selectedMarkerId || hoveredMarkerId) {
      lastCycleTime.current = state.clock.elapsedTime;
      return;
    }

    // Don't show tooltip during cooldown period (after tooltip was closed)
    if (Date.now() < tooltipCooldownUntil) {
      return;
    }

    // Get visible markers (front-facing hemisphere)
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

    const visibleMarkers = markers.filter((marker) => {
      // Calculate marker world position
      const phi = (90 - marker.coordinates.lat) * (Math.PI / 180);
      const theta = (marker.coordinates.lng + 180) * (Math.PI / 180);
      const radius = 103; // GLOBE_RADIUS + MARKER_HEIGHT

      const localPos = new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );

      // Transform to world space using globe rotation
      const worldPos = localPos.clone().applyEuler(globeRef.current!.rotation);

      // Check if facing camera (dot product with camera direction < 0 means visible)
      // Camera looks towards origin, so visible markers have worldPos pointing away from camera
      return worldPos.dot(cameraDirection) < 0;
    });

    // Show tooltip on visible markers
    if (visibleMarkers.length > 0) {
      // Only auto-cycle during auto-rotation, otherwise just show first visible marker
      if (autoRotate) {
        const elapsed = state.clock.elapsedTime - lastCycleTime.current;

        if (elapsed >= AUTO_CYCLE_INTERVAL) {
          currentActiveIndex.current = (currentActiveIndex.current + 1) % visibleMarkers.length;
          lastCycleTime.current = state.clock.elapsedTime;
          onActiveMarkerChange(visibleMarkers[currentActiveIndex.current]);
        } else if (lastCycleTime.current === 0) {
          // Initial activation
          lastCycleTime.current = state.clock.elapsedTime;
          onActiveMarkerChange(visibleMarkers[0]);
        }
      } else {
        // During manual rotation, show first visible marker (no cycling)
        onActiveMarkerChange(visibleMarkers[0]);
      }
    } else {
      // No visible markers - clear active marker to hide tooltip
      onActiveMarkerChange(null);
      currentActiveIndex.current = 0;
      lastCycleTime.current = 0;
    }
  });

  return null;
}

/**
 * Inner scene content (inside Canvas)
 */
function SceneContent({
  markers,
  selectedMarkerId,
  hoveredMarkerId,
  activeMarkerId,
  tooltipCooldownUntil,
  onMarkerSelect,
  onMarkerHover,
  onActiveMarkerChange,
  controlsRef,
  isMobile,
}: Omit<GlobeSceneProps, "onZoomIn" | "onZoomOut" | "onReset"> & { isMobile: boolean }) {
  const selectedMarker = markers.find((m) => m.id === selectedMarkerId) || null;
  const globeRef = useRef<THREE.Group>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isGlobeHovered, setIsGlobeHovered] = useState(false);

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[0, 0, CAMERA_CONFIG.initialDistance]}
        fov={CAMERA_CONFIG.fov}
        near={CAMERA_CONFIG.near}
        far={CAMERA_CONFIG.far}
      />

      {/* OrbitControls only for zoom - only enabled when hovering over globe */}
      <OrbitControls
        ref={controlsRef}
        enableRotate={CONTROLS_CONFIG.enableRotate}
        enableZoom={isGlobeHovered} // Only zoom when hovering over globe
        zoomSpeed={CONTROLS_CONFIG.zoomSpeed}
        enablePan={CONTROLS_CONFIG.enablePan}
        enableDamping={CONTROLS_CONFIG.enableDamping}
        dampingFactor={CONTROLS_CONFIG.dampingFactor}
        minDistance={CAMERA_CONFIG.minDistance}
        maxDistance={CAMERA_CONFIG.maxDistance}
      />

      <FlyToController
        selectedMarker={selectedMarker}
        globeRef={globeRef}
        setAutoRotate={setAutoRotate}
      />

      <ZoomHandler controlsRef={controlsRef} />

      {/* AutoCycleController - Re-enabled for issue #59 auto-tooltip feature */}
      <AutoCycleController
        markers={markers}
        globeRef={globeRef}
        autoRotate={autoRotate}
        selectedMarkerId={selectedMarkerId}
        hoveredMarkerId={hoveredMarkerId}
        tooltipCooldownUntil={tooltipCooldownUntil}
        onActiveMarkerChange={onActiveMarkerChange}
      />

      <Lighting />

      <Suspense fallback={<LoadingFallback />}>
        <RotatableGlobe
          globeRef={globeRef}
          autoRotate={autoRotate}
          setAutoRotate={setAutoRotate}
          isGlobeHovered={isGlobeHovered}
          setIsGlobeHovered={setIsGlobeHovered}
          hoveredMarkerId={hoveredMarkerId}
        >
          <Globe />
          <GlobeAtmosphere />
          <GlobeMarkers
            markers={markers}
            selectedMarkerId={selectedMarkerId}
            hoveredMarkerId={hoveredMarkerId}
            activeMarkerId={activeMarkerId}
            onMarkerSelect={onMarkerSelect}
            onMarkerHover={onMarkerHover}
          />
        </RotatableGlobe>
      </Suspense>

      {/* Post-processing effects - DISABLED for performance (#200) */}
      {/* TODO: Re-enable after WebGL optimization
      {!isMobile && (
        <EffectComposer>
          <Bloom intensity={0.5} luminanceThreshold={0.6} luminanceSmoothing={0.9} />
        </EffectComposer>
      )}
      */}

      {/* DEBUG: Performance monitoring (#200) - only in development */}
      {process.env.NODE_ENV === "development" && (
        <>
          <Stats showPanel={0} className="stats" />
          <PerformanceLogger />
        </>
      )}
    </>
  );
}

/**
 * Main Globe Scene component with Canvas wrapper
 */
export function GlobeScene({
  markers,
  selectedMarkerId,
  hoveredMarkerId,
  activeMarkerId,
  tooltipCooldownUntil,
  onMarkerSelect,
  onMarkerHover,
  onActiveMarkerChange,
  controlsRef,
}: GlobeSceneProps) {
  // Mobile detection for performance optimization
  const isMobile = useIsMobile();

  return (
    <div className="w-full h-full">
      <Canvas
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: isMobile ? "low-power" : "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <SceneContent
          markers={markers}
          selectedMarkerId={selectedMarkerId}
          hoveredMarkerId={hoveredMarkerId}
          activeMarkerId={activeMarkerId}
          tooltipCooldownUntil={tooltipCooldownUntil}
          onMarkerSelect={onMarkerSelect}
          onMarkerHover={onMarkerHover}
          onActiveMarkerChange={onActiveMarkerChange}
          controlsRef={controlsRef}
          isMobile={isMobile}
        />
      </Canvas>
    </div>
  );
}

export { CAMERA_CONFIG };
