/**
 * Prompt Builder for Cenotaph Design Generation
 * Issue: #23 Cenotaph creation wizard
 *
 * Combines SOIL design rules with organization data, story context,
 * and user wishes to create prompts for AI image generation.
 *
 * Philosophy: Cenotaphs are artistic sculptures representing founder's
 * creative vision and organization's character - NOT tombstones or funeral monuments.
 */

import type { OrganizationContext, StoryContext } from '@/types/cenotaph'

/**
 * SOIL Platform Design Rules
 * Focus on artistic sculpture and creative expression.
 */
const SOIL_DESIGN_RULES = `
You are creating an artistic sculpture design that represents an organization's unique character and legacy. This is a piece of fine art - a creative expression of the founder's vision.

CORE CONCEPT:
- This is a SCULPTURE, not a tombstone or grave marker
- Think museum-quality art piece, gallery sculpture, or public art installation
- The design should spark curiosity and admiration, not mourning
- Focus on beauty, creativity, and artistic excellence

STYLE FREEDOM:
- You have creative freedom to explore any artistic style
- Can be abstract, geometric, organic, futuristic, surreal, kinetic-inspired, or architectural
- Bold and unique is better than safe and generic
- Each design should feel like it could win an art competition

TECHNICAL REQUIREMENTS:
- The sculpture should be isolated on a simple dark background (dark gray or black)
- Square format, suitable for later 3D model conversion
- Clean, well-defined forms with interesting visual depth

CRITICAL - NO TEXT OR NAMES:
- NEVER put any text, letters, words, or the organization name on the sculpture
- The organization name is provided ONLY for creative inspiration about the form and character
- The sculpture must be purely visual/sculptural with NO readable text of any kind
- This is a strict privacy requirement

AVOID:
- Cemetery/funeral aesthetics (no crosses, tombstones, grave markers)
- Morbid or dark themes
- Generic corporate logos or branding
- Cluttered or chaotic compositions
- Cheap or low-quality appearance
- ANY text, letters, numbers, or written words on the sculpture
`

/**
 * Artistic style variations - each creates a distinctly different aesthetic
 */
const STYLE_VARIATIONS = [
  {
    name: 'Abstract Geometric',
    instruction: `Create an ABSTRACT GEOMETRIC sculpture. Use bold shapes - cubes, spheres, pyramids, toruses - combined in unexpected ways. Think Brancusi meets modern architecture. Clean lines, mathematical beauty, spatial tension. The forms should interlock or balance in visually striking ways.`
  },
  {
    name: 'Organic Flowing',
    instruction: `Create an ORGANIC FLOWING sculpture. Inspired by nature - waves, growth, DNA helixes, wind patterns, flowing water. Smooth curves, continuous surfaces, sense of movement frozen in time. Think Zaha Hadid or Art Nouveau reimagined. Elegant, alive, graceful.`
  },
  {
    name: 'Futuristic Tech',
    instruction: `Create a FUTURISTIC TECH-INSPIRED sculpture. Sleek, innovative, forward-looking. Could incorporate holographic elements, floating components, energy fields, crystalline structures. Think sci-fi concept art meets high-end product design. Premium, cutting-edge, aspirational.`
  }
]

/**
 * Industry-specific artistic interpretations
 */
const INDUSTRY_ARTISTIC_THEMES: Record<string, string> = {
  tech_product: 'Reflect innovation and digital transformation. Consider circuits as art, data visualization aesthetics, or the poetry of technology. Precision meets creativity.',
  services: 'Represent human connection and relationships. Intertwining forms, collaborative structures, or abstract representations of helping hands and bridges between people.',
  ecommerce: 'Capture the energy of exchange and marketplace dynamics. Movement, flow, interconnected networks, or the beauty of logistics and delivery.',
  manufacturing: 'Transform industrial forms into art. Celebrate precision engineering, assembly, and the beauty of well-crafted objects. Gears and structures as sculptural elements.',
  ngo: 'Embody community, growth, and collective impact. Rising forms, hands reaching upward, seeds sprouting, or abstract representations of positive change.',
  media: 'Express storytelling and communication. Narrative forms, information flow, the interplay of ideas, or the magic of content creation.',
  fintech: 'Visualize trust, growth, and financial flow. Ascending curves, stable foundations with dynamic tops, or abstract representations of value exchange.',
  healthcare: 'Represent healing, care, and wellbeing. Nurturing forms, protective structures, or the elegant complexity of life systems.',
  education: 'Symbolize knowledge, growth, and enlightenment. Ascending spirals, opening forms, or the branching structure of learning paths.',
  default: 'Create a unique artistic sculpture that feels premium, thoughtful, and distinctively memorable.'
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
  const industryTheme = INDUSTRY_ARTISTIC_THEMES[organization.type || 'default']
    || INDUSTRY_ARTISTIC_THEMES.default

  // Calculate lifespan for context
  let lifespan = ''
  if (organization.foundedDate && organization.closedDate) {
    const startYear = organization.foundedDate.split('-')[0]
    const endYear = organization.closedDate.split('-')[0]
    lifespan = `Active ${startYear}-${endYear}`
  }

  // Get style variation
  const styleVariation = STYLE_VARIATIONS[variationIndex % STYLE_VARIATIONS.length]

  const prompt = `
${SOIL_DESIGN_RULES}

ARTISTIC STYLE FOR THIS VARIATION:
${styleVariation.instruction}

ORGANIZATION CHARACTER:
- Name: "${organization.name}"
- Industry: ${organization.industry || organization.type || 'Business'}
${lifespan ? `- Period: ${lifespan}` : ''}
${organization.peakTeamSize ? `- Scale: ${organization.peakTeamSize} people at peak` : ''}

ARTISTIC THEME (based on industry):
${industryTheme}

FOUNDER'S ESSENCE:
${story.epitaph ? `- Their message: "${story.epitaph}"` : ''}
${story.mainLesson ? `- Key insight: "${story.mainLesson}"` : ''}

FOUNDER'S CREATIVE DIRECTION:
${userWishes || 'No specific direction given. Surprise them with something beautiful and unique.'}

Create a stunning ${styleVariation.name.toLowerCase()} sculpture for "${organization.name}" that captures their unique spirit. This should be a piece of art that the founder would be proud to display.
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

IMPROVEMENT REQUEST:
The founder wants something different. Their feedback: "${feedbackOnPrevious}"
Create a new design that addresses this feedback while maintaining artistic excellence.
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
    return { valid: false, error: 'Creative direction must be under 2000 characters' }
  }

  // Basic content filtering
  const inappropriateTerms = [
    'explicit', 'violent', 'gore', 'nsfw', 'nude', 'sexual',
    'weapon', 'gun', 'blood', 'kill', 'hate'
  ]

  const lowerPrompt = prompt.toLowerCase()
  for (const term of inappropriateTerms) {
    if (lowerPrompt.includes(term)) {
      return {
        valid: false,
        error: 'Creative direction contains inappropriate content. Please describe your artistic vision respectfully.'
      }
    }
  }

  return { valid: true }
}
