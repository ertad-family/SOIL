"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useInterview } from "@/contexts/InterviewContext";
import { WizardLayout } from "@/components/layouts/wizard-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/forms/form-field";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  MinusCircle,
} from "lucide-react";
import type {
  FunctionDetail,
  FunctionHealthCheck,
  ExecutionModel,
  OwnerType,
  ProviderType,
  FormalizationLevel,
  LifecycleStage,
  SatisfactionRating,
  TurnoverLevel,
  StaffingLevel,
  BudgetPressure,
  QualityIssues,
  LeadershipStatus,
} from "@/types/interview";
import {
  getCategoriesForOrgType,
  getVisibleFunctionsForCategory,
  ORG_TYPE_LABELS,
  LIFECYCLE_STAGE_LABELS,
} from "@/data/function-matrix";

// =============================================================================
// WIZARD STEPS (single step for this redesigned module)
// =============================================================================

const STEPS = [
  { id: "mapping", label: "Map Functions", description: "Select and describe each function" },
];

// =============================================================================
// CONSTANTS
// =============================================================================

const EXECUTION_MODELS: Array<{ value: ExecutionModel; label: string }> = [
  { value: "in_house", label: "In-house" },
  { value: "outsourced", label: "Outsourced" },
  { value: "hybrid", label: "Hybrid" },
  { value: "none", label: "Did not exist" },
];

const OWNER_TYPES: Array<{ value: OwnerType; label: string }> = [
  { value: "dedicated", label: "Dedicated owner" },
  { value: "shared", label: "Shared responsibility" },
  { value: "founder", label: "Founder handled it" },
  { value: "nobody", label: "No clear owner" },
];

const PROVIDER_TYPES: Array<{ value: ProviderType; label: string }> = [
  { value: "agency", label: "Agency" },
  { value: "freelancer", label: "Freelancer" },
  { value: "firm", label: "Professional firm" },
  { value: "other", label: "Other" },
];

const FORMALIZATION_LEVELS: Array<{ value: FormalizationLevel; label: string }> = [
  { value: "none", label: "No documentation" },
  { value: "informal", label: "Informal processes" },
  { value: "documented", label: "Written processes" },
  { value: "tooled", label: "Tools enforcing processes" },
  { value: "automated", label: "Automated workflows" },
];

const LIFECYCLE_STAGES: Array<{ value: LifecycleStage | "until_end"; label: string }> = [
  { value: "formation", label: LIFECYCLE_STAGE_LABELS.formation },
  { value: "establishment", label: LIFECYCLE_STAGE_LABELS.establishment },
  { value: "growth", label: LIFECYCLE_STAGE_LABELS.growth },
  { value: "maturity", label: LIFECYCLE_STAGE_LABELS.maturity },
  { value: "until_end", label: "Until the end" },
];

const SATISFACTION_RATINGS: Array<{ value: SatisfactionRating; label: string }> = [
  { value: 1, label: "1 - Very dissatisfied" },
  { value: 2, label: "2 - Dissatisfied" },
  { value: 3, label: "3 - Neutral" },
  { value: 4, label: "4 - Satisfied" },
  { value: 5, label: "5 - Very satisfied" },
];

// Health Check Options
const TURNOVER_OPTIONS: Array<{ value: TurnoverLevel; label: string }> = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
];

const STAFFING_OPTIONS: Array<{ value: StaffingLevel; label: string }> = [
  { value: "adequate", label: "Adequate" },
  { value: "understaffed", label: "Understaffed" },
];

const BUDGET_OPTIONS: Array<{ value: BudgetPressure; label: string }> = [
  { value: "none", label: "None" },
  { value: "some", label: "Some" },
  { value: "severe", label: "Severe" },
];

const QUALITY_OPTIONS: Array<{ value: QualityIssues; label: string }> = [
  { value: "none", label: "None" },
  { value: "some", label: "Some" },
  { value: "serious", label: "Serious" },
];

const LEADERSHIP_OPTIONS: Array<{ value: LeadershipStatus; label: string }> = [
  { value: "stable", label: "Stable" },
  { value: "gaps", label: "Gaps" },
  { value: "vacuum", label: "Vacuum" },
];

// =============================================================================
// HELPER: Create empty function detail
// =============================================================================

function createEmptyFunctionDetail(functionId: string, categoryId: string): FunctionDetail {
  return {
    functionId,
    categoryId,
    isActive: false,
    isCustom: false,
    executionModel: null,
    headcount: null,
    ftePercentages: [],
    ownerType: null,
    providerType: null,
    formalization: null,
    startedAt: null,
    stoppedAt: null,
    satisfaction: null,
    issueDescription: null,
    comments: null,
    healthCheck: {
      turnover: null,
      staffing: null,
      budgetPressure: null,
      qualityIssues: null,
      leadership: null,
      crossFunctionConflict: null,
      otherIssues: null,
    },
  };
}

// Check if a function has minimum required fields filled
function isFunctionComplete(func: FunctionDetail): boolean {
  return func.isActive && func.executionModel !== null;
}

// =============================================================================
// OPTION BUTTON COMPONENT (Dark theme)
// =============================================================================

interface OptionButtonProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

function OptionButton({ selected, onClick, children, className }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-2 rounded-md border text-sm transition-colors",
        selected
          ? "bg-gold-500/20 border-gold-500 text-gold-300"
          : "border-slate-600 text-slate-300 hover:border-slate-500 hover:text-slate-200",
        className
      )}
    >
      {children}
    </button>
  );
}

// =============================================================================
// PILL BUTTON COMPONENT (for health check)
// =============================================================================

interface PillButtonProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function PillButton({ selected, onClick, children }: PillButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1 rounded-full text-xs transition-colors",
        selected ? "bg-gold-500 text-slate-900" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
      )}
    >
      {children}
    </button>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function FunctionalPage() {
  const router = useRouter();
  const { story, isLoading, updateFunctionalMapping, completeModule } = useInterview();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(new Set());
  const [expandedFunctions, setExpandedFunctions] = React.useState<Set<string>>(new Set());

  // Get org type and stage from basic info
  const orgType = story?.basicInfo.organizationType;
  const stage = story?.basicInfo.stageAtClosure || "growth";

  // Get categories for this org type
  const categories = React.useMemo(() => {
    if (!orgType) return [];
    return getCategoriesForOrgType(orgType);
  }, [orgType]);

  // Get functions from story (memoized to avoid dependency issues)
  const functions = React.useMemo(() => {
    return story?.functionalMapping.functions ?? [];
  }, [story?.functionalMapping.functions]);

  // Get excluded categories from story
  const excludedCategories = React.useMemo(() => {
    return new Set(story?.functionalMapping.excludedCategories ?? []);
  }, [story?.functionalMapping.excludedCategories]);

  // Get active functions count
  const activeFunctionsCount = React.useMemo(() => {
    return functions.filter((f) => f.isActive).length;
  }, [functions]);

  // Get completed functions count
  const completedFunctionsCount = React.useMemo(() => {
    return functions.filter((f) => isFunctionComplete(f)).length;
  }, [functions]);

  // Calculate progress: categories handled / total categories
  // A category is "handled" if it's excluded OR has at least one function with details
  const progressPercent = React.useMemo(() => {
    if (categories.length === 0) return 0;

    const handledCategories = categories.filter((cat) => {
      // Category is excluded - it's handled
      if (excludedCategories.has(cat.id)) return true;

      // Category has at least one function selected and completed
      const categoryFunctions = functions.filter((f) => f.categoryId === cat.id && f.isActive);
      if (categoryFunctions.length === 0) return false;

      // All selected functions in this category are complete
      return categoryFunctions.every((f) => isFunctionComplete(f));
    });

    return Math.round((handledCategories.length / categories.length) * 100);
  }, [categories, excludedCategories, functions]);

  // ==========================================================================
  // FUNCTION HANDLERS
  // ==========================================================================

  // Toggle function active state and expand it
  const toggleFunction = (functionId: string, categoryId: string) => {
    if (!story) return;

    const existingIndex = functions.findIndex((f) => f.functionId === functionId);
    const isCurrentlyActive = existingIndex >= 0 && functions[existingIndex].isActive;

    if (existingIndex >= 0) {
      // Toggle existing
      const updated = [...functions];
      updated[existingIndex] = {
        ...updated[existingIndex],
        isActive: !isCurrentlyActive,
      };
      updateFunctionalMapping({ functions: updated });

      // If activating, expand the function
      if (!isCurrentlyActive) {
        setExpandedFunctions((prev) => new Set([...prev, functionId]));
      } else {
        // If deactivating, collapse it
        setExpandedFunctions((prev) => {
          const next = new Set(prev);
          next.delete(functionId);
          return next;
        });
      }
    } else {
      // Add new and activate
      const newFunction = createEmptyFunctionDetail(functionId, categoryId);
      newFunction.isActive = true;
      updateFunctionalMapping({ functions: [...functions, newFunction] });
      // Expand the new function
      setExpandedFunctions((prev) => new Set([...prev, functionId]));
    }
  };

  // Update function detail
  const updateFunctionDetail = (functionId: string, updates: Partial<FunctionDetail>) => {
    if (!story) return;

    const existingIndex = functions.findIndex((f) => f.functionId === functionId);
    if (existingIndex < 0) return;

    const updated = [...functions];
    updated[existingIndex] = { ...updated[existingIndex], ...updates };
    updateFunctionalMapping({ functions: updated });
  };

  // Update health check
  const updateHealthCheck = (functionId: string, updates: Partial<FunctionHealthCheck>) => {
    if (!story) return;

    const existingIndex = functions.findIndex((f) => f.functionId === functionId);
    if (existingIndex < 0) return;

    const updated = [...functions];
    updated[existingIndex] = {
      ...updated[existingIndex],
      healthCheck: { ...updated[existingIndex].healthCheck, ...updates },
    };
    updateFunctionalMapping({ functions: updated });
  };

  // Check if function is active
  const isFunctionActive = (functionId: string): boolean => {
    return functions.some((f) => f.functionId === functionId && f.isActive);
  };

  // Get function detail
  const getFunctionDetail = (functionId: string): FunctionDetail | undefined => {
    return functions.find((f) => f.functionId === functionId);
  };

  // Toggle category expanded state
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  // Toggle function expanded state (for editing details)
  const toggleFunctionExpand = (functionId: string) => {
    setExpandedFunctions((prev) => {
      const next = new Set(prev);
      if (next.has(functionId)) {
        next.delete(functionId);
      } else {
        next.add(functionId);
      }
      return next;
    });
  };

  // Toggle category excluded state ("None of these existed")
  const toggleCategoryExcluded = (categoryId: string) => {
    if (!story) return;

    const currentExcluded = story.functionalMapping.excludedCategories ?? [];
    const isCurrentlyExcluded = currentExcluded.includes(categoryId);

    let newExcluded: string[];
    if (isCurrentlyExcluded) {
      // Remove from excluded
      newExcluded = currentExcluded.filter((id) => id !== categoryId);
    } else {
      // Add to excluded and remove any functions from this category
      newExcluded = [...currentExcluded, categoryId];

      // Deactivate all functions in this category
      const updatedFunctions = functions.map((f) =>
        f.categoryId === categoryId ? { ...f, isActive: false } : f
      );
      updateFunctionalMapping({
        excludedCategories: newExcluded,
        functions: updatedFunctions,
      });
      return;
    }

    updateFunctionalMapping({ excludedCategories: newExcluded });
  };

  // Check if category is excluded
  const isCategoryExcluded = (categoryId: string): boolean => {
    return excludedCategories.has(categoryId);
  };

  // Handle "Done" button - collapse current and expand next incomplete function
  const handleFunctionDone = (currentFunctionId: string) => {
    // Collapse current
    setExpandedFunctions((prev) => {
      const next = new Set(prev);
      next.delete(currentFunctionId);
      return next;
    });

    // Find next incomplete function across all categories
    for (const category of categories) {
      if (excludedCategories.has(category.id)) continue;

      const visibleFuncs = getVisibleFunctionsForCategory(orgType!, category.id, stage);
      for (const func of visibleFuncs) {
        const detail = functions.find((f) => f.functionId === func.id);
        // Skip current function
        if (func.id === currentFunctionId) continue;
        // Find active but incomplete function
        if (detail?.isActive && !isFunctionComplete(detail)) {
          // Expand category if not already
          setExpandedCategories((prev) => new Set([...prev, category.id]));
          // Expand function
          setExpandedFunctions((prev) => new Set([...prev, func.id]));
          // Scroll to element with offset for sticky header (~200px)
          setTimeout(() => {
            const element = document.getElementById(`func-${func.id}`);
            if (element) {
              const headerOffset = 200;
              const elementPosition = element.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.scrollY - headerOffset;
              window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
          }, 100);
          return;
        }
      }
    }
  };

  // ==========================================================================
  // NAVIGATION HANDLERS
  // ==========================================================================

  const handleBack = () => {
    router.push(`/interview/${story?.id}`);
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await completeModule("functional");
      router.push(`/interview/${story?.id}`);
    } catch (err) {
      console.error("Failed to complete module:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================================================
  // LOADING STATE
  // ==========================================================================

  if (isLoading || !story) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Check if org type is set
  if (!orgType) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Card variant="dark" className="p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-gold-500 mb-4" />
            <h1 className="font-serif text-2xl font-semibold text-marble-100 mb-2">
              Organization Type Required
            </h1>
            <p className="text-slate-400 mb-6">
              Please complete Basic Info first to set your organization type.
            </p>
            <Button
              variant="dark-primary"
              onClick={() => router.push(`/interview/${story.id}/basic-info`)}
            >
              Go to Basic Info
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // RENDER FUNCTION DETAIL FORM (inline within expanded function)
  // ==========================================================================

  const renderFunctionDetailForm = (func: FunctionDetail, funcName: string) => {
    const functionExisted = func.executionModel !== "none";

    return (
      <div className="p-4 space-y-6 border-t border-slate-700 bg-slate-800/50">
        {/* Execution Model */}
        <FormField variant="dark" label="How was this function handled?">
          <div className="grid grid-cols-2 gap-2">
            {EXECUTION_MODELS.map((option) => (
              <OptionButton
                key={option.value}
                selected={func.executionModel === option.value}
                onClick={() =>
                  updateFunctionDetail(func.functionId, { executionModel: option.value })
                }
              >
                {option.label}
              </OptionButton>
            ))}
          </div>
        </FormField>

        {/* Only show details and health check if function existed */}
        {functionExisted && (
          <>
            {/* In-house specifics */}
            {(func.executionModel === "in_house" || func.executionModel === "hybrid") && (
              <>
                <FormField variant="dark" label="Headcount (people involved)">
                  <Input
                    variant="dark"
                    type="number"
                    min={0}
                    value={func.headcount || ""}
                    onChange={(e) =>
                      updateFunctionDetail(func.functionId, {
                        headcount: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                    placeholder="e.g., 3"
                  />
                </FormField>

                <FormField variant="dark" label="Who owned this function?">
                  <div className="grid grid-cols-2 gap-2">
                    {OWNER_TYPES.map((option) => (
                      <OptionButton
                        key={option.value}
                        selected={func.ownerType === option.value}
                        onClick={() =>
                          updateFunctionDetail(func.functionId, { ownerType: option.value })
                        }
                      >
                        {option.label}
                      </OptionButton>
                    ))}
                  </div>
                </FormField>
              </>
            )}

            {/* Outsourced specifics */}
            {(func.executionModel === "outsourced" || func.executionModel === "hybrid") && (
              <FormField variant="dark" label="Provider type">
                <div className="grid grid-cols-2 gap-2">
                  {PROVIDER_TYPES.map((option) => (
                    <OptionButton
                      key={option.value}
                      selected={func.providerType === option.value}
                      onClick={() =>
                        updateFunctionDetail(func.functionId, { providerType: option.value })
                      }
                    >
                      {option.label}
                    </OptionButton>
                  ))}
                </div>
              </FormField>
            )}

            {/* Formalization */}
            <FormField variant="dark" label="How formalized was this function?">
              <div className="space-y-2">
                {FORMALIZATION_LEVELS.map((option) => (
                  <OptionButton
                    key={option.value}
                    selected={func.formalization === option.value}
                    onClick={() =>
                      updateFunctionDetail(func.functionId, { formalization: option.value })
                    }
                    className="w-full text-left"
                  >
                    {option.label}
                  </OptionButton>
                ))}
              </div>
            </FormField>

            {/* Timeline */}
            <div className="grid grid-cols-2 gap-4">
              <FormField variant="dark" label="When did this start?">
                <select
                  value={func.startedAt || ""}
                  onChange={(e) =>
                    updateFunctionDetail(func.functionId, {
                      startedAt: (e.target.value as LifecycleStage) || null,
                    })
                  }
                  className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-marble-100"
                >
                  <option value="">Select...</option>
                  {LIFECYCLE_STAGES.filter((s) => s.value !== "until_end").map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField variant="dark" label="When did it stop?">
                <select
                  value={func.stoppedAt || ""}
                  onChange={(e) =>
                    updateFunctionDetail(func.functionId, {
                      stoppedAt: (e.target.value as LifecycleStage | "until_end") || null,
                    })
                  }
                  className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-marble-100"
                >
                  <option value="">Select...</option>
                  {LIFECYCLE_STAGES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            {/* Satisfaction */}
            <FormField variant="dark" label="How satisfied were you with this function?">
              <select
                value={func.satisfaction || ""}
                onChange={(e) =>
                  updateFunctionDetail(func.functionId, {
                    satisfaction: e.target.value
                      ? (parseInt(e.target.value) as SatisfactionRating)
                      : null,
                  })
                }
                className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-marble-100"
              >
                <option value="">Select...</option>
                {SATISFACTION_RATINGS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>

            {/* Issue description if low satisfaction */}
            {func.satisfaction !== null && func.satisfaction <= 3 && (
              <FormField variant="dark" label="What was the issue?">
                <Textarea
                  variant="dark"
                  value={func.issueDescription || ""}
                  onChange={(e) =>
                    updateFunctionDetail(func.functionId, { issueDescription: e.target.value })
                  }
                  placeholder="Describe what wasn't working..."
                  rows={3}
                />
              </FormField>
            )}

            {/* Health Check Section */}
            <div className="pt-4 border-t border-slate-700">
              <h4 className="text-sm font-medium text-marble-100 mb-4">Health Assessment</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Turnover */}
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Turnover</label>
                  <div className="flex flex-wrap gap-1">
                    {TURNOVER_OPTIONS.map((option) => (
                      <PillButton
                        key={option.value}
                        selected={func.healthCheck.turnover === option.value}
                        onClick={() =>
                          updateHealthCheck(func.functionId, { turnover: option.value })
                        }
                      >
                        {option.label}
                      </PillButton>
                    ))}
                  </div>
                </div>

                {/* Staffing */}
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Staffing</label>
                  <div className="flex flex-wrap gap-1">
                    {STAFFING_OPTIONS.map((option) => (
                      <PillButton
                        key={option.value}
                        selected={func.healthCheck.staffing === option.value}
                        onClick={() =>
                          updateHealthCheck(func.functionId, { staffing: option.value })
                        }
                      >
                        {option.label}
                      </PillButton>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Budget Pressure</label>
                  <div className="flex flex-wrap gap-1">
                    {BUDGET_OPTIONS.map((option) => (
                      <PillButton
                        key={option.value}
                        selected={func.healthCheck.budgetPressure === option.value}
                        onClick={() =>
                          updateHealthCheck(func.functionId, { budgetPressure: option.value })
                        }
                      >
                        {option.label}
                      </PillButton>
                    ))}
                  </div>
                </div>

                {/* Quality */}
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Quality Issues</label>
                  <div className="flex flex-wrap gap-1">
                    {QUALITY_OPTIONS.map((option) => (
                      <PillButton
                        key={option.value}
                        selected={func.healthCheck.qualityIssues === option.value}
                        onClick={() =>
                          updateHealthCheck(func.functionId, { qualityIssues: option.value })
                        }
                      >
                        {option.label}
                      </PillButton>
                    ))}
                  </div>
                </div>

                {/* Leadership */}
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Leadership</label>
                  <div className="flex flex-wrap gap-1">
                    {LEADERSHIP_OPTIONS.map((option) => (
                      <PillButton
                        key={option.value}
                        selected={func.healthCheck.leadership === option.value}
                        onClick={() =>
                          updateHealthCheck(func.functionId, { leadership: option.value })
                        }
                      >
                        {option.label}
                      </PillButton>
                    ))}
                  </div>
                </div>

                {/* Cross-function Conflict */}
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">
                    Cross-function Conflict
                  </label>
                  <div className="flex gap-1">
                    <PillButton
                      selected={func.healthCheck.crossFunctionConflict === false}
                      onClick={() =>
                        updateHealthCheck(func.functionId, { crossFunctionConflict: false })
                      }
                    >
                      No
                    </PillButton>
                    <PillButton
                      selected={func.healthCheck.crossFunctionConflict === true}
                      onClick={() =>
                        updateHealthCheck(func.functionId, { crossFunctionConflict: true })
                      }
                    >
                      Yes
                    </PillButton>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional comments */}
            <FormField variant="dark" label="Additional notes" hint="Optional">
              <Textarea
                variant="dark"
                value={func.comments || ""}
                onChange={(e) =>
                  updateFunctionDetail(func.functionId, { comments: e.target.value })
                }
                placeholder="Any other observations about this function..."
                rows={2}
              />
            </FormField>

            {/* Save/Collapse button */}
            <div className="pt-4 flex justify-end">
              <Button
                variant="dark-secondary"
                size="sm"
                onClick={() => handleFunctionDone(func.functionId)}
              >
                <Check className="h-4 w-4 mr-2" />
                Done
              </Button>
            </div>
          </>
        )}
      </div>
    );
  };

  // ==========================================================================
  // RENDER MAIN CONTENT
  // ==========================================================================

  const renderContent = () => (
    <div className="space-y-4">
      {/* Instructions */}
      <p className="text-slate-300 mb-6">
        Select functions that existed in your organization. Click on each to provide details.
        We&apos;ve organized functions typical for{" "}
        <span className="font-medium text-gold-400">{ORG_TYPE_LABELS[orgType]}</span> organizations.
      </p>

      {/* Progress summary */}
      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg mb-4">
        <span className="text-sm text-slate-400">
          <span className="font-medium text-marble-100">{activeFunctionsCount}</span> functions
          selected
        </span>
        <span className="text-sm text-slate-400">
          <span className="font-medium text-marble-100">{completedFunctionsCount}</span> with
          details
        </span>
      </div>

      {/* Categories */}
      {categories.map((category) => {
        const visibleFunctions = getVisibleFunctionsForCategory(orgType, category.id, stage);
        const selectedCount = visibleFunctions.filter((f) => isFunctionActive(f.id)).length;
        const completedCount = visibleFunctions.filter((f) => {
          const detail = getFunctionDetail(f.id);
          return detail && isFunctionComplete(detail);
        }).length;
        const isExpanded = expandedCategories.has(category.id);
        const isExcluded = isCategoryExcluded(category.id);

        return (
          <div
            key={category.id}
            className={cn(
              "border rounded-lg overflow-hidden",
              isExcluded ? "border-slate-600 opacity-60" : "border-slate-700"
            )}
          >
            {/* Category header */}
            <div className="flex items-center bg-slate-800/50">
              <button
                onClick={() => toggleCategory(category.id)}
                className="flex-1 flex items-center gap-3 p-4 hover:bg-slate-800 transition-colors"
              >
                {isExpanded && !isExcluded ? (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                )}
                <span
                  className={cn(
                    "font-medium",
                    isExcluded ? "text-slate-400 line-through" : "text-marble-100"
                  )}
                >
                  {category.name}
                </span>
                {isExcluded && <MinusCircle className="h-4 w-4 text-slate-500" />}
                {!isExcluded && selectedCount > 0 && completedCount === selectedCount && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                )}
              </button>
              <div className="flex items-center gap-3 pr-4">
                {!isExcluded && (
                  <span className="text-sm text-slate-400">
                    {selectedCount}/{visibleFunctions.length}
                  </span>
                )}
                <button
                  onClick={() => toggleCategoryExcluded(category.id)}
                  className={cn(
                    "text-xs px-2 py-1 rounded transition-colors",
                    isExcluded
                      ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      : "text-slate-500 hover:text-slate-300 hover:bg-slate-700"
                  )}
                >
                  {isExcluded ? "Undo" : "None existed"}
                </button>
              </div>
            </div>

            {/* Functions list - only show if expanded and not excluded */}
            {isExpanded && !isExcluded && (
              <div className="divide-y divide-slate-700">
                {visibleFunctions.map((func) => {
                  const isActive = isFunctionActive(func.id);
                  const funcDetail = getFunctionDetail(func.id);
                  const isComplete = funcDetail && isFunctionComplete(funcDetail);
                  const isExpandedFunc = expandedFunctions.has(func.id);
                  const isDimmed = func.status === "dimmed";

                  return (
                    <div key={func.id} id={`func-${func.id}`}>
                      {/* Function row */}
                      <div
                        className={cn(
                          "w-full flex items-center gap-3 p-3 transition-colors",
                          isActive
                            ? "bg-gold-500/10"
                            : isDimmed
                              ? "opacity-60 hover:opacity-100"
                              : "hover:bg-slate-800/50"
                        )}
                      >
                        {/* Checkbox toggle */}
                        <button
                          onClick={() => toggleFunction(func.id, category.id)}
                          className={cn(
                            "w-5 h-5 rounded flex items-center justify-center flex-shrink-0",
                            isActive
                              ? "bg-gold-500 text-slate-900"
                              : "border border-slate-600 hover:border-slate-500"
                          )}
                        >
                          {isActive && <Check className="h-3.5 w-3.5" />}
                        </button>
                        {/* Function name - clickable to toggle */}
                        <button
                          onClick={() => toggleFunction(func.id, category.id)}
                          className={cn(
                            "text-sm flex-1 text-left",
                            isActive
                              ? "text-marble-100 font-medium"
                              : "text-slate-300 hover:text-slate-200"
                          )}
                        >
                          {func.name}
                        </button>
                        {isComplete && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                        )}
                        {isActive && !isComplete && (
                          <span className="text-xs text-slate-500">needs details</span>
                        )}
                        {isDimmed && !isActive && (
                          <span className="text-xs text-slate-500">(less common)</span>
                        )}
                        {isActive && (
                          <button
                            onClick={() => toggleFunctionExpand(func.id)}
                            className="ml-2 p-1 hover:bg-slate-700 rounded"
                          >
                            {isExpandedFunc ? (
                              <ChevronDown className="h-4 w-4 text-slate-400" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-slate-400" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Expanded function details */}
                      {isActive &&
                        isExpandedFunc &&
                        funcDetail &&
                        renderFunctionDetailForm(funcDetail, func.name)}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  // ==========================================================================
  // RENDER
  // ==========================================================================

  // Can complete if all categories are either excluded or have completed functions
  const canComplete =
    categories.length > 0 &&
    categories.every((cat) => {
      if (excludedCategories.has(cat.id)) return true;
      const categoryFunctions = functions.filter((f) => f.categoryId === cat.id && f.isActive);
      return categoryFunctions.length > 0 && categoryFunctions.every((f) => isFunctionComplete(f));
    });

  return (
    <WizardLayout
      variant="dark"
      steps={STEPS}
      currentStep={0}
      onBack={handleBack}
      onNext={handleComplete}
      cancelHref={`/interview/${story.id}`}
      isLoading={isSubmitting}
      canGoNext={canComplete || activeFunctionsCount > 0}
      nextLabel="Complete"
      title="Functional Mapping"
      subtitle="Map your organization's structure at its peak"
      progress={progressPercent}
    >
      {renderContent()}
    </WizardLayout>
  );
}
