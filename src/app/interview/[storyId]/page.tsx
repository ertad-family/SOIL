"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useInterview } from "@/contexts/InterviewContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Check, ArrowRight, Clock, Calendar, Users, Layers, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { MODULES, FounderRole } from "@/types/interview";
import { SummaryCard } from "@/components/interview/SummaryCard";
import { AppraisalCard } from "@/components/interview/AppraisalCard";

/** Human-readable labels for founder roles */
const FOUNDER_ROLE_LABELS: Record<FounderRole, string> = {
  founder: "Founder",
  cofounder: "Co-Founder",
  ceo_non_founder: "CEO",
  other: "Team Member",
};

/**
 * Story Overview Dashboard (Dark Theme, Two-Column Layout)
 * Integrated view with chapters, AI summary, appraisal, and progress.
 * Issue: #20 Update the story page
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

  // Fetch user name for page title
  const [userName, setUserName] = React.useState<string | null>(null);
  React.useEffect(() => {
    async function fetchUserName() {
      if (!story?.userId) return;
      try {
        const supabase = createClient();
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", story.userId)
          .single();
        if (profile?.display_name) {
          setUserName(profile.display_name);
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    }
    fetchUserName();
  }, [story?.userId]);

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
  const isCoined = story.status === "coined";

  // Build page title: "The story of [org name] told by its [role] - [name]"
  const roleLabel = story.founderRole ? FOUNDER_ROLE_LABELS[story.founderRole] : null;
  const pageTitle = (() => {
    if (roleLabel && userName) {
      return `The story of ${orgName} told by its ${roleLabel} — ${userName}`;
    }
    if (roleLabel) {
      return `The story of ${orgName} told by its ${roleLabel}`;
    }
    return `The Story of ${orgName}`;
  })();

  // Filter out basic_info from displayed modules
  const displayedModules = MODULES.filter((m) => m.id !== "basic_info");

  // Find the next incomplete module
  const nextIncompleteModule = displayedModules.find((m) => !isModuleComplete(m.id));

  // Calculate total estimated time remaining
  const remainingMinutes = displayedModules
    .filter((m) => !isModuleComplete(m.id))
    .reduce((sum, m) => sum + m.estimatedMinutes, 0);

  // Calculate stats for coined stories
  const lifespanMonths = (() => {
    if (!story.basicInfo.foundedDate || !story.basicInfo.closedDate) return null;
    const founded = new Date(story.basicInfo.foundedDate);
    const closed = new Date(story.basicInfo.closedDate);
    return (
      (closed.getFullYear() - founded.getFullYear()) * 12 + (closed.getMonth() - founded.getMonth())
    );
  })();

  const formatLifespan = (months: number | null): string => {
    if (!months) return "Unknown";
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) return `${years} year${years > 1 ? "s" : ""}`;
    return `${years}y ${remainingMonths}m`;
  };

  const functionsCount = story.functionalMapping.functions.filter((f) => f.isActive).length;
  const eventsCount =
    (story.financialPicture.events?.length || 0) +
    (story.dynamicPicture.events?.length || 0) +
    (story.environment.events?.length || 0) +
    (story.founderContext.events?.length || 0);

  const handleContinue = () => {
    if (nextIncompleteModule) {
      navigateToModule(nextIncompleteModule.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header with title and back button */}
        <div className="flex items-start justify-between mb-8">
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-marble-100 tracking-wide">
            {pageTitle}
          </h1>
          <Link href={`/organization/${story.organizationId}`}>
            <Button variant="dark-ghost" size="sm">
              ← Back to Organization
            </Button>
          </Link>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left column - Chapters (60%) */}
          <div className="lg:col-span-3">
            <h2 className="font-medium text-marble-100 mb-4">Chapters</h2>
            <div className="space-y-3">
              {displayedModules.map((chapter, index) => {
                const isComplete = isModuleComplete(chapter.id);
                const canNavigate = canNavigateToModule(chapter.id);
                const isCurrent = story.currentModule === chapter.id;

                return (
                  <button
                    key={chapter.id}
                    onClick={() => canNavigate && navigateToModule(chapter.id)}
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
                          {chapter.name}
                        </h3>
                        <p className="text-sm text-slate-400 truncate">{chapter.description}</p>
                      </div>

                      {/* Time estimate */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm text-slate-500">~{chapter.estimatedMinutes} min</p>
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

            {/* Help text */}
            <p className="mt-6 text-center text-sm text-slate-500">
              Your progress is saved automatically. You can return anytime to continue.
            </p>
            <p className="mt-2 text-center text-sm text-slate-500">
              Need help? Contact us at{" "}
              <a
                href="mailto:support@soil.rip"
                className="text-gold-400 hover:text-gold-300 transition-colors"
              >
                support@soil.rip
              </a>
            </p>
          </div>

          {/* Right column - Appraisal + Progress / Coined (40%) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Appraisal Card - Motivational messages */}
            <AppraisalCard story={story} />

            {/* Coined celebration */}
            {isCoined && (
              <Card
                variant="dark"
                className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border-gold-700/30"
              >
                {/* Celebration header */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gold-500/30">
                    <Check className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="font-serif text-xl font-medium text-marble-100 mb-2">
                    Your Story is Coined
                  </h2>
                  <p className="text-slate-400 text-sm">
                    Thank you for preserving the legacy of {orgName}.
                  </p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gold-400 mx-auto mb-1" />
                    <p className="text-lg font-semibold text-marble-100">
                      {formatLifespan(lifespanMonths)}
                    </p>
                    <p className="text-xs text-slate-500">Lifespan</p>
                  </div>
                  <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                    <Users className="h-5 w-5 text-gold-400 mx-auto mb-1" />
                    <p className="text-lg font-semibold text-marble-100">
                      {story.basicInfo.peakTeamSize || "—"}
                    </p>
                    <p className="text-xs text-slate-500">Peak team</p>
                  </div>
                  <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                    <Layers className="h-5 w-5 text-gold-400 mx-auto mb-1" />
                    <p className="text-lg font-semibold text-marble-100">{functionsCount}</p>
                    <p className="text-xs text-slate-500">Functions</p>
                  </div>
                  <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                    <FileText className="h-5 w-5 text-gold-400 mx-auto mb-1" />
                    <p className="text-lg font-semibold text-marble-100">{eventsCount}</p>
                    <p className="text-xs text-slate-500">Events</p>
                  </div>
                </div>

                {/* Navigation button */}
                <Link href={`/organization/${story.organizationId}`}>
                  <Button variant="dark-primary" className="w-full">
                    View Organization
                  </Button>
                </Link>
              </Card>
            )}

            {/* Progress summary - for in-progress stories */}
            {!isCoined && (
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
                        <Clock className="h-3.5 w-3.5" />~{remainingMinutes} min
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
          </div>
        </div>

        {/* Roman divider before AI Summary */}
        <div className="divider-roman my-32">
          <span className="text-gold-400 text-lg px-6">✦</span>
        </div>

        {/* AI Summary - Full width below the two columns */}
        <SummaryCard story={story} onRefresh={refreshSummary} />
      </div>
    </div>
  );
}
