/**
 * API endpoint for K-factor calculation
 * GET /api/admin/kfactor
 *
 * Returns virality metrics and K-factor calculation
 * K = i × c (invites per user × conversion rate)
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface KFactorResponse {
  success: boolean;
  data?: {
    kFactor: number;
    invitesPerUser: number;
    conversionRate: number;
    totalShares: number;
    totalClicks: number;
    totalConversions: number;
    activeUsers: number;
    period: string;
  };
  error?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<KFactorResponse>> {
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

    // Try to use the database function if available
    try {
      const { data, error } = await supabase.rpc("calculate_k_factor", {
        days_back: days,
      });

      if (!error && data && data.length > 0) {
        const result = data[0];
        return NextResponse.json({
          success: true,
          data: {
            kFactor: parseFloat(result.k_factor) || 0,
            invitesPerUser: parseFloat(result.invites_per_user) || 0,
            conversionRate: parseFloat(result.conversion_rate) || 0,
            totalShares: result.total_shares || 0,
            totalClicks: result.total_clicks || 0,
            totalConversions: result.total_conversions || 0,
            activeUsers: result.active_users || 0,
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

    // Get share tokens and clicks
    const { data: tokenData } = await supabase
      .from("link_tokens")
      .select("token, source_user_id")
      .eq("token_type", "share")
      .gte("created_at", cutoffDate.toISOString());

    const totalShares = tokenData?.length || 0;
    const usersWhoShared = new Set(tokenData?.map((t) => t.source_user_id).filter(Boolean)).size;

    // Get token events
    const { data: eventData } = await supabase
      .from("token_events")
      .select("event_type")
      .gte("created_at", cutoffDate.toISOString());

    const totalClicks = eventData?.filter((e) => e.event_type === "click").length || 0;
    const totalConversions =
      eventData?.filter((e) => e.event_type === "cenotaph_created").length || 0;

    // Get active users (completed wizard)
    const { count: activeUsers } = await supabase
      .from("analytics_events")
      .select("*", { count: "exact", head: true })
      .eq("event_name", "wizard_completed")
      .gte("created_at", cutoffDate.toISOString());

    // Calculate K-factor
    const invitesPerUser = activeUsers && activeUsers > 0 ? totalShares / activeUsers : 0;
    const conversionRate = totalClicks > 0 ? totalConversions / totalClicks : 0;
    const kFactor = invitesPerUser * conversionRate;

    return NextResponse.json({
      success: true,
      data: {
        kFactor: Math.round(kFactor * 10000) / 10000,
        invitesPerUser: Math.round(invitesPerUser * 10000) / 10000,
        conversionRate: Math.round(conversionRate * 10000) / 10000,
        totalShares,
        totalClicks,
        totalConversions,
        activeUsers: activeUsers || 0,
        period: `${days} days`,
      },
    });
  } catch (err) {
    console.error("[K-factor] Error calculating K-factor:", err);
    return NextResponse.json(
      { success: false, error: "Failed to calculate K-factor" },
      { status: 500 }
    );
  }
}
