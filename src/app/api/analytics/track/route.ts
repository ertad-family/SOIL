/**
 * API endpoint for tracking analytics events
 * POST /api/analytics/track
 *
 * Stores events in Supabase analytics_events table
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getVisitorFingerprint } from "@/lib/visitor";

interface TrackEventRequest {
  eventName: string;
  eventCategory?: string;
  properties?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TrackEventRequest;
    const { eventName, eventCategory, properties = {} } = body;

    // Validate required fields
    if (!eventName || typeof eventName !== "string") {
      return NextResponse.json({ error: "eventName is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Get user if authenticated (optional)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Get visitor fingerprint for anonymous tracking
    const visitorFingerprint = await getVisitorFingerprint();

    // Insert event into database
    const { error } = await supabase.from("analytics_events").insert({
      event_name: eventName,
      event_category: eventCategory || null,
      user_id: user?.id || null,
      visitor_fingerprint: visitorFingerprint,
      properties: properties,
    });

    if (error) {
      console.error("[Analytics] Failed to insert event:", error);
      // Don't return error to client - analytics should fail silently
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Analytics] Error tracking event:", err);
    // Always return success - analytics should never break the app
    return NextResponse.json({ success: true });
  }
}
