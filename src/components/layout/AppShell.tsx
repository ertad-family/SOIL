"use client";

import { Suspense, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/lib/utils";
import { MenuProvider } from "@/contexts/MenuContext";
import { PagePrivacyProvider, usePagePrivacy } from "@/contexts/PagePrivacyContext";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MenuTransition } from "@/components/transitions/MenuTransition";
import { GlobalParticles } from "@/components/three/GlobalParticles";
import { LiquidContributionFab } from "@/components/ui/liquid-contribution-fab";

interface AppShellProps {
  children: ReactNode;
}

/**
 * VisitorParticles - Conditionally renders GlobalParticles based on privacy.
 *
 * Combines static pathname checks (for routes that are always private)
 * with dynamic page privacy context (for pages that control visibility at runtime).
 */
function VisitorParticles() {
  const pathname = usePathname();
  const { isPagePublic } = usePagePrivacy();
  const isMobile = useIsMobile();

  // Disable GlobalParticles entirely on mobile for performance (#195)
  // This eliminates a separate WebGL context that competes for GPU resources
  if (isMobile) return null;

  // Static check: always private routes (focused flows, dashboards)
  const staticPrivate =
    pathname.startsWith("/interview") ||
    pathname.startsWith("/account") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/organization/create") ||
    pathname.startsWith("/cenotaph/create");

  // Show particles only if not static private AND page declares itself public
  const showParticles = !staticPrivate && isPagePublic;

  if (!showParticles) return null;

  return (
    <Suspense fallback={null}>
      <GlobalParticles />
    </Suspense>
  );
}

/**
 * AppShell - Global layout wrapper for all pages.
 *
 * Provides:
 * - PagePrivacyProvider (page-level privacy control for particles)
 * - MenuProvider (global menu state)
 * - Header (sticky, with menu button)
 * - Footer (with 3D landscape)
 * - MenuTransition (single global instance)
 * - GlobalParticles (floating visitor particles, controlled by page privacy)
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <PagePrivacyProvider>
      <MenuProvider>
        <div className="dark">
          {/* Global floating particles (controlled by page privacy) */}
          <VisitorParticles />

          {/* Global menu transition - single instance for entire app */}
          <MenuTransition />

          <div className="min-h-screen bg-slate-900 dark:bg-slate-900 text-marble-100 flex flex-col">
            <Header />

            {/* Page content */}
            <main className="flex-1 relative">
              {children}
              {/* Auto gradient transition to footer - applies to all pages */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-marble-950 pointer-events-none z-10" />
            </main>

            <Footer />

            {/* Floating contribution button - hidden on mobile for performance (#109) */}
            <div className="hidden md:block">
              <LiquidContributionFab />
            </div>
          </div>
        </div>
      </MenuProvider>
    </PagePrivacyProvider>
  );
}
