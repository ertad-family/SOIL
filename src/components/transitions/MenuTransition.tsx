"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";
import { useMenu } from "@/contexts/MenuContext";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/lib/utils";

// Dynamically import DodecahedronScene to avoid SSR issues with Three.js
const DodecahedronScene = dynamic(
  () =>
    import("@/components/three/DodecahedronScene").then((mod) => ({
      default: mod.DodecahedronScene,
    })),
  { ssr: false }
);

// Animation durations (ms)
const FADE_DURATION = 600;

// Transition phases
type Phase =
  | "idle" // Scene pre-rendered but hidden, page visible
  | "fadingIn" // Fading overlay to opacity=1 (hiding page)
  | "fadingOut" // Fading overlay to opacity=0 (revealing scene)
  | "flyingOut" // Fly-out animation in progress
  | "menu" // User in menu, can interact
  | "flyingIn" // Flying into portal
  | "navigating"; // Navigation in progress, fading out

/**
 * Global menu transition component.
 *
 * Flow:
 * 1. Scene is ALWAYS pre-mounted (hidden behind page)
 * 2. Click Menu → fade-in overlay (hide page)
 * 3. Fade-in complete → fade-out overlay (reveal scene, camera inside dodecahedron)
 * 4. Fade-out complete → trigger fly-out animation
 * 5. Fly-out complete → user in menu
 */
export function MenuTransition() {
  const { isOpen, currentSection, closeMenu, navigateViaPortal } = useMenu();
  const isMobile = useIsMobile();

  const [phase, setPhase] = useState<Phase>("idle");
  const [fadeOpacity, setFadeOpacity] = useState(0);
  const [sceneReady, setSceneReady] = useState(false);

  // Ref to trigger fly-out animation in the scene
  const triggerFlyOutRef = useRef<(() => void) | null>(null);

  // Ref to trigger fly-in animation externally (for Return/ESC)
  const triggerFlyInRef = useRef<((section: string) => void) | null>(null);

  // Track if we're returning (close without navigation) vs navigating
  const isReturningRef = useRef(false);

  // Track navigation
  const didNavigateRef = useRef(false);

  // Phase ref for callbacks
  const phaseRef = useRef<Phase>("idle");
  const updatePhase = useCallback((newPhase: Phase) => {
    console.log("[MenuTransition] Phase:", phaseRef.current, "->", newPhase);
    phaseRef.current = newPhase;
    setPhase(newPhase);
  }, []);

  // ============================================================================
  // Scene ready callback
  // ============================================================================
  const handleSceneReady = useCallback(() => {
    console.log("[MenuTransition] Scene pre-loaded and ready");
    setSceneReady(true);
  }, []);

  // ============================================================================
  // STEP 1: Menu clicked → Start fade-in
  // ============================================================================
  useEffect(() => {
    if (isOpen && phase === "idle" && sceneReady) {
      console.log("[MenuTransition] Menu opened, starting fade-in");
      updatePhase("fadingIn");

      let startTime: number | null = null;
      const animate = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / FADE_DURATION, 1);

        // Ease in-out cubic
        const eased =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        setFadeOpacity(eased);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Fade-in complete → start fade-out
          console.log("[MenuTransition] Fade-in complete, starting fade-out");
          setFadeOpacity(1);
          updatePhase("fadingOut");
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isOpen, phase, sceneReady, updatePhase]);

  // ============================================================================
  // STEP 2: Fade-out (reveal scene)
  // ============================================================================
  useEffect(() => {
    if (phase === "fadingOut") {
      let startTime: number | null = null;
      const animate = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / FADE_DURATION, 1);

        // Ease in-out cubic
        const eased =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        setFadeOpacity(1 - eased);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Fade-out complete → trigger fly-out
          console.log("[MenuTransition] Fade-out complete, triggering fly-out");
          setFadeOpacity(0);
          updatePhase("flyingOut");
          triggerFlyOutRef.current?.();
        }
      };

      requestAnimationFrame(animate);
    }
  }, [phase, updatePhase]);

  // ============================================================================
  // STEP 3: Fly-out complete → enter menu
  // ============================================================================
  const handleFlyOutComplete = useCallback(() => {
    console.log("[MenuTransition] Fly-out complete, entering menu");
    updatePhase("menu");
  }, [updatePhase]);

  // ============================================================================
  // Handle Return (close menu without navigation via ESC or Return button)
  // ============================================================================
  const handleReturn = useCallback(() => {
    if (phaseRef.current !== "menu") return; // Only allow return from menu phase

    console.log("[MenuTransition] Return triggered, flying back to:", currentSection);
    isReturningRef.current = true;
    triggerFlyInRef.current?.(currentSection);
  }, [currentSection]);

  // ESC key listener - close menu when in menu phase
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && phaseRef.current === "menu") {
        e.preventDefault();
        handleReturn();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleReturn]);

  // ============================================================================
  // Handle fade progress from scene (only during fly-in)
  // ============================================================================
  const handleFadeProgress = useCallback((progress: number) => {
    if (phaseRef.current === "flyingIn") {
      setFadeOpacity(progress);
    }
    // Ignore during fly-out - we control fade ourselves
  }, []);

  // ============================================================================
  // Portal clicked → start fly-in
  // ============================================================================
  const handleFlyInStart = useCallback(
    (faceId: number, section: string | null) => {
      console.log("[MenuTransition] Fly-in started");
      updatePhase("flyingIn");
      didNavigateRef.current = false;
    },
    [updatePhase]
  );

  // Track target section for navigation
  const targetSectionRef = useRef<string | null>(null);

  // ============================================================================
  // Portal navigation (called when fly-in fade reaches 1)
  // ============================================================================
  const handlePortalNavigate = useCallback(
    (faceId: number, section: string | null) => {
      if (didNavigateRef.current) return;
      didNavigateRef.current = true;

      // Check if this is a "return" (close without navigation)
      if (isReturningRef.current) {
        console.log("[MenuTransition] Returning to current page (no navigation)");
        isReturningRef.current = false;

        // Start fade-out animation immediately (no navigation needed)
        let startTime: number | null = null;
        const animate = (currentTime: number) => {
          if (startTime === null) startTime = currentTime;
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / FADE_DURATION, 1);

          const eased =
            progress < 0.5
              ? 4 * progress * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 3) / 2;

          setFadeOpacity(1 - eased);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            console.log("[MenuTransition] Return fade-out complete");
            setFadeOpacity(0);
            updatePhase("idle");
            closeMenu();
            didNavigateRef.current = false;
          }
        };

        requestAnimationFrame(animate);
        return;
      }

      // Normal navigation flow
      console.log("[MenuTransition] Navigating to:", section);

      targetSectionRef.current = section;
      updatePhase("navigating");
      navigateViaPortal(section);
      // Fade-out will be triggered by useEffect watching currentSection change
    },
    [navigateViaPortal, updatePhase, closeMenu]
  );

  // ============================================================================
  // Watch for navigation completion (currentSection changes when pathname changes)
  // ============================================================================
  useEffect(() => {
    if (phase !== "navigating") return;

    const targetSection = targetSectionRef.current;
    if (!targetSection) return;

    // Wait until currentSection matches target (or target is same as current for same-page nav)
    if (currentSection !== targetSection) {
      console.log(
        "[MenuTransition] Waiting for navigation... current:",
        currentSection,
        "target:",
        targetSection
      );
      return;
    }

    // Navigation complete - start fade-out
    console.log(
      "[MenuTransition] Navigation complete! Starting fade-out. Section:",
      currentSection
    );

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / FADE_DURATION, 1);

      const eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      setFadeOpacity(1 - eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        console.log("[MenuTransition] Navigation fade-out complete");
        setFadeOpacity(0);
        updatePhase("idle");
        closeMenu();
        didNavigateRef.current = false;
        targetSectionRef.current = null;
      }
    };

    requestAnimationFrame(animate);
  }, [phase, currentSection, updatePhase, closeMenu]);

  // ============================================================================
  // Handle closing without navigation
  // ============================================================================
  useEffect(() => {
    if (!isOpen && phase === "menu") {
      console.log("[MenuTransition] Menu closed without navigation");
      updatePhase("fadingIn");

      // Fade in, then fade out, then idle
      let startTime: number | null = null;
      const fadeIn = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / (FADE_DURATION / 2), 1);

        setFadeOpacity(progress);

        if (progress < 1) {
          requestAnimationFrame(fadeIn);
        } else {
          // Fade-out
          startTime = null;
          const fadeOut = (currentTime: number) => {
            if (startTime === null) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / FADE_DURATION, 1);

            setFadeOpacity(1 - progress);

            if (progress < 1) {
              requestAnimationFrame(fadeOut);
            } else {
              updatePhase("idle");
            }
          };
          requestAnimationFrame(fadeOut);
        }
      };
      requestAnimationFrame(fadeIn);
    }
  }, [isOpen, phase, updatePhase]);

  // Show scene when not in idle phase, or always to pre-render (desktop only)
  // On mobile: load on-demand to avoid background WebGL rendering (#195)
  const showScene = isMobile
    ? phase !== "idle" // Mobile: only mount when menu is actually open
    : phase !== "idle" || sceneReady; // Desktop: preload for instant experience

  return (
    <>
      {/* Fade overlay */}
      {fadeOpacity > 0 && (
        <div
          className="fixed inset-0 z-[100] pointer-events-none"
          style={{
            background: `radial-gradient(circle at center,
              rgba(255, 250, 240, 1) 0%,
              rgba(255, 248, 230, 1) 15%,
              rgba(245, 235, 210, 1) 30%,
              rgba(201, 180, 150, 1) 50%,
              rgba(160, 140, 170, 1) 70%,
              rgba(80, 70, 100, 1) 85%,
              rgba(20, 18, 25, 1) 100%)`,
            opacity: fadeOpacity,
          }}
        />
      )}

      {/* DodecahedronScene - preloaded on desktop, on-demand on mobile (#195) */}
      {/* On mobile: unmounted when idle to prevent background WebGL rendering */}
      {/* overflow-hidden and touch-action prevent page scroll during 3D interaction (#115) */}
      {showScene && (
        <div
          className="fixed inset-0 z-[90] overflow-hidden"
          style={{
            pointerEvents:
              phase === "menu" || phase === "flyingOut" || phase === "flyingIn" ? "auto" : "none",
            // Only visible during: fadingOut, flyingOut, menu, flyingIn
            // Hidden during: idle, fadingIn, navigating
            visibility: ["fadingOut", "flyingOut", "menu", "flyingIn"].includes(phase)
              ? "visible"
              : "hidden",
            // Prevent scroll gestures on mobile during menu phase (#115)
            touchAction: phase === "menu" ? "none" : "auto",
          }}
        >
          <Suspense fallback={null}>
            <DodecahedronScene
              className="w-full h-full"
              initialView="inside"
              exitPortalSection={currentSection}
              onFlyOutComplete={handleFlyOutComplete}
              onFlyInStart={handleFlyInStart}
              onPortalClick={handlePortalNavigate}
              initialFadeOpacity={0}
              onExternalFadeProgress={handleFadeProgress}
              hideInternalOverlay={true}
              triggerFlyOutRef={triggerFlyOutRef}
              triggerFlyInRef={triggerFlyInRef}
              onReady={handleSceneReady}
            />
          </Suspense>

          {/* Return button - visible in menu phase */}
          {/* Hide (ESC) hint on mobile where keyboard shortcuts don't apply (#117) */}
          {phase === "menu" && (
            <div className="absolute top-8 right-8 z-[95]">
              <Button
                variant="dark-secondary"
                size="sm"
                onClick={handleReturn}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                aria-label={isMobile ? "Return to page" : "Return to page (ESC)"}
              >
                {isMobile ? "Return" : "Return (ESC)"}
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
