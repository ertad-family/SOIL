/**
 * AI Summary Generation Service
 * Issue: #20 Update the story page
 *
 * Generates privacy-stripped, research-ready summaries from completed interview modules.
 * Uses Gemini Flash for fast, cost-effective text generation.
 *
 * The summary serves three purposes:
 * 1. Live feedback to founders during interview (motivation)
 * 2. Input for cenotaph design generation
 * 3. Public organization page content (details and lessons)
 */

import { GoogleGenAI } from "@google/genai";
import type { Story, ModuleId, AISummary, OrganizationType } from "@/types/interview";
import { MODULES } from "@/types/interview";

// Initialize Google GenAI client with Vertex AI
// Credentials are passed directly via googleAuthOptions instead of GOOGLE_APPLICATION_CREDENTIALS file
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

const TEXT_MODEL = "gemini-2.0-flash-001";

/**
 * Extract key facts from a story's completed modules
 * This prepares the data for the AI to summarize
 */
function extractStoryData(story: Story): {
  hasData: boolean;
  context: string;
  organizationType: OrganizationType | null;
  industry: string | null;
  lifespanMonths: number | null;
  peakTeamSize: number | null;
} {
  const parts: string[] = [];

  // Basic organization info
  const org = story.basicInfo;
  if (org.organizationName) {
    parts.push(
      `Organization: A ${org.organizationType || "business"} in the ${org.industry || "unknown"} industry.`
    );
  }

  // Timeline
  if (org.foundedDate && org.closedDate) {
    parts.push(`Timeline: Founded ${org.foundedDate}, closed ${org.closedDate}.`);
  }

  if (org.peakTeamSize) {
    parts.push(`Team: Reached ${org.peakTeamSize} people at peak.`);
  }

  if (org.stageAtClosure) {
    parts.push(`Stage at closure: ${org.stageAtClosure}.`);
  }

  // Functional mapping
  if (
    story.completedModules.includes("functional") &&
    story.functionalMapping.functions.length > 0
  ) {
    const activeFunctions = story.functionalMapping.functions.filter((f) => f.isActive);
    const functionSummary = activeFunctions
      .slice(0, 5)
      .map((f) => f.customName || f.functionId.replace(/_/g, " "))
      .join(", ");
    parts.push(
      `Key functions: ${functionSummary}${activeFunctions.length > 5 ? ` and ${activeFunctions.length - 5} more` : ""}.`
    );

    // Health patterns
    const healthIssues = activeFunctions.filter(
      (f) =>
        f.healthCheck &&
        (f.healthCheck.turnover === "high" ||
          f.healthCheck.staffing === "understaffed" ||
          f.healthCheck.budgetPressure === "severe" ||
          f.healthCheck.qualityIssues === "serious")
    );
    if (healthIssues.length > 0) {
      parts.push(`Organizational challenges were present in ${healthIssues.length} functions.`);
    }
  }

  // Financial picture
  if (story.completedModules.includes("financial")) {
    const fin = story.financialPicture;
    if (fin.events && fin.events.length > 0) {
      parts.push(`FINANCIAL EVENTS (${fin.events.length} total):`);
      fin.events.forEach((event, idx) => {
        const eventParts = [`  Event ${idx + 1}:`];
        if (event.date) eventParts.push(`Date: ${event.date}`);
        if (event.category) eventParts.push(`Category: ${event.category.replace(/_/g, " ")}`);
        if (event.subType) eventParts.push(`Type: ${event.subType}`);
        if (event.severity) eventParts.push(`Severity: ${event.severity}`);
        if (event.lookingBack)
          eventParts.push(`Reflection: ${event.lookingBack.replace(/_/g, " ")}`);
        if (event.details) eventParts.push(`Details: ${event.details}`);
        parts.push(eventParts.join(" | "));
      });
    }
    if (fin.metrics) {
      parts.push("Financial metrics were tracked during operations.");
    }
  }

  // Dynamic picture (internal events)
  if (story.completedModules.includes("dynamic")) {
    const dyn = story.dynamicPicture;
    if (dyn.events && dyn.events.length > 0) {
      parts.push(`INTERNAL EVENTS (${dyn.events.length} total):`);
      dyn.events.forEach((event, idx) => {
        const eventParts = [`  Event ${idx + 1}:`];
        if (event.date) eventParts.push(`Date: ${event.date}`);
        if (event.category) eventParts.push(`Category: ${event.category.replace(/_/g, " ")}`);
        if (event.subType) eventParts.push(`Type: ${event.subType}`);
        if (event.emotionThen) eventParts.push(`Emotion at the time: ${event.emotionThen}`);
        if (event.emotionTags && event.emotionTags.length > 0) {
          eventParts.push(`Feelings: ${event.emotionTags.join(", ")}`);
        }
        if (event.lookingBack)
          eventParts.push(`Reflection: ${event.lookingBack.replace(/_/g, " ")}`);
        if (event.details) eventParts.push(`Details: ${event.details}`);
        parts.push(eventParts.join(" | "));
      });
    }
    if (dyn.detectedPatterns && dyn.detectedPatterns.length > 0) {
      parts.push(`Patterns detected: ${dyn.detectedPatterns.join(", ")}.`);
    }
  }

  // Environment
  if (story.completedModules.includes("environment")) {
    const env = story.environment;

    // Market resources
    if (env.marketResources && env.marketResources.length > 0) {
      const applicableResources = env.marketResources.filter((r) => !r.notApplicable);
      const notApplicableResources = env.marketResources.filter((r) => r.notApplicable);

      if (applicableResources.length > 0) {
        parts.push(`MARKET RESOURCES (${applicableResources.length} assessed):`);
        applicableResources.forEach((resource) => {
          const resourceParts = [
            `  ${resource.resourceType.charAt(0).toUpperCase() + resource.resourceType.slice(1)}:`,
          ];
          if (resource.context) resourceParts.push(`Context: ${resource.context}`);
          if (resource.peakAccessibility)
            resourceParts.push(`Accessibility: ${resource.peakAccessibility}`);
          if (resource.accessibilityTrend)
            resourceParts.push(`Trend: ${resource.accessibilityTrend}`);
          if (resource.peakCost) resourceParts.push(`Cost: ${resource.peakCost}`);
          if (resource.peakCompetition)
            resourceParts.push(`Competition: ${resource.peakCompetition}`);
          parts.push(resourceParts.join(" | "));
        });

        const challengingResources = applicableResources.filter(
          (r) =>
            r.peakAccessibility === "difficult" ||
            r.peakCost === "high" ||
            r.peakCompetition === "intense"
        );
        if (challengingResources.length > 0) {
          parts.push(`Resource challenges were present in ${challengingResources.length} areas.`);
        }
      }

      if (notApplicableResources.length > 0) {
        parts.push(
          `Not applicable resources: ${notApplicableResources.map((r) => r.resourceType).join(", ")}`
        );
      }
    }

    // Operating conditions
    if (env.operatingConditions && env.operatingConditions.length > 0) {
      const applicableConditions = env.operatingConditions.filter((c) => !c.notApplicable);
      const notApplicableConditions = env.operatingConditions.filter((c) => c.notApplicable);

      if (applicableConditions.length > 0) {
        parts.push(`OPERATING CONDITIONS (${applicableConditions.length} assessed):`);
        applicableConditions.forEach((condition) => {
          const condParts = [
            `  ${condition.conditionType.charAt(0).toUpperCase() + condition.conditionType.slice(1)}:`,
          ];
          if (condition.context) condParts.push(`Context: ${condition.context}`);
          if (condition.peakState) condParts.push(`State: ${condition.peakState}`);
          if (condition.trend) condParts.push(`Trend: ${condition.trend}`);
          parts.push(condParts.join(" | "));
        });

        const challengingConditions = applicableConditions.filter(
          (c) => c.peakState === "challenging"
        );
        if (challengingConditions.length > 0) {
          parts.push(
            `Challenging conditions were present in ${challengingConditions.length} areas.`
          );
        }
      }

      if (notApplicableConditions.length > 0) {
        parts.push(
          `Not applicable conditions: ${notApplicableConditions.map((c) => c.conditionType).join(", ")}`
        );
      }
    }

    // External events
    if (env.events && env.events.length > 0) {
      parts.push(`EXTERNAL EVENTS (${env.events.length} total):`);
      env.events.forEach((event, idx) => {
        const eventParts = [`  Event ${idx + 1}:`];
        if (event.date) eventParts.push(`Date: ${event.date}`);
        if (event.category) eventParts.push(`Category: ${event.category.replace(/_/g, " ")}`);
        if (event.subType) eventParts.push(`Type: ${event.subType}`);
        if (event.emotionThen) eventParts.push(`Emotion at the time: ${event.emotionThen}`);
        if (event.emotionTags && event.emotionTags.length > 0) {
          eventParts.push(`Feelings: ${event.emotionTags.join(", ")}`);
        }
        if (event.lookingBack)
          eventParts.push(`Reflection: ${event.lookingBack.replace(/_/g, " ")}`);
        if (event.responses && event.responses.length > 0) {
          eventParts.push(`Responses: ${event.responses.join(", ")}`);
        }
        if (event.details) eventParts.push(`Details: ${event.details}`);
        parts.push(eventParts.join(" | "));
      });
    }
  }

  // Founder context
  if (story.completedModules.includes("founder")) {
    const founder = story.founderContext;
    const bg = founder.background;

    parts.push("FOUNDER CONTEXT:");

    // Part A: Before It Began
    if (bg.priorExperience) {
      const expLabel =
        bg.priorExperience === "first_time"
          ? "first-time founder"
          : bg.priorExperience === "tried_before"
            ? "had tried entrepreneurship before"
            : "serial entrepreneur";
      parts.push(`  Prior experience: ${expLabel}`);
    }
    if (bg.domainKnowledge) {
      const domainLabel =
        bg.domainKnowledge === "learning"
          ? "was learning the domain"
          : bg.domainKnowledge === "knew_basics"
            ? "knew the basics"
            : "had deep expertise";
      parts.push(`  Domain knowledge: ${domainLabel}`);
    }
    if (bg.lifeSituation) {
      const lifeLabel =
        bg.lifeSituation === "stable"
          ? "in a stable life situation"
          : bg.lifeSituation === "in_transition"
            ? "in life transition"
            : "ready for a leap";
      parts.push(`  Life situation: ${lifeLabel}`);
    }

    // Part B: The Beginning
    if (bg.commitment) {
      const commitLabel =
        bg.commitment === "full_time"
          ? "went full-time from the start"
          : bg.commitment === "eased_in"
            ? "eased in gradually"
            : "never went full-time";
      parts.push(`  Commitment: ${commitLabel}`);
    }
    if (bg.startedWith) {
      const teamLabel =
        bg.startedWith === "solo"
          ? "started solo"
          : bg.startedWith === "one_other"
            ? "started with one other person"
            : "started with a team";
      parts.push(`  Team formation: ${teamLabel}`);
    }
    if (bg.howFoundCoFounders) {
      parts.push(`  How found co-founders: ${bg.howFoundCoFounders}`);
    }
    if (bg.roleClarity) {
      const roleLabel =
        bg.roleClarity === "crystal_clear"
          ? "crystal clear roles"
          : bg.roleClarity === "figured_out"
            ? "figured out roles over time"
            : "roles were always fuzzy";
      parts.push(`  Role clarity: ${roleLabel}`);
    }

    // Part C: Along the Way
    if (bg.motivationEvolution) {
      const motivLabel =
        bg.motivationEvolution === "grew_stronger"
          ? "motivation grew stronger"
          : bg.motivationEvolution === "stayed_steady"
            ? "motivation stayed steady"
            : "motivation started fading";
      parts.push(`  Motivation evolution: ${motivLabel}`);
      if (bg.motivationEvolution === "started_fading" && bg.fadingNoticedAt) {
        parts.push(`  Noticed fading at: ${bg.fadingNoticedAt.replace(/_/g, " ")}`);
      }
    }
    if (bg.cofounderRelationship) {
      const cofounderLabel =
        bg.cofounderRelationship === "got_closer"
          ? "co-founder relationship got closer"
          : bg.cofounderRelationship === "stayed_solid"
            ? "relationship stayed solid"
            : bg.cofounderRelationship === "got_hard"
              ? "relationship became difficult"
              : "co-founders split";
      parts.push(`  Co-founder dynamics: ${cofounderLabel}`);
    }
    if (bg.investmentLevel) {
      const investLabel =
        bg.investmentLevel === "yes_everything"
          ? "invested everything (time, money, relationships)"
          : bg.investmentLevel === "kept_boundaries"
            ? "maintained some boundaries"
            : "pulled back investment over time";
      parts.push(`  Personal investment: ${investLabel}`);
    }

    // Part D: The Cost
    if (bg.healthImpact) {
      parts.push(`  Health impact: ${bg.healthImpact.replace(/_/g, " ")}`);
    }
    if (bg.relationshipImpact) {
      parts.push(`  Relationship impact: ${bg.relationshipImpact.replace(/_/g, " ")}`);
    }
    if (bg.financeImpact) {
      parts.push(`  Financial impact: ${bg.financeImpact.replace(/_/g, " ")}`);
    }
    if (bg.recoveryTime) {
      const recoveryLabel =
        bg.recoveryTime === "still_working" ? "still working on recovery" : bg.recoveryTime;
      parts.push(`  Recovery time: ${recoveryLabel}`);
    }

    // Part E: Now
    if (bg.currentFeeling) {
      parts.push(`  Current feeling: ${bg.currentFeeling}`);
    }
    if (bg.whatHelpedProcess) {
      parts.push(`  What helped process: ${bg.whatHelpedProcess}`);
    }
    if (bg.wouldDoAgain) {
      const againLabel =
        bg.wouldDoAgain === "yes_no_hesitation"
          ? "would do it again without hesitation"
          : bg.wouldDoAgain === "yes_differently"
            ? "would do it again but differently"
            : bg.wouldDoAgain === "probably_not"
              ? "probably wouldn't do it again"
              : "definitely wouldn't do it again";
      parts.push(`  Would do again: ${againLabel}`);
    }

    // Personal events
    if (founder.events && founder.events.length > 0) {
      parts.push(`PERSONAL LIFE EVENTS (${founder.events.length} total):`);
      founder.events.forEach((event, idx) => {
        const eventParts = [`  Event ${idx + 1}:`];
        if (event.date) eventParts.push(`Date: ${event.date}`);
        if (event.category) eventParts.push(`Category: ${event.category.replace(/_/g, " ")}`);
        if (event.subType) eventParts.push(`Type: ${event.subType}`);
        if (event.capacityImpact) {
          eventParts.push(`Capacity impact: ${event.capacityImpact.replace(/_/g, " ")}`);
        }
        if (event.organizationAdapted) {
          eventParts.push(`Organization adapted: ${event.organizationAdapted.replace(/_/g, " ")}`);
        }
        if (event.lookingBack) {
          eventParts.push(`Looking back: ${event.lookingBack.replace(/_/g, " ")}`);
        }
        if (event.details) eventParts.push(`Details: ${event.details}`);
        parts.push(eventParts.join(" | "));
      });
    }
  }

  // Narrative (lessons and reflections)
  if (story.completedModules.includes("narrative")) {
    const narr = story.narrative;
    const allAnswers = [
      ...narr.sections.understanding,
      ...narr.sections.hindsight,
      ...narr.sections.lessons,
      ...narr.sections.advice,
      ...narr.sections.legacy,
    ].filter((a) => a.answer && a.answer.trim() !== "" && !a.skipped);

    if (allAnswers.length > 0) {
      parts.push(
        `Reflection: The founder shared ${allAnswers.length} insights about lessons and legacy.`
      );
    }
  }

  // Calculate lifespan in months
  let lifespanMonths: number | null = null;
  if (org.foundedDate && org.closedDate) {
    const founded = new Date(org.foundedDate);
    const closed = new Date(org.closedDate);
    lifespanMonths = Math.round(
      (closed.getTime() - founded.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
  }

  return {
    hasData: parts.length > 0,
    context: parts.join("\n"),
    organizationType: org.organizationType,
    industry: org.industry,
    lifespanMonths,
    peakTeamSize: org.peakTeamSize,
  };
}

/**
 * Generate a privacy-stripped summary using Gemini
 */
export async function generateStorySummary(
  story: Story,
  lastCompletedModule: ModuleId
): Promise<AISummary> {
  const extracted = extractStoryData(story);

  // Determine next chapter for anticipation message
  const currentModuleIndex = MODULES.findIndex((m) => m.id === lastCompletedModule);
  const nextModule = MODULES[currentModuleIndex + 1];
  const isLastModule = !nextModule || lastCompletedModule === "narrative";

  if (!extracted.hasData) {
    return {
      text: "Complete your first chapter to see what we're learning from your story.",
      lastModuleProcessed: lastCompletedModule,
      keyFacts: [],
      organizationType: null,
      industry: null,
      lifespanMonths: null,
      peakTeamSize: null,
      closurePattern: null,
      appraisal: null,
    };
  }

  // Determine chapter context for appraisal
  const completedModuleName =
    MODULES.find((m) => m.id === lastCompletedModule)?.name || "this chapter";
  const nextModuleName = nextModule?.name || null;
  const chaptersCompleted = story.completedModules.filter((m) => m !== "basic_info").length;

  const prompt = `You are an organizational researcher writing a privacy-stripped summary of an organization's story.

IMPORTANT PRIVACY RULES:
1. NEVER mention specific names of people, companies, or places
2. NEVER include specific dates - use relative terms like "early stage", "after two years"
3. NEVER include emotional language about the founder's feelings
4. Focus ONLY on organizational patterns, lessons, and factual observations
5. Write in third person, research-ready prose

DATA FROM COMPLETED INTERVIEW MODULES:
${extracted.context}

CONTEXT FOR APPRAISAL:
- The founder just completed: "${completedModuleName}"
- Chapters completed so far: ${chaptersCompleted}
- ${isLastModule ? "This was the FINAL chapter! The story is now complete." : `Next chapter: "${nextModuleName}"`}

YOUR TASK:
1. Write a 2-3 paragraph summary (150-250 words) that:
   - Describes the organization's type and scale WITHOUT naming it
   - Highlights key organizational patterns and challenges
   - Notes any significant lessons or insights
   The summary should feel like reading a research case study, not a personal story.

2. Extract 3-5 key facts as bullet points.

3. Generate TWO motivational messages for the founder:
   - "affirmation": A warm, encouraging message (1-2 sentences) that acknowledges what they've shared in this chapter and validates their effort. Be specific to what they documented. Use second person ("You've...").
   - "anticipation": ${isLastModule ? "A celebratory message congratulating them on completing their story and thanking them for preserving this legacy." : `A brief message (1 sentence) building excitement for the next chapter ("${nextModuleName}"). Hint at what insights await.`}

Format your response as JSON:
{
  "summary": "Your 2-3 paragraph summary here...",
  "keyFacts": ["Fact 1", "Fact 2", "Fact 3"],
  "closurePattern": "one of: cash_crisis, market_shift, team_breakdown, external_shock, strategic_pivot, founder_burnout, or null if unclear",
  "appraisal": {
    "affirmation": "Your affirmation message here...",
    "anticipation": "Your anticipation message here..."
  }
}`;

  try {
    console.log(`Generating AI summary after module: ${lastCompletedModule}`);

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        temperature: 0.3, // Lower temperature for more consistent, factual output
        maxOutputTokens: 1024,
      },
    });

    const text = response.text || "";
    console.log("Raw AI response:", text.substring(0, 500));

    // Parse the JSON response - handle markdown code blocks
    let jsonStr = text;

    // Remove markdown code blocks if present
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1];
    }

    // Extract JSON object
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in response:", text);
      throw new Error("Failed to parse AI response as JSON");
    }

    // Try to parse directly first
    let parsed;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      // If direct parsing fails, try fixing common issues
      // Remove control characters but preserve JSON structure
      const fixedJson = jsonMatch[0]
        // Replace unescaped newlines inside strings (between quotes)
        .replace(/"([^"]*?)"/g, (match) => {
          return match.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
        });

      console.log("Attempting to parse fixed JSON:", fixedJson.substring(0, 200));
      parsed = JSON.parse(fixedJson);
    }

    return {
      text: parsed.summary || "Summary generation in progress...",
      lastModuleProcessed: lastCompletedModule,
      keyFacts: parsed.keyFacts || [],
      organizationType: extracted.organizationType,
      industry: extracted.industry,
      lifespanMonths: extracted.lifespanMonths,
      peakTeamSize: extracted.peakTeamSize,
      closurePattern: parsed.closurePattern || null,
      appraisal: parsed.appraisal || null,
    };
  } catch (error) {
    console.error("Error generating summary:", error);

    // Return a graceful fallback
    return {
      text: `Based on ${story.completedModules.length} completed chapters, we're building an understanding of your organization's journey. The full summary will be available after processing.`,
      lastModuleProcessed: lastCompletedModule,
      keyFacts: [],
      organizationType: extracted.organizationType,
      industry: extracted.industry,
      lifespanMonths: extracted.lifespanMonths,
      peakTeamSize: extracted.peakTeamSize,
      closurePattern: null,
      appraisal: {
        affirmation:
          "Thank you for sharing this part of your journey. Every detail you provide helps build a complete picture.",
        anticipation: isLastModule
          ? "Your story is now complete. Thank you for preserving this legacy."
          : `Next up: ${nextModuleName || "the next chapter"} awaits.`,
      },
    };
  }
}
