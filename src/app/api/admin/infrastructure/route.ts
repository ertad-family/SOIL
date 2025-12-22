/**
 * API endpoint for infrastructure usage monitoring
 * GET /api/admin/infrastructure
 *
 * Returns current usage metrics for Supabase and Vercel
 * Only accessible by admin users
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface UsageMetric {
  provider: "vercel" | "supabase";
  metricName: string;
  currentValue: number;
  limitValue: number;
  percentageUsed: number;
  unit: string;
}

interface InfrastructureResponse {
  success: boolean;
  metrics?: UsageMetric[];
  lastUpdated?: string;
  error?: string;
}

// Supabase Free Tier limits
const SUPABASE_LIMITS = {
  database_size_mb: 500,
  storage_gb: 1,
  auth_users: 50000,
  api_requests: 500000, // per month
};

// Vercel Free Tier limits
const VERCEL_LIMITS = {
  bandwidth_gb: 100,
  serverless_hours: 100,
  builds_minutes: 6000,
  edge_invocations: 500000,
};

export async function GET(request: NextRequest): Promise<NextResponse<InfrastructureResponse>> {
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

    const metrics: UsageMetric[] = [];

    // Get Supabase database size
    try {
      const { data: dbSize } = await supabase.rpc("get_database_size_mb");
      if (dbSize !== null) {
        metrics.push({
          provider: "supabase",
          metricName: "database_size",
          currentValue: dbSize,
          limitValue: SUPABASE_LIMITS.database_size_mb,
          percentageUsed: Math.round((dbSize / SUPABASE_LIMITS.database_size_mb) * 100),
          unit: "MB",
        });
      }
    } catch {
      // Function might not exist yet, use fallback
      metrics.push({
        provider: "supabase",
        metricName: "database_size",
        currentValue: 0,
        limitValue: SUPABASE_LIMITS.database_size_mb,
        percentageUsed: 0,
        unit: "MB",
      });
    }

    // Get auth users count
    const { count: userCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    metrics.push({
      provider: "supabase",
      metricName: "auth_users",
      currentValue: userCount || 0,
      limitValue: SUPABASE_LIMITS.auth_users,
      percentageUsed: Math.round(((userCount || 0) / SUPABASE_LIMITS.auth_users) * 100 * 100) / 100,
      unit: "users",
    });

    // Get Vercel usage if API key is available
    const vercelToken = process.env.VERCEL_ACCESS_TOKEN;
    const vercelTeamId = process.env.VERCEL_TEAM_ID;

    if (vercelToken) {
      try {
        // Fetch bandwidth usage from Vercel API
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const params = new URLSearchParams({
          from: startOfMonth.getTime().toString(),
          to: now.getTime().toString(),
        });

        if (vercelTeamId) {
          params.append("teamId", vercelTeamId);
        }

        const response = await fetch(`https://api.vercel.com/v1/usage?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${vercelToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();

          if (data.bandwidth) {
            const bandwidthGb = data.bandwidth / (1024 * 1024 * 1024);
            metrics.push({
              provider: "vercel",
              metricName: "bandwidth",
              currentValue: Math.round(bandwidthGb * 100) / 100,
              limitValue: VERCEL_LIMITS.bandwidth_gb,
              percentageUsed: Math.round((bandwidthGb / VERCEL_LIMITS.bandwidth_gb) * 100),
              unit: "GB",
            });
          }

          if (data.serverlessFunctionExecution) {
            const hours = data.serverlessFunctionExecution / (1000 * 60 * 60);
            metrics.push({
              provider: "vercel",
              metricName: "serverless_hours",
              currentValue: Math.round(hours * 100) / 100,
              limitValue: VERCEL_LIMITS.serverless_hours,
              percentageUsed: Math.round((hours / VERCEL_LIMITS.serverless_hours) * 100),
              unit: "GB-hours",
            });
          }
        }
      } catch (err) {
        console.error("[Infrastructure] Failed to fetch Vercel usage:", err);
        // Add placeholder metrics for Vercel
        metrics.push({
          provider: "vercel",
          metricName: "bandwidth",
          currentValue: 0,
          limitValue: VERCEL_LIMITS.bandwidth_gb,
          percentageUsed: 0,
          unit: "GB",
        });
      }
    } else {
      // No Vercel token - add placeholder metrics
      metrics.push({
        provider: "vercel",
        metricName: "bandwidth",
        currentValue: 0,
        limitValue: VERCEL_LIMITS.bandwidth_gb,
        percentageUsed: 0,
        unit: "GB",
      });
    }

    return NextResponse.json({
      success: true,
      metrics,
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[Infrastructure] Error fetching usage:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch infrastructure usage" },
      { status: 500 }
    );
  }
}
