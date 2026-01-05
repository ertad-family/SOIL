import { NextRequest, NextResponse } from "next/server";
import { createAnonClient } from "@/lib/supabase/anon";
import { createClient } from "@/lib/supabase/server";

// Types
export type DatasetCategory = "government" | "academic" | "industry" | "qualitative";
export type DatasetAccess = "open" | "restricted" | "paid";

export interface DatasetCoverage {
  geography?: string[];
  time_period?: string;
  org_types?: string[];
}

export interface Dataset {
  id: string;
  name: string;
  slug: string;
  url: string;
  description: string;
  category: DatasetCategory;
  access: DatasetAccess;
  coverage: DatasetCoverage;
  granularity: string | null;
  limitations: string[] | null;
  related_publications: string[] | null;
  compatible_with: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface DatasetStats {
  total: number;
  byCategory: { category: DatasetCategory; label: string; count: number }[];
  byAccess: { access: DatasetAccess; label: string; count: number }[];
}

interface DatasetsResponse {
  datasets: Dataset[];
  total: number;
  stats: DatasetStats;
}

// Display labels
const CATEGORY_LABELS: Record<DatasetCategory, string> = {
  government: "Government Registries",
  academic: "Academic Datasets",
  industry: "Industry Sources",
  qualitative: "Qualitative Archives",
};

const ACCESS_LABELS: Record<DatasetAccess, string> = {
  open: "Open Access",
  restricted: "Restricted",
  paid: "Paid",
};

/**
 * GET /api/datasets
 * Query params:
 * - action=stats: Return only stats
 * - category: Filter by category
 * - access: Filter by access type
 * - search: Search in name and description
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createAnonClient();
    const { searchParams } = new URL(request.url);

    const action = searchParams.get("action");
    const category = searchParams.get("category");
    const access = searchParams.get("access");
    const search = searchParams.get("search");

    // If only stats requested
    if (action === "stats") {
      const { data: allDatasets, error } = await supabase
        .from("research_datasets")
        .select("category, access");

      if (error) {
        console.error("Error fetching dataset stats:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
      }

      const stats = calculateStats(allDatasets || []);
      return NextResponse.json(stats);
    }

    // Build query for datasets
    let query = supabase
      .from("research_datasets")
      .select("*")
      .order("category", { ascending: true })
      .order("name", { ascending: true });

    // Apply filters
    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    if (access && access !== "all") {
      query = query.eq("access", access);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: datasets, error } = await query;

    if (error) {
      console.error("Error fetching datasets:", error);
      return NextResponse.json({ error: "Failed to fetch datasets" }, { status: 500 });
    }

    // Get stats from all datasets (unfiltered)
    const { data: allDatasets } = await supabase
      .from("research_datasets")
      .select("category, access");

    const stats = calculateStats(allDatasets || []);

    const response: DatasetsResponse = {
      datasets: datasets || [],
      total: datasets?.length || 0,
      stats,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in datasets API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/datasets
 * Create a new dataset (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = ["name", "slug", "url", "description", "category", "access"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    const { data, error } = await supabase
      .from("research_datasets")
      .insert({
        name: body.name,
        slug: body.slug,
        url: body.url,
        description: body.description,
        category: body.category,
        access: body.access,
        coverage: body.coverage || {},
        granularity: body.granularity || null,
        limitations: body.limitations || null,
        related_publications: body.related_publications || null,
        compatible_with: body.compatible_with || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating dataset:", error);
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Dataset with this slug already exists" },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: "Failed to create dataset" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/datasets:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PATCH /api/datasets?id=xxx
 * Update a dataset (admin only)
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing dataset id" }, { status: 400 });
    }

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    const { data, error } = await supabase
      .from("research_datasets")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating dataset:", error);
      return NextResponse.json({ error: "Failed to update dataset" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Dataset not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in PATCH /api/datasets:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/datasets?id=xxx
 * Delete a dataset (admin only)
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing dataset id" }, { status: 400 });
    }

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error } = await supabase.from("research_datasets").delete().eq("id", id);

    if (error) {
      console.error("Error deleting dataset:", error);
      return NextResponse.json({ error: "Failed to delete dataset" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/datasets:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Helper function to calculate stats
function calculateStats(
  datasets: { category: DatasetCategory; access: DatasetAccess }[]
): DatasetStats {
  const categoryCounts: Record<string, number> = {};
  const accessCounts: Record<string, number> = {};

  datasets.forEach((d) => {
    categoryCounts[d.category] = (categoryCounts[d.category] || 0) + 1;
    accessCounts[d.access] = (accessCounts[d.access] || 0) + 1;
  });

  const byCategory = Object.entries(categoryCounts)
    .map(([category, count]) => ({
      category: category as DatasetCategory,
      label: CATEGORY_LABELS[category as DatasetCategory] || category,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const byAccess = Object.entries(accessCounts)
    .map(([access, count]) => ({
      access: access as DatasetAccess,
      label: ACCESS_LABELS[access as DatasetAccess] || access,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    total: datasets.length,
    byCategory,
    byAccess,
  };
}
