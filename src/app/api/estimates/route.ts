import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { MODULES } from "@/types/interview";

// Default estimates from MODULES (fallback)
const DEFAULT_ESTIMATES: Record<string, number> = {};
MODULES.forEach((m) => {
  DEFAULT_ESTIMATES[m.id] = m.estimatedMinutes;
});

// Minimum samples required before showing calculated estimates
const MIN_SAMPLES_THRESHOLD = 10;

interface ChapterEstimate {
  chapterId: string;
  estimatedMinutes: number | null;
  sampleCount: number;
  hasEnoughData: boolean;
}

/**
 * GET /api/estimates
 * Returns chapter time estimates based on collected analytics data
 * Falls back to defaults if insufficient data
 *
 * Query params:
 * - orgType: Filter by organization type (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orgType = searchParams.get("orgType");

    const supabase = await createClient();

    // Call the SQL function to get estimates
    const { data, error } = await supabase.rpc("get_chapter_time_estimates", {
      org_type: orgType || null,
      min_samples: MIN_SAMPLES_THRESHOLD,
    });

    if (error) {
      console.error("Error fetching chapter estimates:", error);
      // Return defaults on error
      return NextResponse.json({
        estimates: MODULES.map((m) => ({
          chapterId: m.id,
          estimatedMinutes: null, // Hide estimates on error
          sampleCount: 0,
          hasEnoughData: false,
        })),
        source: "error_fallback",
      });
    }

    // Build response with calculated or null estimates
    const estimatesMap = new Map<string, { median: number | null; samples: number }>();

    if (data) {
      for (const row of data) {
        estimatesMap.set(row.chapter_id, {
          median: row.median_minutes,
          samples: Number(row.sample_count),
        });
      }
    }

    const estimates: ChapterEstimate[] = MODULES.map((m) => {
      const calculated = estimatesMap.get(m.id);
      const hasEnoughData = calculated ? calculated.samples >= MIN_SAMPLES_THRESHOLD : false;

      return {
        chapterId: m.id,
        // Only return estimate if we have enough data, otherwise null
        estimatedMinutes: hasEnoughData && calculated?.median ? calculated.median : null,
        sampleCount: calculated?.samples ?? 0,
        hasEnoughData,
      };
    });

    // Check if we have enough data for any chapter
    const hasAnyData = estimates.some((e) => e.hasEnoughData);

    return NextResponse.json({
      estimates,
      source: hasAnyData ? "calculated" : "insufficient_data",
      minSamplesRequired: MIN_SAMPLES_THRESHOLD,
    });
  } catch (err) {
    console.error("Error in estimates API:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
