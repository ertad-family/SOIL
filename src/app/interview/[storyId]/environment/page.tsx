"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useInterview } from "@/contexts/InterviewContext";
import { WizardLayout } from "@/components/layouts/wizard-layout";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/forms/form-field";
import { cn } from "@/lib/utils";
import { Plus, Trash2, Calendar, ChevronLeft, ChevronRight, Check } from "lucide-react";
import type {
  MarketResourceType,
  MarketResourceAssessment,
  OperatingConditionType,
  OperatingConditionAssessment,
  AccessibilityLevel,
  CostLevel,
  CompetitionIntensity,
  ChangeDirection,
  CostChangeDirection,
  CompetitionChangeDirection,
  ConditionState,
  ExternalEvent,
  ExternalEventCategory,
  Emotion,
} from "@/types/interview";

// =============================================================================
// WIZARD STEPS
// =============================================================================

const STEPS = [
  {
    id: "resources",
    label: "Market Resources",
    description: "Access to key competitive resources",
  },
  { id: "conditions", label: "Operating Conditions", description: "Business environment factors" },
  { id: "events", label: "External Events", description: "What happened in the world around you?" },
];

// =============================================================================
// MARKET RESOURCES CONFIGURATION
// =============================================================================

interface ResourceConfig {
  type: MarketResourceType;
  title: string;
  contextQuestion: string;
  contextPlaceholder: string;
  accessibilityQuestion: string;
  costQuestion: string;
  competitionQuestion: string;
}

const MARKET_RESOURCES: ResourceConfig[] = [
  {
    type: "customers",
    title: "Customers",
    contextQuestion: "Who was your target audience?",
    contextPlaceholder: "e.g., Small business owners, enterprise companies, young professionals...",
    accessibilityQuestion: "How easy was it to reach your target customers?",
    costQuestion: "How much did customer acquisition cost?",
    competitionQuestion: "How intense was competition for customers?",
  },
  {
    type: "talent",
    title: "Talent",
    contextQuestion: "What roles were you hiring for?",
    contextPlaceholder: "e.g., Software engineers, sales reps, designers...",
    accessibilityQuestion: "How difficult was it to find qualified people?",
    costQuestion: "How expensive was hiring and compensation?",
    competitionQuestion: "How fierce was competition for talent?",
  },
  {
    type: "suppliers",
    title: "Suppliers & Vendors",
    contextQuestion: "What services or goods did you need from vendors?",
    contextPlaceholder: "e.g., Cloud hosting, raw materials, logistics, legal services...",
    accessibilityQuestion: "How available were suitable suppliers?",
    costQuestion: "How expensive were supplier services?",
    competitionQuestion: "How much competition was there for supplier capacity?",
  },
  {
    type: "capital",
    title: "Capital & Funding",
    contextQuestion: "What did you need funding for?",
    contextPlaceholder: "e.g., Product development, marketing, hiring, equipment...",
    accessibilityQuestion: "How accessible was funding?",
    costQuestion: "How expensive was capital (interest, dilution)?",
    competitionQuestion: "How competitive was the funding environment?",
  },
];

// =============================================================================
// OPERATING CONDITIONS CONFIGURATION
// =============================================================================

interface ConditionConfig {
  type: OperatingConditionType;
  title: string;
  contextQuestion: string;
  contextPlaceholder: string;
  stateQuestion: string;
}

const OPERATING_CONDITIONS: ConditionConfig[] = [
  {
    type: "infrastructure",
    title: "Infrastructure",
    contextQuestion: "What infrastructure did you depend on?",
    contextPlaceholder: "e.g., Internet connectivity, cloud platforms, payment systems, APIs...",
    stateQuestion: "How reliable and adequate was the infrastructure you depended on?",
  },
  {
    type: "legal",
    title: "Legal Environment",
    contextQuestion: "What legal matters were most important to you?",
    contextPlaceholder: "e.g., Contract enforcement, IP protection, dispute resolution...",
    stateQuestion: "How supportive was the legal environment for your business?",
  },
  {
    type: "regulatory",
    title: "Regulatory Climate",
    contextQuestion: "What regulations affected you most?",
    contextPlaceholder: "e.g., Industry licenses, data protection, financial regulations...",
    stateQuestion: "How burdensome was regulatory compliance?",
  },
  {
    type: "tax",
    title: "Tax Environment",
    contextQuestion: "What was your tax situation?",
    contextPlaceholder: "e.g., Corporate taxes, payroll taxes, VAT, available incentives...",
    stateQuestion: "How favorable was the tax environment for your business?",
  },
];

// =============================================================================
// OPTIONS
// =============================================================================

const ACCESSIBILITY_OPTIONS: Array<{ value: AccessibilityLevel; label: string }> = [
  { value: "easy", label: "Easy" },
  { value: "moderate", label: "Moderate" },
  { value: "difficult", label: "Difficult" },
];

const ACCESSIBILITY_TREND_OPTIONS: Array<{ value: ChangeDirection; label: string }> = [
  { value: "improved", label: "Got easier" },
  { value: "stable", label: "Stable" },
  { value: "worsened", label: "Got harder" },
];

const COST_OPTIONS: Array<{ value: CostLevel; label: string }> = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Moderate" },
  { value: "high", label: "High" },
];

const COST_TREND_OPTIONS: Array<{ value: CostChangeDirection; label: string }> = [
  { value: "decreased", label: "Decreased" },
  { value: "stable", label: "Stable" },
  { value: "increased", label: "Increased" },
];

const COMPETITION_OPTIONS: Array<{ value: CompetitionIntensity; label: string }> = [
  { value: "low", label: "Low" },
  { value: "moderate", label: "Moderate" },
  { value: "intense", label: "Intense" },
];

const COMPETITION_TREND_OPTIONS: Array<{ value: CompetitionChangeDirection; label: string }> = [
  { value: "less", label: "Less intense" },
  { value: "stable", label: "Stable" },
  { value: "more", label: "More intense" },
];

const CONDITION_STATE_OPTIONS: Array<{ value: ConditionState; label: string }> = [
  { value: "favorable", label: "Favorable" },
  { value: "neutral", label: "Neutral" },
  { value: "challenging", label: "Challenging" },
];

const CONDITION_TREND_OPTIONS: Array<{ value: ChangeDirection; label: string }> = [
  { value: "improved", label: "Improving" },
  { value: "stable", label: "Stable" },
  { value: "worsened", label: "Worsening" },
];

// =============================================================================
// EXTERNAL EVENTS (kept from original, with fixed subtypes)
// =============================================================================

const EVENT_CATEGORIES: Array<{
  value: ExternalEventCategory;
  label: string;
  description: string;
}> = [
  { value: "market", label: "Market", description: "Market shifts, demand changes" },
  {
    value: "competition",
    label: "Competition",
    description: "Competitor moves, market consolidation",
  },
  { value: "regulation", label: "Regulation", description: "New laws, policy changes" },
  { value: "capital", label: "Capital", description: "Funding environment changes" },
  { value: "talent", label: "Talent", description: "Labor market shifts" },
  { value: "macro", label: "Macro", description: "Economic conditions, global events" },
  { value: "technology", label: "Technology", description: "Tech disruption, platform changes" },
  { value: "supplier", label: "Supplier", description: "Supply chain issues" },
  { value: "reputation", label: "Reputation", description: "PR issues, public perception" },
  {
    value: "hostile_actions",
    label: "Hostile Actions",
    description: "External attacks, legal threats",
  },
];

const EVENT_SUBTYPES: Record<ExternalEventCategory, string[]> = {
  market: [
    "Demand shift",
    "Market contraction",
    "Market saturation",
    "New market opportunity",
    "Other",
  ],
  competition: [
    "New competitor entered",
    "Competitor raised funding",
    "Price war",
    "Competitor exit",
    "Market consolidation",
    "Other",
  ],
  regulation: [
    "New law/regulation",
    "Compliance requirement",
    "License issue",
    "Enforcement action",
    "Other",
  ],
  capital: [
    "Funding winter",
    "Interest rate change",
    "Investor sentiment shift",
    "Funding opportunity",
    "Other",
  ],
  talent: [
    "Talent shortage",
    "Wage inflation",
    "Competitor poaching",
    "Remote work shift",
    "Other",
  ],
  macro: [
    "Economic recession",
    "Pandemic/health crisis",
    "Political instability",
    "War/armed conflict",
    "Currency crisis",
    "Natural disaster",
    "Other",
  ],
  technology: [
    "Platform change",
    "Tech disruption",
    "Infrastructure failure",
    "Cyberattack/data breach",
    "Platform banned account",
    "API/integration change",
    "Other",
  ],
  supplier: ["Supplier failure", "Supply shortage", "Price increase", "Quality issues", "Other"],
  reputation: [
    "Public scandal",
    "Viral negative PR",
    "Product safety incident",
    "Toxic culture exposure",
    "Positive press",
    "Other",
  ],
  hostile_actions: [
    "Hostile takeover attempt",
    "Legal attack by competitor",
    "Government pressure",
    "Patent troll",
    "Class action lawsuit",
    "IP theft",
    "Fraud by partner/client",
    "Extortion/blackmail",
    "Other",
  ],
};

const EMOTIONS: Array<{ value: Emotion; label: string }> = [
  { value: "distressed", label: "Distressed" },
  { value: "worried", label: "Worried" },
  { value: "neutral", label: "Neutral" },
  { value: "hopeful", label: "Hopeful" },
];

const LOOKING_BACK_OPTIONS = [
  { value: "major_factor", label: "This was a major factor in our closure" },
  { value: "could_survived", label: "We could have survived this alone" },
  { value: "adapted_well", label: "We adapted well to this" },
  { value: "outside_control", label: "This was completely outside our control" },
  { value: "should_seen", label: "We should have seen this coming" },
];

// =============================================================================
// HELPERS
// =============================================================================

function createEmptyEvent(): ExternalEvent {
  return {
    id: crypto.randomUUID(),
    date: "",
    category: "market",
    subType: "",
    emotionThen: null,
    emotionTags: [],
    lookingBack: null,
    responses: [],
    details: null,
  };
}

function createEmptyMarketResource(type: MarketResourceType): MarketResourceAssessment {
  return {
    resourceType: type,
    context: null,
    peakAccessibility: null,
    accessibilityTrend: null,
    peakCost: null,
    costTrend: null,
    peakCompetition: null,
    competitionTrend: null,
  };
}

function createEmptyOperatingCondition(type: OperatingConditionType): OperatingConditionAssessment {
  return {
    conditionType: type,
    context: null,
    peakState: null,
    trend: null,
  };
}

// =============================================================================
// OPTION BUTTON COMPONENT
// =============================================================================

interface OptionButtonProps<T extends string> {
  options: Array<{ value: T; label: string }>;
  value: T | null;
  onChange: (value: T) => void;
  size?: "sm" | "md";
}

function OptionButtons<T extends string>({
  options,
  value,
  onChange,
  size = "md",
}: OptionButtonProps<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-md border transition-colors",
            size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-base",
            value === option.value
              ? "bg-gold-500 border-gold-500 text-slate-900 font-medium"
              : "bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function EnvironmentPage() {
  const router = useRouter();
  const { story, isLoading, updateEnvironment, completeModule } = useInterview();

  // Main wizard step (0 = Resources, 1 = Conditions, 2 = Events)
  const [currentStep, setCurrentStep] = React.useState(0);
  // Sub-step within Resources (0-3) or Conditions (0-3)
  const [subStep, setSubStep] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [expandedEventId, setExpandedEventId] = React.useState<string | null>(null);

  // Get data from story
  const marketResources = story?.environment.marketResources ?? [];
  const operatingConditions = story?.environment.operatingConditions ?? [];
  const events = story?.environment.events ?? [];

  // ==========================================================================
  // MARKET RESOURCE HANDLERS
  // ==========================================================================

  const getMarketResource = (type: MarketResourceType): MarketResourceAssessment => {
    const existing = marketResources.find((r) => r.resourceType === type);
    return existing ?? createEmptyMarketResource(type);
  };

  const updateMarketResource = (
    type: MarketResourceType,
    updates: Partial<MarketResourceAssessment>
  ) => {
    if (!story) return;

    const existingIndex = marketResources.findIndex((r) => r.resourceType === type);
    const updatedResources = [...marketResources];

    if (existingIndex >= 0) {
      updatedResources[existingIndex] = { ...updatedResources[existingIndex], ...updates };
    } else {
      updatedResources.push({ ...createEmptyMarketResource(type), ...updates });
    }

    updateEnvironment({ marketResources: updatedResources });
  };

  // ==========================================================================
  // OPERATING CONDITION HANDLERS
  // ==========================================================================

  const getOperatingCondition = (type: OperatingConditionType): OperatingConditionAssessment => {
    const existing = operatingConditions.find((c) => c.conditionType === type);
    return existing ?? createEmptyOperatingCondition(type);
  };

  const updateOperatingCondition = (
    type: OperatingConditionType,
    updates: Partial<OperatingConditionAssessment>
  ) => {
    if (!story) return;

    const existingIndex = operatingConditions.findIndex((c) => c.conditionType === type);
    const updatedConditions = [...operatingConditions];

    if (existingIndex >= 0) {
      updatedConditions[existingIndex] = { ...updatedConditions[existingIndex], ...updates };
    } else {
      updatedConditions.push({ ...createEmptyOperatingCondition(type), ...updates });
    }

    updateEnvironment({ operatingConditions: updatedConditions });
  };

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  const addEvent = () => {
    if (!story) return;
    const newEvent = createEmptyEvent();
    updateEnvironment({ events: [...events, newEvent] });
    setExpandedEventId(newEvent.id);
  };

  const updateEvent = (eventId: string, updates: Partial<ExternalEvent>) => {
    if (!story) return;
    const updatedEvents = events.map((e) => (e.id === eventId ? { ...e, ...updates } : e));
    updateEnvironment({ events: updatedEvents });
  };

  const removeEvent = (eventId: string) => {
    if (!story) return;
    updateEnvironment({ events: events.filter((e) => e.id !== eventId) });
    if (expandedEventId === eventId) {
      setExpandedEventId(null);
    }
  };

  // ==========================================================================
  // NAVIGATION HANDLERS
  // ==========================================================================

  const handleBack = () => {
    if (currentStep === 0 && subStep > 0) {
      setSubStep(subStep - 1);
    } else if (currentStep === 1 && subStep > 0) {
      setSubStep(subStep - 1);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Reset to last sub-step of previous step
      if (currentStep === 1) setSubStep(MARKET_RESOURCES.length - 1);
      if (currentStep === 2) setSubStep(OPERATING_CONDITIONS.length - 1);
    } else {
      router.push(`/interview/${story?.id}`);
    }
  };

  const handleNext = async () => {
    if (currentStep === 0 && subStep < MARKET_RESOURCES.length - 1) {
      setSubStep(subStep + 1);
    } else if (currentStep === 1 && subStep < OPERATING_CONDITIONS.length - 1) {
      setSubStep(subStep + 1);
    } else if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      setSubStep(0);
    } else {
      // Complete the module
      setIsSubmitting(true);
      try {
        await completeModule("environment");
        router.push(`/interview/${story?.id}`);
      } catch (err) {
        console.error("Failed to complete module:", err);
      } finally {
        setIsSubmitting(false);
      }
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

  // ==========================================================================
  // RENDER: MARKET RESOURCE SCREEN
  // ==========================================================================

  const renderMarketResource = (resourceConfig: ResourceConfig) => {
    const resource = getMarketResource(resourceConfig.type);

    return (
      <div className="space-y-8">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2">
          {MARKET_RESOURCES.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                idx === subStep ? "bg-gold-500" : idx < subStep ? "bg-gold-500/50" : "bg-slate-600"
              )}
            />
          ))}
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-display font-medium text-marble-100">
            {resourceConfig.title}
          </h2>
          <p className="text-slate-400 mt-2">
            {subStep + 1} of {MARKET_RESOURCES.length} resources
          </p>
        </div>

        {/* Context question */}
        <div className="space-y-3">
          <label className="block text-lg font-medium text-marble-100">
            {resourceConfig.contextQuestion}
          </label>
          <Textarea
            variant="dark"
            value={resource.context || ""}
            onChange={(e) => updateMarketResource(resourceConfig.type, { context: e.target.value })}
            placeholder={resourceConfig.contextPlaceholder}
            rows={2}
          />
        </div>

        {/* Accessibility */}
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="block text-base font-medium text-marble-100">
              {resourceConfig.accessibilityQuestion}
            </label>
            <OptionButtons
              options={ACCESSIBILITY_OPTIONS}
              value={resource.peakAccessibility}
              onChange={(v) => updateMarketResource(resourceConfig.type, { peakAccessibility: v })}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm text-slate-400">How did this change over time?</label>
            <OptionButtons
              options={ACCESSIBILITY_TREND_OPTIONS}
              value={resource.accessibilityTrend}
              onChange={(v) => updateMarketResource(resourceConfig.type, { accessibilityTrend: v })}
              size="sm"
            />
          </div>
        </div>

        {/* Cost */}
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="block text-base font-medium text-marble-100">
              {resourceConfig.costQuestion}
            </label>
            <OptionButtons
              options={COST_OPTIONS}
              value={resource.peakCost}
              onChange={(v) => updateMarketResource(resourceConfig.type, { peakCost: v })}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm text-slate-400">How did this change over time?</label>
            <OptionButtons
              options={COST_TREND_OPTIONS}
              value={resource.costTrend}
              onChange={(v) => updateMarketResource(resourceConfig.type, { costTrend: v })}
              size="sm"
            />
          </div>
        </div>

        {/* Competition */}
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="block text-base font-medium text-marble-100">
              {resourceConfig.competitionQuestion}
            </label>
            <OptionButtons
              options={COMPETITION_OPTIONS}
              value={resource.peakCompetition}
              onChange={(v) => updateMarketResource(resourceConfig.type, { peakCompetition: v })}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm text-slate-400">How did this change over time?</label>
            <OptionButtons
              options={COMPETITION_TREND_OPTIONS}
              value={resource.competitionTrend}
              onChange={(v) => updateMarketResource(resourceConfig.type, { competitionTrend: v })}
              size="sm"
            />
          </div>
        </div>
      </div>
    );
  };

  // ==========================================================================
  // RENDER: OPERATING CONDITION SCREEN
  // ==========================================================================

  const renderOperatingCondition = (conditionConfig: ConditionConfig) => {
    const condition = getOperatingCondition(conditionConfig.type);

    return (
      <div className="space-y-8">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2">
          {OPERATING_CONDITIONS.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                idx === subStep ? "bg-gold-500" : idx < subStep ? "bg-gold-500/50" : "bg-slate-600"
              )}
            />
          ))}
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-display font-medium text-marble-100">
            {conditionConfig.title}
          </h2>
          <p className="text-slate-400 mt-2">
            {subStep + 1} of {OPERATING_CONDITIONS.length} conditions
          </p>
        </div>

        {/* Context question */}
        <div className="space-y-3">
          <label className="block text-lg font-medium text-marble-100">
            {conditionConfig.contextQuestion}
          </label>
          <Textarea
            variant="dark"
            value={condition.context || ""}
            onChange={(e) =>
              updateOperatingCondition(conditionConfig.type, { context: e.target.value })
            }
            placeholder={conditionConfig.contextPlaceholder}
            rows={2}
          />
        </div>

        {/* State assessment */}
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="block text-base font-medium text-marble-100">
              {conditionConfig.stateQuestion}
            </label>
            <OptionButtons
              options={CONDITION_STATE_OPTIONS}
              value={condition.peakState}
              onChange={(v) => updateOperatingCondition(conditionConfig.type, { peakState: v })}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm text-slate-400">How did this change over time?</label>
            <OptionButtons
              options={CONDITION_TREND_OPTIONS}
              value={condition.trend}
              onChange={(v) => updateOperatingCondition(conditionConfig.type, { trend: v })}
              size="sm"
            />
          </div>
        </div>
      </div>
    );
  };

  // ==========================================================================
  // RENDER: EVENTS
  // ==========================================================================

  const renderEvents = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-medium text-marble-100">External Events</h2>
        <p className="text-slate-400 mt-2">
          Add significant external events that affected your organization
        </p>
      </div>

      {/* Events list */}
      <div className="space-y-4">
        {events.map((event) => {
          const isExpanded = expandedEventId === event.id;
          const categoryInfo = EVENT_CATEGORIES.find((c) => c.value === event.category);

          return (
            <div key={event.id} className="border border-slate-600 rounded-lg overflow-hidden">
              {/* Event header */}
              <button
                onClick={() => setExpandedEventId(isExpanded ? null : event.id)}
                className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="font-medium text-marble-100">
                    {event.date || "No date"} —{" "}
                    {event.subType || categoryInfo?.label || "New Event"}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeEvent(event.id);
                  }}
                  className="text-slate-500 hover:text-error-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </button>

              {/* Event details */}
              {isExpanded && (
                <div className="p-4 space-y-4 bg-slate-800/50">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField variant="dark" label="Date" htmlFor={`date-${event.id}`}>
                      <Input
                        variant="dark"
                        id={`date-${event.id}`}
                        type="month"
                        value={event.date}
                        onChange={(e) => updateEvent(event.id, { date: e.target.value })}
                      />
                    </FormField>

                    <FormField variant="dark" label="Category" htmlFor={`category-${event.id}`}>
                      <select
                        id={`category-${event.id}`}
                        value={event.category}
                        onChange={(e) =>
                          updateEvent(event.id, {
                            category: e.target.value as ExternalEventCategory,
                            subType: "",
                          })
                        }
                        className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-marble-100"
                      >
                        {EVENT_CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </FormField>
                  </div>

                  <FormField variant="dark" label="What happened?" htmlFor={`subtype-${event.id}`}>
                    <select
                      id={`subtype-${event.id}`}
                      value={event.subType}
                      onChange={(e) => updateEvent(event.id, { subType: e.target.value })}
                      className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-marble-100"
                    >
                      <option value="">Select...</option>
                      {EVENT_SUBTYPES[event.category].map((subtype) => (
                        <option key={subtype} value={subtype}>
                          {subtype}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField
                    variant="dark"
                    label="How did you feel at the time?"
                    htmlFor={`emotion-${event.id}`}
                  >
                    <div className="flex flex-wrap gap-2">
                      {EMOTIONS.map((emotion) => (
                        <button
                          key={emotion.value}
                          onClick={() => updateEvent(event.id, { emotionThen: emotion.value })}
                          className={cn(
                            "px-3 py-1.5 rounded text-sm transition-colors",
                            event.emotionThen === emotion.value
                              ? "bg-gold-500 text-slate-900"
                              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                          )}
                        >
                          {emotion.label}
                        </button>
                      ))}
                    </div>
                  </FormField>

                  <FormField
                    variant="dark"
                    label="Looking back..."
                    htmlFor={`looking-back-${event.id}`}
                  >
                    <div className="space-y-2">
                      {LOOKING_BACK_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() =>
                            updateEvent(event.id, {
                              lookingBack: option.value as ExternalEvent["lookingBack"],
                            })
                          }
                          className={cn(
                            "w-full p-3 rounded-md border text-sm text-left transition-colors",
                            event.lookingBack === option.value
                              ? "bg-gold-900/30 border-gold-500 text-marble-100"
                              : "border-slate-600 text-slate-300 hover:border-slate-500"
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </FormField>

                  <FormField
                    variant="dark"
                    label="Details"
                    htmlFor={`details-${event.id}`}
                    hint="Optional"
                  >
                    <Textarea
                      variant="dark"
                      id={`details-${event.id}`}
                      value={event.details || ""}
                      onChange={(e) => updateEvent(event.id, { details: e.target.value })}
                      placeholder="Any additional context..."
                      rows={3}
                    />
                  </FormField>

                  {/* Done button */}
                  <div className="pt-4 flex justify-end">
                    <Button
                      variant="dark-secondary"
                      size="sm"
                      onClick={() => setExpandedEventId(null)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Done
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {events.length === 0 && (
          <div className="text-center py-8 border border-dashed border-slate-600 rounded-lg">
            <p className="text-slate-400 mb-4">No events added yet</p>
          </div>
        )}
      </div>

      {/* Add event button */}
      <Button variant="dark-secondary" onClick={addEvent} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Event
      </Button>
    </div>
  );

  // ==========================================================================
  // RENDER
  // ==========================================================================

  // Calculate display step and label
  const getNextLabel = () => {
    if (currentStep === 0 && subStep < MARKET_RESOURCES.length - 1) return "Next Resource";
    if (currentStep === 1 && subStep < OPERATING_CONDITIONS.length - 1) return "Next Condition";
    if (currentStep < STEPS.length - 1) return "Continue";
    return "Complete";
  };

  return (
    <WizardLayout
      variant="dark"
      steps={STEPS}
      currentStep={currentStep}
      onBack={handleBack}
      onNext={handleNext}
      cancelHref={`/interview/${story.id}`}
      isLoading={isSubmitting}
      nextLabel={getNextLabel()}
      title="Environment Analysis"
      subtitle="External conditions and events"
    >
      {currentStep === 0 && renderMarketResource(MARKET_RESOURCES[subStep])}
      {currentStep === 1 && renderOperatingCondition(OPERATING_CONDITIONS[subStep])}
      {currentStep === 2 && renderEvents()}
    </WizardLayout>
  );
}
