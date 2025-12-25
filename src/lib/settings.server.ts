/**
 * Project Settings - Server-side
 *
 * Server-only functions for settings management.
 * Uses next/headers, so can only be used in Server Components and API routes.
 */

import { createClient as createServerClient } from "@/lib/supabase/server";
import type { ProjectSetting, SettingsMap } from "./settings";
import { DEFAULT_SETTINGS } from "./settings";

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
