import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Default coordinates (USA center) for cenotapheries without location
const DEFAULT_LAT = 39.8283;
const DEFAULT_LNG = -98.5795;

interface CenotapheryRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  location: string;
  capacity: number;
  status: string;
  style: string;
  lat: number | null;
  lng: number | null;
  level: string | null;
}

interface MemorialCountRow {
  cenotaphery_id: string;
  count: number;
}

/**
 * GET /api/cenotapheries
 *
 * Fetches all cenotapheries with aggregated statistics.
 * Returns cenotaph counts and fill percentages calculated from memorials table.
 */
export async function GET() {
  const supabase = await createClient();

  // Fetch all cenotapheries
  const { data: cenotapheries, error: cenotapheriesError } = await supabase
    .from("cenotapheries")
    .select("id, slug, name, description, location, capacity, status, style, lat, lng, level")
    .order("name", { ascending: true });

  if (cenotapheriesError) {
    console.error("Error fetching cenotapheries:", cenotapheriesError);
    return NextResponse.json({ error: "Failed to fetch cenotapheries" }, { status: 500 });
  }

  if (!cenotapheries || cenotapheries.length === 0) {
    return NextResponse.json({
      cenotapheries: [],
      globalStats: {
        totalCenotapheries: 0,
        totalCenotaphs: 0,
        totalCapacity: 0,
        totalCountries: 0,
        totalCities: 0,
        totalFounders: 0,
      },
    });
  }

  // Fetch memorial counts per cenotaphery (only published with completed designs)
  const cenotapheryIds = cenotapheries.map((c: CenotapheryRow) => c.id);

  // Use raw SQL via RPC or multiple queries - Supabase doesn't support GROUP BY directly
  // So we'll fetch counts separately for each cenotaphery
  const countPromises = cenotapheryIds.map(async (cenotapheryId: string) => {
    const { count, error } = await supabase
      .from("memorials")
      .select("*", { count: "exact", head: true })
      .eq("cenotaphery_id", cenotapheryId)
      .eq("status", "published")
      .eq("design_status", "completed")
      .not("cenotaph_image_url", "is", null);

    if (error) {
      console.error(`Error counting memorials for ${cenotapheryId}:`, error);
      return { cenotaphery_id: cenotapheryId, count: 0 };
    }

    return { cenotaphery_id: cenotapheryId, count: count || 0 };
  });

  const memorialCounts = await Promise.all(countPromises);

  // Create a map for quick lookup
  const countMap = new Map<string, number>(
    memorialCounts.map((mc: MemorialCountRow) => [mc.cenotaphery_id, mc.count])
  );

  // Transform cenotapheries with statistics
  const transformedCenotapheries = cenotapheries.map((c: CenotapheryRow) => {
    const cenotaphCount = countMap.get(c.id) || 0;
    const fillPercentage = Math.round((cenotaphCount / c.capacity) * 100);

    // Determine status based on fill
    let computedStatus = c.status;
    if (cenotaphCount >= c.capacity && c.status === "active") {
      computedStatus = "full";
    }

    return {
      id: c.slug, // Use slug as ID for frontend compatibility
      slug: c.slug,
      name: c.name,
      description: c.description,
      level: (c.level || "country") as "country" | "region" | "city",
      coordinates: {
        lat: c.lat ?? DEFAULT_LAT,
        lng: c.lng ?? DEFAULT_LNG,
      },
      statistics: {
        cenotaphCount,
        capacity: c.capacity,
        fillPercentage,
      },
      status: computedStatus as "active" | "full" | "coming_soon",
      style: c.style as
        | "modern"
        | "mediterranean"
        | "nordic"
        | "asian"
        | "middle_eastern"
        | "african",
      location: c.location,
      // Default recentActivity (could be calculated from created_at in future)
      recentActivity: {
        newCenotaphsThisWeek: 0,
        totalVisitsThisWeek: 0,
      },
    };
  });

  // Calculate global stats
  const totalCenotaphs = transformedCenotapheries.reduce(
    (sum, c) => sum + c.statistics.cenotaphCount,
    0
  );
  const totalCapacity = transformedCenotapheries.reduce((sum, c) => sum + c.statistics.capacity, 0);

  // Count distinct countries from ALL organizations
  const { data: allOrgsCountries } = await supabase
    .from("organizations")
    .select("location_country")
    .not("location_country", "is", null);

  const uniqueCountries = new Set(allOrgsCountries?.map((o) => o.location_country));
  const totalCountries = uniqueCountries.size;

  // Count distinct cities from ALL organizations
  const { data: allOrgsCities } = await supabase
    .from("organizations")
    .select("location_city")
    .not("location_city", "is", null);

  const uniqueCities = new Set(allOrgsCities?.map((o) => o.location_city));
  const totalCities = uniqueCities.size;

  // Count distinct founders from ALL stories
  const { data: allFounders } = await supabase
    .from("stories")
    .select("user_id")
    .in("founder_role", ["founder", "cofounder"]);

  const uniqueFounders = new Set(allFounders?.map((s) => s.user_id));
  const totalFounders = uniqueFounders.size;

  return NextResponse.json({
    cenotapheries: transformedCenotapheries,
    globalStats: {
      totalCenotapheries: transformedCenotapheries.length,
      totalCenotaphs,
      totalCapacity,
      totalCountries,
      totalCities,
      totalFounders,
    },
  });
}
