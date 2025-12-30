"use client";

/**
 * Reference Data Hook
 *
 * Fetches organization types, lifecycle stages, and business models from the API.
 * Use this hook in client components.
 *
 * For server components, use functions from @/lib/reference-data instead.
 *
 * Related Issue: #34
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import type { OrganizationType, LifecycleStage } from "@/types/interview";

// =============================================================================
// TYPES
// =============================================================================

export interface OrgTypeOption {
  value: OrganizationType;
  label: string;
  labelShort: string;
  description: string | null;
}

export interface StageOption {
  value: LifecycleStage;
  label: string;
  description: string | null;
}

export interface BusinessModelOption {
  value: string;
  label: string;
}

interface ReferenceData {
  orgTypes: OrgTypeOption[];
  stages: StageOption[];
  businessModels: Record<string, BusinessModelOption[]>;
}

export interface UseReferenceDataResult {
  // Raw data arrays
  orgTypes: OrgTypeOption[];
  stages: StageOption[];
  businessModels: Record<string, BusinessModelOption[]>;

  // Loading and error states
  isLoading: boolean;
  error: string | null;

  // Convenience lookup functions
  getOrgTypeLabel: (key: OrganizationType) => string;
  getOrgTypeShortLabel: (key: OrganizationType) => string;
  getOrgTypeDescription: (key: OrganizationType) => string | null;
  getStageLabel: (key: LifecycleStage) => string;
  getStageDescription: (key: LifecycleStage) => string | null;
  getBusinessModelsForOrgType: (orgType: OrganizationType) => BusinessModelOption[];

  // For building Record<OrganizationType, string> compatible objects
  orgTypeLabels: Record<OrganizationType, string>;
  orgTypeDescriptions: Record<OrganizationType, string>;
  stageLabels: Record<LifecycleStage, string>;
  stageDescriptions: Record<LifecycleStage, string>;
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Hook to fetch reference data (org types, stages, business models) from API.
 * Caches data in memory for the component lifecycle.
 */
export function useReferenceData(): UseReferenceDataResult {
  const [data, setData] = useState<ReferenceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData(): Promise<void> {
      try {
        const response = await fetch("/api/reference-data");
        if (!response.ok) {
          throw new Error(`Failed to fetch reference data: ${response.status}`);
        }

        const result = await response.json();
        if (isMounted) {
          setData({
            orgTypes: result.orgTypes || [],
            stages: result.stages || [],
            businessModels: result.businessModels || {},
          });
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : "Unknown error";
          setError(message);
          console.error("Error fetching reference data:", err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Build lookup objects for org types
  const orgTypeLabels = useMemo(() => {
    const labels = {} as Record<OrganizationType, string>;
    for (const t of data?.orgTypes || []) {
      labels[t.value] = t.label;
    }
    return labels;
  }, [data?.orgTypes]);

  const orgTypeDescriptions = useMemo(() => {
    const descriptions = {} as Record<OrganizationType, string>;
    for (const t of data?.orgTypes || []) {
      descriptions[t.value] = t.description || "";
    }
    return descriptions;
  }, [data?.orgTypes]);

  // Build lookup objects for stages
  const stageLabels = useMemo(() => {
    const labels = {} as Record<LifecycleStage, string>;
    for (const s of data?.stages || []) {
      labels[s.value] = s.label;
    }
    return labels;
  }, [data?.stages]);

  const stageDescriptions = useMemo(() => {
    const descriptions = {} as Record<LifecycleStage, string>;
    for (const s of data?.stages || []) {
      descriptions[s.value] = s.description || "";
    }
    return descriptions;
  }, [data?.stages]);

  // Convenience functions
  const getOrgTypeLabel = useCallback(
    (key: OrganizationType): string => {
      return orgTypeLabels[key] || key;
    },
    [orgTypeLabels]
  );

  const getOrgTypeShortLabel = useCallback(
    (key: OrganizationType): string => {
      const found = data?.orgTypes.find((t) => t.value === key);
      return found?.labelShort || key;
    },
    [data?.orgTypes]
  );

  const getOrgTypeDescription = useCallback(
    (key: OrganizationType): string | null => {
      const found = data?.orgTypes.find((t) => t.value === key);
      return found?.description || null;
    },
    [data?.orgTypes]
  );

  const getStageLabel = useCallback(
    (key: LifecycleStage): string => {
      return stageLabels[key] || key;
    },
    [stageLabels]
  );

  const getStageDescription = useCallback(
    (key: LifecycleStage): string | null => {
      const found = data?.stages.find((s) => s.value === key);
      return found?.description || null;
    },
    [data?.stages]
  );

  const getBusinessModelsForOrgType = useCallback(
    (orgType: OrganizationType): BusinessModelOption[] => {
      return data?.businessModels[orgType] || [];
    },
    [data?.businessModels]
  );

  return {
    orgTypes: data?.orgTypes || [],
    stages: data?.stages || [],
    businessModels: data?.businessModels || {},
    isLoading,
    error,
    getOrgTypeLabel,
    getOrgTypeShortLabel,
    getOrgTypeDescription,
    getStageLabel,
    getStageDescription,
    getBusinessModelsForOrgType,
    orgTypeLabels,
    orgTypeDescriptions,
    stageLabels,
    stageDescriptions,
  };
}
