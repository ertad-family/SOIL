/**
 * Therapeutic Appraisal Generator
 * Issue: #177 Appraisal card personalization
 *
 * Generates warm, personalized acknowledgment messages for founders
 * after completing interview chapters. This is SEPARATE from the
 * research summary - it focuses purely on therapeutic validation.
 *
 * Design principle: The founder should feel SEEN and UNDERSTOOD,
 * not just processed.
 */

import { GoogleGenAI } from "@google/genai";
import type { Story, ModuleId } from "@/types/interview";
import { MODULES } from "@/types/interview";
import { getContextualFallback, getWeightedAnticipation } from "./fallbacks";

// Initialize Google GenAI client with Vertex AI
const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GOOGLE_CLOUD_PROJECT_ID || "",
  location: process.env.VERTEX_AI_LOCATION || "us-central1",
  googleAuthOptions: {
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "",
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "",
    },
  },
});

const TEXT_MODEL = "gemini-2.5-flash";

export interface TherapeuticAppraisal {
  affirmation: string;
  anticipation: string;
}

/**
 * Extract emotional context from founder module
 * This captures the PERSONAL experience, not research facts
 */
function extractFounderEmotionalContext(story: Story): string {
  const parts: string[] = [];
  const bg = story.founderContext?.background;

  if (!bg) return "";

  parts.push("FOUNDER'S PERSONAL JOURNEY:");

  // Prior experience framing
  if (bg.priorExperience === "first_time") {
    parts.push("- This was their FIRST venture - everything was new");
  } else if (bg.priorExperience === "tried_before") {
    parts.push("- They had tried entrepreneurship before");
  }

  // Commitment level
  if (bg.commitment === "full_time") {
    parts.push("- Went full-time from the start");
  } else if (bg.commitment === "never_full_time") {
    parts.push("- Never went full-time - juggling multiple commitments");
  }

  // Team dynamics
  if (bg.startedWith === "solo") {
    parts.push("- Started SOLO - carried the weight alone");
  } else if (bg.startedWith === "one_other" || bg.startedWith === "team") {
    if (bg.cofounderRelationship === "got_hard") {
      parts.push("- Co-founder relationship became DIFFICULT over time");
    } else if (bg.cofounderRelationship === "split") {
      parts.push("- Co-founders SPLIT - a painful separation");
    } else if (bg.cofounderRelationship === "got_closer") {
      parts.push("- Co-founder relationship grew stronger through challenges");
    }
  }

  // Motivation journey
  if (bg.motivationEvolution === "started_fading") {
    parts.push("- Motivation started FADING - they noticed and documented it");
    if (bg.fadingNoticedAt) {
      parts.push(`  (noticed during: ${bg.fadingNoticedAt.replace(/_/g, " ")} stage)`);
    }
  }

  // Personal investment
  if (bg.investmentLevel === "yes_everything") {
    parts.push("- Invested EVERYTHING - time, money, relationships");
  } else if (bg.investmentLevel === "pulled_back") {
    parts.push("- Had to pull back investment over time");
  }

  // THE COST - this is crucial for therapeutic acknowledgment
  parts.push("\nTHE PERSONAL COST:");
  if (bg.healthImpact === "significantly") {
    parts.push("- Health was SIGNIFICANTLY affected");
  } else if (bg.healthImpact === "a_little") {
    parts.push("- Health was somewhat affected");
  }

  if (bg.relationshipImpact === "significantly") {
    parts.push("- Relationships were SIGNIFICANTLY affected");
  } else if (bg.relationshipImpact === "a_little") {
    parts.push("- Relationships were somewhat affected");
  }

  if (bg.financeImpact === "significantly") {
    parts.push("- Personal finances were SIGNIFICANTLY affected");
  }

  // Recovery status
  if (bg.recoveryTime === "still_working") {
    parts.push("- STILL WORKING on recovery - this is ongoing");
  } else if (bg.recoveryTime === "months") {
    parts.push("- Took months to recover");
  }

  // Current state
  if (bg.currentFeeling) {
    const feelingMap: Record<string, string> = {
      distressed: "still feeling distressed",
      worried: "still carrying some worry",
      neutral: "at peace with it",
      hopeful: "feeling hopeful",
      content: "feeling content",
    };
    parts.push(`- Currently: ${feelingMap[bg.currentFeeling] || bg.currentFeeling}`);
  }

  // Would do again
  if (bg.wouldDoAgain) {
    const againMap: Record<string, string> = {
      yes_no_hesitation: "would do it again without hesitation",
      yes_differently: "would do it again, but differently",
      probably_not: "probably wouldn't do it again",
      definitely_not: "definitely wouldn't do it again",
    };
    parts.push(`- Looking back: ${againMap[bg.wouldDoAgain] || bg.wouldDoAgain}`);
  }

  // Personal life events
  const events = story.founderContext?.events || [];
  if (events.length > 0) {
    parts.push(`\nPERSONAL LIFE EVENTS DURING THE JOURNEY (${events.length}):`);
    events.slice(0, 3).forEach((event) => {
      const impact = event.capacityImpact?.replace(/_/g, " ") || "unknown impact";
      parts.push(`- ${event.category}: ${impact}`);
    });
  }

  return parts.join("\n");
}

/**
 * Extract emotional context from financial module
 */
function extractFinancialEmotionalContext(story: Story): string {
  const parts: string[] = [];
  const fin = story.financialPicture;

  if (!fin) return "";

  parts.push("FINANCIAL JOURNEY:");

  // Profitability story
  if (fin.essentialMetrics?.profitability?.status === "never") {
    parts.push("- Never reached profitability");
  } else if (fin.essentialMetrics?.profitability?.status === "almost") {
    parts.push("- Came close to profitability but didn't quite make it");
  } else if (fin.essentialMetrics?.profitability?.whenLost) {
    parts.push("- Had profitability but lost it");
  }

  // Runway pressure
  const runwayMonths = fin.essentialMetrics?.cashPosition?.runwayMonths;
  if (runwayMonths !== null && runwayMonths !== undefined && runwayMonths <= 3) {
    parts.push("- Operated with very SHORT runway (3 months or less)");
  }

  // Financial events with emotional weight
  const events = fin.events || [];
  if (events.length > 0) {
    parts.push(`\nFINANCIAL EVENTS DOCUMENTED (${events.length} total):`);

    // Severity breakdown
    const criticalEvents = events.filter((e) => e.severity === "critical");
    const significantEvents = events.filter((e) => e.severity === "significant");
    const minorEvents = events.filter((e) => e.severity === "minor");

    if (criticalEvents.length > 0) {
      parts.push(`- ${criticalEvents.length} CRITICAL events (threatened survival)`);
    }
    if (significantEvents.length > 0) {
      parts.push(`- ${significantEvents.length} SIGNIFICANT events (changed trajectory)`);
    }
    if (minorEvents.length > 0) {
      parts.push(`- ${minorEvents.length} minor events (adapted)`);
    }

    // Looking back reflections
    const tooLateEvents = events.filter((e) => e.lookingBack === "too_late");
    const caughtInTimeEvents = events.filter((e) => e.lookingBack === "caught_in_time");
    const nothingCouldDoEvents = events.filter((e) => e.lookingBack === "nothing_could_do");
    const madeWorseEvents = events.filter((e) => e.lookingBack === "made_worse");

    if (tooLateEvents.length > 0) {
      parts.push(`- ${tooLateEvents.length} realized TOO LATE`);
    }
    if (caughtInTimeEvents.length > 0) {
      parts.push(`- ${caughtInTimeEvents.length} CAUGHT IN TIME`);
    }
    if (nothingCouldDoEvents.length > 0) {
      parts.push(`- ${nothingCouldDoEvents.length} marked as NOTHING COULD DO`);
    }
    if (madeWorseEvents.length > 0) {
      parts.push(`- ${madeWorseEvents.length} where response MADE WORSE`);
    }

    // Event categories
    const categories = [...new Set(events.map((e) => e.category))];
    parts.push(`- Event categories: ${categories.join(", ")}`);
  } else {
    parts.push("\n- No financial events documented");
  }

  return parts.join("\n");
}

/**
 * Extract emotional context from dynamic module
 */
function extractDynamicEmotionalContext(story: Story): string {
  const parts: string[] = [];
  const dyn = story.dynamicPicture;

  if (!dyn) return "";

  parts.push("INTERNAL DYNAMICS:");

  // Overview insights - include ALL fields for accuracy
  if (dyn.dynamicsOverview) {
    const ov = dyn.dynamicsOverview;

    // Decline speed
    if (ov.declineSpeed === "sudden") {
      parts.push("- Decline speed: SUDDEN - things fell apart quickly");
    } else if (ov.declineSpeed === "gradual") {
      parts.push("- Decline speed: GRADUAL - a slow erosion over time");
    } else if (ov.declineSpeed === "slow_with_hope") {
      parts.push("- Decline speed: SLOW with moments of hope");
    } else {
      parts.push("- Decline speed: not specified");
    }

    // Early warnings
    if (ov.earlyWarnings === "clearly_visible") {
      parts.push("- Early warnings: were CLEARLY VISIBLE");
    } else if (ov.earlyWarnings === "missed_them") {
      parts.push("- Early warnings: MISSED them at the time");
    } else if (ov.earlyWarnings === "blindsided") {
      parts.push("- Early warnings: NONE - was blindsided");
    } else {
      parts.push("- Early warnings: not specified");
    }

    // Point of no return
    if (ov.pointOfNoReturn === "yes") {
      parts.push("- Point of no return: YES, identified a specific moment");
      if (ov.pointOfNoReturnWhen) {
        parts.push(`  (when: ${ov.pointOfNoReturnWhen})`);
      }
    } else if (ov.pointOfNoReturn === "no_gradual") {
      parts.push("- Point of no return: NO single moment - was gradual");
    } else if (ov.pointOfNoReturn === "hard_to_say") {
      parts.push("- Point of no return: HARD TO SAY in hindsight");
    } else {
      parts.push("- Point of no return: not specified");
    }

    // Time to closure
    if (ov.timeToClosureFrom) {
      const timeMap: Record<string, string> = {
        days: "DAYS",
        weeks: "WEEKS",
        months: "MONTHS",
        over_year: "OVER A YEAR",
      };
      parts.push(
        `- Time from point of no return to closure: ${timeMap[ov.timeToClosureFrom] || ov.timeToClosureFrom}`
      );
    }

    // Closure decision
    if (ov.closureDecision === "alone") {
      parts.push("- Closure decision: made ALONE");
    } else if (ov.closureDecision === "founders_together") {
      parts.push("- Closure decision: made with CO-FOUNDERS together");
    } else if (ov.closureDecision === "board") {
      parts.push("- Closure decision: made by BOARD");
    } else if (ov.closureDecision === "circumstances") {
      parts.push("- Closure decision: FORCED by circumstances");
    }
  } else {
    parts.push("- No dynamics overview provided");
  }

  // Internal events with emotions
  const events = dyn.events || [];
  if (events.length > 0) {
    parts.push(`\nINTERNAL EVENTS DOCUMENTED (${events.length} total):`);

    const distressedEvents = events.filter((e) => e.emotionThen === "distressed");
    const worriedEvents = events.filter((e) => e.emotionThen === "worried");
    const turningPoints = events.filter((e) => e.lookingBack === "turning_point");
    const missedWarnings = events.filter((e) => e.lookingBack === "warning_missed");
    const rightCalls = events.filter((e) => e.lookingBack === "right_call");
    const outsideControl = events.filter((e) => e.lookingBack === "outside_control");

    if (distressedEvents.length > 0) {
      parts.push(`- ${distressedEvents.length} events marked as DISTRESSING`);
    }
    if (worriedEvents.length > 0) {
      parts.push(`- ${worriedEvents.length} events marked as WORRYING`);
    }
    if (turningPoints.length > 0) {
      parts.push(`- ${turningPoints.length} marked as TURNING POINTS`);
    }
    if (missedWarnings.length > 0) {
      parts.push(`- ${missedWarnings.length} marked as MISSED WARNINGS`);
    }
    if (rightCalls.length > 0) {
      parts.push(`- ${rightCalls.length} marked as RIGHT CALLS at the time`);
    }
    if (outsideControl.length > 0) {
      parts.push(`- ${outsideControl.length} marked as OUTSIDE CONTROL`);
    }

    // Show actual event categories
    const categories = [...new Set(events.map((e) => e.category))];
    parts.push(`- Event categories: ${categories.join(", ")}`);
  } else {
    parts.push("\n- No internal events documented");
  }

  // Detected patterns
  if (dyn.detectedPatterns && dyn.detectedPatterns.length > 0) {
    parts.push(
      `\nDetected patterns: ${dyn.detectedPatterns.map((p) => p.replace(/_/g, " ")).join(", ")}`
    );
  }

  return parts.join("\n");
}

/**
 * Extract emotional context from environment module
 */
function extractEnvironmentEmotionalContext(story: Story): string {
  const parts: string[] = [];
  const env = story.environment;

  if (!env) return "";

  parts.push("EXTERNAL ENVIRONMENT:");

  // Market challenges
  const difficultResources =
    env.marketResources?.filter((r) => r.peakAccessibility === "difficult" && !r.notApplicable) ||
    [];
  if (difficultResources.length > 0) {
    parts.push(
      `- DIFFICULT access to: ${difficultResources.map((r) => r.resourceType).join(", ")}`
    );
  }

  // Challenging conditions
  const challengingConditions =
    env.operatingConditions?.filter((c) => c.peakState === "challenging" && !c.notApplicable) || [];
  if (challengingConditions.length > 0) {
    parts.push(
      `- CHALLENGING conditions: ${challengingConditions.map((c) => c.conditionType).join(", ")}`
    );
  }

  // External events
  const events = env.events || [];
  if (events.length > 0) {
    parts.push(`\nEXTERNAL EVENTS FACED (${events.length} total):`);

    const majorFactors = events.filter((e) => e.lookingBack === "major_factor");
    const outsideControl = events.filter((e) => e.lookingBack === "outside_control");

    if (majorFactors.length > 0) {
      parts.push(`- ${majorFactors.length} were MAJOR FACTORS in the outcome`);
    }
    if (outsideControl.length > 0) {
      parts.push(`- ${outsideControl.length} were completely OUTSIDE CONTROL`);
    }

    // Sample events with emotions
    events
      .filter((e) => e.emotionThen === "distressed" || e.emotionThen === "worried")
      .slice(0, 2)
      .forEach((event) => {
        parts.push(`- ${event.category}: caused ${event.emotionThen} feelings`);
      });
  }

  return parts.join("\n");
}

/**
 * Extract emotional context from functional module
 */
function extractFunctionalEmotionalContext(story: Story): string {
  const parts: string[] = [];
  const func = story.functionalMapping;

  if (!func) return "";

  const activeFunctions = func.functions?.filter((f) => f.isActive) || [];

  parts.push(`ORGANIZATIONAL STRUCTURE (${activeFunctions.length} functions mapped):`);

  // Health issues summary
  const healthIssues = activeFunctions.filter(
    (f) =>
      f.healthCheck?.turnover === "high" ||
      f.healthCheck?.staffing === "understaffed" ||
      f.healthCheck?.budgetPressure === "severe" ||
      f.healthCheck?.qualityIssues === "serious" ||
      f.healthCheck?.leadership === "vacuum"
  );

  if (healthIssues.length > 0) {
    parts.push(`\nORGANIZATIONAL HEALTH ISSUES in ${healthIssues.length} functions:`);

    const highTurnover = healthIssues.filter((f) => f.healthCheck?.turnover === "high");
    const understaffed = healthIssues.filter((f) => f.healthCheck?.staffing === "understaffed");
    const budgetPressure = healthIssues.filter((f) => f.healthCheck?.budgetPressure === "severe");
    const qualityIssues = healthIssues.filter((f) => f.healthCheck?.qualityIssues === "serious");
    const leadershipVacuum = healthIssues.filter((f) => f.healthCheck?.leadership === "vacuum");

    if (highTurnover.length > 0) {
      parts.push(`- HIGH TURNOVER in ${highTurnover.length} functions`);
    }
    if (understaffed.length > 0) {
      parts.push(`- UNDERSTAFFING in ${understaffed.length} functions`);
    }
    if (budgetPressure.length > 0) {
      parts.push(`- SEVERE budget pressure in ${budgetPressure.length} functions`);
    }
    if (qualityIssues.length > 0) {
      parts.push(`- SERIOUS quality issues in ${qualityIssues.length} functions`);
    }
    if (leadershipVacuum.length > 0) {
      parts.push(`- LEADERSHIP vacuum in ${leadershipVacuum.length} functions`);
    }
  }

  // Satisfaction issues
  const lowSatisfaction = activeFunctions.filter(
    (f) => f.satisfaction !== null && f.satisfaction <= 2
  );
  if (lowSatisfaction.length > 0) {
    parts.push(`\n${lowSatisfaction.length} functions had low satisfaction ratings`);
  }

  return parts.join("\n");
}

/**
 * Extract emotional context from narrative module
 */
function extractNarrativeEmotionalContext(story: Story): string {
  const parts: string[] = [];
  const narr = story.narrative;

  if (!narr?.sections) return "";

  parts.push("REFLECTIONS & LESSONS:");

  // Count what was shared
  const answeredQuestions = [
    ...narr.sections.understanding,
    ...narr.sections.hindsight,
    ...narr.sections.lessons,
    ...narr.sections.advice,
    ...narr.sections.legacy,
  ].filter((a) => a.answer && a.answer.trim() !== "" && !a.skipped);

  parts.push(`- Shared ${answeredQuestions.length} reflections`);

  // Highlight key sections
  const legacyAnswers = narr.sections.legacy.filter(
    (a) => a.answer && a.answer.trim() !== "" && !a.skipped
  );
  if (legacyAnswers.length > 0) {
    parts.push("- Defined their LEGACY");
  }

  const lessonsAnswers = narr.sections.lessons.filter(
    (a) => a.answer && a.answer.trim() !== "" && !a.skipped
  );
  if (lessonsAnswers.length > 0) {
    parts.push("- Shared key LESSONS learned");
  }

  const adviceAnswers = narr.sections.advice.filter(
    (a) => a.answer && a.answer.trim() !== "" && !a.skipped
  );
  if (adviceAnswers.length > 0) {
    parts.push("- Offered ADVICE to future founders");
  }

  return parts.join("\n");
}

/**
 * Extract chapter-specific emotional context
 */
function extractChapterContext(story: Story, moduleId: ModuleId): string {
  const orgName = story.basicInfo?.organizationName || "the organization";
  const orgType = story.basicInfo?.organizationType?.replace(/_/g, " ") || "business";

  let baseContext = `Organization: ${orgName} (${orgType})`;

  // Add completed chapters count
  const completedCount = story.completedModules.filter((m) => m !== "basic_info").length;
  baseContext += `\nChapters completed: ${completedCount} of 6`;

  // Add module-specific emotional context
  switch (moduleId) {
    case "founder":
      return baseContext + "\n\n" + extractFounderEmotionalContext(story);
    case "financial":
      return baseContext + "\n\n" + extractFinancialEmotionalContext(story);
    case "dynamic":
      return baseContext + "\n\n" + extractDynamicEmotionalContext(story);
    case "environment":
      return baseContext + "\n\n" + extractEnvironmentEmotionalContext(story);
    case "functional":
      return baseContext + "\n\n" + extractFunctionalEmotionalContext(story);
    case "narrative":
      return baseContext + "\n\n" + extractNarrativeEmotionalContext(story);
    default:
      return baseContext;
  }
}

/**
 * Generate therapeutic appraisal using AI
 * Falls back to contextual messages if AI fails
 */
export async function generateTherapeuticAppraisal(
  story: Story,
  lastCompletedModule: ModuleId
): Promise<TherapeuticAppraisal> {
  // Get module metadata
  const currentModuleIndex = MODULES.findIndex((m) => m.id === lastCompletedModule);
  const nextModule = MODULES[currentModuleIndex + 1];
  const isLastModule = !nextModule || lastCompletedModule === "narrative";
  const moduleName = MODULES.find((m) => m.id === lastCompletedModule)?.name || "this chapter";

  // Extract emotional context for this chapter
  const emotionalContext = extractChapterContext(story, lastCompletedModule);

  // If no meaningful context, use fallback immediately
  if (!emotionalContext || emotionalContext.split("\n").length <= 3) {
    console.log(`[Appraisal] No emotional context for ${lastCompletedModule}, using fallback`);
    return getContextualFallback(story, lastCompletedModule);
  }

  const prompt = `You are writing acknowledgment messages for founders documenting their organization's closure.

A founder just completed the "${moduleName}" chapter. Write a brief, respectful acknowledgment.

CRITICAL RULES:
1. NEVER use first person ("I appreciate", "I understand") - there is no persona here
2. NEVER mention the organization name - they know what they're documenting
3. Be BRIEF - 1-2 short sentences max
4. Be RESPECTFUL, not intimate - don't be over-the-top emotional
5. ONLY reference details ACTUALLY shown in the context below - do NOT invent or assume
6. Use second person only ("You've...", "What you...", "This...")
7. If context says "not specified" - don't mention that topic at all

EMOTIONAL CONTEXT FROM THEIR CHAPTER:
${emotionalContext}

WHAT TO GENERATE:
1. "affirmation": A brief, respectful message (1-2 sentences) that:
   - References something specific they shared
   - Acknowledges without being patronizing or overly emotional
   - Uses impersonal or "you" language, NEVER "I" or "we"

2. "anticipation": ${
    isLastModule
      ? "A brief message (1 sentence) noting their story is complete."
      : `A brief message (1 sentence) about the next chapter ("${nextModule?.name}").`
  }

TONE EXAMPLES:
BAD (first person): "I deeply appreciate you sharing this vulnerability"
BAD (over-the-top): "This is uniquely painful and I'm honored you trusted us"
BAD (mentions company): "What you shared about Acme Corp is valuable"

GOOD: "Documenting health impacts like this takes honesty."
GOOD: "The turnover patterns across 4 functions reveal a lot about what was happening."
GOOD: "Recognizing that moment too late is hard to admit - but useful for others."

Format your response as JSON:
{
  "affirmation": "Brief, respectful acknowledgment here...",
  "anticipation": "Brief next step here..."
}`;

  try {
    console.log(`[Appraisal] Generating therapeutic message for module: ${lastCompletedModule}`);

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        temperature: 0.7, // Slightly higher for more warmth and variation
        maxOutputTokens: 512,
      },
    });

    const text = response.text || "";
    console.log("[Appraisal] Raw AI response:", text.substring(0, 300));

    // Parse JSON response
    let jsonStr = text;

    // Remove markdown code blocks if present
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1];
    }

    // Extract JSON object
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[Appraisal] No JSON found in response, using fallback");
      return getContextualFallback(story, lastCompletedModule);
    }

    // Parse JSON
    let parsed;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      // Try fixing common JSON issues
      const fixedJson = jsonMatch[0].replace(/"([^"]*?)"/g, (match) => {
        return match.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
      });
      parsed = JSON.parse(fixedJson);
    }

    // Validate response
    if (!parsed.affirmation || !parsed.anticipation) {
      console.error("[Appraisal] Missing fields in response, using fallback");
      return getContextualFallback(story, lastCompletedModule);
    }

    // Check for generic responses and replace anticipation with weighted version
    let anticipation = parsed.anticipation;
    if (!isLastModule && nextModule) {
      // If AI anticipation is too generic, use weighted version
      const genericPhrases = ["next chapter", "continue your", "more to share", "looking forward"];
      const isGeneric = genericPhrases.some((phrase) =>
        anticipation.toLowerCase().includes(phrase)
      );
      if (isGeneric || anticipation.length < 30) {
        anticipation = getWeightedAnticipation(nextModule.id);
      }
    }

    return {
      affirmation: parsed.affirmation,
      anticipation,
    };
  } catch (error) {
    console.error("[Appraisal] AI generation failed, using fallback:", error);
    return getContextualFallback(story, lastCompletedModule);
  }
}
