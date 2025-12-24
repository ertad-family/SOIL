/**
 * Project Settings Service
 *
 * Database-backed configuration system for runtime settings.
 * Settings are stored in project_settings table with JSONB values.
 */

import { createClient as createServerClient } from "@/lib/supabase/server";
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
const DEFAULT_SETTINGS: SettingsMap = {
  require_verification_for_cenotaph: false,
  enable_ai_cenotaph_generation: true,
  the_first_capacity: 100,
  standard_cenotaphery_capacity: 512,
  maintenance_mode: false,
};

// =============================================================================
// SERVER-SIDE FUNCTIONS
// =============================================================================

/**
 * Get a single setting value (server-side)
 */
export async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("project_settings")
      .select("value")
      .eq("key", key)
      .single();

    if (error || !data) {
      return defaultValue;
    }

    return data.value as T;
  } catch {
    return defaultValue;
  }
}

/**
 * Get all settings (server-side)
 */
export async function getAllSettings(): Promise<ProjectSetting[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("project_settings")
      .select("*")
      .order("category")
      .order("key");

    if (error || !data) {
      return [];
    }

    return data;
  } catch {
    return [];
  }
}

/**
 * Get settings as a key-value map (server-side)
 */
export async function getSettingsMap(): Promise<SettingsMap> {
  const settings = await getAllSettings();
  const map: SettingsMap = { ...DEFAULT_SETTINGS };

  for (const setting of settings) {
    map[setting.key] = setting.value;
  }

  return map;
}

/**
 * Update a setting value (server-side, admin only)
 */
export async function setSetting(key: string, value: unknown): Promise<boolean> {
  try {
    const supabase = await createServerClient();

    const { error } = await supabase.from("project_settings").update({ value }).eq("key", key);

    return !error;
  } catch {
    return false;
  }
}

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
