/**
 * Vertex AI Imagen 4 Image Generation Integration
 * Issue: #23 Cenotaph creation wizard
 *
 * Uses Google Vertex AI Imagen 4 for cenotaph design generation.
 * Cost: ~$0.04 per image (Imagen 4 pricing)
 */

import { GoogleGenAI } from '@google/genai'
import type { DesignOption } from '@/types/cenotaph'

// Initialize Google GenAI client with Vertex AI
// Using Vertex AI requires project ID and location
const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GOOGLE_CLOUD_PROJECT_ID || '',
  location: process.env.VERTEX_AI_LOCATION || 'us-central1',
})

// Model configuration - Imagen 4 for high-quality image generation
const IMAGE_MODEL = 'imagen-4.0-generate-001'

interface GeneratedImage {
  base64Data: string
  mimeType: string
}

/**
 * Generate a single cenotaph design image using Imagen 4
 */
async function generateSingleImage(prompt: string): Promise<GeneratedImage | null> {
  try {
    console.log('Calling Imagen 4 with prompt:', prompt.substring(0, 100) + '...')

    const response = await ai.models.generateImages({
      model: IMAGE_MODEL,
      prompt: prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: '1:1', // Square format for cenotaph designs
      },
    })

    // Check if we got generated images
    if (response.generatedImages && response.generatedImages.length > 0) {
      const image = response.generatedImages[0]

      // imageBytes is a base64-encoded string in the SDK
      if (image.image?.imageBytes) {
        return {
          base64Data: image.image.imageBytes,
          mimeType: 'image/png'
        }
      }
    }

    console.error('No image found in Imagen response:', JSON.stringify(response, null, 2))
    return null
  } catch (error) {
    console.error('Imagen 4 image generation failed:', error)
    throw error
  }
}

/**
 * Generate multiple cenotaph design options
 * Generates 3 different variations by default
 */
export async function generateCenotaphDesigns(
  prompts: string[],
  memorialId: string
): Promise<DesignOption[]> {
  const options: DesignOption[] = []

  for (let i = 0; i < prompts.length; i++) {
    try {
      console.log(`Generating design option ${i + 1}/${prompts.length}...`)

      const image = await generateSingleImage(prompts[i])

      if (image) {
        const designId = `design_${memorialId}_${i}_${Date.now()}`

        options.push({
          id: designId,
          url: `data:${image.mimeType};base64,${image.base64Data}`,
          prompt: prompts[i].substring(0, 500), // Store truncated prompt for reference
          createdAt: new Date().toISOString()
        })

        console.log(`Successfully generated design option ${i + 1}`)
      }

      // Add small delay between requests to avoid rate limiting
      if (i < prompts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    } catch (error) {
      console.error(`Failed to generate option ${i + 1}:`, error)
      // Continue with other options even if one fails
    }
  }

  return options
}

// Supabase client type for storage operations
type SupabaseClientType = {
  storage: {
    from: (bucket: string) => {
      upload: (path: string, data: Buffer, options?: { contentType: string; upsert: boolean }) => Promise<{ data: unknown; error: Error | null }>
      getPublicUrl: (path: string) => { data: { publicUrl: string } }
    }
  }
}

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
    const buffer = Buffer.from(base64Data, 'base64')

    // Determine file extension
    const ext = mimeType.includes('png') ? 'png' : mimeType.includes('webp') ? 'webp' : 'jpg'
    const fileName = `${memorialId}/${designId}.${ext}`

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('cenotaph-designs')
      .upload(fileName, buffer, {
        contentType: mimeType,
        upsert: true
      })

    if (error) {
      console.error('Storage upload error:', error)
      return null
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('cenotaph-designs')
      .getPublicUrl(fileName)

    return urlData.publicUrl
  } catch (error) {
    console.error('Failed to upload design:', error)
    return null
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
  const processedDesigns: DesignOption[] = []

  for (const design of designs) {
    // Check if URL is base64 data
    if (design.url.startsWith('data:')) {
      const [header, base64Data] = design.url.split(',')
      const mimeType = header.split(':')[1]?.split(';')[0] || 'image/png'

      const publicUrl = await uploadDesignToStorage(
        supabase,
        memorialId,
        design.id,
        base64Data,
        mimeType
      )

      if (publicUrl) {
        processedDesigns.push({
          ...design,
          url: publicUrl
        })
      } else {
        // Keep base64 as fallback (not ideal for production)
        processedDesigns.push(design)
      }
    } else {
      processedDesigns.push(design)
    }
  }

  return processedDesigns
}

/**
 * Estimate cost for generation
 * Based on Imagen 4 pricing: ~$0.04 per image
 */
export function estimateCost(numberOfImages: number): number {
  const costPerImage = 0.04
  return numberOfImages * costPerImage
}
