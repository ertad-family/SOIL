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

interface ZoteroTag {
  tag: string;
}

interface ZoteroItemData {
  key: string;
  itemType: string;
  title: string;
  creators: ZoteroCreator[];
  date?: string;
  publicationTitle?: string;
  publisher?: string;
  DOI?: string;
  url?: string;
  abstractNote?: string;
  tags: ZoteroTag[];
  collections: string[];
}

interface ZoteroItem {
  key: string;
  data: ZoteroItemData;
}

// Format authors from Zotero creator array
function formatAuthors(creators: ZoteroCreator[]): string {
  return (
    creators
      ?.filter((c) => c.creatorType === "author")
      .map((c) => (c.name ? c.name : `${c.lastName}, ${c.firstName || ""}`.trim()))
      .join("; ") || ""
  );
}

// Extract year from Zotero date string
function extractYear(date?: string): number | null {
  if (!date) return null;
  const match = date.match(/\d{4}/);
  return match ? parseInt(match[0], 10) : null;
}

// Fetch all items from Zotero with pagination
async function fetchAllZoteroItems(): Promise<ZoteroItem[]> {
  if (!ZOTERO_API_KEY) {
    throw new Error("ZOTERO_API_KEY not configured");
  }

  const allItems: ZoteroItem[] = [];
  let start = 0;
  const limit = 100;

  while (true) {
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

    // Check if there are more items
    const totalResults = parseInt(response.headers.get("total-results") || "0", 10);
    start += limit;

    if (start >= totalResults) {
      break;
    }
  }

  return allItems;
}

export async function POST() {
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Supabase configuration missing" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Fetch all items from Zotero
    const zoteroItems = await fetchAllZoteroItems();

    // Transform to our cache format
    const cacheItems = zoteroItems.map((item) => ({
      key: item.key,
      item_type: item.data.itemType,
      title: item.data.title || "Untitled",
      authors: formatAuthors(item.data.creators),
      year: extractYear(item.data.date),
      publication: item.data.publicationTitle || item.data.publisher || null,
      doi: item.data.DOI || null,
      url: item.data.url || null,
      abstract: item.data.abstractNote || null,
      tags: item.data.tags?.map((t) => t.tag) || [],
      collections: item.data.collections || [],
      raw_data: item.data,
      last_synced_at: new Date().toISOString(),
    }));

    // Get existing keys
    const { data: existingItems } = await supabase.from("zotero_items").select("key");
    const existingKeys = new Set(existingItems?.map((i) => i.key) || []);
    const newKeys = new Set(cacheItems.map((i) => i.key));

    // Find keys to delete (in DB but not in Zotero)
    const keysToDelete = [...existingKeys].filter((k) => !newKeys.has(k));

    // Upsert all items
    const { error: upsertError } = await supabase.from("zotero_items").upsert(cacheItems, {
      onConflict: "key",
    });

    if (upsertError) {
      console.error("Upsert error:", upsertError);
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }

    // Delete removed items
    let deletedCount = 0;
    if (keysToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from("zotero_items")
        .delete()
        .in("key", keysToDelete);

      if (deleteError) {
        console.error("Delete error:", deleteError);
      } else {
        deletedCount = keysToDelete.length;
      }
    }

    return NextResponse.json({
      success: true,
      synced: cacheItems.length,
      deleted: deletedCount,
      total: cacheItems.length,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// GET to check sync status
export async function GET() {
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Supabase configuration missing" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase
    .from("zotero_items")
    .select("key, last_synced_at")
    .order("last_synced_at", { ascending: false })
    .limit(1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { count } = await supabase.from("zotero_items").select("*", { count: "exact", head: true });

  return NextResponse.json({
    itemCount: count || 0,
    lastSynced: data?.[0]?.last_synced_at || null,
  });
}
