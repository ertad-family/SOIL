/**
 * API endpoint for tracking token events (clicks, conversions)
 * POST /api/share/track
 *
 * Records events like clicks, signups, and cenotaph creations linked to tokens
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getVisitorFingerprint } from "@/lib/visitor";
import { isValidToken } from "@/lib/tokens";

type TokenEventType = "click" | "signup" | "cenotaph_created";

interface TrackTokenEventRequest {
  token: string;
  eventType: TokenEventType;
}

interface TrackTokenEventResponse {
  success: boolean;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<TrackTokenEventResponse>> {
  try {
    const body = (await request.json()) as TrackTokenEventRequest;
    const { token, eventType } = body;

    // Validate inputs
    if (!token || !isValidToken(token)) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 400 });
    }

    if (!eventType || !["click", "signup", "cenotaph_created"].includes(eventType)) {
      return NextResponse.json({ success: false, error: "Invalid eventType" }, { status: 400 });
    }

    const supabase = await createClient();

    // Get user if authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Get visitor fingerprint
    const visitorFingerprint = await getVisitorFingerprint();

    // Verify token exists in database
    const { data: tokenData } = await supabase
      .from("link_tokens")
      .select("token")
      .eq("token", token)
      .single();

    if (!tokenData) {
      // Token doesn't exist in DB - might be a fallback token
      // Still return success to not break the flow
      return NextResponse.json({ success: true });
    }

    // Record the event
    const { error } = await supabase.from("token_events").insert({
      token,
      event_type: eventType,
      visitor_fingerprint: visitorFingerprint,
      user_id: user?.id || null,
    });

    if (error) {
      console.error("[Share] Failed to record token event:", error);
      // Return success anyway - tracking failure shouldn't block the user
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Share] Error tracking token event:", err);
    return NextResponse.json({ success: true });
  }
}
