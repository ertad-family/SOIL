/**
 * POST /api/memorial
 * Create a memorial (cenotaph record) for an organization
 * Called when user clicks "Create Cenotaph" button
 *
 * Issues: #222 (auto-spawn cenotapheries) + #107 (location-based assignment)
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { assignCenotaphery } from "@/lib/cenotaphery-assignment";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { organizationId } = body;

    if (!organizationId) {
      return NextResponse.json({ error: "Organization ID is required" }, { status: 400 });
    }

    // Fetch organization with location data and verify ownership
    const { data: organization, error: orgError } = await supabase
      .from("organizations")
      .select(
        "id, name, organization_type, created_by, location_country, location_region, location_city, location_lat, location_lng"
      )
      .eq("id", organizationId)
      .single();

    if (orgError || !organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    if (organization.created_by !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if memorial already exists for this organization
    const { data: existingMemorial } = await supabase
      .from("memorials")
      .select("id")
      .eq("organization_id", organizationId)
      .single();

    if (existingMemorial) {
      // Memorial already exists, return its ID
      return NextResponse.json({
        success: true,
        memorialId: existingMemorial.id,
      });
    }

    // Generate slug from organization name
    const baseSlug = organization.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Assign cenotaphery based on location (prestige hierarchy)
    // Algorithm: the-first (100) → country → region → city → global
    const cenotapheryId = await assignCenotaphery(supabase, {
      country: organization.location_country,
      region: organization.location_region,
      city: organization.location_city,
      lat: organization.location_lat,
      lng: organization.location_lng,
    });

    // Create the memorial
    const { data: newMemorial, error: createError } = await supabase
      .from("memorials")
      .insert({
        organization_id: organizationId,
        organization_name: organization.name,
        organization_type: organization.organization_type,
        user_id: user.id,
        slug: baseSlug || "cenotaph",
        tombstone_style: "classical",
        tombstone_color: "#1e293b",
        views_count: 0,
        respects_count: 0,
        design_status: "not_started",
        cenotaphery_id: cenotapheryId,
      })
      .select("id")
      .single();

    if (createError) {
      console.error("Failed to create memorial:", createError);
      return NextResponse.json({ error: "Failed to create memorial" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      memorialId: newMemorial.id,
    });
  } catch (err) {
    console.error("Memorial creation error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
