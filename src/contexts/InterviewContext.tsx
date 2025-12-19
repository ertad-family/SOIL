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
} from "@/types/interview";
import {
  createEmptyStory,
  createEmptyOrganization,
  MODULES,
  getNextModule,
  calculateProgress,
} from "@/types/interview";

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
          contactEmail: data.contact_email,
          basicInfo: data.basic_info,
          functionalMapping: data.functional_mapping,
          financialPicture: data.financial_picture,
          dynamicPicture: data.dynamic_picture,
          environment: data.environment,
          founderContext: data.founder_context,
          narrative: data.narrative,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          coinedAt: data.coined_at,
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
          contact_email: newStory.contactEmail,
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
          contact_email: story.contactEmail,
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

      // Can always go to basic_info
      if (moduleId === "basic_info") return true;

      // Must have basic_info complete to access other modules
      if (!story.completedModules.includes("basic_info")) return false;

      // Can navigate to any module once basic_info is complete
      // (non-linear navigation allowed after basic info)
      return true;
    },
    [story]
  );

  const completeModule = React.useCallback(
    async (moduleId: ModuleId) => {
      if (!story) return;

      const newCompletedModules = story.completedModules.includes(moduleId)
        ? story.completedModules
        : [...story.completedModules, moduleId];

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
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to complete module");
      } finally {
        setIsSaving(false);
      }
    },
    [story, supabase]
  );

  const navigateToModule = React.useCallback(
    (moduleId: ModuleId) => {
      if (!story || !canNavigateToModule(moduleId)) return;

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

    updateStory({ status: "coined" });
    await saveStory();

    // Navigate to completion page
    router.push(`/interview/${story.id}/complete`);
  }, [story, updateStory, saveStory, router]);

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
