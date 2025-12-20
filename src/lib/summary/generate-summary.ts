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

// Initialize Google GenAI client with Vertex AI
const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GOOGLE_CLOUD_PROJECT_ID || "",
  location: process.env.VERTEX_AI_LOCATION || "us-central1",
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
      parts.push(`Financial events: ${fin.events.length} significant financial events occurred.`);
    }
    if (fin.metrics) {
      parts.push("Financial metrics were tracked during operations.");
    }
  }

  // Dynamic picture (internal events)
  if (story.completedModules.includes("dynamic")) {
    const dyn = story.dynamicPicture;
    if (dyn.events && dyn.events.length > 0) {
      const eventCategories = [...new Set(dyn.events.map((e) => e.category))];
      parts.push(
        `Internal events: Experienced ${dyn.events.length} notable events across ${eventCategories.join(", ")}.`
      );
    }
    if (dyn.detectedPatterns && dyn.detectedPatterns.length > 0) {
      parts.push(`Patterns detected: ${dyn.detectedPatterns.join(", ")}.`);
    }
  }

  // Environment
  if (story.completedModules.includes("environment")) {
    const env = story.environment;
    if (env.events && env.events.length > 0) {
      parts.push(
        `External factors: ${env.events.length} external events impacted the organization.`
      );
    }
    if (env.resourceAssessments && env.resourceAssessments.length > 0) {
      const challengingResources = env.resourceAssessments.filter(
        (r) => r.peakAvailability === "low" || r.peakCost === "high"
      );
      if (challengingResources.length > 0) {
        parts.push(`Resource challenges were present in ${challengingResources.length} areas.`);
      }
    }
  }

  // Founder context
  if (story.completedModules.includes("founder")) {
    const founder = story.founderContext;
    const bg = founder.background;

    if (bg.priorExperience) {
      const expLabel =
        bg.priorExperience === "first_time"
          ? "first-time founder"
          : bg.priorExperience === "tried_before"
            ? "experienced entrepreneur"
            : "serial entrepreneur";
      parts.push(`Founder profile: ${expLabel}.`);
    }

    if (
      bg.healthImpact === "significantly" ||
      bg.relationshipImpact === "significantly" ||
      bg.financeImpact === "significantly"
    ) {
      parts.push("The founder experienced significant personal impact.");
    }

    if (founder.events && founder.events.length > 0) {
      parts.push(`Personal challenges: ${founder.events.length} life events affected the journey.`);
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
    };
  }

  const prompt = `You are an organizational researcher writing a privacy-stripped summary of an organization's story.

IMPORTANT PRIVACY RULES:
1. NEVER mention specific names of people, companies, or places
2. NEVER include specific dates - use relative terms like "early stage", "after two years"
3. NEVER include emotional language about the founder's feelings
4. Focus ONLY on organizational patterns, lessons, and factual observations
5. Write in third person, research-ready prose

DATA FROM COMPLETED INTERVIEW MODULES:
${extracted.context}

YOUR TASK:
Write a 2-3 paragraph summary (150-250 words) that:
1. Describes the organization's type and scale WITHOUT naming it
2. Highlights key organizational patterns and challenges
3. Notes any significant lessons or insights

The summary should feel like reading a research case study, not a personal story.

Additionally, extract 3-5 key facts as bullet points.

Format your response as JSON:
{
  "summary": "Your 2-3 paragraph summary here...",
  "keyFacts": ["Fact 1", "Fact 2", "Fact 3"],
  "closurePattern": "one of: cash_crisis, market_shift, team_breakdown, external_shock, strategic_pivot, founder_burnout, or null if unclear"
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
    };
  }
}
