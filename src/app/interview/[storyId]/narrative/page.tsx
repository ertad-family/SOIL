"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useInterview } from "@/contexts/InterviewContext";
import { WizardLayout } from "@/components/layouts/wizard-layout";
import { FormField, FormSection } from "@/components/forms/form-field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NarrativeSection } from "@/types/interview";

// Wizard steps for Narrative module
const STEPS = [
  { id: "understanding", label: "Understanding", description: "What happened?" },
  { id: "hindsight", label: "Hindsight", description: "Looking back..." },
  { id: "lessons", label: "Lessons", description: "What did you learn?" },
  { id: "advice", label: "Advice", description: "For future founders" },
  { id: "legacy", label: "Legacy", description: "What remains" },
];

type SectionKey = "understanding" | "hindsight" | "lessons" | "advice" | "legacy";

/**
 * Module 6: Narrative
 * Captures meaning, lessons, and closure in founder's own words.
 */
export default function NarrativePage() {
  const router = useRouter();
  const { story, isLoading, updateNarrative, completeModule } = useInterview();

  const [currentStep, setCurrentStep] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Get current section key
  const currentSectionKey = STEPS[currentStep].id as SectionKey;

  // Get questions for current section
  const getCurrentQuestions = (): NarrativeSection[] => {
    if (!story) return [];
    return story.narrative.sections[currentSectionKey] || [];
  };

  // Update a question answer
  const updateAnswer = (questionId: string, answer: string) => {
    if (!story) return;

    const currentQuestions = getCurrentQuestions();
    const updatedQuestions = currentQuestions.map((q) =>
      q.questionId === questionId ? { ...q, answer, skipped: false } : q
    );

    updateNarrative({
      sections: {
        ...story.narrative.sections,
        [currentSectionKey]: updatedQuestions,
      },
    });
  };

  // Skip a question
  const skipQuestion = (questionId: string) => {
    if (!story) return;

    const currentQuestions = getCurrentQuestions();
    const updatedQuestions = currentQuestions.map((q) =>
      q.questionId === questionId ? { ...q, answer: null, skipped: true } : q
    );

    updateNarrative({
      sections: {
        ...story.narrative.sections,
        [currentSectionKey]: updatedQuestions,
      },
    });
  };

  // Replace [Organization Name] in questions
  const formatQuestion = (question: string): string => {
    const orgName = story?.basicInfo.organizationName || "your organization";
    return question.replace("[Organization Name]", orgName);
  };

  // Navigation handlers
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Scroll to top when moving to previous section
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push(`/interview/${story?.id}`);
    }
  };

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      // Scroll to top when moving to next section
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Complete the module
      setIsSubmitting(true);
      try {
        await completeModule("narrative");
        router.push(`/interview/${story?.id}`);
      } catch (err) {
        console.error("Failed to complete module:", err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isLoading || !story) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const questions = getCurrentQuestions();

  // Section-specific intro messages
  const sectionIntros: Record<SectionKey, string> = {
    understanding:
      "Looking at everything - your organization, the environment, your own journey...",
    hindsight: "With the clarity that only comes after...",
    lessons: "Every ending teaches something...",
    advice: "If someone was standing where you stood at the beginning...",
    legacy: "Before we close...",
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
      nextLabel={currentStep === STEPS.length - 1 ? "Complete" : "Continue"}
      title="Meaning & Lessons"
      subtitle="This is where your experience becomes wisdom"
    >
      <div className="space-y-8">
        {/* Section intro */}
        <p className="text-slate-400 italic">{sectionIntros[currentSectionKey]}</p>

        {/* Questions */}
        {questions.map((q, index) => (
          <div key={q.questionId} className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <FormField
                variant="dark"
                label={formatQuestion(q.question)}
                htmlFor={q.questionId}
                className="flex-1"
              >
                <Textarea
                  variant="dark"
                  id={q.questionId}
                  value={q.answer || ""}
                  onChange={(e) => updateAnswer(q.questionId, e.target.value)}
                  placeholder="Take your time with this one..."
                  rows={4}
                  disabled={q.skipped}
                  className={cn(q.skipped && "opacity-50")}
                />
              </FormField>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">
                {q.skipped ? "Skipped" : q.answer ? `${q.answer.length} characters` : "Optional"}
              </p>
              {!q.skipped && (
                <Button
                  variant="dark-ghost"
                  size="sm"
                  onClick={() => skipQuestion(q.questionId)}
                  className="text-slate-400 hover:text-slate-300"
                >
                  <SkipForward className="h-4 w-4 mr-1" />
                  Skip
                </Button>
              )}
              {q.skipped && (
                <Button
                  variant="dark-ghost"
                  size="sm"
                  onClick={() => updateAnswer(q.questionId, "")}
                  className="text-slate-400 hover:text-slate-300"
                >
                  Answer this
                </Button>
              )}
            </div>

            {/* Divider between questions */}
            {index < questions.length - 1 && <div className="border-t border-slate-700 pt-4" />}
          </div>
        ))}

        {/* Therapeutic affirmation at end of section */}
        {currentStep === STEPS.length - 1 && (
          <div className="mt-8 p-4 bg-gold-900/30 border border-gold-700 rounded-lg">
            <p className="text-slate-300 text-center">
              Thank you for sharing your story. What you&apos;ve written here will help others
              navigate their own journeys.
            </p>
          </div>
        )}
      </div>
    </WizardLayout>
  );
}
