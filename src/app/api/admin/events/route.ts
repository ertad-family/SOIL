/**
 * API endpoint for analytics events
 * GET /api/admin/events
 *
 * Returns aggregated event counts for the dashboard
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface EventCount {
  eventName: string;
  count: number;
}

interface EventsResponse {
  success: boolean;
  data?: {
    events: EventCount[];
    totalEvents: number;
    period: string;
  };
  error?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<EventsResponse>> {
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

    // Get period from query params (default 7 days)
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get("days") || "7", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Try to use the database function if available
    try {
      const { data, error } = await supabase.rpc("get_event_counts", {
        days_back: days,
        max_results: limit,
      });

      if (!error && data) {
        const events = data.map((row: { event_name: string; event_count: number }) => ({
          eventName: row.event_name,
          count: row.event_count,
        }));

        const totalEvents = events.reduce((sum: number, e: EventCount) => sum + e.count, 0);

        return NextResponse.json({
          success: true,
          data: {
            events,
            totalEvents,
            period: `${days} days`,
          },
        });
      }
    } catch {
      // Function might not exist yet, calculate manually
    }

    // Manual calculation fallback
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    // Get all events and aggregate
    const { data: eventData } = await supabase
      .from("analytics_events")
      .select("event_name")
      .gte("created_at", cutoffDate.toISOString());

    if (!eventData) {
      return NextResponse.json({
        success: true,
        data: {
          events: [],
          totalEvents: 0,
          period: `${days} days`,
        },
      });
    }

    // Aggregate by event name
    const counts: Record<string, number> = {};
    for (const event of eventData) {
      counts[event.event_name] = (counts[event.event_name] || 0) + 1;
    }

    // Sort by count descending and limit
    const events = Object.entries(counts)
      .map(([eventName, count]) => ({ eventName, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    const totalEvents = eventData.length;

    return NextResponse.json({
      success: true,
      data: {
        events,
        totalEvents,
        period: `${days} days`,
      },
    });
  } catch (err) {
    console.error("[Events] Error fetching events:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch events" }, { status: 500 });
  }
}
