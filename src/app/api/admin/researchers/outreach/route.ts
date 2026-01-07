/**
 * Admin API for researcher outreach listing
 * Issue #279: Researcher Outreach Tracking System
 *
 * GET /api/admin/researchers/outreach - List researchers with outreach data
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface ResearcherOutreach {
  id: string;
  name: string;
  institution: string;
  discipline: string;
  email: string | null;
  website_url: string | null;
  tier: number;
  mortality_activity_score: number | null;
  openalex_cited_by_count: number;
  outreach_status: string;
  outreach_notes: string | null;
  last_contacted_at: string | null;
  follow_up_date: string | null;
  death_year: number | null;
}

interface OutreachListResponse {
  researchers: ResearcherOutreach[];
  total: number;
  statusCounts: Record<string, number>;
}

/**
 * Check if the current user is an admin
 */
async function isAdmin(supabase: Awaited<ReturnType<typeof createClient>>): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "admin";
}

/**
 * GET /api/admin/researchers/outreach
 * List researchers with outreach data, sorted by priority
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<OutreachListResponse | { error: string }>> {
  try {
    const supabase = await createClient();

    // Check admin access
    if (!(await isAdmin(supabase))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const needsFollowUp = searchParams.get("needsFollowUp") === "true";

    // Build query
    let query = supabase
      .from("researchers")
      .select(
        "id, name, institution, discipline, email, website_url, tier, mortality_activity_score, openalex_cited_by_count, outreach_status, outreach_notes, last_contacted_at, follow_up_date, death_year"
      )
      .is("death_year", null) // Exclude deceased
      .order("mortality_activity_score", { ascending: false, nullsFirst: false })
      .order("openalex_cited_by_count", { ascending: false, nullsFirst: false });

    // Filter by status
    if (status && status !== "all") {
      query = query.eq("outreach_status", status);
    }

    // Filter by search term
    if (search) {
      query = query.or(`name.ilike.%${search}%,institution.ilike.%${search}%`);
    }

    // Filter for researchers needing follow-up (past follow_up_date)
    if (needsFollowUp) {
      const today = new Date().toISOString().split("T")[0];
      query = query.lte("follow_up_date", today);
    }

    const { data: researchers, error } = await query;

    if (error) {
      console.error("Error fetching researchers:", error);
      return NextResponse.json({ error: "Failed to fetch researchers" }, { status: 500 });
    }

    // Get status counts
    const { data: allResearchers } = await supabase
      .from("researchers")
      .select("outreach_status")
      .is("death_year", null);

    const statusCounts: Record<string, number> = {
      not_contacted: 0,
      contacted: 0,
      responded: 0,
      interested: 0,
      declined: 0,
      joined: 0,
    };

    allResearchers?.forEach((r) => {
      const status = r.outreach_status || "not_contacted";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    return NextResponse.json({
      researchers: researchers || [],
      total: researchers?.length || 0,
      statusCounts,
    });
  } catch (err) {
    console.error("Outreach list error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
