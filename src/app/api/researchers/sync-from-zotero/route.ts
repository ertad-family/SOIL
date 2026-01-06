import { NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const ZOTERO_API_KEY = process.env.ZOTERO_API_KEY;
const ZOTERO_GROUP_ID = process.env.ZOTERO_GROUP_ID || "6367540";
const ZOTERO_BASE_URL = "https://api.zotero.org";

// Supabase service client for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

interface ZoteroCreator {
  creatorType: string;
  firstName?: string;
  lastName?: string;
  name?: string;
}

interface ZoteroItem {
  key: string;
  data: {
    key: string;
    itemType: string;
    title: string;
    creators: ZoteroCreator[];
    date?: string;
  };
}

interface AuthorInfo {
  displayName: string;
  normalizedName: string;
  publications: { key: string; title: string; coauthors: string[] }[];
}

// Retry helper for transient errors
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const isRetryable =
        lastError.message.includes("fetch failed") ||
        lastError.message.includes("timeout") ||
        lastError.message.includes("ETIMEDOUT") ||
        lastError.message.includes("ECONNRESET");

      if (!isRetryable || attempt === maxRetries - 1) {
        throw lastError;
      }

      console.log(`Retry ${attempt + 1}/${maxRetries} after error: ${lastError.message}`);
      await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
    }
  }

  throw lastError;
}

// Normalize author name for consistent matching (used as zotero_creator_name key)
function normalizeCreatorName(creator: ZoteroCreator): string | null {
  if (creator.creatorType !== "author") return null;

  if (creator.lastName && creator.firstName) {
    return `${creator.lastName.toLowerCase().trim()}, ${creator.firstName.toLowerCase().trim()}`;
  } else if (creator.lastName) {
    return creator.lastName.toLowerCase().trim();
  } else if (creator.name) {
    return creator.name.toLowerCase().trim();
  }
  return null;
}

// Normalize name for deduplication matching (removes punctuation, extra spaces)
function normalizeNameForMatching(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "") // Remove punctuation (periods, commas, etc.)
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}

// Format display name nicely
function formatDisplayName(creator: ZoteroCreator): string {
  if (creator.firstName && creator.lastName) {
    return `${creator.firstName} ${creator.lastName}`;
  } else if (creator.lastName) {
    return creator.lastName;
  } else if (creator.name) {
    return creator.name;
  }
  return "Unknown";
}

// Fetch all items from Zotero (paginated)
async function fetchAllZoteroItems(): Promise<ZoteroItem[]> {
  const allItems: ZoteroItem[] = [];
  let start = 0;
  const limit = 100;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(
      `${ZOTERO_BASE_URL}/groups/${ZOTERO_GROUP_ID}/items/top?format=json&limit=${limit}&start=${start}`,
      {
        headers: {
          "Zotero-API-Key": ZOTERO_API_KEY || "",
          "Zotero-API-Version": "3",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Zotero API error: ${response.status}`);
    }

    const items: ZoteroItem[] = await response.json();
    allItems.push(...items);

    // Check if there are more items
    const totalResults = parseInt(response.headers.get("total-results") || "0", 10);
    start += limit;
    hasMore = start < totalResults;
  }

  return allItems;
}

export async function POST() {
  // Validate environment
  if (!ZOTERO_API_KEY) {
    return NextResponse.json({ error: "Zotero API key not configured" }, { status: 500 });
  }
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Supabase service key not configured" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Step 1: Fetch all Zotero items
    console.log("Fetching all Zotero items...");
    const items = await fetchAllZoteroItems();
    console.log(`Fetched ${items.length} items from Zotero`);

    // Step 2: Extract and aggregate authors
    const authorMap = new Map<string, AuthorInfo>();

    for (const item of items) {
      const authors = item.data.creators.filter((c) => c.creatorType === "author");
      const authorNames = authors.map((a) => normalizeCreatorName(a)).filter(Boolean) as string[];

      for (const creator of authors) {
        const normalized = normalizeCreatorName(creator);
        if (!normalized) continue;

        const existing = authorMap.get(normalized);
        if (existing) {
          existing.publications.push({
            key: item.key,
            title: item.data.title,
            coauthors: authorNames.filter((n) => n !== normalized),
          });
        } else {
          authorMap.set(normalized, {
            displayName: formatDisplayName(creator),
            normalizedName: normalized,
            publications: [
              {
                key: item.key,
                title: item.data.title,
                coauthors: authorNames.filter((n) => n !== normalized),
              },
            ],
          });
        }
      }
    }

    console.log(`Found ${authorMap.size} unique authors`);

    // Step 3: Include all authors (no minimum publication filter)
    const allAuthors = Array.from(authorMap.values());
    console.log(`Including all ${allAuthors.length} authors`);

    // Step 4: Get existing researchers (with retry)
    const { data: existingResearchers } = await withRetry(async () => {
      const result = await supabase.from("researchers").select("id, name, zotero_creator_name");
      return result;
    });

    // Map by zotero_creator_name (exact match)
    const existingByZoteroName = new Map(
      (existingResearchers || [])
        .filter((r: { zotero_creator_name: string | null }) => r.zotero_creator_name)
        .map((r: { id: string; name: string; zotero_creator_name: string }) => [
          r.zotero_creator_name,
          r,
        ])
    );

    // Map by normalized display name (for deduplication - catches "Glenn R. Carroll" vs "Glenn R Carroll")
    const existingByNormalizedName = new Map(
      (existingResearchers || []).map(
        (r: { id: string; name: string; zotero_creator_name: string | null }) => [
          normalizeNameForMatching(r.name),
          r,
        ]
      )
    );

    // Step 5: Upsert researchers (with retry)
    let newCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    for (const author of allAuthors) {
      // First try exact match by zotero_creator_name
      let existing: { id: string; name: string; zotero_creator_name: string | null } | undefined =
        existingByZoteroName.get(author.normalizedName);

      // If no exact match, try normalized display name (catches "Glenn R. Carroll" vs "Glenn R Carroll")
      if (!existing) {
        const normalizedDisplayName = normalizeNameForMatching(author.displayName);
        existing = existingByNormalizedName.get(normalizedDisplayName);
        if (existing) {
          console.log(`Matched by normalized name: "${author.displayName}" -> "${existing.name}"`);
        }
      }

      try {
        if (existing) {
          // Capture values for closure
          const existingId = existing.id;
          const needsZoteroName = !existing.zotero_creator_name;

          // Update publication count and set zotero_creator_name if missing
          await withRetry(async () => {
            const updateData: { publication_count: number; zotero_creator_name?: string } = {
              publication_count: author.publications.length,
            };
            // Link zotero_creator_name if not already set (for seed data researchers)
            if (needsZoteroName) {
              updateData.zotero_creator_name = author.normalizedName;
            }
            await supabase.from("researchers").update(updateData).eq("id", existingId);
          });
          updatedCount++;
        } else {
          // Create new researcher with minimal info
          const { error } = await withRetry(async () => {
            const result = await supabase.from("researchers").insert({
              name: author.displayName,
              institution: "Unknown", // To be filled manually
              discipline: "ecology", // Default, to be updated
              zotero_creator_name: author.normalizedName,
              publication_count: author.publications.length,
              tier: 3, // Default tier
            });
            return result;
          });

          if (!error) {
            newCount++;
          } else {
            console.error(`Error creating researcher ${author.displayName}:`, error);
            errorCount++;
          }
        }
      } catch (error) {
        console.error(`Failed after retries for ${author.displayName}:`, error);
        errorCount++;
      }
    }

    // Step 6: Delete researchers with 0 publications (no longer in Zotero)
    let deletedCount = 0;
    const activeZoteroNames = new Set(allAuthors.map((a) => a.normalizedName));

    for (const [zoteroName, existing] of existingByZoteroName.entries()) {
      if (!activeZoteroNames.has(zoteroName)) {
        try {
          // Delete connections first
          await withRetry(async () => {
            await supabase
              .from("researcher_connections")
              .delete()
              .or(`researcher_a_id.eq.${existing.id},researcher_b_id.eq.${existing.id}`);
          });

          // Delete researcher
          await withRetry(async () => {
            await supabase.from("researchers").delete().eq("id", existing.id);
          });

          console.log(`Deleted researcher no longer in Zotero: ${existing.name}`);
          deletedCount++;
        } catch (error) {
          console.error(`Failed to delete researcher ${existing.name}:`, error);
          errorCount++;
        }
      }
    }

    // Step 7: Refresh researcher list for connection creation (with retry)
    const { data: allResearchers } = await withRetry(async () => {
      const result = await supabase.from("researchers").select("id, zotero_creator_name");
      return result;
    });

    const researcherByZoteroName = new Map(
      (allResearchers || [])
        .filter((r: { zotero_creator_name: string | null }) => r.zotero_creator_name)
        .map((r: { id: string; zotero_creator_name: string }) => [r.zotero_creator_name, r.id])
    );

    // Step 8: Create co-authorship connections (with retry)
    let connectionCount = 0;
    let connectionErrors = 0;
    const processedPairs = new Set<string>();

    for (const author of allAuthors) {
      const authorId = researcherByZoteroName.get(author.normalizedName);
      if (!authorId) continue;

      for (const pub of author.publications) {
        for (const coauthorName of pub.coauthors) {
          const coauthorId = researcherByZoteroName.get(coauthorName);
          if (!coauthorId) continue;

          // Create ordered pair key to avoid duplicates
          const pairKey = [authorId, coauthorId].sort().join("-");
          if (processedPairs.has(pairKey)) continue;
          processedPairs.add(pairKey);

          // Find all shared publications
          const sharedPubs = author.publications
            .filter((p) => p.coauthors.includes(coauthorName))
            .map((p) => p.key);

          if (sharedPubs.length > 0) {
            try {
              // Use the helper function to upsert connection
              const { error } = await withRetry(async () => {
                const result = await supabase.rpc("upsert_researcher_connection", {
                  p_researcher_a_id: authorId,
                  p_researcher_b_id: coauthorId,
                  p_connection_type: "coauthor",
                  p_label: `${sharedPubs.length} shared publication${sharedPubs.length > 1 ? "s" : ""}`,
                  p_shared_publication_keys: sharedPubs,
                  p_is_auto_detected: true,
                });
                return result;
              });

              if (!error) {
                connectionCount++;
              } else {
                connectionErrors++;
              }
            } catch (error) {
              console.error(`Failed to create connection after retries:`, error);
              connectionErrors++;
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        totalItems: items.length,
        uniqueAuthors: authorMap.size,
        newResearchers: newCount,
        updatedResearchers: updatedCount,
        deletedResearchers: deletedCount,
        coauthorConnections: connectionCount,
        errors: errorCount + connectionErrors,
      },
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Sync failed" },
      { status: 500 }
    );
  }
}
