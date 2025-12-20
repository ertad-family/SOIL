"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useInterview } from "@/contexts/InterviewContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  ArrowRight,
  ChevronLeft,
  Clock,
  Building2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MODULES } from "@/types/interview";
import { ORG_TYPE_LABELS } from "@/data/function-matrix";
import { SummaryCard } from "@/components/interview/SummaryCard";

/**
 * Story Overview Dashboard (Dark Theme, Two-Column Layout)
 * Shows completion progress and allows navigation to modules.
 */
export default function StoryOverviewPage() {
  const router = useRouter();
  const {
    story,
    isLoading,
    error,
    progress,
    isModuleComplete,
    canNavigateToModule,
    navigateToModule,
    refreshSummary,
  } = useInterview();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Card variant="dark" className="p-8 max-w-md text-center">
          <h2 className="font-serif text-xl font-medium text-marble-100 mb-2">Story Not Found</h2>
          <p className="text-slate-400 mb-4">{error || "Unable to load this story."}</p>
          <Button variant="dark-primary" onClick={() => router.push("/interview")}>
            Return to Stories
          </Button>
        </Card>
      </div>
    );
  }

  const orgName = story.basicInfo.organizationName || "Your Story";
  const orgType = story.basicInfo.organizationType;
  const orgTypeLabel = orgType ? ORG_TYPE_LABELS[orgType] : null;

  // Filter out basic_info from displayed modules (it's handled by the organization wizard)
  const displayedModules = MODULES.filter((m) => m.id !== "basic_info");

  // Find the next incomplete module (excluding basic_info)
  const nextIncompleteModule = displayedModules.find((m) => !isModuleComplete(m.id));

  // Calculate total estimated time remaining
  const remainingMinutes = displayedModules
    .filter((m) => !isModuleComplete(m.id))
    .reduce((sum, m) => sum + m.estimatedMinutes, 0);

  const handleContinue = () => {
    if (nextIncompleteModule) {
      navigateToModule(nextIncompleteModule.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/account"
          className="inline-flex items-center text-sm text-slate-400 hover:text-marble-100 mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to account
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-marble-100 tracking-wide">
                {orgName}
              </h1>
              {orgTypeLabel && (
                <p className="mt-1 text-slate-400 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {orgTypeLabel}
                </p>
              )}
            </div>

            {/* Status badge */}
            {story.status === "coined" ? (
              <Badge variant="dark-success" size="md">
                <Check className="h-3.5 w-3.5 mr-1.5" />
                Completed
              </Badge>
            ) : (
              <Badge variant="dark-warning" size="md">
                In Progress
              </Badge>
            )}
          </div>
        </div>

        {/* Two-column layout: Chapters (left) | Summary + Progress (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left column - Chapters (60%) */}
          <div className="lg:col-span-3">
            <h2 className="font-medium text-marble-100 mb-4">Chapters</h2>
            <div className="space-y-3">
              {displayedModules.map((module, index) => {
                const isComplete = isModuleComplete(module.id);
                const canNavigate = canNavigateToModule(module.id);
                const isCurrent = story.currentModule === module.id;

                return (
                  <button
                    key={module.id}
                    onClick={() => canNavigate && navigateToModule(module.id)}
                    disabled={!canNavigate}
                    className={cn(
                      "w-full text-left p-4 rounded-lg border transition-all",
                      canNavigate
                        ? "hover:border-gold-500/50 hover:bg-slate-800/80 cursor-pointer"
                        : "cursor-not-allowed opacity-60",
                      isComplete
                        ? "bg-emerald-900/20 border-emerald-700/50"
                        : isCurrent
                          ? "bg-gold-900/20 border-gold-700/50"
                          : "bg-slate-800/50 border-slate-700"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      {/* Step number / check */}
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                          isComplete
                            ? "bg-emerald-600 text-white"
                            : isCurrent
                              ? "bg-gold-600 text-white"
                              : "bg-slate-700 text-slate-400"
                        )}
                      >
                        {isComplete ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>

                      {/* Chapter info */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className={cn(
                            "font-medium",
                            isComplete ? "text-emerald-400" : "text-marble-100"
                          )}
                        >
                          {module.name}
                        </h3>
                        <p className="text-sm text-slate-400 truncate">{module.description}</p>
                      </div>

                      {/* Time estimate */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm text-slate-500">~{module.estimatedMinutes} min</p>
                      </div>

                      {/* Arrow */}
                      {canNavigate && (
                        <ArrowRight
                          className={cn(
                            "h-5 w-5 flex-shrink-0",
                            isComplete ? "text-emerald-500" : "text-slate-500"
                          )}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right column - Summary + Progress (40%) */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Summary Card */}
            <SummaryCard story={story} onRefresh={refreshSummary} />

            {/* Progress summary */}
            {story.status !== "coined" && (
              <Card variant="dark" className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-medium text-marble-100">Your Progress</h2>
                    <p className="text-sm text-slate-400">
                      {story.completedModules.filter((m) => m !== "basic_info").length} of{" "}
                      {displayedModules.length} chapters complete
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-gold-400">{progress}%</p>
                    {remainingMinutes > 0 && (
                      <p className="text-sm text-slate-500 flex items-center justify-end gap-1">
                        <Clock className="h-3.5 w-3.5" />~{remainingMinutes} min remaining
                      </p>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-6">
                  <div
                    className="h-full bg-gold-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Continue button */}
                {nextIncompleteModule && (
                  <Button
                    variant="dark-primary"
                    size="lg"
                    onClick={handleContinue}
                    className="w-full"
                  >
                    Continue: {nextIncompleteModule.name}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </Card>
            )}

            {/* Coined celebration */}
            {story.status === "coined" && (
              <Card
                variant="dark"
                className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border-gold-700/30"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gold-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-gold-400" />
                  </div>
                  <h2 className="font-serif text-xl font-medium text-marble-100 mb-2">
                    Your Story is Coined
                  </h2>
                  <p className="text-slate-400 mb-4">
                    Thank you for preserving the legacy of {orgName}. Your experience will help
                    others learn and grow.
                  </p>
                  <Button
                    variant="dark-primary"
                    onClick={() => router.push(`/interview/${story.id}/complete`)}
                  >
                    View Summary
                  </Button>
                </div>
              </Card>
            )}

            {/* Help text */}
            <p className="text-center text-sm text-slate-500">
              Your progress is saved automatically. You can return anytime to continue.
            </p>
          </div>
        </div>

        {/* Bottom separator section */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <div className="text-center">
            <p className="text-slate-500 text-sm">
              Need help? Contact us at{" "}
              <a
                href="mailto:support@soil.foundation"
                className="text-gold-400 hover:text-gold-300 transition-colors"
              >
                support@soil.foundation
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
