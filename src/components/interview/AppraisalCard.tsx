"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import type { Story } from "@/types/interview";
import { MODULES } from "@/types/interview";
import { useTestimonialPrompt } from "@/contexts/TestimonialPromptContext";
import { trackEvent } from "@/lib/analytics";

interface AppraisalCardProps {
  story: Story;
}

/**
 * AppraisalCard displays personalized motivational messages to the founder
 * after completing a chapter. Shows affirmation and anticipation for next chapter.
 * Only appears when there's an appraisal to show.
 */
export function AppraisalCard({ story }: AppraisalCardProps) {
  const { showPrompt, hasFeedbackBeenGiven } = useTestimonialPrompt();
  const appraisal = story.aiSummary?.appraisal;
  const lastModuleProcessed = story.aiSummary?.lastModuleProcessed;

  // Track appraisal feedback rating (thumbs up/down)
  const [appraisalRating, setAppraisalRating] = React.useState<"positive" | "negative" | null>(
    null
  );

  // Get the name of the module that was processed when this appraisal was generated
  const processedChapterName = lastModuleProcessed
    ? MODULES.find((m) => m.id === lastModuleProcessed)?.name || null
    : null;

  // Calculate the actual next incomplete chapter (excluding basic_info)
  const getNextIncompleteChapter = () => {
    const displayedModules = MODULES.filter((m) => m.id !== "basic_info");
    const nextIncomplete = displayedModules.find((m) => !story.completedModules.includes(m.id));
    return nextIncomplete?.name || null;
  };

  const nextChapterName = getNextIncompleteChapter();
  const allChaptersComplete = !nextChapterName;

  // Check if feedback has already been given for chapter completion
  const feedbackAlreadyGiven = hasFeedbackBeenGiven("chapter_completion");

  // Handle feedback button click
  const handleFeedbackClick = () => {
    showPrompt({
      type: "chapter_completion",
      contextId: story.id,
      contextMetadata: {
        chapter: lastModuleProcessed,
        chapterName: processedChapterName,
        organizationName: story.basicInfo?.organizationName,
      },
      title: "Your feedback is crucial",
      description: `You're one of the first 100 founders to use SOIL. How was your experience with ${processedChapterName || "this chapter"}?`,
    });
  };

  // Handle appraisal rating (thumbs up/down)
  const handleAppraisalRating = (rating: "positive" | "negative") => {
    setAppraisalRating(rating);
    trackEvent("appraisal_feedback", {
      category: "engagement",
      properties: {
        rating,
        storyId: story.id,
        chapterId: lastModuleProcessed,
        chapterName: processedChapterName,
        affirmationText: appraisal?.affirmation?.substring(0, 100), // First 100 chars for context
      },
    });
  };

  // Only show when there's an actual appraisal to display
  if (!appraisal) {
    return null;
  }

  return (
    <Card variant="dark-cenotaph" className="p-5 overflow-hidden">
      <div className="relative space-y-3">
        {/* Header */}
        <div>
          <h3 className="font-serif text-base font-medium text-marble-100">
            {allChaptersComplete
              ? "Story Complete"
              : `${processedChapterName || "Chapter"} Complete`}
          </h3>
        </div>

        {/* Affirmation message */}
        <p className="text-slate-300 text-sm leading-relaxed">{appraisal.affirmation}</p>

        {/* Appraisal rating - thumbs up/down */}
        <div className="flex items-center gap-1 pt-1">
          <span className="text-xs text-slate-500 mr-2">Was this helpful?</span>
          <button
            onClick={() => handleAppraisalRating("positive")}
            disabled={appraisalRating !== null}
            className={`p-1.5 rounded transition-colors ${
              appraisalRating === "positive"
                ? "text-green-400 bg-green-400/10"
                : appraisalRating === null
                  ? "text-slate-500 hover:text-green-400 hover:bg-green-400/10"
                  : "text-slate-600 cursor-default"
            }`}
            aria-label="Helpful"
          >
            <ThumbsUp className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleAppraisalRating("negative")}
            disabled={appraisalRating !== null}
            className={`p-1.5 rounded transition-colors ${
              appraisalRating === "negative"
                ? "text-red-400 bg-red-400/10"
                : appraisalRating === null
                  ? "text-slate-500 hover:text-red-400 hover:bg-red-400/10"
                  : "text-slate-600 cursor-default"
            }`}
            aria-label="Not helpful"
          >
            <ThumbsDown className="h-3.5 w-3.5" />
          </button>
          {appraisalRating && (
            <span className="text-xs text-slate-500 ml-2">Thanks for the feedback</span>
          )}
        </div>

        {/* Feedback prompt - only show if not already given */}
        {!feedbackAlreadyGiven && (
          <div className="pt-3 border-t border-slate-700/50">
            <p className="text-xs text-slate-400 mb-2">
              You&apos;re one of the first 100 founders. Your feedback is crucial.
            </p>
            <Button
              variant="dark-ghost"
              size="sm"
              onClick={handleFeedbackClick}
              className="w-full justify-center"
            >
              <MessageSquare className="h-3.5 w-3.5 mr-2" />
              Share Your Feedback
            </Button>
          </div>
        )}

        {/* Anticipation for next chapter - only if there's a next chapter */}
        {nextChapterName && appraisal.anticipation && (
          <div className="pt-2 border-t border-slate-700/50">
            <div className="flex items-start gap-2 text-gold-400">
              <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{appraisal.anticipation}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
