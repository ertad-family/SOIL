"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Sparkles, RefreshCw, BookOpen, Lightbulb } from "lucide-react";
import type { Story } from "@/types/interview";
import { MODULES } from "@/types/interview";

interface SummaryCardProps {
  story: Story;
  onRefresh: () => Promise<void>;
}

/**
 * SummaryCard displays the AI-generated, privacy-stripped summary of the story.
 * Shows different states: idle (no chapters), generating, ready, failed.
 */
export function SummaryCard({ story, onRefresh }: SummaryCardProps) {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const completedChaptersCount = story.completedModules.filter((m) => m !== "basic_info").length;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const isGenerating = story.aiSummaryStatus === "generating" || isRefreshing;

  // Get the name of the last processed chapter for display
  const getLastChapterName = () => {
    if (!story.aiSummary?.lastModuleProcessed) return null;
    const chapter = MODULES.find((m) => m.id === story.aiSummary?.lastModuleProcessed);
    return chapter?.name || null;
  };

  // State: No chapters completed yet
  if (completedChaptersCount === 0 && !story.aiSummary) {
    return (
      <Card variant="dark" className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpen className="h-5 w-5 text-slate-400" />
          </div>
          <div>
            <h3 className="font-medium text-marble-100 mb-1">What We&apos;re Learning</h3>
            <p className="text-sm text-slate-400">
              Complete your first chapter to see what we&apos;re learning from your story. Each
              chapter adds new insights to your organizational narrative.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // State: Generating
  if (isGenerating) {
    return (
      <Card variant="dark" className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-gold-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Spinner size="sm" className="text-gold-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-marble-100 mb-1 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gold-400" />
              Analyzing Your Story...
            </h3>
            <p className="text-sm text-slate-400">
              We&apos;re processing your chapters to understand your organization&apos;s journey.
              This takes a moment.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // State: Failed
  if (story.aiSummaryStatus === "failed" && !story.aiSummary) {
    return (
      <Card variant="dark" className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-5 w-5 text-slate-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-marble-100 mb-1">Summary Processing</h3>
            <p className="text-sm text-slate-400 mb-3">
              Your summary will update after your next chapter is complete.
            </p>
            <Button
              variant="dark-outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Try Again
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // State: Ready with summary
  if (story.aiSummary) {
    const lastChapterName = getLastChapterName();

    return (
      <Card variant="dark" className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gold-900/50 rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-gold-400" />
            </div>
            <div>
              <h3 className="font-medium text-marble-100">What We&apos;re Learning</h3>
              {lastChapterName && (
                <p className="text-xs text-slate-500">Updated after {lastChapterName}</p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-slate-400 hover:text-marble-100"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {/* Summary text */}
        <div className="text-sm text-slate-300 leading-relaxed mb-4">{story.aiSummary.text}</div>

        {/* Key facts */}
        {story.aiSummary.keyFacts && story.aiSummary.keyFacts.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-gold-400" />
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Key Observations
              </span>
            </div>
            <ul className="space-y-1.5">
              {story.aiSummary.keyFacts.slice(0, 4).map((fact, index) => (
                <li key={index} className="text-sm text-slate-400 flex items-start gap-2">
                  <span className="text-gold-500 mt-1">•</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Metadata badges */}
        {(story.aiSummary.lifespanMonths || story.aiSummary.peakTeamSize) && (
          <div className="mt-4 pt-4 border-t border-slate-700 flex flex-wrap gap-2">
            {story.aiSummary.lifespanMonths && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-700 text-slate-300">
                {story.aiSummary.lifespanMonths < 12
                  ? `${story.aiSummary.lifespanMonths} months`
                  : `${Math.round(story.aiSummary.lifespanMonths / 12)} years`}{" "}
                lifespan
              </span>
            )}
            {story.aiSummary.peakTeamSize && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-700 text-slate-300">
                {story.aiSummary.peakTeamSize} at peak
              </span>
            )}
            {story.aiSummary.closurePattern && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-700 text-slate-300">
                {story.aiSummary.closurePattern.replace(/_/g, " ")}
              </span>
            )}
          </div>
        )}
      </Card>
    );
  }

  // Fallback: No summary yet but chapters are complete (edge case)
  return (
    <Card variant="dark" className="p-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
          <Sparkles className="h-5 w-5 text-slate-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-marble-100 mb-1">Processing Your Story</h3>
          <p className="text-sm text-slate-400 mb-3">
            We&apos;re analyzing {completedChaptersCount} completed chapter
            {completedChaptersCount !== 1 ? "s" : ""}.
          </p>
          <Button variant="dark-outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Generate Summary
          </Button>
        </div>
      </div>
    </Card>
  );
}
