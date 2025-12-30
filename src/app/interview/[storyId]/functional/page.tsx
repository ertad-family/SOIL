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
  ArrowLeft,
} from "lucide-react";
import type { CustomFunction, FunctionalCategoryAnswer, OrganizationType } from "@/types/interview";
import { useFunctions, useFunctionCatalog } from "@/hooks/useFunctions";
import { useReferenceData } from "@/hooks/useReferenceData";
import { CATEGORY_QUESTIONS, getCategoryHeader } from "@/data/functional-questions";

// =============================================================================
// WIZARD STEPS
// =============================================================================

// Base step for function selection
const BASE_STEP = {
  id: "mapping",
  label: "Select Functions",
  description: "Check functions that existed",
};

// =============================================================================
// TOOLTIP COMPONENT (uses portal to avoid overflow clipping)
// =============================================================================

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

function Tooltip({ content, children }: TooltipProps) {
  const [show, setShow] = React.useState(false);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const triggerRef = React.useRef<HTMLDivElement>(null);

  const updatePosition = React.useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      });
    }
  }, []);

  const handleMouseEnter = () => {
    updatePosition();
    setShow(true);
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShow(false)}
        className="inline-flex items-center"
      >
        {children}
      </div>
      {show && content && typeof document !== "undefined" && (
        <div
          style={{
            position: "fixed",
            top: position.top - window.scrollY,
            left: Math.min(position.left, window.innerWidth - 300),
            zIndex: 9999,
          }}
          className="function-tooltip"
        >
          <p className="text-sm leading-relaxed">{content}</p>
        </div>
      )}
    </>
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
  existingFunctionIds: Set<string>; // Function IDs already visible for current org type
  customFunctionIds: Set<string>; // Custom function IDs already added
}

interface FunctionOption {
  functionId: string;
  functionName: string;
  description?: string;
  categoryId: string;
  categoryName: string;
  orgType: string | null;
}

function AddFunctionDialog({
  open,
  onOpenChange,
  onAdd,
  currentOrgType,
  existingFunctionIds,
  customFunctionIds,
}: AddFunctionDialogProps) {
  // Search state
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedFunction, setSelectedFunction] = React.useState<FunctionOption | null>(null);
  const [showDropdown, setShowDropdown] = React.useState(false);

  // Custom function state
  const [customName, setCustomName] = React.useState("");
  const [customCategory, setCustomCategory] = React.useState("");
  const [customDescription, setCustomDescription] = React.useState("");

  // Fetch all functions from API
  const { allCategories, isLoading: catalogLoading } = useFunctionCatalog();
  const { getOrgTypeLabel: getOrgTypeLabelFromRef } = useReferenceData();

  // Get common categories for custom function dropdown
  const commonCategories = React.useMemo(() => {
    return allCategories.filter((cat) => cat.orgType === null);
  }, [allCategories]);

  // Build flat list of all functions, excluding those already available
  const availableFunctions = React.useMemo((): FunctionOption[] => {
    const result: FunctionOption[] = [];
    for (const category of allCategories) {
      for (const func of category.functions) {
        // Skip functions that are already visible for current org type
        if (existingFunctionIds.has(func.id)) continue;
        // Skip functions that have already been added as custom
        if (customFunctionIds.has(func.id)) continue;

        result.push({
          functionId: func.id,
          functionName: func.name,
          description: func.description,
          categoryId: category.id,
          categoryName: category.name,
          orgType: category.orgType,
        });
      }
    }
    return result;
  }, [allCategories, existingFunctionIds, customFunctionIds]);

  // Filter functions by search query - only when there's a query
  const filteredFunctions = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return availableFunctions
      .filter(
        (f) =>
          f.functionName.toLowerCase().includes(query) ||
          f.categoryName.toLowerCase().includes(query) ||
          f.description?.toLowerCase().includes(query)
      )
      .slice(0, 10); // Limit to 10 results
  }, [availableFunctions, searchQuery]);

  // Handle function selection from search
  const handleSelectFunction = (func: FunctionOption) => {
    setSelectedFunction(func);
    setSearchQuery(func.functionName);
    setShowDropdown(false);
  };

  // Handle add function from catalog
  const handleAddFromCatalog = () => {
    if (!selectedFunction) return;

    onAdd({
      id: `custom_${selectedFunction.functionId}_${Date.now()}`,
      name: selectedFunction.functionName,
      categoryId: selectedFunction.categoryId,
      description: selectedFunction.description,
      sourceOrgType: selectedFunction.orgType || undefined,
    });

    // Reset and close
    resetAndClose();
  };

  // Handle add custom function
  const handleAddCustom = () => {
    if (!customName.trim() || !customCategory) return;

    onAdd({
      id: `custom_${customName.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`,
      name: customName.trim(),
      categoryId: customCategory,
      description: customDescription.trim() || undefined,
    });

    // Reset and close
    resetAndClose();
  };

  // Reset all state and close
  const resetAndClose = () => {
    setSearchQuery("");
    setSelectedFunction(null);
    setShowDropdown(false);
    setCustomName("");
    setCustomCategory("");
    setCustomDescription("");
    onOpenChange(false);
  };

  // Reset when dialog closes
  React.useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setSelectedFunction(null);
      setShowDropdown(false);
      setCustomName("");
      setCustomCategory("");
      setCustomDescription("");
    }
  }, [open]);

  // Get org type label for display
  const getOrgTypeLabelLocal = (orgType: string | null): string => {
    if (!orgType) return "Common";
    return getOrgTypeLabelFromRef(orgType as OrganizationType);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="dark" size="lg">
        <DialogHeader>
          <DialogTitle variant="dark">Add Function</DialogTitle>
          <DialogDescription variant="dark">
            Search for a function from the catalog or create a custom one.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* ============ SEARCH FROM CATALOG ============ */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-300">Search Catalog</h4>

            {/* Search input with dropdown */}
            <div className="relative">
              <Input
                variant="dark"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedFunction(null);
                  setShowDropdown(e.target.value.trim().length > 0);
                }}
                onFocus={() => {
                  if (searchQuery.trim().length > 0) setShowDropdown(true);
                }}
                onBlur={() => {
                  // Delay hiding to allow click on dropdown items
                  setTimeout(() => setShowDropdown(false), 200);
                }}
                placeholder={catalogLoading ? "Loading..." : "Type to search functions..."}
                disabled={catalogLoading}
              />

              {/* Dropdown - only show when typing */}
              {showDropdown && !catalogLoading && filteredFunctions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto rounded-lg border border-slate-600 bg-slate-800 shadow-lg">
                  {filteredFunctions.map((func) => (
                    <button
                      key={`${func.categoryId}-${func.functionId}`}
                      onMouseDown={() => handleSelectFunction(func)}
                      className="w-full text-left px-3 py-2 hover:bg-slate-700 transition-colors border-b border-slate-700/50 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-marble-100">
                          {func.functionName}
                        </span>
                        <span className="text-xs text-slate-500">
                          {getOrgTypeLabelLocal(func.orgType)}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{func.categoryName}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected function preview */}
            {selectedFunction && (
              <div className="p-3 rounded-lg bg-gold-500/10 border border-gold-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-marble-100">{selectedFunction.functionName}</h4>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-600 text-slate-300">
                    {getOrgTypeLabelLocal(selectedFunction.orgType)}
                  </span>
                </div>
                <div className="text-sm text-gold-400">
                  Category: {selectedFunction.categoryName}
                </div>
                {selectedFunction.description && (
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {selectedFunction.description}
                  </p>
                )}
                <Button
                  variant="dark-primary"
                  size="sm"
                  onClick={handleAddFromCatalog}
                  className="mt-2"
                >
                  Add This Function
                </Button>
              </div>
            )}
          </div>

          {/* ============ DIVIDER ============ */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-xs text-slate-500 uppercase">or create custom</span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          {/* ============ CUSTOM FUNCTION FORM ============ */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-300">Custom Function</h4>

            <div className="grid gap-3">
              <Input
                variant="dark"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Function name (e.g., Partner Management)"
              />

              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-marble-100"
                disabled={catalogLoading}
              >
                <option value="">Select category...</option>
                {commonCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
                <option value="other">Other</option>
              </select>

              <Textarea
                variant="dark"
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                placeholder="Description (optional)"
                rows={2}
              />

              <Button
                variant="dark-secondary"
                onClick={handleAddCustom}
                disabled={!customName.trim() || !customCategory}
                className="w-full"
              >
                Add Custom Function
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="dark-secondary" onClick={() => onOpenChange(false)}>
            Close
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
  const { getOrgTypeLabel } = useReferenceData();

  const [currentStep, setCurrentStep] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(new Set());
  const [showAddFunctionDialog, setShowAddFunctionDialog] = React.useState(false);

  // Track excluded categories (marked as "None existed")
  const excludedCategories = React.useMemo(() => {
    return new Set(story?.functionalMapping.excludedCategories ?? []);
  }, [story?.functionalMapping.excludedCategories]);

  // Get org type and stage from story
  const orgType = story?.basicInfo.organizationType;
  const stage = story?.basicInfo.stageAtClosure || "growth";

  // Fetch functions from API
  const {
    isLoading: functionsLoading,
    getCategoriesForOrgType,
    getVisibleFunctionsForCategory,
  } = useFunctions();

  // Get categories for this org type (filtered to only show relevant ones)
  const categories = React.useMemo(() => {
    if (!orgType) return [];
    return getCategoriesForOrgType(orgType);
  }, [orgType, getCategoriesForOrgType]);

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

  // Calculate which categories have selected functions (excluding "None existed" categories)
  const categoriesWithSelections = React.useMemo(() => {
    const result: Set<string> = new Set();

    // Check base functions
    for (const category of categories) {
      // Skip excluded categories
      if (excludedCategories.has(category.id)) continue;

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

    // Check custom functions (also skip excluded categories)
    for (const customFunc of customFunctions) {
      if (excludedCategories.has(customFunc.categoryId)) continue;
      if (selectedFunctions.has(customFunc.id)) {
        result.add(customFunc.categoryId);
      }
    }

    return result;
  }, [
    categories,
    customFunctions,
    orgType,
    selectedFunctions,
    stage,
    excludedCategories,
    getVisibleFunctionsForCategory,
  ]);

  // Get all function IDs visible for current org type (to exclude from Add Function dialog)
  const existingFunctionIds = React.useMemo(() => {
    const result = new Set<string>();
    if (!orgType) return result;

    for (const category of categories) {
      const visibleFuncs = getVisibleFunctionsForCategory(orgType, category.id, stage);
      for (const func of visibleFuncs) {
        result.add(func.id);
      }
    }
    return result;
  }, [categories, orgType, stage, getVisibleFunctionsForCategory]);

  // Get custom function IDs (to exclude from Add Function dialog)
  const customFunctionIds = React.useMemo(() => {
    return new Set(customFunctions.map((f) => f.id));
  }, [customFunctions]);

  // Convert categoriesWithSelections to ordered array for step navigation
  const activeCategoriesArray = React.useMemo(() => {
    // Get categories in display order
    return categories.filter((cat) => categoriesWithSelections.has(cat.id)).map((cat) => cat.id);
  }, [categories, categoriesWithSelections]);

  // Build dynamic steps: Step 0 = Select Functions, then one step per category
  const dynamicSteps = React.useMemo(() => {
    const steps = [BASE_STEP];
    for (const catId of activeCategoriesArray) {
      const category = categories.find((c) => c.id === catId);
      if (category) {
        steps.push({
          id: catId,
          label: category.name,
          description: "Tell us how it worked",
        });
      }
    }
    return steps;
  }, [activeCategoriesArray, categories]);

  // Get current category ID for step > 0
  const currentCategoryId = currentStep > 0 ? activeCategoriesArray[currentStep - 1] : null;
  const currentCategory = currentCategoryId
    ? categories.find((c) => c.id === currentCategoryId)
    : null;

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

  // Progress calculation - based on current step within total steps
  const progressPercent = React.useMemo(() => {
    if (dynamicSteps.length <= 1) return 0;
    return Math.round((currentStep / (dynamicSteps.length - 1)) * 100);
  }, [currentStep, dynamicSteps.length]);

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

  // Toggle category exclusion ("None existed")
  const toggleCategoryExcluded = (categoryId: string) => {
    if (!story) return;

    const currentExcluded = story.functionalMapping.excludedCategories ?? [];
    const isCurrentlyExcluded = currentExcluded.includes(categoryId);

    let updatedExcluded: string[];
    let updatedSelected = story.functionalMapping.selectedFunctions ?? [];

    if (isCurrentlyExcluded) {
      // Re-enable category
      updatedExcluded = currentExcluded.filter((id) => id !== categoryId);
    } else {
      // Exclude category - also deselect all functions in this category
      updatedExcluded = [...currentExcluded, categoryId];

      // Get all functions in this category to deselect them
      if (orgType) {
        const visibleFuncs = getVisibleFunctionsForCategory(orgType, categoryId, stage);
        const categoryFuncIds = visibleFuncs.map((f) => f.id);
        updatedSelected = updatedSelected.filter((id) => !categoryFuncIds.includes(id));
      }

      // Also deselect custom functions in this category
      const customInCategory = customFunctions.filter((f) => f.categoryId === categoryId);
      const customIds = customInCategory.map((f) => f.id);
      updatedSelected = updatedSelected.filter((id) => !customIds.includes(id));

      // Collapse the category
      setExpandedCategories((prev) => {
        const next = new Set(prev);
        next.delete(categoryId);
        return next;
      });
    }

    updateFunctionalMapping({
      excludedCategories: updatedExcluded,
      selectedFunctions: updatedSelected,
    });
  };

  // Navigate to next step
  const handleNextStep = async () => {
    if (currentStep < dynamicSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      // Scroll to top when moving to next category
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Complete the module
      await handleComplete();
    }
  };

  // Navigate to previous step
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Scroll to top when moving to previous category
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  if (isLoading || functionsLoading || !story) {
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
          to see what it includes. Use &quot;Add Function&quot; below to add functions from other
          organization types or create custom ones.
        </p>
        <p className="text-sm text-slate-400 mt-2">
          We&apos;ve organized functions typical for{" "}
          <span className="font-medium text-gold-400">{getOrgTypeLabel(orgType!)}</span>{" "}
          organizations.
        </p>
      </div>

      {/* Progress summary */}
      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg mb-4">
        <span className="text-sm text-slate-400">
          <span className="font-medium text-marble-100">{selectedFunctions.size}</span> functions
          selected
        </span>
        <div className="flex items-center gap-4">
          {excludedCategories.size > 0 && (
            <span className="text-sm text-slate-400">
              <span className="font-medium text-slate-500">{excludedCategories.size}</span> excluded
            </span>
          )}
          <span className="text-sm text-slate-400">
            <span className="font-medium text-marble-100">{categoriesWithSelections.size}</span>{" "}
            categories active
          </span>
        </div>
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
        const isExcluded = excludedCategories.has(category.id);

        return (
          <div
            key={category.id}
            className={cn(
              "border border-slate-700 rounded-lg overflow-hidden",
              isExcluded && "opacity-60"
            )}
          >
            {/* Category header */}
            <div className="w-full flex items-center justify-between p-4 bg-slate-800/50">
              <button
                onClick={() => !isExcluded && toggleCategory(category.id)}
                className={cn(
                  "flex items-center gap-3 flex-1",
                  !isExcluded && "hover:opacity-80 transition-opacity"
                )}
                disabled={isExcluded}
              >
                {!isExcluded &&
                  (isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  ))}
                <span
                  className={cn(
                    "font-medium",
                    isExcluded ? "text-slate-500 line-through" : "text-marble-100"
                  )}
                >
                  {category.name}
                </span>
                {!isExcluded && totalSelected > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-400 text-xs">
                    {totalSelected} selected
                  </span>
                )}
              </button>
              <div className="flex items-center gap-3">
                {isExcluded ? (
                  <button
                    onClick={() => toggleCategoryExcluded(category.id)}
                    className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300 hover:bg-slate-600"
                  >
                    Undo
                  </button>
                ) : (
                  <>
                    <span className="text-sm text-slate-400">
                      {visibleFunctions.length + categoryCustomFuncs.length} functions
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCategoryExcluded(category.id);
                      }}
                      className="text-xs px-2 py-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-700"
                    >
                      None existed
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Functions list - only show when expanded and not excluded */}
            {isExpanded && !isExcluded && (
              <div className="divide-y divide-slate-700/50">
                {visibleFunctions.map((func) => {
                  const isSelected = selectedFunctions.has(func.id);
                  const isDimmed = func.status === "dimmed";

                  return (
                    <div
                      key={func.id}
                      className={cn(
                        "flex items-center gap-3 p-3 transition-colors",
                        isSelected ? "bg-gold-500/10" : "hover:bg-slate-800/30"
                      )}
                    >
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleFunction(func.id)}
                        className={cn(
                          "w-5 h-5 rounded flex items-center justify-center flex-shrink-0",
                          isSelected
                            ? "bg-gold-500 text-slate-900"
                            : "border border-slate-600 hover:border-slate-500",
                          isDimmed && !isSelected && "opacity-60"
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
                            isSelected ? "text-marble-100 font-medium" : "text-slate-300",
                            isDimmed && !isSelected && "opacity-60"
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
        existingFunctionIds={existingFunctionIds}
        customFunctionIds={customFunctionIds}
      />
    </div>
  );

  // ==========================================================================
  // STEP 2: CATEGORY QUESTIONS
  // ==========================================================================

  const renderStep2 = () => {
    // Show only the current category
    if (!currentCategoryId || !currentCategory) {
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

    const categoryName = currentCategory.name;
    const selectedNames = getSelectedFunctionNames(currentCategoryId);
    const answer = categoryAnswers[currentCategoryId] ?? {
      organization: "",
      satisfaction: "",
      health: "",
    };

    return (
      <div className="space-y-6">
        {/* Category header card */}
        <Card variant="dark" padding="sm">
          <h3 className="font-display text-lg font-medium text-marble-100 mb-2">{categoryName}</h3>
          <p className="text-sm text-gold-400 mb-1">
            {getCategoryHeader(categoryName, selectedNames).split("\n\n")[0]}
          </p>
          <p className="text-sm text-slate-400">
            {getCategoryHeader(categoryName, selectedNames).split("\n\n")[1]}
          </p>
        </Card>

        {/* Questions */}
        <div className="space-y-4">
          {CATEGORY_QUESTIONS.map((question) => (
            <FormField
              key={question.id}
              variant="dark"
              label={
                <span className="inline-flex items-center gap-2">
                  {question.label}
                  <Tooltip content={question.placeholder}>
                    <Info className="h-4 w-4 text-slate-500 hover:text-slate-400 cursor-help" />
                  </Tooltip>
                </span>
              }
            >
              <Textarea
                variant="dark"
                value={answer[question.id]}
                onChange={(e) =>
                  updateCategoryAnswer(currentCategoryId, question.id, e.target.value)
                }
                rows={4}
              />
            </FormField>
          ))}
        </div>

        {/* Progress indicator for categories */}
        <div className="flex items-center justify-center gap-1 pt-4 border-t border-slate-700 flex-wrap">
          {activeCategoriesArray.map((catId, index) => {
            const cat = categories.find((c) => c.id === catId);
            const isActive = index === currentStep - 1;
            const isPast = index < currentStep - 1;
            const stepIndex = index + 1; // Step 0 is function selection
            return (
              <button
                key={catId}
                onClick={() => setCurrentStep(stepIndex)}
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors",
                  isActive && "bg-gold-500/20 text-gold-400 font-medium",
                  isPast && "text-slate-400 hover:text-slate-300",
                  !isActive && !isPast && "text-slate-500 hover:text-slate-400"
                )}
              >
                {isPast && <CheckCircle2 className="h-3 w-3" />}
                {cat?.name || catId}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================

  // Determine if on last step
  const isLastStep = currentStep === dynamicSteps.length - 1;

  // Determine subtitle based on current step
  const getSubtitle = () => {
    if (currentStep === 0) {
      return "Select functions that existed in your organization";
    }
    if (currentCategory) {
      return `Tell us about ${currentCategory.name}`;
    }
    return "Tell us how each area worked";
  };

  return (
    <WizardLayout
      variant="dark"
      steps={dynamicSteps}
      currentStep={currentStep}
      onBack={handlePrevStep}
      onNext={handleNextStep}
      cancelHref={`/interview/${story.id}`}
      isLoading={isSubmitting}
      canGoNext={
        currentStep === 0 ? selectedFunctions.size > 0 || excludedCategories.size > 0 : true
      }
      nextLabel={isLastStep ? "Complete" : "Continue"}
      backLabel={currentStep === 0 ? "Back" : "Previous"}
      title="Functional Mapping"
      subtitle={getSubtitle()}
      progress={progressPercent}
    >
      {currentStep === 0 ? renderStep1() : renderStep2()}
    </WizardLayout>
  );
}
