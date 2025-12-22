/**
 * API endpoint for generating share tokens
 * POST /api/share/generate
 *
 * Creates a unique token for tracking share link clicks and conversions
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateToken } from "@/lib/tokens";

interface GenerateShareTokenRequest {
  memorialId?: string;
  organizationId?: string;
  platform: string;
}

interface GenerateShareTokenResponse {
  success: boolean;
  token?: string;
  error?: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<GenerateShareTokenResponse>> {
  try {
    const body = (await request.json()) as GenerateShareTokenRequest;
    const { memorialId, platform } = body;

    if (!platform) {
      return NextResponse.json({ success: false, error: "platform is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Get user if authenticated (optional - anonymous shares allowed)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Generate unique token
    const token = generateToken("share");

    // Store token in database
    const { error } = await supabase.from("link_tokens").insert({
      token,
      token_type: "share",
      source_user_id: user?.id || null,
      source_memorial_id: memorialId || null,
      platform,
      metadata: {},
    });

    if (error) {
      console.error("[Share] Failed to create token:", error);
      // Return the token anyway - tracking failure shouldn't block sharing
      return NextResponse.json({ success: true, token });
    }

    return NextResponse.json({ success: true, token });
  } catch (err) {
    console.error("[Share] Error generating token:", err);
    // Generate token without storing - sharing should always work
    const fallbackToken = generateToken("share");
    return NextResponse.json({ success: true, token: fallbackToken });
  }
}
