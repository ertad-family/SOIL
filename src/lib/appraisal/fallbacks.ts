/**
 * Contextual Fallback Messages for Appraisal
 * Issue: #177 Therapeutic personalization
 *
 * These fallbacks are used when AI generation fails but we still want
 * to provide meaningful, personalized acknowledgment based on available data.
 */

import type { Story, ModuleId } from "@/types/interview";

interface FallbackContext {
  affirmation: string;
  anticipation: string;
}

/**
 * Extract contextual signals from founder module data
 */
function getFounderSignals(story: Story): string[] {
  const signals: string[] = [];
  const bg = story.founderContext?.background;

  if (!bg) return signals;

  // Health and personal cost
  if (bg.healthImpact === "significantly") {
    signals.push("significant_health_impact");
  }
  if (bg.relationshipImpact === "significantly") {
    signals.push("significant_relationship_impact");
  }
  if (bg.financeImpact === "significantly") {
    signals.push("significant_finance_impact");
  }

  // Recovery journey
  if (bg.recoveryTime === "still_working") {
    signals.push("still_recovering");
  }

  // Motivation and burnout
  if (bg.motivationEvolution === "started_fading") {
    signals.push("motivation_faded");
  }

  // Co-founder dynamics
  if (bg.cofounderRelationship === "got_hard" || bg.cofounderRelationship === "split") {
    signals.push("cofounder_struggles");
  }

  // First-time founder
  if (bg.priorExperience === "first_time") {
    signals.push("first_time_founder");
  }

  // Investment level
  if (bg.investmentLevel === "yes_everything") {
    signals.push("gave_everything");
  }

  // Personal events
  if (story.founderContext?.events?.length > 0) {
    const significantEvents = story.founderContext.events.filter(
      (e) => e.capacityImpact === "couldnt_focus" || e.capacityImpact === "significantly_reduced"
    );
    if (significantEvents.length > 0) {
      signals.push("personal_life_events");
    }
  }

  return signals;
}

/**
 * Extract contextual signals from financial module data
 */
function getFinancialSignals(story: Story): string[] {
  const signals: string[] = [];
  const fin = story.financialPicture;

  if (!fin) return signals;

  // Critical events
  const criticalEvents = fin.events?.filter((e) => e.severity === "critical") || [];
  if (criticalEvents.length > 0) {
    signals.push("critical_financial_events");
  }

  // Looking back - hindsight
  const tooLateEvents = fin.events?.filter((e) => e.lookingBack === "too_late") || [];
  if (tooLateEvents.length > 0) {
    signals.push("realized_too_late");
  }

  // Cash position
  const runwayMonths = fin.essentialMetrics?.cashPosition?.runwayMonths;
  if (runwayMonths !== null && runwayMonths !== undefined && runwayMonths <= 3) {
    signals.push("short_runway");
  }

  // Profitability journey
  if (fin.essentialMetrics?.profitability?.status === "never") {
    signals.push("never_profitable");
  }

  return signals;
}

/**
 * Extract contextual signals from dynamic module data
 */
function getDynamicSignals(story: Story): string[] {
  const signals: string[] = [];
  const dyn = story.dynamicPicture;

  if (!dyn) return signals;

  // Point of no return
  if (dyn.dynamicsOverview?.pointOfNoReturn === "yes") {
    signals.push("identified_point_of_no_return");
  }

  // Early warnings
  if (dyn.dynamicsOverview?.earlyWarnings === "missed_them") {
    signals.push("missed_early_warnings");
  }

  // Detected patterns
  if (dyn.detectedPatterns?.includes("cascade_signature")) {
    signals.push("cascade_pattern");
  }
  if (dyn.detectedPatterns?.includes("systemic_turnover")) {
    signals.push("systemic_turnover_pattern");
  }
  if (dyn.detectedPatterns?.includes("leadership_crisis")) {
    signals.push("leadership_crisis_pattern");
  }

  // Internal events with heavy emotions
  const distressedEvents = dyn.events?.filter((e) => e.emotionThen === "distressed") || [];
  if (distressedEvents.length > 0) {
    signals.push("distressing_events");
  }

  // Turning points
  const turningPoints = dyn.events?.filter((e) => e.lookingBack === "turning_point") || [];
  if (turningPoints.length > 0) {
    signals.push("turning_points_identified");
  }

  return signals;
}

/**
 * Extract contextual signals from environment module data
 */
function getEnvironmentSignals(story: Story): string[] {
  const signals: string[] = [];
  const env = story.environment;

  if (!env) return signals;

  // Challenging conditions
  const challengingConditions =
    env.operatingConditions?.filter((c) => c.peakState === "challenging") || [];
  if (challengingConditions.length > 0) {
    signals.push("challenging_conditions");
  }

  // Difficult market resources
  const difficultResources =
    env.marketResources?.filter((r) => r.peakAccessibility === "difficult") || [];
  if (difficultResources.length > 0) {
    signals.push("difficult_market_access");
  }

  // External shocks
  if (env.events && env.events.length > 0) {
    signals.push("external_events_faced");
    const majorFactors = env.events.filter((e) => e.lookingBack === "major_factor");
    if (majorFactors.length > 0) {
      signals.push("major_external_factors");
    }
  }

  return signals;
}

/**
 * Extract contextual signals from functional module data
 */
function getFunctionalSignals(story: Story): string[] {
  const signals: string[] = [];
  const func = story.functionalMapping;

  if (!func) return signals;

  // Count active functions
  const activeFunctions = func.functions?.filter((f) => f.isActive) || [];
  if (activeFunctions.length > 0) {
    signals.push("functions_mapped");
  }

  // Health issues
  const healthIssues = activeFunctions.filter(
    (f) =>
      f.healthCheck?.turnover === "high" ||
      f.healthCheck?.staffing === "understaffed" ||
      f.healthCheck?.budgetPressure === "severe" ||
      f.healthCheck?.qualityIssues === "serious" ||
      f.healthCheck?.leadership === "vacuum"
  );
  if (healthIssues.length > 0) {
    signals.push("organizational_health_issues");
  }

  // Turnover specifically
  const highTurnover = activeFunctions.filter((f) => f.healthCheck?.turnover === "high");
  if (highTurnover.length > 0) {
    signals.push("high_turnover");
  }

  // Understaffing
  const understaffed = activeFunctions.filter((f) => f.healthCheck?.staffing === "understaffed");
  if (understaffed.length > 0) {
    signals.push("understaffing");
  }

  return signals;
}

/**
 * Extract contextual signals from narrative module data
 */
function getNarrativeSignals(story: Story): string[] {
  const signals: string[] = [];
  const narr = story.narrative;

  if (!narr?.sections) return signals;

  // Count answered questions
  const allAnswers = [
    ...narr.sections.understanding,
    ...narr.sections.hindsight,
    ...narr.sections.lessons,
    ...narr.sections.advice,
    ...narr.sections.legacy,
  ].filter((a) => a.answer && a.answer.trim() !== "" && !a.skipped);

  if (allAnswers.length > 0) {
    signals.push("reflections_shared");
    if (allAnswers.length >= 5) {
      signals.push("deep_reflections");
    }
  }

  // Legacy section filled
  const legacyAnswers = narr.sections.legacy.filter(
    (a) => a.answer && a.answer.trim() !== "" && !a.skipped
  );
  if (legacyAnswers.length > 0) {
    signals.push("legacy_defined");
  }

  return signals;
}

/**
 * Get contextual fallback for founder chapter
 */
function getFounderFallback(story: Story): FallbackContext {
  const signals = getFounderSignals(story);

  let affirmation =
    "Sharing your personal journey takes courage. The story behind the founder is as important as the organization itself.";

  // Prioritize based on signals
  if (signals.includes("significant_health_impact")) {
    affirmation =
      "Documenting how this affected your health takes real courage. What you've shared helps others recognize these signs earlier.";
  } else if (signals.includes("still_recovering")) {
    affirmation =
      "The fact that you're still working through this, yet taking time to share your experience - that matters. Your processing helps others prepare.";
  } else if (signals.includes("gave_everything")) {
    affirmation =
      "You gave everything to this. That kind of commitment deserves acknowledgment, not just analysis. Thank you for documenting what that really meant.";
  } else if (signals.includes("cofounder_struggles")) {
    affirmation =
      "Co-founder relationships are rarely discussed honestly. What you've shared about those dynamics will help others navigate similar situations.";
  } else if (signals.includes("motivation_faded")) {
    affirmation =
      "Acknowledging when motivation started fading is hard. Most people don't admit it even to themselves. Your honesty here is valuable.";
  } else if (signals.includes("first_time_founder")) {
    affirmation =
      "As a first-time founder, everything you experienced was new. Documenting that perspective helps others who are just starting.";
  }

  return {
    affirmation,
    anticipation:
      "Next, we'll look at the financial picture - the numbers that tell their own story.",
  };
}

/**
 * Get contextual fallback for financial chapter
 */
function getFinancialFallback(story: Story): FallbackContext {
  const signals = getFinancialSignals(story);

  let affirmation =
    "Financial data can be the hardest to revisit. Thank you for documenting what the numbers really looked like.";

  if (signals.includes("critical_financial_events")) {
    affirmation =
      "You've documented some critical financial moments. Facing those numbers honestly takes courage - many founders never do.";
  } else if (signals.includes("realized_too_late")) {
    affirmation =
      "Recognizing what you realized too late is painful but valuable. Your hindsight becomes foresight for others.";
  } else if (signals.includes("never_profitable")) {
    affirmation =
      "Never reaching profitability doesn't diminish what you built. The financial journey you've documented here is full of lessons.";
  } else if (signals.includes("short_runway")) {
    affirmation =
      "Operating with limited runway creates constant pressure. Thank you for documenting what that reality looked like.";
  }

  return {
    affirmation,
    anticipation:
      "The dynamic picture comes next - the internal events that shaped your organization's trajectory.",
  };
}

/**
 * Get contextual fallback for dynamic chapter
 */
function getDynamicFallback(story: Story): FallbackContext {
  const signals = getDynamicSignals(story);

  let affirmation =
    "Internal dynamics are often invisible from the outside. What you've documented here reveals the real story.";

  if (signals.includes("identified_point_of_no_return")) {
    affirmation =
      "Naming the point of no return takes clarity most people never achieve. That moment you identified will help others see theirs.";
  } else if (signals.includes("missed_early_warnings")) {
    affirmation =
      "Acknowledging missed warnings takes honesty. What you've documented about those signals becomes a checklist for others.";
  } else if (signals.includes("turning_points_identified")) {
    affirmation =
      "You've identified the turning points in your story. These moments are exactly what others need to recognize in their own journeys.";
  } else if (signals.includes("distressing_events")) {
    affirmation =
      "Some of what you've documented was clearly difficult. Thank you for going through those memories to share them.";
  }

  return {
    affirmation,
    anticipation: "Next up is the environment chapter - the external forces that shaped your path.",
  };
}

/**
 * Get contextual fallback for environment chapter
 */
function getEnvironmentFallback(story: Story): FallbackContext {
  const signals = getEnvironmentSignals(story);

  let affirmation =
    "Understanding the environment you operated in helps put everything in context. Thank you for mapping that landscape.";

  if (signals.includes("major_external_factors")) {
    affirmation =
      "You've identified external factors that significantly impacted your organization. Context matters - and you've provided it.";
  } else if (signals.includes("challenging_conditions")) {
    affirmation =
      "Operating in challenging conditions requires resilience. What you've documented about your environment explains a lot.";
  } else if (signals.includes("difficult_market_access")) {
    affirmation =
      "Difficult market access creates invisible barriers. Thank you for documenting what that really meant for your organization.";
  }

  return {
    affirmation,
    anticipation:
      "The functional mapping is next - how your organization was actually structured at its peak.",
  };
}

/**
 * Get contextual fallback for functional chapter
 */
function getFunctionalFallback(story: Story): FallbackContext {
  const signals = getFunctionalSignals(story);
  const functionCount = story.functionalMapping?.functions?.filter((f) => f.isActive).length || 0;

  let affirmation =
    "Mapping your organizational structure provides valuable insight into how you operated.";

  if (signals.includes("high_turnover") && signals.includes("understaffing")) {
    affirmation = `You've mapped ${functionCount} functions, revealing both turnover and understaffing challenges. That combination is brutal - and you've documented it honestly.`;
  } else if (signals.includes("organizational_health_issues")) {
    affirmation = `The health issues you've documented across your ${functionCount} functions tell an important story. These patterns help others spot similar signs.`;
  } else if (signals.includes("high_turnover")) {
    affirmation =
      "High turnover patterns you've documented reveal organizational stress that's often hidden. Thank you for that honesty.";
  } else if (signals.includes("understaffing")) {
    affirmation =
      "The understaffing you've documented explains so much. Running lean sounds good until you're the one stretched too thin.";
  } else if (functionCount > 0) {
    affirmation = `You've mapped ${functionCount} functions in your organization. This structural view helps others understand what it takes to run an organization like yours.`;
  }

  return {
    affirmation,
    anticipation:
      "Finally, the narrative chapter - where you'll reflect on meaning, lessons, and legacy.",
  };
}

/**
 * Get contextual fallback for narrative chapter (final)
 */
function getNarrativeFallback(story: Story): FallbackContext {
  const signals = getNarrativeSignals(story);

  let affirmation =
    "These reflections complete the story. What's been shared here will help others find meaning in their own journeys.";

  if (signals.includes("deep_reflections")) {
    affirmation =
      "The depth of reflection here is remarkable. These insights will resonate with founders for years to come.";
  } else if (signals.includes("legacy_defined")) {
    affirmation =
      "A legacy has been defined here. That's not something that dies - it lives on in what others learn.";
  } else if (signals.includes("reflections_shared")) {
    affirmation =
      "Every insight shared here becomes wisdom for the next founder facing similar challenges.";
  }

  return {
    affirmation,
    anticipation: "The story is now complete. This experience will help others on their journey.",
  };
}

/**
 * Get contextual fallback based on completed module
 */
export function getContextualFallback(story: Story, moduleId: ModuleId): FallbackContext {
  switch (moduleId) {
    case "founder":
      return getFounderFallback(story);
    case "financial":
      return getFinancialFallback(story);
    case "dynamic":
      return getDynamicFallback(story);
    case "environment":
      return getEnvironmentFallback(story);
    case "functional":
      return getFunctionalFallback(story);
    case "narrative":
      return getNarrativeFallback(story);
    case "basic_info":
    default:
      return {
        affirmation: "Thank you for beginning to document your organization's story.",
        anticipation:
          "The journey of reflection begins with Your Story - your personal experience.",
      };
  }
}

/**
 * Get weighted anticipation message for next chapter
 * Acknowledges the emotional weight of upcoming content
 */
export function getWeightedAnticipation(nextModuleId: ModuleId): string {
  switch (nextModuleId) {
    case "founder":
      return "Your Story comes next - your personal journey as founder. Take your time with this one.";
    case "financial":
      return "The financial chapter can be one of the hardest to revisit. Take your time. What you document helps others see the patterns sooner.";
    case "dynamic":
      return "Next is the internal dynamics - the events inside your organization. Some of these memories may be difficult, but they're important.";
    case "environment":
      return "The environment chapter maps external forces. Understanding context helps make sense of outcomes.";
    case "functional":
      return "Functional mapping is next - how your organization was actually structured. This creates a blueprint others can learn from.";
    case "narrative":
      return "The final chapter invites you to reflect on meaning and legacy. This is where your experience becomes wisdom.";
    default:
      return "Continue your story when you're ready.";
  }
}
