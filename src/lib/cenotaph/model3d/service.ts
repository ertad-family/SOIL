/**
 * 3D Model Generation Service
 * Issue: #254 - AI Pipeline for 3D Cenotaph Model Generation
 *
 * Central service that orchestrates 3D model generation using configurable providers.
 * Uses factory pattern to instantiate the appropriate provider based on settings.
 */

import { createClient as createServiceClient } from "@supabase/supabase-js";
import { NodeIO } from "@gltf-transform/core";
import { KHRDracoMeshCompression, EXTTextureWebP } from "@gltf-transform/extensions";
import { dedup, prune, quantize, draco, textureCompress } from "@gltf-transform/functions";
import sharp from "sharp";
import draco3d from "draco3dgltf";
import { HitEM3DProvider } from "./providers/hitem3d";
import type {
  Model3DProvider,
  Model3DProviderType,
  Model3DGenerationOptions,
  Model3DTaskResult,
} from "./types";

// Maximum file size for Supabase storage (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Service client for storage operations
const getServiceSupabase = () =>
  createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

/**
 * Factory function to create provider instances
 */
export function getProvider(providerType: Model3DProviderType): Model3DProvider {
  switch (providerType) {
    case "hitem3d":
      return new HitEM3DProvider();
    default:
      throw new Error(`Unknown 3D model provider: ${providerType}`);
  }
}

/**
 * Model 3D Generation Service
 *
 * Provides high-level operations for 3D model generation:
 * - Submit generation tasks
 * - Check task status
 * - Download and store models to Supabase
 */
export class Model3DService {
  private provider: Model3DProvider;
  private providerType: Model3DProviderType;

  constructor(providerType: Model3DProviderType) {
    this.providerType = providerType;
    this.provider = getProvider(providerType);
  }

  /**
   * Get the provider name
   */
  get providerName(): string {
    return this.provider.name;
  }

  /**
   * Submit an image for 3D model generation
   * @param imageUrl URL to the cenotaph image
   * @param options Generation options
   * @returns Task ID for status polling
   */
  async submitTask(imageUrl: string, options: Model3DGenerationOptions): Promise<string> {
    console.log(`[Model3DService] Submitting task via ${this.providerName} provider`);
    return this.provider.submitTask(imageUrl, options);
  }

  /**
   * Check the status of a generation task
   * @param taskId Task ID from submitTask
   * @returns Current status and results
   */
  async checkStatus(taskId: string): Promise<Model3DTaskResult> {
    return this.provider.queryTask(taskId);
  }

  /**
   * Optimize GLB model using Draco compression
   * @param inputBuffer Original GLB buffer
   * @returns Optimized GLB buffer
   */
  private async optimizeModel(inputBuffer: Buffer): Promise<Buffer> {
    console.log(
      `[Model3DService] Optimizing model (input: ${(inputBuffer.length / 1024 / 1024).toFixed(2)} MB)`
    );

    // Initialize glTF-Transform I/O with extensions
    const io = new NodeIO()
      .registerExtensions([KHRDracoMeshCompression, EXTTextureWebP])
      .registerDependencies({
        "draco3d.decoder": await draco3d.createDecoderModule(),
        "draco3d.encoder": await draco3d.createEncoderModule(),
      });

    // Read the GLB
    const document = await io.readBinary(new Uint8Array(inputBuffer));

    // Apply optimizations:
    // 1. Remove duplicate data (textures, meshes)
    // 2. Remove unused nodes, textures, etc.
    // 3. Compress textures to WebP (massive size reduction)
    // 4. Quantize vertex attributes (reduces precision slightly)
    // 5. Apply Draco mesh compression
    await document.transform(
      dedup(),
      prune(),
      textureCompress({
        encoder: sharp,
        targetFormat: "webp",
        quality: 75,
        resize: [1024, 1024], // Max texture resolution
      }),
      quantize(),
      draco()
    );

    // Write back to GLB
    const outputBuffer = await io.writeBinary(document);
    const result = Buffer.from(outputBuffer);

    const compressionRatio = ((1 - result.length / inputBuffer.length) * 100).toFixed(1);
    console.log(
      `[Model3DService] Optimization complete: ${(result.length / 1024 / 1024).toFixed(2)} MB ` +
        `(${compressionRatio}% reduction)`
    );

    return result;
  }

  /**
   * Download the generated model and upload to Supabase storage
   * @param downloadUrl Temporary download URL from the provider
   * @param memorialId Memorial ID for file path
   * @returns Public URL of the stored model
   */
  async downloadAndStore(downloadUrl: string, memorialId: string): Promise<string> {
    console.log(`[Model3DService] Downloading and storing model for memorial ${memorialId}`);

    // Download from provider
    const modelBuffer = await this.provider.downloadModel(downloadUrl);
    console.log(`[Model3DService] Downloaded ${(modelBuffer.length / 1024 / 1024).toFixed(2)} MB`);

    // Optimize with Draco compression
    let optimizedBuffer: Buffer;
    try {
      optimizedBuffer = await this.optimizeModel(modelBuffer);
    } catch (error) {
      console.error("[Model3DService] Optimization failed, using original:", error);
      optimizedBuffer = modelBuffer;
    }

    // Check if still too large
    if (optimizedBuffer.length > MAX_FILE_SIZE) {
      throw new Error(
        `Model too large after optimization: ${(optimizedBuffer.length / 1024 / 1024).toFixed(2)} MB ` +
          `(max ${MAX_FILE_SIZE / 1024 / 1024} MB). Try reducing polygon count in settings.`
      );
    }

    // Upload to Supabase storage
    const supabase = getServiceSupabase();
    const filePath = `${memorialId}/model-3d.glb`;

    const { error: uploadError } = await supabase.storage
      .from("cenotaph-designs")
      .upload(filePath, optimizedBuffer, {
        contentType: "model/gltf-binary",
        upsert: true,
      });

    if (uploadError) {
      console.error("[Model3DService] Upload error:", uploadError);
      throw new Error(`Failed to upload model: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("cenotaph-designs").getPublicUrl(filePath);

    console.log(`[Model3DService] Model stored at: ${urlData.publicUrl}`);
    return urlData.publicUrl;
  }
}
