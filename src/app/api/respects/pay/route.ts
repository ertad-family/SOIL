/**
 * POST /api/respects/pay
 * Pay respects to a memorial/cenotaph
 *
 * - Any visitor (anonymous or registered) can pay 1 free respect per memorial
 * - Cannot pay respects to your own cenotaph
 * - Duplicate payments prevented via visitor fingerprint
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getVisitorFingerprint } from "@/lib/visitor";

interface PayRespectsRequest {
  memorialId: string;
}

interface PayRespectsResponse {
  success: boolean;
  alreadyPaid?: boolean;
  isOwnCenotaph?: boolean;
  respectsCount?: number;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<PayRespectsResponse>> {
  try {
    const supabase = await createClient();

    // Parse request body
    const body: PayRespectsRequest = await request.json();
    const { memorialId } = body;

    if (!memorialId) {
      return NextResponse.json(
        { success: false, error: "Memorial ID is required" },
        { status: 400 }
      );
    }

    // Get visitor fingerprint (always, for duplicate prevention)
    const visitorFingerprint = await getVisitorFingerprint();

    // Check auth (optional for this endpoint)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Fetch memorial and check it exists
    const { data: memorial, error: memorialError } = await supabase
      .from("memorials")
      .select("id, organization_id, respects_count, status")
      .eq("id", memorialId)
      .single();

    if (memorialError || !memorial) {
      return NextResponse.json({ success: false, error: "Memorial not found" }, { status: 404 });
    }

    // Check if this is user's own cenotaph
    if (user) {
      const { data: organization } = await supabase
        .from("organizations")
        .select("created_by")
        .eq("id", memorial.organization_id)
        .single();

      if (organization?.created_by === user.id) {
        return NextResponse.json(
          {
            success: false,
            isOwnCenotaph: true,
            error: "Cannot pay respects to your own cenotaph",
          },
          { status: 403 }
        );
      }
    }

    // Check if already paid (by fingerprint - the primary check)
    const { data: existingRespect } = await supabase
      .from("respects")
      .select("id")
      .eq("memorial_id", memorialId)
      .eq("visitor_fingerprint", visitorFingerprint)
      .single();

    if (existingRespect) {
      // Already paid - return current count
      return NextResponse.json({
        success: true,
        alreadyPaid: true,
        respectsCount: memorial.respects_count,
      });
    }

    // Insert new respect
    const { error: insertError } = await supabase.from("respects").insert({
      memorial_id: memorialId,
      user_id: user?.id || null,
      visitor_fingerprint: visitorFingerprint,
      amount: 1,
    });

    if (insertError) {
      // Handle unique constraint violation (race condition)
      if (insertError.code === "23505") {
        return NextResponse.json({
          success: true,
          alreadyPaid: true,
          respectsCount: memorial.respects_count,
        });
      }
      console.error("Failed to insert respect:", insertError);
      return NextResponse.json(
        { success: false, error: "Failed to pay respects" },
        { status: 500 }
      );
    }

    // Return success with updated count
    return NextResponse.json({
      success: true,
      respectsCount: memorial.respects_count + 1,
    });
  } catch (err) {
    console.error("Pay respects error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
