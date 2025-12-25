"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type {
  Story,
  StoryStatus,
  ModuleId,
  BasicInfoData,
  FunctionalMappingData,
  FinancialPictureData,
  DynamicPictureData,
  EnvironmentData,
  FounderContextData,
  NarrativeData,
  AISummary,
  AISummaryStatus,
} from "@/types/interview";
import {
  createEmptyStory,
  createEmptyOrganization,
  createEmptyNarrative,
  MODULES,
  getNextModule,
  calculateProgress,
} from "@/types/interview";
import { trackWizardEvent } from "@/lib/analytics";

// =============================================================================
// TYPES
// =============================================================================

interface InterviewContextValue {
  // Story data
  story: Story | null;
  isLoading: boolean;
  error: string | null;

  // Derived state
  progress: number;
  isModuleComplete: (moduleId: ModuleId) => boolean;
  canNavigateToModule: (moduleId: ModuleId) => boolean;

  // Actions
  loadStory: (storyId: string) => Promise<void>;
  createStory: () => Promise<string | null>;
  updateBasicInfo: (data: Partial<BasicInfoData>) => void;
  updateFunctionalMapping: (data: Partial<FunctionalMappingData>) => void;
  updateFinancialPicture: (data: Partial<FinancialPictureData>) => void;
  updateDynamicPicture: (data: Partial<DynamicPictureData>) => void;
  updateEnvironment: (data: Partial<EnvironmentData>) => void;
  updateFounderContext: (data: Partial<FounderContextData>) => void;
  updateNarrative: (data: Partial<NarrativeData>) => void;
  completeModule: (moduleId: ModuleId) => Promise<void>;
  navigateToModule: (moduleId: ModuleId) => void;
  saveStory: () => Promise<void>;
  coinStory: () => Promise<void>;
  refreshSummary: () => Promise<void>;

  // Save state
  isSaving: boolean;
  lastSavedAt: Date | null;
  hasUnsavedChanges: boolean;
}

interface InterviewProviderProps {
  children: React.ReactNode;
  storyId: string;
}

// =============================================================================
// CONTEXT
// =============================================================================

const InterviewContext = React.createContext<InterviewContextValue | null>(null);

// =============================================================================
// HOOK
// =============================================================================

export function useInterview(): InterviewContextValue {
  const context = React.useContext(InterviewContext);
  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }
  return context;
}

// =============================================================================
// PROVIDER
// =============================================================================

export function InterviewProvider({ children, storyId }: InterviewProviderProps) {
  const router = useRouter();
  const supabase = createClient();

  // State
  const [story, setStory] = React.useState<Story | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [lastSavedAt, setLastSavedAt] = React.useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  // Auto-save timer ref
  const saveTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // ==========================================================================
  // LOAD STORY
  // ==========================================================================

  const loadStory = React.useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from("stories")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        if (!data) {
          throw new Error("Story not found");
        }

        // Transform snake_case to camelCase
        const transformedStory: Story = {
          id: data.id,
          organizationId: data.organization_id,
          userId: data.user_id,
          status: data.status,
          currentModule: data.current_module,
          completedModules: data.completed_modules || [],
          founderRole: data.founder_role,
          publicNaming: data.public_naming,
          basicInfo: data.basic_info,
          functionalMapping: data.functional_mapping,
          financialPicture: data.financial_picture,
          dynamicPicture: data.dynamic_picture,
          environment: data.environment,
          founderContext: data.founder_context,
          // Use createEmptyNarrative as fallback to ensure questions are always populated
          narrative:
            data.narrative?.sections?.understanding?.length > 0
              ? data.narrative
              : createEmptyNarrative(),
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          coinedAt: data.coined_at,
          // AI summary fields
          aiSummary: data.ai_summary,
          aiSummaryStatus: data.ai_summary_status || "idle",
          aiSummaryUpdatedAt: data.ai_summary_updated_at,
        };

        setStory(transformedStory);
        setLastSavedAt(new Date(data.updated_at));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load story");
      } finally {
        setIsLoading(false);
      }
    },
    [supabase]
  );

  // Load story on mount
  React.useEffect(() => {
    loadStory(storyId);
  }, [storyId, loadStory]);

  // ==========================================================================
  // CREATE STORY
  // ==========================================================================

  const createStory = React.useCallback(async (): Promise<string | null> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Must be logged in to create a story");
      }

      // First, create an organization
      const newOrg = createEmptyOrganization(user.id, "");

      const { data: orgData, error: orgError } = await supabase
        .from("organizations")
        .insert({
          name: newOrg.name || "Untitled Organization",
          organization_type: newOrg.organizationType,
          business_model: newOrg.businessModel,
          industry: newOrg.industry,
          description: newOrg.description,
          location_country: newOrg.location.country,
          location_city: newOrg.location.city,
          founded_date: newOrg.foundedDate,
          closed_date: newOrg.closedDate,
          stage_at_closure: newOrg.stageAtClosure,
          peak_team_size: newOrg.peakTeamSize,
          verification_status: newOrg.verificationStatus,
          verification_count: newOrg.verificationCount,
          is_public: newOrg.isPublic,
          created_by: user.id,
        })
        .select("id")
        .single();

      if (orgError) {
        throw new Error(orgError.message);
      }

      const organizationId = orgData.id;

      // Then, create the story linked to the organization
      const newStory = createEmptyStory(user.id, organizationId);

      const { data, error: insertError } = await supabase
        .from("stories")
        .insert({
          organization_id: organizationId,
          user_id: user.id,
          status: newStory.status,
          current_module: newStory.currentModule,
          completed_modules: newStory.completedModules,
          founder_role: newStory.founderRole,
          public_naming: newStory.publicNaming,
          basic_info: newStory.basicInfo,
          functional_mapping: newStory.functionalMapping,
          financial_picture: newStory.financialPicture,
          dynamic_picture: newStory.dynamicPicture,
          environment: newStory.environment,
          founder_context: newStory.founderContext,
          narrative: newStory.narrative,
        })
        .select("id")
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      // Track wizard started event
      if (data?.id) {
        trackWizardEvent("wizard_started", {
          storyId: data.id,
          progress: 0,
        });
      }

      return data?.id || null;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create story");
      return null;
    }
  }, [supabase]);

  // ==========================================================================
  // SAVE STORY
  // ==========================================================================

  const saveStory = React.useCallback(async () => {
    if (!story) return;

    setIsSaving(true);

    // Map founder_role to author_role for verification
    const authorRoleMap: Record<string, string> = {
      founder: "founder",
      cofounder: "co_founder",
      ceo_non_founder: "executive",
      other: "other",
    };
    const authorRole = story.founderRole ? authorRoleMap[story.founderRole] || null : null;

    try {
      const { error: updateError } = await supabase
        .from("stories")
        .update({
          status: story.status,
          current_module: story.currentModule,
          completed_modules: story.completedModules,
          founder_role: story.founderRole,
          author_role: authorRole,
          public_naming: story.publicNaming,
          basic_info: story.basicInfo,
          functional_mapping: story.functionalMapping,
          financial_picture: story.financialPicture,
          dynamic_picture: story.dynamicPicture,
          environment: story.environment,
          founder_context: story.founderContext,
          narrative: story.narrative,
        })
        .eq("id", story.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Update USD revenue if story is already coined
      // Read fresh data from DB to avoid stale closure issues
      if (story.status === "coined") {
        try {
          // Fetch the just-saved financial data from DB
          const { data: freshStory } = await supabase
            .from("stories")
            .select("financial_picture, organization_id")
            .eq("id", story.id)
            .single();

          if (freshStory?.financial_picture) {
            const fp = freshStory.financial_picture as {
              currency?: string;
              essentialMetrics?: { revenue?: { peakAnnual?: string } };
            };
            const peakAnnual = fp.essentialMetrics?.revenue?.peakAnnual;
            const currency = fp.currency;

            if (peakAnnual && currency) {
              const revenueNumber = parseFloat(peakAnnual);
              if (!isNaN(revenueNumber) && revenueNumber > 0) {
                let revenueUSD = revenueNumber;
                let exchangeRate = 1;
                let rateDate = new Date().toISOString();

                // Fetch exchange rate if not USD
                if (currency !== "USD") {
                  const res = await fetch(`/api/exchange/rate?from=${currency}&to=USD`);
                  if (res.ok) {
                    const data = await res.json();
                    exchangeRate = data.rate;
                    rateDate = data.date;
                    revenueUSD = revenueNumber * exchangeRate;
                  }
                }

                // Update organization with USD revenue
                await supabase
                  .from("organizations")
                  .update({
                    peak_revenue_usd: revenueUSD,
                    peak_revenue_exchange_rate: exchangeRate,
                    peak_revenue_rate_date: rateDate,
                  })
                  .eq("id", freshStory.organization_id);
              }
            }
          }
        } catch (e) {
          console.error("Failed to update USD revenue:", e);
        }
      }

      setLastSavedAt(new Date());
      setHasUnsavedChanges(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save story");
    } finally {
      setIsSaving(false);
    }
  }, [story, supabase]);

  // ==========================================================================
  // AUTO-SAVE (debounced)
  // ==========================================================================

  const scheduleAutoSave = React.useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveStory();
    }, 2000); // 2 second debounce
  }, [saveStory]);

  // Cleanup auto-save timer on unmount
  React.useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // ==========================================================================
  // UPDATE FUNCTIONS
  // ==========================================================================

  const updateStory = React.useCallback(
    (updates: Partial<Story>) => {
      setStory((prev) => {
        if (!prev) return prev;
        return { ...prev, ...updates };
      });
      setHasUnsavedChanges(true);
      scheduleAutoSave();
    },
    [scheduleAutoSave]
  );

  const updateBasicInfo = React.useCallback(
    (data: Partial<BasicInfoData>) => {
      setStory((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          basicInfo: { ...prev.basicInfo, ...data },
        };
      });
      setHasUnsavedChanges(true);
      scheduleAutoSave();
    },
    [scheduleAutoSave]
  );

  const updateFunctionalMapping = React.useCallback(
    (data: Partial<FunctionalMappingData>) => {
      setStory((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          functionalMapping: { ...prev.functionalMapping, ...data },
        };
      });
      setHasUnsavedChanges(true);
      scheduleAutoSave();
    },
    [scheduleAutoSave]
  );

  const updateFinancialPicture = React.useCallback(
    (data: Partial<FinancialPictureData>) => {
      setStory((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          financialPicture: { ...prev.financialPicture, ...data },
        };
      });
      setHasUnsavedChanges(true);
      scheduleAutoSave();
    },
    [scheduleAutoSave]
  );

  const updateDynamicPicture = React.useCallback(
    (data: Partial<DynamicPictureData>) => {
      setStory((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          dynamicPicture: { ...prev.dynamicPicture, ...data },
        };
      });
      setHasUnsavedChanges(true);
      scheduleAutoSave();
    },
    [scheduleAutoSave]
  );

  const updateEnvironment = React.useCallback(
    (data: Partial<EnvironmentData>) => {
      setStory((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          environment: { ...prev.environment, ...data },
        };
      });
      setHasUnsavedChanges(true);
      scheduleAutoSave();
    },
    [scheduleAutoSave]
  );

  const updateFounderContext = React.useCallback(
    (data: Partial<FounderContextData>) => {
      setStory((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          founderContext: { ...prev.founderContext, ...data },
        };
      });
      setHasUnsavedChanges(true);
      scheduleAutoSave();
    },
    [scheduleAutoSave]
  );

  const updateNarrative = React.useCallback(
    (data: Partial<NarrativeData>) => {
      setStory((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          narrative: { ...prev.narrative, ...data },
        };
      });
      setHasUnsavedChanges(true);
      scheduleAutoSave();
    },
    [scheduleAutoSave]
  );

  // ==========================================================================
  // MODULE COMPLETION
  // ==========================================================================

  const isModuleComplete = React.useCallback(
    (moduleId: ModuleId): boolean => {
      if (!story) return false;
      return story.completedModules.includes(moduleId);
    },
    [story]
  );

  const canNavigateToModule = React.useCallback(
    (moduleId: ModuleId): boolean => {
      if (!story) return false;

      // basic_info is now handled by the Organization Wizard, not the interview
      // Redirect to functional if someone tries to navigate to basic_info
      if (moduleId === "basic_info") return false;

      // For stories created with the old flow (without org wizard),
      // require basic_info to be complete before accessing other modules
      // For new stories created via org wizard, basic_info is auto-completed
      if (!story.completedModules.includes("basic_info")) {
        // Legacy story without basic_info complete - can only go to functional
        // which will prompt them to complete org info
        return moduleId === "functional";
      }

      // Can navigate to any module once basic_info is complete
      // (non-linear navigation allowed)
      return true;
    },
    [story]
  );

  const completeModule = React.useCallback(
    async (moduleId: ModuleId) => {
      if (!story) return;

      // Check if this is a NEW completion (not re-completing an already completed module)
      const isNewCompletion = !story.completedModules.includes(moduleId);

      const newCompletedModules = isNewCompletion
        ? [...story.completedModules, moduleId]
        : story.completedModules;

      // Determine new status
      let newStatus: StoryStatus = story.status;
      if (moduleId === "basic_info" && story.status === "draft") {
        newStatus = "in_progress";
      }

      // Check if all modules are now complete - auto-set to coined
      const allModulesComplete = MODULES.every((m) => newCompletedModules.includes(m.id));
      if (allModulesComplete) {
        newStatus = "coined";
      }

      // Determine next module
      const nextModule = getNextModule(moduleId);
      const newCurrentModule = nextModule?.id || story.currentModule;

      // Update local state
      setStory((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          completedModules: newCompletedModules,
          status: newStatus,
          currentModule: newCurrentModule,
        };
      });

      // Save directly to DB with explicit values (avoid stale closure)
      setIsSaving(true);
      try {
        const { error: updateError } = await supabase
          .from("stories")
          .update({
            status: newStatus,
            current_module: newCurrentModule,
            completed_modules: newCompletedModules,
          })
          .eq("id", story.id);

        if (updateError) {
          throw new Error(updateError.message);
        }

        setLastSavedAt(new Date());
        setHasUnsavedChanges(false);

        // Track chapter completion event
        if (isNewCompletion) {
          const moduleInfo = MODULES.find((m) => m.id === moduleId);
          const organizationType = story.basicInfo?.organizationType ?? undefined;
          trackWizardEvent("chapter_completed", {
            storyId: story.id,
            chapterId: moduleId,
            chapterName: moduleInfo?.name,
            organizationType,
            progress: calculateProgress(newCompletedModules),
          });

          // Track wizard completion if all modules are done
          if (allModulesComplete) {
            trackWizardEvent("wizard_completed", {
              storyId: story.id,
              organizationType,
              progress: 100,
            });
          }
        }

        // Only trigger AI summary generation for NEW completions
        // Skip if user is just re-completing an already completed module without changes
        if (isNewCompletion) {
          // Trigger AI summary generation in background (fire-and-forget)
          // Don't block the user experience - summary will update asynchronously
          setStory((prev) => (prev ? { ...prev, aiSummaryStatus: "generating" } : prev));
          fetch(`/api/story/${story.id}/summary`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lastCompletedModule: moduleId }),
          })
            .then((response) => {
              if (response.ok) {
                return response.json();
              }
              throw new Error("Failed to generate summary");
            })
            .then((data) => {
              setStory((prev) =>
                prev
                  ? {
                      ...prev,
                      aiSummary: data.summary,
                      aiSummaryStatus: "ready",
                      aiSummaryUpdatedAt: new Date().toISOString(),
                    }
                  : prev
              );
            })
            .catch((error) => {
              console.error("Failed to generate summary:", error);
              setStory((prev) => (prev ? { ...prev, aiSummaryStatus: "failed" } : prev));
            });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to complete module");
      } finally {
        setIsSaving(false);
      }
    },
    [story, supabase]
  );

  // Manual refresh of AI summary
  const refreshSummary = React.useCallback(async () => {
    if (!story) return;

    const lastModule = story.completedModules[story.completedModules.length - 1];
    if (!lastModule) return;

    try {
      // Update local state to show generating
      setStory((prev) => {
        if (!prev) return prev;
        return { ...prev, aiSummaryStatus: "generating" };
      });

      const response = await fetch(`/api/story/${story.id}/summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lastCompletedModule: lastModule }),
      });

      if (response.ok) {
        const data = await response.json();
        setStory((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            aiSummary: data.summary,
            aiSummaryStatus: "ready",
            aiSummaryUpdatedAt: new Date().toISOString(),
          };
        });
      } else {
        setStory((prev) => {
          if (!prev) return prev;
          return { ...prev, aiSummaryStatus: "failed" };
        });
      }
    } catch (error) {
      console.error("Failed to generate summary:", error);
      setStory((prev) => {
        if (!prev) return prev;
        return { ...prev, aiSummaryStatus: "failed" };
      });
    }
  }, [story]);

  const navigateToModule = React.useCallback(
    (moduleId: ModuleId) => {
      if (!story || !canNavigateToModule(moduleId)) return;

      const organizationType = story.basicInfo?.organizationType ?? null;
      const moduleInfo = MODULES.find((m) => m.id === moduleId);

      // Track chapter_paused for the module we're leaving (if any)
      if (story.currentModule && story.currentModule !== moduleId) {
        const currentModuleInfo = MODULES.find((m) => m.id === story.currentModule);
        trackWizardEvent("chapter_paused", {
          storyId: story.id,
          chapterId: story.currentModule,
          chapterName: currentModuleInfo?.name,
          organizationType: organizationType ?? undefined,
        });
      }

      // Track chapter_started or chapter_resumed for the module we're entering
      const isFirstVisit = !story.completedModules.includes(moduleId);
      trackWizardEvent(isFirstVisit ? "chapter_started" : "chapter_resumed", {
        storyId: story.id,
        chapterId: moduleId,
        chapterName: moduleInfo?.name,
        organizationType: organizationType ?? undefined,
      });

      updateStory({ currentModule: moduleId });
      router.push(`/interview/${story.id}/${moduleId.replace("_", "-")}`);
    },
    [story, canNavigateToModule, updateStory, router]
  );

  // ==========================================================================
  // COIN STORY
  // ==========================================================================

  const coinStory = React.useCallback(async () => {
    if (!story) return;

    // Check all modules are complete
    const allModulesComplete = MODULES.every((m) => story.completedModules.includes(m.id));

    if (!allModulesComplete) {
      setError("All modules must be complete to coin the story");
      return;
    }

    // Convert peak revenue to USD and store in organization
    const peakAnnual = story.financialPicture?.essentialMetrics?.revenue?.peakAnnual;
    const currency = story.financialPicture?.currency;

    if (peakAnnual && currency) {
      try {
        const revenueNumber = parseFloat(peakAnnual);
        if (!isNaN(revenueNumber) && revenueNumber > 0) {
          let revenueUSD = revenueNumber;
          let exchangeRate = 1;
          let rateDate = new Date().toISOString();

          // Fetch exchange rate if not USD
          if (currency !== "USD") {
            const res = await fetch(`/api/exchange/rate?from=${currency}&to=USD`);
            if (res.ok) {
              const data = await res.json();
              exchangeRate = data.rate;
              rateDate = data.date;
              revenueUSD = revenueNumber * exchangeRate;
            }
          }

          // Update organization with USD revenue
          await supabase
            .from("organizations")
            .update({
              peak_revenue_usd: revenueUSD,
              peak_revenue_exchange_rate: exchangeRate,
              peak_revenue_rate_date: rateDate,
            })
            .eq("id", story.organizationId);
        }
      } catch (e) {
        console.error("Failed to convert revenue to USD:", e);
        // Continue with coining even if conversion fails
      }
    }

    updateStory({ status: "coined" });
    await saveStory();

    // Add bonus generation attempt for completed story
    try {
      await fetch("/api/cenotaph/add-story-bonus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyId: story.id }),
      });
    } catch (bonusError) {
      // Log but don't fail if bonus addition fails
      console.error("Failed to add story bonus:", bonusError);
    }

    // Navigate to completion page
    router.push(`/interview/${story.id}/complete`);
  }, [story, updateStory, saveStory, router, supabase]);

  // ==========================================================================
  // DERIVED STATE
  // ==========================================================================

  const progress = React.useMemo(() => {
    if (!story) return 0;
    return calculateProgress(story.completedModules);
  }, [story]);

  // ==========================================================================
  // CONTEXT VALUE
  // ==========================================================================

  const value: InterviewContextValue = {
    // Story data
    story,
    isLoading,
    error,

    // Derived state
    progress,
    isModuleComplete,
    canNavigateToModule,

    // Actions
    loadStory,
    createStory,
    updateBasicInfo,
    updateFunctionalMapping,
    updateFinancialPicture,
    updateDynamicPicture,
    updateEnvironment,
    updateFounderContext,
    updateNarrative,
    completeModule,
    navigateToModule,
    saveStory,
    coinStory,
    refreshSummary,

    // Save state
    isSaving,
    lastSavedAt,
    hasUnsavedChanges,
  };

  return <InterviewContext.Provider value={value}>{children}</InterviewContext.Provider>;
}

// =============================================================================
// EXPORTS
// =============================================================================

export { InterviewContext };
export type { InterviewContextValue, InterviewProviderProps };
