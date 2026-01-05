import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

// Normalize author name for consistent matching
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

    // Step 3: Filter to authors with 2+ publications
    const significantAuthors = Array.from(authorMap.values()).filter(
      (a) => a.publications.length >= 2
    );
    console.log(`${significantAuthors.length} authors have 2+ publications`);

    // Step 4: Get existing researchers
    const { data: existingResearchers } = await supabase
      .from("researchers")
      .select("id, name, zotero_creator_name");

    const existingByZoteroName = new Map(
      (existingResearchers || [])
        .filter((r) => r.zotero_creator_name)
        .map((r) => [r.zotero_creator_name, r])
    );

    // Step 5: Upsert researchers
    let newCount = 0;
    let updatedCount = 0;

    for (const author of significantAuthors) {
      const existing = existingByZoteroName.get(author.normalizedName);

      if (existing) {
        // Update publication count
        await supabase
          .from("researchers")
          .update({ publication_count: author.publications.length })
          .eq("id", existing.id);
        updatedCount++;
      } else {
        // Create new researcher with minimal info
        const { error } = await supabase.from("researchers").insert({
          name: author.displayName,
          institution: "Unknown", // To be filled manually
          discipline: "ecology", // Default, to be updated
          zotero_creator_name: author.normalizedName,
          publication_count: author.publications.length,
          tier: 3, // Default tier
        });

        if (!error) {
          newCount++;
        } else {
          console.error(`Error creating researcher ${author.displayName}:`, error);
        }
      }
    }

    // Step 6: Refresh researcher list for connection creation
    const { data: allResearchers } = await supabase
      .from("researchers")
      .select("id, zotero_creator_name");

    const researcherByZoteroName = new Map(
      (allResearchers || [])
        .filter((r) => r.zotero_creator_name)
        .map((r) => [r.zotero_creator_name, r.id])
    );

    // Step 7: Create co-authorship connections
    let connectionCount = 0;
    const processedPairs = new Set<string>();

    for (const author of significantAuthors) {
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
          const coauthorInfo = authorMap.get(coauthorName);
          const sharedPubs = author.publications
            .filter((p) => p.coauthors.includes(coauthorName))
            .map((p) => p.key);

          if (sharedPubs.length > 0) {
            // Use the helper function to upsert connection
            const { error } = await supabase.rpc("upsert_researcher_connection", {
              p_researcher_a_id: authorId,
              p_researcher_b_id: coauthorId,
              p_connection_type: "coauthor",
              p_label: `${sharedPubs.length} shared publication${sharedPubs.length > 1 ? "s" : ""}`,
              p_shared_publication_keys: sharedPubs,
              p_is_auto_detected: true,
            });

            if (!error) {
              connectionCount++;
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
        authorsWithMultiplePublications: significantAuthors.length,
        newResearchers: newCount,
        updatedResearchers: updatedCount,
        coauthorConnections: connectionCount,
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
