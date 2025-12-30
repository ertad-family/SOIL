/**
 * Resource Matrix Data
 *
 * Defines which market resources and operating conditions are relevant
 * for each organization type, similar to function-matrix.ts pattern.
 *
 * Legend:
 * - active: Expected for this org type, shown by default
 * - dimmed: Not typical but can be activated by user
 * - hidden: Irrelevant for this org type, not shown
 */

import type { OrganizationType, MarketResourceType, FunctionStatus } from "@/types/interview";

// =============================================================================
// RESOURCE DEFINITIONS
// =============================================================================

export interface ResourceDefinition {
  id: MarketResourceType;
  name: string;
  description: string;
  /** Context question - varies by resource type */
  contextQuestion: string;
}

/**
 * Master list of all market resources with their definitions.
 */
export const RESOURCE_DEFINITIONS: ResourceDefinition[] = [
  {
    id: "customers",
    name: "Customers",
    description: "End users or buyers of your product/service",
    contextQuestion: "Who were your target customers?",
  },
  {
    id: "talent",
    name: "Talent",
    description: "Skilled employees and contractors",
    contextQuestion: "What roles were most critical to hire?",
  },
  {
    id: "suppliers",
    name: "Suppliers & Vendors",
    description: "External providers of goods, materials, or services",
    contextQuestion: "What were your key supplier relationships?",
  },
  {
    id: "capital",
    name: "Capital & Funding",
    description: "Investment, loans, and financial resources",
    contextQuestion: "What were your primary funding sources?",
  },
  {
    id: "donors",
    name: "Donors",
    description: "Individual and institutional donors",
    contextQuestion: "Who were your primary donor segments?",
  },
  {
    id: "volunteers",
    name: "Volunteers",
    description: "Unpaid contributors to your mission",
    contextQuestion: "What roles did volunteers fill?",
  },
  {
    id: "grants",
    name: "Grants",
    description: "Foundation and government grants",
    contextQuestion: "What types of grants did you pursue?",
  },
  {
    id: "partners",
    name: "Partners",
    description: "Strategic partners and distribution channels",
    contextQuestion: "Who were your key partners?",
  },
  {
    id: "technology",
    name: "Technology",
    description: "Technical infrastructure and tools",
    contextQuestion: "What technology was critical to your operations?",
  },
  {
    id: "community",
    name: "Community",
    description: "User community, audience, or network",
    contextQuestion: "What community did you build or serve?",
  },
];

// =============================================================================
// RESOURCE STATUS MATRIX BY ORG TYPE
// =============================================================================

type ResourceStatusMatrix = Record<MarketResourceType, FunctionStatus>;

/**
 * Resource visibility/relevance by organization type.
 * - active: Primary resource for this org type
 * - dimmed: May be relevant, user can activate
 * - hidden: Not relevant for this org type
 */
export const RESOURCE_MATRIX: Record<OrganizationType, ResourceStatusMatrix> = {
  tech_product: {
    customers: "active",
    talent: "active",
    suppliers: "dimmed",
    capital: "active",
    donors: "hidden",
    volunteers: "hidden",
    grants: "dimmed", // Some tech startups get grants
    partners: "active",
    technology: "active",
    community: "active",
  },
  services: {
    customers: "active",
    talent: "active",
    suppliers: "dimmed",
    capital: "dimmed",
    donors: "hidden",
    volunteers: "hidden",
    grants: "hidden",
    partners: "active",
    technology: "dimmed",
    community: "dimmed",
  },
  ecommerce: {
    customers: "active",
    talent: "active",
    suppliers: "active",
    capital: "active",
    donors: "hidden",
    volunteers: "hidden",
    grants: "hidden",
    partners: "active",
    technology: "active",
    community: "dimmed",
  },
  manufacturing: {
    customers: "active",
    talent: "active",
    suppliers: "active",
    capital: "active",
    donors: "hidden",
    volunteers: "hidden",
    grants: "dimmed",
    partners: "active",
    technology: "dimmed",
    community: "hidden",
  },
  ngo: {
    customers: "hidden", // NGOs use "donors" and "beneficiaries" instead
    talent: "active",
    suppliers: "dimmed",
    capital: "hidden", // NGOs use "grants" and "donors" instead
    donors: "active",
    volunteers: "active",
    grants: "active",
    partners: "active",
    technology: "dimmed",
    community: "active",
  },
  media: {
    customers: "active", // Audience
    talent: "active",
    suppliers: "dimmed",
    capital: "active",
    donors: "hidden",
    volunteers: "hidden",
    grants: "dimmed",
    partners: "active",
    technology: "active",
    community: "active",
  },
  other: {
    // Generic defaults for "Other" org type - all resources dimmed for user customization
    customers: "dimmed",
    talent: "dimmed",
    suppliers: "dimmed",
    capital: "dimmed",
    donors: "dimmed",
    volunteers: "dimmed",
    grants: "dimmed",
    partners: "dimmed",
    technology: "dimmed",
    community: "dimmed",
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get all resources for an organization type, filtered by visibility.
 * Returns only active and dimmed resources (not hidden).
 */
export function getResourcesForOrgType(orgType: OrganizationType): ResourceDefinition[] {
  const matrix = RESOURCE_MATRIX[orgType];
  return RESOURCE_DEFINITIONS.filter((resource) => matrix[resource.id] !== "hidden");
}

/**
 * Get the status of a specific resource for an org type.
 */
export function getResourceStatus(
  orgType: OrganizationType,
  resourceId: MarketResourceType
): FunctionStatus {
  return RESOURCE_MATRIX[orgType][resourceId];
}

/**
 * Get active resources for an org type (primary resources).
 */
export function getActiveResourcesForOrgType(orgType: OrganizationType): ResourceDefinition[] {
  const matrix = RESOURCE_MATRIX[orgType];
  return RESOURCE_DEFINITIONS.filter((resource) => matrix[resource.id] === "active");
}

/**
 * Get dimmed resources for an org type (optional resources).
 */
export function getDimmedResourcesForOrgType(orgType: OrganizationType): ResourceDefinition[] {
  const matrix = RESOURCE_MATRIX[orgType];
  return RESOURCE_DEFINITIONS.filter((resource) => matrix[resource.id] === "dimmed");
}

/**
 * Get resource definition by ID.
 */
export function getResourceDefinition(
  resourceId: MarketResourceType
): ResourceDefinition | undefined {
  return RESOURCE_DEFINITIONS.find((r) => r.id === resourceId);
}

// =============================================================================
// LABELS FOR UI
// =============================================================================

export const RESOURCE_LABELS: Record<MarketResourceType, string> = {
  customers: "Customers",
  talent: "Talent",
  suppliers: "Suppliers & Vendors",
  capital: "Capital & Funding",
  donors: "Donors",
  volunteers: "Volunteers",
  grants: "Grants",
  partners: "Partners",
  technology: "Technology",
  community: "Community",
};
