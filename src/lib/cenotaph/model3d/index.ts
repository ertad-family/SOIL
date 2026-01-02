/**
 * 3D Model Generation Module - Server-side exports
 * Issue: #254 - AI Pipeline for 3D Cenotaph Model Generation
 *
 * WARNING: This file includes Node.js dependencies (draco3dgltf).
 * Only import this in server-side code (API routes, server components).
 *
 * For client-side code (React components, hooks), use "./client" instead.
 */

// Types
export type {
  Model3DGenerationOptions,
  Model3DTaskResult,
  Model3DProvider,
  Model3DProviderType,
  Model3DGenerationStatus,
} from "./types";

// Service
export { Model3DService, getProvider } from "./service";

// Eligibility
export { check3DModelEligibility } from "./eligibility";
export type {
  EligibilityResult,
  OrganizationForEligibility,
  StoryForEligibility,
} from "./eligibility";

// Providers (for direct access if needed)
export { HitEM3DProvider } from "./providers/hitem3d";
