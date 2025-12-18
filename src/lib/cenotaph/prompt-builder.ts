/**
 * Prompt Builder for Cenotaph Design Generation
 * Issue: #23 Cenotaph creation wizard
 *
 * Combines SOIL design rules with organization data, story context,
 * and user wishes to create prompts for AI image generation.
 */

import type { OrganizationContext, StoryContext } from '@/types/cenotaph'

/**
 * SOIL Platform Design Rules
 * These rules ensure all generated cenotaphs maintain a dignified,
 * memorial-appropriate aesthetic consistent with the SOIL brand.
 */
const SOIL_DESIGN_RULES = `
You are creating a memorial monument design for a failed organization. Follow these strict design guidelines:

STYLE REQUIREMENTS:
- Aesthetic: Dignified, timeless memorial architecture inspired by classical monuments, columbariums, and cenotaphs
- Form: A single, elegant monument structure suitable for display in a memorial columbarium
- Color palette: Warm neutrals - marble white, limestone beige, bronze accents, slate gray. Muted, respectful tones
- Materials: Appear to be carved stone, bronze, or marble. Premium, lasting materials
- Lighting: Soft, contemplative lighting suggesting a sacred space
- Mood: Respectful, beautiful, contemplative - honoring the organization's legacy

MANDATORY CONSTRAINTS:
- The monument should be isolated on a simple, neutral background (dark gray or black)
- Square format (1024x1024 pixels)
- The design should be suitable for later 3D model conversion
- Include subtle design elements that reflect the organization's industry/purpose
- May include tasteful text rendering (organization name or a short phrase)

ABSOLUTELY AVOID:
- Gaming aesthetics, sci-fi elements, or futuristic styles
- Dark/gothic, macabre, or death-focused imagery
- Corporate/tech startup aesthetic (no logos, gradients, or modern branding)
- Garish colors, neon, or high-saturation palettes
- Cluttered or complex backgrounds
- Cartoonish or whimsical elements
- Generic tombstone/gravestone clichés
`

/**
 * Industry-specific design suggestions
 */
const INDUSTRY_DESIGN_HINTS: Record<string, string> = {
  tech_product: 'Incorporate subtle geometric patterns or circuit-inspired motifs in the stone carving. Consider a modernist monument form.',
  services: 'Feature flowing, organic lines suggesting human connection. Consider hands clasped or intertwined elements.',
  ecommerce: 'Include merchant or marketplace symbolism - scales, columns, or archway motifs.',
  manufacturing: 'Incorporate industrial elements transformed into elegant forms - gears as decorative rosettes, structural beams as classical columns.',
  ngo: 'Feature symbols of community, growth, or helping hands. Consider a monument with multiple elements representing collective effort.',
  media: 'Include storytelling elements - open books, scrolls, or theatrical masks rendered in classical style.',
  // Default for unknown types
  default: 'Create a balanced, classical monument that conveys dignity and permanence.'
}

/**
 * Build the complete prompt for cenotaph generation
 */
export function buildCenotaphPrompt(
  organization: OrganizationContext,
  story: StoryContext,
  userWishes: string,
  variationIndex: number = 0
): string {
  const industryHint = INDUSTRY_DESIGN_HINTS[organization.type || 'default']
    || INDUSTRY_DESIGN_HINTS.default

  // Calculate lifespan
  let lifespan = 'Unknown duration'
  if (organization.foundedDate && organization.closedDate) {
    const startYear = organization.foundedDate.split('-')[0]
    const endYear = organization.closedDate.split('-')[0]
    lifespan = `${startYear} - ${endYear}`
  }

  // Variation instructions for generating different options
  const variationInstructions = [
    'Create a vertical monument with a classical column or obelisk form.',
    'Create a horizontal monument with a bench-like or altar form.',
    'Create a unique, artistic monument with organic or abstract sculptural elements.'
  ]

  const prompt = `
${SOIL_DESIGN_RULES}

ORGANIZATION CONTEXT:
- Name: "${organization.name}"
- Industry: ${organization.industry || organization.type || 'General business'}
- Type: ${organization.type || 'Business'}
- Active period: ${lifespan}
- Peak team size: ${organization.peakTeamSize ? `${organization.peakTeamSize} people` : 'Unknown'}
- Location: ${organization.location || 'Unknown'}

INDUSTRY-SPECIFIC GUIDANCE:
${industryHint}

MEMORIAL ESSENCE (from founder's reflection):
- Epitaph: "${story.epitaph || 'In memoriam'}"
- Key lesson learned: "${story.mainLesson || 'Every ending teaches us something valuable'}"
- Closure type: ${story.closureType || 'Unknown'}

FOUNDER'S DESIGN WISHES:
${userWishes || 'No specific preferences provided. Create a dignified, beautiful memorial.'}

VARIATION INSTRUCTION:
${variationInstructions[variationIndex % variationInstructions.length]}

Generate a unique, beautiful memorial monument design that honors the organization "${organization.name}" while following all the guidelines above. The monument should tell the story of this organization's journey and legacy.
`.trim()

  return prompt
}

/**
 * Build a regeneration prompt (for individual option regeneration)
 */
export function buildRegenerationPrompt(
  organization: OrganizationContext,
  story: StoryContext,
  userWishes: string,
  feedbackOnPrevious: string
): string {
  const basePrompt = buildCenotaphPrompt(organization, story, userWishes, Math.floor(Math.random() * 3))

  return `
${basePrompt}

FEEDBACK ON PREVIOUS DESIGN:
The user wants something different. They said: "${feedbackOnPrevious}"
Please create a design that addresses this feedback while maintaining the memorial aesthetic.
`.trim()
}

/**
 * Validate user prompt for inappropriate content
 */
export function validateUserPrompt(prompt: string): { valid: boolean; error?: string } {
  if (!prompt || prompt.trim().length === 0) {
    return { valid: true } // Empty is fine, we have defaults
  }

  if (prompt.length > 2000) {
    return { valid: false, error: 'Design wishes must be under 2000 characters' }
  }

  // Basic content filtering (can be expanded)
  const inappropriateTerms = [
    'explicit', 'violent', 'gore', 'nsfw', 'nude', 'sexual',
    'weapon', 'gun', 'blood', 'death', 'kill', 'hate'
  ]

  const lowerPrompt = prompt.toLowerCase()
  for (const term of inappropriateTerms) {
    if (lowerPrompt.includes(term)) {
      return {
        valid: false,
        error: 'Design wishes contain inappropriate content. Please describe your memorial preferences respectfully.'
      }
    }
  }

  return { valid: true }
}
