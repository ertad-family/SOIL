import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/stats/founders
 * Returns the count of founders (users with organizations)
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Count distinct users who have created organizations
    const { count, error } = await supabase
      .from("organizations")
      .select("user_id", { count: "exact", head: true });

    if (error) {
      console.error("Error fetching founder count:", error);
      return NextResponse.json({ success: false, count: 0 });
    }

    return NextResponse.json({
      success: true,
      count: count || 0,
    });
  } catch (err) {
    console.error("Error in founders stats API:", err);
    return NextResponse.json({ success: false, count: 0 });
  }
}
