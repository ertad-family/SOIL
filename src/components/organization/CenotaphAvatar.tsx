"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Landmark, Plus, Pencil, Sparkles, ArrowRight, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShareButton } from "@/components/ui/share-button";
import { useSettings } from "@/hooks/use-settings";
import { isVerificationRequired, isCoinedStoryRequired } from "@/lib/settings";
import { marbleFrameStyles, marbleFrameEmptyStyles } from "./constants";
import { VerificationRequiredModal } from "./VerificationRequiredModal";
import type { MemorialData, StoryData, OrganizationData } from "./types";

interface CenotaphAvatarProps {
  memorial: MemorialData | null;
  organizationId: string;
  isOwner: boolean;
  stories: StoryData[];
  organization: OrganizationData;
  myStory: StoryData | undefined;
}

export function CenotaphAvatar({
  memorial,
  organizationId,
  isOwner,
  stories,
  organization,
  myStory,
}: CenotaphAvatarProps) {
  const router = useRouter();
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);

  // Load project settings
  const { settings } = useSettings();

  // Cenotaph design requirements check
  const hasCoinedStory = stories.some((s) => s.status === "coined");
  const isVerified = organization.verification_status === "verified";

  // Feature flags: configurable via Admin > Settings
  const requireVerification = isVerificationRequired(settings);
  const requireCoinedStory = isCoinedStoryRequired(settings);

  // Check if user can proceed directly without modal
  const needsVerificationModal = requireVerification && !isVerified;
  const needsStoryModal = requireCoinedStory && !hasCoinedStory;
  const canProceedDirectly = !needsVerificationModal && !needsStoryModal;

  // Show appropriate modal based on requirements
  const showRequirementModal = () => {
    if (needsVerificationModal) {
      setShowVerificationModal(true);
    } else if (needsStoryModal) {
      setShowStoryModal(true);
    }
  };

  // Handle "Create Cenotaph" button click - creates memorial and redirects to wizard
  const handleCreateCenotaph = async () => {
    setIsCreating(true);
    try {
      const response = await fetch("/api/memorial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId }),
      });

      const result = await response.json();

      if (result.success && result.memorialId) {
        router.push(`/cenotaph/create/${result.memorialId}`);
      } else {
        console.error("Failed to create memorial:", result.error);
        setIsCreating(false);
      }
    } catch (err) {
      console.error("Error creating memorial:", err);
      setIsCreating(false);
    }
  };

  if (memorial) {
    // Check if memorial has AI-generated cenotaph image
    const hasDesign = !!memorial.cenotaph_image_url;
    const isRegenerating =
      memorial.design_status === "generating" || memorial.design_status === "options_ready";
    const needsDesign = !hasDesign && isOwner;

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => hasDesign && setShowImagePopup(true)}
          className="block group w-full text-left cursor-pointer"
          disabled={!hasDesign}
        >
          {/* Roman Marble Frame */}
          <div className={marbleFrameStyles}>
            {/* Inner content */}
            <div
              className="relative w-full h-full rounded-sm overflow-hidden transition-all"
              style={{
                backgroundColor: hasDesign ? "transparent" : memorial.tombstone_color || "#1e293b",
              }}
            >
              {/* AI-generated cenotaph image */}
              {hasDesign && memorial.cenotaph_image_url && (
                <>
                  <Image
                    src={memorial.cenotaph_image_url}
                    alt="Cenotaph design"
                    fill
                    sizes="(max-width: 640px) 100vw, 300px"
                    className="object-cover"
                  />
                  {/* Epitaph overlay at bottom */}
                  {memorial.epitaph && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent pt-12 pb-4 px-4">
                      <p className="text-marble-200 font-serif text-sm italic text-center line-clamp-3">
                        &ldquo;{memorial.epitaph}&rdquo;
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Decorative corner ornaments (only when no image) */}
              {!hasDesign && (
                <>
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-gold-400/40" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-gold-400/40" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-gold-400/40" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-gold-400/40" />
                </>
              )}

              {/* Tombstone Preview (only when no image) */}
              {!hasDesign && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <Landmark className="w-10 h-10 text-marble-300/80 mb-3" />
                  <p className="text-marble-200 font-serif text-sm italic line-clamp-3 px-2">
                    {memorial.epitaph || "In memoriam"}
                  </p>
                </div>
              )}

              {/* Hover Overlay (only when has design) */}
              {hasDesign && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500 text-slate-900 text-sm font-medium rounded-md">
                    View Cenotaph
                  </span>
                </div>
              )}

              {/* Stats - positioned above epitaph when present */}
              <div
                className={`absolute left-3 right-3 flex justify-center gap-4 text-sm ${
                  hasDesign && memorial.epitaph
                    ? "bottom-16 text-marble-300/80"
                    : "bottom-3 text-slate-400"
                }`}
              >
                <span className="flex items-center gap-1">
                  <span className="text-sm">✦</span>
                  {memorial.respects_count}
                </span>
              </div>
            </div>
          </div>
        </button>

        {/* Share Button - only when verified and has design */}
        {isVerified && hasDesign && (
          <div className="mt-3 flex justify-center">
            <ShareButton
              url={`${typeof window !== "undefined" ? window.location.origin : ""}/organization/${organizationId}`}
              title={`${organization.name} - preserved at SOIL`}
              description="A story of organizational experience, preserved for future founders to learn from."
            />
          </div>
        )}

        {/* Image Popup Modal */}
        {showImagePopup && memorial.cenotaph_image_url && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setShowImagePopup(false)}
          >
            <button
              type="button"
              className="absolute top-4 right-4 text-marble-300 hover:text-marble-100 transition-colors"
              onClick={() => setShowImagePopup(false)}
            >
              <XCircle className="w-8 h-8" />
            </button>
            <div
              className="relative max-w-full max-h-[90vh] w-[90vw] h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={memorial.cenotaph_image_url}
                alt="Cenotaph design"
                fill
                sizes="90vw"
                className="object-contain rounded-lg shadow-2xl"
              />
            </div>
          </div>
        )}

        {/* Design Cenotaph button (shown when no AI design yet) */}
        {needsDesign && (
          <div className="mt-3 text-center">
            {canProceedDirectly ? (
              <a href={`/cenotaph/create/${memorial.id}`}>
                <Button
                  variant="dark-secondary"
                  size="sm"
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  Design Cenotaph
                </Button>
              </a>
            ) : (
              <Button
                variant="dark-secondary"
                size="sm"
                leftIcon={<Sparkles className="w-4 h-4" />}
                onClick={showRequirementModal}
              >
                Design Cenotaph
              </Button>
            )}
          </div>
        )}

        {/* Verification Required Modal */}
        <VerificationRequiredModal
          open={showVerificationModal}
          onOpenChange={setShowVerificationModal}
          variant="cenotaph"
        />

        {/* Story Encouragement Modal */}
        <Dialog open={showStoryModal} onOpenChange={setShowStoryModal}>
          <DialogContent variant="dark" size="md">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-gold-400" />
                </div>
                <DialogTitle variant="dark">Personalize Your Cenotaph</DialogTitle>
              </div>
              <DialogDescription variant="dark">
                Your cenotaph can be much more meaningful with a completed story.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-4">
              {/* Personalized option */}
              <div className="p-4 rounded-lg border border-gold-500/30 bg-gold-500/5">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium text-marble-100 mb-1">
                      Complete Your Story for a Unique Cenotaph
                    </h4>
                    <p className="text-sm text-slate-400">
                      Finishing your story allows us to create a highly personalized cenotaph that
                      reflects your organization&apos;s unique history, lessons learned, and legacy.
                      The AI will use your detailed narrative to generate a truly meaningful
                      memorial.
                    </p>
                    <div className="mt-3">
                      {myStory ? (
                        <a href={`/interview/${myStory.id}`}>
                          <Button
                            variant="dark-primary"
                            size="sm"
                            rightIcon={<ArrowRight className="w-4 h-4" />}
                          >
                            Complete Story First (Recommended)
                          </Button>
                        </a>
                      ) : (
                        <a href={`/interview?org=${organizationId}`}>
                          <Button
                            variant="dark-primary"
                            size="sm"
                            rightIcon={<Plus className="w-4 h-4" />}
                          >
                            Start Your Story (Recommended)
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Generic option */}
              <div className="p-4 rounded-lg border border-slate-700 bg-slate-800/50">
                <div className="flex items-start gap-3">
                  <Landmark className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium text-marble-200 mb-1">
                      Proceed with Generic Design
                    </h4>
                    <p className="text-sm text-slate-500">
                      You can create a cenotaph now based only on basic organization information.
                      The design will be more generic and won&apos;t capture the full depth of your
                      organization&apos;s story.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="dark-ghost" onClick={() => setShowStoryModal(false)}>
                Cancel
              </Button>
              <a href={`/cenotaph/create/${memorial.id}`}>
                <Button variant="dark-secondary" size="sm">
                  Proceed Anyway
                </Button>
              </a>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Change Design / Continue Designing button (shown when design exists and user is owner) */}
        {hasDesign && isOwner && (
          <div className="mt-3 text-center">
            <a href={`/cenotaph/create/${memorial.id}`}>
              <Button
                variant="dark-ghost"
                size="sm"
                leftIcon={
                  isRegenerating ? <Sparkles className="w-4 h-4" /> : <Pencil className="w-4 h-4" />
                }
              >
                {isRegenerating ? "Continue Designing" : "Change Design"}
              </Button>
            </a>
          </div>
        )}
      </div>
    );
  }

  // No cenotaph - show invitation with Roman frame style
  return (
    <>
      <div className={marbleFrameEmptyStyles}>
        <div className="relative w-full h-full rounded-sm bg-slate-800/50 flex flex-col items-center justify-center p-6 text-center">
          {/* Decorative corner ornaments */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-slate-500/50" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-slate-500/50" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-slate-500/50" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-slate-500/50" />

          <div className="w-14 h-14 rounded-full bg-slate-700/50 flex items-center justify-center mb-3 border border-slate-600">
            <Landmark className="w-7 h-7 text-slate-500" />
          </div>
          <h3 className="font-display text-base text-marble-300 mb-2">No Cenotaph Yet</h3>
          <p className="text-slate-500 text-sm mb-4 px-2">
            Create a memorial to preserve this legacy
          </p>
          {isOwner &&
            (canProceedDirectly ? (
              <Button
                variant="dark-primary"
                size="sm"
                rightIcon={<Plus className="w-4 h-4" />}
                onClick={handleCreateCenotaph}
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create Cenotaph"}
              </Button>
            ) : (
              <Button
                variant="dark-primary"
                size="sm"
                rightIcon={<Plus className="w-4 h-4" />}
                onClick={showRequirementModal}
              >
                Create Cenotaph
              </Button>
            ))}
        </div>
      </div>

      {/* Verification Required Modal (for empty state) */}
      <VerificationRequiredModal
        open={showVerificationModal}
        onOpenChange={setShowVerificationModal}
        variant="cenotaph"
      />

      {/* Story Encouragement Modal (for empty state) */}
      <Dialog open={showStoryModal} onOpenChange={setShowStoryModal}>
        <DialogContent variant="dark" size="md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-gold-400" />
              </div>
              <DialogTitle variant="dark">Personalize Your Cenotaph</DialogTitle>
            </div>
            <DialogDescription variant="dark">
              Your cenotaph can be much more meaningful with a completed story.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            {/* Personalized option */}
            <div className="p-4 rounded-lg border border-gold-500/30 bg-gold-500/5">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium text-marble-100 mb-1">
                    Complete Your Story for a Unique Cenotaph
                  </h4>
                  <p className="text-sm text-slate-400">
                    Finishing your story allows us to create a highly personalized cenotaph that
                    reflects your organization&apos;s unique history, lessons learned, and legacy.
                    The AI will use your detailed narrative to generate a truly meaningful memorial.
                  </p>
                  <div className="mt-3">
                    {myStory ? (
                      <a href={`/interview/${myStory.id}`}>
                        <Button
                          variant="dark-primary"
                          size="sm"
                          rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                          Complete Story First (Recommended)
                        </Button>
                      </a>
                    ) : (
                      <a href={`/interview?org=${organizationId}`}>
                        <Button
                          variant="dark-primary"
                          size="sm"
                          rightIcon={<Plus className="w-4 h-4" />}
                        >
                          Start Your Story (Recommended)
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Generic option */}
            <div className="p-4 rounded-lg border border-slate-700 bg-slate-800/50">
              <div className="flex items-start gap-3">
                <Landmark className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium text-marble-200 mb-1">Proceed with Generic Design</h4>
                  <p className="text-sm text-slate-500">
                    You can create a cenotaph now based only on basic organization information. The
                    design will be more generic and won&apos;t capture the full depth of your
                    organization&apos;s story.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="dark-ghost" onClick={() => setShowStoryModal(false)}>
              Cancel
            </Button>
            <Button
              variant="dark-secondary"
              size="sm"
              onClick={() => {
                setShowStoryModal(false);
                handleCreateCenotaph();
              }}
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Proceed Anyway"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
