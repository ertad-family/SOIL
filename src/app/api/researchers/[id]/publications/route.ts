import { NextRequest, NextResponse } from "next/server";
import { createAnonClient } from "@/lib/supabase/anon";

const ZOTERO_API_KEY = process.env.ZOTERO_API_KEY;
const ZOTERO_GROUP_ID = process.env.ZOTERO_GROUP_ID || "6367540";
const ZOTERO_BASE_URL = "https://api.zotero.org";

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
    DOI?: string;
    url?: string;
    publicationTitle?: string;
    publisher?: string;
  };
  meta: {
    creatorSummary?: string;
    parsedDate?: string;
  };
}

interface PublicationResult {
  key: string;
  title: string;
  date: string | null;
  itemType: string;
  coauthors: string[];
  doi: string | null;
  url: string | null;
  publicationTitle: string | null;
}

// Normalize author name for matching
function normalizeCreatorName(creator: ZoteroCreator): string | null {
  if (creator.lastName && creator.firstName) {
    return `${creator.lastName.toLowerCase().trim()}, ${creator.firstName.toLowerCase().trim()}`;
  } else if (creator.lastName) {
    return creator.lastName.toLowerCase().trim();
  } else if (creator.name) {
    return creator.name.toLowerCase().trim();
  }
  return null;
}

// Format author name for display
function formatAuthorName(creator: ZoteroCreator): string {
  if (creator.firstName && creator.lastName) {
    return `${creator.firstName} ${creator.lastName}`;
  } else if (creator.lastName) {
    return creator.lastName;
  } else if (creator.name) {
    return creator.name;
  }
  return "Unknown";
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!ZOTERO_API_KEY) {
    return NextResponse.json({ error: "Zotero API key not configured" }, { status: 500 });
  }

  try {
    // Get researcher's zotero_creator_name from database
    const supabase = createAnonClient();
    const { data: researcher, error } = await supabase
      .from("researchers")
      .select("id, name, zotero_creator_name")
      .eq("id", id)
      .single();

    if (error || !researcher) {
      return NextResponse.json({ error: "Researcher not found" }, { status: 404 });
    }

    if (!researcher.zotero_creator_name) {
      return NextResponse.json({ publications: [], total: 0 });
    }

    // Fetch all items from Zotero and filter by author name
    // Note: Zotero API doesn't support exact author search, so we fetch and filter
    const allItems: ZoteroItem[] = [];
    let start = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const response = await fetch(
        `${ZOTERO_BASE_URL}/groups/${ZOTERO_GROUP_ID}/items/top?format=json&limit=${limit}&start=${start}`,
        {
          headers: {
            "Zotero-API-Key": ZOTERO_API_KEY,
            "Zotero-API-Version": "3",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Zotero API error: ${response.status}`);
      }

      const items: ZoteroItem[] = await response.json();
      allItems.push(...items);

      const totalResults = parseInt(response.headers.get("total-results") || "0", 10);
      start += limit;
      hasMore = start < totalResults;
    }

    // Filter items where this researcher is an author
    const researcherNormalizedName = researcher.zotero_creator_name.toLowerCase();
    const publications: PublicationResult[] = [];

    for (const item of allItems) {
      const authors = item.data.creators.filter((c) => c.creatorType === "author");
      const normalizedAuthors = authors.map((a) => normalizeCreatorName(a));

      if (normalizedAuthors.includes(researcherNormalizedName)) {
        publications.push({
          key: item.key,
          title: item.data.title,
          date: item.meta.parsedDate || item.data.date || null,
          itemType: item.data.itemType,
          coauthors: authors
            .filter((a) => normalizeCreatorName(a) !== researcherNormalizedName)
            .map((a) => formatAuthorName(a)),
          doi: item.data.DOI || null,
          url: item.data.url || null,
          publicationTitle: item.data.publicationTitle || item.data.publisher || null,
        });
      }
    }

    // Sort by date descending
    publications.sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return b.date.localeCompare(a.date);
    });

    return NextResponse.json({
      publications,
      total: publications.length,
    });
  } catch (error) {
    console.error("Error fetching researcher publications:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch publications" },
      { status: 500 }
    );
  }
}
