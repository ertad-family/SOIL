/**
 * Analytics utility for tracking events locally and to external services
 * Part of issue #168: Internal analytics dashboard
 */

// Event categories for organization
export type EventCategory =
  | "auth"
  | "wizard"
  | "engagement"
  | "navigation"
  | "discovery"
  | "virality"
  | "infrastructure";

// Standard event names
export type EventName =
  // Auth events
  | "signup"
  | "login"
  | "logout"
  | "email_verified"
  // Wizard events
  | "wizard_started"
  | "chapter_started"
  | "chapter_resumed"
  | "chapter_paused"
  | "chapter_completed"
  | "wizard_completed"
  // Engagement events
  | "respects_paid"
  | "share_click"
  | "share_link_created"
  | "newsletter_subscribe"
  // Navigation events
  | "page_view"
  | "portal_click"
  | "menu_open"
  | "cta_click"
  // Discovery events
  | "cenotaph_view"
  | "cenotaphery_view"
  | "search_query"
  | "filter_apply"
  // Virality events
  | "share_link_clicked"
  | "referral_converted"
  // Custom string for flexibility
  | (string & {});

export interface TrackEventOptions {
  /** Event category for grouping */
  category?: EventCategory;
  /** Additional properties */
  properties?: Record<string, unknown>;
  /** Skip sending to GA (for server-side only events) */
  skipGA?: boolean;
}

/**
 * Track an analytics event
 * - Logs to console in development
 * - Sends to internal API (Supabase)
 * - Optionally sends to Google Analytics
 */
export async function trackEvent(
  eventName: EventName,
  options: TrackEventOptions = {}
): Promise<void> {
  const { category, properties = {}, skipGA = false } = options;

  // Development logging
  if (process.env.NODE_ENV === "development") {
    console.log("[Analytics]", eventName, { category, ...properties });
  }

  // Send to internal API (fire-and-forget)
  try {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName,
        eventCategory: category,
        properties,
      }),
    }).catch((err) => {
      if (process.env.NODE_ENV === "development") {
        console.error("[Analytics] Failed to track event:", err);
      }
    });
  } catch {
    // Silently fail - analytics should never break the app
  }

  // Send to Google Analytics if available
  if (!skipGA && typeof window !== "undefined" && "gtag" in window) {
    try {
      const gtag = (window as Window & { gtag: Gtag.Gtag }).gtag;
      gtag("event", eventName, {
        event_category: category,
        ...properties,
      });
    } catch {
      // Silently fail
    }
  }
}

/**
 * Track a page view event
 * Convenience wrapper for page_view events
 */
export async function trackPageView(pagePath: string, pageTitle?: string): Promise<void> {
  await trackEvent("page_view", {
    category: "navigation",
    properties: {
      page_path: pagePath,
      page_title: pageTitle,
    },
  });
}

/**
 * Track wizard progress
 * Convenience wrapper for wizard events
 */
export async function trackWizardEvent(
  event:
    | "wizard_started"
    | "chapter_started"
    | "chapter_resumed"
    | "chapter_paused"
    | "chapter_completed"
    | "wizard_completed",
  properties: {
    storyId?: string;
    chapterId?: string;
    chapterName?: string;
    organizationType?: string;
    progress?: number;
  } = {}
): Promise<void> {
  await trackEvent(event, {
    category: "wizard",
    properties,
  });
}

/**
 * Track share events
 * Convenience wrapper for share-related events
 */
export async function trackShareEvent(
  event: "share_click" | "share_link_created",
  properties: {
    platform?: string;
    memorialId?: string;
    organizationId?: string;
    token?: string;
  } = {}
): Promise<void> {
  await trackEvent(event, {
    category: "virality",
    properties,
  });
}

// Type declaration for gtag
declare global {
  interface Window {
    gtag?: Gtag.Gtag;
  }
}

namespace Gtag {
  export type Gtag = (
    command: "event" | "config" | "set",
    targetIdOrEventName: string,
    params?: Record<string, unknown>
  ) => void;
}
