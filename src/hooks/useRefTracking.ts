/**
 * Hook to track referral token clicks on page load
 * Part of issue #168: Internal analytics dashboard
 * Updated for issue #184: GDPR/CCPA Compliance - consent check added
 */

"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { hasAnalyticsConsent } from "@/lib/consent";

/**
 * Track referral token click when page loads with ?ref= parameter
 * Should be called once at the top level of pages that can receive referral traffic
 * Only tracks if user has given analytics consent.
 */
export function useRefTracking() {
  const searchParams = useSearchParams();
  const hasTracked = useRef(false);

  useEffect(() => {
    // Only track once per page load
    if (hasTracked.current) return;

    const ref = searchParams.get("ref");
    if (!ref) return;

    // Check consent before tracking
    if (!hasAnalyticsConsent()) {
      if (process.env.NODE_ENV === "development") {
        console.log("[RefTracking] Skipped (no consent):", ref);
      }
      return;
    }

    hasTracked.current = true;

    // Track the click event
    fetch("/api/share/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: ref,
        eventType: "click",
      }),
    }).catch((err) => {
      console.error("[RefTracking] Failed to track click:", err);
    });
  }, [searchParams]);
}
