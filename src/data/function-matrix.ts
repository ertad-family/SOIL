/**
 * Function Matrix Data
 *
 * Defines organizational functions by category, with status indicators
 * (active/dimmed/hidden) per organization type and lifecycle stage.
 *
 * Legend:
 * - active: Expected for this type/stage, shown by default
 * - dimmed: Not typical, but can be activated by user
 * - hidden: Irrelevant for this organization type
 */

import type {
  OrganizationType,
  LifecycleStage,
  FunctionStatus,
  FunctionCategoryDefinition,
} from '@/types/interview'

// =============================================================================
// MASTER FUNCTION CATALOG
// =============================================================================

/**
 * Master list of all function categories and their sub-functions.
 * This is the canonical list - org types can override names or hide functions.
 */
export const FUNCTION_CATEGORIES: FunctionCategoryDefinition[] = [
  {
    id: 'sales',
    name: 'Sales',
    functions: [
      { id: 'lead_generation', name: 'Lead Generation' },
      { id: 'pipeline_management', name: 'Pipeline Management' },
      { id: 'closing_negotiation', name: 'Closing / Negotiation' },
      { id: 'account_management', name: 'Account Management' },
      { id: 'sales_operations', name: 'Sales Operations' },
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    functions: [
      { id: 'brand_positioning', name: 'Brand & Positioning' },
      { id: 'content', name: 'Content' },
      { id: 'performance_paid', name: 'Performance / Paid' },
      { id: 'pr_communications', name: 'PR & Communications' },
      { id: 'community', name: 'Community' },
    ],
  },
  {
    id: 'product',
    name: 'Product',
    functions: [
      { id: 'product_strategy', name: 'Product Strategy' },
      { id: 'product_management', name: 'Product Management' },
      { id: 'ux_design', name: 'UX / Design' },
      { id: 'product_analytics', name: 'Product Analytics' },
    ],
  },
  {
    id: 'engineering',
    name: 'Engineering',
    functions: [
      { id: 'architecture', name: 'Architecture' },
      { id: 'development', name: 'Development' },
      { id: 'qa_testing', name: 'QA / Testing' },
      { id: 'devops_infrastructure', name: 'DevOps / Infrastructure' },
      { id: 'technical_debt', name: 'Technical Debt Management' },
    ],
  },
  {
    id: 'operations',
    name: 'Operations',
    functions: [
      { id: 'process_design', name: 'Process Design' },
      { id: 'vendor_management', name: 'Vendor Management' },
      { id: 'logistics_fulfillment', name: 'Logistics / Fulfillment' },
      { id: 'facilities', name: 'Facilities' },
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    functions: [
      { id: 'accounting', name: 'Accounting' },
      { id: 'financial_planning', name: 'Financial Planning' },
      { id: 'cash_management', name: 'Cash Management' },
      { id: 'fundraising_ir', name: 'Fundraising / IR' },
      { id: 'tax_compliance', name: 'Tax & Compliance' },
    ],
  },
  {
    id: 'people_hr',
    name: 'People / HR',
    functions: [
      { id: 'recruiting', name: 'Recruiting' },
      { id: 'onboarding', name: 'Onboarding' },
      { id: 'performance_management', name: 'Performance Management' },
      { id: 'compensation_benefits', name: 'Compensation & Benefits' },
      { id: 'culture_engagement', name: 'Culture & Engagement' },
      { id: 'offboarding', name: 'Offboarding' },
    ],
  },
  {
    id: 'customer_success',
    name: 'Customer Success',
    functions: [
      { id: 'customer_onboarding', name: 'Customer Onboarding' },
      { id: 'support', name: 'Support' },
      { id: 'retention', name: 'Retention' },
      { id: 'expansion_upsell', name: 'Expansion / Upsell' },
    ],
  },
  {
    id: 'legal',
    name: 'Legal',
    functions: [
      { id: 'contracts', name: 'Contracts' },
      { id: 'ip_protection', name: 'IP Protection' },
      { id: 'regulatory_compliance', name: 'Regulatory Compliance' },
      { id: 'corporate_governance', name: 'Corporate Governance' },
    ],
  },
  {
    id: 'it_security',
    name: 'IT & Security',
    functions: [
      { id: 'internal_tools', name: 'Internal Tools' },
      { id: 'data_management', name: 'Data Management' },
      { id: 'security', name: 'Security' },
      { id: 'access_control', name: 'Access Control' },
    ],
  },
]

// =============================================================================
// ORG-TYPE SPECIFIC CATEGORIES
// =============================================================================

/**
 * Additional categories that only appear for specific org types
 */
export const ORG_SPECIFIC_CATEGORIES: Record<OrganizationType, FunctionCategoryDefinition[]> = {
  tech_product: [],
  services: [],
  ecommerce: [
    {
      id: 'inventory',
      name: 'Inventory',
      functions: [
        { id: 'inventory_management', name: 'Inventory Management' },
      ],
    },
  ],
  manufacturing: [
    {
      id: 'production',
      name: 'Production',
      functions: [
        { id: 'production_planning', name: 'Production Planning' },
        { id: 'manufacturing_operations', name: 'Manufacturing Operations' },
        { id: 'quality_control', name: 'Quality Control' },
        { id: 'equipment_maintenance', name: 'Equipment Maintenance' },
        { id: 'safety_environment', name: 'Safety & Environment' },
      ],
    },
  ],
  ngo: [
    {
      id: 'fundraising',
      name: 'Fundraising',
      functions: [
        { id: 'donor_acquisition', name: 'Donor Acquisition' },
        { id: 'donor_relations', name: 'Donor Relations' },
        { id: 'grant_writing', name: 'Grant Writing' },
        { id: 'corporate_partnerships', name: 'Corporate Partnerships' },
        { id: 'events_campaigns', name: 'Events / Campaigns' },
      ],
    },
    {
      id: 'programs',
      name: 'Programs',
      functions: [
        { id: 'program_design', name: 'Program Design' },
        { id: 'program_delivery', name: 'Program Delivery' },
        { id: 'impact_measurement', name: 'Impact Measurement' },
        { id: 'beneficiary_relations', name: 'Beneficiary Relations' },
      ],
    },
    {
      id: 'commercial_activities',
      name: 'Commercial Activities',
      functions: [
        { id: 'product_sales', name: 'Product Sales (merch, goods)' },
        { id: 'service_sales', name: 'Service Sales' },
        { id: 'pricing_strategy', name: 'Pricing Strategy' },
        { id: 'ecommerce_operations', name: 'E-commerce Operations' },
      ],
    },
    {
      id: 'stakeholder_relations',
      name: 'Stakeholder Relations',
      functions: [
        { id: 'board_relations', name: 'Board Relations' },
        { id: 'government_relations', name: 'Government Relations' },
        { id: 'partner_ngos', name: 'Partner NGOs' },
        { id: 'media_relations', name: 'Media Relations' },
      ],
    },
  ],
  media: [
    {
      id: 'content',
      name: 'Content',
      functions: [
        { id: 'content_strategy', name: 'Content Strategy' },
        { id: 'content_production', name: 'Content Production' },
        { id: 'editorial_curation', name: 'Editorial / Curation' },
        { id: 'talent_management', name: 'Talent Management' },
        { id: 'content_analytics', name: 'Content Analytics' },
      ],
    },
    {
      id: 'audience_relations',
      name: 'Audience Relations',
      functions: [
        { id: 'community_management', name: 'Community Management' },
        { id: 'audience_support', name: 'Support' },
        { id: 'audience_retention', name: 'Retention / Engagement' },
        { id: 'feedback_research', name: 'Feedback / Research' },
      ],
    },
  ],
}

// =============================================================================
// STATUS MATRICES BY ORG TYPE
// =============================================================================

type StageMatrix = Record<LifecycleStage, FunctionStatus>

/**
 * Helper to create a stage matrix with common patterns
 */
const s = (f: FunctionStatus, e: FunctionStatus, g: FunctionStatus, m: FunctionStatus): StageMatrix => ({
  formation: f,
  establishment: e,
  growth: g,
  maturity: m,
})

// Shortcuts for common patterns
const ALWAYS_ACTIVE = s('active', 'active', 'active', 'active')
const GROWS_TO_ACTIVE = s('dimmed', 'active', 'active', 'active')
const LATE_ACTIVE = s('dimmed', 'dimmed', 'active', 'active')
const MATURE_ONLY = s('dimmed', 'dimmed', 'dimmed', 'active')
const ALWAYS_DIMMED = s('dimmed', 'dimmed', 'dimmed', 'dimmed')
const ALWAYS_HIDDEN = s('hidden', 'hidden', 'hidden', 'hidden')

/**
 * Tech Product function status matrix
 */
export const TECH_PRODUCT_MATRIX: Record<string, StageMatrix> = {
  // Sales
  lead_generation: ALWAYS_ACTIVE,
  pipeline_management: s('dimmed', 'active', 'active', 'active'),
  closing_negotiation: ALWAYS_ACTIVE,
  account_management: LATE_ACTIVE,
  sales_operations: MATURE_ONLY,

  // Marketing
  brand_positioning: GROWS_TO_ACTIVE,
  content: GROWS_TO_ACTIVE,
  performance_paid: GROWS_TO_ACTIVE,
  pr_communications: LATE_ACTIVE,
  community: LATE_ACTIVE,

  // Product
  product_strategy: ALWAYS_ACTIVE,
  product_management: ALWAYS_ACTIVE,
  ux_design: ALWAYS_ACTIVE,
  product_analytics: GROWS_TO_ACTIVE,

  // Engineering
  architecture: ALWAYS_ACTIVE,
  development: ALWAYS_ACTIVE,
  qa_testing: GROWS_TO_ACTIVE,
  devops_infrastructure: GROWS_TO_ACTIVE,
  technical_debt: LATE_ACTIVE,

  // Operations
  process_design: GROWS_TO_ACTIVE,
  vendor_management: LATE_ACTIVE,
  logistics_fulfillment: ALWAYS_HIDDEN,
  facilities: MATURE_ONLY,

  // Finance
  accounting: ALWAYS_ACTIVE,
  financial_planning: GROWS_TO_ACTIVE,
  cash_management: ALWAYS_ACTIVE,
  fundraising_ir: ALWAYS_ACTIVE,
  tax_compliance: GROWS_TO_ACTIVE,

  // People / HR
  recruiting: ALWAYS_ACTIVE,
  onboarding: GROWS_TO_ACTIVE,
  performance_management: LATE_ACTIVE,
  compensation_benefits: LATE_ACTIVE,
  culture_engagement: GROWS_TO_ACTIVE,
  offboarding: MATURE_ONLY,

  // Customer Success
  customer_onboarding: ALWAYS_ACTIVE,
  support: ALWAYS_ACTIVE,
  retention: GROWS_TO_ACTIVE,
  expansion_upsell: LATE_ACTIVE,

  // Legal
  contracts: ALWAYS_ACTIVE,
  ip_protection: ALWAYS_ACTIVE,
  regulatory_compliance: LATE_ACTIVE,
  corporate_governance: MATURE_ONLY,

  // IT & Security
  internal_tools: GROWS_TO_ACTIVE,
  data_management: GROWS_TO_ACTIVE,
  security: GROWS_TO_ACTIVE,
  access_control: LATE_ACTIVE,
}

/**
 * Services function status matrix
 */
export const SERVICES_MATRIX: Record<string, StageMatrix> = {
  // Sales
  lead_generation: ALWAYS_ACTIVE,
  pipeline_management: ALWAYS_ACTIVE,
  closing_negotiation: ALWAYS_ACTIVE,
  account_management: ALWAYS_ACTIVE,
  sales_operations: LATE_ACTIVE,

  // Marketing
  brand_positioning: GROWS_TO_ACTIVE,
  content: LATE_ACTIVE,
  performance_paid: LATE_ACTIVE,
  pr_communications: MATURE_ONLY,
  community: MATURE_ONLY,

  // Product (as Service Design)
  product_strategy: ALWAYS_ACTIVE, // Service Design
  product_management: LATE_ACTIVE, // Productization
  ux_design: ALWAYS_HIDDEN,
  product_analytics: LATE_ACTIVE, // Service Analytics

  // Engineering (hidden for pure services)
  architecture: ALWAYS_HIDDEN,
  development: ALWAYS_HIDDEN,
  qa_testing: ALWAYS_HIDDEN,
  devops_infrastructure: ALWAYS_HIDDEN,
  technical_debt: ALWAYS_HIDDEN,

  // Operations
  process_design: GROWS_TO_ACTIVE,
  vendor_management: GROWS_TO_ACTIVE,
  logistics_fulfillment: ALWAYS_HIDDEN,
  facilities: LATE_ACTIVE,

  // Finance
  accounting: ALWAYS_ACTIVE,
  financial_planning: GROWS_TO_ACTIVE,
  cash_management: ALWAYS_ACTIVE,
  fundraising_ir: MATURE_ONLY,
  tax_compliance: GROWS_TO_ACTIVE,

  // People / HR
  recruiting: ALWAYS_ACTIVE,
  onboarding: GROWS_TO_ACTIVE,
  performance_management: GROWS_TO_ACTIVE,
  compensation_benefits: LATE_ACTIVE,
  culture_engagement: GROWS_TO_ACTIVE,
  offboarding: LATE_ACTIVE,

  // Customer Success (Client Relations)
  customer_onboarding: ALWAYS_ACTIVE,
  support: ALWAYS_ACTIVE,
  retention: ALWAYS_ACTIVE,
  expansion_upsell: GROWS_TO_ACTIVE,

  // Legal
  contracts: ALWAYS_ACTIVE,
  ip_protection: MATURE_ONLY,
  regulatory_compliance: LATE_ACTIVE,
  corporate_governance: MATURE_ONLY,

  // IT & Security
  internal_tools: GROWS_TO_ACTIVE,
  data_management: LATE_ACTIVE,
  security: LATE_ACTIVE,
  access_control: MATURE_ONLY,
}

/**
 * E-commerce function status matrix
 */
export const ECOMMERCE_MATRIX: Record<string, StageMatrix> = {
  // Sales
  lead_generation: ALWAYS_ACTIVE,
  pipeline_management: ALWAYS_HIDDEN,
  closing_negotiation: LATE_ACTIVE,
  account_management: ALWAYS_HIDDEN,
  sales_operations: GROWS_TO_ACTIVE,

  // Marketing
  brand_positioning: ALWAYS_ACTIVE,
  content: ALWAYS_ACTIVE,
  performance_paid: ALWAYS_ACTIVE,
  pr_communications: LATE_ACTIVE,
  community: LATE_ACTIVE,

  // Product (as Merchandising)
  product_strategy: ALWAYS_ACTIVE, // Product Sourcing / Curation
  product_management: ALWAYS_ACTIVE, // Pricing Strategy
  ux_design: ALWAYS_ACTIVE,
  product_analytics: GROWS_TO_ACTIVE,

  // Engineering
  architecture: GROWS_TO_ACTIVE,
  development: GROWS_TO_ACTIVE,
  qa_testing: LATE_ACTIVE,
  devops_infrastructure: LATE_ACTIVE,
  technical_debt: MATURE_ONLY,

  // Operations
  process_design: GROWS_TO_ACTIVE,
  vendor_management: ALWAYS_ACTIVE,
  logistics_fulfillment: ALWAYS_ACTIVE,
  facilities: GROWS_TO_ACTIVE,

  // Inventory (e-commerce specific)
  inventory_management: ALWAYS_ACTIVE,

  // Finance
  accounting: ALWAYS_ACTIVE,
  financial_planning: GROWS_TO_ACTIVE,
  cash_management: ALWAYS_ACTIVE,
  fundraising_ir: LATE_ACTIVE,
  tax_compliance: ALWAYS_ACTIVE,

  // People / HR
  recruiting: GROWS_TO_ACTIVE,
  onboarding: LATE_ACTIVE,
  performance_management: LATE_ACTIVE,
  compensation_benefits: LATE_ACTIVE,
  culture_engagement: LATE_ACTIVE,
  offboarding: MATURE_ONLY,

  // Customer Success
  customer_onboarding: ALWAYS_HIDDEN,
  support: ALWAYS_ACTIVE,
  retention: GROWS_TO_ACTIVE,
  expansion_upsell: LATE_ACTIVE,

  // Legal
  contracts: ALWAYS_ACTIVE,
  ip_protection: LATE_ACTIVE,
  regulatory_compliance: ALWAYS_ACTIVE,
  corporate_governance: MATURE_ONLY,

  // IT & Security
  internal_tools: GROWS_TO_ACTIVE,
  data_management: GROWS_TO_ACTIVE,
  security: ALWAYS_ACTIVE, // Payment security
  access_control: LATE_ACTIVE,
}

/**
 * Manufacturing function status matrix
 */
export const MANUFACTURING_MATRIX: Record<string, StageMatrix> = {
  // Sales
  lead_generation: ALWAYS_ACTIVE,
  pipeline_management: ALWAYS_ACTIVE,
  closing_negotiation: ALWAYS_ACTIVE,
  account_management: GROWS_TO_ACTIVE,
  sales_operations: LATE_ACTIVE,

  // Marketing
  brand_positioning: GROWS_TO_ACTIVE,
  content: LATE_ACTIVE,
  performance_paid: LATE_ACTIVE,
  pr_communications: MATURE_ONLY,
  community: ALWAYS_HIDDEN,

  // Product (R&D)
  product_strategy: ALWAYS_ACTIVE, // Product Design
  product_management: ALWAYS_ACTIVE, // R&D / Prototyping
  ux_design: ALWAYS_ACTIVE, // Product Engineering
  product_analytics: LATE_ACTIVE,

  // Engineering (hidden - use Production instead)
  architecture: ALWAYS_HIDDEN,
  development: ALWAYS_HIDDEN,
  qa_testing: ALWAYS_ACTIVE, // QA exists in manufacturing
  devops_infrastructure: ALWAYS_HIDDEN,
  technical_debt: ALWAYS_HIDDEN,

  // Production (manufacturing specific)
  production_planning: ALWAYS_ACTIVE,
  manufacturing_operations: ALWAYS_ACTIVE,
  quality_control: ALWAYS_ACTIVE,
  equipment_maintenance: GROWS_TO_ACTIVE,
  safety_environment: GROWS_TO_ACTIVE,

  // Operations
  process_design: ALWAYS_ACTIVE,
  vendor_management: ALWAYS_ACTIVE,
  logistics_fulfillment: ALWAYS_ACTIVE,
  facilities: ALWAYS_ACTIVE,

  // Finance
  accounting: ALWAYS_ACTIVE,
  financial_planning: GROWS_TO_ACTIVE,
  cash_management: ALWAYS_ACTIVE,
  fundraising_ir: LATE_ACTIVE,
  tax_compliance: ALWAYS_ACTIVE,

  // People / HR
  recruiting: ALWAYS_ACTIVE,
  onboarding: GROWS_TO_ACTIVE,
  performance_management: GROWS_TO_ACTIVE,
  compensation_benefits: GROWS_TO_ACTIVE,
  culture_engagement: LATE_ACTIVE,
  offboarding: LATE_ACTIVE,

  // Customer Success
  customer_onboarding: GROWS_TO_ACTIVE,
  support: ALWAYS_ACTIVE,
  retention: GROWS_TO_ACTIVE,
  expansion_upsell: LATE_ACTIVE,

  // Legal
  contracts: ALWAYS_ACTIVE,
  ip_protection: ALWAYS_ACTIVE, // Patents
  regulatory_compliance: ALWAYS_ACTIVE,
  corporate_governance: MATURE_ONLY,

  // IT & Security
  internal_tools: GROWS_TO_ACTIVE,
  data_management: LATE_ACTIVE,
  security: GROWS_TO_ACTIVE,
  access_control: LATE_ACTIVE,
}

/**
 * NGO function status matrix
 */
export const NGO_MATRIX: Record<string, StageMatrix> = {
  // Sales (minimal for NGO)
  lead_generation: ALWAYS_HIDDEN,
  pipeline_management: ALWAYS_HIDDEN,
  closing_negotiation: ALWAYS_HIDDEN,
  account_management: ALWAYS_HIDDEN,
  sales_operations: ALWAYS_HIDDEN,

  // Fundraising (NGO specific - replaces Sales)
  donor_acquisition: ALWAYS_ACTIVE,
  donor_relations: ALWAYS_ACTIVE,
  grant_writing: ALWAYS_ACTIVE,
  corporate_partnerships: LATE_ACTIVE,
  events_campaigns: GROWS_TO_ACTIVE,

  // Commercial Activities (NGO specific)
  product_sales: LATE_ACTIVE,
  service_sales: LATE_ACTIVE,
  pricing_strategy: LATE_ACTIVE,
  ecommerce_operations: MATURE_ONLY,

  // Marketing
  brand_positioning: GROWS_TO_ACTIVE,
  content: ALWAYS_ACTIVE, // Storytelling
  performance_paid: LATE_ACTIVE,
  pr_communications: GROWS_TO_ACTIVE,
  community: GROWS_TO_ACTIVE, // Advocacy

  // Programs (NGO specific)
  program_design: ALWAYS_ACTIVE,
  program_delivery: ALWAYS_ACTIVE,
  impact_measurement: GROWS_TO_ACTIVE,
  beneficiary_relations: ALWAYS_ACTIVE,

  // Product (hidden for NGO)
  product_strategy: ALWAYS_HIDDEN,
  product_management: ALWAYS_HIDDEN,
  ux_design: ALWAYS_HIDDEN,
  product_analytics: ALWAYS_HIDDEN,

  // Engineering (hidden for NGO)
  architecture: ALWAYS_HIDDEN,
  development: ALWAYS_HIDDEN,
  qa_testing: ALWAYS_HIDDEN,
  devops_infrastructure: ALWAYS_HIDDEN,
  technical_debt: ALWAYS_HIDDEN,

  // Operations
  process_design: GROWS_TO_ACTIVE,
  vendor_management: LATE_ACTIVE,
  logistics_fulfillment: LATE_ACTIVE,
  facilities: LATE_ACTIVE,

  // Finance
  accounting: ALWAYS_ACTIVE,
  financial_planning: GROWS_TO_ACTIVE,
  cash_management: ALWAYS_ACTIVE,
  fundraising_ir: ALWAYS_HIDDEN, // Uses Fundraising category
  tax_compliance: ALWAYS_ACTIVE,

  // People / HR
  recruiting: GROWS_TO_ACTIVE,
  onboarding: LATE_ACTIVE,
  performance_management: LATE_ACTIVE,
  compensation_benefits: LATE_ACTIVE,
  culture_engagement: ALWAYS_ACTIVE,
  offboarding: MATURE_ONLY,

  // Volunteer Management (NGO addition to HR)
  volunteer_management: ALWAYS_ACTIVE,

  // Stakeholder Relations (NGO specific)
  board_relations: ALWAYS_ACTIVE,
  government_relations: LATE_ACTIVE,
  partner_ngos: GROWS_TO_ACTIVE,
  media_relations: LATE_ACTIVE,

  // Customer Success (hidden for NGO - use Programs)
  customer_onboarding: ALWAYS_HIDDEN,
  support: ALWAYS_HIDDEN,
  retention: ALWAYS_HIDDEN,
  expansion_upsell: ALWAYS_HIDDEN,

  // Legal
  contracts: ALWAYS_ACTIVE,
  ip_protection: MATURE_ONLY,
  regulatory_compliance: ALWAYS_ACTIVE,
  corporate_governance: ALWAYS_ACTIVE,

  // IT & Security
  internal_tools: GROWS_TO_ACTIVE,
  data_management: LATE_ACTIVE,
  security: LATE_ACTIVE,
  access_control: MATURE_ONLY,
}

/**
 * Media function status matrix
 */
export const MEDIA_MATRIX: Record<string, StageMatrix> = {
  // Sales (adapted for media)
  lead_generation: GROWS_TO_ACTIVE, // Ad Sales
  pipeline_management: GROWS_TO_ACTIVE, // Sponsorship Sales
  closing_negotiation: LATE_ACTIVE, // Licensing / Syndication
  account_management: GROWS_TO_ACTIVE, // Subscription Sales
  sales_operations: LATE_ACTIVE, // Merchandise

  // Marketing
  brand_positioning: ALWAYS_ACTIVE,
  content: ALWAYS_ACTIVE, // Content Marketing
  performance_paid: GROWS_TO_ACTIVE,
  pr_communications: GROWS_TO_ACTIVE,
  community: ALWAYS_ACTIVE, // Audience Dev

  // Content (Media specific)
  content_strategy: ALWAYS_ACTIVE,
  content_production: ALWAYS_ACTIVE,
  editorial_curation: ALWAYS_ACTIVE,
  talent_management: GROWS_TO_ACTIVE,
  content_analytics: GROWS_TO_ACTIVE,

  // Product (hidden for media - use Content)
  product_strategy: ALWAYS_HIDDEN,
  product_management: ALWAYS_HIDDEN,
  ux_design: ALWAYS_HIDDEN,
  product_analytics: ALWAYS_HIDDEN,

  // Engineering
  architecture: GROWS_TO_ACTIVE,
  development: GROWS_TO_ACTIVE,
  qa_testing: LATE_ACTIVE,
  devops_infrastructure: LATE_ACTIVE,
  technical_debt: MATURE_ONLY,

  // Operations
  process_design: GROWS_TO_ACTIVE,
  vendor_management: GROWS_TO_ACTIVE,
  logistics_fulfillment: ALWAYS_HIDDEN,
  facilities: LATE_ACTIVE, // Studio

  // Finance
  accounting: ALWAYS_ACTIVE,
  financial_planning: GROWS_TO_ACTIVE,
  cash_management: ALWAYS_ACTIVE,
  fundraising_ir: LATE_ACTIVE,
  tax_compliance: GROWS_TO_ACTIVE,

  // People / HR
  recruiting: GROWS_TO_ACTIVE,
  onboarding: LATE_ACTIVE,
  performance_management: LATE_ACTIVE,
  compensation_benefits: LATE_ACTIVE,
  culture_engagement: GROWS_TO_ACTIVE,
  offboarding: MATURE_ONLY,

  // Freelancer Management (Media addition to HR)
  freelancer_management: ALWAYS_ACTIVE,

  // Audience Relations (Media specific - replaces Customer Success)
  community_management: ALWAYS_ACTIVE,
  audience_support: GROWS_TO_ACTIVE,
  audience_retention: GROWS_TO_ACTIVE,
  feedback_research: LATE_ACTIVE,

  // Customer Success (hidden for media - use Audience Relations)
  customer_onboarding: ALWAYS_HIDDEN,
  support: ALWAYS_HIDDEN,
  retention: ALWAYS_HIDDEN,
  expansion_upsell: ALWAYS_HIDDEN,

  // Legal
  contracts: ALWAYS_ACTIVE,
  ip_protection: ALWAYS_ACTIVE, // Copyright
  regulatory_compliance: GROWS_TO_ACTIVE,
  corporate_governance: MATURE_ONLY,

  // IT & Security
  internal_tools: GROWS_TO_ACTIVE,
  data_management: GROWS_TO_ACTIVE,
  security: LATE_ACTIVE,
  access_control: LATE_ACTIVE,
}

// =============================================================================
// MATRIX LOOKUP
// =============================================================================

/**
 * Get the status matrix for an organization type
 */
export const getMatrixForOrgType = (orgType: OrganizationType): Record<string, StageMatrix> => {
  switch (orgType) {
    case 'tech_product':
      return TECH_PRODUCT_MATRIX
    case 'services':
      return SERVICES_MATRIX
    case 'ecommerce':
      return ECOMMERCE_MATRIX
    case 'manufacturing':
      return MANUFACTURING_MATRIX
    case 'ngo':
      return NGO_MATRIX
    case 'media':
      return MEDIA_MATRIX
    default:
      return TECH_PRODUCT_MATRIX
  }
}

/**
 * Get function status for a specific org type, function, and stage
 */
export const getFunctionStatus = (
  orgType: OrganizationType,
  functionId: string,
  stage: LifecycleStage
): FunctionStatus => {
  const matrix = getMatrixForOrgType(orgType)
  const functionMatrix = matrix[functionId]

  if (!functionMatrix) {
    return 'dimmed' // Unknown functions default to dimmed
  }

  return functionMatrix[stage]
}

/**
 * Get all categories applicable to an organization type
 */
export const getCategoriesForOrgType = (orgType: OrganizationType): FunctionCategoryDefinition[] => {
  const baseCategories = [...FUNCTION_CATEGORIES]
  const orgSpecific = ORG_SPECIFIC_CATEGORIES[orgType] || []

  // Filter out categories that are completely hidden for this org type
  const matrix = getMatrixForOrgType(orgType)

  const filteredBase = baseCategories.filter(category => {
    // Check if at least one function in this category is not hidden
    return category.functions.some(func => {
      const funcMatrix = matrix[func.id]
      if (!funcMatrix) return true // Unknown = show it
      return Object.values(funcMatrix).some(status => status !== 'hidden')
    })
  })

  return [...filteredBase, ...orgSpecific]
}

/**
 * Get functions for a category that are visible for an org type
 */
export const getVisibleFunctionsForCategory = (
  orgType: OrganizationType,
  categoryId: string,
  stage: LifecycleStage
): Array<{ id: string; name: string; status: FunctionStatus }> => {
  const allCategories = getCategoriesForOrgType(orgType)
  const category = allCategories.find(c => c.id === categoryId)

  if (!category) return []

  return category.functions
    .map(func => ({
      id: func.id,
      name: func.name,
      status: getFunctionStatus(orgType, func.id, stage),
    }))
    .filter(func => func.status !== 'hidden')
}

// =============================================================================
// BUSINESS MODEL OPTIONS BY ORG TYPE
// =============================================================================

export const BUSINESS_MODELS: Record<OrganizationType, Array<{ value: string; label: string }>> = {
  tech_product: [
    { value: 'subscription_saas', label: 'Subscription (SaaS)' },
    { value: 'transactional', label: 'Transactional (per use)' },
    { value: 'freemium', label: 'Freemium' },
    { value: 'marketplace_platform', label: 'Marketplace / Platform' },
    { value: 'licensing', label: 'Licensing' },
    { value: 'hardware_software', label: 'Hardware + Software' },
  ],
  services: [
    { value: 'hourly_time_materials', label: 'Hourly / Time & Materials' },
    { value: 'fixed_price', label: 'Fixed price projects' },
    { value: 'retainer', label: 'Retainer' },
    { value: 'performance_based', label: 'Performance-based' },
    { value: 'productized_service', label: 'Productized service' },
  ],
  ecommerce: [
    { value: 'direct_sales', label: 'Direct sales (own inventory)' },
    { value: 'dropshipping', label: 'Dropshipping' },
    { value: 'marketplace', label: 'Marketplace' },
    { value: 'subscription_box', label: 'Subscription box' },
    { value: 'wholesale_retail', label: 'Wholesale + Retail' },
  ],
  manufacturing: [
    { value: 'b2b_oem', label: 'B2B (OEM / components)' },
    { value: 'b2c', label: 'B2C (finished goods)' },
    { value: 'contract_manufacturing', label: 'Contract manufacturing' },
    { value: 'white_label', label: 'White label' },
    { value: 'direct_distribution', label: 'Direct + Distribution' },
  ],
  ngo: [
    { value: 'grant_funded', label: 'Grant-funded' },
    { value: 'donation_based', label: 'Donation-based' },
    { value: 'membership', label: 'Membership' },
    { value: 'earned_revenue', label: 'Earned revenue hybrid' },
    { value: 'government_contracts', label: 'Government contracts' },
  ],
  media: [
    { value: 'advertising', label: 'Advertising' },
    { value: 'subscription', label: 'Subscription' },
    { value: 'sponsored_content', label: 'Sponsored content' },
    { value: 'events', label: 'Events' },
    { value: 'licensing_syndication', label: 'Licensing / Syndication' },
    { value: 'hybrid', label: 'Hybrid' },
  ],
}

/**
 * Get business model options for an organization type
 */
export const getBusinessModelsForOrgType = (orgType: OrganizationType) => {
  return BUSINESS_MODELS[orgType] || []
}

// =============================================================================
// ORG TYPE DISPLAY NAMES
// =============================================================================

export const ORG_TYPE_LABELS: Record<OrganizationType, string> = {
  tech_product: 'Tech Product',
  services: 'Services',
  ecommerce: 'E-commerce / Retail',
  manufacturing: 'Manufacturing',
  ngo: 'NGO / Non-profit',
  media: 'Media / Content',
}

export const ORG_TYPE_DESCRIPTIONS: Record<OrganizationType, string> = {
  tech_product: 'SaaS, apps, platforms, digital products',
  services: 'Agencies, consulting, outsourcing, professional services',
  ecommerce: 'Online stores, D2C brands, marketplaces',
  manufacturing: 'Physical goods production, hardware',
  ngo: 'Foundations, social enterprises, charitable organizations',
  media: 'Publishers, studios, creators, content platforms',
}

// =============================================================================
// LIFECYCLE STAGE LABELS
// =============================================================================

export const LIFECYCLE_STAGE_LABELS: Record<LifecycleStage, string> = {
  formation: 'Formation',
  establishment: 'Establishment',
  growth: 'Growth',
  maturity: 'Maturity',
}

export const LIFECYCLE_STAGE_DESCRIPTIONS: Record<LifecycleStage, string> = {
  formation: 'Registered, operations started, <10 people',
  establishment: 'Stable operations, growing team, 10-30 people',
  growth: 'Scaling, formalizing processes, 30-100 people',
  maturity: 'Established structure, 100+ people',
}
