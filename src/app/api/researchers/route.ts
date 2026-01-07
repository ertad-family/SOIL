import { NextRequest, NextResponse } from "next/server";
import { createAnonClient } from "@/lib/supabase/anon";

// Public researcher type (excludes internal fields)
export interface ResearcherPublic {
  id: string;
  name: string;
  institution: string;
  discipline: string;
  bio: string | null;
  website_url: string | null;
  publication_count: number;
  zotero_creator_name: string | null;
  birth_year: number | null;
  death_year: number | null;
  openalex_works_count: number;
  openalex_cited_by_count: number;
  university_id: string | null;
  parent_university_name: string | null; // For clustering sub-units with parent
}

// Connection type for graph edges
export interface ResearcherConnection {
  id: string;
  researcher_a_id: string;
  researcher_b_id: string;
  connection_type: string;
  label: string | null;
  is_auto_detected: boolean;
}

interface ResearchersResponse {
  researchers: ResearcherPublic[];
  connections?: ResearcherConnection[];
  total: number;
  disciplines: { discipline: string; label: string; count: number }[];
}

// Discipline display names
const DISCIPLINE_LABELS: Record<string, string> = {
  biology: "Biology",
  ecology: "Ecology",
  economics: "Economics",
  sociology: "Sociology",
  psychology: "Psychology",
  political_science: "Political Science",
  anthropology: "Anthropology",
  cybernetics: "Cybernetics",
  systems_theory: "Systems Theory",
  information_theory: "Information Theory",
  evolutionary_theory: "Evolutionary Theory",
  medicine: "Medicine",
};

export async function GET(request: NextRequest) {
  try {
    const supabase = createAnonClient();
    const { searchParams } = new URL(request.url);

    const discipline = searchParams.get("discipline");
    const search = searchParams.get("search");
    const includeConnections = searchParams.get("include") === "connections";

    // Build query - select only public fields (exclude tier, soil_relevance, consent_status, email)
    let query = supabase
      .from("researchers")
      .select(
        `id, name, institution, discipline, bio, website_url, publication_count, zotero_creator_name, birth_year, death_year, openalex_works_count, openalex_cited_by_count, university_id`
      )
      .order("publication_count", { ascending: false, nullsFirst: false })
      .order("name", { ascending: true });

    // Filter by discipline if provided
    if (discipline && discipline !== "all") {
      query = query.eq("discipline", discipline);
    }

    // Search by name if provided
    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const { data: researchers, error } = await query;

    if (error) {
      console.error("Error fetching researchers:", error);
      return NextResponse.json({ error: "Failed to fetch researchers" }, { status: 500 });
    }

    // Get discipline counts (from all researchers, not filtered)
    const { data: allResearchers } = await supabase.from("researchers").select("discipline");

    const disciplineCounts: Record<string, number> = {};
    allResearchers?.forEach((r) => {
      disciplineCounts[r.discipline] = (disciplineCounts[r.discipline] || 0) + 1;
    });

    const disciplines = Object.entries(disciplineCounts)
      .map(([discipline, count]) => ({
        discipline,
        label: DISCIPLINE_LABELS[discipline] || discipline,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    // Fetch universities with parent info for clustering
    const { data: universities } = await supabase
      .from("universities")
      .select("id, name, parent_id");

    // Create lookup maps for university -> parent name
    const universityNameMap = new Map<string, string>();
    const universityParentMap = new Map<string, string | null>();

    universities?.forEach((u) => {
      universityNameMap.set(u.id, u.name);
      universityParentMap.set(u.id, u.parent_id);
    });

    // Helper to get parent university name (or own name if no parent)
    const getParentUniversityName = (universityId: string | null): string | null => {
      if (!universityId) return null;
      const parentId = universityParentMap.get(universityId);
      if (parentId) {
        return universityNameMap.get(parentId) || null;
      }
      return universityNameMap.get(universityId) || null;
    };

    const response: ResearchersResponse = {
      researchers: (researchers || []).map((r) => {
        // Get parent university name for clustering
        const parentUniversityName = getParentUniversityName(r.university_id);

        return {
          id: r.id,
          name: r.name,
          institution: r.institution,
          discipline: r.discipline,
          bio: r.bio,
          website_url: r.website_url,
          publication_count: r.publication_count || 0,
          zotero_creator_name: r.zotero_creator_name,
          birth_year: r.birth_year,
          death_year: r.death_year,
          openalex_works_count: r.openalex_works_count || 0,
          openalex_cited_by_count: r.openalex_cited_by_count || 0,
          university_id: r.university_id,
          parent_university_name: parentUniversityName,
        };
      }),
      total: researchers?.length || 0,
      disciplines,
    };

    // Optionally include connections for graph view
    if (includeConnections) {
      const { data: connections, error: connError } = await supabase
        .from("researcher_connections")
        .select("id, researcher_a_id, researcher_b_id, connection_type, label, is_auto_detected");

      if (connError) {
        console.error("Error fetching connections:", connError);
      } else {
        response.connections = connections || [];
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in researchers API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
