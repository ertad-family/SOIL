"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stats, Environment } from "@react-three/drei";
import { Suspense, useState, useMemo } from "react";
import * as THREE from "three";

const MODELS = {
  original: {
    path: "/cenotaphs/accounting-cenotaph.glb",
    label: "ORIGINAL",
    size: "27 MB",
    vertices: "~500K",
    triangles: "~965K",
  },
  high: {
    path: "/cenotaphs/accounting-cenotaph-high.glb",
    label: "HIGH",
    size: "1.7 MB",
    vertices: "~111K",
    triangles: "~193K",
  },
  medium: {
    path: "/cenotaphs/accounting-cenotaph-medium.glb",
    label: "MEDIUM",
    size: "1.2 MB",
    vertices: "~60K",
    triangles: "~96K",
  },
  low: {
    path: "/cenotaphs/accounting-cenotaph-low.glb",
    label: "LOW",
    size: "807 KB",
    vertices: "~26K",
    triangles: "~39K",
  },
} as const;

type ModelKey = keyof typeof MODELS;

// Preload all models
Object.values(MODELS).forEach((model) => {
  useGLTF.preload(model.path);
});

function CenotaphModel({ modelPath }: { modelPath: string }) {
  const { scene } = useGLTF(modelPath);

  // Apply transformations and material modifications
  const preparedScene = useMemo(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;

        if (child.material instanceof THREE.MeshStandardMaterial) {
          const oldMat = child.material;
          // Keep original textures, just adjust material properties
          const newMat = new THREE.MeshStandardMaterial({
            map: oldMat.map,
            normalMap: oldMat.normalMap,
            // No roughnessMap, no metalnessMap - fixed values only
            metalness: 0.0,
            roughness: 0.9,
            envMapIntensity: 0.15,
          });
          child.material = newMat;
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
  }, [scene]);

  return <primitive object={preparedScene} />;
}

function LoadingSpinner() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#666" wireframe />
    </mesh>
  );
}

export default function CenotaphPreviewPage() {
  const [selectedModel, setSelectedModel] = useState<ModelKey>("high");
  const [showStats, setShowStats] = useState(true);
  const [showWireframe, setShowWireframe] = useState(false);

  const currentModel = MODELS[selectedModel];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header controls */}
      <div className="fixed top-20 left-4 z-10 bg-slate-800/90 backdrop-blur-sm rounded-lg p-4 space-y-4">
        <h2 className="text-lg font-semibold text-gold-400">Cenotaph Preview</h2>

        {/* Model selector */}
        <div className="space-y-2">
          <label className="text-sm text-slate-400">Model Quality:</label>
          <div className="flex flex-col gap-2">
            {(Object.keys(MODELS) as ModelKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedModel(key)}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  selectedModel === key
                    ? "bg-gold-500 text-slate-900"
                    : "bg-slate-700 hover:bg-slate-600"
                }`}
              >
                {MODELS[key].label}
              </button>
            ))}
          </div>
        </div>

        {/* Model stats */}
        <div className="border-t border-slate-700 pt-3 space-y-1 text-sm">
          <p>
            <span className="text-slate-400">Size:</span>{" "}
            <span className="text-green-400">{currentModel.size}</span>
          </p>
          <p>
            <span className="text-slate-400">Vertices:</span> {currentModel.vertices}
          </p>
          <p>
            <span className="text-slate-400">Triangles:</span> {currentModel.triangles}
          </p>
        </div>

        {/* Toggle options */}
        <div className="border-t border-slate-700 pt-3 space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showStats}
              onChange={(e) => setShowStats(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Show FPS Stats</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showWireframe}
              onChange={(e) => setShowWireframe(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Wireframe Mode</span>
          </label>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="w-full h-screen">
        <Canvas
          camera={{
            position: [3, 2, 3],
            fov: 50,
            near: 0.1,
            far: 100,
          }}
          gl={{
            antialias: false,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
          }}
          shadows
        >
          <color attach="background" args={["#1a1410"]} />

          {/* Neutral studio lighting */}
          <ambientLight intensity={0.4} color="#ffffff" />

          {/* Key light - neutral white from upper right */}
          <directionalLight
            position={[4, 6, 3]}
            intensity={2.0}
            color="#ffffff"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={20}
            shadow-camera-left={-5}
            shadow-camera-right={5}
            shadow-camera-top={5}
            shadow-camera-bottom={-5}
          />

          {/* Fill light - softer from left */}
          <directionalLight position={[-4, 3, 2]} intensity={0.8} color="#ffffff" />

          {/* Rim light - from behind */}
          <directionalLight position={[0, 2, -4]} intensity={1.0} color="#ffffff" />

          {/* Environment for subtle ambient lighting - night is darker/softer */}
          <Environment preset="night" />

          {/* Controls */}
          <OrbitControls enableDamping dampingFactor={0.05} minDistance={1} maxDistance={10} />

          {/* Model */}
          <Suspense fallback={<LoadingSpinner />}>
            <group>
              {showWireframe ? (
                <WireframeModel modelPath={currentModel.path} />
              ) : (
                <CenotaphModel modelPath={currentModel.path} />
              )}
            </group>
          </Suspense>

          {/* Ground plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="#2a2218" roughness={0.8} />
          </mesh>

          {/* Stats */}
          {showStats && <Stats />}
        </Canvas>
      </div>

      {/* Instructions */}
      <div className="fixed bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg px-4 py-2 text-sm text-slate-400">
        <p>Drag to rotate • Scroll to zoom • Right-click to pan</p>
      </div>

      {/* Comparison info */}
      <div className="fixed bottom-4 right-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-4">
        <h3 className="font-medium mb-2">Original vs Optimized</h3>
        <table className="text-sm">
          <tbody>
            <tr className="text-slate-400">
              <td className="pr-4">Original:</td>
              <td>27 MB, 500K vertices</td>
            </tr>
            <tr className="text-green-400">
              <td className="pr-4">Current:</td>
              <td>
                {currentModel.size}, {currentModel.vertices} vertices
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Wireframe version of the model
function WireframeModel({ modelPath }: { modelPath: string }) {
  const { scene } = useGLTF(modelPath);

  const preparedScene = useMemo(() => {
    const cloned = scene.clone();

    // Apply wireframe material to all meshes
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshBasicMaterial({
          color: "#4ade80",
          wireframe: true,
        });
      }
    });

    // Center and scale
    const box = new THREE.Box3().setFromObject(cloned);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim;

    cloned.position.sub(center);
    cloned.scale.setScalar(scale);

    return cloned;
  }, [scene]);

  return <primitive object={preparedScene} />;
}
