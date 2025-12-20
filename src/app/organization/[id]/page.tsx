import { notFound } from "next/navigation";
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
  location_city: string | null;
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

  // Fetch memorial/cenotaph if exists
  const { data: memorial } = await supabase
    .from("memorials")
    .select(
      "id, slug, epitaph, tombstone_style, tombstone_color, views_count, respects_count, cenotaph_image_url, design_status"
    )
    .eq("organization_id", id)
    .single();

  // For public view: fetch narrative data from coined stories
  let publicNarratives: PublicNarrativeData[] = [];
  if (!isOwner) {
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
    />
  );
}
