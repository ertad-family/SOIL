/**
 * API endpoint for cenotaphery visit statistics
 * GET /api/admin/cenotapheries
 *
 * Returns top visited cenotapheries for the dashboard
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface CenotapheryStats {
  slug: string;
  name: string;
  visits: number;
}

interface CenotapheriesResponse {
  success: boolean;
  data?: {
    cenotapheries: CenotapheryStats[];
    totalVisits: number;
    period: string;
  };
  error?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<CenotapheriesResponse>> {
  try {
    const supabase = await createClient();

    // Verify admin access
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    // Get period from query params (default 30 days)
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get("days") || "30", 10);
    const limit = parseInt(searchParams.get("limit") || "5", 10);

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    // Get cenotaphery_view events with properties
    const { data: eventData } = await supabase
      .from("analytics_events")
      .select("properties")
      .eq("event_name", "cenotaphery_view")
      .gte("created_at", cutoffDate.toISOString());

    if (!eventData || eventData.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          cenotapheries: [],
          totalVisits: 0,
          period: `${days} days`,
        },
      });
    }

    // Aggregate by cenotaphery slug
    const counts: Record<string, { name: string; count: number }> = {};
    for (const event of eventData) {
      const props = event.properties as { cenotapherySlug?: string; cenotapheryName?: string };
      const slug = props?.cenotapherySlug;
      const name = props?.cenotapheryName || slug || "Unknown";

      if (slug) {
        if (!counts[slug]) {
          counts[slug] = { name, count: 0 };
        }
        counts[slug].count++;
      }
    }

    // Sort by count descending and limit
    const cenotapheries = Object.entries(counts)
      .map(([slug, data]) => ({
        slug,
        name: data.name,
        visits: data.count,
      }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, limit);

    const totalVisits = eventData.length;

    return NextResponse.json({
      success: true,
      data: {
        cenotapheries,
        totalVisits,
        period: `${days} days`,
      },
    });
  } catch (err) {
    console.error("[Cenotapheries] Error fetching stats:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cenotaphery stats" },
      { status: 500 }
    );
  }
}
