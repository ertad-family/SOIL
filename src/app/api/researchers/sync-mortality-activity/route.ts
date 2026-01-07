/**
 * Sync Mortality Activity Index
 * Issue #277: Filter out researchers who have pivoted away from organizational mortality research
 *
 * Uses OpenAlex to fetch recent publications and Gemini to analyze mortality-relevance
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";
import { siteConfig } from "@/lib/site-config";

const OPENALEX_BASE_URL = "https://api.openalex.org";

// Supabase service client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Initialize Gemini
const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GOOGLE_CLOUD_PROJECT_ID || "",
  location: process.env.VERTEX_AI_LOCATION || "us-central1",
  googleAuthOptions: {
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "",
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "",
    },
  },
});

const GEMINI_MODEL = "gemini-2.0-flash-001";

interface OpenAlexWork {
  id: string;
  title: string;
  publication_year: number;
  type: string;
}

interface OpenAlexWorksResponse {
  results: OpenAlexWork[];
  meta: {
    count: number;
  };
}

// Rate limiting helper
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch recent works from OpenAlex for an author
 */
async function fetchRecentWorks(openalexId: string): Promise<OpenAlexWork[]> {
  const currentYear = new Date().getFullYear();
  const fiveYearsAgo = currentYear - 5;

  // Extract author ID from full URL if needed
  const authorId = openalexId.replace("https://openalex.org/", "");

  const url = `${OPENALEX_BASE_URL}/works?filter=author.id:${authorId},publication_year:${fiveYearsAgo}-${currentYear}&per_page=50&sort=publication_year:desc&mailto=${siteConfig.emails.research}`;

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      console.error(`OpenAlex works fetch failed for ${authorId}: ${response.status}`);
      return [];
    }

    const data: OpenAlexWorksResponse = await response.json();
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching works for ${authorId}:`, error);
    return [];
  }
}

/**
 * Use Gemini to analyze if publications are mortality-related
 */
async function analyzeMortalityRelevance(
  titles: string[]
): Promise<{ relevant: number[]; totalRelevant: number }> {
  if (titles.length === 0) {
    return { relevant: [], totalRelevant: 0 };
  }

  const prompt = `You are analyzing academic publication titles to determine if they are related to ORGANIZATIONAL MORTALITY research.

ORGANIZATIONAL MORTALITY includes:
- Business/startup failure and closure
- Organizational death, decline, or dissolution
- Company lifespan and survival analysis
- Entrepreneurial failure and exit
- Organizational ecology (liability of newness/aging, density dependence)
- Corporate bankruptcy and restructuring
- Business discontinuation

NOT organizational mortality (these are DIFFERENT topics):
- Entrepreneurial learning (unless specifically about learning from FAILURE)
- Business success factors
- Innovation and growth
- General management/strategy
- Personal mortality/death (medical)
- Employee turnover (unless organizational-level impact)
- Career transitions
- General entrepreneurship without failure focus

Analyze these publication titles and return a JSON array of 1s and 0s.
1 = related to organizational mortality
0 = not related

TITLES:
${titles.map((t, i) => `${i + 1}. ${t}`).join("\n")}

Respond with ONLY a JSON array of numbers, nothing else. Example: [0, 1, 0, 1, 1]`;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        temperature: 0.1, // Low temperature for consistent classification
        maxOutputTokens: 1024,
      },
    });

    const text = response.text?.trim() || "[]";

    // Extract JSON array
    const jsonMatch = text.match(/\[[\d,\s]+\]/);
    if (!jsonMatch) {
      console.error("No JSON array found in Gemini response:", text);
      return { relevant: [], totalRelevant: 0 };
    }

    const relevanceArray: number[] = JSON.parse(jsonMatch[0]);
    const totalRelevant = relevanceArray.filter((r) => r === 1).length;

    return { relevant: relevanceArray, totalRelevant };
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return { relevant: [], totalRelevant: 0 };
  }
}

export async function POST(request: NextRequest) {
  // Validate environment
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Supabase service key not configured" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Parse query params
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : undefined;
  const forceUpdate = searchParams.get("force") === "true";

  try {
    // Fetch researchers with OpenAlex IDs
    let query = supabase
      .from("researchers")
      .select("id, name, openalex_id, mortality_activity_score, mortality_activity_updated_at")
      .not("openalex_id", "is", null)
      .order("name");

    // If not forcing, only get researchers not yet analyzed
    if (!forceUpdate) {
      query = query.is("mortality_activity_updated_at", null);
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
        message: "No researchers need mortality activity analysis",
        summary: { total: 0, analyzed: 0, skipped: 0, errors: 0 },
      });
    }

    console.log(`Analyzing mortality activity for ${researchers.length} researchers...`);

    let analyzed = 0;
    let skipped = 0;
    let errors = 0;
    const results: Array<{
      name: string;
      status: string;
      score?: number;
      recentWorks?: number;
      mortalityWorks?: number;
    }> = [];

    for (const researcher of researchers) {
      // Rate limiting - 300ms between researchers
      await delay(300);

      try {
        if (!researcher.openalex_id) {
          skipped++;
          results.push({ name: researcher.name, status: "skipped_no_openalex" });
          continue;
        }

        // Fetch recent works
        const works = await fetchRecentWorks(researcher.openalex_id);

        if (works.length === 0) {
          // No recent works - score is 0
          const { error: updateError } = await supabase
            .from("researchers")
            .update({
              mortality_activity_score: 0,
              mortality_activity_updated_at: new Date().toISOString(),
              recent_mortality_works: 0,
              last_mortality_publication_year: null,
            })
            .eq("id", researcher.id);

          if (updateError) {
            console.error(`Error updating ${researcher.name}:`, updateError);
            errors++;
            results.push({ name: researcher.name, status: "error" });
            continue;
          }

          analyzed++;
          results.push({
            name: researcher.name,
            status: "analyzed",
            score: 0,
            recentWorks: 0,
            mortalityWorks: 0,
          });
          continue;
        }

        // Analyze works with Gemini
        const titles = works.map((w) => w.title);
        const { relevant, totalRelevant } = await analyzeMortalityRelevance(titles);

        // Calculate score
        const score = Math.round((totalRelevant / works.length) * 100);

        // Find most recent mortality-related publication year
        let lastMortalityYear: number | null = null;
        for (let i = 0; i < works.length; i++) {
          if (relevant[i] === 1) {
            lastMortalityYear = works[i].publication_year;
            break; // Works are sorted by year desc
          }
        }

        // Update researcher
        const { error: updateError } = await supabase
          .from("researchers")
          .update({
            mortality_activity_score: score,
            mortality_activity_updated_at: new Date().toISOString(),
            recent_mortality_works: totalRelevant,
            last_mortality_publication_year: lastMortalityYear,
          })
          .eq("id", researcher.id);

        if (updateError) {
          console.error(`Error updating ${researcher.name}:`, updateError);
          errors++;
          results.push({ name: researcher.name, status: "error" });
          continue;
        }

        analyzed++;
        results.push({
          name: researcher.name,
          status: "analyzed",
          score,
          recentWorks: works.length,
          mortalityWorks: totalRelevant,
        });

        console.log(
          `${researcher.name}: ${totalRelevant}/${works.length} mortality works (score: ${score})`
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
        analyzed,
        skipped,
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
