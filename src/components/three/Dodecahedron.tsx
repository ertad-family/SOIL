"use client";

import { useRef, useMemo, useState, useCallback } from "react";
import { useFrame, ThreeEvent, useThree } from "@react-three/fiber";
import {
  useTexture,
  Text3D,
  Center,
  MeshTransmissionMaterial,
  Cloud,
  Clouds,
} from "@react-three/drei";
import * as THREE from "three";
import { Brush, Evaluator, SUBTRACTION } from "three-bvh-csg";

// Portal configuration for each face with varying hole sizes
export const FACE_CONFIG = [
  { id: 0, name: "Main", section: "home", active: true, holeRadius: 1.3 },
  { id: 1, name: "Research", section: "research", active: true, holeRadius: 1.1 },
  { id: 2, name: "Memorials", section: "memorials", active: true, holeRadius: 1.4 },
  { id: 3, name: "Diagnostics", section: "diagnostics", active: true, holeRadius: 1.0 },
  { id: 4, name: "Education", section: "education", active: true, holeRadius: 1.2 },
  { id: 5, name: "Clinic", section: "clinic", active: true, holeRadius: 1.3 },
  { id: 6, name: "Community", section: "community", active: true, holeRadius: 1.1 },
  { id: 7, name: "Future 1", section: null, active: false, holeRadius: 1.4 },
  { id: 8, name: "Future 2", section: null, active: false, holeRadius: 1.0 },
  { id: 9, name: "Future 3", section: null, active: false, holeRadius: 1.2 },
  { id: 10, name: "Future 4", section: null, active: false, holeRadius: 1.3 },
  { id: 11, name: "Future 5", section: null, active: false, holeRadius: 1.1 },
];

// Vertex sphere configuration
export const SPHERE_CONFIG = [
  { id: 0, name: "Profile", active: true },
  { id: 1, name: "Settings", active: true },
  { id: 2, name: "Search", active: true },
  { id: 3, name: "Notifications", active: true },
  { id: 4, name: "Help", active: true },
  { id: 5, name: "Language", active: true },
  // Reserved (6-19)
  ...Array.from({ length: 14 }, (_, i) => ({
    id: i + 6,
    name: `Reserved ${i + 1}`,
    active: false,
  })),
];

export const RADIUS = 4;
const WALL_THICKNESS = 0.15; // Thin walls like original artifact

// For a regular dodecahedron, the inscribed circle radius of each pentagonal face
// is approximately: r_inscribed = R * 0.795 * tan(54°) where R is circumradius
// For RADIUS=4: 4 * 0.795 * 1.376 ≈ 4.37, but face is at ~3.18 from center
// The inscribed circle of pentagon on that face ≈ 1.85
const PENTAGON_INSCRIBED_RADIUS = 1.85;

// Ring groove parameters
const GROOVE_WIDTH = 0.02;
const RING_WIDTH = 0.015;
const GROOVE_OFFSET = 0.04;
const INNER_RING_OFFSET = 0.1; // how far inner ring is from hole edge
const MIN_GAP_BETWEEN_RINGS = 0.1; // minimum space between ring systems

// Extract unique vertices from Three.js DodecahedronGeometry
function getDodecahedronVertices(radius: number): THREE.Vector3[] {
  const geometry = new THREE.DodecahedronGeometry(radius, 0);
  const positionAttr = geometry.getAttribute("position");

  const uniqueVertices: THREE.Vector3[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < positionAttr.count; i++) {
    const x = positionAttr.getX(i);
    const y = positionAttr.getY(i);
    const z = positionAttr.getZ(i);

    const key = `${x.toFixed(4)},${y.toFixed(4)},${z.toFixed(4)}`;

    if (!seen.has(key)) {
      seen.add(key);
      uniqueVertices.push(new THREE.Vector3(x, y, z));
    }
  }

  geometry.dispose();
  return uniqueVertices;
}

// Face data returned from getDodecahedronFaceCenters
interface FaceData {
  center: THREE.Vector3;
  normal: THREE.Vector3;
  vertices: THREE.Vector3[]; // 5 vertices sorted by angle around center
}

// Get face centers of dodecahedron (12 pentagonal faces)
// DodecahedronGeometry with detail=0 has 36 triangles = 12 faces × 3 triangles per face
// Triangles are stored sequentially per face, so we take every 3 triangles as one face
// Returns vertices sorted by angle around center for proper polygon rendering
export function getDodecahedronFaceCenters(radius: number): FaceData[] {
  const geometry = new THREE.DodecahedronGeometry(radius, 0);
  const positionAttr = geometry.getAttribute("position");

  const faces: FaceData[] = [];
  const TRIANGLES_PER_FACE = 3;
  const VERTICES_PER_TRIANGLE = 3;

  // Process triangles in groups of 3 (one pentagonal face = 3 triangles)
  for (let faceIdx = 0; faceIdx < 12; faceIdx++) {
    const baseIdx = faceIdx * TRIANGLES_PER_FACE * VERTICES_PER_TRIANGLE;

    // Collect unique vertices for this face
    const faceVertices: THREE.Vector3[] = [];
    const seenKeys = new Set<string>();

    for (let i = 0; i < TRIANGLES_PER_FACE * VERTICES_PER_TRIANGLE; i++) {
      const x = positionAttr.getX(baseIdx + i);
      const y = positionAttr.getY(baseIdx + i);
      const z = positionAttr.getZ(baseIdx + i);
      const key = `${x.toFixed(4)},${y.toFixed(4)},${z.toFixed(4)}`;

      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        faceVertices.push(new THREE.Vector3(x, y, z));
      }
    }

    // Get first triangle vertices to compute proper normal
    const v0 = faceVertices[0];
    const v1 = faceVertices[1];
    const v2 = faceVertices[2];

    // Compute proper normal from triangle edges (cross product)
    const edge1 = new THREE.Vector3().subVectors(v1, v0);
    const edge2 = new THREE.Vector3().subVectors(v2, v0);
    const normal = new THREE.Vector3().crossVectors(edge1, edge2).normalize();

    // Ensure normal points outward (away from origin)
    const centerDir = new THREE.Vector3().addVectors(v0, v1).add(v2).normalize();
    if (normal.dot(centerDir) < 0) {
      normal.negate();
    }

    // Compute face center as average of unique vertices
    const center = new THREE.Vector3();
    for (const v of faceVertices) {
      center.add(v);
    }
    center.divideScalar(faceVertices.length);

    // Sort vertices by angle around center (for proper polygon winding)
    // Project vertices onto the face plane and compute angles
    const alignQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    const inverseQuat = alignQuat.clone().invert();

    const sortedVertices = faceVertices
      .map((v) => {
        const local = v.clone().sub(center).applyQuaternion(inverseQuat);
        const angle = Math.atan2(local.y, local.x);
        return { vertex: v, angle };
      })
      .sort((a, b) => a.angle - b.angle)
      .map((item) => item.vertex);

    faces.push({ center, normal, vertices: sortedVertices });
  }

  geometry.dispose();

  // Sort faces for consistent ordering with FACE_CONFIG
  faces.sort((a, b) => {
    if (Math.abs(a.normal.y - b.normal.y) > 0.01) return b.normal.y - a.normal.y;
    if (Math.abs(a.normal.x - b.normal.x) > 0.01) return a.normal.x - b.normal.x;
    return a.normal.z - b.normal.z;
  });

  return faces;
}

// Get portal data (center and normal) by section name
// Used for fly-out animation to find the exit portal
export function getPortalDataBySection(
  section: string
): { center: THREE.Vector3; normal: THREE.Vector3; faceId: number } | null {
  const faceConfig = FACE_CONFIG.find((f) => f.section === section);
  if (!faceConfig) return null;

  const faces = getDodecahedronFaceCenters(RADIUS);
  const face = faces[faceConfig.id];
  if (!face) return null;

  return {
    center: face.center.clone(),
    normal: face.normal.clone(),
    faceId: faceConfig.id,
  };
}

// Face data with hole radius and config attached
interface FaceWithHole {
  center: THREE.Vector3;
  normal: THREE.Vector3;
  vertices: THREE.Vector3[]; // 5 vertices of the pentagon face
  holeRadius: number;
  config?: (typeof FACE_CONFIG)[number];
}

// Forward declaration for PortalClickData (defined later, used here)
interface PortalClickDataInternal {
  faceId: number;
  section: string | null;
  worldCenter: THREE.Vector3;
  worldNormal: THREE.Vector3;
}

// Props for Portal component
interface PortalProps {
  face: FaceWithHole;
  textures: {
    map: THREE.Texture;
    normalMap: THREE.Texture;
  };
  onPortalClick?: (data: PortalClickDataInternal) => void;
}

// Animation state stored per-face (persists across hover states)
interface LabelAnimState {
  currentAngle: number;
  velocity: number;
  initialized: boolean;
  lastSettledAngle: number | null; // Store angle when label settled/hidden
}

// Animated label that swings to upright position like a pendulum
interface PendulumLabelProps {
  name: string;
  animState: React.MutableRefObject<LabelAnimState>;
  opacity: number; // For fade animation
}

function PendulumLabel({ name, animState, opacity }: PendulumLabelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const { camera } = useThree();

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const labelState = animState.current;

    // Get the WORLD normal of this face
    // The label's parent (Portal group) has local Z pointing along face normal
    // We need to transform local Z to world space using the full world matrix
    const parent = groupRef.current.parent;
    if (!parent) return;

    // Force update world matrix to get current rotation
    parent.updateWorldMatrix(true, false);

    // Get world direction of local Z axis (face normal in world space)
    const worldNormal = new THREE.Vector3(0, 0, 1);
    worldNormal.transformDirection(parent.matrixWorld);

    // Calculate target angle to make text upright relative to world "up"
    const worldUp = new THREE.Vector3(0, 1, 0);

    // Project world up onto the face plane (in world space)
    let targetUpWorld = worldUp
      .clone()
      .sub(worldNormal.clone().multiplyScalar(worldUp.dot(worldNormal)));

    const isHorizontalFace = targetUpWorld.length() < 0.1;

    // If projection is too small (face is nearly horizontal), use camera direction
    if (isHorizontalFace) {
      const cameraDir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      const right = new THREE.Vector3().crossVectors(cameraDir, worldNormal).normalize();
      targetUpWorld = new THREE.Vector3().crossVectors(worldNormal, right);
    }

    targetUpWorld.normalize();

    // Get current "up" direction of the label in world space
    // The label's local Y axis transformed to world
    const currentUpWorld = new THREE.Vector3(0, 1, 0);
    currentUpWorld.transformDirection(parent.matrixWorld);

    // Get current "right" direction for signed angle calculation
    const currentRightWorld = new THREE.Vector3(1, 0, 0);
    currentRightWorld.transformDirection(parent.matrixWorld);

    // Calculate signed angle between currentUpWorld and targetUpWorld around worldNormal
    // Project both onto the face plane (they should already be, but ensure it)
    const dot = currentUpWorld.dot(targetUpWorld);
    const cross = new THREE.Vector3().crossVectors(currentUpWorld, targetUpWorld);
    const sign = cross.dot(worldNormal) < 0 ? -1 : 1;

    // Angle needed to rotate from current to target
    const targetAngle = sign * Math.acos(Math.min(1, Math.max(-1, dot)));

    // Initialize on first frame of hover
    if (!labelState.initialized) {
      if (labelState.lastSettledAngle !== null) {
        // Re-hover: start from saved position
        labelState.currentAngle = labelState.lastSettledAngle;
      } else {
        // First hover ever: start with swing animation
        labelState.currentAngle = targetAngle + Math.PI * 0.3;
      }
      labelState.initialized = true;
    }

    // Calculate shortest angle difference (handle wrap-around at ±π)
    let angleDiff = targetAngle - labelState.currentAngle;
    // Normalize to [-π, π] for shortest path
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

    // Physics: damped harmonic oscillator - ALWAYS runs to track "floor"
    const stiffness = 12; // Spring stiffness (slightly softer)
    const damping = 5; // Damping factor (more damping to prevent jitter)

    const springForce = angleDiff * stiffness;
    const dampingForce = -labelState.velocity * damping;

    labelState.velocity += (springForce + dampingForce) * delta;
    labelState.currentAngle += labelState.velocity * delta;

    // Normalize currentAngle to [-π, π] to prevent drift
    while (labelState.currentAngle > Math.PI) labelState.currentAngle -= Math.PI * 2;
    while (labelState.currentAngle < -Math.PI) labelState.currentAngle += Math.PI * 2;

    // Always save current angle for next hover
    labelState.lastSettledAngle = labelState.currentAngle;

    // Apply rotation around Z axis (face normal direction)
    groupRef.current.rotation.z = labelState.currentAngle;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0.25]} castShadow>
      <Center>
        <Text3D
          font="/fonts/Cinzel/Cinzel SemiBold_Regular.json"
          size={0.3}
          height={0.03}
          letterSpacing={0.05}
          bevelEnabled
          bevelSize={0.005}
          bevelThickness={0.005}
          castShadow
        >
          {name}
          <meshStandardMaterial
            ref={materialRef}
            color="#C9943D"
            metalness={0.8}
            roughness={0.3}
            transparent
            opacity={opacity}
          />
        </Text3D>
      </Center>
    </group>
  );
}

// Props for SketchFace component
interface SketchFaceProps {
  vertices: THREE.Vector3[]; // 5 real vertices from dodecahedron face
  center: THREE.Vector3;
  normal: THREE.Vector3;
  initialTextureIndex: number; // Starting texture index (for variety between faces)
}

// Available cyberpunk SVG textures
const CYBERPUNK_TEXTURES = [
  "/assets/cyberpunk1.svg",
  "/assets/cyberpunk2.svg",
  "/assets/cyberpunk3.svg",
  "/assets/cyberpunk4.svg",
  "/assets/cyberpunk5.svg",
  "/assets/cyberpunk6.svg",
  "/assets/cyberpunk7.svg",
  "/assets/cyberpunk8.svg",
  "/assets/cyberpunk9.svg",
  "/assets/cyberpunk10.svg",
  "/assets/cyberpunk11.svg",
  "/assets/cyberpunk12.svg",
];

// Create BufferGeometry from real pentagon vertices
function createPentagonFromVertices(
  vertices: THREE.Vector3[],
  center: THREE.Vector3,
  normal: THREE.Vector3
): THREE.BufferGeometry {
  // Offset vertices slightly along normal to prevent z-fighting
  const offset = normal.clone().multiplyScalar(0.02);

  // Create triangles from center to edges (fan triangulation)
  const positions: number[] = [];
  const centerOffset = center.clone().add(offset);

  for (let i = 0; i < 5; i++) {
    const v1 = vertices[i].clone().add(offset);
    const v2 = vertices[(i + 1) % 5].clone().add(offset);

    // Triangle: center, v1, v2
    positions.push(centerOffset.x, centerOffset.y, centerOffset.z);
    positions.push(v1.x, v1.y, v1.z);
    positions.push(v2.x, v2.y, v2.z);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();

  return geometry;
}

// Cyberpunk sketch for inactive portals using SVG texture
// Randomly switches textures every 1-3 seconds with glitch effect
function SketchFace({ vertices, center, normal, initialTextureIndex }: SketchFaceProps) {
  // Load ALL textures upfront so we can switch between them
  const allTextures = useTexture(CYBERPUNK_TEXTURES);

  // State for current texture and glitch effect
  const [currentTextureIdx, setCurrentTextureIdx] = useState(
    initialTextureIndex % CYBERPUNK_TEXTURES.length
  );
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  // Animation state
  const animState = useRef({
    nextSwitchTime: Math.random() * 3 + 2, // First switch in 1-3 seconds
    elapsedTime: 0,
    isGlitching: false,
    glitchEndTime: 0,
    baseOpacity: 0.7,
  });

  // Create pentagon geometry from real vertices
  const pentagonGeometry = useMemo(
    () => createPentagonFromVertices(vertices, center, normal),
    [vertices, center, normal]
  );

  // Calculate rotation to align with face
  const quaternion = useMemo(() => {
    const up = new THREE.Vector3(0, 0, 1);
    return new THREE.Quaternion().setFromUnitVectors(up, normal);
  }, [normal]);

  // Position slightly above face to prevent z-fighting
  const position = useMemo(
    () => center.clone().add(normal.clone().multiplyScalar(0.02)),
    [center, normal]
  );

  // Animation loop for texture switching and glitch effect
  useFrame((_, delta) => {
    const state = animState.current;
    state.elapsedTime += delta;

    // Check if it's time to switch texture
    if (state.elapsedTime >= state.nextSwitchTime) {
      // Start glitch effect
      state.isGlitching = true;
      state.glitchEndTime = state.elapsedTime + 0.3; // Glitch for 0.3 seconds

      // Pick a new random texture (different from current)
      let newIdx = currentTextureIdx;
      while (newIdx === currentTextureIdx) {
        newIdx = Math.floor(Math.random() * CYBERPUNK_TEXTURES.length);
      }
      setCurrentTextureIdx(newIdx);

      // Schedule next switch (1-3 seconds from now)
      state.nextSwitchTime = state.elapsedTime + Math.random() * 2 + 1;
    }

    // Apply glitch effect to material
    if (materialRef.current) {
      if (state.isGlitching && state.elapsedTime < state.glitchEndTime) {
        // Intense glitching during transition
        const glitchIntensity = Math.random();
        if (glitchIntensity < 0.3) {
          materialRef.current.opacity = 0.1;
        } else if (glitchIntensity < 0.5) {
          materialRef.current.opacity = 0.9;
        } else {
          materialRef.current.opacity = 0.4 + Math.random() * 0.4;
        }
      } else {
        // Normal state with occasional subtle glitch
        state.isGlitching = false;
        const glitchChance = Math.random();
        if (glitchChance < 0.01) {
          materialRef.current.opacity = 0.3 + Math.random() * 0.3;
        } else if (glitchChance < 0.03) {
          materialRef.current.opacity = 0.5 + Math.random() * 0.3;
        } else {
          // Smooth return to base opacity
          materialRef.current.opacity += (state.baseOpacity - materialRef.current.opacity) * 0.1;
        }
      }
    }
  });

  const planeSize = 3.5;

  return (
    <group>
      {/* Black pentagon background */}
      <mesh geometry={pentagonGeometry}>
        <meshBasicMaterial color="#0a0a0f" side={THREE.DoubleSide} />
      </mesh>

      {/* SVG texture on a circular plane */}
      <mesh position={position} quaternion={quaternion}>
        <circleGeometry args={[planeSize / 2, 32]} />
        <meshBasicMaterial
          ref={materialRef}
          map={allTextures[currentTextureIdx]}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// Interactive Portal component with hover/click
function Portal({ face, textures, onPortalClick }: PortalProps) {
  const [hovered, setHovered] = useState(false);
  const [fadeOpacity, setFadeOpacity] = useState(0);
  const groupRef = useRef<THREE.Group>(null);

  // Persist animation state across hover on/off cycles
  const labelAnimState = useRef<LabelAnimState>({
    currentAngle: 0,
    velocity: 0,
    initialized: false,
    lastSettledAngle: null,
  });

  // Target opacity based on hover state
  const targetOpacity = hovered ? 1 : 0;

  // Animate fade in/out
  useFrame((_, delta) => {
    const speed = 5; // Fade speed (higher = faster)
    const diff = targetOpacity - fadeOpacity;

    if (Math.abs(diff) > 0.001) {
      const step = Math.sign(diff) * Math.min(Math.abs(diff), speed * delta);
      setFadeOpacity((prev) => Math.max(0, Math.min(1, prev + step)));
    } else if (fadeOpacity !== targetOpacity) {
      setFadeOpacity(targetOpacity);
    }
  });

  // Ring dimensions based on face data
  const outerRingRadius = PENTAGON_INSCRIBED_RADIUS;
  const innerRingRadius = face.holeRadius + INNER_RING_OFFSET;

  // Position rings slightly above face surface (along normal direction)
  const RING_OFFSET = 0.03;
  const ringPos = useMemo(
    () => face.center.clone().add(face.normal.clone().multiplyScalar(RING_OFFSET)),
    [face.center, face.normal]
  );

  // Create rotation to align with face
  const quaternion = useMemo(() => {
    const up = new THREE.Vector3(0, 0, 1);
    return new THREE.Quaternion().setFromUnitVectors(up, face.normal);
  }, [face.normal]);

  // Calculate if inner ring fits between hole edge and outer ring
  const innerRingOuterEdge = innerRingRadius + GROOVE_OFFSET;
  const outerRingInnerEdge = outerRingRadius - GROOVE_OFFSET;
  const gapBetweenRings = outerRingInnerEdge - innerRingOuterEdge;
  const showInnerRing = gapBetweenRings > MIN_GAP_BETWEEN_RINGS;

  // Hover handlers
  const handlePointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      if (face.config?.active) {
        // Reset initialized to trigger new swing animation, but keep current angle
        labelAnimState.current.initialized = false;
        labelAnimState.current.velocity = 0;
        setHovered(true);
        document.body.style.cursor = "pointer";
      }
    },
    [face.config?.active]
  );

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = "auto";
  }, []);

  // Double-click to navigate - prevents accidental clicks during rotation
  const handleDoubleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();

      if (face.config?.active && onPortalClick && groupRef.current) {
        // Get world position and normal from the portal group
        const worldCenter = new THREE.Vector3();
        groupRef.current.getWorldPosition(worldCenter);

        // Get world normal by transforming local Z axis (portal faces along Z)
        const worldNormal = new THREE.Vector3(0, 0, 1);
        worldNormal.applyQuaternion(groupRef.current.getWorldQuaternion(new THREE.Quaternion()));

        onPortalClick({
          faceId: face.config.id,
          section: face.config.section,
          worldCenter,
          worldNormal,
        });
      }
    },
    [face.config, onPortalClick]
  );

  // Emissive color for hover state
  const innerRingEmissive = hovered ? "#4a8a6a" : face.config?.active ? "#2a4a3a" : "#000000";
  const innerRingEmissiveIntensity = hovered ? 0.4 : face.config?.active ? 0.1 : 0;

  return (
    <group ref={groupRef} position={ringPos} quaternion={quaternion}>
      {/* === ACTIVE PORTAL: hitbox, rings, label === */}
      {face.config?.active && (
        <>
          {/* Invisible hitbox for portal (circle in the hole) */}
          <mesh
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onDoubleClick={handleDoubleClick}
          >
            <circleGeometry args={[face.holeRadius, 32]} />
            <meshBasicMaterial transparent opacity={0} side={THREE.DoubleSide} />
          </mesh>

          {/* === OUTER RING (inscribed in pentagon) === */}
          <mesh>
            <torusGeometry args={[outerRingRadius + GROOVE_OFFSET, GROOVE_WIDTH, 8, 32]} />
            <meshStandardMaterial color="#4a3528" metalness={0.6} roughness={0.7} />
          </mesh>
          <mesh>
            <torusGeometry args={[outerRingRadius, RING_WIDTH, 8, 32]} />
            <meshStandardMaterial
              map={textures.map}
              normalMap={textures.normalMap}
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
          <mesh>
            <torusGeometry args={[outerRingRadius - GROOVE_OFFSET, GROOVE_WIDTH, 8, 32]} />
            <meshStandardMaterial color="#4a3528" metalness={0.6} roughness={0.7} />
          </mesh>

          {/* === INNER RING (at hole edge) === */}
          {showInnerRing && (
            <>
              <mesh>
                <torusGeometry args={[innerRingRadius + GROOVE_OFFSET, GROOVE_WIDTH, 8, 32]} />
                <meshStandardMaterial color="#4a3528" metalness={0.6} roughness={0.7} />
              </mesh>
              <mesh>
                <torusGeometry args={[innerRingRadius, RING_WIDTH, 8, 32]} />
                <meshStandardMaterial
                  map={textures.map}
                  normalMap={textures.normalMap}
                  metalness={0.9}
                  roughness={0.2}
                  emissive={innerRingEmissive}
                  emissiveIntensity={innerRingEmissiveIntensity}
                />
              </mesh>
              <mesh>
                <torusGeometry args={[innerRingRadius - GROOVE_OFFSET, GROOVE_WIDTH, 8, 32]} />
                <meshStandardMaterial color="#4a3528" metalness={0.6} roughness={0.7} />
              </mesh>
            </>
          )}

          {/* Glassmorphism cover - fades in/out */}
          {(hovered || fadeOpacity > 0) && (
            <mesh position={[0, 0, 0.01]}>
              <circleGeometry args={[face.holeRadius, 64]} />
              <MeshTransmissionMaterial
                backside={false}
                samples={8}
                resolution={256}
                transmission={0.95 * fadeOpacity}
                roughness={0.3}
                thickness={0.5 * fadeOpacity}
                ior={1.5}
                chromaticAberration={0.02}
                anisotropy={0.1}
                distortion={0.1 * fadeOpacity}
                distortionScale={0.2}
                color="#1a3a4a"
              />
            </mesh>
          )}

          {/* Label - fades in/out */}
          {(hovered || fadeOpacity > 0) && face.config?.name && (
            <PendulumLabel
              name={face.config.name}
              animState={labelAnimState}
              opacity={fadeOpacity}
            />
          )}
        </>
      )}

      {/* INACTIVE PORTALS: SketchFace is rendered separately in main group */}
    </group>
  );
}

// Create hollow dodecahedron with holes using CSG
// Takes pre-computed faces with hole radii to ensure consistency
function createHollowDodecahedronWithHoles(
  outerRadius: number,
  wallThickness: number,
  faces: FaceWithHole[]
): THREE.BufferGeometry {
  const evaluator = new Evaluator();

  // Create outer dodecahedron
  const outerGeo = new THREE.DodecahedronGeometry(outerRadius, 0);
  const outerBrush = new Brush(outerGeo);
  outerBrush.updateMatrixWorld();

  // Create inner dodecahedron (to hollow out)
  const innerRadius = outerRadius - wallThickness;
  const innerGeo = new THREE.DodecahedronGeometry(innerRadius, 0);
  const innerBrush = new Brush(innerGeo);
  innerBrush.updateMatrixWorld();

  // Subtract inner from outer to create shell
  let result = evaluator.evaluate(outerBrush, innerBrush, SUBTRACTION);

  // Subtract cylinder for each ACTIVE face to create holes
  // Inactive faces keep the solid surface for sketch overlay
  for (const face of faces) {
    // Skip inactive faces - no hole for them
    if (!face.config?.active) continue;

    const cylinderGeo = new THREE.CylinderGeometry(
      face.holeRadius,
      face.holeRadius,
      outerRadius,
      32
    );
    const cylinderBrush = new Brush(cylinderGeo);

    // Position cylinder at face center
    cylinderBrush.position.copy(face.center);

    // Rotate cylinder to align with face normal
    const up = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, face.normal);
    cylinderBrush.quaternion.copy(quaternion);

    cylinderBrush.updateMatrixWorld();

    // Subtract cylinder
    result = evaluator.evaluate(result, cylinderBrush, SUBTRACTION);
  }

  return result.geometry;
}

// Inner fog using drei Cloud component
function InnerFog() {
  return (
    <group>
      {/* Soft point light in the center - sunset purple glow */}
      <pointLight position={[0, 0, 0]} intensity={8} color="#9370DB" distance={5} decay={2} />
      <Clouds material={THREE.MeshBasicMaterial}>
        {/* Outer fog - light purple/lavender */}
        <Cloud
          seed={42}
          segments={10}
          bounds={[0.4, 0.4, 0.4]}
          volume={3}
          color="#b8a0d0"
          fade={10}
          speed={0.2}
          opacity={0.5}
          concentrate="inside"
        />
        {/* Dense core - deeper purple */}
        <Cloud
          seed={7}
          segments={6}
          bounds={[0.15, 0.15, 0.15]}
          volume={4}
          color="#9370DB"
          fade={10}
          speed={0.15}
          opacity={0.7}
          concentrate="inside"
        />
      </Clouds>
    </group>
  );
}

// Data passed when a portal is clicked
export interface PortalClickData {
  faceId: number;
  section: string | null;
  worldCenter: THREE.Vector3; // Portal center in world coordinates
  worldNormal: THREE.Vector3; // Portal normal in world coordinates
}

interface DodecahedronProps {
  onPortalClick?: (data: PortalClickData) => void;
  isNavigating?: boolean; // When true, stops rotation for camera animation
}

export function Dodecahedron({ onPortalClick, isNavigating = false }: DodecahedronProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Load only color and normal textures, control metalness/roughness manually
  const textures = useTexture({
    map: "/textures/Metal047A_1K-JPG/Metal047A_1K-JPG_Color.jpg",
    normalMap: "/textures/Metal047A_1K-JPG/Metal047A_1K-JPG_NormalGL.jpg",
  });

  // Load Metal015 textures for vertex spheres
  const sphereTextures = useTexture({
    map: "/textures/Metal015_1K-JPG/Metal015_1K-JPG_Color.jpg",
    normalMap: "/textures/Metal015_1K-JPG/Metal015_1K-JPG_NormalGL.jpg",
    roughnessMap: "/textures/Metal015_1K-JPG/Metal015_1K-JPG_Roughness.jpg",
    metalnessMap: "/textures/Metal015_1K-JPG/Metal015_1K-JPG_Metalness.jpg",
  });

  // Configure texture wrapping
  useMemo(() => {
    Object.values(textures).forEach((tex) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(2, 2);
    });
    Object.values(sphereTextures).forEach((tex) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(1, 1);
    });
  }, [textures, sphereTextures]);

  // Get vertices for spheres
  const vertices = useMemo(() => getDodecahedronVertices(RADIUS), []);

  // Get face centers and attach hole radii from config
  // This ensures CSG and ring rendering use the same data
  const facesWithHoles = useMemo((): FaceWithHole[] => {
    const faces = getDodecahedronFaceCenters(RADIUS);
    return faces.map((face, idx) => ({
      center: face.center,
      normal: face.normal,
      vertices: face.vertices,
      holeRadius: FACE_CONFIG[idx]?.holeRadius ?? 1.0,
      config: FACE_CONFIG[idx],
    }));
  }, []);

  // Create hollow geometry with holes (CSG operation)
  const holedGeometry = useMemo(
    () => createHollowDodecahedronWithHoles(RADIUS, WALL_THICKNESS, facesWithHoles),
    [facesWithHoles]
  );

  // Very slow idle rotation (5x slower) - paused during navigation
  useFrame((_, delta) => {
    if (groupRef.current && !isNavigating) {
      groupRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <>
      <group ref={groupRef}>
        {/* Inner fog in the center */}
        <InnerFog />

        {/* Main dodecahedron with holes - bronze material */}
        <mesh geometry={holedGeometry} castShadow receiveShadow>
          <meshStandardMaterial
            map={textures.map}
            normalMap={textures.normalMap}
            metalness={1}
            roughness={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Interactive portals with hover/click (active faces only) */}
        {facesWithHoles.map((face, idx) => (
          <Portal
            key={`portal-${idx}`}
            face={face}
            textures={textures}
            onPortalClick={onPortalClick}
          />
        ))}

        {/* Sketch faces for inactive portals - rendered in main group for correct rotation */}
        {facesWithHoles
          .filter((face) => !face.config?.active)
          .map((face, idx) => (
            <SketchFace
              key={`sketch-${idx}`}
              vertices={face.vertices}
              center={face.center}
              normal={face.normal}
              initialTextureIndex={idx}
            />
          ))}

        {/* Vertex spheres */}
        {vertices.map((vertex, idx) => {
          const config = SPHERE_CONFIG[idx];
          const pos = vertex
            .clone()
            .normalize()
            .multiplyScalar(vertex.length() + 0.15);

          return (
            <mesh key={`sphere-${idx}`} position={pos} castShadow>
              <sphereGeometry args={[0.25, 16, 16]} />
              <meshStandardMaterial
                map={sphereTextures.map}
                normalMap={sphereTextures.normalMap}
                roughnessMap={sphereTextures.roughnessMap}
                metalnessMap={sphereTextures.metalnessMap}
                metalness={0.6}
                roughness={0.85}
                emissive={config?.active ? "#2a4a3a" : "#000000"}
                emissiveIntensity={config?.active ? 0.15 : 0}
              />
            </mesh>
          );
        })}
      </group>
    </>
  );
}
