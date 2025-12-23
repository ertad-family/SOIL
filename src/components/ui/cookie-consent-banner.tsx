"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { shouldShowConsentBanner, acceptAllCookies, rejectAllCookies } from "@/lib/consent";

/**
 * Cookie consent banner component
 * Part of issue #184: GDPR/CCPA Compliance
 *
 * Shows a fixed banner at the bottom of the screen on first visit.
 * Allows users to accept or reject non-essential cookies.
 */
export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Only check consent status after mount to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    if (shouldShowConsentBanner()) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    acceptAllCookies();
    setIsVisible(false);
  };

  const handleReject = () => {
    rejectAllCookies();
    setIsVisible(false);
  };

  // Don't render anything during SSR or if banner shouldn't show
  if (!isMounted || !isVisible) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 animate-fade-in-up"
      role="dialog"
      aria-label="Cookie consent"
      aria-describedby="cookie-consent-description"
    >
      <div className="max-w-4xl mx-auto bg-marble-900/95 backdrop-blur-sm border border-marble-700 rounded-lg shadow-2xl">
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            {/* Text content */}
            <div className="flex-1">
              <h3 className="font-display text-lg font-medium text-marble-100 mb-2">
                Cookie Preferences
              </h3>
              <p id="cookie-consent-description" className="text-sm text-slate-400 leading-relaxed">
                We use cookies to analyze site traffic and improve your experience. Essential
                cookies are always active.{" "}
                <Link
                  href="/privacy#cookies-and-tracking-technologies"
                  className="text-gold-400 hover:text-gold-300 underline"
                >
                  Learn more
                </Link>
              </p>
            </div>

            {/* Buttons - reversed on mobile so primary action is first (#160) */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 shrink-0">
              <Button
                variant="dark-secondary"
                size="sm"
                onClick={handleReject}
                className="whitespace-nowrap"
              >
                Reject All
              </Button>
              <Button
                variant="dark-primary"
                size="sm"
                onClick={handleAccept}
                className="whitespace-nowrap"
              >
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Component to open cookie preferences (for Footer link)
 * Resets consent state and shows the banner again
 */
export function openCookiePreferences(): void {
  if (typeof window === "undefined") return;

  // Clear existing consent to show banner again
  localStorage.removeItem("soil_consent");
  window.dispatchEvent(new CustomEvent("consentChanged", { detail: null }));

  // Reload to show banner (simplest approach for MVP)
  window.location.reload();
}
