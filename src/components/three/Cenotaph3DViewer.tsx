"use client";

import { Suspense, useMemo, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, useProgress, Html } from "@react-three/drei";
import * as THREE from "three";
import { useIsMobile } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Loader2, X, Maximize2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CenotaphRenderSettings } from "@/components/organization/types";

/** Default render settings for cenotaph models */
const DEFAULT_RENDER_SETTINGS: Required<CenotaphRenderSettings> = {
  material: {
    metalness: 0.9,
    roughness: 0.25,
    envMapIntensity: 1.5,
  },
  environment: "sunset",
  lighting: {
    keyLight: { intensity: 2.5, color: "#ff9050" },
    fillLight: { intensity: 1.0, color: "#ffffff" },
    rimLight: { intensity: 1.2, color: "#ffaa70" },
  },
  exposure: 1.5,
};

interface Cenotaph3DViewerProps {
  /** URL to the 3D GLB model */
  modelUrl: string;
  /** Render settings for materials, lighting, environment */
  renderSettings?: CenotaphRenderSettings | null;
  /** Whether the viewer is in fullscreen modal mode */
  isFullscreen?: boolean;
  /** Callback when fullscreen is requested */
  onFullscreenRequest?: () => void;
  /** Callback when close is requested (in fullscreen mode) */
  onClose?: () => void;
  /** Optional className for the container */
  className?: string;
}

/**
 * Loading spinner shown while 3D model loads
 */
function LoadingIndicator() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 text-marble-300">
        <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
        <span className="text-sm font-medium">{Math.round(progress)}%</span>
      </div>
    </Html>
  );
}

/**
 * Placeholder shown while model is loading (outside Canvas)
 */
function LoadingPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
      <div className="flex flex-col items-center gap-3 text-marble-300">
        <Loader2 className="w-10 h-10 animate-spin text-gold-400" />
        <span className="text-sm font-medium">Loading 3D model...</span>
      </div>
    </div>
  );
}

/**
 * WebGL not supported fallback
 */
function WebGLFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-900 p-6">
      <div className="text-center">
        <p className="text-marble-300 mb-2">3D viewing not available</p>
        <p className="text-sm text-slate-500">Your browser or device doesn&apos;t support WebGL</p>
      </div>
    </div>
  );
}

interface CenotaphModelProps {
  modelUrl: string;
  materialSettings: NonNullable<CenotaphRenderSettings["material"]>;
}

/**
 * The actual 3D model component
 */
function CenotaphModel({ modelUrl, materialSettings }: CenotaphModelProps) {
  const { scene } = useGLTF(modelUrl);

  // Apply transformations with configurable materials
  const preparedScene = useMemo(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Apply material settings from render config
        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material.metalness = materialSettings.metalness ?? 0.9;
          child.material.roughness = materialSettings.roughness ?? 0.25;
          child.material.envMapIntensity = materialSettings.envMapIntensity ?? 1.5;
          child.material.needsUpdate = true;
        }
      }
    });

    // Center and scale the model
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim;

    scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    scene.scale.setScalar(scale);

    return scene;
  }, [scene, materialSettings]);

  return <primitive object={preparedScene} />;
}

/**
 * Reusable 3D Cenotaph Viewer Component
 *
 * Features:
 * - Interactive OrbitControls (rotate, zoom, pan)
 * - Touch-friendly controls for mobile
 * - Loading state with progress indicator
 * - Fullscreen modal mode support
 * - WebGL fallback for unsupported browsers
 * - Optimized rendering settings
 */
export function Cenotaph3DViewer({
  modelUrl,
  renderSettings,
  isFullscreen = false,
  onFullscreenRequest,
  onClose,
  className,
}: Cenotaph3DViewerProps) {
  const isMobile = useIsMobile();
  const [hasWebGL, setHasWebGL] = useState(true);
  const [controlsRef, setControlsRef] = useState<{ reset: () => void } | null>(null);

  // Merge with defaults
  const settings = useMemo(
    () => ({
      material: { ...DEFAULT_RENDER_SETTINGS.material, ...renderSettings?.material },
      environment: renderSettings?.environment ?? DEFAULT_RENDER_SETTINGS.environment,
      lighting: {
        keyLight: {
          ...DEFAULT_RENDER_SETTINGS.lighting.keyLight,
          ...renderSettings?.lighting?.keyLight,
        },
        fillLight: {
          ...DEFAULT_RENDER_SETTINGS.lighting.fillLight,
          ...renderSettings?.lighting?.fillLight,
        },
        rimLight: {
          ...DEFAULT_RENDER_SETTINGS.lighting.rimLight,
          ...renderSettings?.lighting?.rimLight,
        },
      },
      exposure: renderSettings?.exposure ?? DEFAULT_RENDER_SETTINGS.exposure,
    }),
    [renderSettings]
  );

  // Check WebGL support on mount
  const checkWebGL = useCallback(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      return !!gl;
    } catch {
      return false;
    }
  }, []);

  // Reset camera to initial position
  const handleReset = useCallback(() => {
    if (controlsRef) {
      controlsRef.reset();
    }
  }, [controlsRef]);

  // Check WebGL on first render
  useMemo(() => {
    if (typeof window !== "undefined") {
      setHasWebGL(checkWebGL());
    }
  }, [checkWebGL]);

  if (!hasWebGL) {
    return (
      <div className={cn("relative w-full h-full min-h-[300px]", className)}>
        <WebGLFallback />
      </div>
    );
  }

  return (
    <div className={cn("relative w-full h-full min-h-[300px]", className)}>
      {/* Control buttons */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {/* Reset view button */}
        <Button
          variant="dark-ghost"
          size="icon"
          onClick={handleReset}
          className="bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700/80"
          title="Reset view"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        {/* Fullscreen button (only in non-fullscreen mode) */}
        {!isFullscreen && onFullscreenRequest && (
          <Button
            variant="dark-ghost"
            size="icon"
            onClick={onFullscreenRequest}
            className="bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700/80"
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        )}

        {/* Close button (only in fullscreen mode) */}
        {isFullscreen && onClose && (
          <Button
            variant="dark-ghost"
            size="icon"
            onClick={onClose}
            className="bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700/80"
            title="Close"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Instructions overlay */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-800/80 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-slate-400">
        {isMobile ? (
          <p>Drag to rotate &bull; Pinch to zoom</p>
        ) : (
          <p>Drag to rotate &bull; Scroll to zoom &bull; Right-click to pan</p>
        )}
      </div>

      {/* 3D Canvas */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <Canvas
          camera={{
            position: [3, 2, 3],
            fov: 50,
            near: 0.1,
            far: 100,
          }}
          gl={{
            antialias: !isMobile,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: settings.exposure,
          }}
          shadows={!isMobile}
          style={{ touchAction: "none" }}
        >
          <color attach="background" args={["#1a1410"]} />

          {/* Lighting setup for metallic PBR materials */}
          <ambientLight intensity={0.4} color="#ffffff" />

          {/* Key light - configurable */}
          <directionalLight
            position={[0, 5, -3]}
            intensity={settings.lighting.keyLight.intensity ?? 2.5}
            color={settings.lighting.keyLight.color ?? "#ff9050"}
            castShadow={!isMobile}
            shadow-mapSize-width={isMobile ? 512 : 2048}
            shadow-mapSize-height={isMobile ? 512 : 2048}
            shadow-camera-far={20}
            shadow-camera-left={-5}
            shadow-camera-right={5}
            shadow-camera-top={5}
            shadow-camera-bottom={-5}
          />

          {/* Fill light - configurable */}
          <directionalLight
            position={[-3, 2, 4]}
            intensity={settings.lighting.fillLight.intensity ?? 1.0}
            color={settings.lighting.fillLight.color ?? "#ffffff"}
          />

          {/* Rim light - configurable */}
          <directionalLight
            position={[4, 3, 0]}
            intensity={settings.lighting.rimLight.intensity ?? 1.2}
            color={settings.lighting.rimLight.color ?? "#ffaa70"}
          />

          {/* Environment map for realistic reflections */}
          <Environment preset={settings.environment} />

          {/* OrbitControls with touch support */}
          <OrbitControls
            ref={(ref) => setControlsRef(ref)}
            enableDamping
            dampingFactor={0.05}
            minDistance={1}
            maxDistance={10}
            enableZoom={true}
            enablePan={!isMobile}
            enableRotate={true}
            touches={{
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_PAN,
            }}
          />

          {/* Model */}
          <Suspense fallback={<LoadingIndicator />}>
            <CenotaphModel modelUrl={modelUrl} materialSettings={settings.material} />
          </Suspense>

          {/* Ground plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow={!isMobile}>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="#2a2218" roughness={0.8} />
          </mesh>
        </Canvas>
      </Suspense>
    </div>
  );
}

/**
 * Fullscreen modal wrapper for the 3D viewer
 */
export function Cenotaph3DViewerModal({
  modelUrl,
  renderSettings,
  isOpen,
  onClose,
}: {
  modelUrl: string;
  renderSettings?: CenotaphRenderSettings | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95"
      onClick={(e) => {
        // Close on backdrop click
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <Cenotaph3DViewer
        modelUrl={modelUrl}
        renderSettings={renderSettings}
        isFullscreen
        onClose={onClose}
        className="w-full h-full"
      />
    </div>
  );
}
