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

  // Fetch organization_ids from published memorials for cities/founders counts
  const { data: publishedMemorials } = await supabase
    .from("memorials")
    .select("organization_id")
    .eq("status", "published")
    .eq("design_status", "completed")
    .not("cenotaph_image_url", "is", null)
    .not("organization_id", "is", null);

  const publishedOrgIds = publishedMemorials?.map((m) => m.organization_id).filter(Boolean) || [];

  // Count distinct cities from organizations with published memorials
  let totalCities = 0;
  if (publishedOrgIds.length > 0) {
    const { data: orgsWithCities } = await supabase
      .from("organizations")
      .select("location_city")
      .in("id", publishedOrgIds)
      .not("location_city", "is", null);

    const uniqueCities = new Set(orgsWithCities?.map((o) => o.location_city));
    totalCities = uniqueCities.size;
  }

  // Count distinct founders from stories linked to organizations with published memorials
  let totalFounders = 0;
  if (publishedOrgIds.length > 0) {
    const { data: foundersData } = await supabase
      .from("stories")
      .select("user_id")
      .in("organization_id", publishedOrgIds)
      .in("founder_role", ["founder", "cofounder"]);

    const uniqueFounders = new Set(foundersData?.map((s) => s.user_id));
    totalFounders = uniqueFounders.size;
  }

  return NextResponse.json({
    cenotapheries: transformedCenotapheries,
    globalStats: {
      totalCenotapheries: transformedCenotapheries.length,
      totalCenotaphs,
      totalCapacity,
      totalCities,
      totalFounders,
    },
  });
}
