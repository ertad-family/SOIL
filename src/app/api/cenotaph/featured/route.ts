import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPrivacyDisplayName, type PrivacyDisplayStyle } from "@/lib/privacy";

// Industry color mapping
const INDUSTRY_COLORS: Record<string, string> = {
  Tech: "#5B7C99", // info-500
  Technology: "#5B7C99",
  "E-commerce": "#B85450", // error-500
  Media: "#C9943D", // gold-500
  Finance: "#4A7C59", // success-600
  "Real Estate": "#8B6914", // terra-600
  Healthcare: "#5B7C99",
  Other: "#64748B", // slate-500
};

function getIndustryColor(industry: string | null): string {
  if (!industry) return INDUSTRY_COLORS.Other;
  return INDUSTRY_COLORS[industry] || INDUSTRY_COLORS.Other;
}

function formatYears(foundedDate: string | null, closedDate: string | null): string {
  const founded = foundedDate ? new Date(foundedDate).getFullYear() : null;
  const closed = closedDate ? new Date(closedDate).getFullYear() : null;

  if (founded && closed) {
    return `${founded} — ${closed}`;
  }
  if (founded) {
    return `${founded} — present`;
  }
  return "Unknown";
}

interface OrganizationData {
  is_public: boolean;
  privacy_display_style: PrivacyDisplayStyle | null;
}

interface OrganizationJoinData extends OrganizationData {
  founded_date: string | null;
  closed_date: string | null;
  location_city: string | null;
  industry: string | null;
}

interface MemorialRow {
  id: string;
  organization_name: string;
  epitaph: string | null;
  main_lesson: string | null;
  cenotaph_image_url: string | null;
  organizations: OrganizationJoinData[] | OrganizationJoinData | null;
}

/**
 * GET /api/cenotaph/featured
 *
 * Fetches 6 most recent published memorials for featured stories section.
 * Returns cenotaph images for visual display.
 */
export async function GET() {
  const supabase = await createClient();

  // Fetch from organizations table for dates/location (memorials table has legacy NULL fields)
  const { data: memorials, error } = await supabase
    .from("memorials")
    .select(
      `id, organization_name, epitaph, main_lesson, cenotaph_image_url,
       organizations!organization_id (is_public, privacy_display_style, founded_date, closed_date, location_city, industry)`
    )
    .eq("status", "published")
    .eq("design_status", "completed")
    .not("cenotaph_image_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error("Error fetching featured memorials:", error);
    return NextResponse.json({ error: "Failed to fetch featured memorials" }, { status: 500 });
  }

  const stories = (memorials || []).map((m: MemorialRow) => {
    // Get privacy-aware display name
    // Handle both array and object cases from Supabase join
    const org = Array.isArray(m.organizations) ? m.organizations[0] : m.organizations;
    const isPublic = org?.is_public ?? false;
    const privacyStyle = org?.privacy_display_style ?? null;
    const displayName = getPrivacyDisplayName(isPublic, m.organization_name, privacyStyle);

    // Use organization data for dates/location (memorials table has legacy NULL fields)
    const foundedDate = org?.founded_date ?? null;
    const closedDate = org?.closed_date ?? null;
    const location = org?.location_city ?? null;
    const industry = org?.industry ?? null;

    return {
      id: m.id,
      quote: m.epitaph || m.main_lesson || "A story worth remembering.",
      companyName: displayName,
      isPrivate: !isPublic,
      years: formatYears(foundedDate, closedDate),
      location: location || "Unknown",
      industry: industry || "Other",
      industryColor: getIndustryColor(industry),
      cenotaphImageUrl: m.cenotaph_image_url,
    };
  });

  return NextResponse.json({ stories });
}
