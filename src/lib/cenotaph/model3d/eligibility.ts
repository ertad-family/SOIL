/**
 * 3D Model Eligibility Checker
 * Issue: #254 - AI Pipeline for 3D Cenotaph Model Generation
 *
 * Checks if an organization/memorial is eligible for 3D model generation.
 * Requirements are configurable via project_settings:
 * - model3d_require_verification
 * - model3d_require_coined_story
 * - model3d_require_multiple_perspectives
 * - model3d_min_stories
 * - model3d_min_coined_stories
 */

import type { VerificationStatus, StoryStatus } from "@/types/interview";
import type { SettingsMap } from "@/lib/settings";
import {
  isModel3dVerificationRequired,
  isModel3dCoinedStoryRequired,
  isModel3dMultiplePerspectivesRequired,
  getModel3dMinStories,
  getModel3dMinCoinedStories,
} from "@/lib/settings";

/**
 * Eligibility check result
 */
export interface EligibilityResult {
  /** Whether the organization is eligible for 3D generation */
  eligible: boolean;
  /** Human-readable reasons why not eligible (empty if eligible) */
  reasons: string[];
  /** Individual requirement checks */
  isVerified: boolean;
  hasCoinedStory: boolean;
  hasMultiplePerspectives: boolean;
  /** Number of stories */
  storyCount: number;
  /** Number of coined stories */
  coinedStoryCount: number;
}

/**
 * Minimal organization data needed for eligibility check
 */
export interface OrganizationForEligibility {
  verification_status: VerificationStatus;
}

/**
 * Minimal story data needed for eligibility check
 */
export interface StoryForEligibility {
  status: StoryStatus;
}

/**
 * Check if organization is eligible for 3D model generation
 *
 * Requirements are read from settings:
 * - model3d_require_verification: Organization must have verification_status === "verified"
 * - model3d_require_coined_story: Must have at least model3d_min_coined_stories coined stories
 * - model3d_require_multiple_perspectives: Must have at least model3d_min_stories stories
 */
export function check3DModelEligibility(
  organization: OrganizationForEligibility,
  stories: StoryForEligibility[],
  settings: SettingsMap
): EligibilityResult {
  const reasons: string[] = [];

  // Get settings
  const requireVerification = isModel3dVerificationRequired(settings);
  const requireCoinedStory = isModel3dCoinedStoryRequired(settings);
  const requireMultiplePerspectives = isModel3dMultiplePerspectivesRequired(settings);
  const minStories = getModel3dMinStories(settings);
  const minCoinedStories = getModel3dMinCoinedStories(settings);

  // Check 1: Organization verified (if required)
  const isVerified = organization.verification_status === "verified";
  const verificationPasses = !requireVerification || isVerified;
  if (requireVerification && !isVerified) {
    reasons.push("Organization must be verified");
  }

  // Check 2: Has coined story (if required)
  const coinedStories = stories.filter((s) => s.status === "coined");
  const coinedStoryCount = coinedStories.length;
  const hasCoinedStory = coinedStoryCount >= minCoinedStories;
  const coinedStoryPasses = !requireCoinedStory || hasCoinedStory;
  if (requireCoinedStory && !hasCoinedStory) {
    const storyWord = minCoinedStories === 1 ? "story" : "stories";
    reasons.push(`At least ${minCoinedStories} ${storyWord} must be completed and coined`);
  }

  // Check 3: Multiple perspectives (if required)
  const storyCount = stories.length;
  const hasMultiplePerspectives = storyCount >= minStories;
  const perspectivesPasses = !requireMultiplePerspectives || hasMultiplePerspectives;
  if (requireMultiplePerspectives && !hasMultiplePerspectives) {
    const storyWord = minStories === 1 ? "story is" : "stories are";
    reasons.push(`At least ${minStories} ${storyWord} required (multiple perspectives)`);
  }

  const eligible = verificationPasses && coinedStoryPasses && perspectivesPasses;

  return {
    eligible,
    reasons,
    isVerified,
    hasCoinedStory,
    hasMultiplePerspectives,
    storyCount,
    coinedStoryCount,
  };
}
