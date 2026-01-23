import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ZOTERO_API_KEY = process.env.ZOTERO_API_KEY;
const ZOTERO_GROUP_ID = process.env.ZOTERO_GROUP_ID || "6367540";
const ZOTERO_BASE_URL = "https://api.zotero.org";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

interface ZoteroCreator {
  creatorType: string;
  firstName?: string;
  lastName?: string;
  name?: string;
}

interface ZoteroItemData {
  key: string;
  itemType: string;
  title: string;
  creators: ZoteroCreator[];
  date?: string;
  publicationTitle?: string; // For journal articles
  publisher?: string; // For books
  DOI?: string;
  url?: string;
  abstractNote?: string;
}

interface ZoteroItem {
  key: string;
  data: ZoteroItemData;
}

// Format authors as "FirstName LastName, FirstName LastName, ..."
function formatAuthors(creators: ZoteroCreator[]): string {
  return creators
    .filter((c) => c.creatorType === "author")
    .map((c) => {
      if (c.firstName && c.lastName) {
        return `${c.firstName} ${c.lastName}`;
      } else if (c.lastName) {
        return c.lastName;
      } else if (c.name) {
        return c.name;
      }
      return "";
    })
    .filter(Boolean)
    .join(", ");
}

// Extract year from Zotero date field (can be "1992", "1992-01-15", etc.)
function extractYear(date: string | undefined): number | null {
  if (!date) return null;
  const match = date.match(/\d{4}/);
  return match ? parseInt(match[0], 10) : null;
}

// Get publication/journal name based on item type
function getJournalOrPublisher(item: ZoteroItemData): string | null {
  if (item.publicationTitle) return item.publicationTitle;
  if (item.publisher) return item.publisher;
  return null;
}

// Fetch a single Zotero item by key
async function fetchZoteroItem(itemKey: string): Promise<ZoteroItem | null> {
  try {
    const response = await fetch(
      `${ZOTERO_BASE_URL}/groups/${ZOTERO_GROUP_ID}/items/${itemKey}?format=json`,
      {
        headers: {
          "Zotero-API-Key": ZOTERO_API_KEY || "",
          "Zotero-API-Version": "3",
        },
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch Zotero item ${itemKey}: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching Zotero item ${itemKey}:`, error);
    return null;
  }
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
    // Step 1: Find pathologies with zotero_item_key but missing primary_source_title
    const { data: pathologies, error: fetchError } = await supabase
      .from("pathology_classification")
      .select("id, code, name, zotero_item_key")
      .not("zotero_item_key", "is", null)
      .is("primary_source_title", null);

    if (fetchError) {
      throw new Error(`Failed to fetch pathologies: ${fetchError.message}`);
    }

    if (!pathologies || pathologies.length === 0) {
      return NextResponse.json({
        success: true,
        summary: {
          found: 0,
          updated: 0,
          errors: 0,
          message: "All pathologies with Zotero keys already have citation data",
        },
      });
    }

    console.log(`Found ${pathologies.length} pathologies needing citation data`);

    // Step 2: Fetch Zotero data and update each pathology
    let updatedCount = 0;
    let errorCount = 0;
    const results: { code: string; status: string; title?: string }[] = [];

    for (const pathology of pathologies) {
      const zoteroItem = await fetchZoteroItem(pathology.zotero_item_key);

      if (!zoteroItem) {
        errorCount++;
        results.push({
          code: pathology.code,
          status: "error",
          title: "Failed to fetch from Zotero",
        });
        continue;
      }

      const { data } = zoteroItem;

      // Prepare update data
      const updateData = {
        primary_source_title: data.title || null,
        primary_source_authors: formatAuthors(data.creators) || null,
        primary_source_year: extractYear(data.date),
        primary_source_journal: getJournalOrPublisher(data),
        primary_source_doi: data.DOI || null,
        primary_source_url: data.url || null,
        primary_source_abstract: data.abstractNote || null,
      };

      // Update pathology
      const { error: updateError } = await supabase
        .from("pathology_classification")
        .update(updateData)
        .eq("id", pathology.id);

      if (updateError) {
        console.error(`Failed to update ${pathology.code}:`, updateError);
        errorCount++;
        results.push({ code: pathology.code, status: "error", title: updateError.message });
      } else {
        updatedCount++;
        results.push({ code: pathology.code, status: "updated", title: data.title });
        console.log(`Updated ${pathology.code}: ${data.title}`);
      }

      // Small delay to respect Zotero rate limits
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return NextResponse.json({
      success: true,
      summary: {
        found: pathologies.length,
        updated: updatedCount,
        errors: errorCount,
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
