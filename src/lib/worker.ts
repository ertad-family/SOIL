/**
 * Worker trigger utility for SOIL-worker integration.
 * Used to trigger the email worker immediately after verification requests are created.
 */

const WORKER_URL = process.env.WORKER_URL;
const WORKER_CRON_SECRET = process.env.WORKER_CRON_SECRET;

interface TriggerResult {
  success: boolean;
  message: string;
  processed?: number;
  sent?: number;
  failed?: number;
}

/**
 * Triggers the email worker to process pending verification emails.
 * This is a fire-and-forget operation - if it fails, the daily cron will pick up
 * pending emails on its next run.
 *
 * The worker authenticates callers with CRON_SECRET; WORKER_CRON_SECRET must hold
 * the same value. While it is unset no Authorization header is sent.
 *
 * @returns Promise<TriggerResult> - Result of the trigger attempt
 */
export async function triggerEmailWorker(): Promise<TriggerResult> {
  if (!WORKER_URL) {
    console.warn("[Worker] WORKER_URL not configured, skipping immediate trigger");
    return {
      success: false,
      message: "WORKER_URL not configured",
    };
  }

  const endpoint = `${WORKER_URL}/api/cron/send-verification-emails`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: WORKER_CRON_SECRET
        ? { Authorization: `Bearer ${WORKER_CRON_SECRET}` }
        : undefined,
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      console.error(`[Worker] Trigger failed with status ${response.status}: ${errorText}`);
      return {
        success: false,
        message: `Worker returned status ${response.status}`,
      };
    }

    const data = await response.json();
    console.log(`[Worker] Trigger successful: ${data.sent || 0} sent, ${data.failed || 0} failed`);

    return {
      success: true,
      message: data.message || "Worker triggered successfully",
      processed: data.processed,
      sent: data.sent,
      failed: data.failed,
    };
  } catch (error) {
    // Handle timeout and network errors gracefully
    if (error instanceof Error) {
      if (error.name === "TimeoutError" || error.name === "AbortError") {
        console.warn("[Worker] Trigger timed out - emails will be sent by cron");
        return {
          success: false,
          message: "Worker trigger timed out",
        };
      }
      console.error("[Worker] Trigger error:", error.message);
      return {
        success: false,
        message: error.message,
      };
    }

    console.error("[Worker] Unknown trigger error:", error);
    return {
      success: false,
      message: "Unknown error occurred",
    };
  }
}

/**
 * Triggers the email worker without waiting for the result.
 * Use this when you don't need to know if the trigger succeeded.
 */
export function triggerEmailWorkerAsync(): void {
  triggerEmailWorker().catch((err) => {
    console.error("[Worker] Async trigger failed:", err);
  });
}
