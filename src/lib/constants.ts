/**
 * Centralized Constants
 *
 * This file consolidates scattered constants from across the codebase
 * for better maintainability and single source of truth.
 */

import type { FounderRole } from "@/types/interview";

// =============================================================================
// AUTHOR ROLE MAPPING
// =============================================================================
// Maps founder role (from interview) to author role (for database stories table)

export type AuthorRole = "founder" | "co_founder" | "executive" | "other";

export const AUTHOR_ROLE_MAP: Record<FounderRole, AuthorRole> = {
  founder: "founder",
  cofounder: "co_founder",
  ceo_non_founder: "executive",
  other: "other",
};

// =============================================================================
// INDUSTRY COLORS
// =============================================================================
// Color palette for industry visualization in cenotaphery

export const INDUSTRY_COLORS: Record<string, string> = {
  Tech: "#5B7C99", // info-500
  Technology: "#5B7C99",
  "E-commerce": "#B85450", // error-500
  Media: "#C9943D", // gold-500
  Finance: "#4A7C59", // success-600
  "Real Estate": "#8B6914", // terra-600
  Healthcare: "#5B7C99",
  Other: "#64748B", // slate-500
};

export function getIndustryColor(industry: string | null): string {
  if (!industry) return INDUSTRY_COLORS.Other;
  return INDUSTRY_COLORS[industry] || INDUSTRY_COLORS.Other;
}

// =============================================================================
// RE-EXPORTS FROM ORGANIZATION CONSTANTS
// =============================================================================
// Re-export commonly used label maps for convenience

export { RELATIONSHIP_LABELS, DOCUMENT_TYPE_LABELS } from "@/components/organization/constants";
