import { MetadataRoute } from "next";
import { createAnonClient } from "@/lib/supabase/anon";
import { siteConfig } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/research`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/keepers`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/education`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/clinic`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/diagnostics`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/cenotaphery`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic routes from database
  let orgRoutes: MetadataRoute.Sitemap = [];
  let cenotapheryRoutes: MetadataRoute.Sitemap = [];

  try {
    const supabase = createAnonClient();

    // Public organizations
    const { data: orgs } = await supabase
      .from("organizations")
      .select("id, updated_at")
      .eq("is_public", true);

    orgRoutes = (orgs || []).map((org) => ({
      url: `${baseUrl}/organization/${org.id}`,
      lastModified: new Date(org.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    // Active cenotapheries
    const { data: cenotapheries } = await supabase
      .from("cenotapheries")
      .select("slug, updated_at")
      .eq("status", "active");

    cenotapheryRoutes = (cenotapheries || []).map((c) => ({
      url: `${baseUrl}/cenotaphery/${c.slug}`,
      lastModified: new Date(c.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    // If database is unavailable, return only static routes
    console.error("Sitemap: Failed to fetch dynamic routes:", error);
  }

  return [...staticRoutes, ...orgRoutes, ...cenotapheryRoutes];
}
