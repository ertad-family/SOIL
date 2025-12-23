/**
 * Cookie consent management utilities
 * Part of issue #184: GDPR/CCPA Compliance
 *
 * Simple consent management using localStorage.
 * Categories:
 * - essential: Always on (auth, security) - not stored, always true
 * - analytics: GA, Vercel Analytics, internal tracking, visitor fingerprint
 */

const CONSENT_STORAGE_KEY = "soil_consent";

export type ConsentCategory = "analytics";

export interface ConsentState {
  analytics: boolean;
  timestamp: number;
}

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/**
 * Get the current consent state from localStorage
 * Returns null if no consent has been given yet
 */
export function getConsent(): ConsentState | null {
  if (!isBrowser()) return null;

  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    // Validate the structure
    if (typeof parsed.analytics === "boolean" && typeof parsed.timestamp === "number") {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Save consent state to localStorage and set a cookie for server-side access
 */
export function setConsent(analytics: boolean): void {
  if (!isBrowser()) return;

  const state: ConsentState = {
    analytics,
    timestamp: Date.now(),
  };

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));

    // Also set a cookie so server can check consent
    // This cookie is essential (stores user preference) so it's always set
    const cookieValue = analytics ? "1" : "0";
    const maxAge = 60 * 60 * 24 * 365; // 1 year
    document.cookie = `soil_analytics_consent=${cookieValue}; path=/; max-age=${maxAge}; SameSite=Lax`;

    // Dispatch a custom event so other components can react
    window.dispatchEvent(new CustomEvent("consentChanged", { detail: state }));
  } catch {
    // localStorage might be full or disabled - fail silently
  }
}

/**
 * Check if user has given analytics consent
 * Returns false if no consent stored (opt-in model)
 */
export function hasAnalyticsConsent(): boolean {
  const consent = getConsent();
  return consent?.analytics ?? false;
}

/**
 * Check if consent banner should be shown
 * Returns true if no consent decision has been made yet
 */
export function shouldShowConsentBanner(): boolean {
  return getConsent() === null;
}

/**
 * Accept all cookies
 */
export function acceptAllCookies(): void {
  setConsent(true);
}

/**
 * Reject all non-essential cookies
 */
export function rejectAllCookies(): void {
  setConsent(false);
}
