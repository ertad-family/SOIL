import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const OPENALEX_BASE_URL = "https://api.openalex.org";

// Supabase service client for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

interface OpenAlexTopic {
  id: string;
  display_name: string;
  count: number;
  score: number;
  subfield: {
    id: string;
    display_name: string;
  };
  field: {
    id: string;
    display_name: string;
  };
  domain: {
    id: string;
    display_name: string;
  };
}

interface OpenAlexAuthor {
  id: string;
  display_name: string;
  orcid?: string | null;
  works_count?: number;
  cited_by_count?: number;
  topics?: OpenAlexTopic[];
}

interface OpenAlexResponse {
  results: OpenAlexAuthor[];
  meta: {
    count: number;
  };
}

// Map OpenAlex fields to our discipline categories
// Based on OpenAlex field taxonomy: https://docs.openalex.org/api-entities/topics
const FIELD_TO_DISCIPLINE: Record<string, string> = {
  // Business & Economics
  "Business, Management and Accounting": "economics",
  "Economics, Econometrics and Finance": "economics",
  "Decision Sciences": "economics",

  // Social Sciences
  "Social Sciences": "sociology",
  "Sociology and Political Science": "sociology",
  "Political Science and International Relations": "political_science",
  Anthropology: "anthropology",

  // Psychology
  Psychology: "psychology",
  "Organizational Behavior and Human Resource Management": "psychology",

  // Life Sciences
  "Agricultural and Biological Sciences": "biology",
  "Biochemistry, Genetics and Molecular Biology": "biology",
  "Environmental Science": "ecology",
  "Earth and Planetary Sciences": "ecology",

  // Medicine
  Medicine: "medicine",
  Nursing: "medicine",
  "Health Professions": "medicine",

  // Computer & Systems
  "Computer Science": "information_theory",
  Mathematics: "information_theory",
  Engineering: "cybernetics",

  // Physics & Complex Systems
  "Physics and Astronomy": "systems_theory",
  Multidisciplinary: "systems_theory",
};

// Map subfields for more precision
const SUBFIELD_TO_DISCIPLINE: Record<string, string> = {
  "Strategy and Management": "economics",
  "Organizational Behavior and Human Resource Management": "psychology",
  "Sociology and Political Science": "sociology",
  "Ecological Modeling": "ecology",
  Ecology: "ecology",
  "Ecology, Evolution, Behavior and Systematics": "ecology",
  "Management Science and Operations Research": "economics",
  "Economics and Econometrics": "economics",
  "General Psychology": "psychology",
  "Applied Psychology": "psychology",
  "Social Psychology": "psychology",
  "Statistical and Nonlinear Physics": "systems_theory",
  "General Physics and Astronomy": "systems_theory",
};

function determineDiscipline(topics: OpenAlexTopic[]): string {
  if (!topics || topics.length === 0) {
    return "economics"; // Default fallback for organizational mortality researchers
  }

  // Count discipline votes weighted by topic score
  const disciplineScores: Record<string, number> = {};

  for (const topic of topics.slice(0, 10)) {
    // Check subfield first (more specific)
    let discipline = SUBFIELD_TO_DISCIPLINE[topic.subfield.display_name];

    // Fall back to field
    if (!discipline) {
      discipline = FIELD_TO_DISCIPLINE[topic.field.display_name];
    }

    if (discipline) {
      disciplineScores[discipline] = (disciplineScores[discipline] || 0) + topic.score;
    }
  }

  // Return discipline with highest score
  const sorted = Object.entries(disciplineScores).sort((a, b) => b[1] - a[1]);

  if (sorted.length > 0) {
    return sorted[0][0];
  }

  return "economics"; // Default for business/management researchers
}

// Extract OpenAlex ID from full URL (e.g., "https://openalex.org/A5109978106" -> "A5109978106")
function extractOpenAlexId(fullId: string): string {
  return fullId.replace("https://openalex.org/", "");
}

// Fetch author by stored OpenAlex ID (reliable) or by name search (fallback)
async function fetchOpenAlexAuthor(
  name: string,
  storedOpenAlexId?: string | null
): Promise<OpenAlexAuthor | null> {
  try {
    // If we have a stored OpenAlex ID, use direct lookup (more reliable)
    if (storedOpenAlexId) {
      const directUrl = `${OPENALEX_BASE_URL}/authors/${storedOpenAlexId}?mailto=research@soil.rip`;
      const response = await fetch(directUrl, {
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        return await response.json();
      }
      // If direct lookup fails, fall back to search
    }

    // Search by name
    const searchQuery = encodeURIComponent(name);
    const searchUrl = `${OPENALEX_BASE_URL}/authors?search=${searchQuery}&per_page=1&mailto=research@soil.rip`;

    const response = await fetch(searchUrl, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      console.error(`OpenAlex error for ${name}:`, response.status);
      return null;
    }

    const data: OpenAlexResponse = await response.json();

    if (data.results.length === 0) {
      return null;
    }

    return data.results[0];
  } catch (error) {
    console.error(`Failed to fetch OpenAlex for ${name}:`, error);
    return null;
  }
}

export async function POST() {
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Supabase service key not configured" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Get all researchers with their stored identifiers
    const { data: researchers, error } = await supabase
      .from("researchers")
      .select("id, name, discipline, openalex_id, orcid");

    if (error || !researchers) {
      return NextResponse.json({ error: "Failed to fetch researchers" }, { status: 500 });
    }

    const results: Array<{
      name: string;
      oldDiscipline: string;
      newDiscipline: string;
      openAlexMatch: boolean;
      openAlexId: string | null;
      orcid: string | null;
      topTopics: string[];
    }> = [];

    // Process each researcher with rate limiting
    for (const researcher of researchers) {
      // Add small delay to respect OpenAlex rate limits
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Use stored OpenAlex ID if available, otherwise search by name
      const openAlexAuthor = await fetchOpenAlexAuthor(researcher.name, researcher.openalex_id);

      if (openAlexAuthor && openAlexAuthor.topics) {
        const newDiscipline = determineDiscipline(openAlexAuthor.topics);
        const openAlexId = extractOpenAlexId(openAlexAuthor.id);
        const orcid = openAlexAuthor.orcid || null;
        const worksCount = openAlexAuthor.works_count || 0;
        const citedByCount = openAlexAuthor.cited_by_count || 0;

        // Build update object with discipline, identifiers, and metrics
        const updateData: Record<string, string | number | null> = {};

        if (newDiscipline !== researcher.discipline) {
          updateData.discipline = newDiscipline;
        }

        // Store OpenAlex ID if not already stored
        if (!researcher.openalex_id && openAlexId) {
          updateData.openalex_id = openAlexId;
        }

        // Store ORCID if found and not already stored
        if (!researcher.orcid && orcid) {
          updateData.orcid = orcid;
        }

        // Always update OpenAlex metrics
        updateData.openalex_works_count = worksCount;
        updateData.openalex_cited_by_count = citedByCount;

        // Update researcher
        await supabase.from("researchers").update(updateData).eq("id", researcher.id);

        results.push({
          name: researcher.name,
          oldDiscipline: researcher.discipline,
          newDiscipline,
          openAlexMatch: true,
          openAlexId,
          orcid,
          topTopics: openAlexAuthor.topics.slice(0, 3).map((t) => t.display_name),
        });
      } else {
        results.push({
          name: researcher.name,
          oldDiscipline: researcher.discipline,
          newDiscipline: researcher.discipline, // Keep existing
          openAlexMatch: false,
          openAlexId: researcher.openalex_id || null,
          orcid: researcher.orcid || null,
          topTopics: [],
        });
      }
    }

    // Summary statistics
    const matched = results.filter((r) => r.openAlexMatch).length;
    const changed = results.filter((r) => r.oldDiscipline !== r.newDiscipline).length;
    const withOpenAlexId = results.filter((r) => r.openAlexId).length;
    const withOrcid = results.filter((r) => r.orcid).length;

    return NextResponse.json({
      success: true,
      summary: {
        totalResearchers: researchers.length,
        matchedInOpenAlex: matched,
        disciplinesUpdated: changed,
        withOpenAlexId,
        withOrcid,
      },
      details: results,
    });
  } catch (error) {
    console.error("Sync disciplines error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Sync failed" },
      { status: 500 }
    );
  }
}
