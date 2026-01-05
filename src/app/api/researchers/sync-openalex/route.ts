import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const OPENALEX_BASE_URL = "https://api.openalex.org";

// Supabase service client for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

interface OpenAlexAuthor {
  id: string;
  display_name: string;
  works_count: number;
  cited_by_count: number;
  affiliations?: Array<{
    institution: {
      id: string;
      display_name: string;
      country_code: string;
    };
    years: number[];
  }>;
}

interface OpenAlexSearchResponse {
  results: OpenAlexAuthor[];
  meta: {
    count: number;
  };
}

// Rate limiting helper
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Fetch author from OpenAlex by ID (direct lookup)
async function fetchAuthorById(openalexId: string): Promise<OpenAlexAuthor | null> {
  try {
    const url = `${OPENALEX_BASE_URL}/authors/${openalexId}?mailto=research@soil.rip`;
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      console.error(`OpenAlex direct lookup failed for ${openalexId}: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching author by ID ${openalexId}:`, error);
    return null;
  }
}

// Search author by name in OpenAlex
async function searchAuthorByName(name: string): Promise<OpenAlexAuthor | null> {
  try {
    const searchQuery = encodeURIComponent(name);
    const url = `${OPENALEX_BASE_URL}/authors?search=${searchQuery}&per_page=5&mailto=research@soil.rip`;
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      console.error(`OpenAlex search failed for "${name}": ${response.status}`);
      return null;
    }

    const data: OpenAlexSearchResponse = await response.json();

    if (data.results.length === 0) {
      return null;
    }

    // Return the best match (first result, or exact name match if found)
    const exactMatch = data.results.find(
      (r) => r.display_name.toLowerCase() === name.toLowerCase()
    );
    return exactMatch || data.results[0];
  } catch (error) {
    console.error(`Error searching author "${name}":`, error);
    return null;
  }
}

// Extract institution from OpenAlex affiliations (most recent)
function extractInstitution(author: OpenAlexAuthor): string | null {
  if (!author.affiliations || author.affiliations.length === 0) {
    return null;
  }

  // Sort by most recent year and get first institution
  const sorted = [...author.affiliations].sort((a, b) => {
    const aMaxYear = Math.max(...(a.years || [0]));
    const bMaxYear = Math.max(...(b.years || [0]));
    return bMaxYear - aMaxYear;
  });

  return sorted[0]?.institution?.display_name || null;
}

export async function POST(request: NextRequest) {
  // Validate environment
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Supabase service key not configured" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Parse query params
  const { searchParams } = new URL(request.url);
  const forceUpdate = searchParams.get("force") === "true";
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : undefined;

  try {
    // Fetch all researchers
    let query = supabase
      .from("researchers")
      .select("id, name, institution, openalex_id, openalex_works_count, openalex_cited_by_count")
      .order("name");

    // If not forcing update, only get researchers with Unknown institution
    if (!forceUpdate) {
      query = query.eq("institution", "Unknown");
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data: researchers, error } = await query;

    if (error) {
      console.error("Error fetching researchers:", error);
      return NextResponse.json({ error: "Failed to fetch researchers" }, { status: 500 });
    }

    if (!researchers || researchers.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No researchers need updating",
        summary: {
          total: 0,
          updated: 0,
          skipped: 0,
          notFound: 0,
          errors: 0,
        },
      });
    }

    console.log(`Processing ${researchers.length} researchers...`);

    // Process each researcher
    let updated = 0;
    let skipped = 0;
    let notFound = 0;
    let errors = 0;
    const results: Array<{ name: string; status: string; institution?: string }> = [];

    for (const researcher of researchers) {
      // Rate limiting - 200ms between requests
      await delay(200);

      try {
        let author: OpenAlexAuthor | null = null;

        // Try direct lookup first if we have an OpenAlex ID
        if (researcher.openalex_id) {
          author = await fetchAuthorById(researcher.openalex_id);
        }

        // Fall back to name search
        if (!author) {
          author = await searchAuthorByName(researcher.name);
        }

        if (!author) {
          console.log(`No OpenAlex match found for: ${researcher.name}`);
          notFound++;
          results.push({ name: researcher.name, status: "not_found" });
          continue;
        }

        // Extract institution
        const institution = extractInstitution(author);

        // Prepare update data
        const updateData: Record<string, string | number> = {
          openalex_works_count: author.works_count,
          openalex_cited_by_count: author.cited_by_count,
        };

        // Update openalex_id if not already set
        if (!researcher.openalex_id) {
          updateData.openalex_id = author.id;
        }

        // Update institution if found and currently Unknown (or force update)
        if (institution && (researcher.institution === "Unknown" || forceUpdate)) {
          updateData.institution = institution;
        }

        // Check if there's anything to update
        const hasChanges =
          updateData.institution !== undefined ||
          updateData.openalex_id !== undefined ||
          researcher.openalex_works_count !== author.works_count ||
          researcher.openalex_cited_by_count !== author.cited_by_count;

        if (!hasChanges) {
          skipped++;
          results.push({
            name: researcher.name,
            status: "skipped",
            institution: researcher.institution,
          });
          continue;
        }

        // Update researcher
        const { error: updateError } = await supabase
          .from("researchers")
          .update(updateData)
          .eq("id", researcher.id);

        if (updateError) {
          console.error(`Error updating ${researcher.name}:`, updateError);
          errors++;
          results.push({ name: researcher.name, status: "error" });
          continue;
        }

        updated++;
        results.push({
          name: researcher.name,
          status: "updated",
          institution: (updateData.institution as string) || researcher.institution,
        });
        console.log(
          `Updated: ${researcher.name} -> ${updateData.institution || "(no institution change)"}`
        );
      } catch (error) {
        console.error(`Error processing ${researcher.name}:`, error);
        errors++;
        results.push({ name: researcher.name, status: "error" });
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        total: researchers.length,
        updated,
        skipped,
        notFound,
        errors,
      },
      results,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Sync failed" },
      { status: 500 }
    );
  }
}
