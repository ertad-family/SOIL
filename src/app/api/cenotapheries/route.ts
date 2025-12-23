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

  // Calculate date for "this week" (last 7 days)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const oneWeekAgoISO = oneWeekAgo.toISOString();

  // Fetch new cenotaphs this week per cenotaphery
  const newCenotaphsPromises = cenotapheryIds.map(async (cenotapheryId: string) => {
    const { count, error } = await supabase
      .from("memorials")
      .select("*", { count: "exact", head: true })
      .eq("cenotaphery_id", cenotapheryId)
      .eq("status", "published")
      .eq("design_status", "completed")
      .not("cenotaph_image_url", "is", null)
      .gte("created_at", oneWeekAgoISO);

    if (error) {
      console.error(`Error counting new memorials for ${cenotapheryId}:`, error);
      return { cenotaphery_id: cenotapheryId, count: 0 };
    }

    return { cenotaphery_id: cenotapheryId, count: count || 0 };
  });

  const newCenotaphsCounts = await Promise.all(newCenotaphsPromises);
  const newCenotaphsMap = new Map<string, number>(
    newCenotaphsCounts.map((mc: MemorialCountRow) => [mc.cenotaphery_id, mc.count])
  );

  // Fetch visits this week via RPC function (bypasses RLS)
  const { data: visitCounts, error: visitsError } = await supabase.rpc(
    "get_cenotaphery_visits_this_week"
  );

  if (visitsError) {
    console.error("Error fetching visit counts:", visitsError);
  }

  // Create visits map from RPC results
  const visitsMap = new Map<string, number>();
  if (visitCounts) {
    for (const row of visitCounts as { cenotaphery_slug: string; visit_count: number }[]) {
      visitsMap.set(row.cenotaphery_slug, row.visit_count);
    }
  }

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
      // Recent activity calculated from memorials and analytics_events
      recentActivity: {
        newCenotaphsThisWeek: newCenotaphsMap.get(c.id) || 0,
        totalVisitsThisWeek: visitsMap.get(c.slug) || 0,
      },
    };
  });

  // Calculate global stats
  const totalCenotaphs = transformedCenotapheries.reduce(
    (sum, c) => sum + c.statistics.cenotaphCount,
    0
  );
  const totalCapacity = transformedCenotapheries.reduce((sum, c) => sum + c.statistics.capacity, 0);

  // Get global stats via RPC function (bypasses RLS)
  const { data: globalStatsData } = await supabase.rpc("get_global_stats");
  const stats = globalStatsData?.[0] ?? {
    total_countries: 0,
    total_cities: 0,
    total_founders: 0,
    total_organizations: 0,
  };

  return NextResponse.json({
    cenotapheries: transformedCenotapheries,
    globalStats: {
      totalCenotapheries: transformedCenotapheries.length,
      totalCenotaphs,
      totalCapacity,
      totalCountries: Number(stats.total_countries),
      totalCities: Number(stats.total_cities),
      totalFounders: Number(stats.total_founders),
    },
  });
}
