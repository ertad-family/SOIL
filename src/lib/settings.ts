/**
 * Project Settings - Client-side
 *
 * Database-backed configuration system for runtime settings.
 * This file contains only client-safe code (no next/headers).
 *
 * For server-side functions, use settings.server.ts
 */

import { createClient as createBrowserClient } from "@/lib/supabase/client";

// =============================================================================
// TYPES
// =============================================================================

export interface ProjectSetting {
  key: string;
  value: unknown;
  description: string | null;
  category: string;
  updated_at: string;
  updated_by: string | null;
}

export interface SettingsMap {
  [key: string]: unknown;
}

// Default values for known settings (fallback if DB unavailable)
export const DEFAULT_SETTINGS: SettingsMap = {
  require_verification_for_cenotaph: false,
  require_coined_story_for_cenotaph: false,
  require_verification_for_public_profile: false,
  the_first_capacity: 100,
  standard_cenotaphery_capacity: 512,
  maintenance_mode: false,
  // 3D Model Generation settings (Issue #254)
  model3d_enabled: true,
  model3d_provider: "hitem3d",
  model3d_resolution: 1024,
  model3d_polygon_count: 100000, // Keep low for Supabase 5MB limit
  model3d_hitem3d_model_version: "hitem3dv1.5",
  // 3D Model Eligibility settings
  model3d_require_verification: true,
  model3d_require_coined_story: true,
  model3d_require_multiple_perspectives: true,
  model3d_min_stories: 2,
  model3d_min_coined_stories: 1,
};

// =============================================================================
// CLIENT-SIDE FUNCTIONS
// =============================================================================

/**
 * Fetch all settings from API (client-side)
 */
export async function fetchSettings(): Promise<SettingsMap> {
  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase.from("project_settings").select("key, value");

    if (error || !data) {
      return { ...DEFAULT_SETTINGS };
    }

    const map: SettingsMap = { ...DEFAULT_SETTINGS };
    for (const setting of data) {
      map[setting.key] = setting.value;
    }

    return map;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * Get a specific setting value with type safety (client-side)
 */
export function getSettingValue<T>(settings: SettingsMap, key: string, defaultValue: T): T {
  if (key in settings) {
    return settings[key] as T;
  }
  return defaultValue;
}

// =============================================================================
// TYPED GETTERS (convenience functions)
// =============================================================================

export function isVerificationRequired(settings: SettingsMap): boolean {
  return getSettingValue(settings, "require_verification_for_cenotaph", false);
}

export function isCoinedStoryRequired(settings: SettingsMap): boolean {
  return getSettingValue(settings, "require_coined_story_for_cenotaph", false);
}

export function isVerificationRequiredForPublicProfile(settings: SettingsMap): boolean {
  return getSettingValue(settings, "require_verification_for_public_profile", false);
}

export function isMaintenanceMode(settings: SettingsMap): boolean {
  return getSettingValue(settings, "maintenance_mode", false);
}

export function getTheFirstCapacity(settings: SettingsMap): number {
  return getSettingValue(settings, "the_first_capacity", 100);
}

export function getStandardCapacity(settings: SettingsMap): number {
  return getSettingValue(settings, "standard_cenotaphery_capacity", 512);
}

// =============================================================================
// 3D MODEL GENERATION SETTINGS (Issue #254)
// =============================================================================

/** Check if 3D model generation is enabled */
export function isModel3dEnabled(settings: SettingsMap): boolean {
  return getSettingValue(settings, "model3d_enabled", true);
}

/** Get the active 3D model provider (e.g., "hitem3d") */
export function getModel3dProvider(settings: SettingsMap): string {
  return getSettingValue(settings, "model3d_provider", "hitem3d");
}

/** Get 3D model resolution (512, 1024, 1536) */
export function getModel3dResolution(settings: SettingsMap): number {
  return getSettingValue(settings, "model3d_resolution", 1024);
}

/** Get target polygon count (100000-2000000) */
export function getModel3dPolygonCount(settings: SettingsMap): number {
  return getSettingValue(settings, "model3d_polygon_count", 500000);
}

/** Get HitEM 3D model version */
export function getModel3dHitem3dVersion(settings: SettingsMap): string {
  return getSettingValue(settings, "model3d_hitem3d_model_version", "hitem3dv2.0");
}

// =============================================================================
// 3D MODEL ELIGIBILITY SETTINGS (Issue #254)
// =============================================================================

/** Check if verification is required for 3D model generation */
export function isModel3dVerificationRequired(settings: SettingsMap): boolean {
  return getSettingValue(settings, "model3d_require_verification", true);
}

/** Check if coined story is required for 3D model generation */
export function isModel3dCoinedStoryRequired(settings: SettingsMap): boolean {
  return getSettingValue(settings, "model3d_require_coined_story", true);
}

/** Check if multiple perspectives required for 3D model generation */
export function isModel3dMultiplePerspectivesRequired(settings: SettingsMap): boolean {
  return getSettingValue(settings, "model3d_require_multiple_perspectives", true);
}

/** Get minimum number of stories for 3D model generation */
export function getModel3dMinStories(settings: SettingsMap): number {
  return getSettingValue(settings, "model3d_min_stories", 2);
}

/** Get minimum number of coined stories for 3D model generation */
export function getModel3dMinCoinedStories(settings: SettingsMap): number {
  return getSettingValue(settings, "model3d_min_coined_stories", 1);
}
