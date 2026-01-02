/**
 * 3D Model Generation - Types
 * Issue: #254 - AI Pipeline for 3D Cenotaph Model Generation
 *
 * Provider-agnostic types for 3D model generation service
 */

/**
 * Generation options passed to providers
 */
export interface Model3DGenerationOptions {
  /** Resolution: 512, 1024, 1536 */
  resolution: number;
  /** Target polygon count: 100000-2000000 */
  polygonCount: number;
  /** Output format */
  outputFormat: "glb";
}

/**
 * Task status result from provider
 */
export interface Model3DTaskResult {
  /** Current task state */
  state: "pending" | "processing" | "success" | "failed";
  /** Progress percentage (0-100), if available */
  progress?: number;
  /** Download URL for the generated model (temporary, provider-specific) */
  modelUrl?: string;
  /** Preview image URL */
  previewUrl?: string;
  /** Error message if failed */
  error?: string;
}

/**
 * Provider interface - all 3D model providers must implement this
 */
export interface Model3DProvider {
  /** Provider name for identification */
  readonly name: string;

  /**
   * Submit an image for 3D model generation
   * @param imageUrl URL to the source image
   * @param options Generation options
   * @returns Task ID for status polling
   */
  submitTask(imageUrl: string, options: Model3DGenerationOptions): Promise<string>;

  /**
   * Query the status of a generation task
   * @param taskId Task ID returned from submitTask
   * @returns Current task status and results
   */
  queryTask(taskId: string): Promise<Model3DTaskResult>;

  /**
   * Download the generated model file
   * @param url Download URL from queryTask result
   * @returns Model file as Buffer
   */
  downloadModel(url: string): Promise<Buffer>;
}

/**
 * Supported provider types
 * Add new providers here as they are implemented
 */
export type Model3DProviderType = "hitem3d";

/**
 * Model generation status stored in database
 * - pending: Task submitted, waiting to start
 * - processing: HitEM is generating the model
 * - downloading: Model ready, downloading and uploading to storage
 * - success: Model available in Supabase storage
 * - failed: Generation or upload failed
 */
export type Model3DGenerationStatus =
  | "pending"
  | "processing"
  | "downloading"
  | "success"
  | "failed";
