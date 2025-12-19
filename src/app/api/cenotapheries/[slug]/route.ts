import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

/**
 * GET /api/cenotapheries/[slug]
 *
 * Fetches a specific cenotaphery with its cenotaphs.
 * Supports filtering by org_type, industry, age (years since closure), and founding years.
 *
 * Query params:
 * - org_type: filter by organization type
 * - industry: filter by industry (partial match)
 * - min_age / max_age: years since closure
 * - founded_from / founded_to: founding year range
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const supabase = await createClient();
  const { slug } = await params;
  const { searchParams } = new URL(request.url);

  // Parse filter params
  const orgType = searchParams.get("org_type");
  const industry = searchParams.get("industry");
  const minAge = searchParams.get("min_age");
  const maxAge = searchParams.get("max_age");
  const foundedFrom = searchParams.get("founded_from");
  const foundedTo = searchParams.get("founded_to");

  // Get the cenotaphery by slug
  const { data: cenotaphery, error: cenotapheryError } = await supabase
    .from("cenotapheries")
    .select("id, slug, name, description, location, capacity, status, style")
    .eq("slug", slug)
    .single();

  if (cenotapheryError || !cenotaphery) {
    return NextResponse.json({ error: "Cenotaphery not found" }, { status: 404 });
  }

  // Build query for memorials belonging to this cenotaphery
  let query = supabase
    .from("memorials")
    .select(
      `
      id,
      slug,
      organization_name,
      organization_type,
      industry,
      epitaph,
      founded_date,
      closed_date,
      location,
      team_size,
      cenotaph_image_url,
      design_status,
      created_at,
      organization_id
    `
    )
    .eq("cenotaphery_id", cenotaphery.id)
    .eq("status", "published")
    .eq("design_status", "completed")
    .not("cenotaph_image_url", "is", null)
    .order("created_at", { ascending: false });

  // Apply org_type filter
  if (orgType) {
    query = query.eq("organization_type", orgType);
  }

  // Apply industry filter (partial match, case insensitive)
  if (industry) {
    query = query.ilike("industry", `%${industry}%`);
  }

  // Apply age filters (years since closure)
  const currentYear = new Date().getFullYear();

  if (minAge) {
    const minClosedYear = currentYear - parseInt(minAge, 10);
    query = query.lte("closed_date", `${minClosedYear}-12-31`);
  }

  if (maxAge) {
    const maxClosedYear = currentYear - parseInt(maxAge, 10);
    query = query.gte("closed_date", `${maxClosedYear}-01-01`);
  }

  // Apply founded year range filters
  if (foundedFrom) {
    query = query.gte("founded_date", `${foundedFrom}-01-01`);
  }

  if (foundedTo) {
    query = query.lte("founded_date", `${foundedTo}-12-31`);
  }

  const { data: cenotaphs, error } = await query;

  if (error) {
    console.error("Error fetching cenotaphs:", error);
    return NextResponse.json({ error: "Failed to fetch cenotaphs" }, { status: 500 });
  }

  return NextResponse.json({
    cenotaphery: {
      slug: cenotaphery.slug,
      name: cenotaphery.name,
      description: cenotaphery.description,
      location: cenotaphery.location,
      capacity: cenotaphery.capacity,
      status: cenotaphery.status,
      style: cenotaphery.style,
    },
    cenotaphs: cenotaphs || [],
    count: cenotaphs?.length || 0,
  });
}
