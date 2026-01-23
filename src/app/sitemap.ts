import { MetadataRoute } from "next";
import { createAnonClient } from "@/lib/supabase/anon";
import { siteConfig } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/about/dodecahedron`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/about/verification`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/careers`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/challenges`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/clinic`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/community`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/cenotaphery`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/diagnostics`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/donate`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/education`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/glossary`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/investors`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/keepers`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/research`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/research/atlas`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/research/bibliography`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/research/datasets`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/research/pathology`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/sponsors`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/volunteer`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/whitepaper`, changeFrequency: "monthly", priority: 0.7 },
  ];

  // Dynamic routes from database
  let organizationRoutes: MetadataRoute.Sitemap = [];
  let pathologyRoutes: MetadataRoute.Sitemap = [];
  let cenotapheryRoutes: MetadataRoute.Sitemap = [];

  try {
    const supabase = createAnonClient();

    // Public organizations
    const { data: organizations } = await supabase
      .from("organizations")
      .select("id, updated_at")
      .eq("is_public", true);

    organizationRoutes = (organizations || []).map((org) => ({
      url: `${baseUrl}/organization/${org.id}`,
      lastModified: org.updated_at ? new Date(org.updated_at) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    // Pathology classification pages
    const { data: pathologies } = await supabase
      .from("pathology_classification")
      .select("slug, updated_at");

    pathologyRoutes = (pathologies || []).map((p) => ({
      url: `${baseUrl}/research/pathology/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    // Active cenotapheries
    const { data: cenotapheries } = await supabase
      .from("cenotapheries")
      .select("slug, updated_at")
      .eq("status", "active");

    cenotapheryRoutes = (cenotapheries || []).map((c) => ({
      url: `${baseUrl}/cenotaphery/${c.slug}`,
      lastModified: c.updated_at ? new Date(c.updated_at) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    // If database is unavailable, return only static routes
    console.error("Sitemap: Failed to fetch dynamic routes:", error);
  }

  return [...staticRoutes, ...organizationRoutes, ...pathologyRoutes, ...cenotapheryRoutes];
}
