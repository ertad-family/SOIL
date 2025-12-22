import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AccountClient } from "./account-client";
import type {
  StoryStatus,
  ModuleId,
  OrganizationType,
  LifecycleStage,
  VerificationStatus,
} from "@/types/interview";

interface OrganizationData {
  id: string;
  slug: string;
  name: string;
  organization_type: OrganizationType | null;
  description: string | null;
  founded_date: string | null;
  closed_date: string | null;
  stage_at_closure: LifecycleStage | null;
  peak_team_size: number | null;
  verification_status: VerificationStatus;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

interface StoryData {
  id: string;
  organization_id: string;
  status: StoryStatus;
  current_module: ModuleId;
  completed_modules: ModuleId[];
  created_at: string;
  updated_at: string;
  coined_at: string | null;
  // Joined organization data
  organization: OrganizationData;
}

interface MemorialData {
  id: string;
  slug: string;
  organization_id: string | null;
}

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // Fetch user's stories with organization data
  const { data: stories } = await supabase
    .from("stories")
    .select(
      `
      id,
      organization_id,
      status,
      current_module,
      completed_modules,
      created_at,
      updated_at,
      coined_at,
      organization:organizations (
        id,
        slug,
        name,
        organization_type,
        description,
        founded_date,
        closed_date,
        stage_at_closure,
        peak_team_size,
        verification_status,
        is_public,
        created_at,
        updated_at
      )
    `
    )
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  // Fetch memorials linked to organizations the user has stories for
  const organizationIds = stories?.map((s) => s.organization_id).filter(Boolean) || [];
  const { data: memorials } =
    organizationIds.length > 0
      ? await supabase
          .from("memorials")
          .select("id, slug, organization_id")
          .in("organization_id", organizationIds)
      : { data: [] };

  // Get profile data
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  return (
    <AccountClient
      user={{
        id: user.id,
        email: user.email || "",
        name:
          profile?.display_name ||
          user.user_metadata?.display_name ||
          user.email?.split("@")[0] ||
          "User",
        avatarUrl: profile?.avatar_url,
        role: profile?.role || "user",
      }}
      stories={(stories as unknown as StoryData[]) || []}
      memorials={(memorials as MemorialData[]) || []}
    />
  );
}
