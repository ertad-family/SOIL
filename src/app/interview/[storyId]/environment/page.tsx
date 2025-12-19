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
import { Plus, Trash2, Calendar, Globe, Check } from "lucide-react";
import type {
  ExternalEvent,
  ExternalEventCategory,
  ResourceAssessment,
  ResourceType,
  AvailabilityLevel,
  CostLevel,
  CompetitionLevel,
  TrendChange,
  Emotion,
} from "@/types/interview";

// =============================================================================
// WIZARD STEPS
// =============================================================================

const STEPS = [
  { id: "resources", label: "Resources", description: "How was access to key resources?" },
  { id: "events", label: "External Events", description: "What happened in the world around you?" },
];

// =============================================================================
// CONSTANTS
// =============================================================================

const RESOURCE_TYPES: Array<{
  value: ResourceType;
  label: string;
  description: string;
  hasCompetition: boolean;
}> = [
  {
    value: "customers",
    label: "Customers",
    description: "Access to target market",
    hasCompetition: true,
  },
  { value: "talent", label: "Talent", description: "Hiring and retention", hasCompetition: true },
  {
    value: "suppliers",
    label: "Suppliers",
    description: "Vendors and service providers",
    hasCompetition: true,
  },
  {
    value: "capital",
    label: "Capital",
    description: "Funding and financing",
    hasCompetition: true,
  },
  {
    value: "infrastructure",
    label: "Infrastructure",
    description: "Physical and digital infrastructure",
    hasCompetition: false,
  },
  {
    value: "legal_justice",
    label: "Legal & Justice",
    description: "Legal system accessibility",
    hasCompetition: false,
  },
  {
    value: "regulatory",
    label: "Regulatory",
    description: "Regulatory environment",
    hasCompetition: false,
  },
  {
    value: "tax_burden",
    label: "Tax Burden",
    description: "Tax obligations and incentives",
    hasCompetition: false,
  },
];

const AVAILABILITY_LEVELS: Array<{ value: AvailabilityLevel; label: string }> = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const COST_LEVELS: Array<{ value: CostLevel; label: string }> = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const COMPETITION_LEVELS: Array<{ value: CompetitionLevel; label: string }> = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const TREND_OPTIONS: Array<{ value: TrendChange; label: string }> = [
  { value: "improved", label: "Improved" },
  { value: "stable", label: "Stable" },
  { value: "declined", label: "Declined" },
];

const EVENT_CATEGORIES: Array<{
  value: ExternalEventCategory;
  label: string;
  description: string;
}> = [
  { value: "market", label: "Market", description: "Market shifts, demand changes" },
  {
    value: "competition",
    label: "Competition",
    description: "New competitors, market consolidation",
  },
  { value: "regulation", label: "Regulation", description: "New laws, policy changes" },
  { value: "capital", label: "Capital", description: "Funding environment changes" },
  { value: "talent", label: "Talent", description: "Labor market shifts" },
  { value: "macro", label: "Macro", description: "Economic conditions, pandemics" },
  { value: "technology", label: "Technology", description: "Tech disruption, new platforms" },
  { value: "supplier", label: "Supplier", description: "Supply chain issues" },
  { value: "reputation", label: "Reputation", description: "PR crises, public perception" },
  { value: "hostile_actions", label: "Hostile Actions", description: "External attacks, lawsuits" },
];

const EVENT_SUBTYPES: Record<ExternalEventCategory, string[]> = {
  market: [
    "Market contraction",
    "Demand shift",
    "New market opportunity",
    "Market saturation",
    "Other",
  ],
  competition: [
    "New competitor entered",
    "Competitor raised funding",
    "Price war",
    "Market consolidation",
    "Competitor failure",
    "Other",
  ],
  regulation: [
    "New regulation",
    "Regulation change",
    "Enforcement action",
    "Compliance requirement",
    "Other",
  ],
  capital: [
    "Funding drought",
    "Interest rate change",
    "Investor pullback",
    "Funding opportunity",
    "Other",
  ],
  talent: [
    "Talent shortage",
    "Wage inflation",
    "Remote work shift",
    "Layoffs in industry",
    "Other",
  ],
  macro: [
    "Economic recession",
    "Pandemic/health crisis",
    "Political instability",
    "Currency fluctuation",
    "Natural disaster",
    "Other",
  ],
  technology: [
    "Platform change",
    "New technology emerged",
    "Technology obsolescence",
    "API/integration change",
    "Other",
  ],
  supplier: ["Supplier failure", "Supply shortage", "Price increase", "Quality issues", "Other"],
  reputation: ["PR crisis", "Social media backlash", "Industry scandal", "Positive press", "Other"],
  hostile_actions: [
    "Lawsuit",
    "Cyberattack",
    "Smear campaign",
    "Patent troll",
    "Government action",
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
// HELPER: Create empty event
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

function createEmptyResourceAssessment(resourceType: ResourceType): ResourceAssessment {
  return {
    resourceType,
    peakAvailability: null,
    peakCost: null,
    peakCompetition: null,
    availabilityChange: null,
    costChange: null,
    competitionChange: null,
    whatChanged: null,
  };
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function EnvironmentPage() {
  const router = useRouter();
  const { story, isLoading, updateEnvironment, completeModule } = useInterview();

  const [currentStep, setCurrentStep] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [expandedEventId, setExpandedEventId] = React.useState<string | null>(null);

  // Get data from story
  const events = story?.environment.events ?? [];
  const resourceAssessments = story?.environment.resourceAssessments ?? [];

  // ==========================================================================
  // RESOURCE HANDLERS
  // ==========================================================================

  const getResourceAssessment = (resourceType: ResourceType): ResourceAssessment => {
    const existing = resourceAssessments.find((r) => r.resourceType === resourceType);
    return existing ?? createEmptyResourceAssessment(resourceType);
  };

  const updateResourceAssessment = (
    resourceType: ResourceType,
    updates: Partial<ResourceAssessment>
  ) => {
    if (!story) return;

    const existingIndex = resourceAssessments.findIndex((r) => r.resourceType === resourceType);
    const updatedAssessments = [...resourceAssessments];

    if (existingIndex >= 0) {
      updatedAssessments[existingIndex] = { ...updatedAssessments[existingIndex], ...updates };
    } else {
      updatedAssessments.push({ ...createEmptyResourceAssessment(resourceType), ...updates });
    }

    updateEnvironment({ resourceAssessments: updatedAssessments });
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
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push(`/interview/${story?.id}`);
    }
  };

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
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
  // STEP 1: RESOURCES
  // ==========================================================================

  const renderResources = () => (
    <div className="space-y-6">
      <p className="text-slate-400">
        Rate your access to key resources at your organization&apos;s peak, and how they changed
        over time.
      </p>

      {RESOURCE_TYPES.map((resource) => {
        const assessment = getResourceAssessment(resource.value);

        return (
          <div key={resource.value} className="border border-slate-600 rounded-lg p-4">
            <div className="flex items-start gap-3 mb-4">
              <Globe className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-marble-100">{resource.label}</h3>
                <p className="text-sm text-slate-400">{resource.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-8">
              {/* Availability */}
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Availability at Peak
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABILITY_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      onClick={() =>
                        updateResourceAssessment(resource.value, { peakAvailability: level.value })
                      }
                      className={cn(
                        "px-3 py-1.5 rounded text-xs transition-colors",
                        assessment.peakAvailability === level.value
                          ? "bg-gold-500 text-slate-900"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      )}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
                <div className="mt-2">
                  <label className="text-xs text-slate-500 mb-1 block">Change over time</label>
                  <div className="flex flex-wrap gap-1">
                    {TREND_OPTIONS.map((trend) => (
                      <button
                        key={trend.value}
                        onClick={() =>
                          updateResourceAssessment(resource.value, {
                            availabilityChange: trend.value,
                          })
                        }
                        className={cn(
                          "px-2 py-1 rounded text-xs transition-colors",
                          assessment.availabilityChange === trend.value
                            ? "bg-slate-500 text-white"
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                        )}
                      >
                        {trend.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cost */}
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Cost at Peak
                </label>
                <div className="flex flex-wrap gap-2">
                  {COST_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      onClick={() =>
                        updateResourceAssessment(resource.value, { peakCost: level.value })
                      }
                      className={cn(
                        "px-3 py-1.5 rounded text-xs transition-colors",
                        assessment.peakCost === level.value
                          ? "bg-gold-500 text-slate-900"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      )}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
                <div className="mt-2">
                  <label className="text-xs text-slate-500 mb-1 block">Change over time</label>
                  <div className="flex flex-wrap gap-1">
                    {TREND_OPTIONS.map((trend) => (
                      <button
                        key={trend.value}
                        onClick={() =>
                          updateResourceAssessment(resource.value, { costChange: trend.value })
                        }
                        className={cn(
                          "px-2 py-1 rounded text-xs transition-colors",
                          assessment.costChange === trend.value
                            ? "bg-slate-500 text-white"
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                        )}
                      >
                        {trend.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Competition (only for applicable resources) */}
              {resource.hasCompetition && (
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Competition at Peak
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COMPETITION_LEVELS.map((level) => (
                      <button
                        key={level.value}
                        onClick={() =>
                          updateResourceAssessment(resource.value, { peakCompetition: level.value })
                        }
                        className={cn(
                          "px-3 py-1.5 rounded text-xs transition-colors",
                          assessment.peakCompetition === level.value
                            ? "bg-gold-500 text-slate-900"
                            : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                        )}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2">
                    <label className="text-xs text-slate-500 mb-1 block">Change over time</label>
                    <div className="flex flex-wrap gap-1">
                      {TREND_OPTIONS.map((trend) => (
                        <button
                          key={trend.value}
                          onClick={() =>
                            updateResourceAssessment(resource.value, {
                              competitionChange: trend.value,
                            })
                          }
                          className={cn(
                            "px-2 py-1 rounded text-xs transition-colors",
                            assessment.competitionChange === trend.value
                              ? "bg-slate-500 text-white"
                              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                          )}
                        >
                          {trend.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  // ==========================================================================
  // STEP 2: EVENTS
  // ==========================================================================

  const renderEvents = () => (
    <div className="space-y-6">
      <p className="text-slate-400">
        Add significant external events that affected your organization.
      </p>

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
                    {event.date || "No date"} -{" "}
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

  return (
    <WizardLayout
      variant="dark"
      steps={STEPS}
      currentStep={currentStep}
      onBack={handleBack}
      onNext={handleNext}
      cancelHref={`/interview/${story.id}`}
      isLoading={isSubmitting}
      nextLabel={currentStep === STEPS.length - 1 ? "Complete" : "Continue"}
      title="Environment Analysis"
      subtitle="External conditions and events"
    >
      {currentStep === 0 && renderResources()}
      {currentStep === 1 && renderEvents()}
    </WizardLayout>
  );
}
