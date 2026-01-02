import { NextRequest, NextResponse } from "next/server";

const ZOTERO_API_KEY = process.env.ZOTERO_API_KEY;
const ZOTERO_GROUP_ID = process.env.ZOTERO_GROUP_ID || "6367540";
const ZOTERO_BASE_URL = "https://api.zotero.org";

// Types for Zotero API responses
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
  version: number;
  itemType: string;
  title: string;
  creators: ZoteroCreator[];
  abstractNote?: string;
  publicationTitle?: string;
  date?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  DOI?: string;
  url?: string;
  tags: ZoteroTag[];
  collections: string[];
  publisher?: string;
  place?: string;
}

interface ZoteroItem {
  key: string;
  version: number;
  meta: {
    creatorSummary?: string;
    parsedDate?: string;
    numChildren: number;
  };
  data: ZoteroItemData;
}

interface ZoteroCollection {
  key: string;
  version: number;
  meta: {
    numCollections: number;
    numItems: number;
  };
  data: {
    key: string;
    version: number;
    name: string;
    parentCollection: string | false;
  };
}

// Cache for API responses (15 minutes)
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }
  return null;
}

function setCache(key: string, data: unknown): void {
  cache.set(key, { data, timestamp: Date.now() });
}

async function fetchZotero<T>(endpoint: string): Promise<T> {
  const cacheKey = endpoint;
  const cached = getCached<T>(cacheKey);
  if (cached) {
    return cached;
  }

  const response = await fetch(`${ZOTERO_BASE_URL}${endpoint}`, {
    headers: {
      "Zotero-API-Key": ZOTERO_API_KEY || "",
      "Zotero-API-Version": "3",
    },
  });

  if (!response.ok) {
    throw new Error(`Zotero API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  setCache(cacheKey, data);
  return data;
}

export async function GET(request: NextRequest) {
  if (!ZOTERO_API_KEY) {
    return NextResponse.json({ error: "Zotero API key not configured" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "items";

  try {
    switch (action) {
      case "collections": {
        const collections = await fetchZotero<ZoteroCollection[]>(
          `/groups/${ZOTERO_GROUP_ID}/collections?format=json`
        );
        // Sort collections by name
        const sortedCollections = collections.sort((a, b) =>
          a.data.name.localeCompare(b.data.name)
        );
        return NextResponse.json(sortedCollections);
      }

      case "items": {
        const limit = searchParams.get("limit") || "100";
        const start = searchParams.get("start") || "0";
        const collection = searchParams.get("collection");
        const tag = searchParams.get("tag");
        const q = searchParams.get("q");
        const sort = searchParams.get("sort") || "date";
        const direction = searchParams.get("direction") || "desc";

        let endpoint = `/groups/${ZOTERO_GROUP_ID}/items/top?format=json&limit=${limit}&start=${start}&sort=${sort}&direction=${direction}`;

        if (collection) {
          endpoint = `/groups/${ZOTERO_GROUP_ID}/collections/${collection}/items/top?format=json&limit=${limit}&start=${start}&sort=${sort}&direction=${direction}`;
        }

        if (tag) {
          endpoint += `&tag=${encodeURIComponent(tag)}`;
        }

        if (q) {
          endpoint += `&q=${encodeURIComponent(q)}`;
        }

        const items = await fetchZotero<ZoteroItem[]>(endpoint);

        // Get total count from a separate request if needed
        const countEndpoint = collection
          ? `/groups/${ZOTERO_GROUP_ID}/collections/${collection}/items/top?format=json&limit=1`
          : `/groups/${ZOTERO_GROUP_ID}/items/top?format=json&limit=1`;

        // Fetch headers for total count
        const countResponse = await fetch(`${ZOTERO_BASE_URL}${countEndpoint}`, {
          headers: {
            "Zotero-API-Key": ZOTERO_API_KEY || "",
            "Zotero-API-Version": "3",
          },
        });
        const totalResults = countResponse.headers.get("total-results") || "0";

        return NextResponse.json({
          items,
          total: parseInt(totalResults, 10),
          limit: parseInt(limit, 10),
          start: parseInt(start, 10),
        });
      }

      case "stats": {
        // Get collections with item counts
        const collections = await fetchZotero<ZoteroCollection[]>(
          `/groups/${ZOTERO_GROUP_ID}/collections?format=json`
        );

        // Get total items count
        const itemsResponse = await fetch(
          `${ZOTERO_BASE_URL}/groups/${ZOTERO_GROUP_ID}/items/top?format=json&limit=1`,
          {
            headers: {
              "Zotero-API-Key": ZOTERO_API_KEY || "",
              "Zotero-API-Version": "3",
            },
          }
        );
        const totalItems = itemsResponse.headers.get("total-results") || "0";

        // Get item types distribution
        const allItems = await fetchZotero<ZoteroItem[]>(
          `/groups/${ZOTERO_GROUP_ID}/items/top?format=json&limit=200`
        );

        const itemTypes: Record<string, number> = {};
        const tags: Record<string, number> = {};

        allItems.forEach((item) => {
          // Count item types
          const type = item.data.itemType;
          itemTypes[type] = (itemTypes[type] || 0) + 1;

          // Count tags
          item.data.tags.forEach((t) => {
            tags[t.tag] = (tags[t.tag] || 0) + 1;
          });
        });

        // Sort tags by count
        const sortedTags = Object.entries(tags)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 20)
          .map(([tag, count]) => ({ tag, count }));

        return NextResponse.json({
          totalItems: parseInt(totalItems, 10),
          collections: collections
            .map((c) => ({
              key: c.key,
              name: c.data.name,
              numItems: c.meta.numItems,
            }))
            .sort((a, b) => a.name.localeCompare(b.name)),
          itemTypes: Object.entries(itemTypes).map(([type, count]) => ({
            type,
            count,
          })),
          topTags: sortedTags,
        });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Zotero API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
