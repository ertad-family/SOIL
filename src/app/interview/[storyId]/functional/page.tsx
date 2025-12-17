'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useInterview } from '@/contexts/InterviewContext'
import { WizardLayout } from '@/components/layouts/wizard-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/forms/form-field'
import { cn } from '@/lib/utils'
import {
  Check,
  ChevronDown,
  ChevronRight,
  Plus,
  AlertCircle,
} from 'lucide-react'
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
} from '@/types/interview'
import {
  getCategoriesForOrgType,
  getVisibleFunctionsForCategory,
  ORG_TYPE_LABELS,
  LIFECYCLE_STAGE_LABELS,
} from '@/data/function-matrix'

// =============================================================================
// WIZARD STEPS
// =============================================================================

const STEPS = [
  { id: 'select', label: 'Select Functions', description: 'Which functions existed in your organization?' },
  { id: 'details', label: 'Function Details', description: 'Tell us about each function' },
  { id: 'health', label: 'Health Check', description: 'Assess the health of each function' },
]

// =============================================================================
// CONSTANTS
// =============================================================================

const EXECUTION_MODELS: Array<{ value: ExecutionModel; label: string }> = [
  { value: 'in_house', label: 'In-house' },
  { value: 'outsourced', label: 'Outsourced' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'none', label: 'Did not exist' },
]

const OWNER_TYPES: Array<{ value: OwnerType; label: string }> = [
  { value: 'dedicated', label: 'Dedicated owner' },
  { value: 'shared', label: 'Shared responsibility' },
  { value: 'founder', label: 'Founder handled it' },
  { value: 'nobody', label: 'No clear owner' },
]

const PROVIDER_TYPES: Array<{ value: ProviderType; label: string }> = [
  { value: 'agency', label: 'Agency' },
  { value: 'freelancer', label: 'Freelancer' },
  { value: 'firm', label: 'Professional firm' },
  { value: 'other', label: 'Other' },
]

const FORMALIZATION_LEVELS: Array<{ value: FormalizationLevel; label: string }> = [
  { value: 'none', label: 'No documentation' },
  { value: 'informal', label: 'Informal processes' },
  { value: 'documented', label: 'Written processes' },
  { value: 'tooled', label: 'Tools enforcing processes' },
  { value: 'automated', label: 'Automated workflows' },
]

const LIFECYCLE_STAGES: Array<{ value: LifecycleStage | 'until_end'; label: string }> = [
  { value: 'formation', label: LIFECYCLE_STAGE_LABELS.formation },
  { value: 'establishment', label: LIFECYCLE_STAGE_LABELS.establishment },
  { value: 'growth', label: LIFECYCLE_STAGE_LABELS.growth },
  { value: 'maturity', label: LIFECYCLE_STAGE_LABELS.maturity },
  { value: 'until_end', label: 'Until the end' },
]

const SATISFACTION_RATINGS: Array<{ value: SatisfactionRating; label: string }> = [
  { value: 1, label: '1 - Very dissatisfied' },
  { value: 2, label: '2 - Dissatisfied' },
  { value: 3, label: '3 - Neutral' },
  { value: 4, label: '4 - Satisfied' },
  { value: 5, label: '5 - Very satisfied' },
]

// Health Check Options
const TURNOVER_OPTIONS: Array<{ value: TurnoverLevel; label: string }> = [
  { value: 'low', label: 'Low (stable team)' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High (frequent departures)' },
]

const STAFFING_OPTIONS: Array<{ value: StaffingLevel; label: string }> = [
  { value: 'adequate', label: 'Adequate' },
  { value: 'understaffed', label: 'Understaffed' },
]

const BUDGET_OPTIONS: Array<{ value: BudgetPressure; label: string }> = [
  { value: 'none', label: 'No pressure' },
  { value: 'some', label: 'Some pressure' },
  { value: 'severe', label: 'Severe pressure' },
]

const QUALITY_OPTIONS: Array<{ value: QualityIssues; label: string }> = [
  { value: 'none', label: 'No issues' },
  { value: 'some', label: 'Some issues' },
  { value: 'serious', label: 'Serious issues' },
]

const LEADERSHIP_OPTIONS: Array<{ value: LeadershipStatus; label: string }> = [
  { value: 'stable', label: 'Stable leadership' },
  { value: 'gaps', label: 'Leadership gaps' },
  { value: 'vacuum', label: 'Leadership vacuum' },
]

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
  }
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function FunctionalPage() {
  const router = useRouter()
  const {
    story,
    isLoading,
    updateFunctionalMapping,
    completeModule,
  } = useInterview()

  const [currentStep, setCurrentStep] = React.useState(0)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [detailsIndex, setDetailsIndex] = React.useState(0) // Index in active functions for details step
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(new Set())

  // Get org type and stage from basic info
  const orgType = story?.basicInfo.organizationType
  const stage = story?.basicInfo.stageAtClosure || 'growth'

  // Get categories for this org type
  const categories = React.useMemo(() => {
    if (!orgType) return []
    return getCategoriesForOrgType(orgType)
  }, [orgType])

  // Get functions from story (use stable reference)
  const functions = story?.functionalMapping.functions ?? []

  // Get active functions
  const activeFunctions = React.useMemo(() => {
    const funcs = story?.functionalMapping.functions ?? []
    return funcs.filter(f => f.isActive)
  }, [story?.functionalMapping.functions])

  // Current function being edited in details step
  const currentDetailFunction = activeFunctions[detailsIndex]

  // ==========================================================================
  // FUNCTION HANDLERS
  // ==========================================================================

  // Toggle function active state
  const toggleFunction = (functionId: string, categoryId: string) => {
    if (!story) return

    const existingIndex = functions.findIndex(f => f.functionId === functionId)

    if (existingIndex >= 0) {
      // Toggle existing
      const updated = [...functions]
      updated[existingIndex] = {
        ...updated[existingIndex],
        isActive: !updated[existingIndex].isActive,
      }
      updateFunctionalMapping({ functions: updated })
    } else {
      // Add new
      const newFunction = createEmptyFunctionDetail(functionId, categoryId)
      newFunction.isActive = true
      updateFunctionalMapping({ functions: [...functions, newFunction] })
    }
  }

  // Update function detail
  const updateFunctionDetail = (functionId: string, updates: Partial<FunctionDetail>) => {
    if (!story) return

    const existingIndex = functions.findIndex(f => f.functionId === functionId)
    if (existingIndex < 0) return

    const updated = [...functions]
    updated[existingIndex] = { ...updated[existingIndex], ...updates }
    updateFunctionalMapping({ functions: updated })
  }

  // Update health check
  const updateHealthCheck = (functionId: string, updates: Partial<FunctionHealthCheck>) => {
    if (!story) return

    const existingIndex = functions.findIndex(f => f.functionId === functionId)
    if (existingIndex < 0) return

    const updated = [...functions]
    updated[existingIndex] = {
      ...updated[existingIndex],
      healthCheck: { ...updated[existingIndex].healthCheck, ...updates },
    }
    updateFunctionalMapping({ functions: updated })
  }

  // Check if function is active
  const isFunctionActive = (functionId: string): boolean => {
    return functions.some(f => f.functionId === functionId && f.isActive)
  }

  // Get function detail
  const getFunctionDetail = (functionId: string): FunctionDetail | undefined => {
    return functions.find(f => f.functionId === functionId)
  }

  // Toggle category expanded state
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  // ==========================================================================
  // NAVIGATION HANDLERS
  // ==========================================================================

  const handleBack = () => {
    if (currentStep === 0) {
      router.push(`/interview/${story?.id}`)
    } else if (currentStep === 1 && detailsIndex > 0) {
      // Go to previous function in details
      setDetailsIndex(detailsIndex - 1)
    } else {
      setCurrentStep(currentStep - 1)
      if (currentStep === 1) {
        setDetailsIndex(activeFunctions.length - 1)
      }
    }
  }

  const handleNext = async () => {
    if (currentStep === 0) {
      // Moving from selection to details
      if (activeFunctions.length === 0) {
        // Can't proceed without any functions
        return
      }
      setDetailsIndex(0)
      setCurrentStep(1)
    } else if (currentStep === 1) {
      // In details step
      if (detailsIndex < activeFunctions.length - 1) {
        // Go to next function
        setDetailsIndex(detailsIndex + 1)
      } else {
        // Move to health check
        setCurrentStep(2)
      }
    } else {
      // Complete the module
      setIsSubmitting(true)
      try {
        await completeModule('functional')
        router.push(`/interview/${story?.id}`)
      } catch (err) {
        console.error('Failed to complete module:', err)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  // ==========================================================================
  // LOADING STATE
  // ==========================================================================

  if (isLoading || !story) {
    return (
      <div className="min-h-screen bg-marble-gradient flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  // Check if org type is set
  if (!orgType) {
    return (
      <div className="min-h-screen bg-marble-gradient">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-gold-500 mb-4" />
            <h1 className="font-serif text-2xl font-semibold text-marble-950 mb-2">
              Organization Type Required
            </h1>
            <p className="text-marble-600 mb-6">
              Please complete Basic Info first to set your organization type.
            </p>
            <Button
              variant="primary"
              onClick={() => router.push(`/interview/${story.id}/basic-info`)}
            >
              Go to Basic Info
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  // ==========================================================================
  // STEP 1: FUNCTION SELECTION
  // ==========================================================================

  const renderFunctionSelection = () => (
    <div className="space-y-4">
      <p className="text-marble-600 mb-6">
        Select all functions that existed in your organization at its peak.
        We&apos;ve pre-highlighted functions typical for{' '}
        <span className="font-medium text-marble-800">{ORG_TYPE_LABELS[orgType]}</span>{' '}
        organizations at the{' '}
        <span className="font-medium text-marble-800">{LIFECYCLE_STAGE_LABELS[stage]}</span>{' '}
        stage.
      </p>

      {categories.map(category => {
        const visibleFunctions = getVisibleFunctionsForCategory(orgType, category.id, stage)
        const selectedCount = visibleFunctions.filter(f => isFunctionActive(f.id)).length
        const isExpanded = expandedCategories.has(category.id)

        return (
          <div key={category.id} className="border border-marble-200 rounded-lg overflow-hidden">
            {/* Category header */}
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full flex items-center justify-between p-4 bg-marble-50 hover:bg-marble-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                {isExpanded ? (
                  <ChevronDown className="h-5 w-5 text-marble-500" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-marble-500" />
                )}
                <span className="font-medium text-marble-900">{category.name}</span>
              </div>
              <span className="text-sm text-marble-500">
                {selectedCount}/{visibleFunctions.length} selected
              </span>
            </button>

            {/* Functions list */}
            {isExpanded && (
              <div className="p-4 space-y-2">
                {visibleFunctions.map(func => {
                  const isActive = isFunctionActive(func.id)
                  const isDimmed = func.status === 'dimmed'

                  return (
                    <button
                      key={func.id}
                      onClick={() => toggleFunction(func.id, category.id)}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-md transition-colors',
                        isActive
                          ? 'bg-gold-50 border border-gold-200'
                          : isDimmed
                            ? 'bg-white border border-marble-200 opacity-60 hover:opacity-100'
                            : 'bg-white border border-marble-200 hover:border-marble-300'
                      )}
                    >
                      <div
                        className={cn(
                          'w-5 h-5 rounded flex items-center justify-center flex-shrink-0',
                          isActive
                            ? 'bg-gold-500 text-white'
                            : 'border border-marble-300'
                        )}
                      >
                        {isActive && <Check className="h-3.5 w-3.5" />}
                      </div>
                      <span
                        className={cn(
                          'text-sm',
                          isActive ? 'text-marble-900 font-medium' : 'text-marble-700'
                        )}
                      >
                        {func.name}
                      </span>
                      {isDimmed && !isActive && (
                        <span className="text-xs text-marble-400 ml-auto">
                          (less common)
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      {/* Summary */}
      <div className="mt-6 p-4 bg-marble-50 rounded-lg">
        <p className="text-sm text-marble-600">
          <span className="font-semibold text-marble-900">{activeFunctions.length}</span>{' '}
          functions selected
        </p>
      </div>
    </div>
  )

  // ==========================================================================
  // STEP 2: FUNCTION DETAILS
  // ==========================================================================

  const renderFunctionDetails = () => {
    if (!currentDetailFunction) {
      return (
        <div className="text-center py-8">
          <p className="text-marble-600">No functions selected. Please go back and select at least one function.</p>
        </div>
      )
    }

    const func = currentDetailFunction
    const funcName = func.customName || categories.flatMap(c => c.functions).find(f => f.id === func.functionId)?.name || func.functionId

    return (
      <div className="space-y-6">
        {/* Progress indicator for this step */}
        <div className="flex items-center justify-between text-sm text-marble-500 mb-4">
          <span>Function {detailsIndex + 1} of {activeFunctions.length}</span>
          <span className="font-medium text-marble-900">{funcName}</span>
        </div>

        {/* Execution Model */}
        <FormField label="How was this function handled?" htmlFor="execution-model">
          <div className="grid grid-cols-2 gap-2">
            {EXECUTION_MODELS.map(option => (
              <button
                key={option.value}
                onClick={() => updateFunctionDetail(func.functionId, { executionModel: option.value })}
                className={cn(
                  'p-3 rounded-md border text-sm transition-colors',
                  func.executionModel === option.value
                    ? 'bg-gold-50 border-gold-300 text-marble-900'
                    : 'border-marble-200 text-marble-700 hover:border-marble-300'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </FormField>

        {/* In-house specifics */}
        {(func.executionModel === 'in_house' || func.executionModel === 'hybrid') && (
          <>
            <FormField label="Headcount (people involved)" htmlFor="headcount">
              <Input
                id="headcount"
                type="number"
                min={0}
                value={func.headcount || ''}
                onChange={(e) => updateFunctionDetail(func.functionId, {
                  headcount: e.target.value ? parseInt(e.target.value) : null,
                })}
                placeholder="e.g., 3"
              />
            </FormField>

            <FormField label="Who owned this function?" htmlFor="owner-type">
              <div className="grid grid-cols-2 gap-2">
                {OWNER_TYPES.map(option => (
                  <button
                    key={option.value}
                    onClick={() => updateFunctionDetail(func.functionId, { ownerType: option.value })}
                    className={cn(
                      'p-3 rounded-md border text-sm transition-colors',
                      func.ownerType === option.value
                        ? 'bg-gold-50 border-gold-300 text-marble-900'
                        : 'border-marble-200 text-marble-700 hover:border-marble-300'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </FormField>
          </>
        )}

        {/* Outsourced specifics */}
        {(func.executionModel === 'outsourced' || func.executionModel === 'hybrid') && (
          <FormField label="Provider type" htmlFor="provider-type">
            <div className="grid grid-cols-2 gap-2">
              {PROVIDER_TYPES.map(option => (
                <button
                  key={option.value}
                  onClick={() => updateFunctionDetail(func.functionId, { providerType: option.value })}
                  className={cn(
                    'p-3 rounded-md border text-sm transition-colors',
                    func.providerType === option.value
                      ? 'bg-gold-50 border-gold-300 text-marble-900'
                      : 'border-marble-200 text-marble-700 hover:border-marble-300'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </FormField>
        )}

        {/* Common fields */}
        <FormField label="How formalized was this function?" htmlFor="formalization">
          <div className="space-y-2">
            {FORMALIZATION_LEVELS.map(option => (
              <button
                key={option.value}
                onClick={() => updateFunctionDetail(func.functionId, { formalization: option.value })}
                className={cn(
                  'w-full p-3 rounded-md border text-sm text-left transition-colors',
                  func.formalization === option.value
                    ? 'bg-gold-50 border-gold-300 text-marble-900'
                    : 'border-marble-200 text-marble-700 hover:border-marble-300'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="When did this start?" htmlFor="started-at">
            <select
              id="started-at"
              value={func.startedAt || ''}
              onChange={(e) => updateFunctionDetail(func.functionId, {
                startedAt: e.target.value as LifecycleStage || null,
              })}
              className="w-full rounded-md border border-marble-200 px-3 py-2 text-sm"
            >
              <option value="">Select...</option>
              {LIFECYCLE_STAGES.filter(s => s.value !== 'until_end').map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="When did it stop?" htmlFor="stopped-at">
            <select
              id="stopped-at"
              value={func.stoppedAt || ''}
              onChange={(e) => updateFunctionDetail(func.functionId, {
                stoppedAt: e.target.value as LifecycleStage | 'until_end' || null,
              })}
              className="w-full rounded-md border border-marble-200 px-3 py-2 text-sm"
            >
              <option value="">Select...</option>
              {LIFECYCLE_STAGES.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <FormField label="How satisfied were you with how this function worked?" htmlFor="satisfaction">
          <select
            id="satisfaction"
            value={func.satisfaction || ''}
            onChange={(e) => updateFunctionDetail(func.functionId, {
              satisfaction: e.target.value ? parseInt(e.target.value) as SatisfactionRating : null,
            })}
            className="w-full rounded-md border border-marble-200 px-3 py-2 text-sm"
          >
            <option value="">Select...</option>
            {SATISFACTION_RATINGS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>

        {/* Issue description if low satisfaction */}
        {func.satisfaction !== null && func.satisfaction <= 3 && (
          <FormField label="What was the issue?" htmlFor="issue-description">
            <Textarea
              id="issue-description"
              value={func.issueDescription || ''}
              onChange={(e) => updateFunctionDetail(func.functionId, { issueDescription: e.target.value })}
              placeholder="Describe what wasn't working..."
              rows={3}
            />
          </FormField>
        )}

        <FormField label="Any other comments?" htmlFor="comments" hint="Optional">
          <Textarea
            id="comments"
            value={func.comments || ''}
            onChange={(e) => updateFunctionDetail(func.functionId, { comments: e.target.value })}
            placeholder="Optional notes about this function..."
            rows={2}
          />
        </FormField>
      </div>
    )
  }

  // ==========================================================================
  // STEP 3: HEALTH CHECK
  // ==========================================================================

  const renderHealthCheck = () => (
    <div className="space-y-6">
      <p className="text-marble-600 mb-6">
        For each function, assess its health at the organization&apos;s peak. This helps us understand systemic patterns.
      </p>

      {activeFunctions.map((func, index) => {
        const funcName = func.customName || categories.flatMap(c => c.functions).find(f => f.id === func.functionId)?.name || func.functionId

        return (
          <div key={func.functionId} className="border border-marble-200 rounded-lg p-4">
            <h3 className="font-medium text-marble-900 mb-4">{funcName}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Turnover */}
              <div>
                <label className="text-sm font-medium text-marble-700 mb-2 block">Turnover</label>
                <div className="flex flex-wrap gap-2">
                  {TURNOVER_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => updateHealthCheck(func.functionId, { turnover: option.value })}
                      className={cn(
                        'px-3 py-1.5 rounded text-xs transition-colors',
                        func.healthCheck.turnover === option.value
                          ? 'bg-gold-500 text-white'
                          : 'bg-marble-100 text-marble-700 hover:bg-marble-200'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Staffing */}
              <div>
                <label className="text-sm font-medium text-marble-700 mb-2 block">Staffing</label>
                <div className="flex flex-wrap gap-2">
                  {STAFFING_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => updateHealthCheck(func.functionId, { staffing: option.value })}
                      className={cn(
                        'px-3 py-1.5 rounded text-xs transition-colors',
                        func.healthCheck.staffing === option.value
                          ? 'bg-gold-500 text-white'
                          : 'bg-marble-100 text-marble-700 hover:bg-marble-200'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Pressure */}
              <div>
                <label className="text-sm font-medium text-marble-700 mb-2 block">Budget Pressure</label>
                <div className="flex flex-wrap gap-2">
                  {BUDGET_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => updateHealthCheck(func.functionId, { budgetPressure: option.value })}
                      className={cn(
                        'px-3 py-1.5 rounded text-xs transition-colors',
                        func.healthCheck.budgetPressure === option.value
                          ? 'bg-gold-500 text-white'
                          : 'bg-marble-100 text-marble-700 hover:bg-marble-200'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality Issues */}
              <div>
                <label className="text-sm font-medium text-marble-700 mb-2 block">Quality Issues</label>
                <div className="flex flex-wrap gap-2">
                  {QUALITY_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => updateHealthCheck(func.functionId, { qualityIssues: option.value })}
                      className={cn(
                        'px-3 py-1.5 rounded text-xs transition-colors',
                        func.healthCheck.qualityIssues === option.value
                          ? 'bg-gold-500 text-white'
                          : 'bg-marble-100 text-marble-700 hover:bg-marble-200'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Leadership */}
              <div>
                <label className="text-sm font-medium text-marble-700 mb-2 block">Leadership</label>
                <div className="flex flex-wrap gap-2">
                  {LEADERSHIP_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => updateHealthCheck(func.functionId, { leadership: option.value })}
                      className={cn(
                        'px-3 py-1.5 rounded text-xs transition-colors',
                        func.healthCheck.leadership === option.value
                          ? 'bg-gold-500 text-white'
                          : 'bg-marble-100 text-marble-700 hover:bg-marble-200'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cross-function Conflict */}
              <div>
                <label className="text-sm font-medium text-marble-700 mb-2 block">Cross-function Conflict</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateHealthCheck(func.functionId, { crossFunctionConflict: false })}
                    className={cn(
                      'px-3 py-1.5 rounded text-xs transition-colors',
                      func.healthCheck.crossFunctionConflict === false
                        ? 'bg-gold-500 text-white'
                        : 'bg-marble-100 text-marble-700 hover:bg-marble-200'
                    )}
                  >
                    No
                  </button>
                  <button
                    onClick={() => updateHealthCheck(func.functionId, { crossFunctionConflict: true })}
                    className={cn(
                      'px-3 py-1.5 rounded text-xs transition-colors',
                      func.healthCheck.crossFunctionConflict === true
                        ? 'bg-gold-500 text-white'
                        : 'bg-marble-100 text-marble-700 hover:bg-marble-200'
                    )}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )

  // ==========================================================================
  // RENDER
  // ==========================================================================

  // Calculate effective step label for details
  const effectiveSteps = [...STEPS]
  if (currentStep === 1 && activeFunctions.length > 1) {
    effectiveSteps[1] = {
      ...STEPS[1],
      label: `Details (${detailsIndex + 1}/${activeFunctions.length})`,
    }
  }

  return (
    <WizardLayout
      steps={effectiveSteps}
      currentStep={currentStep}
      onBack={handleBack}
      onNext={handleNext}
      cancelHref={`/interview/${story.id}`}
      isLoading={isSubmitting}
      canGoNext={currentStep === 0 ? activeFunctions.length > 0 : true}
      nextLabel={
        currentStep === 1 && detailsIndex < activeFunctions.length - 1
          ? 'Next Function'
          : currentStep === STEPS.length - 1
            ? 'Complete'
            : 'Continue'
      }
      title="Functional Mapping"
      subtitle="Map your organization&apos;s structure at its peak"
    >
      {currentStep === 0 && renderFunctionSelection()}
      {currentStep === 1 && renderFunctionDetails()}
      {currentStep === 2 && renderHealthCheck()}
    </WizardLayout>
  )
}
