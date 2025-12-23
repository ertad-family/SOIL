/**
 * Visitor identification utilities for anonymous tracking
 * Used for Pay Respects feature to prevent duplicate payments
 * Updated for issue #184: GDPR/CCPA Compliance - consent check added
 */

import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const VISITOR_COOKIE_NAME = "soil_visitor";
const CONSENT_COOKIE_NAME = "soil_analytics_consent";
const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year in seconds

/**
 * Check if user has given analytics consent (server-side)
 * Returns true only if consent cookie explicitly set to "1"
 */
async function hasServerAnalyticsConsent(): Promise<boolean> {
  const cookieStore = await cookies();
  const consentCookie = cookieStore.get(CONSENT_COOKIE_NAME);
  return consentCookie?.value === "1";
}

/**
 * Get or create a visitor fingerprint from cookies (server-side)
 * Only creates/persists fingerprint if user has given analytics consent.
 * If no consent, returns a temporary session-based ID.
 */
export async function getVisitorFingerprint(): Promise<string> {
  const cookieStore = await cookies();
  const existingCookie = cookieStore.get(VISITOR_COOKIE_NAME);

  // If fingerprint already exists, return it
  if (existingCookie?.value) {
    return existingCookie.value;
  }

  // Check consent before creating a new persistent fingerprint
  const hasConsent = await hasServerAnalyticsConsent();

  // Generate fingerprint
  const fingerprint = randomUUID();

  // Only persist if consent given
  if (hasConsent) {
    cookieStore.set(VISITOR_COOKIE_NAME, fingerprint, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: VISITOR_COOKIE_MAX_AGE,
      path: "/",
    });
  }

  // Return fingerprint (persisted or temporary)
  return fingerprint;
}

/**
 * Get visitor fingerprint without creating one (for status checks)
 * Returns null if no fingerprint exists
 */
export async function getExistingVisitorFingerprint(): Promise<string | null> {
  const cookieStore = await cookies();
  const existingCookie = cookieStore.get(VISITOR_COOKIE_NAME);
  return existingCookie?.value || null;
}
