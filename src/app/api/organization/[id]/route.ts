import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/organization/[id] - Update organization
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Check auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check ownership
    const { data: organization, error: orgError } = await supabase
      .from("organizations")
      .select("created_by")
      .eq("id", id)
      .single();

    if (orgError || !organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    if (organization.created_by !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse body
    const body = await request.json();
    const {
      is_public,
      name,
      description,
      organization_type,
      business_model,
      industry,
      location_country,
      location_city,
      founded_date,
      closed_date,
      stage_at_closure,
      peak_team_size,
    } = body;

    // Build update object with only provided fields
    const updates: Record<string, unknown> = {};
    if (typeof is_public === "boolean") updates.is_public = is_public;
    if (typeof name === "string") updates.name = name;
    if (typeof description === "string") updates.description = description;
    if (typeof organization_type === "string") updates.organization_type = organization_type;
    if (typeof business_model === "string" || business_model === null)
      updates.business_model = business_model;
    if (typeof industry === "string" || industry === null) updates.industry = industry;
    if (typeof location_country === "string" || location_country === null)
      updates.location_country = location_country;
    if (typeof location_city === "string" || location_city === null)
      updates.location_city = location_city;
    if (typeof founded_date === "string" || founded_date === null)
      updates.founded_date = founded_date;
    if (typeof closed_date === "string" || closed_date === null) updates.closed_date = closed_date;
    if (typeof stage_at_closure === "string" || stage_at_closure === null)
      updates.stage_at_closure = stage_at_closure;
    if (typeof peak_team_size === "number" || peak_team_size === null)
      updates.peak_team_size = peak_team_size;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    // Update organization
    const { data, error: updateError } = await supabase
      .from("organizations")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Failed to update organization:", updateError);
      return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }

    return NextResponse.json({ organization: data });
  } catch (err) {
    console.error("Organization PATCH error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/organization/[id] - Delete organization
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Check auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check ownership
    const { data: organization, error: orgError } = await supabase
      .from("organizations")
      .select("created_by")
      .eq("id", id)
      .single();

    if (orgError || !organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    if (organization.created_by !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete organization (cascades to stories and memorials via FK)
    const { error: deleteError } = await supabase.from("organizations").delete().eq("id", id);

    if (deleteError) {
      console.error("Failed to delete organization:", deleteError);
      return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Organization DELETE error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
