/**
 * Reference Data API
 *
 * GET /api/reference-data
 *
 * Returns organization types, lifecycle stages, and business models.
 *
 * Query params:
 * - type: "org_types" | "stages" | "business_models" | "all" (default: "all")
 * - orgType: Filter business models by org type (optional)
 *
 * Related Issue: #34
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { OrganizationType, LifecycleStage } from "@/types/interview";

interface OrgTypeResponse {
  value: OrganizationType;
  label: string;
  labelShort: string;
  description: string | null;
}

interface StageResponse {
  value: LifecycleStage;
  label: string;
  description: string | null;
}

interface BusinessModelResponse {
  value: string;
  label: string;
}

interface ReferenceDataResponse {
  orgTypes?: OrgTypeResponse[];
  stages?: StageResponse[];
  businessModels?: Record<string, BusinessModelResponse[]>;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all";
    const orgType = searchParams.get("orgType");

    const supabase = await createClient();
    const response: ReferenceDataResponse = {};

    // Fetch organization types
    if (type === "all" || type === "org_types") {
      const { data, error } = await supabase
        .from("organization_types")
        .select("type_key, label, label_short, description")
        .eq("is_active", true)
        .order("display_order");

      if (error) {
        console.error("Error fetching org types:", error);
        return NextResponse.json({ error: "Failed to fetch organization types" }, { status: 500 });
      }

      response.orgTypes = data.map((t) => ({
        value: t.type_key as OrganizationType,
        label: t.label,
        labelShort: t.label_short,
        description: t.description,
      }));
    }

    // Fetch lifecycle stages
    if (type === "all" || type === "stages") {
      const { data, error } = await supabase
        .from("lifecycle_stages")
        .select("stage_key, label, description")
        .eq("is_active", true)
        .order("display_order");

      if (error) {
        console.error("Error fetching stages:", error);
        return NextResponse.json({ error: "Failed to fetch lifecycle stages" }, { status: 500 });
      }

      response.stages = data.map((s) => ({
        value: s.stage_key as LifecycleStage,
        label: s.label,
        description: s.description,
      }));
    }

    // Fetch business models
    if (type === "all" || type === "business_models") {
      let query = supabase
        .from("business_models")
        .select("model_key, org_type_key, label")
        .eq("is_active", true)
        .order("display_order");

      if (orgType) {
        query = query.eq("org_type_key", orgType);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching business models:", error);
        return NextResponse.json({ error: "Failed to fetch business models" }, { status: 500 });
      }

      // Group by org type
      const grouped: Record<string, BusinessModelResponse[]> = {};
      for (const model of data) {
        if (!grouped[model.org_type_key]) {
          grouped[model.org_type_key] = [];
        }
        grouped[model.org_type_key].push({
          value: model.model_key,
          label: model.label,
        });
      }

      response.businessModels = grouped;
    }

    return NextResponse.json(response);
  } catch (err) {
    console.error("Error in reference-data API:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
