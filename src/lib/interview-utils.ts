/**
 * Interview Utility Functions
 *
 * Helper functions for the interview wizard system.
 */

import type {
  Story,
  ModuleId,
  OrganizationType,
  LifecycleStage,
  FunctionDetail,
  FunctionHealthCheck,
  DetectedPattern,
  BasicInfoData,
} from "@/types/interview";
import { MODULES } from "@/types/interview";

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Check if basic info is complete enough to proceed
 */
export function isBasicInfoValid(basicInfo: BasicInfoData): boolean {
  return (
    !!basicInfo.organizationName?.trim() &&
    !!basicInfo.description?.trim() &&
    !!basicInfo.organizationType &&
    !!basicInfo.foundedDate &&
    !!basicInfo.founderRole
  );
}

/**
 * Check if a module is complete based on its data
 */
export function isModuleDataComplete(story: Story, moduleId: ModuleId): boolean {
  switch (moduleId) {
    case "basic_info":
      return isBasicInfoValid(story.basicInfo);

    case "functional":
      // At least one function should be active
      return story.functionalMapping.functions.some((f) => f.isActive);

    case "financial":
      // Either uploaded files OR metrics should be present
      return (
        story.financialPicture.uploadedFiles.length > 0 || story.financialPicture.metrics !== null
      );

    case "dynamic":
      // Either pattern questions answered OR events added
      return (
        story.dynamicPicture.patternQuestions.some((q) => q.answer) ||
        story.dynamicPicture.events.length > 0
      );

    case "environment":
      // At least one resource assessment OR event
      return (
        story.environment.resourceAssessments.length > 0 || story.environment.events.length > 0
      );

    case "founder":
      // Background has some data filled in
      const bg = story.founderContext.background;
      return bg.priorExperience !== null || bg.domainKnowledge !== null || bg.commitment !== null;

    case "narrative":
      // At least one question answered
      const sections = story.narrative.sections;
      return Object.values(sections).some((sectionQuestions) =>
        sectionQuestions.some((q) => q.answer && !q.skipped)
      );

    default:
      return false;
  }
}

// =============================================================================
// PATTERN DETECTION
// =============================================================================

/**
 * Detect patterns from functional mapping health check data
 */
export function detectPatterns(functions: FunctionDetail[]): DetectedPattern[] {
  const patterns: DetectedPattern[] = [];
  const activeFunctions = functions.filter((f) => f.isActive);

  if (activeFunctions.length === 0) return patterns;

  // Systemic Turnover: High turnover in 2+ functions
  const highTurnoverCount = activeFunctions.filter((f) => f.healthCheck.turnover === "high").length;
  if (highTurnoverCount >= 2) {
    patterns.push("systemic_turnover");
  }

  // Widespread Understaffing: Understaffed in 2+ functions
  const understaffedCount = activeFunctions.filter(
    (f) => f.healthCheck.staffing === "understaffed"
  ).length;
  if (understaffedCount >= 2) {
    patterns.push("widespread_understaffing");
  }

  // Budget Squeeze: Severe/Some pressure in 2+ functions
  const budgetPressureCount = activeFunctions.filter(
    (f) => f.healthCheck.budgetPressure === "severe" || f.healthCheck.budgetPressure === "some"
  ).length;
  if (budgetPressureCount >= 2) {
    patterns.push("budget_squeeze");
  }

  // Quality Erosion: Serious/Some issues in 2+ functions
  const qualityIssuesCount = activeFunctions.filter(
    (f) => f.healthCheck.qualityIssues === "serious" || f.healthCheck.qualityIssues === "some"
  ).length;
  if (qualityIssuesCount >= 2) {
    patterns.push("quality_erosion");
  }

  // Leadership Crisis: Vacuum/Gaps in 2+ functions
  const leadershipIssuesCount = activeFunctions.filter(
    (f) => f.healthCheck.leadership === "vacuum" || f.healthCheck.leadership === "gaps"
  ).length;
  if (leadershipIssuesCount >= 2) {
    patterns.push("leadership_crisis");
  }

  // Internal Friction: Cross-function conflict in 2+ functions
  const conflictCount = activeFunctions.filter(
    (f) => f.healthCheck.crossFunctionConflict === true
  ).length;
  if (conflictCount >= 2) {
    patterns.push("internal_friction");
  }

  // Concentrated Failure: One function with 3+ problems
  const hasConcentratedFailure = activeFunctions.some((f) => {
    let problemCount = 0;
    if (f.healthCheck.turnover === "high") problemCount++;
    if (f.healthCheck.staffing === "understaffed") problemCount++;
    if (f.healthCheck.budgetPressure === "severe") problemCount++;
    if (f.healthCheck.qualityIssues === "serious") problemCount++;
    if (f.healthCheck.leadership === "vacuum") problemCount++;
    if (f.healthCheck.crossFunctionConflict) problemCount++;
    return problemCount >= 3;
  });
  if (hasConcentratedFailure) {
    patterns.push("concentrated_failure");
  }

  // Cascade Signature: Understaffing + Quality issues in same function
  const hasCascade = activeFunctions.some(
    (f) =>
      f.healthCheck.staffing === "understaffed" &&
      (f.healthCheck.qualityIssues === "serious" || f.healthCheck.qualityIssues === "some")
  );
  if (hasCascade) {
    patterns.push("cascade_signature");
  }

  return patterns;
}

/**
 * Get pattern-specific questions
 */
export function getPatternQuestions(
  pattern: DetectedPattern
): Array<{ id: string; question: string }> {
  switch (pattern) {
    case "systemic_turnover":
      return [
        { id: "turnover_when", question: "When did turnover become noticeable?" },
        { id: "turnover_attributed", question: "What did you attribute it to at the time?" },
        { id: "turnover_understand", question: "How do you understand it now?" },
        { id: "turnover_change", question: "Did you try to change anything?" },
      ];

    case "widespread_understaffing":
      return [
        {
          id: "understaffing_cause",
          question: "Was this a conscious decision (cost saving) or inability to hire?",
        },
        { id: "understaffing_critical", question: "When did the shortage become critical?" },
        { id: "understaffing_first", question: "Which function suffered first?" },
      ];

    case "budget_squeeze":
      return [
        { id: "budget_when", question: "When did constraints begin?" },
        { id: "budget_cut_first", question: "What was cut first?" },
        { id: "budget_team_react", question: "How did the team react?" },
      ];

    case "quality_erosion":
      return [
        { id: "quality_when", question: "When did you notice quality declining?" },
        {
          id: "quality_connect",
          question: "Do you connect it with other problems (staffing, budget)?",
        },
        { id: "quality_customers", question: "How did customers react?" },
      ];

    case "leadership_crisis":
      return [
        { id: "leadership_why", question: "Why did gaps emerge?" },
        { id: "leadership_fill", question: "Did you try to fill them? What got in the way?" },
        { id: "leadership_cope", question: "How did teams cope without leadership?" },
      ];

    case "internal_friction":
      return [
        { id: "friction_which", question: "Which functions had the main conflict?" },
        {
          id: "friction_about",
          question: "What was the dispute about (resources, priorities, quality, responsibility)?",
        },
        { id: "friction_resolve", question: "How did you try to resolve it?" },
      ];

    case "concentrated_failure":
      return [
        { id: "concentrated_epicenter", question: "Was this function the epicenter of crisis?" },
        {
          id: "concentrated_sequence",
          question: "Did problems arise simultaneously or sequentially?",
        },
      ];

    case "cascade_signature":
      return [
        {
          id: "cascade_which_first",
          question: "Did understaffing lead to quality issues, or vice versa?",
        },
        { id: "cascade_order", question: "Which came first?" },
      ];

    default:
      return [];
  }
}

// =============================================================================
// AFFIRMATIONS
// =============================================================================

/**
 * Get contextual affirmation based on story data
 */
export function getContextualAffirmation(story: Story): string | null {
  const affirmations: string[] = [];

  // Low satisfaction on functions
  const lowSatisfactionFunctions = story.functionalMapping.functions.filter(
    (f) => f.isActive && f.satisfaction !== null && f.satisfaction <= 3
  );
  if (lowSatisfactionFunctions.length > 0) {
    const functionName = lowSatisfactionFunctions[0].customName || "this function";
    affirmations.push(`Most founders struggle with ${functionName}. You're not alone.`);
  }

  // Many functions with Founder as owner
  const founderOwnedCount = story.functionalMapping.functions.filter(
    (f) => f.isActive && f.ownerType === "founder"
  ).length;
  if (founderOwnedCount >= 3) {
    affirmations.push("Running multiple functions yourself is exhausting. You carried a lot.");
  }

  // Early stage death
  if (story.basicInfo.stageAtClosure === "formation") {
    affirmations.push("Building something from nothing is already an achievement few attempt.");
  }

  // High headcount at peak
  if (story.basicInfo.peakTeamSize && story.basicInfo.peakTeamSize >= 20) {
    affirmations.push("You created jobs. Real people's lives were better because you built this.");
  }

  // Long lifespan
  if (story.basicInfo.foundedDate && story.basicInfo.closedDate) {
    const founded = new Date(story.basicInfo.foundedDate);
    const closed = new Date(story.basicInfo.closedDate);
    const years = (closed.getTime() - founded.getTime()) / (1000 * 60 * 60 * 24 * 365);
    if (years >= 3) {
      affirmations.push(
        `Keeping something alive for ${Math.floor(years)} years is remarkable. Most never get there.`
      );
    }
  }

  // Return random affirmation or null if none apply
  if (affirmations.length === 0) return null;
  return affirmations[Math.floor(Math.random() * affirmations.length)];
}

// =============================================================================
// FORMATTING
// =============================================================================

/**
 * Format organization lifespan as human-readable string
 */
export function formatLifespan(foundedDate: string | null, closedDate: string | null): string {
  if (!foundedDate || !closedDate) return "Unknown duration";

  const founded = new Date(foundedDate);
  const closed = new Date(closedDate);
  const totalMonths =
    (closed.getFullYear() - founded.getFullYear()) * 12 + (closed.getMonth() - founded.getMonth());

  if (totalMonths < 12) {
    return `${totalMonths} month${totalMonths !== 1 ? "s" : ""}`;
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (months === 0) {
    return `${years} year${years !== 1 ? "s" : ""}`;
  }

  return `${years} year${years !== 1 ? "s" : ""}, ${months} month${months !== 1 ? "s" : ""}`;
}

/**
 * Format date as "Month Year"
 */
export function formatMonthYear(dateString: string | null): string {
  if (!dateString) return "Unknown";

  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/**
 * Calculate total estimated time remaining
 */
export function getRemainingTime(completedModules: ModuleId[]): number {
  return MODULES.filter((m) => !completedModules.includes(m.id)).reduce(
    (sum, m) => sum + m.estimatedMinutes,
    0
  );
}

// =============================================================================
// STATISTICS
// =============================================================================

/**
 * Calculate story statistics for summary
 */
export function calculateStoryStats(story: Story) {
  const activeFunctions = story.functionalMapping.functions.filter((f) => f.isActive);

  const totalHeadcount = activeFunctions.reduce((sum, f) => {
    return sum + (f.headcount || 0);
  }, 0);

  const totalEvents =
    (story.financialPicture.events?.length || 0) +
    (story.dynamicPicture.events?.length || 0) +
    (story.environment.events?.length || 0) +
    (story.founderContext.events?.length || 0);

  const answeredNarrativeQuestions = Object.values(story.narrative.sections)
    .flat()
    .filter((q) => q.answer && !q.skipped).length;

  return {
    functionsCount: activeFunctions.length,
    totalHeadcount,
    totalEvents,
    answeredNarrativeQuestions,
    lifespan: formatLifespan(story.basicInfo.foundedDate, story.basicInfo.closedDate),
  };
}

// =============================================================================
// MODULE HELPERS
// =============================================================================

/**
 * Get module route path
 */
export function getModuleRoute(storyId: string, moduleId: ModuleId): string {
  return `/interview/${storyId}/${moduleId.replace("_", "-")}`;
}

/**
 * Convert route segment to module ID
 */
export function routeToModuleId(route: string): ModuleId | null {
  const mapping: Record<string, ModuleId> = {
    "basic-info": "basic_info",
    functional: "functional",
    financial: "financial",
    dynamic: "dynamic",
    environment: "environment",
    founder: "founder",
    narrative: "narrative",
  };
  return mapping[route] || null;
}
