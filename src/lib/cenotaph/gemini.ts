/**
 * Gemini Image Generation Integration
 * Issue: #23 Cenotaph creation wizard
 *
 * Uses Gemini 2.5 Flash Image (Nano Banana) for cenotaph design generation.
 * Cost: ~$0.039 per image (1290 output tokens at $30/1M tokens)
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import type { DesignOption } from '@/types/cenotaph'

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Model configuration
// Using gemini-2.0-flash-exp for image generation (Nano Banana)
const IMAGE_MODEL = 'gemini-2.0-flash-exp'

interface GeneratedImage {
  base64Data: string
  mimeType: string
}

/**
 * Generate a single cenotaph design image using Gemini
 */
async function generateSingleImage(prompt: string): Promise<GeneratedImage | null> {
  try {
    const model = genAI.getGenerativeModel({
      model: IMAGE_MODEL,
      generationConfig: {
        // @ts-expect-error - responseModalities is valid for image generation
        responseModalities: ['Text', 'Image'],
      },
    })

    const result = await model.generateContent(prompt)
    const response = result.response

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return {
          base64Data: part.inlineData.data,
          mimeType: part.inlineData.mimeType || 'image/png'
        }
      }
    }

    console.error('No image found in Gemini response')
    return null
  } catch (error) {
    console.error('Gemini image generation failed:', error)
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
    const { data, error } = await supabase.storage
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
 * Based on Gemini pricing: $30/1M output tokens, ~1290 tokens per image
 */
export function estimateCost(numberOfImages: number): number {
  const tokensPerImage = 1290
  const costPerMillionTokens = 30
  const totalTokens = numberOfImages * tokensPerImage
  return (totalTokens / 1_000_000) * costPerMillionTokens
}
