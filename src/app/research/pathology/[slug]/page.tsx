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

  const { data: pathology, error } = await supabase
    .from("pathology_classification")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !pathology) {
    notFound();
  }

  // Fetch adjacent pathologies for navigation
  const { data: allPathologies } = await supabase
    .from("pathology_classification")
    .select("slug, code, name")
    .order("code", { ascending: true });

  let prevPathology = null;
  let nextPathology = null;

  if (allPathologies) {
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
    />
  );
}
