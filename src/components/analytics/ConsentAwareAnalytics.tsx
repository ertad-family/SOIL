"use client";

import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { hasAnalyticsConsent } from "@/lib/consent";

/**
 * Consent-aware analytics wrapper
 * Part of issue #184: GDPR/CCPA Compliance
 *
 * Only loads Vercel Analytics and Google Analytics after user consents.
 * Listens for consent changes and updates accordingly.
 */
export function ConsentAwareAnalytics() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  useEffect(() => {
    // Check initial consent state
    setAnalyticsEnabled(hasAnalyticsConsent());

    // Listen for consent changes
    const handleConsentChange = () => {
      setAnalyticsEnabled(hasAnalyticsConsent());
    };

    window.addEventListener("consentChanged", handleConsentChange);
    return () => {
      window.removeEventListener("consentChanged", handleConsentChange);
    };
  }, []);

  // Don't render analytics until consent is given
  if (!analyticsEnabled) {
    return null;
  }

  return (
    <>
      <Analytics />
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </>
  );
}
