import { NextRequest, NextResponse } from "next/server";
import { createAnonClient } from "@/lib/supabase/anon";
import { siteConfig } from "@/lib/site-config";

const OPENALEX_BASE_URL = "https://api.openalex.org";

interface OpenAlexAuthor {
  id: string;
  display_name: string;
  orcid?: string;
  works_count: number;
  cited_by_count: number;
  summary_stats?: {
    h_index: number;
    i10_index: number;
  };
  affiliations?: Array<{
    institution: {
      display_name: string;
      country_code: string;
    };
    years: number[];
  }>;
  x_concepts?: Array<{
    display_name: string;
    level: number;
    score: number;
  }>;
}

interface OpenAlexResponse {
  results: OpenAlexAuthor[];
  meta: {
    count: number;
  };
}

interface ResearcherOpenAlexData {
  openalex_id: string | null;
  works_count: number;
  cited_by_count: number;
  h_index: number | null;
  i10_index: number | null;
  top_concepts: string[];
  profile_url: string | null;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    // Get researcher's name and stored OpenAlex ID from database
    const supabase = createAnonClient();
    const { data: researcher, error } = await supabase
      .from("researchers")
      .select("id, name, institution, openalex_id")
      .eq("id", id)
      .single();

    if (error || !researcher) {
      return NextResponse.json({ error: "Researcher not found" }, { status: 404 });
    }

    let author: OpenAlexAuthor | null = null;
    let matchConfidence: "high" | "medium" | "stored" = "medium";

    // If we have a stored OpenAlex ID, use direct lookup (most reliable)
    if (researcher.openalex_id) {
      const directUrl = `${OPENALEX_BASE_URL}/authors/${researcher.openalex_id}?mailto=${siteConfig.emails.research}`;
      const response = await fetch(directUrl, {
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        author = await response.json();
        matchConfidence = "stored"; // Stored ID = verified match
      }
    }

    // Fall back to name search if direct lookup failed or no stored ID
    if (!author) {
      const searchQuery = encodeURIComponent(researcher.name);
      const searchUrl = `${OPENALEX_BASE_URL}/authors?search=${searchQuery}&per_page=5&mailto=${siteConfig.emails.research}`;

      const response = await fetch(searchUrl, {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        console.error("OpenAlex API error:", response.status, await response.text());
        return NextResponse.json({ error: "OpenAlex API error" }, { status: 500 });
      }

      const data: OpenAlexResponse = await response.json();

      if (data.results.length > 0) {
        author = data.results[0];
        matchConfidence =
          author.display_name.toLowerCase() === researcher.name.toLowerCase() ? "high" : "medium";
      }
    }

    if (!author) {
      // No match found - return empty data
      return NextResponse.json({
        data: {
          openalex_id: null,
          works_count: 0,
          cited_by_count: 0,
          h_index: null,
          i10_index: null,
          top_concepts: [],
          profile_url: null,
        } as ResearcherOpenAlexData,
        matched: false,
      });
    }

    // Extract top concepts (level 1 or 2 with high scores)
    const topConcepts =
      author.x_concepts
        ?.filter((c) => c.level <= 2 && c.score > 30)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((c) => c.display_name) || [];

    const result: ResearcherOpenAlexData = {
      openalex_id: author.id,
      works_count: author.works_count,
      cited_by_count: author.cited_by_count,
      h_index: author.summary_stats?.h_index || null,
      i10_index: author.summary_stats?.i10_index || null,
      top_concepts: topConcepts,
      profile_url: author.id
        ? `https://openalex.org/authors/${author.id.replace("https://openalex.org/", "")}`
        : null,
    };

    return NextResponse.json({
      data: result,
      matched: true,
      match_confidence: matchConfidence,
    });
  } catch (error) {
    console.error("Error fetching OpenAlex data:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch OpenAlex data" },
      { status: 500 }
    );
  }
}
