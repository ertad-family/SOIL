import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

interface MemorialRow {
  id: string;
  organization_name: string;
  epitaph: string | null;
  main_lesson: string | null;
  industry: string | null;
  location: string | null;
  founded_date: string | null;
  closed_date: string | null;
}

/**
 * GET /api/cenotaph/featured
 *
 * Fetches 3 most recent published memorials for featured stories section.
 */
export async function GET() {
  const supabase = await createClient();

  const { data: memorials, error } = await supabase
    .from("memorials")
    .select(
      "id, organization_name, epitaph, main_lesson, industry, location, founded_date, closed_date"
    )
    .eq("status", "published")
    .eq("design_status", "completed")
    .not("cenotaph_image_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error fetching featured memorials:", error);
    return NextResponse.json({ error: "Failed to fetch featured memorials" }, { status: 500 });
  }

  const stories = (memorials || []).map((m: MemorialRow) => ({
    id: m.id,
    quote: m.epitaph || m.main_lesson || "A story worth remembering.",
    companyName: m.organization_name,
    years: formatYears(m.founded_date, m.closed_date),
    location: m.location?.split(",")[0] || "Unknown",
    industry: m.industry || "Other",
    industryColor: getIndustryColor(m.industry),
    respects: 0, // Could be a counter in the future
  }));

  return NextResponse.json({ stories });
}
