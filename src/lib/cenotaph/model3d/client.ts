/**
 * 3D Model Generation Module - Client-safe exports
 * Issue: #254 - AI Pipeline for 3D Cenotaph Model Generation
 *
 * This file exports only client-safe code (no Node.js dependencies).
 * Use this in React components and client-side code.
 *
 * For server-side code (API routes), import from "./index" instead.
 */

// Types (always safe - no runtime code)
export type {
  Model3DGenerationOptions,
  Model3DTaskResult,
  Model3DProvider,
  Model3DProviderType,
  Model3DGenerationStatus,
} from "./types";

// Eligibility (client-safe - no Node.js dependencies)
export { check3DModelEligibility } from "./eligibility";
export type {
  EligibilityResult,
  OrganizationForEligibility,
  StoryForEligibility,
} from "./eligibility";
