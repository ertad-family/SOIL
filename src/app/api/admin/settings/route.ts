/**
 * API endpoint for project settings management
 * GET  /api/admin/settings - List all settings (grouped by category)
 * POST /api/admin/settings - Update a setting
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ProjectSetting } from "@/lib/settings";

interface SettingsResponse {
  success: boolean;
  data?: {
    settings: ProjectSetting[];
    byCategory: Record<string, ProjectSetting[]>;
  };
  error?: string;
}

interface UpdateResponse {
  success: boolean;
  error?: string;
}

/**
 * GET /api/admin/settings
 * Returns all settings grouped by category
 */
export async function GET(): Promise<NextResponse<SettingsResponse>> {
  try {
    const supabase = await createClient();

    // Verify admin access
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    // Fetch all settings
    const { data: settings, error } = await supabase
      .from("project_settings")
      .select("*")
      .order("category")
      .order("key");

    if (error) {
      console.error("[Settings] Error fetching settings:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch settings" },
        { status: 500 }
      );
    }

    // Group by category
    const byCategory: Record<string, ProjectSetting[]> = {};
    for (const setting of settings || []) {
      const category = setting.category || "general";
      if (!byCategory[category]) {
        byCategory[category] = [];
      }
      byCategory[category].push(setting);
    }

    return NextResponse.json({
      success: true,
      data: {
        settings: settings || [],
        byCategory,
      },
    });
  } catch (err) {
    console.error("[Settings] Error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/admin/settings
 * Update a setting value
 * Body: { key: string, value: unknown }
 */
export async function POST(request: NextRequest): Promise<NextResponse<UpdateResponse>> {
  try {
    const supabase = await createClient();

    // Verify admin access
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { key, value } = body;

    if (!key || typeof key !== "string") {
      return NextResponse.json(
        { success: false, error: "Setting key is required" },
        { status: 400 }
      );
    }

    // Check if setting exists
    const { data: existing } = await supabase
      .from("project_settings")
      .select("key")
      .eq("key", key)
      .single();

    if (!existing) {
      return NextResponse.json({ success: false, error: "Setting not found" }, { status: 404 });
    }

    // Update setting
    const { error: updateError } = await supabase
      .from("project_settings")
      .update({ value })
      .eq("key", key);

    if (updateError) {
      console.error("[Settings] Error updating setting:", updateError);
      return NextResponse.json(
        { success: false, error: "Failed to update setting" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Settings] Error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
