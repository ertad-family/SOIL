import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PathologyDetail } from "./pathology-detail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Zotero API config for server-side fetching
const ZOTERO_API_KEY = process.env.ZOTERO_API_KEY;
const ZOTERO_GROUP_ID = process.env.ZOTERO_GROUP_ID || "6367540";

interface ZoteroReference {
  key: string;
  title: string;
  authors: string;
  year: string | null;
  url: string | null;
  doi: string | null;
}

interface ZoteroCreator {
  creatorType: string;
  firstName?: string;
  lastName?: string;
  name?: string;
}

interface ZoteroItemData {
  key: string;
  title: string;
  creators: ZoteroCreator[];
  date?: string;
  DOI?: string;
  url?: string;
}

async function fetchZoteroReferences(keys: string[]): Promise<ZoteroReference[]> {
  if (!ZOTERO_API_KEY || keys.length === 0) {
    return [];
  }

  const references: ZoteroReference[] = [];

  // Fetch items by key - batch request
  const itemKeys = keys.join(",");
  try {
    const response = await fetch(
      `https://api.zotero.org/groups/${ZOTERO_GROUP_ID}/items?itemKey=${itemKeys}&format=json`,
      {
        headers: {
          "Zotero-API-Key": ZOTERO_API_KEY,
          "Zotero-API-Version": "3",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch Zotero items:", response.status);
      return [];
    }

    const items: { key: string; data: ZoteroItemData }[] = await response.json();

    for (const item of items) {
      const data = item.data;

      // Format authors
      const authors =
        data.creators
          ?.filter((c) => c.creatorType === "author")
          .map((c) => (c.name ? c.name : `${c.lastName}, ${c.firstName || ""}`.trim()))
          .join("; ") || "";

      // Extract year from date
      const year = data.date?.match(/\d{4}/)?.[0] || null;

      references.push({
        key: item.key,
        title: data.title || "Untitled",
        authors,
        year,
        url: data.url || null,
        doi: data.DOI || null,
      });
    }
  } catch (error) {
    console.error("Error fetching Zotero references:", error);
  }

  return references;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: pathology } = await supabase
    .from("pathology_classification")
    .select("code, name, definition, localization, key_authors")
    .eq("slug", slug)
    .single();

  if (!pathology) {
    return { title: "Pathology Not Found | SOIL" };
  }

  const authors = pathology.key_authors?.join(", ") || "";
  const description =
    pathology.definition.length > 157
      ? pathology.definition.substring(0, 157) + "..."
      : pathology.definition;

  const localizationLabels: Record<string, string> = {
    LP: "Leadership",
    SP: "Structural",
    FP: "Financial",
    CP: "Cultural",
    MP: "Market",
    OP: "Operational",
  };

  const localizationType = localizationLabels[pathology.localization] || pathology.localization;

  return {
    title: `${pathology.code}: ${pathology.name} | SOIL Pathology Classification`,
    description,
    keywords: [
      "organizational pathology",
      pathology.name.toLowerCase(),
      `${localizationType.toLowerCase()} pathology`,
      authors,
      "organizational disease",
      "SOIL-PC",
      "business failure",
      "organizational mortality",
    ]
      .filter(Boolean)
      .join(", "),
    openGraph: {
      title: `${pathology.code}: ${pathology.name}`,
      description,
      type: "article",
      siteName: "SOIL - Studies of Organizational Illness and Loss",
    },
    twitter: {
      card: "summary",
      title: `${pathology.code}: ${pathology.name}`,
      description,
    },
  };
}

export default async function PathologyPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch pathology data and enum values in parallel
  const [pathologyResult, enumsResult, allPathologiesResult] = await Promise.all([
    supabase.from("pathology_classification").select("*").eq("slug", slug).single(),
    supabase.from("pathology_enum_values").select("*").order("sort_order"),
    supabase
      .from("pathology_classification")
      .select("slug, code, name")
      .order("code", { ascending: true }),
  ]);

  const { data: pathology, error } = pathologyResult;

  if (error || !pathology) {
    notFound();
  }

  // Convert enum values to lookup maps
  const enumLabels = {
    localizations: {} as Record<string, string>,
    etiologies: {} as Record<string, string>,
    courses: {} as Record<string, string>,
    functionalImpairments: {} as Record<string, string>,
  };

  if (enumsResult.data) {
    for (const item of enumsResult.data) {
      switch (item.enum_type) {
        case "localization":
          enumLabels.localizations[item.value] = item.label;
          break;
        case "etiology":
          enumLabels.etiologies[item.value] = item.label;
          break;
        case "course":
          enumLabels.courses[item.value] = item.label;
          break;
        case "functional_impairment":
          enumLabels.functionalImpairments[item.value] = item.label;
          break;
      }
    }
  }

  // Calculate adjacent pathologies for navigation
  let prevPathology = null;
  let nextPathology = null;

  if (allPathologiesResult.data) {
    const allPathologies = allPathologiesResult.data;
    const currentIndex = allPathologies.findIndex((p) => p.slug === slug);
    if (currentIndex > 0) {
      prevPathology = allPathologies[currentIndex - 1];
    }
    if (currentIndex < allPathologies.length - 1) {
      nextPathology = allPathologies[currentIndex + 1];
    }
  }

  // Fetch Zotero references for literature_zotero_keys if present
  const literatureReferences =
    pathology.literature_zotero_keys && pathology.literature_zotero_keys.length > 0
      ? await fetchZoteroReferences(pathology.literature_zotero_keys)
      : [];

  return (
    <PathologyDetail
      pathology={pathology}
      prevPathology={prevPathology}
      nextPathology={nextPathology}
      enumLabels={enumLabels}
      literatureReferences={literatureReferences}
    />
  );
}
