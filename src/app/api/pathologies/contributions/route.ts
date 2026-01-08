import { NextRequest, NextResponse } from "next/server";
import { createAnonClient } from "@/lib/supabase/anon";
import { createClient } from "@/lib/supabase/server";

// Types
export type ContributionType = "new_pathology" | "edit_pathology" | "add_case" | "add_reference";
export type ContributionStatus =
  | "pending"
  | "under_review"
  | "needs_revision"
  | "approved"
  | "rejected";

export interface Contribution {
  id: string;
  contribution_type: ContributionType;
  target_pathology_id: string | null;
  contributor_name: string;
  contributor_email: string;
  contributor_affiliation: string | null;
  contributor_user_id: string | null;
  proposed_data: Record<string, unknown>;
  rationale: string;
  supporting_references: string[];
  zotero_item_keys: string[];
  status: ContributionStatus;
  reviewer_id: string | null;
  reviewer_notes: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

// Validation for proposed pathology data
interface ProposedPathologyData {
  name: string;
  definition: string;
  localization: string;
  primary_etiology: string;
  typical_course: string;
  alternative_names?: string[];
  diagnostic_criteria?: string[];
  symptoms?: string[];
  stages?: string[];
  risk_factors?: string[];
  known_cases?: string[];
}

function validateProposedData(
  type: ContributionType,
  data: Record<string, unknown>
): string | null {
  if (type === "new_pathology") {
    const required = ["name", "definition", "localization", "primary_etiology", "typical_course"];
    for (const field of required) {
      if (!data[field]) {
        return `Missing required field: ${field}`;
      }
    }
    // Validate enums (allow "OTHER: custom text" format for proposals)
    const localization = data.localization as string;
    const validLocalizations = ["LP", "SP", "FP", "CP", "MP", "OP"];
    const isValidLocalization =
      validLocalizations.includes(localization) || localization.startsWith("OTHER:");
    if (!isValidLocalization) {
      return `Invalid localization. Must be one of: ${validLocalizations.join(", ")} or "OTHER: description"`;
    }

    const etiology = data.primary_etiology as string;
    const validEtiologies = ["ETI-F", "ETI-M", "ETI-C", "ETI-R", "ETI-T", "ETI-S"];
    const isValidEtiology = validEtiologies.includes(etiology) || etiology.startsWith("OTHER:");
    if (!isValidEtiology) {
      return `Invalid etiology. Must be one of: ${validEtiologies.join(", ")} or "OTHER: description"`;
    }

    const course = data.typical_course as string;
    const validCourses = ["ACU", "CHR", "REL", "LAT"];
    const isValidCourse = validCourses.includes(course) || course.startsWith("OTHER:");
    if (!isValidCourse) {
      return `Invalid course. Must be one of: ${validCourses.join(", ")} or "OTHER: description"`;
    }
  }

  if (type === "add_case" || type === "add_reference") {
    if (!data.content) {
      return "Missing content for case/reference";
    }
  }

  return null;
}

/**
 * POST /api/pathologies/contributions
 * Submit a new contribution
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createAnonClient();
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "contribution_type",
      "contributor_name",
      "contributor_email",
      "proposed_data",
      "rationale",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.contributor_email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Validate contribution type
    const validTypes: ContributionType[] = [
      "new_pathology",
      "edit_pathology",
      "add_case",
      "add_reference",
    ];
    if (!validTypes.includes(body.contribution_type)) {
      return NextResponse.json({ error: "Invalid contribution type" }, { status: 400 });
    }

    // For edit/add types, target_pathology_id is required
    if (["edit_pathology", "add_case", "add_reference"].includes(body.contribution_type)) {
      if (!body.target_pathology_id) {
        return NextResponse.json(
          { error: "target_pathology_id required for this contribution type" },
          { status: 400 }
        );
      }
    }

    // Validate proposed data structure
    const dataError = validateProposedData(body.contribution_type, body.proposed_data);
    if (dataError) {
      return NextResponse.json({ error: dataError }, { status: 400 });
    }

    // Insert contribution (don't use .select() as anon users can't read their own row due to RLS)
    const { error } = await supabase.from("pathology_contributions").insert({
      contribution_type: body.contribution_type,
      target_pathology_id: body.target_pathology_id || null,
      contributor_name: body.contributor_name,
      contributor_email: body.contributor_email,
      contributor_affiliation: body.contributor_affiliation || null,
      proposed_data: body.proposed_data,
      rationale: body.rationale,
      supporting_references: body.supporting_references || [],
      zotero_item_keys: body.zotero_item_keys || [],
      status: "pending",
    });

    if (error) {
      console.error("Error creating contribution:", error);
      return NextResponse.json({ error: "Failed to submit contribution" }, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your contribution! It will be reviewed by our maintainers.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/pathologies/contributions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * GET /api/pathologies/contributions
 * List contributions (admin only, or own contributions)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const email = searchParams.get("email");

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let isAdmin = false;
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      isAdmin = profile?.role === "admin";
    }

    // Build query
    let query = supabase
      .from("pathology_contributions")
      .select(
        `
        *,
        target_pathology:pathology_classification(code, name, slug)
      `
      )
      .order("created_at", { ascending: false });

    // Non-admins can only see their own contributions
    if (!isAdmin) {
      if (!email) {
        return NextResponse.json(
          { error: "Email required to view contributions" },
          { status: 400 }
        );
      }
      query = query.eq("contributor_email", email);
    }

    // Apply filters
    if (status && status !== "all") {
      query = query.eq("status", status);
    }
    if (type && type !== "all") {
      query = query.eq("contribution_type", type);
    }

    const { data: contributions, error } = await query;

    if (error) {
      console.error("Error fetching contributions:", error);
      return NextResponse.json({ error: "Failed to fetch contributions" }, { status: 500 });
    }

    return NextResponse.json({
      contributions: contributions || [],
      total: contributions?.length || 0,
      isAdmin,
    });
  } catch (error) {
    console.error("Error in GET /api/pathologies/contributions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PATCH /api/pathologies/contributions?id=xxx
 * Update contribution status (admin only)
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing contribution id" }, { status: 400 });
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

    // Validate status
    const validStatuses: ContributionStatus[] = [
      "pending",
      "under_review",
      "needs_revision",
      "approved",
      "rejected",
    ];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Update contribution
    const updateData: Record<string, unknown> = {};
    if (body.status) updateData.status = body.status;
    if (body.reviewer_notes !== undefined) updateData.reviewer_notes = body.reviewer_notes;

    // Set review metadata
    if (body.status && body.status !== "pending") {
      updateData.reviewer_id = user.id;
      updateData.reviewed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("pathology_contributions")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating contribution:", error);
      return NextResponse.json({ error: "Failed to update contribution" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in PATCH /api/pathologies/contributions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
