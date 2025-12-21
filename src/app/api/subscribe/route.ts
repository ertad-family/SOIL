/**
 * POST /api/subscribe
 * Subscribe to newsletter or waitlist
 *
 * - Validates email format
 * - Handles duplicates gracefully (returns success with already_subscribed flag)
 * - Saves to subscribers table
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface SubscribeRequest {
  email: string;
  type: "newsletter" | "waitlist";
  source?: string;
}

interface SubscribeResponse {
  success: boolean;
  alreadySubscribed?: boolean;
  error?: string;
}

// Simple email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest): Promise<NextResponse<SubscribeResponse>> {
  try {
    const supabase = await createClient();

    // Parse request body
    const body: SubscribeRequest = await request.json();
    const { email, type, source } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    if (!type || !["newsletter", "waitlist"].includes(type)) {
      return NextResponse.json(
        { success: false, error: "Valid subscription type is required (newsletter or waitlist)" },
        { status: 400 }
      );
    }

    // Validate email format
    const normalizedEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 });
    }

    // Try to insert subscription
    const { error: insertError } = await supabase.from("subscribers").insert({
      email: normalizedEmail,
      subscription_type: type,
      source: source || null,
    });

    if (insertError) {
      // Handle unique constraint violation (already subscribed)
      if (insertError.code === "23505") {
        return NextResponse.json({
          success: true,
          alreadySubscribed: true,
        });
      }
      console.error("Failed to insert subscription:", insertError);
      return NextResponse.json({ success: false, error: "Failed to subscribe" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
