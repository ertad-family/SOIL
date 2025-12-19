import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPrivacyDisplayName, type PrivacyDisplayStyle } from "@/lib/privacy";

interface OrganizationData {
  is_public: boolean;
  privacy_display_style: PrivacyDisplayStyle | null;
}

interface MemorialRow {
  id: string;
  organization_name: string;
  organization_type: string | null;
  industry: string | null;
  epitaph: string | null;
  founded_date: string | null;
  closed_date: string | null;
  location: string | null;
  team_size: number | null;
  cenotaph_image_url: string | null;
  design_status: string | null;
  created_at: string;
  organization_id: string | null;
  organizations: OrganizationData[] | OrganizationData | null;
}

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
  // Note: We don't select 'slug' as it's derived from org name and would leak private names
  let query = supabase
    .from("memorials")
    .select(
      `
      id,
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
      organization_id,
      organizations!organization_id (is_public, privacy_display_style)
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

  // Transform cenotaphs to include privacy-aware display names
  const transformedCenotaphs = (cenotaphs || []).map((c: MemorialRow) => {
    // Handle both array and object cases from Supabase join
    const org = Array.isArray(c.organizations) ? c.organizations[0] : c.organizations;
    const isPublic = org?.is_public ?? false;
    const privacyStyle = org?.privacy_display_style ?? null;
    const displayName = getPrivacyDisplayName(isPublic, c.organization_name, privacyStyle);

    return {
      id: c.id,
      organizationName: displayName,
      isPrivate: !isPublic,
      organizationType: c.organization_type,
      industry: c.industry,
      epitaph: c.epitaph,
      foundedDate: c.founded_date,
      closedDate: c.closed_date,
      location: c.location,
      teamSize: c.team_size,
      cenotaphImageUrl: c.cenotaph_image_url,
      designStatus: c.design_status,
      createdAt: c.created_at,
      organizationId: c.organization_id,
    };
  });

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
    cenotaphs: transformedCenotaphs,
    count: transformedCenotaphs.length,
  });
}
