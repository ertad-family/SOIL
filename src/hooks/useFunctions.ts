import { useState, useEffect, useMemo } from "react";
import type {
  OrganizationType,
  LifecycleStage,
  FunctionStatus,
  FunctionCategoryDefinition,
} from "@/types/interview";

interface FunctionFromAPI {
  id: string;
  name: string;
  description?: string;
}

interface CategoryFromAPI {
  id: string;
  name: string;
  orgType: OrganizationType | null;
  functions: FunctionFromAPI[];
}

interface StatusMatrix {
  [functionId: string]: {
    [orgType in OrganizationType]?: {
      [stage in LifecycleStage]?: FunctionStatus;
    };
  };
}

interface APIResponse {
  categories: CategoryFromAPI[];
  statusMatrix: StatusMatrix;
}

interface UseFunctionsResult {
  categories: FunctionCategoryDefinition[];
  isLoading: boolean;
  error: string | null;
  getCategoriesForOrgType: (orgType: OrganizationType) => FunctionCategoryDefinition[];
  getVisibleFunctionsForCategory: (
    orgType: OrganizationType,
    categoryId: string,
    stage: LifecycleStage
  ) => Array<{ id: string; name: string; description?: string; status: FunctionStatus }>;
  getFunctionStatus: (
    orgType: OrganizationType,
    functionId: string,
    stage: LifecycleStage
  ) => FunctionStatus;
}

/**
 * Hook to fetch and work with function catalog data from the API.
 * Provides similar interface to the static function-matrix.ts helpers.
 */
export function useFunctions(): UseFunctionsResult {
  const [data, setData] = useState<APIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch functions from API
  useEffect(() => {
    let isMounted = true;

    const fetchFunctions = async () => {
      try {
        const response = await fetch("/api/functions");
        if (!response.ok) {
          throw new Error(`Failed to fetch functions: ${response.status}`);
        }
        const result = (await response.json()) as APIResponse;
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching functions:", err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchFunctions();

    return () => {
      isMounted = false;
    };
  }, []);

  // Convert API categories to FunctionCategoryDefinition format
  const categories = useMemo((): FunctionCategoryDefinition[] => {
    if (!data) return [];
    return data.categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      functions: cat.functions.map((f) => ({
        id: f.id,
        name: f.name,
        description: f.description,
      })),
    }));
  }, [data]);

  // Get function status from matrix
  const getFunctionStatus = (
    orgType: OrganizationType,
    functionId: string,
    stage: LifecycleStage
  ): FunctionStatus => {
    if (!data?.statusMatrix) return "dimmed";
    const funcMatrix = data.statusMatrix[functionId];
    if (!funcMatrix) return "dimmed";
    const orgMatrix = funcMatrix[orgType];
    if (!orgMatrix) return "dimmed";
    return orgMatrix[stage] || "dimmed";
  };

  // Get categories for a specific org type
  const getCategoriesForOrgType = (orgType: OrganizationType): FunctionCategoryDefinition[] => {
    if (!data) return [];

    // Filter categories: common (null orgType) + specific to this org type
    const filtered = data.categories.filter(
      (cat) => cat.orgType === null || cat.orgType === orgType
    );

    // Filter out categories where ALL functions are hidden for this org type
    const result: FunctionCategoryDefinition[] = [];

    for (const cat of filtered) {
      const visibleFunctions = cat.functions.filter((func) => {
        // If hidden in ALL stages, exclude
        const matrix = data.statusMatrix[func.id]?.[orgType];
        if (!matrix) return true; // No matrix = show it
        const allHidden = Object.values(matrix).every((s) => s === "hidden");
        return !allHidden;
      });

      if (visibleFunctions.length === 0) continue;

      result.push({
        id: cat.id,
        name: cat.name,
        functions: visibleFunctions.map((f) => ({
          id: f.id,
          name: f.name,
          description: f.description,
        })),
      });
    }

    return result;
  };

  // Get visible functions for a category (filtered by status)
  const getVisibleFunctionsForCategory = (
    orgType: OrganizationType,
    categoryId: string,
    stage: LifecycleStage
  ): Array<{ id: string; name: string; description?: string; status: FunctionStatus }> => {
    if (!data) return [];

    const category = data.categories.find((c) => c.id === categoryId);
    if (!category) return [];

    return category.functions
      .map((func) => ({
        id: func.id,
        name: func.name,
        description: func.description,
        status: getFunctionStatus(orgType, func.id, stage),
      }))
      .filter((func) => func.status !== "hidden");
  };

  return {
    categories,
    isLoading,
    error,
    getCategoriesForOrgType,
    getVisibleFunctionsForCategory,
    getFunctionStatus,
  };
}

/**
 * Static version for components that need synchronous access
 * (like AddFunctionDialog which needs all categories for all org types)
 */
export function useFunctionCatalog(): {
  allCategories: CategoryFromAPI[];
  statusMatrix: StatusMatrix;
  isLoading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<APIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchFunctions = async () => {
      try {
        // Fetch all functions without filtering
        const response = await fetch("/api/functions?includeHidden=true");
        if (!response.ok) {
          throw new Error(`Failed to fetch functions: ${response.status}`);
        }
        const result = (await response.json()) as APIResponse;
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching function catalog:", err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchFunctions();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    allCategories: data?.categories || [],
    statusMatrix: data?.statusMatrix || {},
    isLoading,
    error,
  };
}
