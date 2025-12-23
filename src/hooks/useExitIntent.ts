"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface UseExitIntentOptions {
  /** Whether the exit intent detection is enabled */
  enabled?: boolean;
  /** Callback when exit intent is detected */
  onExitIntent: () => void;
  /** Minimum time on page before exit intent is triggered (ms) */
  minTimeOnPage?: number;
  /** Whether to show browser's native beforeunload dialog */
  showBeforeUnload?: boolean;
  /** Custom message for beforeunload (note: most browsers ignore this) */
  beforeUnloadMessage?: string;
}

interface UseExitIntentReturn {
  /** Whether exit intent has been triggered at least once */
  hasTriggered: boolean;
  /** Reset the triggered state */
  reset: () => void;
  /** Manually trigger exit intent */
  trigger: () => void;
}

/**
 * Hook to detect user exit intent
 *
 * Exit intent is detected in the following scenarios:
 * 1. User tries to close/refresh the tab (beforeunload event)
 * 2. User navigates away using Next.js router
 * 3. User presses browser back button
 *
 * Note: beforeunload has browser limitations - modern browsers show their own
 * generic message instead of custom messages for security reasons.
 */
export function useExitIntent({
  enabled = true,
  onExitIntent,
  minTimeOnPage = 0,
  showBeforeUnload = true,
}: UseExitIntentOptions): UseExitIntentReturn {
  const router = useRouter();
  const [hasTriggered, setHasTriggered] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const hasTriggeredRef = useRef(false);

  // Track if enough time has passed
  const hasMinTimePassed = useCallback(() => {
    return Date.now() - startTimeRef.current >= minTimeOnPage;
  }, [minTimeOnPage]);

  // Trigger the exit intent callback
  const trigger = useCallback(() => {
    if (!hasTriggeredRef.current && hasMinTimePassed()) {
      hasTriggeredRef.current = true;
      setHasTriggered(true);
      onExitIntent();
    }
  }, [hasMinTimePassed, onExitIntent]);

  // Reset the triggered state
  const reset = useCallback(() => {
    hasTriggeredRef.current = false;
    setHasTriggered(false);
    startTimeRef.current = Date.now();
  }, []);

  // Handle beforeunload (tab close/refresh)
  useEffect(() => {
    if (!enabled || !showBeforeUnload) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasMinTimePassed()) return;

      // Trigger our callback
      trigger();

      // Show browser's native "Leave site?" dialog
      e.preventDefault();
      // Legacy support - most browsers ignore this message
      e.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [enabled, showBeforeUnload, hasMinTimePassed, trigger]);

  // Handle popstate (browser back/forward buttons)
  useEffect(() => {
    if (!enabled) return;

    const handlePopState = () => {
      if (hasMinTimePassed() && !hasTriggeredRef.current) {
        trigger();
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [enabled, hasMinTimePassed, trigger]);

  // For Next.js router navigation, we'll use a different approach
  // The parent component should call trigger() before navigation
  // This is handled in the TestimonialPromptContext

  return {
    hasTriggered,
    reset,
    trigger,
  };
}

/**
 * Hook specifically for intercepting navigation in specific pages
 * Use this in pages where you want to show a prompt before navigation
 */
export function useNavigationIntercept({
  enabled = true,
  onIntercept,
  shouldIntercept,
}: {
  enabled?: boolean;
  onIntercept: () => void;
  shouldIntercept: () => boolean;
}) {
  const interceptRef = useRef({ onIntercept, shouldIntercept });

  // Update refs on each render
  useEffect(() => {
    interceptRef.current = { onIntercept, shouldIntercept };
  }, [onIntercept, shouldIntercept]);

  useEffect(() => {
    if (!enabled) return;

    // Override link clicks within the page
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (link && link.href && !link.href.startsWith("javascript:")) {
        // Check if it's an internal link
        const isInternal =
          link.href.startsWith(window.location.origin) || link.href.startsWith("/");

        if (isInternal && interceptRef.current.shouldIntercept()) {
          e.preventDefault();
          interceptRef.current.onIntercept();
        }
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [enabled]);
}
