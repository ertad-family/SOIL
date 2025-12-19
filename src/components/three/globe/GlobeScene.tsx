"use client";

import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { Globe, GLOBE_RADIUS } from "./Globe";
import { GlobeAtmosphere } from "./GlobeAtmosphere";
import { GlobeMarkers } from "./GlobeMarkers";
import type { CenotapheryMarker } from "@/types/cenotaphery";
import { latLngToVector3 } from "@/types/cenotaphery";

// Camera configuration from spec
const CAMERA_CONFIG = {
  fov: 45,
  near: 1,
  far: 1000,
  initialDistance: 300,
  minDistance: 120,
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
  onMarkerSelect: (marker: CenotapheryMarker | null) => void;
  onMarkerHover: (marker: CenotapheryMarker | null) => void;
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
 */
function RotatableGlobe({
  children,
  globeRef,
  autoRotate,
  setAutoRotate,
}: {
  children: React.ReactNode;
  globeRef: React.RefObject<THREE.Group | null>;
  autoRotate: boolean;
  setAutoRotate: (value: boolean) => void;
}) {
  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const { gl } = useThree();

  // Handle pointer events for drag rotation
  useEffect(() => {
    const canvas = gl.domElement;

    const onPointerDown = (e: PointerEvent) => {
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
      isDragging.current = false;
      canvas.style.cursor = "grab";
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerUp);
    canvas.style.cursor = "grab";

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerUp);
    };
  }, [gl, globeRef, setAutoRotate]);

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
      } else if (autoRotate) {
        // Auto-rotate when not dragging and no inertia
        globeRef.current.rotation.y += AUTO_ROTATE_SPEED * delta;
      }
    }
  });

  return <group ref={globeRef}>{children}</group>;
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

    // Target rotation: negate to bring marker to front
    const targetY = -lng;
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

/**
 * Inner scene content (inside Canvas)
 */
function SceneContent({
  markers,
  selectedMarkerId,
  hoveredMarkerId,
  onMarkerSelect,
  onMarkerHover,
  controlsRef,
}: Omit<GlobeSceneProps, "onZoomIn" | "onZoomOut" | "onReset">) {
  const selectedMarker = markers.find((m) => m.id === selectedMarkerId) || null;
  const globeRef = useRef<THREE.Group>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[0, 0, CAMERA_CONFIG.initialDistance]}
        fov={CAMERA_CONFIG.fov}
        near={CAMERA_CONFIG.near}
        far={CAMERA_CONFIG.far}
      />

      {/* OrbitControls only for zoom now */}
      <OrbitControls
        ref={controlsRef}
        enableRotate={CONTROLS_CONFIG.enableRotate}
        enableZoom={CONTROLS_CONFIG.enableZoom}
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

      <Lighting />

      <Suspense fallback={<LoadingFallback />}>
        <RotatableGlobe globeRef={globeRef} autoRotate={autoRotate} setAutoRotate={setAutoRotate}>
          <Globe />
          <GlobeAtmosphere />
          <GlobeMarkers
            markers={markers}
            selectedMarkerId={selectedMarkerId}
            hoveredMarkerId={hoveredMarkerId}
            onMarkerSelect={onMarkerSelect}
            onMarkerHover={onMarkerHover}
          />
        </RotatableGlobe>
      </Suspense>

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom intensity={0.5} luminanceThreshold={0.6} luminanceSmoothing={0.9} />
      </EffectComposer>
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
  onMarkerSelect,
  onMarkerHover,
  controlsRef,
}: GlobeSceneProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <SceneContent
          markers={markers}
          selectedMarkerId={selectedMarkerId}
          hoveredMarkerId={hoveredMarkerId}
          onMarkerSelect={onMarkerSelect}
          onMarkerHover={onMarkerHover}
          controlsRef={controlsRef}
        />
      </Canvas>
    </div>
  );
}

export { CAMERA_CONFIG };
