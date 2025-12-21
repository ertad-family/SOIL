/**
 * Visitor identification utilities for anonymous tracking
 * Used for Pay Respects feature to prevent duplicate payments
 */

import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const VISITOR_COOKIE_NAME = "soil_visitor";
const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year in seconds

/**
 * Get or create a visitor fingerprint from cookies (server-side)
 * Always returns a fingerprint, creating one if it doesn't exist
 */
export async function getVisitorFingerprint(): Promise<string> {
  const cookieStore = await cookies();
  const existingCookie = cookieStore.get(VISITOR_COOKIE_NAME);

  if (existingCookie?.value) {
    return existingCookie.value;
  }

  // Generate new fingerprint
  const fingerprint = randomUUID();

  // Set cookie for future requests
  cookieStore.set(VISITOR_COOKIE_NAME, fingerprint, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: VISITOR_COOKIE_MAX_AGE,
    path: "/",
  });

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
