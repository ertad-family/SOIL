import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const WIKIDATA_API_URL = "https://www.wikidata.org/w/api.php";

// Supabase service client for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

interface WikidataSearchResult {
  id: string;
  label: string;
  description?: string;
}

interface WikidataClaim {
  mainsnak?: {
    datavalue?: {
      value?:
        | {
            time?: string; // For dates: "+1943-07-14T00:00:00Z"
          }
        | string; // For strings like ORCID
      type?: string;
    };
  };
}

interface WikidataEntity {
  claims?: {
    P569?: WikidataClaim[]; // Date of birth
    P570?: WikidataClaim[]; // Date of death
    P496?: WikidataClaim[]; // ORCID
  };
}

// Search Wikidata for a person by name
async function searchWikidata(name: string): Promise<WikidataSearchResult | null> {
  const params = new URLSearchParams({
    action: "wbsearchentities",
    search: name,
    language: "en",
    format: "json",
    type: "item",
    limit: "5",
  });

  try {
    const response = await fetch(`${WIKIDATA_API_URL}?${params}`, {
      headers: {
        "User-Agent": "SOIL Research Platform (research@soil.rip)",
      },
    });

    if (!response.ok) {
      console.error(`Wikidata search error for ${name}:`, response.status);
      return null;
    }

    const data = await response.json();
    const results = data.search || [];

    // Look for results that seem to be academics/researchers
    // Prefer results with descriptions mentioning: professor, researcher, scientist, academic, sociologist, etc.
    const academicKeywords = [
      "professor",
      "researcher",
      "scientist",
      "academic",
      "sociologist",
      "economist",
      "psychologist",
      "physicist",
      "biologist",
      "scholar",
      "author",
    ];

    for (const result of results) {
      const desc = (result.description || "").toLowerCase();
      if (academicKeywords.some((kw) => desc.includes(kw))) {
        return {
          id: result.id,
          label: result.label,
          description: result.description,
        };
      }
    }

    // If no academic-looking result, return first result if it's a person
    if (results.length > 0) {
      return {
        id: results[0].id,
        label: results[0].label,
        description: results[0].description,
      };
    }

    return null;
  } catch (error) {
    console.error(`Failed to search Wikidata for ${name}:`, error);
    return null;
  }
}

// Get entity details including birth/death dates
async function getEntityDetails(entityId: string): Promise<{
  birthYear: number | null;
  deathYear: number | null;
  orcid: string | null;
} | null> {
  const params = new URLSearchParams({
    action: "wbgetentities",
    ids: entityId,
    props: "claims",
    format: "json",
  });

  try {
    const response = await fetch(`${WIKIDATA_API_URL}?${params}`, {
      headers: {
        "User-Agent": "SOIL Research Platform (research@soil.rip)",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const entity: WikidataEntity = data.entities?.[entityId];

    if (!entity?.claims) {
      return null;
    }

    // Extract birth year from P569
    let birthYear: number | null = null;
    const birthClaim = entity.claims.P569?.[0];
    if (birthClaim?.mainsnak?.datavalue?.value) {
      const value = birthClaim.mainsnak.datavalue.value;
      if (typeof value === "object" && value.time) {
        // Format: "+1943-07-14T00:00:00Z"
        const match = value.time.match(/^[+-](\d{4})/);
        if (match) {
          birthYear = parseInt(match[1], 10);
        }
      }
    }

    // Extract death year from P570
    let deathYear: number | null = null;
    const deathClaim = entity.claims.P570?.[0];
    if (deathClaim?.mainsnak?.datavalue?.value) {
      const value = deathClaim.mainsnak.datavalue.value;
      if (typeof value === "object" && value.time) {
        const match = value.time.match(/^[+-](\d{4})/);
        if (match) {
          deathYear = parseInt(match[1], 10);
        }
      }
    }

    // Extract ORCID from P496
    let orcid: string | null = null;
    const orcidClaim = entity.claims.P496?.[0];
    if (orcidClaim?.mainsnak?.datavalue?.value) {
      const value = orcidClaim.mainsnak.datavalue.value;
      if (typeof value === "string") {
        orcid = value;
      }
    }

    return { birthYear, deathYear, orcid };
  } catch (error) {
    console.error(`Failed to get entity ${entityId}:`, error);
    return null;
  }
}

export async function POST() {
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Supabase service key not configured" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Get all researchers
    const { data: researchers, error } = await supabase
      .from("researchers")
      .select("id, name, wikidata_id, birth_year, death_year, orcid");

    if (error || !researchers) {
      return NextResponse.json({ error: "Failed to fetch researchers" }, { status: 500 });
    }

    const results: Array<{
      name: string;
      wikidataId: string | null;
      wikidataDescription: string | null;
      birthYear: number | null;
      deathYear: number | null;
      orcid: string | null;
      updated: boolean;
    }> = [];

    // Process each researcher with rate limiting
    for (const researcher of researchers) {
      // Add delay to respect Wikidata rate limits
      await new Promise((resolve) => setTimeout(resolve, 200));

      let wikidataId = researcher.wikidata_id;
      let wikidataDescription: string | null = null;

      // If no stored Wikidata ID, search for it
      if (!wikidataId) {
        const searchResult = await searchWikidata(researcher.name);
        if (searchResult) {
          wikidataId = searchResult.id;
          wikidataDescription = searchResult.description || null;
        }
      }

      if (!wikidataId) {
        results.push({
          name: researcher.name,
          wikidataId: null,
          wikidataDescription: null,
          birthYear: researcher.birth_year || null,
          deathYear: researcher.death_year || null,
          orcid: researcher.orcid || null,
          updated: false,
        });
        continue;
      }

      // Get entity details
      const details = await getEntityDetails(wikidataId);

      if (!details) {
        results.push({
          name: researcher.name,
          wikidataId,
          wikidataDescription,
          birthYear: researcher.birth_year || null,
          deathYear: researcher.death_year || null,
          orcid: researcher.orcid || null,
          updated: false,
        });
        continue;
      }

      // Build update object
      const updateData: Record<string, string | number | null> = {};

      // Store Wikidata ID if not already stored
      if (!researcher.wikidata_id && wikidataId) {
        updateData.wikidata_id = wikidataId;
      }

      // Store birth year if found and not already stored
      if (!researcher.birth_year && details.birthYear) {
        updateData.birth_year = details.birthYear;
      }

      // Store death year if found and not already stored
      if (!researcher.death_year && details.deathYear) {
        updateData.death_year = details.deathYear;
      }

      // Store ORCID if found and not already stored (Wikidata might have it)
      if (!researcher.orcid && details.orcid) {
        updateData.orcid = details.orcid;
      }

      // Update if there's anything to update
      const updated = Object.keys(updateData).length > 0;
      if (updated) {
        await supabase.from("researchers").update(updateData).eq("id", researcher.id);
      }

      results.push({
        name: researcher.name,
        wikidataId,
        wikidataDescription,
        birthYear: details.birthYear || researcher.birth_year || null,
        deathYear: details.deathYear || researcher.death_year || null,
        orcid: details.orcid || researcher.orcid || null,
        updated,
      });
    }

    // Summary statistics
    const matched = results.filter((r) => r.wikidataId).length;
    const withBirthYear = results.filter((r) => r.birthYear).length;
    const withDeathYear = results.filter((r) => r.deathYear).length;
    const updated = results.filter((r) => r.updated).length;

    return NextResponse.json({
      success: true,
      summary: {
        totalResearchers: researchers.length,
        matchedInWikidata: matched,
        withBirthYear,
        withDeathYear,
        recordsUpdated: updated,
      },
      details: results,
    });
  } catch (error) {
    console.error("Sync Wikidata error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Sync failed" },
      { status: 500 }
    );
  }
}
