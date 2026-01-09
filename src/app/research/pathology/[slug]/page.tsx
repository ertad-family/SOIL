import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PathologyDetail } from "./pathology-detail";

interface PageProps {
  params: Promise<{ slug: string }>;
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

  return (
    <PathologyDetail
      pathology={pathology}
      prevPathology={prevPathology}
      nextPathology={nextPathology}
      enumLabels={enumLabels}
    />
  );
}
