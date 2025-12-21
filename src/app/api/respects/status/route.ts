/**
 * GET /api/respects/status?memorialId=xxx
 * Check if current visitor has already paid respects to a memorial
 *
 * Returns:
 * - hasPaid: boolean
 * - isOwnCenotaph: boolean
 * - respectsCount: number
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getExistingVisitorFingerprint } from "@/lib/visitor";

interface RespectsStatusResponse {
  hasPaid: boolean;
  isOwnCenotaph: boolean;
  respectsCount: number;
  error?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<RespectsStatusResponse>> {
  try {
    const supabase = await createClient();

    // Get memorial ID from query params
    const { searchParams } = new URL(request.url);
    const memorialId = searchParams.get("memorialId");

    if (!memorialId) {
      return NextResponse.json(
        {
          hasPaid: false,
          isOwnCenotaph: false,
          respectsCount: 0,
          error: "Memorial ID is required",
        },
        { status: 400 }
      );
    }

    // Get visitor fingerprint (if exists)
    const visitorFingerprint = await getExistingVisitorFingerprint();

    // Check auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Fetch memorial
    const { data: memorial, error: memorialError } = await supabase
      .from("memorials")
      .select("id, organization_id, respects_count")
      .eq("id", memorialId)
      .single();

    if (memorialError || !memorial) {
      return NextResponse.json(
        { hasPaid: false, isOwnCenotaph: false, respectsCount: 0, error: "Memorial not found" },
        { status: 404 }
      );
    }

    // Check if this is user's own cenotaph
    let isOwnCenotaph = false;
    if (user) {
      const { data: organization } = await supabase
        .from("organizations")
        .select("created_by")
        .eq("id", memorial.organization_id)
        .single();

      isOwnCenotaph = organization?.created_by === user.id;
    }

    // Check if already paid (by fingerprint)
    let hasPaid = false;
    if (visitorFingerprint) {
      const { data: existingRespect } = await supabase
        .from("respects")
        .select("id")
        .eq("memorial_id", memorialId)
        .eq("visitor_fingerprint", visitorFingerprint)
        .single();

      hasPaid = !!existingRespect;
    }

    return NextResponse.json({
      hasPaid,
      isOwnCenotaph,
      respectsCount: memorial.respects_count,
    });
  } catch (err) {
    console.error("Respects status error:", err);
    return NextResponse.json(
      { hasPaid: false, isOwnCenotaph: false, respectsCount: 0, error: "Internal server error" },
      { status: 500 }
    );
  }
}
