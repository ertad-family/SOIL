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
import { AlertTriangle, Plus, Trash2, Calendar, Check } from "lucide-react";
import { detectPatterns, getPatternQuestions } from "@/lib/interview-utils";
import type {
  DetectedPattern,
  InternalEvent,
  InternalEventCategory,
  Emotion,
} from "@/types/interview";

// =============================================================================
// WIZARD STEPS
// =============================================================================

const STEPS = [
  {
    id: "patterns",
    label: "Patterns",
    description: "We noticed some patterns in your organization",
  },
  { id: "events", label: "Internal Events", description: "What happened from peak to closure?" },
];

// =============================================================================
// CONSTANTS
// =============================================================================

const PATTERN_LABELS: Record<DetectedPattern, { title: string; description: string }> = {
  systemic_turnover: {
    title: "Systemic Turnover",
    description: "High turnover across multiple functions",
  },
  widespread_understaffing: {
    title: "Widespread Understaffing",
    description: "Multiple areas were consistently understaffed",
  },
  budget_squeeze: {
    title: "Budget Squeeze",
    description: "Budget pressure affected multiple functions",
  },
  quality_erosion: {
    title: "Quality Erosion",
    description: "Quality issues emerged across the organization",
  },
  leadership_crisis: {
    title: "Leadership Crisis",
    description: "Leadership gaps in multiple areas",
  },
  internal_friction: {
    title: "Internal Friction",
    description: "Cross-function conflicts were common",
  },
  concentrated_failure: {
    title: "Concentrated Failure",
    description: "One function had multiple severe problems",
  },
  cascade_signature: {
    title: "Cascade Signature",
    description: "Problems in one area led to problems in another",
  },
};

const EVENT_CATEGORIES: Array<{
  value: InternalEventCategory;
  label: string;
  description: string;
}> = [
  { value: "team", label: "Team", description: "Departures, conflicts, morale issues" },
  { value: "product", label: "Product", description: "Failures, pivots, quality problems" },
  { value: "operations", label: "Operations", description: "Process breakdowns, supply issues" },
  {
    value: "growth_pains",
    label: "Growth Pains",
    description: "Scaling challenges, culture changes",
  },
  {
    value: "hostile_actions",
    label: "Hostile Actions",
    description: "Sabotage, theft, legal issues",
  },
  { value: "closure", label: "Closure", description: "Decision to close, wind-down events" },
];

const EVENT_SUBTYPES: Record<InternalEventCategory, string[]> = {
  team: [
    "Key person departure",
    "Mass resignation",
    "Conflict between team members",
    "Morale collapse",
    "Failed hire",
    "Layoffs",
    "Other",
  ],
  product: [
    "Product failure",
    "Major pivot",
    "Quality crisis",
    "Technical debt crisis",
    "Lost product-market fit",
    "Other",
  ],
  operations: [
    "Process breakdown",
    "System failure",
    "Vendor/supplier issue",
    "Compliance failure",
    "Other",
  ],
  growth_pains: [
    "Scaling too fast",
    "Scaling too slow",
    "Culture clash",
    "Communication breakdown",
    "Lost focus",
    "Other",
  ],
  hostile_actions: ["Internal sabotage", "IP theft", "Legal action", "Fraud discovered", "Other"],
  closure: [
    "Decision to close",
    "Final layoffs",
    "Asset liquidation",
    "Legal dissolution",
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
  { value: "turning_point", label: "This was a turning point" },
  { value: "warning_missed", label: "This was a warning I missed" },
  { value: "right_call", label: "I made the right call" },
  { value: "outside_control", label: "This was outside my control" },
  { value: "mistake_learned", label: "I learned from this mistake" },
];

// =============================================================================
// HELPER: Create empty event
// =============================================================================

function createEmptyEvent(): InternalEvent {
  return {
    id: crypto.randomUUID(),
    date: "",
    category: "team",
    subType: "",
    emotionThen: null,
    emotionTags: [],
    lookingBack: null,
    details: null,
  };
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function DynamicPage() {
  const router = useRouter();
  const { story, isLoading, updateDynamicPicture, completeModule } = useInterview();

  const [currentStep, setCurrentStep] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [expandedEventId, setExpandedEventId] = React.useState<string | null>(null);

  // Detect patterns from functional mapping data
  const detectedPatterns = React.useMemo(() => {
    if (!story) return [];
    return detectPatterns(story.functionalMapping.functions);
  }, [story]);

  // Pattern questions based on detected patterns
  const patternQuestions = React.useMemo(() => {
    const questions: Array<{ patternId: DetectedPattern; questionId: string; question: string }> =
      [];
    detectedPatterns.forEach((pattern) => {
      const patternQs = getPatternQuestions(pattern);
      patternQs.forEach((q) => {
        questions.push({
          patternId: pattern,
          questionId: q.id,
          question: q.question,
        });
      });
    });
    return questions;
  }, [detectedPatterns]);

  // Get events from story
  const events = story?.dynamicPicture.events ?? [];

  // Get stored pattern answers
  const patternAnswers = story?.dynamicPicture.patternQuestions ?? [];

  // ==========================================================================
  // PATTERN HANDLERS
  // ==========================================================================

  const getPatternAnswer = (questionId: string): string => {
    const answer = patternAnswers.find((a) => a.question === questionId);
    return answer?.answer ?? "";
  };

  const updatePatternAnswer = (
    questionId: string,
    question: string,
    patternId: DetectedPattern,
    answer: string
  ) => {
    if (!story) return;

    const existingIndex = patternAnswers.findIndex((a) => a.question === questionId);
    const updatedAnswers = [...patternAnswers];

    if (existingIndex >= 0) {
      updatedAnswers[existingIndex] = { ...updatedAnswers[existingIndex], answer };
    } else {
      updatedAnswers.push({
        patternId,
        question: questionId,
        answer,
      });
    }

    updateDynamicPicture({
      detectedPatterns,
      patternQuestions: updatedAnswers,
    });
  };

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  const addEvent = () => {
    if (!story) return;
    const newEvent = createEmptyEvent();
    updateDynamicPicture({ events: [...events, newEvent] });
    setExpandedEventId(newEvent.id);
  };

  const updateEvent = (eventId: string, updates: Partial<InternalEvent>) => {
    if (!story) return;
    const updatedEvents = events.map((e) => (e.id === eventId ? { ...e, ...updates } : e));
    updateDynamicPicture({ events: updatedEvents });
  };

  const removeEvent = (eventId: string) => {
    if (!story) return;
    updateDynamicPicture({ events: events.filter((e) => e.id !== eventId) });
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
        await completeModule("dynamic");
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
  // STEP 1: PATTERNS
  // ==========================================================================

  const renderPatterns = () => {
    if (detectedPatterns.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-slate-400 mb-4">
            Based on your functional mapping, we didn&apos;t detect any specific patterns.
          </p>
          <p className="text-sm text-slate-500">
            You can continue to add internal events that shaped your organization&apos;s journey.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <p className="text-slate-400">
          Based on your functional mapping, we noticed some patterns. Help us understand them
          better.
        </p>

        {detectedPatterns.map((pattern) => {
          const patternInfo = PATTERN_LABELS[pattern];
          const questions = patternQuestions.filter((q) => q.patternId === pattern);

          return (
            <div key={pattern} className="border border-slate-600 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="h-5 w-5 text-gold-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-marble-100">{patternInfo.title}</h3>
                  <p className="text-sm text-slate-400">{patternInfo.description}</p>
                </div>
              </div>

              <div className="space-y-4 ml-8">
                {questions.map((q) => (
                  <FormField
                    variant="dark"
                    key={q.questionId}
                    label={q.question}
                    htmlFor={q.questionId}
                  >
                    <Textarea
                      variant="dark"
                      id={q.questionId}
                      value={getPatternAnswer(q.questionId)}
                      onChange={(e) =>
                        updatePatternAnswer(q.questionId, q.question, pattern, e.target.value)
                      }
                      placeholder="Share your thoughts..."
                      rows={2}
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
  // STEP 2: EVENTS
  // ==========================================================================

  const renderEvents = () => (
    <div className="space-y-6">
      <p className="text-slate-400">
        Add significant internal events that happened from your organization&apos;s peak to its
        closure.
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
                            category: e.target.value as InternalEventCategory,
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
                              lookingBack: option.value as InternalEvent["lookingBack"],
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

  // Skip patterns step if no patterns detected
  const effectiveSteps = detectedPatterns.length === 0 ? [STEPS[1]] : STEPS;

  const effectiveCurrentStep = detectedPatterns.length === 0 ? 0 : currentStep;

  return (
    <WizardLayout
      variant="dark"
      steps={effectiveSteps}
      currentStep={effectiveCurrentStep}
      onBack={handleBack}
      onNext={handleNext}
      cancelHref={`/interview/${story.id}`}
      isLoading={isSubmitting}
      nextLabel={effectiveCurrentStep === effectiveSteps.length - 1 ? "Complete" : "Continue"}
      title="Dynamic Picture"
      subtitle="What happened from peak to closure?"
    >
      {detectedPatterns.length > 0 && currentStep === 0 && renderPatterns()}
      {(detectedPatterns.length === 0 || currentStep === 1) && renderEvents()}
    </WizardLayout>
  );
}
