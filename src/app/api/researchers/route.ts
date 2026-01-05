import { NextRequest, NextResponse } from "next/server";
import { createAnonClient } from "@/lib/supabase/anon";

// Types for researchers
export interface Researcher {
  id: string;
  name: string;
  institution: string;
  discipline: string;
  tier: number;
  bio: string | null;
  key_works: string[] | null;
  soil_relevance: string | null;
  website_url: string | null;
  consent_status: "pending" | "opted_in" | "declined";
}

interface ResearchersResponse {
  researchers: Researcher[];
  total: number;
  disciplines: { discipline: string; count: number }[];
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

    // Build query
    let query = supabase
      .from("researchers")
      .select("*")
      .order("tier", { ascending: true })
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

    // Get discipline counts
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

    const response: ResearchersResponse = {
      researchers: researchers || [],
      total: researchers?.length || 0,
      disciplines,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in researchers API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
