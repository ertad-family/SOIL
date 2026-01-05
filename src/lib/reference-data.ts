/**
 * Reference Data Access Layer
 *
 * Provides server-side functions to fetch organization types, lifecycle stages,
 * and business models from the database.
 *
 * For client components, use the useReferenceData hook.
 *
 * Related Issue: #34
 */

import { createClient } from "@/lib/supabase/server";
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

// =============================================================================
// SERVER-SIDE FUNCTIONS
// =============================================================================

/**
 * Fetch all active organization types from the database.
 * Use in server components.
 */
export async function getOrganizationTypes(): Promise<OrgTypeOption[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("organization_types")
    .select("type_key, label, label_short, description")
    .eq("is_active", true)
    .order("display_order");

  if (error) {
    console.error("Error fetching org types:", error);
    throw new Error(`Failed to fetch organization types: ${error.message}`);
  }

  return data.map((t) => ({
    value: t.type_key as OrganizationType,
    label: t.label,
    labelShort: t.label_short,
    description: t.description,
  }));
}

/**
 * Fetch all active lifecycle stages from the database.
 * Use in server components.
 */
export async function getLifecycleStages(): Promise<StageOption[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lifecycle_stages")
    .select("stage_key, label, description")
    .eq("is_active", true)
    .order("display_order");

  if (error) {
    console.error("Error fetching stages:", error);
    throw new Error(`Failed to fetch lifecycle stages: ${error.message}`);
  }

  return data.map((s) => ({
    value: s.stage_key as LifecycleStage,
    label: s.label,
    description: s.description,
  }));
}

/**
 * Fetch business models for a specific organization type.
 * Use in server components.
 */
export async function getBusinessModels(orgType: OrganizationType): Promise<BusinessModelOption[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("business_models")
    .select("model_key, label")
    .eq("org_type_key", orgType)
    .eq("is_active", true)
    .order("display_order");

  if (error) {
    console.error("Error fetching business models:", error);
    throw new Error(`Failed to fetch business models: ${error.message}`);
  }

  return data.map((m) => ({
    value: m.model_key,
    label: m.label,
  }));
}

/**
 * Fetch all business models grouped by organization type.
 * Use in server components.
 */
export async function getAllBusinessModels(): Promise<
  Record<OrganizationType, BusinessModelOption[]>
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("business_models")
    .select("model_key, org_type_key, label")
    .eq("is_active", true)
    .order("display_order");

  if (error) {
    console.error("Error fetching all business models:", error);
    throw new Error(`Failed to fetch business models: ${error.message}`);
  }

  const grouped = {} as Record<OrganizationType, BusinessModelOption[]>;
  for (const m of data) {
    const key = m.org_type_key as OrganizationType;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push({ value: m.model_key, label: m.label });
  }

  return grouped;
}

/**
 * Build a lookup object for organization type labels.
 * Use in server components.
 */
export async function getOrgTypeLabels(): Promise<Record<OrganizationType, string>> {
  const orgTypes = await getOrganizationTypes();
  const labels = {} as Record<OrganizationType, string>;
  for (const t of orgTypes) {
    labels[t.value] = t.label;
  }
  return labels;
}

/**
 * Build a lookup object for lifecycle stage labels.
 * Use in server components.
 */
export async function getStageLabels(): Promise<Record<LifecycleStage, string>> {
  const stages = await getLifecycleStages();
  const labels = {} as Record<LifecycleStage, string>;
  for (const s of stages) {
    labels[s.value] = s.label;
  }
  return labels;
}
