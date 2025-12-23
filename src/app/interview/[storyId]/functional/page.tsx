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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Check,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Plus,
  Info,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import type { CustomFunction, FunctionalCategoryAnswer } from "@/types/interview";
import {
  FUNCTION_CATEGORIES,
  ORG_SPECIFIC_CATEGORIES,
  getCategoriesForOrgType,
  getVisibleFunctionsForCategory,
  ORG_TYPE_LABELS,
} from "@/data/function-matrix";
import {
  CATEGORY_QUESTIONS,
  getCategoryHeader,
  getCategoryContext,
} from "@/data/functional-questions";

// =============================================================================
// WIZARD STEPS
// =============================================================================

const STEPS = [
  { id: "mapping", label: "Select Functions", description: "Check functions that existed" },
  { id: "details", label: "Describe Functions", description: "Tell us how they worked" },
];

// =============================================================================
// TOOLTIP COMPONENT
// =============================================================================

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

function Tooltip({ content, children }: TooltipProps) {
  const [show, setShow] = React.useState(false);

  return (
    <div className="relative inline-flex items-center">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="inline-flex items-center"
      >
        {children}
      </div>
      {show && content && (
        <div className="absolute z-50 left-0 top-full mt-2 w-72 p-3 rounded-lg bg-slate-700 border border-slate-600 shadow-xl">
          <p className="text-sm text-slate-200 leading-relaxed">{content}</p>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// ADD FUNCTION DIALOG
// =============================================================================

interface AddFunctionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (func: CustomFunction) => void;
  currentOrgType: string;
}

function AddFunctionDialog({ open, onOpenChange, onAdd, currentOrgType }: AddFunctionDialogProps) {
  const [mode, setMode] = React.useState<"catalog" | "custom">("catalog");
  const [selectedOrgType, setSelectedOrgType] = React.useState<string>("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("");
  const [selectedFunction, setSelectedFunction] = React.useState<string>("");
  const [customName, setCustomName] = React.useState("");
  const [customCategory, setCustomCategory] = React.useState("");
  const [customDescription, setCustomDescription] = React.useState("");

  // Get all org types except current
  const otherOrgTypes = Object.keys(ORG_SPECIFIC_CATEGORIES).filter((t) => t !== currentOrgType);

  // Get categories for selected org type
  const catalogCategories = React.useMemo(() => {
    if (!selectedOrgType) return [];
    // Get base categories plus org-specific
    const orgSpecific =
      ORG_SPECIFIC_CATEGORIES[selectedOrgType as keyof typeof ORG_SPECIFIC_CATEGORIES] || [];
    return [...FUNCTION_CATEGORIES, ...orgSpecific];
  }, [selectedOrgType]);

  // Get functions for selected category
  const catalogFunctions = React.useMemo(() => {
    if (!selectedCategory) return [];
    const category = catalogCategories.find((c) => c.id === selectedCategory);
    return category?.functions || [];
  }, [catalogCategories, selectedCategory]);

  const handleAddFromCatalog = () => {
    if (!selectedFunction || !selectedCategory) return;
    const func = catalogFunctions.find((f) => f.id === selectedFunction);
    if (!func) return;

    onAdd({
      id: `custom_${selectedFunction}_${Date.now()}`,
      name: func.name,
      categoryId: selectedCategory,
      description: func.description,
      sourceOrgType: selectedOrgType,
    });

    // Reset and close
    setSelectedOrgType("");
    setSelectedCategory("");
    setSelectedFunction("");
    onOpenChange(false);
  };

  const handleAddCustom = () => {
    if (!customName || !customCategory) return;

    onAdd({
      id: `custom_${customName.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`,
      name: customName,
      categoryId: customCategory,
      description: customDescription || undefined,
    });

    // Reset and close
    setCustomName("");
    setCustomCategory("");
    setCustomDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="dark" size="lg">
        <DialogHeader>
          <DialogTitle variant="dark">Add Function</DialogTitle>
          <DialogDescription variant="dark">
            Add a function from another organization type&apos;s catalog, or create a custom one.
          </DialogDescription>
        </DialogHeader>

        {/* Mode selector */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={mode === "catalog" ? "dark-primary" : "dark-secondary"}
            size="sm"
            onClick={() => setMode("catalog")}
          >
            From Catalog
          </Button>
          <Button
            variant={mode === "custom" ? "dark-primary" : "dark-secondary"}
            size="sm"
            onClick={() => setMode("custom")}
          >
            Custom Function
          </Button>
        </div>

        {mode === "catalog" ? (
          <div className="space-y-4">
            {/* Org type selector */}
            <FormField variant="dark" label="Organization Type">
              <select
                value={selectedOrgType}
                onChange={(e) => {
                  setSelectedOrgType(e.target.value);
                  setSelectedCategory("");
                  setSelectedFunction("");
                }}
                className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-marble-100"
              >
                <option value="">Select organization type...</option>
                {otherOrgTypes.map((type) => (
                  <option key={type} value={type}>
                    {ORG_TYPE_LABELS[type as keyof typeof ORG_TYPE_LABELS]}
                  </option>
                ))}
              </select>
            </FormField>

            {/* Category selector */}
            {selectedOrgType && (
              <FormField variant="dark" label="Category">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedFunction("");
                  }}
                  className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-marble-100"
                >
                  <option value="">Select category...</option>
                  {catalogCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </FormField>
            )}

            {/* Function selector */}
            {selectedCategory && (
              <FormField variant="dark" label="Function">
                <select
                  value={selectedFunction}
                  onChange={(e) => setSelectedFunction(e.target.value)}
                  className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-marble-100"
                >
                  <option value="">Select function...</option>
                  {catalogFunctions.map((func) => (
                    <option key={func.id} value={func.id}>
                      {func.name}
                    </option>
                  ))}
                </select>
              </FormField>
            )}

            {/* Show description if function selected */}
            {selectedFunction && (
              <div className="p-3 rounded-lg bg-slate-700/50 text-sm text-slate-300">
                {catalogFunctions.find((f) => f.id === selectedFunction)?.description ||
                  "No description available."}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <FormField variant="dark" label="Function Name" required>
              <Input
                variant="dark"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g., Partner Management"
              />
            </FormField>

            <FormField variant="dark" label="Category" required>
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-marble-100"
              >
                <option value="">Select category...</option>
                {FUNCTION_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
                <option value="other">Other</option>
              </select>
            </FormField>

            <FormField variant="dark" label="Description" hint="Optional">
              <Textarea
                variant="dark"
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                placeholder="Describe what this function does..."
                rows={3}
              />
            </FormField>
          </div>
        )}

        <DialogFooter>
          <Button variant="dark-secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="dark-primary"
            onClick={mode === "catalog" ? handleAddFromCatalog : handleAddCustom}
            disabled={mode === "catalog" ? !selectedFunction : !customName || !customCategory}
          >
            Add Function
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function FunctionalPage() {
  const router = useRouter();
  const { story, isLoading, updateFunctionalMapping, completeModule } = useInterview();

  const [currentStep, setCurrentStep] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(new Set());
  const [showAddFunctionDialog, setShowAddFunctionDialog] = React.useState(false);

  // Get org type and stage from story
  const orgType = story?.basicInfo.organizationType;
  const stage = story?.basicInfo.stageAtClosure || "growth";

  // Get categories for this org type (filtered to only show relevant ones)
  const categories = React.useMemo(() => {
    if (!orgType) return [];
    return getCategoriesForOrgType(orgType);
  }, [orgType]);

  // Get selected functions from story
  const selectedFunctions = React.useMemo(() => {
    return new Set(story?.functionalMapping.selectedFunctions ?? []);
  }, [story?.functionalMapping.selectedFunctions]);

  // Get custom functions from story
  const customFunctions = React.useMemo(() => {
    return story?.functionalMapping.customFunctions ?? [];
  }, [story?.functionalMapping.customFunctions]);

  // Get category answers from story
  const categoryAnswers = React.useMemo(() => {
    return story?.functionalMapping.categoryAnswers ?? {};
  }, [story?.functionalMapping.categoryAnswers]);

  // Calculate which categories have selected functions
  const categoriesWithSelections = React.useMemo(() => {
    const result: Set<string> = new Set();

    // Check base functions
    for (const category of categories) {
      const visibleFuncs = orgType
        ? getVisibleFunctionsForCategory(orgType, category.id, stage)
        : [];
      for (const func of visibleFuncs) {
        if (selectedFunctions.has(func.id)) {
          result.add(category.id);
          break;
        }
      }
    }

    // Check custom functions
    for (const customFunc of customFunctions) {
      if (selectedFunctions.has(customFunc.id)) {
        result.add(customFunc.categoryId);
      }
    }

    return result;
  }, [categories, customFunctions, orgType, selectedFunctions, stage]);

  // Get selected function names for a category (for header)
  const getSelectedFunctionNames = (categoryId: string): string[] => {
    const names: string[] = [];

    // Base functions
    if (orgType) {
      const visibleFuncs = getVisibleFunctionsForCategory(orgType, categoryId, stage);
      for (const func of visibleFuncs) {
        if (selectedFunctions.has(func.id)) {
          names.push(func.name);
        }
      }
    }

    // Custom functions
    for (const customFunc of customFunctions) {
      if (customFunc.categoryId === categoryId && selectedFunctions.has(customFunc.id)) {
        names.push(customFunc.name);
      }
    }

    return names;
  };

  // Progress calculation
  const progressPercent = React.useMemo(() => {
    if (currentStep === 0) {
      // Step 1: progress based on categories viewed/interacted with
      return selectedFunctions.size > 0 ? 50 : 0;
    } else {
      // Step 2: progress based on answered categories
      if (categoriesWithSelections.size === 0) return 50;
      const answeredCategories = Array.from(categoriesWithSelections).filter((catId) => {
        const answer = categoryAnswers[catId];
        return answer && (answer.organization || answer.satisfaction || answer.health);
      });
      return 50 + Math.round((answeredCategories.length / categoriesWithSelections.size) * 50);
    }
  }, [currentStep, selectedFunctions.size, categoriesWithSelections, categoryAnswers]);

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  // Toggle function selection
  const toggleFunction = (functionId: string) => {
    if (!story) return;

    const current = story.functionalMapping.selectedFunctions ?? [];
    let updated: string[];

    if (current.includes(functionId)) {
      updated = current.filter((id) => id !== functionId);
    } else {
      updated = [...current, functionId];
    }

    updateFunctionalMapping({ selectedFunctions: updated });
  };

  // Add custom function
  const handleAddCustomFunction = (func: CustomFunction) => {
    if (!story) return;

    const currentCustom = story.functionalMapping.customFunctions ?? [];
    const currentSelected = story.functionalMapping.selectedFunctions ?? [];

    updateFunctionalMapping({
      customFunctions: [...currentCustom, func],
      selectedFunctions: [...currentSelected, func.id],
    });
  };

  // Update category answer
  const updateCategoryAnswer = (
    categoryId: string,
    field: keyof FunctionalCategoryAnswer,
    value: string
  ) => {
    if (!story) return;

    const currentAnswers = story.functionalMapping.categoryAnswers ?? {};
    const currentCategoryAnswer = currentAnswers[categoryId] ?? {
      organization: "",
      satisfaction: "",
      health: "",
    };

    updateFunctionalMapping({
      categoryAnswers: {
        ...currentAnswers,
        [categoryId]: {
          ...currentCategoryAnswer,
          [field]: value,
        },
      },
    });
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

  // Navigate to next step
  const handleNextStep = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
    } else {
      handleComplete();
    }
  };

  // Navigate to previous step
  const handlePrevStep = () => {
    if (currentStep === 1) {
      setCurrentStep(0);
    } else {
      router.push(`/interview/${story?.id}`);
    }
  };

  // Complete module
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
  // STEP 1: VISUAL MAPPING
  // ==========================================================================

  const renderStep1 = () => (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="mb-6">
        <p className="text-slate-300">
          Select functions that existed in your organization at its peak. Hover over each function
          to see what it includes.
        </p>
        <p className="text-sm text-slate-400 mt-2">
          We&apos;ve organized functions typical for{" "}
          <span className="font-medium text-gold-400">{ORG_TYPE_LABELS[orgType]}</span>{" "}
          organizations.
        </p>
      </div>

      {/* Progress summary */}
      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg mb-4">
        <span className="text-sm text-slate-400">
          <span className="font-medium text-marble-100">{selectedFunctions.size}</span> functions
          selected
        </span>
        <span className="text-sm text-slate-400">
          across{" "}
          <span className="font-medium text-marble-100">{categoriesWithSelections.size}</span>{" "}
          categories
        </span>
      </div>

      {/* Categories accordion */}
      {categories.map((category) => {
        const visibleFunctions = getVisibleFunctionsForCategory(orgType, category.id, stage);

        // Skip completely hidden categories
        if (visibleFunctions.length === 0) return null;

        const categoryCustomFuncs = customFunctions.filter((f) => f.categoryId === category.id);
        const selectedInCategory = visibleFunctions.filter((f) =>
          selectedFunctions.has(f.id)
        ).length;
        const selectedCustomInCategory = categoryCustomFuncs.filter((f) =>
          selectedFunctions.has(f.id)
        ).length;
        const totalSelected = selectedInCategory + selectedCustomInCategory;
        const isExpanded = expandedCategories.has(category.id);

        return (
          <div key={category.id} className="border border-slate-700 rounded-lg overflow-hidden">
            {/* Category header */}
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                {isExpanded ? (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                )}
                <span className="font-medium text-marble-100">{category.name}</span>
                {totalSelected > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-400 text-xs">
                    {totalSelected} selected
                  </span>
                )}
              </div>
              <span className="text-sm text-slate-400">
                {visibleFunctions.length + categoryCustomFuncs.length} functions
              </span>
            </button>

            {/* Functions list */}
            {isExpanded && (
              <div className="divide-y divide-slate-700/50">
                {visibleFunctions.map((func) => {
                  const isSelected = selectedFunctions.has(func.id);
                  const isDimmed = func.status === "dimmed";

                  return (
                    <div
                      key={func.id}
                      className={cn(
                        "flex items-center gap-3 p-3 transition-colors",
                        isSelected ? "bg-gold-500/10" : "hover:bg-slate-800/30",
                        isDimmed && !isSelected && "opacity-60"
                      )}
                    >
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleFunction(func.id)}
                        className={cn(
                          "w-5 h-5 rounded flex items-center justify-center flex-shrink-0",
                          isSelected
                            ? "bg-gold-500 text-slate-900"
                            : "border border-slate-600 hover:border-slate-500"
                        )}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5" />}
                      </button>

                      {/* Function name with tooltip */}
                      <Tooltip content={func.description || ""}>
                        <button
                          onClick={() => toggleFunction(func.id)}
                          className={cn(
                            "text-sm text-left flex items-center gap-2",
                            isSelected ? "text-marble-100 font-medium" : "text-slate-300"
                          )}
                        >
                          {func.name}
                          {func.description && <Info className="h-3.5 w-3.5 text-slate-500" />}
                        </button>
                      </Tooltip>

                      {isDimmed && !isSelected && (
                        <span className="text-xs text-slate-500 ml-auto">(less common)</span>
                      )}
                    </div>
                  );
                })}

                {/* Custom functions in this category */}
                {categoryCustomFuncs.map((func) => {
                  const isSelected = selectedFunctions.has(func.id);

                  return (
                    <div
                      key={func.id}
                      className={cn(
                        "flex items-center gap-3 p-3 transition-colors",
                        isSelected ? "bg-gold-500/10" : "hover:bg-slate-800/30"
                      )}
                    >
                      <button
                        onClick={() => toggleFunction(func.id)}
                        className={cn(
                          "w-5 h-5 rounded flex items-center justify-center flex-shrink-0",
                          isSelected
                            ? "bg-gold-500 text-slate-900"
                            : "border border-slate-600 hover:border-slate-500"
                        )}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5" />}
                      </button>

                      <Tooltip content={func.description || ""}>
                        <button
                          onClick={() => toggleFunction(func.id)}
                          className={cn(
                            "text-sm text-left flex items-center gap-2",
                            isSelected ? "text-marble-100 font-medium" : "text-slate-300"
                          )}
                        >
                          {func.name}
                          {func.description && <Info className="h-3.5 w-3.5 text-slate-500" />}
                        </button>
                      </Tooltip>

                      <span className="text-xs text-slate-500 ml-auto">(custom)</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Add Function button */}
      <Button
        variant="dark-secondary"
        className="w-full mt-4"
        onClick={() => setShowAddFunctionDialog(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Function
      </Button>

      {/* Add Function Dialog */}
      <AddFunctionDialog
        open={showAddFunctionDialog}
        onOpenChange={setShowAddFunctionDialog}
        onAdd={handleAddCustomFunction}
        currentOrgType={orgType}
      />
    </div>
  );

  // ==========================================================================
  // STEP 2: CATEGORY QUESTIONS
  // ==========================================================================

  const renderStep2 = () => {
    const categoriesArray = Array.from(categoriesWithSelections);

    if (categoriesArray.length === 0) {
      return (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto text-gold-500 mb-4" />
          <h2 className="text-lg font-medium text-marble-100 mb-2">No functions selected</h2>
          <p className="text-slate-400 mb-6">Go back to Step 1 and select at least one function.</p>
          <Button variant="dark-secondary" onClick={() => setCurrentStep(0)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Selection
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Instructions */}
        <p className="text-slate-300">
          Now tell us about how each area worked in your organization. The more detail you provide,
          the more valuable your story becomes.
        </p>

        {/* Category question sections */}
        {categoriesArray.map((categoryId) => {
          const category = categories.find((c) => c.id === categoryId);
          const categoryName = category?.name || categoryId;
          const selectedNames = getSelectedFunctionNames(categoryId);
          const answer = categoryAnswers[categoryId] ?? {
            organization: "",
            satisfaction: "",
            health: "",
          };
          const context = getCategoryContext(categoryId);

          return (
            <div key={categoryId} className="space-y-4">
              {/* Category header card */}
              <Card variant="dark" className="p-4 bg-slate-800/50 border-gold-500/30">
                <h3 className="font-medium text-marble-100 mb-2">{categoryName}</h3>
                <p className="text-sm text-gold-400 mb-2">
                  {getCategoryHeader(categoryName, selectedNames).split("\n\n")[0]}
                </p>
                <p className="text-sm text-slate-300">
                  {getCategoryHeader(categoryName, selectedNames).split("\n\n")[1]}
                </p>
                {context && <p className="text-xs text-slate-400 mt-2 italic">{context}</p>}
              </Card>

              {/* Questions */}
              <div className="space-y-4 pl-4 border-l-2 border-slate-700">
                {CATEGORY_QUESTIONS.map((question) => (
                  <FormField key={question.id} variant="dark" label={question.label}>
                    <Textarea
                      variant="dark"
                      value={answer[question.id]}
                      onChange={(e) =>
                        updateCategoryAnswer(categoryId, question.id, e.target.value)
                      }
                      placeholder={question.placeholder}
                      rows={4}
                    />
                  </FormField>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <WizardLayout
      variant="dark"
      steps={STEPS}
      currentStep={currentStep}
      onBack={handlePrevStep}
      onNext={handleNextStep}
      cancelHref={`/interview/${story.id}`}
      isLoading={isSubmitting}
      canGoNext={currentStep === 0 ? selectedFunctions.size > 0 : true}
      nextLabel={currentStep === 0 ? "Continue" : "Complete"}
      backLabel={currentStep === 0 ? "Back" : "Previous Step"}
      title="Functional Mapping"
      subtitle={
        currentStep === 0
          ? "Select functions that existed in your organization"
          : "Tell us how each area worked"
      }
      progress={progressPercent}
    >
      {currentStep === 0 ? renderStep1() : renderStep2()}
    </WizardLayout>
  );
}
