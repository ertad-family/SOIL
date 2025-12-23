import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { OrganizationType, LifecycleStage, FunctionStatus } from "@/types/interview";

interface FunctionCategory {
  category_id: string;
  category_name: string;
  org_type: OrganizationType | null;
  display_order: number;
}

interface OrgFunction {
  function_id: string;
  function_name: string;
  description: string | null;
  category_id: string;
  display_order: number;
  status_matrix: Record<OrganizationType, Record<LifecycleStage, FunctionStatus>>;
}

interface CategoryWithFunctions {
  id: string;
  name: string;
  orgType: OrganizationType | null;
  functions: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
}

/**
 * GET /api/functions
 *
 * Returns function catalog from database.
 *
 * Query params:
 * - orgType: Filter by organization type (optional, returns only applicable categories)
 * - stage: Lifecycle stage for status filtering (optional)
 * - includeHidden: If true, includes hidden functions (default false)
 *
 * Response:
 * - categories: Array of categories with their functions
 * - statusMatrix: Nested object with status per function/orgType/stage
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orgType = searchParams.get("orgType") as OrganizationType | null;
    const stage = searchParams.get("stage") as LifecycleStage | null;
    const includeHidden = searchParams.get("includeHidden") === "true";

    const supabase = await createClient();

    // Fetch categories
    const { data: categoriesData, error: catError } = await supabase
      .from("function_categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (catError) {
      console.error("Error fetching categories:", catError);
      return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }

    // Fetch functions
    const { data: functionsData, error: funcError } = await supabase
      .from("org_functions")
      .select("*")
      .order("display_order", { ascending: true });

    if (funcError) {
      console.error("Error fetching functions:", funcError);
      return NextResponse.json({ error: "Failed to fetch functions" }, { status: 500 });
    }

    const categories = categoriesData as FunctionCategory[];
    const functions = functionsData as OrgFunction[];

    // Filter categories by org type if specified
    let filteredCategories = categories;
    if (orgType) {
      filteredCategories = categories.filter(
        (cat) => cat.org_type === null || cat.org_type === orgType
      );
    }

    // Build status matrix lookup
    const statusMatrix: Record<
      string,
      Record<OrganizationType, Record<LifecycleStage, FunctionStatus>>
    > = {};
    for (const func of functions) {
      statusMatrix[func.function_id] = func.status_matrix;
    }

    // Helper to get function status
    const getFunctionStatus = (
      functionId: string,
      targetOrgType: OrganizationType,
      targetStage: LifecycleStage
    ): FunctionStatus => {
      const matrix = statusMatrix[functionId];
      if (!matrix) return "dimmed";
      const orgMatrix = matrix[targetOrgType];
      if (!orgMatrix) return "dimmed";
      return orgMatrix[targetStage] || "dimmed";
    };

    // Build response with categories and functions
    const result: CategoryWithFunctions[] = [];

    for (const cat of filteredCategories) {
      // Get functions for this category
      let categoryFunctions = functions.filter((f) => f.category_id === cat.category_id);

      // Filter by status if orgType and stage are provided
      if (orgType && stage && !includeHidden) {
        categoryFunctions = categoryFunctions.filter((f) => {
          const status = getFunctionStatus(f.function_id, orgType, stage);
          return status !== "hidden";
        });
      }

      // Skip empty categories
      if (categoryFunctions.length === 0) continue;

      result.push({
        id: cat.category_id,
        name: cat.category_name,
        orgType: cat.org_type as OrganizationType | null,
        functions: categoryFunctions.map((f) => ({
          id: f.function_id,
          name: f.function_name,
          description: f.description || undefined,
        })),
      });
    }

    return NextResponse.json({
      categories: result,
      statusMatrix,
    });
  } catch (err) {
    console.error("Error in functions API:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
