import { NextRequest, NextResponse } from "next/server";
import { createAnonClient } from "@/lib/supabase/anon";
import { createClient } from "@/lib/supabase/server";

// Types
export type PathologyLocalization = "LP" | "SP" | "FP" | "CP" | "MP" | "OP";
export type PathologyEtiology = "ETI-F" | "ETI-M" | "ETI-C" | "ETI-R" | "ETI-T" | "ETI-S" | "ETI-I";
export type PathologyCourse = "ACU" | "CHR" | "REL" | "LAT";
export type PathologyFunctionalImpairment =
  | "SEN"
  | "PER"
  | "COG"
  | "AFF"
  | "EXE"
  | "VOL"
  | "MEM"
  | "IDE";

export interface Pathology {
  id: string;
  code: string;
  slug: string;
  name: string;
  alternative_names: string[];
  definition: string;
  localization: PathologyLocalization;
  primary_etiology: PathologyEtiology;
  typical_course: PathologyCourse;
  functional_impairment: PathologyFunctionalImpairment | null;
  diagnostic_criteria: string[];
  symptoms: string[];
  stages: string[];
  course_description: string | null;
  etiology_explanation: string | null;
  risk_factors: string[];
  differential_diagnosis: string[];
  prognosis: string | null;
  known_cases: string[];
  literature_references: string[];
  key_authors: string[];
  related_lexicon_terms: string[];
  // Primary source citation fields
  primary_source_title: string | null;
  primary_source_authors: string | null;
  primary_source_year: number | null;
  primary_source_journal: string | null;
  primary_source_doi: string | null;
  primary_source_url: string | null;
  primary_source_abstract: string | null;
  // Zotero integration
  zotero_item_key: string | null;
  created_at: string;
  updated_at: string;
}

export interface PathologyStats {
  total: number;
  byLocalization: { localization: PathologyLocalization; label: string; count: number }[];
  byEtiology: { etiology: PathologyEtiology; label: string; count: number }[];
  byCourse: { course: PathologyCourse; label: string; count: number }[];
}

interface PathologiesResponse {
  pathologies: Pathology[];
  total: number;
  stats: PathologyStats;
}

// Display labels
export const LOCALIZATION_LABELS: Record<PathologyLocalization, string> = {
  LP: "Leadership",
  SP: "Structural",
  FP: "Financial",
  CP: "Cultural",
  MP: "Market",
  OP: "Operational",
};

export const ETIOLOGY_LABELS: Record<PathologyEtiology, string> = {
  "ETI-F": "Founder-induced",
  "ETI-M": "Market-induced",
  "ETI-C": "Competition-induced",
  "ETI-R": "Regulatory-induced",
  "ETI-T": "Technology-induced",
  "ETI-S": "Stochastic",
  "ETI-I": "Iatrogenic (success-induced)",
};

export const COURSE_LABELS: Record<PathologyCourse, string> = {
  ACU: "Acute",
  CHR: "Chronic",
  REL: "Relapsing",
  LAT: "Latent",
};

export const FUNCTIONAL_IMPAIRMENT_LABELS: Record<PathologyFunctionalImpairment, string> = {
  SEN: "Sensing",
  PER: "Perception",
  COG: "Cognition",
  AFF: "Affect",
  EXE: "Executive",
  VOL: "Volition",
  MEM: "Memory",
  IDE: "Identity",
};

/**
 * GET /api/pathologies
 * Query params:
 * - action=stats: Return only stats
 * - localization: Filter by localization (LP, SP, FP, CP, MP, OP)
 * - etiology: Filter by primary etiology
 * - course: Filter by typical course
 * - search: Search in name and definition
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createAnonClient();
    const { searchParams } = new URL(request.url);

    const action = searchParams.get("action");
    const localization = searchParams.get("localization");
    const etiology = searchParams.get("etiology");
    const course = searchParams.get("course");
    const search = searchParams.get("search");

    // If only stats requested
    if (action === "stats") {
      const { data: allPathologies, error } = await supabase
        .from("pathology_classification")
        .select("localization, primary_etiology, typical_course");

      if (error) {
        console.error("Error fetching pathology stats:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
      }

      const stats = calculateStats(allPathologies || []);
      return NextResponse.json(stats);
    }

    // Build query for pathologies
    let query = supabase
      .from("pathology_classification")
      .select("*")
      .order("code", { ascending: true });

    // Apply filters
    if (localization && localization !== "all") {
      query = query.eq("localization", localization);
    }

    if (etiology && etiology !== "all") {
      query = query.eq("primary_etiology", etiology);
    }

    if (course && course !== "all") {
      query = query.eq("typical_course", course);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,definition.ilike.%${search}%`);
    }

    const { data: pathologies, error } = await query;

    if (error) {
      console.error("Error fetching pathologies:", error);
      return NextResponse.json({ error: "Failed to fetch pathologies" }, { status: 500 });
    }

    // Get stats from all pathologies (unfiltered)
    const { data: allPathologies } = await supabase
      .from("pathology_classification")
      .select("localization, primary_etiology, typical_course");

    const stats = calculateStats(allPathologies || []);

    const response: PathologiesResponse = {
      pathologies: pathologies || [],
      total: pathologies?.length || 0,
      stats,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in pathologies API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/pathologies
 * Create a new pathology (admin only)
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
    const requiredFields = [
      "code",
      "slug",
      "name",
      "definition",
      "localization",
      "primary_etiology",
      "typical_course",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    const { data, error } = await supabase
      .from("pathology_classification")
      .insert({
        code: body.code,
        slug: body.slug,
        name: body.name,
        alternative_names: body.alternative_names || [],
        definition: body.definition,
        localization: body.localization,
        primary_etiology: body.primary_etiology,
        typical_course: body.typical_course,
        functional_impairment: body.functional_impairment || null,
        diagnostic_criteria: body.diagnostic_criteria || [],
        symptoms: body.symptoms || [],
        stages: body.stages || [],
        course_description: body.course_description || null,
        etiology_explanation: body.etiology_explanation || null,
        risk_factors: body.risk_factors || [],
        differential_diagnosis: body.differential_diagnosis || [],
        prognosis: body.prognosis || null,
        known_cases: body.known_cases || [],
        literature_references: body.literature_references || [],
        key_authors: body.key_authors || [],
        related_lexicon_terms: body.related_lexicon_terms || [],
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating pathology:", error);
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Pathology with this code or slug already exists" },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: "Failed to create pathology" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/pathologies:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PATCH /api/pathologies?id=xxx
 * Update a pathology (admin only)
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing pathology id" }, { status: 400 });
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
      .from("pathology_classification")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating pathology:", error);
      return NextResponse.json({ error: "Failed to update pathology" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Pathology not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in PATCH /api/pathologies:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/pathologies?id=xxx
 * Delete a pathology (admin only)
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing pathology id" }, { status: 400 });
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

    const { error } = await supabase.from("pathology_classification").delete().eq("id", id);

    if (error) {
      console.error("Error deleting pathology:", error);
      return NextResponse.json({ error: "Failed to delete pathology" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/pathologies:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Helper function to calculate stats
function calculateStats(
  pathologies: {
    localization: PathologyLocalization;
    primary_etiology: PathologyEtiology;
    typical_course: PathologyCourse;
  }[]
): PathologyStats {
  const localizationCounts: Record<string, number> = {};
  const etiologyCounts: Record<string, number> = {};
  const courseCounts: Record<string, number> = {};

  pathologies.forEach((p) => {
    localizationCounts[p.localization] = (localizationCounts[p.localization] || 0) + 1;
    etiologyCounts[p.primary_etiology] = (etiologyCounts[p.primary_etiology] || 0) + 1;
    courseCounts[p.typical_course] = (courseCounts[p.typical_course] || 0) + 1;
  });

  const byLocalization = Object.entries(localizationCounts)
    .map(([localization, count]) => ({
      localization: localization as PathologyLocalization,
      label: LOCALIZATION_LABELS[localization as PathologyLocalization] || localization,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const byEtiology = Object.entries(etiologyCounts)
    .map(([etiology, count]) => ({
      etiology: etiology as PathologyEtiology,
      label: ETIOLOGY_LABELS[etiology as PathologyEtiology] || etiology,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const byCourse = Object.entries(courseCounts)
    .map(([course, count]) => ({
      course: course as PathologyCourse,
      label: COURSE_LABELS[course as PathologyCourse] || course,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    total: pathologies.length,
    byLocalization,
    byEtiology,
    byCourse,
  };
}
