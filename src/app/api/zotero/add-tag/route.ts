import { NextRequest, NextResponse } from "next/server";

const ZOTERO_API_KEY = process.env.ZOTERO_API_KEY;
const ZOTERO_GROUP_ID = process.env.ZOTERO_GROUP_ID || "6367540";
const ZOTERO_BASE_URL = "https://api.zotero.org";

interface ZoteroItemData {
  key: string;
  version: number;
  tags: { tag: string }[];
}

interface ZoteroItem {
  key: string;
  version: number;
  data: ZoteroItemData;
}

// POST: Add a tag to a Zotero item
// Body: { itemKey: string, tag: string }
export async function POST(request: NextRequest) {
  if (!ZOTERO_API_KEY) {
    return NextResponse.json({ error: "Zotero API key not configured" }, { status: 500 });
  }

  try {
    const { itemKey, tag } = await request.json();

    if (!itemKey || !tag) {
      return NextResponse.json({ error: "itemKey and tag are required" }, { status: 400 });
    }

    // First, fetch the current item to get its version and existing tags
    const getResponse = await fetch(
      `${ZOTERO_BASE_URL}/groups/${ZOTERO_GROUP_ID}/items/${itemKey}`,
      {
        headers: {
          "Zotero-API-Key": ZOTERO_API_KEY,
          "Zotero-API-Version": "3",
        },
      }
    );

    if (!getResponse.ok) {
      return NextResponse.json(
        { error: `Failed to fetch item: ${getResponse.status}` },
        { status: getResponse.status }
      );
    }

    const item: ZoteroItem = await getResponse.json();
    const currentTags = item.data.tags || [];

    // Check if tag already exists
    if (currentTags.some((t) => t.tag === tag)) {
      return NextResponse.json({ success: true, message: "Tag already exists", added: false });
    }

    // Add the new tag
    const newTags = [...currentTags, { tag }];

    // Update the item with new tags
    const patchResponse = await fetch(
      `${ZOTERO_BASE_URL}/groups/${ZOTERO_GROUP_ID}/items/${itemKey}`,
      {
        method: "PATCH",
        headers: {
          "Zotero-API-Key": ZOTERO_API_KEY,
          "Zotero-API-Version": "3",
          "Content-Type": "application/json",
          "If-Unmodified-Since-Version": String(item.version),
        },
        body: JSON.stringify({ tags: newTags }),
      }
    );

    if (!patchResponse.ok) {
      const errorText = await patchResponse.text();
      console.error("Zotero PATCH error:", patchResponse.status, errorText);
      return NextResponse.json(
        { error: `Failed to update item: ${patchResponse.status}` },
        { status: patchResponse.status }
      );
    }

    return NextResponse.json({ success: true, message: "Tag added", added: true });
  } catch (error) {
    console.error("Add tag error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
