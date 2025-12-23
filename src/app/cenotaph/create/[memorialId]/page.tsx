"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useTestimonialPrompt } from "@/contexts/TestimonialPromptContext";
import { WizardLayout } from "@/components/layouts/wizard-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, CheckCircle2, Plus, AlertCircle, MessageSquare } from "lucide-react";
import type { DesignOption, DesignStatus, OrganizationContext } from "@/types/cenotaph";
import { cn } from "@/lib/utils";
import { ShareButton } from "@/components/ui/share-button";

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
  organization?: {
    name: string;
    organization_type: string | null;
    industry: string | null;
    founded_date: string | null;
    closed_date: string | null;
    peak_team_size: number | null;
    location_country: string | null;
    location_city: string | null;
  } | null;
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
  const supabase = createClient();
  const memorialId = params.memorialId as string;
  const { showPrompt, hasFeedbackBeenGiven } = useTestimonialPrompt();

  const [memorial, setMemorial] = useState<MemorialData | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [userPrompt, setUserPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);
  const [epitaph, setEpitaph] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  // Track if design was already completed when page loaded (to avoid auto-showing modal on return visits)
  const [wasCompletedOnLoad, setWasCompletedOnLoad] = useState(false);

  // Poll for generation completion when status is 'generating'
  useEffect(() => {
    // Only poll if we loaded with 'generating' status and aren't actively generating ourselves
    if (!memorial || memorial.design_status !== "generating" || isGenerating) {
      return;
    }

    // Start showing progress animation for returning user
    setGenerationProgress(30); // Start at 30% since generation already in progress

    // Slowly animate progress while polling (30% -> 85% over ~30 seconds)
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => Math.min(prev + 1.5, 85));
    }, 1000);

    const pollInterval = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from("memorials")
          .select("design_status, cenotaph_design")
          .eq("id", memorialId)
          .single();

        if (error) {
          console.error("Polling error:", error);
          return;
        }

        if (data?.design_status === "options_ready" && data?.cenotaph_design?.options?.length > 0) {
          // Generation completed - update state and move to select step
          setMemorial((prev) =>
            prev
              ? {
                  ...prev,
                  design_status: "options_ready",
                  cenotaph_design: data.cenotaph_design,
                }
              : null
          );
          setGenerationProgress(100);
          clearInterval(progressInterval);
          setTimeout(() => setCurrentStep(3), 500); // Brief delay to show 100%
          clearInterval(pollInterval);
        }
      } catch (err) {
        console.error("Poll failed:", err);
      }
    }, 3000); // Poll every 3 seconds

    return () => {
      clearInterval(pollInterval);
      clearInterval(progressInterval);
    };
  }, [memorial, isGenerating, memorialId, supabase]);

  // Animate progress bar during generation
  useEffect(() => {
    if (!isGenerating) {
      // Don't reset if we're polling (returning user)
      if (memorial?.design_status !== "generating") {
        setGenerationProgress(0);
      }
      return;
    }

    // Progress: 0-30% fast (5s), 30-60% medium (15s), 60-90% slow (20s)
    const intervals = [
      { target: 30, duration: 5000, step: 100 },
      { target: 60, duration: 15000, step: 200 },
      { target: 90, duration: 20000, step: 500 },
    ];

    let currentTarget = 0;
    const timers: NodeJS.Timeout[] = [];

    intervals.forEach(({ target, duration, step }) => {
      const increment = (target - currentTarget) / (duration / step);
      let progress = currentTarget;

      const timer = setInterval(() => {
        progress += increment;
        if (progress >= target) {
          progress = target;
          clearInterval(timer);
        }
        setGenerationProgress((prev) => Math.max(prev, Math.min(progress, 90)));
      }, step);

      timers.push(timer);
      currentTarget = target;
    });

    return () => timers.forEach((t) => clearInterval(t));
  }, [isGenerating, memorial?.design_status]);

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
            organization:organizations (
              name,
              organization_type,
              industry,
              founded_date,
              closed_date,
              peak_team_size,
              location_country,
              location_city
            )
          `
          )
          .eq("id", memorialId)
          .single();

        if (error) throw error;
        setMemorial(data as unknown as MemorialData);

        // Initialize epitaph from memorial data if exists
        if (data?.epitaph) {
          setEpitaph(data.epitaph);
        }

        // Set initial step based on current design status
        const status = data?.design_status;
        if (status === "completed") {
          setCurrentStep(3); // Show completed state
          setSelectedDesignId(data.cenotaph_design?.selectedId || null);
          setWasCompletedOnLoad(true); // Track that design was already completed on load
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
  }, [memorialId, supabase]);

  // Auto-show feedback modal when design is completed during this session
  useEffect(() => {
    // Only show if design was completed DURING this session (not on return visits)
    if (
      memorial?.design_status === "completed" &&
      !wasCompletedOnLoad &&
      !hasFeedbackBeenGiven("cenotaph_design")
    ) {
      // Show modal after 2 seconds so user can see the completion screen first
      const timer = setTimeout(() => {
        showPrompt({
          type: "cenotaph_design",
          contextId: memorial.id,
          contextMetadata: {
            organizationName: memorial.organization_name,
            organizationId: memorial.organization_id,
          },
          title: "Your feedback matters",
          description: "How was your cenotaph creation experience?",
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [memorial, wasCompletedOnLoad, showPrompt, hasFeedbackBeenGiven]);

  // Handler for feedback button click
  const handleFeedbackClick = useCallback(() => {
    if (!memorial) return;
    showPrompt({
      type: "cenotaph_design",
      contextId: memorial.id,
      contextMetadata: {
        organizationName: memorial.organization_name,
        organizationId: memorial.organization_id,
      },
      title: "Your feedback matters",
      description: "How was your cenotaph creation experience?",
    });
  }, [memorial, showPrompt]);

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

      setCurrentStep(3); // Move to select step
    } catch (err) {
      console.error("Generation error:", err);
      setError(err instanceof Error ? err.message : "Failed to generate designs");
    } finally {
      setIsGenerating(false);
    }
  }, [memorialId, userPrompt]);

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

      // Update local state
      setMemorial((prev) =>
        prev
          ? {
              ...prev,
              design_status: "completed",
              cenotaph_image_url: result.imageUrl,
              cenotaph_design: prev.cenotaph_design
                ? {
                    ...prev.cenotaph_design,
                    selectedId: selectedDesignId,
                  }
                : null,
            }
          : null
      );

      // Stay on wizard page - design selection complete
    } catch (err) {
      console.error("Selection error:", err);
      setError(err instanceof Error ? err.message : "Failed to save selection");
    } finally {
      setIsLoading(false);
    }
  }, [memorialId, selectedDesignId, epitaph]);

  const handleNext = () => {
    if (currentStep === 1) {
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
        (currentStep === 1 && !isGenerating) ||
        (currentStep === 3 &&
          !!selectedDesignId &&
          epitaph.trim().length > 0 &&
          memorial.design_status !== "completed")
      }
      nextLabel={
        currentStep === 1
          ? "Generate Designs"
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
        </div>
      )}

      {/* Step 2: Customize */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <p className="text-slate-300">
            Share your vision for the memorial. Describe any specific elements, styles, or symbolism
            you&apos;d like to see.
          </p>

          <div>
            <label className="block text-sm font-medium text-marble-200 mb-2">
              Your Design Wishes (optional)
            </label>
            <Textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Example: I'd like a monument that incorporates books or knowledge symbols, representing our educational mission. Warm colors would be nice, perhaps with some green elements representing growth..."
              className="min-h-[150px] bg-slate-700 border-slate-600 text-marble-100 placeholder:text-slate-500"
              maxLength={2000}
            />
            <p className="mt-2 text-sm text-slate-400">{userPrompt.length}/2000 characters</p>
          </div>

          <div className="p-4 bg-gold-500/10 border border-gold-500/30 rounded-md">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-gold-400 mt-0.5" />
              <div>
                <p className="text-gold-300 font-medium">AI Design Process</p>
                <p className="text-slate-300 text-sm mt-1">
                  Our AI will create 3 unique design options based on your organization&apos;s story
                  and your preferences. You can regenerate options if needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Generate (loading state) */}
      {currentStep === 2 &&
        (() => {
          // Check if we're polling (returned to in-progress generation) vs actively generating
          const isPolling = !isGenerating && memorial?.design_status === "generating";

          return (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-500/20 mb-6">
                <Sparkles className="h-8 w-8 text-gold-500" />
              </div>
              <h3 className="text-xl text-marble-100 font-medium mb-4">
                {isPolling ? "Generation in Progress" : "Creating Your Cenotaph Designs"}
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
                  <span className="text-slate-400">
                    {isPolling
                      ? "Checking status..."
                      : generationProgress < 30
                        ? "Preparing prompts..."
                        : generationProgress < 60
                          ? "Generating design 1 of 3..."
                          : generationProgress < 80
                            ? "Generating design 2 of 3..."
                            : "Generating design 3 of 3..."}
                  </span>
                  <span className="text-gold-400 font-medium tabular-nums">
                    {Math.round(generationProgress)}%
                  </span>
                </div>
              </div>

              <p className="text-slate-500 text-sm max-w-md mx-auto">
                {isPolling
                  ? "Your designs are being generated. Please wait..."
                  : "This usually takes 30-45 seconds"}
              </p>
            </div>
          );
        })()}

      {/* Step 4: Select */}
      {currentStep === 3 && (
        <div className="space-y-6">
          {memorial.design_status === "completed" ? (
            <div className="text-center py-8">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl text-marble-100 font-medium mb-2">Design Complete</h3>
              <p className="text-slate-400 mb-6">Your cenotaph design has been saved.</p>
              {memorial.cenotaph_image_url && (
                <div className="relative max-w-sm mx-auto rounded-lg overflow-hidden border border-slate-600 aspect-square">
                  <Image
                    src={memorial.cenotaph_image_url}
                    alt="Your cenotaph design"
                    fill
                    sizes="(max-width: 640px) 100vw, 384px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="mt-6 flex gap-3 justify-center">
                <Button
                  variant="dark-ghost"
                  onClick={() => {
                    // Reset to allow generating new designs
                    setMemorial((prev) =>
                      prev
                        ? {
                            ...prev,
                            design_status: "options_ready",
                            cenotaph_design: { options: [], selectedId: null },
                          }
                        : null
                    );
                    setSelectedDesignId(null);
                    setCurrentStep(2);
                    handleGenerate();
                  }}
                  leftIcon={<Sparkles className="h-4 w-4" />}
                >
                  Create New Design
                </Button>
                <Button variant="dark-primary" onClick={() => router.push("/account")}>
                  Back to Account
                </Button>
              </div>

              {/* Share CTA */}
              <div className="mt-8 pt-8 border-t border-slate-700">
                <p className="text-sm text-slate-400 text-center mb-3">
                  Share your cenotaph creation with others
                </p>
                <div className="flex justify-center">
                  <ShareButton
                    url={
                      memorial.organization_id
                        ? `https://soil.rip/organization/${memorial.organization_id}`
                        : "https://soil.rip"
                    }
                    title={`I just created a cenotaph for ${memorial.organization_name} on SOIL`}
                    description="Honoring the legacy of organizations that shaped our world. Create yours at soil.rip"
                    memorialId={memorial.id}
                    organizationId={memorial.organization_id || undefined}
                  />
                </div>
              </div>

              {/* Feedback prompt - only show if not already given */}
              {!hasFeedbackBeenGiven("cenotaph_design") && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <p className="text-xs text-slate-400 text-center mb-2">
                    Your feedback helps us improve the experience for future creators
                  </p>
                  <Button
                    variant="dark-ghost"
                    size="sm"
                    onClick={handleFeedbackClick}
                    className="w-full justify-center"
                  >
                    <MessageSquare className="h-3.5 w-3.5 mr-2" />
                    Share Your Feedback
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="flex justify-end mb-4">
                <Button
                  variant="dark-ghost"
                  size="sm"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  {isGenerating ? "Generating..." : "Generate More"}
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {memorial.cenotaph_design?.options?.map((option, index) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedDesignId(option.id)}
                    className={cn(
                      "relative rounded-2xl overflow-hidden border-2 transition-all",
                      selectedDesignId === option.id
                        ? "border-gold-500 ring-4 ring-gold-500/30"
                        : "border-slate-700 hover:border-slate-500"
                    )}
                  >
                    <div className="relative w-full aspect-square">
                      <Image
                        src={option.url}
                        alt={`Design option ${index + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    {selectedDesignId === option.id && (
                      <div className="absolute top-4 right-4 bg-gold-500 rounded-full p-2 shadow-lg">
                        <CheckCircle2 className="h-8 w-8 text-slate-900" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
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
                    A brief inscription for your cenotaph. This will be displayed on the memorial
                    card.
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
            </>
          )}
        </div>
      )}
    </WizardLayout>
  );
}
