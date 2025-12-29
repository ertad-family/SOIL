"use client";

import { Suspense, ReactNode, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/lib/utils";
import { MenuProvider } from "@/contexts/MenuContext";
import { PagePrivacyProvider, usePagePrivacy } from "@/contexts/PagePrivacyContext";
import {
  TestimonialPromptProvider,
  useTestimonialPrompt,
} from "@/contexts/TestimonialPromptContext";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MenuTransition } from "@/components/transitions/MenuTransition";
import { GlobalParticles } from "@/components/three/GlobalParticles";
import { LiquidContributionFab } from "@/components/ui/liquid-contribution-fab";
import { BugReportFab } from "@/components/ui/bug-report-fab";
import { Toaster } from "@/components/ui/toaster";
import { initConsoleCapture } from "@/lib/console-capture";

interface AppShellProps {
  children: ReactNode;
}

/**
 * ConsoleCapture - Initializes console log capture for bug reporting.
 * Runs once on mount to intercept console methods.
 */
function ConsoleCapture() {
  useEffect(() => {
    initConsoleCapture();
  }, []);

  return null;
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

  // Static check: always private routes (focused flows, dashboards, dev tools)
  const staticPrivate =
    pathname.startsWith("/interview") ||
    pathname.startsWith("/account") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/organization/create") ||
    pathname.startsWith("/cenotaph/create") ||
    pathname.startsWith("/cenotaph-preview");

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
 * GeneralVisitorFeedback - Shows feedback prompt after 3 minutes for general visitors.
 *
 * Only triggers for visitors who:
 * 1. Are on public pages (not interview, account, admin, etc.)
 * 2. Haven't already given general feedback this session
 * 3. Have spent 3+ minutes on the site
 */
function GeneralVisitorFeedback() {
  const pathname = usePathname();
  const { showPrompt, hasFeedbackBeenGiven, isPromptOpen } = useTestimonialPrompt();
  const hasTriggeredRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Don't trigger for private/focused routes
    const isPrivateRoute =
      pathname.startsWith("/interview") ||
      pathname.startsWith("/account") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/organization/create") ||
      pathname.startsWith("/cenotaph/create") ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/signup");

    if (isPrivateRoute) return;

    // Don't trigger if feedback already given or already triggered this session
    if (hasFeedbackBeenGiven("general") || hasTriggeredRef.current) return;

    // Don't start timer if a prompt is already open
    if (isPromptOpen) return;

    // Set timer for 3 minutes (180000ms)
    timerRef.current = setTimeout(() => {
      // Double-check before showing
      if (!hasFeedbackBeenGiven("general") && !hasTriggeredRef.current) {
        hasTriggeredRef.current = true;
        showPrompt({
          type: "general",
          title: "We value your opinion",
          description: "You're one of the first 1000 visitors. Your feedback helps us improve.",
        });
      }
    }, 180000); // 3 minutes

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [pathname, showPrompt, hasFeedbackBeenGiven, isPromptOpen]);

  return null;
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
  const pathname = usePathname();

  // Routes that should hide the footer (performance-critical 3D pages)
  const hideFooter = pathname.startsWith("/cenotaph-preview");

  return (
    <PagePrivacyProvider>
      <MenuProvider>
        <TestimonialPromptProvider>
          {/* Initialize console capture for bug reporting */}
          <ConsoleCapture />

          {/* General visitor feedback exit-intent */}
          <GeneralVisitorFeedback />

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
                {/* Auto gradient transition to footer - hidden on full-screen 3D pages */}
                {!hideFooter && (
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-marble-950 pointer-events-none z-10" />
                )}
              </main>

              {!hideFooter && <Footer />}

              {/* Floating contribution button - hidden on mobile and in production */}
              {process.env.NODE_ENV !== "production" && (
                <div className="hidden md:block">
                  <LiquidContributionFab />
                </div>
              )}

              {/* Bug report button - always visible */}
              <BugReportFab />
            </div>

            {/* Toast notifications */}
            <Toaster />
          </div>
        </TestimonialPromptProvider>
      </MenuProvider>
    </PagePrivacyProvider>
  );
}
