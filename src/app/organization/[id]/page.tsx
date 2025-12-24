import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { OrganizationClient } from "./organization-client";
import type {
  StoryStatus,
  ModuleId,
  OrganizationType,
  LifecycleStage,
  VerificationStatus,
  PublicNamingPreference,
  FounderRole,
  AISummary,
} from "@/types/interview";

interface OrganizationData {
  id: string;
  slug: string;
  name: string;
  organization_type: OrganizationType | null;
  business_model: string | null;
  industry: string | null;
  description: string | null;
  location_country: string | null;
  location_region: string | null;
  location_city: string | null;
  location_lat: number | null;
  location_lng: number | null;
  location_geo_id: number | null;
  founded_date: string | null;
  closed_date: string | null;
  stage_at_closure: LifecycleStage | null;
  peak_team_size: number | null;
  verification_status: VerificationStatus;
  verification_count: number;
  is_public: boolean;
  privacy_display_style: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface StoryData {
  id: string;
  user_id: string;
  status: StoryStatus;
  current_module: ModuleId;
  completed_modules: ModuleId[];
  coined_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined profile data
  profile: {
    display_name: string | null;
  } | null;
}

interface MemorialData {
  id: string;
  slug: string;
  epitaph: string | null;
  tombstone_style: string;
  tombstone_color: string;
  views_count: number;
  respects_count: number;
  cenotaph_image_url: string | null;
  design_status: string | null;
  cenotaphery_slug: string | null;
}

/** Summary data extracted from story for public display */
export interface PublicSummaryData {
  text: string;
  keyFacts: string[];
  closurePattern: string | null;
}

/** Public story data from coined stories - AI refined only */
export interface PublicNarrativeData {
  storyId: string;
  authorName: string | null;
  founderRole: FounderRole | null;
  publicNaming: PublicNamingPreference | null;
  coinedAt: string;
  summary: PublicSummaryData | null;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

/** Human-readable labels for closure patterns (SEO-friendly) */
const CLOSURE_PATTERN_SEO_LABELS: Record<string, string> = {
  cash_crisis: "cash flow crisis",
  market_failure: "market fit failure",
  team_collapse: "team breakdown",
  founder_burnout: "founder burnout",
  competition: "competitive pressure",
  pivot_failure: "failed pivot",
  regulatory: "regulatory issues",
  funding_gap: "funding gap",
  product_market_fit: "product-market fit issues",
  scaling_failure: "scaling challenges",
};

/** Human-readable labels for organization types */
const ORG_TYPE_SEO_LABELS: Record<string, string> = {
  tech_product: "Tech Startup",
  services: "Service Company",
  ecommerce: "E-commerce Business",
  manufacturing: "Manufacturing Company",
  ngo: "Non-Profit Organization",
  media: "Media Company",
};

/**
 * Generate dynamic metadata for organization pages
 * Enhanced SEO with industry, closure patterns, and structured data
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch organization with extended fields for SEO
  const { data: organization } = await supabase
    .from("organizations")
    .select(
      "name, is_public, verification_status, organization_type, industry, location_city, location_country, founded_date, closed_date"
    )
    .eq("id", id)
    .single();

  if (!organization) {
    return {
      title: "Organization Not Found | SOIL",
    };
  }

  // Fetch memorial for cenotaph image and epitaph
  const { data: memorial } = await supabase
    .from("memorials")
    .select("epitaph, cenotaph_image_url")
    .eq("organization_id", id)
    .single();

  // Fetch AI summary from first coined story (for public orgs only)
  let closurePattern: string | null = null;
  let keyFacts: string[] = [];

  if (organization.is_public) {
    const { data: storyData } = await supabase
      .from("public_coined_stories")
      .select("ai_summary")
      .eq("organization_id", id)
      .limit(1)
      .single();

    if (storyData?.ai_summary) {
      const aiSummary = storyData.ai_summary as AISummary;
      closurePattern = aiSummary.closurePattern || null;
      keyFacts = aiSummary.keyFacts || [];
    }
  }

  // For private orgs, use generic metadata
  if (!organization.is_public) {
    const ogImage = memorial?.cenotaph_image_url || "/og-default.svg";
    return {
      title: "An Organization | SOIL",
      description: "A story of organizational experience, preserved at SOIL.",
      openGraph: {
        title: "An Organization",
        description: "A story of organizational experience, preserved at SOIL.",
        images: [{ url: ogImage, width: 1200, height: 630, alt: "SOIL Memorial" }],
        type: "article",
        siteName: "SOIL - Social Organizational Intelligence Lab",
      },
      twitter: {
        card: "summary_large_image",
        title: "An Organization",
        description: "A story of organizational experience, preserved at SOIL.",
        images: [ogImage],
      },
    };
  }

  // Build enhanced metadata for public organizations
  const orgType = organization.organization_type
    ? ORG_TYPE_SEO_LABELS[organization.organization_type] || organization.organization_type
    : null;
  const industry = organization.industry;
  const patternLabel = closurePattern
    ? CLOSURE_PATTERN_SEO_LABELS[closurePattern] || closurePattern.replace(/_/g, " ")
    : null;

  // Enhanced title: "Company Name - Industry Type Case Study | SOIL"
  const titleParts = [organization.name];
  if (industry && orgType) {
    titleParts.push(`${industry} ${orgType} Case Study`);
  } else if (industry) {
    titleParts.push(`${industry} Case Study`);
  } else if (orgType) {
    titleParts.push(`${orgType} Case Study`);
  }
  const title = `${titleParts.join(" - ")} | SOIL`;

  // Enhanced description with pattern and key facts
  let description = "";
  if (patternLabel) {
    description = `Learn from this ${industry || orgType || "organization"}'s ${patternLabel}.`;
  } else {
    description = `The story of ${organization.name}`;
    if (industry) description += `, a ${industry} company`;
    description += ", preserved at SOIL for future founders to learn from.";
  }

  // Add first key fact to description if available
  if (keyFacts.length > 0) {
    description += ` ${keyFacts[0]}`;
  }

  // Limit description length for SEO
  if (description.length > 160) {
    description = description.substring(0, 157) + "...";
  }

  // Use cenotaph image if available, otherwise default
  const ogImage = memorial?.cenotaph_image_url || "/og-default.svg";

  // Build keywords from available data
  const keywords: string[] = [];
  if (industry) keywords.push(industry.toLowerCase());
  if (orgType) keywords.push(orgType.toLowerCase());
  if (patternLabel) keywords.push(patternLabel);
  keywords.push("startup failure", "case study", "organizational lessons", "founder lessons");
  if (organization.location_country) keywords.push(organization.location_country.toLowerCase());

  return {
    title,
    description,
    keywords: keywords.join(", "),
    openGraph: {
      title: organization.name,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${organization.name} - preserved at SOIL`,
        },
      ],
      type: "article",
      siteName: "SOIL - Social Organizational Intelligence Lab",
    },
    twitter: {
      card: "summary_large_image",
      title: organization.name,
      description,
      images: [ogImage],
    },
  };
}

export default async function OrganizationPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Check auth - but don't require it for public pages
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch organization
  const { data: organization, error: orgError } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", id)
    .single();

  if (orgError || !organization) {
    notFound();
  }

  // Determine if current user is the owner
  const isOwner = user ? organization.created_by === user.id : false;

  // Check if current user has a story for this organization
  let currentUserStoryId: string | null = null;
  if (user) {
    const { data: userStory } = await supabase
      .from("stories")
      .select("id")
      .eq("organization_id", id)
      .eq("user_id", user.id)
      .single();
    currentUserStoryId = userStory?.id || null;
  }

  // Fetch all stories for this organization
  const { data: stories, error: storiesError } = await supabase
    .from("stories")
    .select(
      `
      id,
      user_id,
      status,
      current_module,
      completed_modules,
      coined_at,
      created_at,
      updated_at
    `
    )
    .eq("organization_id", id)
    .order("created_at", { ascending: false });

  if (storiesError) {
    console.error("Stories fetch error:", storiesError);
  }

  // Fetch profile data for story authors
  const userIds = stories?.map((s) => s.user_id).filter(Boolean) || [];
  const { data: profiles } =
    userIds.length > 0
      ? await supabase.from("profiles").select("id, display_name").in("id", userIds)
      : { data: [] };

  // Map profiles to stories
  const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);
  const storiesWithProfiles =
    stories?.map((story) => ({
      ...story,
      profile: profileMap.get(story.user_id) || null,
    })) || [];

  // Fetch memorial/cenotaph if exists, with cenotaphery slug for back navigation
  const { data: memorialRaw } = await supabase
    .from("memorials")
    .select(
      `id, slug, epitaph, tombstone_style, tombstone_color, views_count, respects_count, cenotaph_image_url, design_status, cenotaphery_id,
      cenotapheries!memorials_cenotaphery_id_fkey(slug)`
    )
    .eq("organization_id", id)
    .single();

  // Transform to include cenotaphery_slug at top level
  const memorial = memorialRaw
    ? {
        id: memorialRaw.id,
        slug: memorialRaw.slug,
        epitaph: memorialRaw.epitaph,
        tombstone_style: memorialRaw.tombstone_style,
        tombstone_color: memorialRaw.tombstone_color,
        views_count: memorialRaw.views_count,
        respects_count: memorialRaw.respects_count,
        cenotaph_image_url: memorialRaw.cenotaph_image_url,
        design_status: memorialRaw.design_status,
        cenotaphery_slug: (() => {
          const cenotapheries = memorialRaw.cenotapheries;
          if (!cenotapheries) return null;
          // Handle both array and single object from Supabase join
          const cenotaphery = Array.isArray(cenotapheries) ? cenotapheries[0] : cenotapheries;
          return (cenotaphery as { slug: string } | null)?.slug || null;
        })(),
      }
    : null;

  // Peak revenue in USD is stored directly on the organization
  // (converted from original currency at story coining time)
  const peakRevenueUSD: number | null = organization.peak_revenue_usd ?? null;

  // Fetch narrative data from coined stories (always fetch - needed for owner's "View as Visitor" preview)
  let publicNarratives: PublicNarrativeData[] = [];
  // Use public_coined_stories view - exposes only AI-refined data, no raw interview data
  const { data: coinedStories } = await supabase
    .from("public_coined_stories")
    .select("id, user_id, founder_role, public_naming, coined_at, ai_summary")
    .eq("organization_id", id);

  if (coinedStories && coinedStories.length > 0) {
    // Get author names for coined stories
    const coinedUserIds = coinedStories.map((s) => s.user_id);
    const { data: authorProfiles } = await supabase
      .from("profiles")
      .select("id, display_name")
      .in("id", coinedUserIds);

    const authorMap = new Map(authorProfiles?.map((p) => [p.id, p.display_name]) || []);

    publicNarratives = coinedStories.map((story) => {
      // Extract summary data from ai_summary if available
      const aiSummary = story.ai_summary as AISummary | null;
      const summary: PublicSummaryData | null = aiSummary
        ? {
            text: aiSummary.text,
            keyFacts: aiSummary.keyFacts || [],
            closurePattern: aiSummary.closurePattern || null,
          }
        : null;

      return {
        storyId: story.id,
        authorName: authorMap.get(story.user_id) || null,
        founderRole: story.founder_role,
        publicNaming: story.public_naming,
        coinedAt: story.coined_at,
        summary,
      };
    });
  }

  // For owner view: fetch current user's profile and story for verification modal
  let currentUserData = {
    name: "Guest",
    role: null as string | null,
  };

  if (user) {
    const { data: currentUserProfile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single();

    const { data: currentUserStory } = await supabase
      .from("stories")
      .select("founder_role, author_role")
      .eq("organization_id", id)
      .eq("user_id", user.id)
      .single();

    currentUserData = {
      name: currentUserProfile?.display_name || user.email?.split("@")[0] || "Unknown",
      role: currentUserStory?.author_role || currentUserStory?.founder_role || null,
    };
  }

  // Determine view mode
  const viewMode: "owner" | "visitor" = isOwner ? "owner" : "visitor";

  return (
    <OrganizationClient
      organization={organization as OrganizationData}
      stories={storiesWithProfiles as StoryData[]}
      memorial={memorial as MemorialData | null}
      currentUserId={user?.id || null}
      currentUserData={currentUserData}
      isOwner={isOwner}
      viewMode={viewMode}
      publicNarratives={publicNarratives}
      currentUserStoryId={currentUserStoryId}
      peakRevenueUSD={peakRevenueUSD}
    />
  );
}
