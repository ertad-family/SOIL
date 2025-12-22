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

    // Note: Vercel usage API (/v1/usage) is not available for Hobby plans
    // We add placeholder metrics and users can check usage in Vercel dashboard
    // TODO: Implement when we upgrade to Pro plan or find alternative API
    metrics.push({
      provider: "vercel",
      metricName: "bandwidth",
      currentValue: 0,
      limitValue: VERCEL_LIMITS.bandwidth_gb,
      percentageUsed: 0,
      unit: "GB",
    });

    metrics.push({
      provider: "vercel",
      metricName: "serverless_hours",
      currentValue: 0,
      limitValue: VERCEL_LIMITS.serverless_hours,
      percentageUsed: 0,
      unit: "GB-hours",
    });

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
