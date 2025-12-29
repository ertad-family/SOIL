import { Suspense } from "react";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CenotapheryContent } from "./cenotaphery-content";
import { Spinner } from "@/components/ui/spinner";

interface CenotapheryPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate dynamic metadata for cenotaphery pages
 * Enables proper OG tags for social sharing
 */
export async function generateMetadata({ params }: CenotapheryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch cenotaphery info
  const { data: cenotaphery } = await supabase
    .from("cenotapheries")
    .select("id, name, description")
    .eq("slug", slug)
    .single();

  if (!cenotaphery) {
    return {
      title: "Cenotaphery Not Found | SOIL",
    };
  }

  // Get first cenotaph image for OG image
  const { data: firstCenotaph } = await supabase
    .from("memorials")
    .select("cenotaph_image_url")
    .eq("cenotaphery_id", cenotaphery.id)
    .eq("status", "published")
    .eq("design_status", "completed")
    .not("cenotaph_image_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const title = `${cenotaphery.name} | SOIL`;
  const description =
    cenotaphery.description ||
    `A sacred digital space where organizations find eternal rest. Visit ${cenotaphery.name} to honor their memory.`;

  // Use first cenotaph image or fallback to default
  const ogImage = firstCenotaph?.cenotaph_image_url || "/og-default.svg";

  return {
    title,
    description,
    openGraph: {
      title: cenotaphery.name,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: cenotaphery.name,
        },
      ],
      type: "website",
      siteName: "SOIL - Studies of Organizational Illness and Loss",
    },
    twitter: {
      card: "summary_large_image",
      title: cenotaphery.name,
      description,
      images: [ogImage],
    },
  };
}

/**
 * Cenotaphery Page - Gallery of cenotaphs with masonry layout
 *
 * Route: /cenotaphery/[slug]
 * First cenotaphery: /cenotaphery/the-first
 *
 * Features:
 * - Dynamic OG metadata for social sharing
 * - Masonry gallery of cenotaph cards
 * - URL-based filters (org type, age, founded)
 * - Empty state with CTA
 * - Responsive design
 */
export default async function CenotapheryPage({ params }: CenotapheryPageProps) {
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <Spinner size="lg" variant="dark" />
        </div>
      }
    >
      <CenotapheryContent slug={slug} />
    </Suspense>
  );
}
