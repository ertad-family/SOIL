/**
 * HitEM 3D Provider Implementation
 * Issue: #254 - AI Pipeline for 3D Cenotaph Model Generation
 *
 * API Documentation: https://docs.hitem3d.ai/en/api/
 * - Auth: POST /open-api/v1/auth/token (Basic auth → Bearer token, 24h validity)
 * - Create Task: POST /open-api/v1/submit-task (multipart/form-data)
 * - Query Task: GET /open-api/v1/query-task?task_id=xxx
 */

import type { Model3DProvider, Model3DGenerationOptions, Model3DTaskResult } from "../types";

const HITEM3D_API_BASE = "https://api.hitem3d.ai";
const TOKEN_EXPIRY_BUFFER_MS = 60 * 60 * 1000; // Refresh 1 hour before expiry

// HitEM API output format codes
const OUTPUT_FORMAT_GLB = "2";

// HitEM API request type codes
const REQUEST_TYPE_FULL = "3"; // Both geometry and texture

/**
 * HitEM 3D Provider
 * Implements the Model3DProvider interface for HitEM 3D API
 */
export class HitEM3DProvider implements Model3DProvider {
  readonly name = "hitem3d";

  // Token cache - shared across instances via module scope
  private static accessToken: string | null = null;
  private static tokenExpiresAt: number = 0;

  /**
   * Get access token, using cache if valid
   * Token is valid for 24 hours
   */
  private async getToken(): Promise<string> {
    // Check if cached token is still valid
    if (
      HitEM3DProvider.accessToken &&
      Date.now() < HitEM3DProvider.tokenExpiresAt - TOKEN_EXPIRY_BUFFER_MS
    ) {
      return HitEM3DProvider.accessToken;
    }

    const accessKey = process.env.HITEM3D_ACCESS_KEY;
    const secretKey = process.env.HITEM3D_SECRET_KEY;

    if (!accessKey || !secretKey) {
      throw new Error(
        "HitEM 3D API credentials not configured (HITEM3D_ACCESS_KEY, HITEM3D_SECRET_KEY)"
      );
    }

    // Create Basic auth header
    const credentials = Buffer.from(`${accessKey}:${secretKey}`).toString("base64");

    const response = await fetch(`${HITEM3D_API_BASE}/open-api/v1/auth/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: "{}",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HitEM 3D auth failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    if (result.code !== 200 || !result.data?.accessToken) {
      throw new Error(`HitEM 3D auth error: ${result.message || "Unknown error"}`);
    }

    // Cache the token (24 hour validity)
    const token: string = result.data.accessToken;
    HitEM3DProvider.accessToken = token;
    HitEM3DProvider.tokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

    console.log("[HitEM3D] Obtained new access token");
    return token;
  }

  /**
   * Submit an image for 3D model generation
   */
  async submitTask(imageUrl: string, options: Model3DGenerationOptions): Promise<string> {
    const token = await this.getToken();

    // Download the image first (HitEM requires file upload)
    console.log(`[HitEM3D] Downloading image from: ${imageUrl.substring(0, 50)}...`);
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status}`);
    }
    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBlob = new Blob([imageBuffer], { type: "image/png" });

    // Get model version from environment or use default
    // v1.5 supports 512, 1024, 1536 resolutions (v2.0 only supports 1536+)
    const modelVersion = process.env.HITEM3D_MODEL_VERSION || "hitem3dv1.5";

    // Build multipart form data
    const formData = new FormData();
    formData.append("request_type", REQUEST_TYPE_FULL);
    formData.append("model", modelVersion);
    formData.append("images", imageBlob, "cenotaph.png");
    formData.append("resolution", String(options.resolution));
    formData.append("face", String(options.polygonCount));
    formData.append("format", OUTPUT_FORMAT_GLB);

    console.log(
      `[HitEM3D] Submitting task: model=${modelVersion}, resolution=${options.resolution}, polygons=${options.polygonCount}`
    );

    const response = await fetch(`${HITEM3D_API_BASE}/open-api/v1/submit-task`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HitEM 3D submit task failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    if (result.code !== 200 || !result.data?.task_id) {
      throw new Error(`HitEM 3D submit error: ${result.msg || result.message || "Unknown error"}`);
    }

    console.log(`[HitEM3D] Task created: ${result.data.task_id}`);
    return result.data.task_id;
  }

  /**
   * Query the status of a generation task
   */
  async queryTask(taskId: string): Promise<Model3DTaskResult> {
    const token = await this.getToken();

    const response = await fetch(
      `${HITEM3D_API_BASE}/open-api/v1/query-task?task_id=${encodeURIComponent(taskId)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HitEM 3D query task failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    if (result.code !== 200) {
      // Check for known error codes
      if (result.code === 50010001) {
        return {
          state: "failed",
          error: "Model generation failed or image could not be processed. Please try again.",
        };
      }
      throw new Error(`HitEM 3D query error: ${result.msg || result.message || "Unknown error"}`);
    }

    // Map HitEM state to our standard states
    const hitemState = result.data?.state?.toLowerCase() || "unknown";
    let state: Model3DTaskResult["state"];

    switch (hitemState) {
      case "created":
      case "queueing":
        state = "pending";
        break;
      case "processing":
        state = "processing";
        break;
      case "success":
        state = "success";
        break;
      case "failed":
        state = "failed";
        break;
      default:
        console.warn(`[HitEM3D] Unknown state: ${hitemState}, treating as processing`);
        state = "processing";
    }

    return {
      state,
      modelUrl: result.data?.url || undefined,
      previewUrl: result.data?.cover_url || undefined,
      error: state === "failed" ? "Model generation failed" : undefined,
    };
  }

  /**
   * Download the generated model file
   */
  async downloadModel(url: string): Promise<Buffer> {
    console.log(`[HitEM3D] Downloading model from: ${url.substring(0, 50)}...`);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to download model: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}
