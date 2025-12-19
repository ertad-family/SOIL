/**
 * Prompt Builder for Cenotaph Design Generation
 * Issue: #23 Cenotaph creation wizard
 *
 * Two-step creative process:
 * 1. Build organization context for Gemini to generate unique concepts
 * 2. Visual requirements are added during image generation
 *
 * Philosophy: Cenotaphs are artistic sculptures representing founder's
 * creative vision and organization's character - NOT tombstones or funeral monuments.
 */

import type { OrganizationContext, StoryContext } from "@/types/cenotaph";

/**
 * Build organization context string for concept generation
 * This provides all the creative fuel for Gemini to generate unique ideas
 */
export function buildOrganizationContext(
  organization: OrganizationContext,
  story: StoryContext,
  userWishes: string
): string {
  // Calculate lifespan
  let lifespan = "";
  if (organization.foundedDate && organization.closedDate) {
    const startYear = organization.foundedDate.split("-")[0];
    const endYear = organization.closedDate.split("-")[0];
    const years = parseInt(endYear) - parseInt(startYear);
    lifespan = `Existed ${startYear}-${endYear} (${years} years)`;
  }

  // Build location string
  const location = organization.location || "Unknown location";

  // Build the context
  const parts: string[] = [];

  parts.push(`ORGANIZATION: "${organization.name}"`);
  parts.push(`TYPE: ${organization.type || "Business"}`);
  parts.push(`INDUSTRY: ${organization.industry || "General"}`);

  if (lifespan) {
    parts.push(`LIFESPAN: ${lifespan}`);
  }

  if (organization.peakTeamSize) {
    parts.push(`SCALE: ${organization.peakTeamSize} people at peak`);
  }

  parts.push(`LOCATION: ${location}`);

  // Story context
  if (story.epitaph) {
    parts.push(`\nFOUNDER'S MESSAGE: "${story.epitaph}"`);
  }

  if (story.mainLesson) {
    parts.push(`KEY LESSON LEARNED: "${story.mainLesson}"`);
  }

  if (story.closureType) {
    parts.push(`CLOSURE TYPE: ${story.closureType}`);
  }

  if (story.keyEvents && story.keyEvents.length > 0) {
    parts.push(`KEY MOMENTS: ${story.keyEvents.slice(0, 3).join("; ")}`);
  }

  // User creative direction
  if (userWishes && userWishes.trim()) {
    parts.push(`\nFOUNDER'S CREATIVE DIRECTION: "${userWishes}"`);
  } else {
    parts.push(
      `\nFOUNDER'S CREATIVE DIRECTION: Open to any artistic interpretation. Surprise them with something beautiful and unique.`
    );
  }

  return parts.join("\n");
}

/**
 * Validate user prompt for inappropriate content
 */
export function validateUserPrompt(prompt: string): { valid: boolean; error?: string } {
  if (!prompt || prompt.trim().length === 0) {
    return { valid: true }; // Empty is fine, we have defaults
  }

  if (prompt.length > 2000) {
    return { valid: false, error: "Creative direction must be under 2000 characters" };
  }

  // Basic content filtering
  const inappropriateTerms = [
    "explicit",
    "violent",
    "gore",
    "nsfw",
    "nude",
    "sexual",
    "weapon",
    "gun",
    "blood",
    "kill",
    "hate",
  ];

  const lowerPrompt = prompt.toLowerCase();
  for (const term of inappropriateTerms) {
    if (lowerPrompt.includes(term)) {
      return {
        valid: false,
        error:
          "Creative direction contains inappropriate content. Please describe your artistic vision respectfully.",
      };
    }
  }

  return { valid: true };
}
