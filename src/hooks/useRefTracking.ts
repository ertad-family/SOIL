/**
 * Hook to track referral token clicks on page load
 * Part of issue #168: Internal analytics dashboard
 */

"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Track referral token click when page loads with ?ref= parameter
 * Should be called once at the top level of pages that can receive referral traffic
 */
export function useRefTracking() {
  const searchParams = useSearchParams();
  const hasTracked = useRef(false);

  useEffect(() => {
    // Only track once per page load
    if (hasTracked.current) return;

    const ref = searchParams.get("ref");
    if (!ref) return;

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
