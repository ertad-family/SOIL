/**
 * Cenotaphery Assignment Service
 *
 * Assigns memorials to cenotapheries based on geographic location.
 * Implements prestige hierarchy: the-first → country → region → city → global
 *
 * Issues: #222 (auto-spawn) + #107 (location-based)
 */

import { createClient as createServiceClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

// Service role client for spawning cenotapheries (bypasses RLS)
const getServiceClient = () =>
  createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

// Default coordinates (USA center) when location is unknown
const DEFAULT_LAT = 39.8283;
const DEFAULT_LNG = -98.5795;

// Capacity limits
const THE_FIRST_CAPACITY = 100;
const STANDARD_CAPACITY = 512;

interface OrganizationLocation {
  country: string | null;
  region: string | null;
  city: string | null;
  lat: number | null;
  lng: number | null;
}

interface Cenotaphery {
  id: string;
  slug: string;
  name: string;
  location: string;
  level: string;
  capacity: number;
  status: string;
}

type CenotapheryLevel = "global" | "country" | "region" | "city";

/**
 * Generate a URL-safe slug from a location name
 */
function generateSlug(name: string, suffix?: number): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return suffix ? `${base}-${suffix}` : base;
}

/**
 * Generate display name for a cenotaphery based on level
 */
function generateCenotapheryName(level: CenotapheryLevel, location: string): string {
  switch (level) {
    case "city":
      return `${location} Cenotaphery`;
    case "region":
      return `${location} Regional Cenotaphery`;
    case "country":
      return `Federal Cenotaphery of ${location}`;
    case "global":
      return `Global Cenotaphery`;
    default:
      return `${location} Cenotaphery`;
  }
}

/**
 * Count memorials in a cenotaphery
 */
async function countMemorialsInCenotaphery(
  supabase: SupabaseClient,
  cenotapheryId: string
): Promise<number> {
  const { count, error } = await supabase
    .from("memorials")
    .select("*", { count: "exact", head: true })
    .eq("cenotaphery_id", cenotapheryId);

  if (error) {
    console.error("Error counting memorials:", error);
    return 0;
  }

  return count ?? 0;
}

/**
 * Check if a cenotaphery has capacity and is available
 */
async function checkCenotapheryAvailability(
  supabase: SupabaseClient,
  cenotaphery: Cenotaphery
): Promise<boolean> {
  if (cenotaphery.status !== "active") {
    return false;
  }

  const count = await countMemorialsInCenotaphery(supabase, cenotaphery.id);
  return count < cenotaphery.capacity;
}

/**
 * Find an available cenotaphery at a specific level and location
 */
async function findCenotapheryAtLevel(
  supabase: SupabaseClient,
  level: CenotapheryLevel,
  location: string,
  excludeSlug?: string
): Promise<Cenotaphery | null> {
  let query = supabase
    .from("cenotapheries")
    .select("id, slug, name, location, level, capacity, status")
    .eq("level", level)
    .eq("location", location)
    .eq("status", "active");

  if (excludeSlug) {
    query = query.neq("slug", excludeSlug);
  }

  const { data, error } = await query.limit(10);

  if (error || !data || data.length === 0) {
    return null;
  }

  // Check each cenotaphery for available capacity
  for (const cenotaphery of data) {
    const isAvailable = await checkCenotapheryAvailability(supabase, cenotaphery);
    if (isAvailable) {
      return cenotaphery;
    }
  }

  return null;
}

/**
 * Spawn a new cenotaphery at the specified level
 */
async function spawnCenotaphery(
  level: CenotapheryLevel,
  location: string,
  lat: number,
  lng: number
): Promise<Cenotaphery | null> {
  const serviceClient = getServiceClient();

  // Generate unique slug
  const baseSlug = generateSlug(location);
  let slug = baseSlug;
  let suffix = 1;

  // Check for slug uniqueness and find next available
  while (true) {
    const { data: existing } = await serviceClient
      .from("cenotapheries")
      .select("id")
      .eq("slug", slug)
      .single();

    if (!existing) break;

    suffix++;
    slug = `${baseSlug}-${suffix}`;
  }

  // Generate name
  let name = generateCenotapheryName(level, location);
  if (suffix > 1) {
    name = `${name} ${toRomanNumeral(suffix)}`;
  }

  // Insert new cenotaphery
  const { data, error } = await serviceClient
    .from("cenotapheries")
    .insert({
      slug,
      name,
      description: `Auto-spawned ${level}-level cenotaphery for ${location}`,
      location,
      level,
      capacity: STANDARD_CAPACITY,
      status: "active",
      style: "modern",
      lat,
      lng,
    })
    .select()
    .single();

  if (error) {
    console.error("Error spawning cenotaphery:", error);
    return null;
  }

  console.log(`Spawned new cenotaphery: ${name} (${slug}) at level ${level}`);
  return data;
}

/**
 * Convert number to Roman numeral (for cenotaphery naming)
 */
function toRomanNumeral(num: number): string {
  const romanNumerals: [number, string][] = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];

  let result = "";
  for (const [value, numeral] of romanNumerals) {
    while (num >= value) {
      result += numeral;
      num -= value;
    }
  }
  return result;
}

/**
 * Main assignment function - assigns a memorial to a cenotaphery
 *
 * Algorithm (prestige hierarchy - larger = more prestigious):
 * 1. "the-first" (founding circle) - first 100 memorials
 * 2. Country level
 * 3. Region level
 * 4. City level
 * 5. Global fallback
 *
 * If no cenotaphery exists at a level, spawn one.
 */
export async function assignCenotaphery(
  supabase: SupabaseClient,
  orgLocation: OrganizationLocation
): Promise<string> {
  const { country, region, city, lat, lng } = orgLocation;

  // Coordinates for spawning (use org coords or defaults)
  const spawnLat = lat ?? DEFAULT_LAT;
  const spawnLng = lng ?? DEFAULT_LNG;

  // ==========================================================================
  // 1. PRIORITY: Check "the-first" (special founding circle)
  // ==========================================================================
  const { data: theFirst } = await supabase
    .from("cenotapheries")
    .select("id, slug, name, location, level, capacity, status")
    .eq("slug", "the-first")
    .single();

  if (theFirst) {
    const count = await countMemorialsInCenotaphery(supabase, theFirst.id);
    if (count < THE_FIRST_CAPACITY) {
      console.log(`Assigned to "the-first" (${count + 1}/${THE_FIRST_CAPACITY})`);
      return theFirst.id;
    }
  }

  // ==========================================================================
  // 2. Location-based assignment (from LARGER to SMALLER - prestige hierarchy)
  // ==========================================================================

  // 2a. Try country-level match
  if (country) {
    const countryCenotaphery = await findCenotapheryAtLevel(supabase, "country", country);
    if (countryCenotaphery) {
      console.log(`Assigned to country-level: ${countryCenotaphery.name}`);
      return countryCenotaphery.id;
    }
  }

  // 2b. Try region-level match
  if (region) {
    const regionCenotaphery = await findCenotapheryAtLevel(supabase, "region", region);
    if (regionCenotaphery) {
      console.log(`Assigned to region-level: ${regionCenotaphery.name}`);
      return regionCenotaphery.id;
    }
  }

  // 2c. Try city-level match
  if (city) {
    const cityCenotaphery = await findCenotapheryAtLevel(supabase, "city", city);
    if (cityCenotaphery) {
      console.log(`Assigned to city-level: ${cityCenotaphery.name}`);
      return cityCenotaphery.id;
    }
  }

  // 2d. Try global-level match (excluding "the-first")
  const globalCenotaphery = await findCenotapheryAtLevel(supabase, "global", "all", "the-first");
  if (globalCenotaphery) {
    console.log(`Assigned to global: ${globalCenotaphery.name}`);
    return globalCenotaphery.id;
  }

  // ==========================================================================
  // 3. No available cenotaphery → spawn new one at HIGHEST available level
  // ==========================================================================

  // Spawn at country level first (most prestigious after the-first)
  if (country) {
    const newCenotaphery = await spawnCenotaphery("country", country, spawnLat, spawnLng);
    if (newCenotaphery) {
      return newCenotaphery.id;
    }
  }

  // Fall back to region level
  if (region) {
    const newCenotaphery = await spawnCenotaphery("region", region, spawnLat, spawnLng);
    if (newCenotaphery) {
      return newCenotaphery.id;
    }
  }

  // Fall back to city level
  if (city) {
    const newCenotaphery = await spawnCenotaphery("city", city, spawnLat, spawnLng);
    if (newCenotaphery) {
      return newCenotaphery.id;
    }
  }

  // Last resort: spawn new global cenotaphery
  const newGlobal = await spawnCenotaphery("global", "all", DEFAULT_LAT, DEFAULT_LNG);
  if (newGlobal) {
    return newGlobal.id;
  }

  // This should never happen, but if it does, return the-first as fallback
  console.error("Failed to assign or spawn cenotaphery, falling back to the-first");
  return theFirst?.id ?? "";
}
