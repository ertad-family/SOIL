"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useInterview } from "@/contexts/InterviewContext";
import { WizardLayout } from "@/components/layouts/wizard-layout";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/forms/form-field";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Plus,
  Trash2,
  Calendar,
  Info,
} from "lucide-react";
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
  OrganizationType,
} from "@/types/interview";
import { getResourcesForOrgType, getResourceStatus } from "@/data/resource-matrix";

// =============================================================================
// WIZARD STEPS (single step)
// =============================================================================

const STEPS = [
  { id: "environment", label: "Environment", description: "External conditions and events" },
];

// =============================================================================
// MARKET RESOURCES CONFIGURATION
// =============================================================================

interface ResourceConfig {
  type: MarketResourceType;
  name: string;
  contextQuestion: string;
  contextPlaceholder: string;
  accessibilityQuestion: string;
  costQuestion: string;
  competitionQuestion: string;
}

const ALL_MARKET_RESOURCES: ResourceConfig[] = [
  {
    type: "customers",
    name: "Customers",
    contextQuestion: "Who was your target audience?",
    contextPlaceholder: "e.g., Small business owners, enterprise companies...",
    accessibilityQuestion: "How easy was it to reach your target customers?",
    costQuestion: "How much did customer acquisition cost?",
    competitionQuestion: "How intense was competition for customers?",
  },
  {
    type: "talent",
    name: "Talent",
    contextQuestion: "What roles were you hiring for?",
    contextPlaceholder: "e.g., Software engineers, sales reps, designers...",
    accessibilityQuestion: "How difficult was it to find qualified people?",
    costQuestion: "How expensive was hiring and compensation?",
    competitionQuestion: "How fierce was competition for talent?",
  },
  {
    type: "suppliers",
    name: "Suppliers & Vendors",
    contextQuestion: "What services or goods did you need from vendors?",
    contextPlaceholder: "e.g., Cloud hosting, raw materials, logistics...",
    accessibilityQuestion: "How available were suitable suppliers?",
    costQuestion: "How expensive were supplier services?",
    competitionQuestion: "How much competition was there for supplier capacity?",
  },
  {
    type: "capital",
    name: "Capital & Funding",
    contextQuestion: "What did you need funding for?",
    contextPlaceholder: "e.g., Product development, marketing, hiring...",
    accessibilityQuestion: "How accessible was funding?",
    costQuestion: "How expensive was capital (interest, dilution)?",
    competitionQuestion: "How competitive was the funding environment?",
  },
  // NGO-specific resources
  {
    type: "donors",
    name: "Donors",
    contextQuestion: "Who were your primary donor segments?",
    contextPlaceholder: "e.g., Individual donors, corporations, foundations...",
    accessibilityQuestion: "How easy was it to reach potential donors?",
    costQuestion: "How expensive was donor acquisition?",
    competitionQuestion: "How intense was competition for donor attention?",
  },
  {
    type: "volunteers",
    name: "Volunteers",
    contextQuestion: "What roles did volunteers fill?",
    contextPlaceholder: "e.g., Event support, program delivery, administration...",
    accessibilityQuestion: "How easy was it to recruit volunteers?",
    costQuestion: "What was the cost of volunteer management?",
    competitionQuestion: "How much competition was there for volunteers?",
  },
  {
    type: "grants",
    name: "Grants",
    contextQuestion: "What types of grants did you pursue?",
    contextPlaceholder: "e.g., Government grants, foundation grants, research funding...",
    accessibilityQuestion: "How accessible were grant opportunities?",
    costQuestion: "How expensive was grant writing and compliance?",
    competitionQuestion: "How competitive was the grant landscape?",
  },
  // Resources for various org types
  {
    type: "partners",
    name: "Partners",
    contextQuestion: "Who were your key partners?",
    contextPlaceholder: "e.g., Distribution partners, technology partners, strategic alliances...",
    accessibilityQuestion: "How easy was it to find and secure partners?",
    costQuestion: "How expensive were partnership arrangements?",
    competitionQuestion: "How much competition was there for partner relationships?",
  },
  {
    type: "technology",
    name: "Technology",
    contextQuestion: "What technology was critical to your operations?",
    contextPlaceholder: "e.g., Cloud infrastructure, APIs, development tools...",
    accessibilityQuestion: "How accessible was the technology you needed?",
    costQuestion: "How expensive was the technology stack?",
    competitionQuestion: "How much competition was there for technology resources?",
  },
  {
    type: "community",
    name: "Community",
    contextQuestion: "What community did you build or serve?",
    contextPlaceholder: "e.g., User community, developer community, industry network...",
    accessibilityQuestion: "How easy was it to build and engage your community?",
    costQuestion: "How expensive was community building?",
    competitionQuestion: "How much competition was there for community attention?",
  },
];

// =============================================================================
// OPERATING CONDITIONS CONFIGURATION
// =============================================================================

interface ConditionConfig {
  type: OperatingConditionType;
  name: string;
  contextQuestion: string;
  contextPlaceholder: string;
  stateQuestion: string;
}

const OPERATING_CONDITIONS: ConditionConfig[] = [
  {
    type: "infrastructure",
    name: "Infrastructure",
    contextQuestion: "What infrastructure did you depend on?",
    contextPlaceholder: "e.g., Internet, cloud platforms, payment systems...",
    stateQuestion: "How reliable and adequate was the infrastructure?",
  },
  {
    type: "legal",
    name: "Legal Environment",
    contextQuestion: "What legal matters were most important?",
    contextPlaceholder: "e.g., Contract enforcement, IP protection...",
    stateQuestion: "How supportive was the legal environment?",
  },
  {
    type: "regulatory",
    name: "Regulatory Climate",
    contextQuestion: "What regulations affected you most?",
    contextPlaceholder: "e.g., Industry licenses, data protection...",
    stateQuestion: "How burdensome was regulatory compliance?",
  },
  {
    type: "tax",
    name: "Tax Environment",
    contextQuestion: "What was your tax situation?",
    contextPlaceholder: "e.g., Corporate taxes, payroll taxes, incentives...",
    stateQuestion: "How favorable was the tax environment?",
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
// EXTERNAL EVENTS
// =============================================================================

const EVENT_CATEGORIES: Array<{
  value: ExternalEventCategory;
  label: string;
}> = [
  { value: "market", label: "Market" },
  { value: "competition", label: "Competition" },
  { value: "regulation", label: "Regulation" },
  { value: "capital", label: "Capital" },
  { value: "talent", label: "Talent" },
  { value: "macro", label: "Macro" },
  { value: "technology", label: "Technology" },
  { value: "supplier", label: "Supplier" },
  { value: "reputation", label: "Reputation" },
  { value: "hostile_actions", label: "Hostile Actions" },
];

// =============================================================================
// EVENT CONTEXT GUIDANCE (Issue #134)
// =============================================================================

const EXTERNAL_EVENTS_GUIDANCE = {
  why: "External events-market changes, regulatory shifts, competitive moves-often interact with internal dynamics to shape organizational outcomes. Understanding the external context helps identify which environmental factors correlate with different failure modes.",
  what: [
    "Market changes (demand shifts, new segments)",
    "Competitive moves (new entrants, pricing wars)",
    "Regulatory changes (new laws, compliance requirements)",
    "Macro events (economic downturns, pandemics)",
    "Technology shifts (disruptions, platform changes)",
    "Reputation events (press, reviews, viral moments)",
  ],
  tip: "Include events that affected your industry broadly, not just your organization specifically. The full environmental context helps us understand how external forces interact with internal decisions.",
};

const EVENT_SUBTYPES: Record<ExternalEventCategory, string[]> = {
  market: [
    "Demand shift",
    "Market contraction",
    "Market saturation",
    "New market opportunity",
    "Other",
  ],
  competition: [
    "New competitor",
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
    "Pandemic",
    "Political instability",
    "War/conflict",
    "Currency crisis",
    "Natural disaster",
    "Other",
  ],
  technology: [
    "Platform change",
    "Tech disruption",
    "Infrastructure failure",
    "Cyberattack",
    "API change",
    "Other",
  ],
  supplier: ["Supplier failure", "Supply shortage", "Price increase", "Quality issues", "Other"],
  reputation: [
    "Public scandal",
    "Viral negative PR",
    "Product safety incident",
    "Positive press",
    "Other",
  ],
  hostile_actions: [
    "Hostile takeover",
    "Legal attack",
    "Government pressure",
    "Patent troll",
    "Class action",
    "IP theft",
    "Fraud",
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
  { value: "major_factor", label: "Major factor in our closure" },
  { value: "could_survived", label: "We could have survived this alone" },
  { value: "adapted_well", label: "We adapted well to this" },
  { value: "outside_control", label: "Completely outside our control" },
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
    notApplicable: false,
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
    notApplicable: false,
    context: null,
    peakState: null,
    trend: null,
  };
}

// Check if resource has minimum required data
function isResourceComplete(resource: MarketResourceAssessment): boolean {
  if (resource.notApplicable) return true;
  return resource.peakAccessibility !== null;
}

// Check if condition has minimum required data
function isConditionComplete(condition: OperatingConditionAssessment): boolean {
  if (condition.notApplicable) return true;
  return condition.peakState !== null;
}

// Check if event has minimum required data
function isEventComplete(event: ExternalEvent): boolean {
  return event.date !== "" && event.subType !== "";
}

// =============================================================================
// OPTION BUTTON COMPONENT
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
// RADIO OPTIONS COMPONENT
// =============================================================================

interface RadioOptionProps<T extends string> {
  options: Array<{ value: T; label: string }>;
  value: T | null;
  onChange: (value: T) => void;
  name: string;
}

function RadioOptions<T extends string>({ options, value, onChange, name }: RadioOptionProps<T>) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            "flex items-center gap-2.5 cursor-pointer transition-colors",
            value === option.value ? "text-marble-100" : "text-slate-400 hover:text-slate-300"
          )}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="sr-only"
          />
          <span
            className={cn(
              "flex items-center justify-center rounded-full border-2 transition-colors w-5 h-5",
              value === option.value
                ? "border-gold-500 bg-gold-500"
                : "border-slate-500 bg-transparent"
            )}
          >
            {value === option.value && <span className="rounded-full bg-slate-900 w-2 h-2" />}
          </span>
          <span>{option.label}</span>
        </label>
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

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(
    new Set(["resources"]) // Start with resources expanded
  );
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set());
  const [expandedEventId, setExpandedEventId] = React.useState<string | null>(null);

  // Get data from story (memoized to prevent useMemo dependency issues)
  const marketResources = React.useMemo(
    () => story?.environment.marketResources ?? [],
    [story?.environment.marketResources]
  );
  const operatingConditions = React.useMemo(
    () => story?.environment.operatingConditions ?? [],
    [story?.environment.operatingConditions]
  );
  const events = story?.environment.events ?? [];

  // Get organization type for conditional resources (Issue #123)
  const organizationType: OrganizationType | null =
    story?.organization?.organizationType ?? story?.basicInfo?.organizationType ?? null;

  // Filter resources based on organization type
  const MARKET_RESOURCES = React.useMemo(() => {
    if (!organizationType) {
      // If no org type, show the basic 4 resources
      return ALL_MARKET_RESOURCES.filter((r) =>
        ["customers", "talent", "suppliers", "capital"].includes(r.type)
      );
    }
    // Filter by org type using the resource matrix
    const relevantResourceIds = getResourcesForOrgType(organizationType).map((r) => r.id);
    return ALL_MARKET_RESOURCES.filter((r) => relevantResourceIds.includes(r.type));
  }, [organizationType]);

  // ==========================================================================
  // MARKET RESOURCE HANDLERS
  // ==========================================================================

  const getMarketResource = (type: MarketResourceType): MarketResourceAssessment => {
    const existing = marketResources.find((r) => r.resourceType === type);
    return existing ?? createEmptyMarketResource(type);
  };

  const isResourceActive = (type: MarketResourceType): boolean => {
    const resource = marketResources.find((r) => r.resourceType === type);
    return resource !== undefined && !resource.notApplicable;
  };

  const toggleResource = (type: MarketResourceType) => {
    if (!story) return;

    const existingIndex = marketResources.findIndex((r) => r.resourceType === type);
    const isCurrentlyActive = existingIndex >= 0 && !marketResources[existingIndex].notApplicable;

    if (existingIndex >= 0) {
      const updated = [...marketResources];
      updated[existingIndex] = {
        ...updated[existingIndex],
        notApplicable: isCurrentlyActive,
      };
      updateEnvironment({ marketResources: updated });

      if (isCurrentlyActive) {
        setExpandedItems((prev) => {
          const next = new Set(prev);
          next.delete(type);
          return next;
        });
      } else {
        setExpandedItems((prev) => new Set([...prev, type]));
      }
    } else {
      const newResource = createEmptyMarketResource(type);
      updateEnvironment({ marketResources: [...marketResources, newResource] });
      setExpandedItems((prev) => new Set([...prev, type]));
    }
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

  const isConditionActive = (type: OperatingConditionType): boolean => {
    const condition = operatingConditions.find((c) => c.conditionType === type);
    return condition !== undefined && !condition.notApplicable;
  };

  const toggleCondition = (type: OperatingConditionType) => {
    if (!story) return;

    const existingIndex = operatingConditions.findIndex((c) => c.conditionType === type);
    const isCurrentlyActive =
      existingIndex >= 0 && !operatingConditions[existingIndex].notApplicable;

    if (existingIndex >= 0) {
      const updated = [...operatingConditions];
      updated[existingIndex] = {
        ...updated[existingIndex],
        notApplicable: isCurrentlyActive,
      };
      updateEnvironment({ operatingConditions: updated });

      if (isCurrentlyActive) {
        setExpandedItems((prev) => {
          const next = new Set(prev);
          next.delete(type);
          return next;
        });
      } else {
        setExpandedItems((prev) => new Set([...prev, type]));
      }
    } else {
      const newCondition = createEmptyOperatingCondition(type);
      updateEnvironment({ operatingConditions: [...operatingConditions, newCondition] });
      setExpandedItems((prev) => new Set([...prev, type]));
    }
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
    // Sort events by date (empty dates go to the end)
    const sortedEvents = [...updatedEvents].sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date.localeCompare(b.date);
    });
    updateEnvironment({ events: sortedEvents });
  };

  const removeEvent = (eventId: string) => {
    if (!story) return;
    updateEnvironment({ events: events.filter((e) => e.id !== eventId) });
    if (expandedEventId === eventId) {
      setExpandedEventId(null);
    }
  };

  // ==========================================================================
  // CATEGORY HANDLERS
  // ==========================================================================

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

  const markResourceNeverUsed = (type: MarketResourceType) => {
    if (!story) return;

    const existingIndex = marketResources.findIndex((r) => r.resourceType === type);
    const updatedResources = [...marketResources];

    if (existingIndex >= 0) {
      updatedResources[existingIndex] = {
        ...updatedResources[existingIndex],
        notApplicable: true,
        context: null,
        peakAccessibility: null,
        accessibilityTrend: null,
        peakCost: null,
        costTrend: null,
        peakCompetition: null,
        competitionTrend: null,
      };
    } else {
      const newResource = createEmptyMarketResource(type);
      newResource.notApplicable = true;
      updatedResources.push(newResource);
    }

    updateEnvironment({ marketResources: updatedResources });
    setExpandedItems((prev) => {
      const next = new Set(prev);
      next.delete(type);
      return next;
    });
  };

  const markConditionNeverUsed = (type: OperatingConditionType) => {
    if (!story) return;

    const existingIndex = operatingConditions.findIndex((c) => c.conditionType === type);
    const updatedConditions = [...operatingConditions];

    if (existingIndex >= 0) {
      updatedConditions[existingIndex] = {
        ...updatedConditions[existingIndex],
        notApplicable: true,
        context: null,
        peakState: null,
        trend: null,
      };
    } else {
      const newCondition = createEmptyOperatingCondition(type);
      newCondition.notApplicable = true;
      updatedConditions.push(newCondition);
    }

    updateEnvironment({ operatingConditions: updatedConditions });
    setExpandedItems((prev) => {
      const next = new Set(prev);
      next.delete(type);
      return next;
    });
  };

  const toggleItemExpand = (itemId: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const handleItemDone = (itemId: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
  };

  // ==========================================================================
  // PROGRESS CALCULATION
  // ==========================================================================

  const activeResourcesCount = marketResources.filter((r) => !r.notApplicable).length;
  const completedResourcesCount = marketResources.filter((r) => isResourceComplete(r)).length;
  const activeConditionsCount = operatingConditions.filter((c) => !c.notApplicable).length;
  const completedConditionsCount = operatingConditions.filter((c) => isConditionComplete(c)).length;

  const progressPercent = React.useMemo(() => {
    const totalItems = MARKET_RESOURCES.length + OPERATING_CONDITIONS.length;
    const handledResources = marketResources.filter(
      (r) => r.notApplicable || isResourceComplete(r)
    ).length;
    const handledConditions = operatingConditions.filter(
      (c) => c.notApplicable || isConditionComplete(c)
    ).length;
    return Math.round(((handledResources + handledConditions) / totalItems) * 100);
  }, [marketResources, operatingConditions, MARKET_RESOURCES.length]);

  // ==========================================================================
  // NAVIGATION HANDLERS
  // ==========================================================================

  const handleBack = () => {
    router.push(`/interview/${story?.id}`);
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await completeModule("environment");
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

  // ==========================================================================
  // RENDER RESOURCE DETAIL FORM
  // ==========================================================================

  const renderResourceForm = (config: ResourceConfig) => {
    const resource = getMarketResource(config.type);

    return (
      <div className="p-4 space-y-5 border-t border-slate-700 bg-slate-800/50">
        {/* Context */}
        <FormField variant="dark" label={config.contextQuestion}>
          <Textarea
            variant="dark"
            value={resource.context || ""}
            onChange={(e) => updateMarketResource(config.type, { context: e.target.value })}
            placeholder={config.contextPlaceholder}
            rows={2}
          />
        </FormField>

        {/* Accessibility */}
        <FormField variant="dark" label={config.accessibilityQuestion}>
          <RadioOptions
            name={`${config.type}-accessibility`}
            options={ACCESSIBILITY_OPTIONS}
            value={resource.peakAccessibility}
            onChange={(v) => updateMarketResource(config.type, { peakAccessibility: v })}
          />
          <div className="mt-3 flex items-center gap-3">
            <span className="text-sm text-slate-400">Over time:</span>
            <RadioOptions
              name={`${config.type}-accessibility-trend`}
              options={ACCESSIBILITY_TREND_OPTIONS}
              value={resource.accessibilityTrend}
              onChange={(v) => updateMarketResource(config.type, { accessibilityTrend: v })}
            />
          </div>
        </FormField>

        {/* Cost */}
        <FormField variant="dark" label={config.costQuestion}>
          <RadioOptions
            name={`${config.type}-cost`}
            options={COST_OPTIONS}
            value={resource.peakCost}
            onChange={(v) => updateMarketResource(config.type, { peakCost: v })}
          />
          <div className="mt-3 flex items-center gap-3">
            <span className="text-sm text-slate-400">Over time:</span>
            <RadioOptions
              name={`${config.type}-cost-trend`}
              options={COST_TREND_OPTIONS}
              value={resource.costTrend}
              onChange={(v) => updateMarketResource(config.type, { costTrend: v })}
            />
          </div>
        </FormField>

        {/* Competition */}
        <FormField variant="dark" label={config.competitionQuestion}>
          <RadioOptions
            name={`${config.type}-competition`}
            options={COMPETITION_OPTIONS}
            value={resource.peakCompetition}
            onChange={(v) => updateMarketResource(config.type, { peakCompetition: v })}
          />
          <div className="mt-3 flex items-center gap-3">
            <span className="text-sm text-slate-400">Over time:</span>
            <RadioOptions
              name={`${config.type}-competition-trend`}
              options={COMPETITION_TREND_OPTIONS}
              value={resource.competitionTrend}
              onChange={(v) => updateMarketResource(config.type, { competitionTrend: v })}
            />
          </div>
        </FormField>

        {/* Done button */}
        <div className="pt-2 flex justify-end">
          <Button variant="dark-secondary" size="sm" onClick={() => handleItemDone(config.type)}>
            <Check className="h-4 w-4 mr-2" />
            Done
          </Button>
        </div>
      </div>
    );
  };

  // ==========================================================================
  // RENDER CONDITION DETAIL FORM
  // ==========================================================================

  const renderConditionForm = (config: ConditionConfig) => {
    const condition = getOperatingCondition(config.type);

    return (
      <div className="p-4 space-y-5 border-t border-slate-700 bg-slate-800/50">
        {/* Context */}
        <FormField variant="dark" label={config.contextQuestion}>
          <Textarea
            variant="dark"
            value={condition.context || ""}
            onChange={(e) => updateOperatingCondition(config.type, { context: e.target.value })}
            placeholder={config.contextPlaceholder}
            rows={2}
          />
        </FormField>

        {/* State */}
        <FormField variant="dark" label={config.stateQuestion}>
          <RadioOptions
            name={`${config.type}-state`}
            options={CONDITION_STATE_OPTIONS}
            value={condition.peakState}
            onChange={(v) => updateOperatingCondition(config.type, { peakState: v })}
          />
          <div className="mt-3 flex items-center gap-3">
            <span className="text-sm text-slate-400">Over time:</span>
            <RadioOptions
              name={`${config.type}-trend`}
              options={CONDITION_TREND_OPTIONS}
              value={condition.trend}
              onChange={(v) => updateOperatingCondition(config.type, { trend: v })}
            />
          </div>
        </FormField>

        {/* Done button */}
        <div className="pt-2 flex justify-end">
          <Button variant="dark-secondary" size="sm" onClick={() => handleItemDone(config.type)}>
            <Check className="h-4 w-4 mr-2" />
            Done
          </Button>
        </div>
      </div>
    );
  };

  // ==========================================================================
  // RENDER EVENTS SECTION
  // ==========================================================================

  const renderEventsSection = () => (
    <div className="space-y-4">
      {/* Event Context Guidance */}
      <div className="bg-slate-800/30 border border-slate-600 rounded-lg p-4 mb-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-sm text-slate-300">
              <span className="font-medium text-gold-400">Why we ask: </span>
              {EXTERNAL_EVENTS_GUIDANCE.why}
            </p>
            <p className="text-sm text-slate-300">
              <span className="font-medium text-gold-400">What to include: </span>
              {EXTERNAL_EVENTS_GUIDANCE.what.join(", ")}.
            </p>
            <p className="text-sm text-slate-400 italic">{EXTERNAL_EVENTS_GUIDANCE.tip}</p>
          </div>
        </div>
      </div>

      {events.map((event) => {
        const isExpanded = expandedEventId === event.id;
        const categoryInfo = EVENT_CATEGORIES.find((c) => c.value === event.category);

        return (
          <div key={event.id} className="border border-slate-600 rounded-lg overflow-hidden">
            {/* Event header */}
            <div className="flex items-center justify-between p-3 bg-slate-800">
              <button
                onClick={() => setExpandedEventId(isExpanded ? null : event.id)}
                className="flex items-center gap-3 flex-1 hover:opacity-80 transition-opacity"
              >
                <Calendar className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-marble-100">
                  {event.date || "No date"} - {event.subType || categoryInfo?.label || "New Event"}
                </span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => removeEvent(event.id)}
                  className="p-1 text-slate-500 hover:text-error-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setExpandedEventId(isExpanded ? null : event.id)}
                  className="p-1 hover:bg-slate-700 rounded"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Event details */}
            {isExpanded && (
              <div className="p-4 space-y-4 bg-slate-800/50 border-t border-slate-700">
                <div className="grid grid-cols-2 gap-4">
                  <FormField variant="dark" label="Date">
                    <Input
                      variant="dark"
                      type="month"
                      value={event.date}
                      onChange={(e) => updateEvent(event.id, { date: e.target.value })}
                    />
                  </FormField>

                  <FormField variant="dark" label="Category">
                    <select
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

                <FormField variant="dark" label="What happened?">
                  <select
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

                <FormField variant="dark" label="How did you feel at the time?">
                  <RadioOptions
                    name={`event-${event.id}-emotion`}
                    options={EMOTIONS}
                    value={event.emotionThen}
                    onChange={(v) => updateEvent(event.id, { emotionThen: v })}
                  />
                </FormField>

                <FormField variant="dark" label="Looking back...">
                  <div className="space-y-2">
                    {LOOKING_BACK_OPTIONS.map((option) => (
                      <OptionButton
                        key={option.value}
                        selected={event.lookingBack === option.value}
                        onClick={() =>
                          updateEvent(event.id, {
                            lookingBack: option.value as ExternalEvent["lookingBack"],
                          })
                        }
                        className="w-full text-left"
                      >
                        {option.label}
                      </OptionButton>
                    ))}
                  </div>
                </FormField>

                <FormField variant="dark" label="Details" hint="Optional">
                  <Textarea
                    variant="dark"
                    value={event.details || ""}
                    onChange={(e) => updateEvent(event.id, { details: e.target.value })}
                    placeholder="Any additional context..."
                    rows={2}
                  />
                </FormField>

                <div className="pt-2 flex justify-end">
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
        <div className="text-center py-6 border border-dashed border-slate-600 rounded-lg">
          <p className="text-slate-400 text-sm">No events added yet</p>
        </div>
      )}

      <Button variant="dark-secondary" onClick={addEvent} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Event
      </Button>
    </div>
  );

  // ==========================================================================
  // RENDER MAIN CONTENT
  // ==========================================================================

  const renderContent = () => (
    <div className="space-y-4">
      {/* Progress summary */}
      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg mb-4">
        <span className="text-sm text-slate-400">
          <span className="font-medium text-marble-100">
            {activeResourcesCount + activeConditionsCount}
          </span>{" "}
          items assessed
        </span>
        <span className="text-sm text-slate-400">
          <span className="font-medium text-marble-100">{events.length}</span> events recorded
        </span>
      </div>

      {/* Market Resources Category */}
      <div className="border border-slate-700 rounded-lg overflow-hidden">
        <div className="flex items-center bg-slate-800/50">
          <button
            onClick={() => toggleCategory("resources")}
            className="flex-1 flex items-center gap-3 p-4 hover:bg-slate-800 transition-colors"
          >
            {expandedCategories.has("resources") ? (
              <ChevronDown className="h-5 w-5 text-slate-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-slate-400" />
            )}
            <span className="font-medium text-marble-100">Market Resources</span>
            {completedResourcesCount === MARKET_RESOURCES.length && (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            )}
          </button>
          <div className="flex items-center gap-3 pr-4">
            <span className="text-sm text-slate-400">
              {completedResourcesCount}/{MARKET_RESOURCES.length}
            </span>
          </div>
        </div>

        {expandedCategories.has("resources") && (
          <div className="divide-y divide-slate-700">
            {MARKET_RESOURCES.map((config) => {
              const resource = getMarketResource(config.type);
              const isNeverUsed = resource.notApplicable === true;
              const isActive =
                !isNeverUsed && marketResources.some((r) => r.resourceType === config.type);
              const isComplete = isResourceComplete(resource);
              const isExpanded = expandedItems.has(config.type);

              return (
                <div key={config.type}>
                  <div
                    className={cn(
                      "w-full flex items-center gap-3 p-3 transition-colors",
                      isNeverUsed
                        ? "opacity-60"
                        : isActive
                          ? "bg-gold-500/10"
                          : "hover:bg-slate-800/50"
                    )}
                  >
                    <button
                      onClick={() => !isNeverUsed && toggleResource(config.type)}
                      className={cn(
                        "w-5 h-5 rounded flex items-center justify-center flex-shrink-0",
                        isNeverUsed
                          ? "border border-slate-600 bg-slate-700"
                          : isActive
                            ? "bg-gold-500 text-slate-900"
                            : "border border-slate-600 hover:border-slate-500"
                      )}
                    >
                      {isActive && !isNeverUsed && <Check className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      onClick={() => {
                        if (isNeverUsed) return;
                        if (isActive) {
                          toggleItemExpand(config.type);
                        } else {
                          toggleResource(config.type);
                        }
                      }}
                      className={cn(
                        "text-sm flex-1 text-left",
                        isNeverUsed
                          ? "text-slate-500 line-through"
                          : isActive
                            ? "text-marble-100 font-medium"
                            : "text-slate-300 hover:text-slate-200"
                      )}
                    >
                      {config.name}
                    </button>
                    {isNeverUsed ? (
                      <button
                        onClick={() => updateMarketResource(config.type, { notApplicable: false })}
                        className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300 hover:bg-slate-600"
                      >
                        Undo
                      </button>
                    ) : (
                      <>
                        {isActive && isComplete && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                        )}
                        {isActive && !isComplete && (
                          <span className="text-xs text-slate-500">needs details</span>
                        )}
                        <button
                          onClick={() => markResourceNeverUsed(config.type)}
                          className="text-xs px-2 py-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-700"
                        >
                          Never used
                        </button>
                        {isActive && (
                          <button
                            onClick={() => toggleItemExpand(config.type)}
                            className="p-1 hover:bg-slate-700 rounded"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-slate-400" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-slate-400" />
                            )}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  {isActive && !isNeverUsed && isExpanded && renderResourceForm(config)}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Operating Conditions Category */}
      <div className="border border-slate-700 rounded-lg overflow-hidden">
        <div className="flex items-center bg-slate-800/50">
          <button
            onClick={() => toggleCategory("conditions")}
            className="flex-1 flex items-center gap-3 p-4 hover:bg-slate-800 transition-colors"
          >
            {expandedCategories.has("conditions") ? (
              <ChevronDown className="h-5 w-5 text-slate-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-slate-400" />
            )}
            <span className="font-medium text-marble-100">Operating Conditions</span>
            {completedConditionsCount === OPERATING_CONDITIONS.length && (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            )}
          </button>
          <div className="flex items-center gap-3 pr-4">
            <span className="text-sm text-slate-400">
              {completedConditionsCount}/{OPERATING_CONDITIONS.length}
            </span>
          </div>
        </div>

        {expandedCategories.has("conditions") && (
          <div className="divide-y divide-slate-700">
            {OPERATING_CONDITIONS.map((config) => {
              const condition = getOperatingCondition(config.type);
              const isNeverUsed = condition.notApplicable === true;
              const isActive =
                !isNeverUsed && operatingConditions.some((c) => c.conditionType === config.type);
              const isComplete = isConditionComplete(condition);
              const isExpanded = expandedItems.has(config.type);

              return (
                <div key={config.type}>
                  <div
                    className={cn(
                      "w-full flex items-center gap-3 p-3 transition-colors",
                      isNeverUsed
                        ? "opacity-60"
                        : isActive
                          ? "bg-gold-500/10"
                          : "hover:bg-slate-800/50"
                    )}
                  >
                    <button
                      onClick={() => !isNeverUsed && toggleCondition(config.type)}
                      className={cn(
                        "w-5 h-5 rounded flex items-center justify-center flex-shrink-0",
                        isNeverUsed
                          ? "border border-slate-600 bg-slate-700"
                          : isActive
                            ? "bg-gold-500 text-slate-900"
                            : "border border-slate-600 hover:border-slate-500"
                      )}
                    >
                      {isActive && !isNeverUsed && <Check className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      onClick={() => {
                        if (isNeverUsed) return;
                        if (isActive) {
                          toggleItemExpand(config.type);
                        } else {
                          toggleCondition(config.type);
                        }
                      }}
                      className={cn(
                        "text-sm flex-1 text-left",
                        isNeverUsed
                          ? "text-slate-500 line-through"
                          : isActive
                            ? "text-marble-100 font-medium"
                            : "text-slate-300 hover:text-slate-200"
                      )}
                    >
                      {config.name}
                    </button>
                    {isNeverUsed ? (
                      <button
                        onClick={() =>
                          updateOperatingCondition(config.type, { notApplicable: false })
                        }
                        className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300 hover:bg-slate-600"
                      >
                        Undo
                      </button>
                    ) : (
                      <>
                        {isActive && isComplete && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                        )}
                        {isActive && !isComplete && (
                          <span className="text-xs text-slate-500">needs details</span>
                        )}
                        <button
                          onClick={() => markConditionNeverUsed(config.type)}
                          className="text-xs px-2 py-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-700"
                        >
                          Not relevant
                        </button>
                        {isActive && (
                          <button
                            onClick={() => toggleItemExpand(config.type)}
                            className="p-1 hover:bg-slate-700 rounded"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-slate-400" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-slate-400" />
                            )}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  {isActive && !isNeverUsed && isExpanded && renderConditionForm(config)}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* External Events Category */}
      <div className="border border-slate-700 rounded-lg overflow-hidden">
        <div className="flex items-center bg-slate-800/50">
          <button
            onClick={() => toggleCategory("events")}
            className="flex-1 flex items-center gap-3 p-4 hover:bg-slate-800 transition-colors"
          >
            {expandedCategories.has("events") ? (
              <ChevronDown className="h-5 w-5 text-slate-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-slate-400" />
            )}
            <span className="font-medium text-marble-100">External Events</span>
            {events.length > 0 && events.every(isEventComplete) && (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            )}
          </button>
          <div className="flex items-center gap-3 pr-4">
            <span className="text-sm text-slate-400">
              {events.filter(isEventComplete).length}/{events.length} events
            </span>
          </div>
        </div>

        {expandedCategories.has("events") && (
          <div className="p-4 border-t border-slate-700">{renderEventsSection()}</div>
        )}
      </div>
    </div>
  );

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <WizardLayout
      variant="dark"
      steps={STEPS}
      currentStep={0}
      onBack={handleBack}
      onNext={handleComplete}
      cancelHref={`/interview/${story.id}`}
      isLoading={isSubmitting}
      nextLabel="Complete"
      title="Environment Analysis"
      subtitle="External conditions and events"
      progress={progressPercent}
    >
      {renderContent()}
    </WizardLayout>
  );
}
