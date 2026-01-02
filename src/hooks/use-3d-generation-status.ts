/**
 * Hook for polling 3D model generation status
 * Issue: #254 - AI Pipeline for 3D Cenotaph Model Generation
 *
 * Polls the /api/cenotaph/3d-status endpoint every 5 seconds
 * while generation is in progress (pending/processing).
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { Model3DGenerationStatus } from "@/lib/cenotaph/model3d/client";

const POLL_INTERVAL_MS = 5000; // 5 seconds

interface Use3DGenerationStatusResult {
  /** Current generation status */
  status: Model3DGenerationStatus | null;
  /** Whether actively polling */
  isPolling: boolean;
  /** Generated model URL (when success) */
  modelUrl: string | null;
  /** Error message if any */
  error: string | null;
  /** Progress percentage (if available) */
  progress: number | undefined;
  /** Start generation and polling */
  startGeneration: () => Promise<{ success: boolean; error?: string }>;
  /** Manually trigger a status check */
  refetch: () => Promise<void>;
}

interface StatusResponse {
  success: boolean;
  status: Model3DGenerationStatus | null;
  modelUrl?: string | null;
  error?: string;
  progress?: number;
}

interface GenerateResponse {
  success: boolean;
  taskId?: string;
  error?: string;
  eligibility?: {
    eligible: boolean;
    reasons: string[];
  };
}

export function use3DGenerationStatus(
  memorialId: string | null,
  initialStatus?: Model3DGenerationStatus | null,
  initialModelUrl?: string | null
): Use3DGenerationStatusResult {
  const [status, setStatus] = useState<Model3DGenerationStatus | null>(initialStatus || null);
  const [modelUrl, setModelUrl] = useState<string | null>(initialModelUrl || null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [isPolling, setIsPolling] = useState(false);

  // Track if component is mounted
  const isMountedRef = useRef(true);
  // Track polling interval
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Determine if we should poll based on status
  // "downloading" means model is ready and being uploaded to storage
  const shouldPoll = status === "pending" || status === "processing" || status === "downloading";

  // Fetch status from API
  const fetchStatus = useCallback(async () => {
    if (!memorialId || !isMountedRef.current) return;

    try {
      const response = await fetch(`/api/cenotaph/3d-status?memorialId=${memorialId}`);
      const data: StatusResponse = await response.json();

      if (!isMountedRef.current) return;

      if (data.success) {
        setStatus(data.status);
        setProgress(data.progress);

        if (data.status === "success" && data.modelUrl) {
          setModelUrl(data.modelUrl);
          setError(null);
        } else if (data.status === "failed") {
          setError(data.error || "Generation failed");
        }
      } else {
        setError(data.error || "Failed to fetch status");
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : "Failed to fetch status");
      }
    }
  }, [memorialId]);

  // Start generation
  const startGeneration = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (!memorialId) {
      return { success: false, error: "No memorial ID" };
    }

    setError(null);
    setProgress(undefined);

    try {
      const response = await fetch("/api/cenotaph/generate-3d", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memorialId }),
      });

      const data: GenerateResponse = await response.json();

      if (data.success) {
        setStatus("pending");
        setIsPolling(true);
        return { success: true };
      } else {
        // Handle eligibility errors specially
        if (data.eligibility && !data.eligibility.eligible) {
          const errorMsg = data.eligibility.reasons.join("; ");
          setError(errorMsg);
          return { success: false, error: errorMsg };
        }
        setError(data.error || "Failed to start generation");
        return { success: false, error: data.error };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to start generation";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, [memorialId]);

  // Refetch status manually
  const refetch = useCallback(async () => {
    await fetchStatus();
  }, [fetchStatus]);

  // Set up polling when shouldPoll changes
  useEffect(() => {
    // Start polling if needed
    if (shouldPoll && memorialId) {
      setIsPolling(true);

      // Initial fetch
      fetchStatus();

      // Set up interval
      pollIntervalRef.current = setInterval(fetchStatus, POLL_INTERVAL_MS);
    } else {
      // Stop polling
      setIsPolling(false);
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [shouldPoll, memorialId, fetchStatus]);

  // Track mount state
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Update from initial values
  useEffect(() => {
    if (initialStatus !== undefined) {
      setStatus(initialStatus);
    }
  }, [initialStatus]);

  useEffect(() => {
    if (initialModelUrl !== undefined) {
      setModelUrl(initialModelUrl);
    }
  }, [initialModelUrl]);

  return {
    status,
    isPolling,
    modelUrl,
    error,
    progress,
    startGeneration,
    refetch,
  };
}
