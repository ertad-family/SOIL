"use client";

import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Landmark,
  Plus,
  Pencil,
  Sparkles,
  ArrowRight,
  XCircle,
  Box,
  ImageIcon,
  Loader2,
  Wand2,
  AlertCircle,
} from "lucide-react";
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
import { use3DGenerationStatus } from "@/hooks/use-3d-generation-status";
import { isVerificationRequired, isCoinedStoryRequired, isModel3dEnabled } from "@/lib/settings";
import { check3DModelEligibility } from "@/lib/cenotaph/model3d/client";
import { marbleFrameStyles, marbleFrameEmptyStyles } from "./constants";
import { VerificationRequiredModal } from "./VerificationRequiredModal";
import type { MemorialData, StoryData, OrganizationData } from "./types";

// Lazy load the 3D viewer to avoid loading Three.js on initial page load
const Cenotaph3DViewer = dynamic(
  () => import("@/components/three/Cenotaph3DViewer").then((mod) => mod.Cenotaph3DViewer),
  { ssr: false }
);

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
  const [showPopup, setShowPopup] = useState(false);
  const [popupViewMode, setPopupViewMode] = useState<"2d" | "3d">("2d");
  const [isCreating, setIsCreating] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [isStarting3D, setIsStarting3D] = useState(false);

  // Load project settings
  const { settings } = useSettings();

  // 3D generation polling hook
  const {
    status: model3dStatus,
    isPolling: is3DPolling,
    modelUrl: generatedModelUrl,
    error: model3dError,
    progress: model3dProgress,
    startGeneration,
  } = use3DGenerationStatus(
    memorial?.id || null,
    memorial?.model_generation_status,
    memorial?.cenotaph_model_url
  );

  // Cenotaph design requirements check
  const hasCoinedStory = stories.some((s) => s.status === "coined");
  const isVerified = organization.verification_status === "verified";

  // 3D model eligibility check (Issue #254)
  const model3dEligibility = check3DModelEligibility(
    { verification_status: organization.verification_status },
    stories.map((s) => ({ status: s.status })),
    settings
  );
  const canGenerate3D = isModel3dEnabled(settings) && model3dEligibility.eligible;

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

  // Handle "Generate 3D Model" button click
  const handleStart3DGeneration = async () => {
    setIsStarting3D(true);
    try {
      await startGeneration();
    } finally {
      setIsStarting3D(false);
    }
  };

  if (memorial) {
    // Check if memorial has AI-generated cenotaph image and/or 3D model
    const hasDesign = !!memorial.cenotaph_image_url;
    // Use generated URL from hook if available (for live updates after generation)
    const has3DModel = !!memorial.cenotaph_model_url || !!generatedModelUrl;
    const current3DModelUrl = generatedModelUrl || memorial.cenotaph_model_url;
    const isRegenerating =
      memorial.design_status === "generating" || memorial.design_status === "options_ready";
    const needsDesign = !hasDesign && isOwner;

    // 3D generation state (includes "downloading" - model ready, uploading to storage)
    const is3DGenerating =
      model3dStatus === "pending" ||
      model3dStatus === "processing" ||
      model3dStatus === "downloading";
    const can3DGenerationStart =
      hasDesign && !has3DModel && !is3DGenerating && canGenerate3D && isOwner;

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            if (hasDesign) {
              setPopupViewMode("2d");
              setShowPopup(true);
            }
          }}
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

        {/* Share Button (verified orgs only) */}
        {isVerified && hasDesign && (
          <div className="mt-3 flex justify-center">
            <ShareButton
              url={`${typeof window !== "undefined" ? window.location.origin : ""}/organization/${organizationId}`}
              title={`${organization.name} - preserved at SOIL`}
              description="A story of organizational experience, preserved for future founders to learn from."
            />
          </div>
        )}

        {/* 3D Model Controls (Issue #254) - eligibility based on settings */}
        {hasDesign && (
          <div className="mt-3 flex flex-col items-center gap-2">
            {/* View 3D button - only when 3D model is available */}
            {has3DModel && (
              <Button
                variant="dark-ghost"
                size="sm"
                leftIcon={<Box className="w-4 h-4" />}
                onClick={() => {
                  setPopupViewMode("3d");
                  setShowPopup(true);
                }}
              >
                View 3D
              </Button>
            )}

            {/* Generate 3D Model button */}
            {can3DGenerationStart && (
              <Button
                variant="dark-secondary"
                size="sm"
                leftIcon={
                  isStarting3D ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )
                }
                onClick={handleStart3DGeneration}
                disabled={isStarting3D}
              >
                {isStarting3D ? "Starting..." : "Generate 3D Model"}
              </Button>
            )}

            {/* 3D Generation in progress */}
            {is3DGenerating && (
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 max-w-xs">
                <div className="flex items-center gap-2 text-sm text-gold-400 mb-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="font-medium">
                    Generating 3D model
                    {model3dProgress !== undefined ? ` (${model3dProgress}%)` : "..."}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  This typically takes 3-5 minutes. Feel free to browse other cenotaphs or close
                  this page — we&apos;ll save your model when it&apos;s ready.
                </p>
              </div>
            )}

            {/* 3D Generation failed - show retry */}
            {model3dStatus === "failed" && isOwner && (
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2 text-sm text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>{model3dError || "3D generation failed"}</span>
                </div>
                {canGenerate3D && (
                  <Button
                    variant="dark-ghost"
                    size="sm"
                    leftIcon={
                      isStarting3D ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Wand2 className="w-4 h-4" />
                      )
                    }
                    onClick={handleStart3DGeneration}
                    disabled={isStarting3D}
                  >
                    {isStarting3D ? "Starting..." : "Retry 3D Generation"}
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Cenotaph Popup Modal with 2D/3D Toggle */}
        {showPopup && (memorial.cenotaph_image_url || current3DModelUrl) && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setShowPopup(false)}
          >
            {/* Close button */}
            <button
              type="button"
              className="absolute top-4 right-4 text-marble-300 hover:text-marble-100 transition-colors z-10"
              onClick={() => setShowPopup(false)}
            >
              <XCircle className="w-8 h-8" />
            </button>

            {/* 2D/3D Toggle (shown when both 2D image and 3D model available) */}
            {has3DModel && hasDesign && (
              <div className="absolute top-4 left-4 z-10 flex gap-2 bg-slate-800/80 backdrop-blur-sm rounded-lg p-1">
                <button
                  type="button"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    popupViewMode === "2d"
                      ? "bg-gold-500 text-slate-900"
                      : "text-marble-300 hover:bg-slate-700/50"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPopupViewMode("2d");
                  }}
                >
                  <ImageIcon className="w-4 h-4" />
                  2D
                </button>
                <button
                  type="button"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    popupViewMode === "3d"
                      ? "bg-gold-500 text-slate-900"
                      : "text-marble-300 hover:bg-slate-700/50"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPopupViewMode("3d");
                  }}
                >
                  <Box className="w-4 h-4" />
                  3D
                </button>
              </div>
            )}

            {/* Content container */}
            <div
              className="relative max-w-full max-h-[90vh] w-[90vw] h-[90vh] rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 2D Image View */}
              {popupViewMode === "2d" && memorial.cenotaph_image_url && (
                <Image
                  src={memorial.cenotaph_image_url}
                  alt="Cenotaph design"
                  fill
                  sizes="90vw"
                  className="object-contain rounded-lg shadow-2xl"
                />
              )}

              {/* 3D Model View */}
              {popupViewMode === "3d" && current3DModelUrl && (
                <Suspense
                  fallback={
                    <div className="w-full h-full flex items-center justify-center bg-slate-900">
                      <div className="text-marble-300">Loading 3D viewer...</div>
                    </div>
                  }
                >
                  <Cenotaph3DViewer
                    modelUrl={current3DModelUrl}
                    renderSettings={memorial.cenotaph_render_settings}
                    className="w-full h-full"
                  />
                </Suspense>
              )}
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
            <a href={`/cenotaph/create/${memorial.id}?edit=true`}>
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
