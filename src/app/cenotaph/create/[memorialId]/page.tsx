"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { WizardLayout } from "@/components/layouts/wizard-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Sparkles,
  CheckCircle2,
  Plus,
  AlertCircle,
  MapPin,
  BookOpen,
  ArrowRight,
  HelpCircle,
  RefreshCw,
  ZoomIn,
} from "lucide-react";
import type { DesignOption, DesignStatus } from "@/types/cenotaph";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface MemorialData {
  id: string;
  slug: string;
  organization_id: string | null;
  organization_name: string;
  organization_type: string | null;
  epitaph: string | null;
  design_status: DesignStatus;
  cenotaph_design: {
    options: DesignOption[];
    selectedId: string | null;
  } | null;
  cenotaph_image_url: string | null;
  design_metadata?: {
    attempts?: number;
    generation_progress?: {
      stage: string; // "concepts" | "image_1" | "image_2" | "image_3"
      current: number;
      total: number;
    };
  } | null;
  organization?: {
    name: string;
    organization_type: string | null;
    industry: string | null;
    founded_date: string | null;
    closed_date: string | null;
    peak_team_size: number | null;
    location_country: string | null;
    location_city: string | null;
    // Story is linked to organization, not memorial (one-to-many, returns array)
    story?:
      | {
          id: string;
          status: string;
          completed_modules: string[];
        }[]
      | null;
  } | null;
  cenotaphery?: {
    id: string;
    name: string;
    location: string;
    level: string;
  } | null;
}

// Generation limit constants (must match API)
const MAX_GENERATIONS = 2;

// Convert generation stage to percentage for progress bar
function stageToPercent(stage: string, current: number): number {
  // stages: concepts (0-15%), image_1 (15-45%), image_2 (45-70%), image_3 (70-95%)
  switch (stage) {
    case "concepts":
      return 10;
    case "image_1":
      return 15 + (current === 1 ? 15 : 0); // 15-30%
    case "image_2":
      return 45 + (current === 2 ? 12 : 0); // 45-57%
    case "image_3":
      return 70 + (current === 3 ? 12 : 0); // 70-82%
    default:
      return 5;
  }
}

// Get human-readable stage label
function getStageLabel(stage: string): string {
  switch (stage) {
    case "concepts":
      return "Preparing creative concepts...";
    case "image_1":
      return "Generating design 1 of 3...";
    case "image_2":
      return "Generating design 2 of 3...";
    case "image_3":
      return "Generating design 3 of 3...";
    default:
      return "Starting generation...";
  }
}

const WIZARD_STEPS = [
  { id: "review", label: "Review", description: "Review your organization details" },
  { id: "customize", label: "Customize", description: "Add your design preferences" },
  { id: "generate", label: "Generate", description: "AI creates design options" },
  { id: "select", label: "Select", description: "Choose your cenotaph design" },
];

export default function CenotaphWizardPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const memorialId = params.memorialId as string;
  const isEditMode = searchParams.get("edit") === "true";
  const [memorial, setMemorial] = useState<MemorialData | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [userPrompt, setUserPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);
  const [epitaph, setEpitaph] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  // Track generation attempts for cost control (#234)
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  // Track if generation seems stuck (no progress for too long)
  const [generationStuck, setGenerationStuck] = useState(false);
  // Zoomed image for full-size preview
  const [zoomedImage, setZoomedImage] = useState<DesignOption | null>(null);
  // Track if generating titles for design options
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false);

  // Generate titles for design options that don't have them
  // Uses cheap Gemini 2.0 Flash to create short artistic titles
  useEffect(() => {
    // Only run on Select step when we have options
    if (currentStep !== 3 || !memorial?.cenotaph_design?.options?.length) {
      return;
    }

    // Check if any options are missing titles
    const optionsWithoutTitles = memorial.cenotaph_design.options.filter(
      (opt) => !opt.title || opt.title.trim() === ""
    );

    if (optionsWithoutTitles.length === 0 || isGeneratingTitles) {
      return;
    }

    // Generate titles via API
    const generateTitles = async () => {
      setIsGeneratingTitles(true);
      try {
        const response = await fetch("/api/cenotaph/generate-titles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ memorialId }),
        });

        const result = await response.json();

        if (result.success && result.options) {
          // Update local state with generated titles
          setMemorial((prev) =>
            prev
              ? {
                  ...prev,
                  cenotaph_design: {
                    ...prev.cenotaph_design!,
                    options: result.options,
                  },
                }
              : null
          );
        }
      } catch (err) {
        console.error("Failed to generate titles:", err);
      } finally {
        setIsGeneratingTitles(false);
      }
    };

    generateTitles();
  }, [currentStep, memorial?.cenotaph_design?.options, memorialId, isGeneratingTitles]);

  // Poll for generation progress updates (more reliable than realtime)
  // Works for both: returning users (memorial.design_status === "generating") and active generation (isGenerating)
  useEffect(() => {
    const shouldPoll = (memorial?.design_status === "generating" && !isGenerating) || isGenerating;

    if (!shouldPoll) {
      // Reset progress when not generating
      if (memorial?.design_status !== "generating" && !isGenerating) {
        setGenerationProgress(0);
        setGenerationStuck(false);
      }
      return;
    }

    // Reset stuck state when starting new generation
    setGenerationStuck(false);

    // Start with initial progress
    if (!isGenerating && memorial?.design_metadata?.generation_progress) {
      const initialProgress = memorial.design_metadata.generation_progress;
      setGenerationProgress(stageToPercent(initialProgress.stage, initialProgress.current));
    } else if (isGenerating) {
      setGenerationProgress(5); // Just started
    }

    // Track polls without progress change to detect stuck state
    let lastProgressStage = "";
    let stuckPollCount = 0;
    const STUCK_THRESHOLD = 40; // ~60 seconds (40 * 1.5s) without progress = stuck

    // Poll function to fetch and update progress
    const pollProgress = async () => {
      try {
        const { data, error } = await supabase
          .from("memorials")
          .select("design_status, cenotaph_design, design_metadata")
          .eq("id", memorialId)
          .single();

        if (error) {
          console.error("Polling error:", error.message || error.code || JSON.stringify(error));
          stuckPollCount++;
          if (stuckPollCount >= STUCK_THRESHOLD) {
            setGenerationStuck(true);
          }
          return false;
        }

        // Check if generation failed
        if (data?.design_status === "failed") {
          setGenerationStuck(true);
          setError(data?.design_metadata?.lastError || "Generation failed");
          return true; // Stop polling
        }

        // Update progress based on real data from DB
        const progress = data?.design_metadata?.generation_progress;
        if (progress) {
          const progressKey = `${progress.stage}_${progress.current}`;
          if (progressKey !== lastProgressStage) {
            lastProgressStage = progressKey;
            stuckPollCount = 0; // Reset stuck counter on progress
          } else {
            stuckPollCount++;
          }
          const percent = stageToPercent(progress.stage, progress.current);
          setGenerationProgress(percent);
        } else {
          stuckPollCount++;
        }

        // Check if stuck for too long
        if (stuckPollCount >= STUCK_THRESHOLD) {
          setGenerationStuck(true);
        }

        // Check if generation completed
        if (data?.design_status === "options_ready" && data?.cenotaph_design?.options?.length > 0) {
          // Generation completed - update state
          setMemorial((prev) =>
            prev
              ? {
                  ...prev,
                  design_status: "options_ready" as DesignStatus,
                  cenotaph_design: data.cenotaph_design,
                  design_metadata: data.design_metadata,
                }
              : null
          );
          setGenerationProgress(100);
          return true; // Signal completion
        }
        return false;
      } catch (err) {
        console.error("Poll failed:", err);
        stuckPollCount++;
        if (stuckPollCount >= STUCK_THRESHOLD) {
          setGenerationStuck(true);
        }
        return false;
      }
    };

    // Start polling with immediate first poll after 500ms
    let pollInterval: NodeJS.Timeout;
    const initialPollTimeout = setTimeout(async () => {
      const completed = await pollProgress();
      if (!completed) {
        // Continue polling every 1.5 seconds (faster to catch all stages)
        pollInterval = setInterval(async () => {
          const done = await pollProgress();
          if (done) {
            clearInterval(pollInterval);
          }
        }, 1500);
      }
    }, 500);

    return () => {
      clearTimeout(initialPollTimeout);
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
    // Note: memorial.design_metadata.generation_progress intentionally read once for initial value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memorial?.design_status, isGenerating, memorialId, supabase]);

  // Fetch memorial data
  useEffect(() => {
    async function fetchMemorial() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("memorials")
          .select(
            `
            id,
            slug,
            organization_id,
            organization_name,
            organization_type,
            epitaph,
            design_status,
            cenotaph_design,
            cenotaph_image_url,
            design_metadata,
            organization:organizations (
              name,
              organization_type,
              industry,
              founded_date,
              closed_date,
              peak_team_size,
              location_country,
              location_city,
              story:stories (
                id,
                status,
                completed_modules
              )
            ),
            cenotaphery:cenotapheries (
              id,
              name,
              location,
              level
            )
          `
          )
          .eq("id", memorialId)
          .single();

        if (error) throw error;
        setMemorial(data as unknown as MemorialData);

        // Initialize generation attempts from design_metadata (floor to handle legacy float values)
        const attempts = Math.floor(
          (data as unknown as MemorialData).design_metadata?.attempts || 0
        );
        setAttemptsUsed(attempts);

        // Initialize epitaph from memorial data if exists
        if (data?.epitaph) {
          setEpitaph(data.epitaph);
        }

        // Set initial step based on current design status
        const status = data?.design_status;
        if (status === "completed") {
          if (isEditMode) {
            // User clicked "Change Design" - go to Customize step
            setCurrentStep(1);
          } else {
            // Design already completed - redirect to organization page
            const redirectUrl = (data as unknown as MemorialData).organization_id
              ? `/organization/${(data as unknown as MemorialData).organization_id}`
              : "/account";
            router.push(redirectUrl);
            return;
          }
        } else if (status === "options_ready" && data?.cenotaph_design?.options?.length > 0) {
          setCurrentStep(3); // Go to select step - designs already exist
        } else if (status === "generating") {
          setCurrentStep(2); // Show generating step
          // Note: should implement polling for completion
        }
        // Otherwise start from step 0 (review)
      } catch (err) {
        console.error("Failed to fetch memorial:", err);
        setError("Failed to load memorial data");
      } finally {
        setIsLoading(false);
      }
    }

    if (memorialId) {
      fetchMemorial();
    }
  }, [memorialId, supabase, isEditMode, router]);

  // Generate designs
  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/cenotaph/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memorialId,
          userPrompt,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Generation failed");
      }

      // Update local state with all options (existing + new)
      setMemorial((prev) =>
        prev
          ? {
              ...prev,
              design_status: "options_ready",
              cenotaph_design: {
                options: result.options,
                selectedId: prev.cenotaph_design?.selectedId || null,
              },
            }
          : null
      );

      // Update generation attempts count from API response
      if (result.attemptsUsed !== undefined) {
        setAttemptsUsed(result.attemptsUsed);
      }

      setCurrentStep(3); // Move to select step
    } catch (err) {
      console.error("Generation error:", err);
      setError(err instanceof Error ? err.message : "Failed to generate designs");
    } finally {
      setIsGenerating(false);
    }
  }, [memorialId, userPrompt]);

  // Reset stuck generation - allows user to retry
  const handleResetGeneration = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGenerationStuck(false);

    try {
      // Call API to reset design_status (bypasses RLS)
      const response = await fetch("/api/cenotaph/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memorialId }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Reset failed");
      }

      // Update local state
      setMemorial((prev) =>
        prev
          ? {
              ...prev,
              design_status: "not_started" as DesignStatus,
            }
          : null
      );

      // Go back to customize step
      setCurrentStep(1);
      setGenerationProgress(0);
    } catch (err) {
      console.error("Reset error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to reset generation. Please try refreshing the page."
      );
    } finally {
      setIsLoading(false);
    }
  }, [memorialId]);

  // Select design
  const handleSelect = useCallback(async () => {
    if (!selectedDesignId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/cenotaph/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memorialId,
          selectedDesignId,
          epitaph,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Selection failed");
      }

      // Redirect to organization page in visitor view to see the finished cenotaph
      const redirectUrl = memorial?.organization_id
        ? `/organization/${memorial.organization_id}?view=visitor`
        : "/account";
      router.push(redirectUrl);
    } catch (err) {
      console.error("Selection error:", err);
      setError(err instanceof Error ? err.message : "Failed to save selection");
    } finally {
      setIsLoading(false);
    }
  }, [memorialId, selectedDesignId, epitaph, memorial?.organization_id, router]);

  // Check if designs exist and limit is reached
  const hasExistingDesigns = (memorial?.cenotaph_design?.options?.length || 0) > 0;
  const isLimitReached = attemptsUsed >= MAX_GENERATIONS;

  const handleNext = () => {
    if (currentStep === 1) {
      // If limit reached but designs exist, skip to Select step
      if (isLimitReached && hasExistingDesigns) {
        setCurrentStep(3);
        return;
      }
      // Move to generate step and start generation
      setCurrentStep(2);
      handleGenerate();
    } else if (currentStep === 3) {
      // Final selection
      handleSelect();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, WIZARD_STEPS.length - 1));
    }
  };

  const handleBack = () => {
    if (currentStep === 3) {
      // From Select step, skip Generate step and go back to Customize
      setCurrentStep(1);
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 0));
    }
  };

  if (isLoading && !memorial) {
    return (
      <div className="min-h-screen bg-slate-gradient flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
      </div>
    );
  }

  if (!memorial) {
    return (
      <div className="min-h-screen bg-slate-gradient flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl text-marble-100">Memorial not found</h1>
        </div>
      </div>
    );
  }

  const org = memorial.organization || {
    name: memorial.organization_name,
    organization_type: memorial.organization_type,
    industry: null,
    founded_date: null,
    closed_date: null,
    peak_team_size: null,
    location_country: null,
    location_city: null,
  };

  return (
    <WizardLayout
      variant="dark"
      steps={WIZARD_STEPS}
      currentStep={currentStep}
      onBack={handleBack}
      onNext={handleNext}
      title={WIZARD_STEPS[currentStep].label}
      subtitle={currentStep === 3 ? undefined : WIZARD_STEPS[currentStep].description}
      cancelHref={
        memorial.organization_id ? `/organization/${memorial.organization_id}` : "/account"
      }
      isLoading={isLoading || isGenerating}
      canGoBack={currentStep > 0 && currentStep !== 2 && !isGenerating}
      canGoNext={
        currentStep === 0 ||
        (currentStep === 1 && !isGenerating && (!isLimitReached || hasExistingDesigns)) ||
        (currentStep === 3 && !!selectedDesignId && epitaph.trim().length > 0)
      }
      nextLabel={
        currentStep === 1
          ? isLimitReached
            ? hasExistingDesigns
              ? "View Existing Designs"
              : "Limit Reached"
            : "Generate Designs"
          : currentStep === 3
            ? "Confirm Selection"
            : "Continue"
      }
      wide={currentStep === 3}
      noCard={currentStep === 3}
    >
      {/* Error display */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-md">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Step 1: Review */}
      {currentStep === 0 && (
        <div className="space-y-6">
          <p className="text-slate-300">
            Review your organization details. This information will guide the AI in creating a
            unique memorial design.
          </p>

          <div className="grid gap-4">
            <div className="p-4 bg-slate-700/50 rounded-md">
              <label className="text-sm text-slate-400">Organization Name</label>
              <p className="text-lg text-marble-100 font-medium">{org.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-700/50 rounded-md">
                <label className="text-sm text-slate-400">Industry</label>
                <p className="text-marble-100">
                  {org.industry || org.organization_type || "Not specified"}
                </p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-md">
                <label className="text-sm text-slate-400">Peak Team Size</label>
                <p className="text-marble-100">
                  {org.peak_team_size ? `${org.peak_team_size} people` : "Not specified"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-700/50 rounded-md">
                <label className="text-sm text-slate-400">Founded</label>
                <p className="text-marble-100">{org.founded_date || "Not specified"}</p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-md">
                <label className="text-sm text-slate-400">Closed</label>
                <p className="text-marble-100">{org.closed_date || "Not specified"}</p>
              </div>
            </div>

            {memorial.epitaph && (
              <div className="p-4 bg-slate-700/50 rounded-md">
                <label className="text-sm text-slate-400">Epitaph</label>
                <p className="text-marble-100 italic">&ldquo;{memorial.epitaph}&rdquo;</p>
              </div>
            )}
          </div>

          {/* Cenotaphery placement info */}
          {memorial.cenotaphery && (
            <div className="p-4 bg-gold-500/10 border border-gold-500/30 rounded-md">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gold-400 mt-0.5" />
                <div>
                  <p className="text-gold-300 font-medium">Cenotaphery Placement</p>
                  <p className="text-marble-100 mt-1">{memorial.cenotaphery.name}</p>
                  <p className="text-slate-400 text-sm mt-1">
                    Your cenotaph will be placed in this cenotaphery, and its design will reflect
                    the regional cultural character.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Customize */}
      {currentStep === 1 && (
        <div className="space-y-6">
          {/* Combined info card - Story progress + AI Design Process */}
          {(() => {
            // Story is linked to organization, not memorial (array from Supabase join)
            const story = memorial.organization?.story?.[0];
            const completedModules = story?.completed_modules || [];
            // Exclude basic_info from count (6 story modules total)
            const storyModules = completedModules.filter((m) => m !== "basic_info");
            const totalModules = 6;
            const progress = Math.round((storyModules.length / totalModules) * 100);
            const hasStory = story !== null && story !== undefined;
            const isCoinedOrComplete = story?.status === "coined";

            return (
              <div className="p-4 bg-gold-500/10 border border-gold-500/30 rounded-md space-y-4">
                {/* AI Design Process info */}
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-gold-400 mt-0.5" />
                  <div>
                    <p className="text-gold-300 font-medium">AI Design Process</p>
                    <p className="text-slate-300 text-sm mt-1">
                      Our AI will create 3 unique design options based on your organization&apos;s
                      story and your preferences. You can regenerate options if needed.
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gold-500/30" />

                {/* Story progress row */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <BookOpen
                      className={cn(
                        "h-5 w-5",
                        isCoinedOrComplete
                          ? "text-green-400"
                          : hasStory
                            ? "text-blue-400"
                            : "text-slate-400"
                      )}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p
                          className={cn(
                            "font-medium",
                            isCoinedOrComplete
                              ? "text-green-300"
                              : hasStory
                                ? "text-blue-300"
                                : "text-slate-300"
                          )}
                        >
                          Story Progress
                        </p>
                        <span
                          className={cn(
                            "text-sm font-medium tabular-nums",
                            isCoinedOrComplete
                              ? "text-green-400"
                              : hasStory
                                ? "text-blue-400"
                                : "text-slate-400"
                          )}
                        >
                          {progress}%
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm mt-1">
                        {isCoinedOrComplete
                          ? "Complete! AI will create a highly personalized design."
                          : storyModules.length >= 4
                            ? "Good progress! AI has plenty of context."
                            : storyModules.length > 0
                              ? "More chapters = better design personalization."
                              : "No story yet. Design will be more generic."}
                      </p>
                    </div>
                  </div>

                  {/* CTA button - show when story not complete */}
                  {!isCoinedOrComplete && story?.id && (
                    <a href={`/interview/${story.id}`}>
                      <Button variant="dark-secondary" size="sm">
                        Continue Story
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Generation limit warning */}
          {isLimitReached && (
            <TooltipProvider delayDuration={300}>
              <div
                className={cn(
                  "p-4 rounded-md",
                  hasExistingDesigns
                    ? "bg-blue-500/10 border border-blue-500/30"
                    : "bg-red-500/10 border border-red-500/30"
                )}
              >
                <div className="flex items-start gap-3">
                  <AlertCircle
                    className={cn(
                      "h-5 w-5 mt-0.5",
                      hasExistingDesigns ? "text-blue-400" : "text-red-400"
                    )}
                  />
                  <div className="flex-1">
                    <p
                      className={cn(
                        "font-medium",
                        hasExistingDesigns ? "text-blue-300" : "text-red-300"
                      )}
                    >
                      Generation limit reached ({attemptsUsed}/{MAX_GENERATIONS})
                    </p>
                    <p className="text-slate-400 text-sm mt-1">
                      {hasExistingDesigns
                        ? "You have used all generation attempts. You can still select from your existing designs."
                        : "You have used all generation attempts. No designs were generated."}
                    </p>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-slate-400 hover:text-slate-300">
                        <HelpCircle className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent variant="dark" side="right" className="max-w-xs">
                      <p className="text-sm">
                        Each memorial starts with {MAX_GENERATIONS} generation attempts. You can
                        earn extra attempts by:
                      </p>
                      <ul className="text-sm mt-2 space-y-1 text-slate-300">
                        <li>• Verifying your organization (+1)</li>
                        <li>• Completing the full story (+1)</li>
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </TooltipProvider>
          )}

          <div>
            <label className="block text-sm font-medium text-marble-200 mb-2">
              Your Design Wishes (optional)
            </label>
            <p className="text-slate-400 text-sm mb-3">
              Share your vision for the memorial. Describe any specific elements, styles, or
              symbolism you&apos;d like to see.
            </p>
            <Textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Example: I'd like a monument that incorporates books or knowledge symbols, representing our educational mission. Warm colors would be nice, perhaps with some green elements representing growth..."
              className="min-h-[150px] bg-slate-700 border-slate-600 text-marble-100 placeholder:text-slate-500"
              maxLength={2000}
            />
            <p className="mt-2 text-sm text-slate-400">{userPrompt.length}/2000 characters</p>
          </div>
        </div>
      )}

      {/* Step 3: Generate (loading state) */}
      {currentStep === 2 &&
        (() => {
          // Get real stage from memorial data
          const currentStage = memorial?.design_metadata?.generation_progress?.stage || "starting";
          const stageLabel = getStageLabel(currentStage);

          // Show stuck state if generation seems to have failed
          if (generationStuck) {
            return (
              <div className="py-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-6">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-xl text-marble-100 font-medium mb-4">Generation Issue</h3>
                <p className="text-slate-400 max-w-md mx-auto mb-6">
                  {error ||
                    "The design generation seems to have stopped unexpectedly. This can happen due to AI service issues."}
                </p>
                <div className="flex justify-center gap-3">
                  <Button
                    variant="dark-secondary"
                    onClick={handleResetGeneration}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Go Back & Retry
                  </Button>
                </div>
              </div>
            );
          }

          return (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-500/20 mb-6">
                <Sparkles className="h-8 w-8 text-gold-500" />
              </div>
              <h3 className="text-xl text-marble-100 font-medium mb-4">
                Creating Your Cenotaph Designs
              </h3>

              {/* Progress bar */}
              <div className="max-w-md mx-auto mb-4">
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-500 transition-all duration-300 ease-out"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-slate-400">{stageLabel}</span>
                  <span className="text-gold-400 font-medium tabular-nums">
                    {Math.round(generationProgress)}%
                  </span>
                </div>
              </div>

              <p className="text-slate-500 text-sm max-w-md mx-auto">
                This usually takes 30-45 seconds
              </p>
            </div>
          );
        })()}

      {/* Step 4: Select */}
      {currentStep === 3 && (
        <div className="space-y-6">
          {/* Generate More button with tooltip */}
          <div className="flex items-center justify-end gap-2 mb-4">
            <Button
              variant="dark-ghost"
              size="sm"
              onClick={handleGenerate}
              disabled={isGenerating || attemptsUsed >= MAX_GENERATIONS}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              {isGenerating
                ? "Generating..."
                : attemptsUsed >= MAX_GENERATIONS
                  ? `Limit Reached (${attemptsUsed}/${MAX_GENERATIONS})`
                  : `Generate More (${attemptsUsed}/${MAX_GENERATIONS})`}
            </Button>
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-slate-500 hover:text-slate-400">
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent variant="dark" side="right" className="max-w-xs">
                  <p className="text-sm">
                    Each memorial starts with {MAX_GENERATIONS} generation attempts. You can earn
                    extra attempts by:
                  </p>
                  <ul className="text-sm mt-2 space-y-1 text-slate-300">
                    <li>• Verifying your organization (+1)</li>
                    <li>• Completing the full story (+1)</li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <TooltipProvider delayDuration={300}>
            <div className="grid grid-cols-3 gap-6">
              {memorial.cenotaph_design?.options?.map((option, index) => (
                <Tooltip key={option.id}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "relative rounded-2xl overflow-hidden border-2 transition-all cursor-pointer group",
                        selectedDesignId === option.id
                          ? "border-gold-500 ring-4 ring-gold-500/30"
                          : "border-slate-700 hover:border-slate-500"
                      )}
                      onClick={() => setSelectedDesignId(option.id)}
                    >
                      <div className="relative w-full aspect-square">
                        <Image
                          src={option.url}
                          alt={option.title || `Design option ${index + 1}`}
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          className="object-cover"
                        />
                        {/* Zoom overlay on hover */}
                        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center">
                          <button
                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 hover:bg-slate-900 rounded-full p-3"
                            onClick={(e) => {
                              e.stopPropagation();
                              setZoomedImage(option);
                            }}
                            aria-label="View full size"
                          >
                            <ZoomIn className="h-6 w-6 text-marble-100" />
                          </button>
                        </div>
                      </div>
                      {selectedDesignId === option.id && (
                        <div className="absolute top-4 right-4 bg-gold-500 rounded-full p-2 shadow-lg">
                          <CheckCircle2 className="h-8 w-8 text-slate-900" />
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent variant="dark" side="bottom" className="max-w-xs">
                    <p className="text-sm font-medium">{option.title || `Design ${index + 1}`}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>

          {(!memorial.cenotaph_design?.options ||
            memorial.cenotaph_design.options.length === 0) && (
            <div className="text-center py-8 text-slate-400">
              No designs available. Please go back and generate designs.
            </div>
          )}

          {/* Epitaph input - required before confirming selection */}
          {memorial.cenotaph_design?.options && memorial.cenotaph_design.options.length > 0 && (
            <div className="mt-8 max-w-2xl mx-auto">
              <label className="block text-sm font-medium text-marble-200 mb-2">
                Epitaph <span className="text-red-400">*</span>
              </label>
              <p className="text-slate-400 text-sm mb-3">
                A brief inscription for your cenotaph. This will be displayed on the memorial card.
              </p>
              <Textarea
                value={epitaph}
                onChange={(e) => setEpitaph(e.target.value)}
                placeholder='Example: "Those who do not shepherd their sheep will not find any one day"'
                className="min-h-[100px] bg-slate-700 border-slate-600 text-marble-100 placeholder:text-slate-500"
                maxLength={200}
              />
              <p className="mt-2 text-sm text-slate-400">{epitaph.length}/200 characters</p>
            </div>
          )}
        </div>
      )}

      {/* Zoom modal for full-size image preview */}
      <Dialog open={!!zoomedImage} onOpenChange={(open) => !open && setZoomedImage(null)}>
        <DialogContent variant="dark" size="full" className="p-2 bg-slate-900/95 border-slate-700">
          {zoomedImage && (
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-full max-w-4xl aspect-square">
                <Image
                  src={zoomedImage.url}
                  alt={zoomedImage.title || "Cenotaph design"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-contain"
                  priority
                />
              </div>
              <p className="text-marble-100 font-medium text-lg">
                {zoomedImage.title || "Cenotaph Design"}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </WizardLayout>
  );
}
