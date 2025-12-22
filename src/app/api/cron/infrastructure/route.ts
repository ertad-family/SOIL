/**
 * Cron job endpoint for infrastructure usage snapshots
 * GET /api/cron/infrastructure
 *
 * Records daily snapshots of Supabase and Vercel usage metrics
 * Triggered by Vercel Cron (configured in vercel.json)
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Verify cron secret to prevent unauthorized access
const CRON_SECRET = process.env.CRON_SECRET;

// Supabase Free Tier limits
const SUPABASE_LIMITS = {
  database_size_mb: 500,
  storage_gb: 1,
  auth_users: 50000,
};

// Vercel Free Tier limits
const VERCEL_LIMITS = {
  bandwidth_gb: 100,
  serverless_hours: 100,
};

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();

    const snapshots: Array<{
      provider: string;
      metric_name: string;
      current_value: number;
      limit_value: number;
    }> = [];

    // Get Supabase database size
    try {
      const { data: dbSize } = await supabase.rpc("get_database_size_mb");
      if (dbSize !== null) {
        snapshots.push({
          provider: "supabase",
          metric_name: "database_size",
          current_value: dbSize,
          limit_value: SUPABASE_LIMITS.database_size_mb,
        });
      }
    } catch {
      // Function might not exist yet
    }

    // Get auth users count
    const { count: userCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    snapshots.push({
      provider: "supabase",
      metric_name: "auth_users",
      current_value: userCount || 0,
      limit_value: SUPABASE_LIMITS.auth_users,
    });

    // Get Vercel usage if API key is available
    const vercelToken = process.env.VERCEL_ACCESS_TOKEN;
    const vercelTeamId = process.env.VERCEL_TEAM_ID;

    if (vercelToken) {
      try {
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
            snapshots.push({
              provider: "vercel",
              metric_name: "bandwidth",
              current_value: Math.round(bandwidthGb * 100) / 100,
              limit_value: VERCEL_LIMITS.bandwidth_gb,
            });
          }

          if (data.serverlessFunctionExecution) {
            const hours = data.serverlessFunctionExecution / (1000 * 60 * 60);
            snapshots.push({
              provider: "vercel",
              metric_name: "serverless_hours",
              current_value: Math.round(hours * 100) / 100,
              limit_value: VERCEL_LIMITS.serverless_hours,
            });
          }
        }
      } catch (err) {
        console.error("[Cron] Failed to fetch Vercel usage:", err);
      }
    }

    // Insert snapshots into database
    if (snapshots.length > 0) {
      const { error } = await supabase.from("infrastructure_usage").insert(snapshots);

      if (error) {
        console.error("[Cron] Failed to insert snapshots:", error);
        return NextResponse.json(
          { success: false, error: "Failed to save snapshots" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      snapshotsRecorded: snapshots.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[Cron] Error recording infrastructure snapshots:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
