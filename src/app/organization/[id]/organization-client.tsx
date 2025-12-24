"use client";

import { useState, useEffect } from "react";
import { usePagePrivacy } from "@/contexts/PagePrivacyContext";
import { PublicView } from "./public-view";
import { OwnerView } from "@/components/organization/OwnerView";
import type {
  OrganizationData,
  StoryData,
  MemorialData,
  CurrentUserData,
  PublicNarrativeData,
} from "@/components/organization/types";

interface OrganizationClientProps {
  organization: OrganizationData;
  stories: StoryData[];
  memorial: MemorialData | null;
  currentUserId: string | null;
  currentUserData: CurrentUserData;
  isOwner: boolean;
  viewMode: "owner" | "visitor";
  publicNarratives: PublicNarrativeData[];
  currentUserStoryId: string | null;
  peakRevenueUSD: number | null;
}

export function OrganizationClient({
  organization,
  stories,
  memorial,
  currentUserId,
  currentUserData,
  isOwner,
  viewMode,
  publicNarratives,
  currentUserStoryId,
  peakRevenueUSD,
}: OrganizationClientProps) {
  const { setPagePublic } = usePagePrivacy();

  // Issue #62: Allow owners to toggle between owner and visitor view
  const [overrideViewMode, setOverrideViewMode] = useState<"owner" | "visitor" | null>(null);
  const effectiveViewMode = isOwner ? (overrideViewMode ?? viewMode) : viewMode;

  // Control visitor particles based on effective view mode
  // Owner view = dashboard (no particles), Visitor view = public page (particles)
  useEffect(() => {
    setPagePublic(effectiveViewMode === "visitor");
    return () => setPagePublic(true); // Reset on unmount
  }, [effectiveViewMode, setPagePublic]);

  // For visitor mode, render the public view
  if (effectiveViewMode === "visitor") {
    return (
      <PublicView
        organization={organization}
        memorial={memorial}
        publicNarratives={publicNarratives}
        currentUserId={currentUserId}
        currentUserStoryId={currentUserStoryId}
        peakRevenueUSD={peakRevenueUSD}
        isOwnerPreview={isOwner && overrideViewMode === "visitor"}
        onExitPreview={() => setOverrideViewMode("owner")}
      />
    );
  }

  // Owner mode - render the dashboard
  return (
    <OwnerView
      organization={organization}
      stories={stories}
      memorial={memorial}
      currentUserId={currentUserId!}
      currentUserData={currentUserData}
      isOwner={isOwner}
      onViewAsVisitor={() => setOverrideViewMode("visitor")}
    />
  );
}
