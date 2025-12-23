/**
 * Vertex AI Gemini & Imagen Integration
 * Issue: #23 Cenotaph creation wizard
 *
 * Two-step creative process:
 * 1. Gemini Flash generates 9 unique creative concepts (text)
 * 2. Imagen 4 renders selected concepts into images
 *
 * Cost: ~$0.04 per image (Imagen 4), ~$0.001 per concept generation (Gemini Flash)
 */

import { GoogleGenAI } from "@google/genai";
import type { DesignOption, DesignConcept } from "@/types/cenotaph";

// Initialize Google GenAI client with Vertex AI
// Using Vertex AI requires project ID, location, and service account credentials
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

// Model configuration
const TEXT_MODEL = "gemini-2.0-flash-001"; // Fast text generation for concepts
const IMAGE_MODEL = "imagen-4.0-generate-001"; // High-quality image generation

interface GeneratedImage {
  base64Data: string;
  mimeType: string;
}

interface UsedConcept {
  concept_title: string;
  concept_description: string;
  style_keywords: string[];
}

/**
 * Generate 9 unique creative concepts using Gemini text model
 * These concepts will later be rendered into images by Imagen
 */
export async function generateCreativeConcepts(
  organizationContext: string,
  usedConcepts: UsedConcept[]
): Promise<DesignConcept[]> {
  try {
    console.log(
      `Generating 9 creative concepts (avoiding ${usedConcepts.length} used concepts)...`
    );

    // Build the list of used concepts to avoid
    const usedConceptsList =
      usedConcepts.length > 0
        ? usedConcepts
            .map(
              (c, i) =>
                `${i + 1}. "${c.concept_title}": ${c.concept_description.substring(0, 200)}...`
            )
            .join("\n")
        : "None yet - you have complete creative freedom!";

    const prompt = `You are a visionary artist and world-class sculptor. Generate 9 COMPLETELY UNIQUE and BREATHTAKING creative concepts for a CENOTAPH - an outdoor memorial monument.

WHAT IS A CENOTAPH:
A cenotaph is a monumental work of art commemorating an organization that has ceased to exist. It stands outdoors in parks, plazas, or public spaces. Think of the most stunning public sculptures and monuments - pieces that stop people in their tracks and evoke deep emotions.

ORGANIZATION CONTEXT:
${organizationContext}

=== PREVIOUSLY USED CONCEPTS (MUST AVOID SIMILAR IDEAS) ===
${usedConceptsList}

=== YOUR TASK ===
Create 9 wildly different cenotaph concepts. Each must be:
- Visually STUNNING and artistically BOLD
- Visually distinct from ALL others (different forms, materials, styles)
- NOT similar to any previously used concepts listed above
- Physically buildable (real materials, solid form) but ARTISTICALLY DARING

MATERIAL REQUIREMENTS (CRITICAL):
- Each monument must be made from REAL, DURABLE outdoor materials: bronze, marble, granite, steel, copper, stone, concrete, or combinations
- NO abstract light effects, energy particles, digital glitches, or non-physical forms
- The form must be SOLID and PERMANENT - built to last for decades outdoors
- Think like a monument sculptor: what could be cast in a foundry, carved from stone, or welded from steel?

BASE/PLINTH REQUIREMENT (CRITICAL):
- Each monument must stand on a solid stone, concrete, or granite base/plinth
- The monument must be a SINGLE, UNIFIED structure
- NO floating elements, NO hands holding things, NO multi-part compositions, NO scenes with multiple objects
- Imagine: a striking monument that becomes a landmark in a city square

DIVERSITY REQUIREMENTS:
- At least 2 should be geometric/architectural (obelisks, arches, abstract geometry)
- At least 2 should be organic/natural (inspired by nature, flowing forms)
- At least 2 should be figurative/symbolic (recognizable symbolic forms)
- At least 2 should be mixed-material (combining bronze with stone, steel with concrete, etc.)
- 1 should be bold and unconventional (but still buildable as a real monument)

For EACH concept provide:
1. title: A short, evocative name (2-4 words)
2. description: Detailed visual description for image generation (100-150 words). MUST specify: exact materials (e.g. "weathered bronze", "polished black granite"), form/shape, textures, colors. This will be sent to an image AI.
3. styleKeywords: Array of 3-5 style tags

CRITICAL RULES:
- NO tombstones, graves, crosses, or funeral imagery
- NO text, letters, or organization names on the monument
- Focus on BEAUTY, ARTISTIC BOLDNESS, and EMOTIONAL IMPACT
- These are WORKS OF ART first, monuments second - be creative and daring!

Respond with ONLY a valid JSON array of 9 objects. No markdown, no explanation.
Example format:
[
  {
    "title": "Rising Phoenix",
    "description": "A 3-meter tall weathered bronze sculpture of stylized flames rising upward, mounted on a rectangular black granite plinth. The bronze has a green-brown patina from outdoor exposure. The abstract flame forms twist elegantly, symbolizing rebirth and transformation...",
    "styleKeywords": ["bronze", "symbolic", "dynamic", "monumental"]
  }
]`;

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        temperature: 1.2, // High creativity
        topP: 0.95,
        maxOutputTokens: 4000,
      },
    });

    // Parse the response
    const text = response.text?.trim() || "";

    // Try to extract JSON from the response
    let concepts: Array<{ title: string; description: string; styleKeywords: string[] }> = [];

    try {
      // Remove potential markdown code blocks
      const jsonStr = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      concepts = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse concept response:", parseError);
      console.error("Raw response:", text.substring(0, 500));
      throw new Error("Failed to parse creative concepts from AI response");
    }

    if (!Array.isArray(concepts) || concepts.length === 0) {
      throw new Error("No concepts generated");
    }

    // Transform to DesignConcept format
    const now = new Date().toISOString();
    return concepts.slice(0, 9).map((c, i) => ({
      id: `concept_${Date.now()}_${i}`,
      title: c.title || `Concept ${i + 1}`,
      description: c.description || "",
      styleKeywords: Array.isArray(c.styleKeywords) ? c.styleKeywords : [],
      createdAt: now,
    }));
  } catch (error) {
    console.error("Concept generation failed:", error);
    throw error;
  }
}

/**
 * Generate a single cenotaph design image using Imagen 4
 */
async function generateSingleImage(prompt: string): Promise<GeneratedImage | null> {
  try {
    console.log("Calling Imagen 4 with prompt:", prompt.substring(0, 100) + "...");

    const response = await ai.models.generateImages({
      model: IMAGE_MODEL,
      prompt: prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: "1:1", // Square format for cenotaph designs
      },
    });

    // Check if we got generated images
    if (response.generatedImages && response.generatedImages.length > 0) {
      const image = response.generatedImages[0];

      // imageBytes is a base64-encoded string in the SDK
      if (image.image?.imageBytes) {
        return {
          base64Data: image.image.imageBytes,
          mimeType: "image/png",
        };
      }
    }

    console.error("No image found in Imagen response:", JSON.stringify(response, null, 2));
    return null;
  } catch (error) {
    console.error("Imagen 4 image generation failed:", error);
    throw error;
  }
}

/**
 * Visual requirements to be added to every image generation prompt
 */
const VISUAL_REQUIREMENTS = `
VISUAL REQUIREMENTS:
- Warm dark background (#252220 - warm charcoal brown), completely uniform, no gradients or particles
- Monument centered in frame, fills 70-80% of frame height
- Slightly elevated front view camera angle (about 15 degrees)
- NO text, letters, or words on the monument
- NO tombstones, graves, crosses, or traditional funeral imagery
- Photorealistic 3D rendering

THIS IS A CENOTAPH - AN OUTDOOR MEMORIAL MONUMENT:
- A cenotaph is a monumental work of art commemorating an organization that has ceased to exist
- It should look like a stunning outdoor sculpture you would see in a park, plaza, or public square
- Think: the most beautiful public monuments and sculptures that become landmarks
- It is a bold, artistic structure that evokes emotion and stops people in their tracks

MATERIAL REQUIREMENTS:
- The monument must be made from REAL, DURABLE outdoor materials: bronze, marble, granite, steel, copper, stone, concrete, or combinations
- NO abstract light particles, energy fields, digital effects, or non-physical forms
- The monument must be SOLID and TANGIBLE - something that could physically exist

BASE/PLINTH REQUIREMENT:
- The monument MUST stand on a solid base or plinth (stone, concrete, or granite)
- The monument must be a SINGLE, UNIFIED structure
- NO floating elements, NO hands holding things, NO multi-part compositions
`;

/**
 * Generate images from creative concepts
 * Takes concept descriptions and renders them as images
 */
export async function generateImagesFromConcepts(
  concepts: DesignConcept[],
  memorialId: string
): Promise<DesignOption[]> {
  const options: DesignOption[] = [];

  for (let i = 0; i < concepts.length; i++) {
    const concept = concepts[i];
    try {
      console.log(
        `Generating image for concept "${concept.title}" (${i + 1}/${concepts.length})...`
      );

      // Build the full prompt with visual requirements
      const fullPrompt = `Create an outdoor memorial monument (cenotaph):

${concept.description}

${VISUAL_REQUIREMENTS}

Style: ${concept.styleKeywords.join(", ")}`;

      const image = await generateSingleImage(fullPrompt);

      if (image) {
        const designId = `design_${memorialId}_${Date.now()}_${i}`;

        options.push({
          id: designId,
          url: `data:${image.mimeType};base64,${image.base64Data}`,
          prompt: concept.description.substring(0, 500),
          createdAt: new Date().toISOString(),
          conceptId: concept.id,
        });

        console.log(`Successfully generated image for "${concept.title}"`);
      }

      // Add delay between requests to avoid rate limiting
      if (i < concepts.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`Failed to generate image for concept "${concept.title}":`, error);
      // Continue with other concepts even if one fails
    }
  }

  return options;
}

/**
 * Generate multiple cenotaph design options (legacy - uses raw prompts)
 * @deprecated Use generateImagesFromConcepts instead
 */
export async function generateCenotaphDesigns(
  prompts: string[],
  memorialId: string
): Promise<DesignOption[]> {
  const options: DesignOption[] = [];

  for (let i = 0; i < prompts.length; i++) {
    try {
      console.log(`Generating design option ${i + 1}/${prompts.length}...`);

      const image = await generateSingleImage(prompts[i]);

      if (image) {
        const designId = `design_${memorialId}_${i}_${Date.now()}`;

        options.push({
          id: designId,
          url: `data:${image.mimeType};base64,${image.base64Data}`,
          prompt: prompts[i].substring(0, 500),
          createdAt: new Date().toISOString(),
        });

        console.log(`Successfully generated design option ${i + 1}`);
      }

      if (i < prompts.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`Failed to generate option ${i + 1}:`, error);
    }
  }

  return options;
}

// Supabase client type for storage operations
type SupabaseClientType = {
  storage: {
    from: (bucket: string) => {
      upload: (
        path: string,
        data: Buffer,
        options?: { contentType: string; upsert: boolean }
      ) => Promise<{ data: unknown; error: Error | null }>;
      getPublicUrl: (path: string) => { data: { publicUrl: string } };
    };
  };
};

/**
 * Upload base64 image to Supabase Storage and return public URL
 */
export async function uploadDesignToStorage(
  supabase: SupabaseClientType,
  memorialId: string,
  designId: string,
  base64Data: string,
  mimeType: string
): Promise<string | null> {
  try {
    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, "base64");

    // Determine file extension
    const ext = mimeType.includes("png") ? "png" : mimeType.includes("webp") ? "webp" : "jpg";
    const fileName = `${memorialId}/${designId}.${ext}`;

    // Upload to Supabase Storage
    const { error } = await supabase.storage.from("cenotaph-designs").upload(fileName, buffer, {
      contentType: mimeType,
      upsert: true,
    });

    if (error) {
      console.error("Storage upload error:", error);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("cenotaph-designs").getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Failed to upload design:", error);
    return null;
  }
}

/**
 * Process generated designs: upload to storage and replace base64 with URLs
 */
export async function processAndUploadDesigns(
  supabase: SupabaseClientType,
  memorialId: string,
  designs: DesignOption[]
): Promise<DesignOption[]> {
  const processedDesigns: DesignOption[] = [];

  for (const design of designs) {
    // Check if URL is base64 data
    if (design.url.startsWith("data:")) {
      const [header, base64Data] = design.url.split(",");
      const mimeType = header.split(":")[1]?.split(";")[0] || "image/png";

      const publicUrl = await uploadDesignToStorage(
        supabase,
        memorialId,
        design.id,
        base64Data,
        mimeType
      );

      if (publicUrl) {
        processedDesigns.push({
          ...design,
          url: publicUrl,
        });
      } else {
        // Keep base64 as fallback (not ideal for production)
        processedDesigns.push(design);
      }
    } else {
      processedDesigns.push(design);
    }
  }

  return processedDesigns;
}

/**
 * Estimate cost for generation
 * Based on Imagen 4 pricing: ~$0.04 per image
 */
export function estimateCost(numberOfImages: number): number {
  const costPerImage = 0.04;
  return numberOfImages * costPerImage;
}
