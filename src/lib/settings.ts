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
  enable_ai_cenotaph_generation: true,
  the_first_capacity: 100,
  standard_cenotaphery_capacity: 512,
  maintenance_mode: false,
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

export function isAiGenerationEnabled(settings: SettingsMap): boolean {
  return getSettingValue(settings, "enable_ai_cenotaph_generation", true);
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
