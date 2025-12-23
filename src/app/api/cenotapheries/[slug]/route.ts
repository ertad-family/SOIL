import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPrivacyDisplayName, type PrivacyDisplayStyle } from "@/lib/privacy";

interface OrganizationData {
  name: string;
  organization_type: string | null;
  industry: string | null;
  founded_date: string | null;
  closed_date: string | null;
  location_city: string | null;
  location_country: string | null;
  peak_team_size: number | null;
  is_public: boolean;
  privacy_display_style: PrivacyDisplayStyle | null;
  verification_status: string | null;
}

interface MemorialRow {
  id: string;
  epitaph: string | null;
  cenotaph_image_url: string | null;
  design_status: string | null;
  created_at: string;
  organization_id: string | null;
  respects_count: number;
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
  // Organization data (name, industry, dates, location) comes from organizations table via JOIN
  // Only epitaph is memorial-specific
  const { data: cenotaphs, error } = await supabase
    .from("memorials")
    .select(
      `
      id,
      epitaph,
      cenotaph_image_url,
      design_status,
      created_at,
      organization_id,
      respects_count,
      organizations!organization_id (
        name,
        organization_type,
        industry,
        founded_date,
        closed_date,
        location_city,
        location_country,
        peak_team_size,
        is_public,
        privacy_display_style,
        verification_status
      )
    `
    )
    .eq("cenotaphery_id", cenotaphery.id)
    .eq("status", "published")
    .eq("design_status", "completed")
    .not("cenotaph_image_url", "is", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching cenotaphs:", error);
    return NextResponse.json({ error: "Failed to fetch cenotaphs" }, { status: 500 });
  }

  // Helper to get org data from the JOIN result
  const getOrg = (c: MemorialRow): OrganizationData | null => {
    return Array.isArray(c.organizations) ? c.organizations[0] : c.organizations;
  };

  // Apply filters in JavaScript since data comes from organizations JOIN
  let filteredCenotaphs = cenotaphs || [];
  const currentYear = new Date().getFullYear();

  // Apply org_type filter
  if (orgType) {
    filteredCenotaphs = filteredCenotaphs.filter((c: MemorialRow) => {
      const org = getOrg(c);
      return org?.organization_type === orgType;
    });
  }

  // Apply industry filter (partial match, case insensitive)
  if (industry) {
    const lowerIndustry = industry.toLowerCase();
    filteredCenotaphs = filteredCenotaphs.filter((c: MemorialRow) => {
      const org = getOrg(c);
      return org?.industry?.toLowerCase().includes(lowerIndustry);
    });
  }

  // Apply age filters (years since closure)
  if (minAge) {
    const minClosedYear = currentYear - parseInt(minAge, 10);
    filteredCenotaphs = filteredCenotaphs.filter((c: MemorialRow) => {
      const org = getOrg(c);
      if (!org?.closed_date) return false;
      const closedYear = parseInt(org.closed_date.substring(0, 4), 10);
      return closedYear <= minClosedYear;
    });
  }

  if (maxAge) {
    const maxClosedYear = currentYear - parseInt(maxAge, 10);
    filteredCenotaphs = filteredCenotaphs.filter((c: MemorialRow) => {
      const org = getOrg(c);
      if (!org?.closed_date) return false;
      const closedYear = parseInt(org.closed_date.substring(0, 4), 10);
      return closedYear >= maxClosedYear;
    });
  }

  // Apply founded year range filters
  if (foundedFrom) {
    const fromYear = parseInt(foundedFrom, 10);
    filteredCenotaphs = filteredCenotaphs.filter((c: MemorialRow) => {
      const org = getOrg(c);
      if (!org?.founded_date) return false;
      const foundedYear = parseInt(org.founded_date.substring(0, 4), 10);
      return foundedYear >= fromYear;
    });
  }

  if (foundedTo) {
    const toYear = parseInt(foundedTo, 10);
    filteredCenotaphs = filteredCenotaphs.filter((c: MemorialRow) => {
      const org = getOrg(c);
      if (!org?.founded_date) return false;
      const foundedYear = parseInt(org.founded_date.substring(0, 4), 10);
      return foundedYear <= toYear;
    });
  }

  // Transform cenotaphs to API response format
  // Organization data comes from the JOIN, epitaph from memorial
  const transformedCenotaphs = filteredCenotaphs.map((c: MemorialRow) => {
    const org = getOrg(c);
    const isPublic = org?.is_public ?? false;
    const privacyStyle = org?.privacy_display_style ?? null;
    const orgName = org?.name ?? "Unknown Organization";
    const displayName = getPrivacyDisplayName(isPublic, orgName, privacyStyle);

    // Combine location from city and country
    const locationParts = [org?.location_city, org?.location_country].filter(Boolean);
    const location = locationParts.length > 0 ? locationParts.join(", ") : null;

    return {
      id: c.id,
      organizationName: displayName,
      isPrivate: !isPublic,
      organizationType: org?.organization_type ?? null,
      industry: org?.industry ?? null,
      epitaph: c.epitaph,
      foundedDate: org?.founded_date ?? null,
      closedDate: org?.closed_date ?? null,
      location,
      teamSize: org?.peak_team_size ?? null,
      cenotaphImageUrl: c.cenotaph_image_url,
      designStatus: c.design_status,
      createdAt: c.created_at,
      organizationId: c.organization_id,
    };
  });

  // Calculate stats from all cenotaphs (before filtering)
  const allCenotaphsData = cenotaphs || [];
  const uniqueIndustries = new Set<string>();
  let totalYearsOfHistory = 0;
  let totalRespects = 0;

  allCenotaphsData.forEach((c: MemorialRow) => {
    const org = getOrg(c);
    if (org?.industry) {
      uniqueIndustries.add(org.industry);
    }
    // Calculate years of operation
    if (org?.founded_date && org?.closed_date) {
      const foundedYear = parseInt(org.founded_date.substring(0, 4), 10);
      const closedYear = parseInt(org.closed_date.substring(0, 4), 10);
      if (!isNaN(foundedYear) && !isNaN(closedYear)) {
        totalYearsOfHistory += Math.max(0, closedYear - foundedYear);
      }
    }
    totalRespects += c.respects_count || 0;
  });

  // Get top 3 most honored residents (by respects_count) - only from PUBLIC and VERIFIED organizations
  const topHonored = [...allCenotaphsData]
    .filter((c: MemorialRow) => {
      const org = getOrg(c);
      return org?.is_public === true && org?.verification_status === "verified";
    })
    .sort((a, b) => (b.respects_count || 0) - (a.respects_count || 0))
    .slice(0, 3)
    .map((c: MemorialRow) => {
      const org = getOrg(c);
      const orgName = org?.name ?? "Unknown Organization";

      return {
        id: c.id,
        organizationId: c.organization_id,
        organizationName: orgName,
        isPrivate: false,
        respectsCount: c.respects_count || 0,
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
    stats: {
      totalCenotaphs: allCenotaphsData.length,
      spotsRemaining: Math.max(0, cenotaphery.capacity - allCenotaphsData.length),
      industriesCount: uniqueIndustries.size,
      totalYearsOfHistory,
      totalRespects,
    },
    topHonored,
  });
}
