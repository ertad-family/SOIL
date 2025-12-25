"use client";

/**
 * React hook for accessing project settings on the client
 */

import { useState, useEffect } from "react";
import { fetchSettings, type SettingsMap } from "@/lib/settings";

interface UseSettingsResult {
  settings: SettingsMap;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Simple in-memory cache to avoid refetching on every component mount
let settingsCache: SettingsMap | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60000; // 1 minute

export function useSettings(): UseSettingsResult {
  const [settings, setSettings] = useState<SettingsMap>(settingsCache || {});
  const [loading, setLoading] = useState(!settingsCache);
  const [error, setError] = useState<Error | null>(null);

  const loadSettings = async () => {
    // Check cache freshness
    const now = Date.now();
    if (settingsCache && now - cacheTimestamp < CACHE_TTL) {
      setSettings(settingsCache);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await fetchSettings();
      settingsCache = data;
      cacheTimestamp = now;
      setSettings(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load settings"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const refetch = async () => {
    // Force refetch by invalidating cache
    settingsCache = null;
    cacheTimestamp = 0;
    await loadSettings();
  };

  return { settings, loading, error, refetch };
}

// Invalidate cache (useful after admin updates settings)
export function invalidateSettingsCache() {
  settingsCache = null;
  cacheTimestamp = 0;
}
