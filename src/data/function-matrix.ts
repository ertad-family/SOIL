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
} from "@/types/interview";

// =============================================================================
// MASTER FUNCTION CATALOG
// =============================================================================

/**
 * Master list of all function categories and their sub-functions.
 * This is the canonical list - org types can override names or hide functions.
 */
export const FUNCTION_CATEGORIES: FunctionCategoryDefinition[] = [
  {
    id: "sales",
    name: "Sales",
    functions: [
      {
        id: "lead_generation",
        name: "Lead Generation",
        description:
          "Finding and attracting potential customers through outbound efforts (cold calls, emails, ads) or inbound methods (content, SEO, referrals). Includes qualifying leads and building initial interest.",
      },
      {
        id: "pipeline_management",
        name: "Pipeline Management",
        description:
          "Tracking deals from first contact to close. Includes managing CRM, forecasting revenue, prioritizing opportunities, and ensuring deals don't fall through the cracks.",
      },
      {
        id: "closing_negotiation",
        name: "Closing / Negotiation",
        description:
          "Converting qualified leads into paying customers. Includes pricing discussions, contract negotiations, handling objections, and getting final signatures.",
      },
      {
        id: "account_management",
        name: "Account Management",
        description:
          "Maintaining relationships with existing customers to ensure satisfaction and identify growth opportunities. Includes regular check-ins, renewals, and being the customer's advocate internally.",
      },
      {
        id: "sales_operations",
        name: "Sales Operations",
        description:
          "Supporting the sales team with tools, processes, data, and reporting. Includes territory planning, compensation design, sales enablement, and performance analytics.",
      },
    ],
  },
  {
    id: "marketing",
    name: "Marketing",
    functions: [
      {
        id: "brand_positioning",
        name: "Brand & Positioning",
        description:
          "Defining how the company is perceived in the market. Includes brand identity, messaging, competitive positioning, and ensuring consistency across all touchpoints.",
      },
      {
        id: "content",
        name: "Content",
        description:
          "Creating valuable content to attract and educate potential customers. Includes blog posts, videos, podcasts, case studies, whitepapers, and social media content.",
      },
      {
        id: "performance_paid",
        name: "Performance / Paid",
        description:
          "Running paid advertising campaigns to drive traffic and conversions. Includes Google Ads, social media ads, display advertising, and measuring ROI on ad spend.",
      },
      {
        id: "pr_communications",
        name: "PR & Communications",
        description:
          "Managing the company's public image and media relationships. Includes press releases, media outreach, crisis communications, and thought leadership positioning.",
      },
      {
        id: "community",
        name: "Community",
        description:
          "Building and nurturing a community around the product or brand. Includes user groups, forums, events, ambassador programs, and fostering customer-to-customer connections.",
      },
    ],
  },
  {
    id: "product",
    name: "Product",
    functions: [
      {
        id: "product_strategy",
        name: "Product Strategy",
        description:
          "Defining the product vision, roadmap, and priorities. Includes market research, competitive analysis, deciding what to build (and what not to), and aligning product direction with business goals.",
      },
      {
        id: "product_management",
        name: "Product Management",
        description:
          "Translating strategy into features and coordinating their delivery. Includes writing requirements, prioritizing backlogs, working with engineering, and managing releases.",
      },
      {
        id: "ux_design",
        name: "UX / Design",
        description:
          "Creating user experiences that are intuitive and delightful. Includes user research, wireframing, prototyping, visual design, and usability testing.",
      },
      {
        id: "product_analytics",
        name: "Product Analytics",
        description:
          "Measuring how users interact with the product. Includes tracking metrics, analyzing user behavior, running experiments, and providing data-driven insights for product decisions.",
      },
    ],
  },
  {
    id: "engineering",
    name: "Engineering",
    functions: [
      {
        id: "architecture",
        name: "Architecture",
        description:
          "Designing the technical structure of the system. Includes technology choices, system design, scalability planning, and ensuring the codebase remains maintainable as it grows.",
      },
      {
        id: "development",
        name: "Development",
        description:
          "Writing and maintaining the code that powers the product. Includes frontend, backend, mobile development, code reviews, and implementing new features and fixes.",
      },
      {
        id: "qa_testing",
        name: "QA / Testing",
        description:
          "Ensuring the product works correctly before release. Includes manual testing, automated tests, regression testing, performance testing, and maintaining quality standards.",
      },
      {
        id: "devops_infrastructure",
        name: "DevOps / Infrastructure",
        description:
          "Managing servers, deployments, and operational systems. Includes cloud infrastructure, CI/CD pipelines, monitoring, incident response, and keeping systems running smoothly.",
      },
      {
        id: "technical_debt",
        name: "Technical Debt Management",
        description:
          "Addressing accumulated shortcuts and outdated code. Includes refactoring, upgrading dependencies, improving code quality, and balancing new features with maintenance work.",
      },
    ],
  },
  {
    id: "operations",
    name: "Operations",
    functions: [
      {
        id: "process_design",
        name: "Process Design",
        description:
          "Creating and optimizing workflows across the organization. Includes documenting procedures, identifying bottlenecks, implementing improvements, and ensuring consistency.",
      },
      {
        id: "vendor_management",
        name: "Vendor Management",
        description:
          "Managing relationships with external suppliers and service providers. Includes negotiating contracts, evaluating performance, managing costs, and ensuring reliable delivery.",
      },
      {
        id: "logistics_fulfillment",
        name: "Logistics / Fulfillment",
        description:
          "Getting physical products to customers. Includes inventory management, warehousing, shipping, returns processing, and optimizing delivery times and costs.",
      },
      {
        id: "facilities",
        name: "Facilities",
        description:
          "Managing physical workspace and office operations. Includes real estate, office setup, maintenance, supplies, and creating a productive work environment.",
      },
    ],
  },
  {
    id: "finance",
    name: "Finance",
    functions: [
      {
        id: "accounting",
        name: "Accounting",
        description:
          "Recording and reporting financial transactions. Includes bookkeeping, financial statements, accounts payable/receivable, and ensuring accurate financial records.",
      },
      {
        id: "financial_planning",
        name: "Financial Planning",
        description:
          "Budgeting and forecasting the company's financial future. Includes creating budgets, financial modeling, scenario planning, and tracking actual vs. planned performance.",
      },
      {
        id: "cash_management",
        name: "Cash Management",
        description:
          "Managing the company's cash flow and liquidity. Includes monitoring cash position, managing payments timing, optimizing working capital, and ensuring the company can meet obligations.",
      },
      {
        id: "fundraising_ir",
        name: "Fundraising / IR",
        description:
          "Raising capital and managing investor relationships. Includes preparing pitch materials, investor meetings, due diligence, cap table management, and ongoing investor communications.",
      },
      {
        id: "tax_compliance",
        name: "Tax & Compliance",
        description:
          "Meeting tax obligations and regulatory requirements. Includes tax planning, filing returns, managing audits, and staying compliant with financial regulations.",
      },
    ],
  },
  {
    id: "people_hr",
    name: "People / HR",
    functions: [
      {
        id: "recruiting",
        name: "Recruiting",
        description:
          "Finding and hiring the right people. Includes sourcing candidates, screening, interviewing, making offers, and building an employer brand that attracts talent.",
      },
      {
        id: "onboarding",
        name: "Onboarding",
        description:
          "Getting new hires productive and integrated. Includes orientation, training programs, setting up tools and access, assigning buddies, and ensuring new employees feel welcomed.",
      },
      {
        id: "performance_management",
        name: "Performance Management",
        description:
          "Evaluating and developing employee performance. Includes goal setting, reviews, feedback processes, performance improvement plans, and career development discussions.",
      },
      {
        id: "compensation_benefits",
        name: "Compensation & Benefits",
        description:
          "Managing pay, equity, and employee benefits. Includes salary benchmarking, bonus programs, equity administration, health insurance, and other perks.",
      },
      {
        id: "culture_engagement",
        name: "Culture & Engagement",
        description:
          "Building and maintaining company culture. Includes defining values, team events, employee surveys, addressing workplace issues, and fostering a positive work environment.",
      },
      {
        id: "offboarding",
        name: "Offboarding",
        description:
          "Managing employee departures professionally. Includes exit interviews, knowledge transfer, revoking access, final paperwork, and maintaining positive alumni relationships.",
      },
    ],
  },
  {
    id: "customer_success",
    name: "Customer Success",
    functions: [
      {
        id: "customer_onboarding",
        name: "Customer Onboarding",
        description:
          "Getting new customers set up for success. Includes implementation, training, initial configuration, and ensuring customers achieve their first wins with the product.",
      },
      {
        id: "support",
        name: "Support",
        description:
          "Helping customers resolve issues and answer questions. Includes ticket management, troubleshooting, documentation, and ensuring customer problems are solved quickly.",
      },
      {
        id: "retention",
        name: "Retention",
        description:
          "Keeping customers engaged and preventing churn. Includes monitoring health scores, proactive outreach, understanding why customers leave, and implementing retention programs.",
      },
      {
        id: "expansion_upsell",
        name: "Expansion / Upsell",
        description:
          "Growing revenue from existing customers. Includes identifying expansion opportunities, cross-selling additional products, and upgrading customers to higher-value plans.",
      },
    ],
  },
  {
    id: "legal",
    name: "Legal",
    functions: [
      {
        id: "contracts",
        name: "Contracts",
        description:
          "Creating and managing legal agreements. Includes drafting contracts, reviewing terms, negotiating with counterparties, and maintaining a contract repository.",
      },
      {
        id: "ip_protection",
        name: "IP Protection",
        description:
          "Protecting the company's intellectual property. Includes patents, trademarks, copyrights, trade secrets, and defending against IP infringement.",
      },
      {
        id: "regulatory_compliance",
        name: "Regulatory Compliance",
        description:
          "Meeting industry-specific legal requirements. Includes understanding regulations (GDPR, HIPAA, SOC2, etc.), implementing compliance programs, and managing audits.",
      },
      {
        id: "corporate_governance",
        name: "Corporate Governance",
        description:
          "Managing corporate legal structure and obligations. Includes board meetings, shareholder matters, corporate filings, equity administration, and governance policies.",
      },
    ],
  },
  {
    id: "it_security",
    name: "IT & Security",
    functions: [
      {
        id: "internal_tools",
        name: "Internal Tools",
        description:
          "Managing software and systems for employees. Includes selecting and administering tools (email, collaboration, productivity), integrations, and internal IT support.",
      },
      {
        id: "data_management",
        name: "Data Management",
        description:
          "Organizing and governing company data. Includes data architecture, backups, data quality, analytics infrastructure, and ensuring data is accessible and reliable.",
      },
      {
        id: "security",
        name: "Security",
        description:
          "Protecting company assets from threats. Includes security policies, vulnerability management, incident response, security training, and protecting customer data.",
      },
      {
        id: "access_control",
        name: "Access Control",
        description:
          "Managing who can access what systems and data. Includes identity management, permissions, SSO, audit logging, and ensuring the right people have the right access.",
      },
    ],
  },
];

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
      id: "inventory",
      name: "Inventory",
      functions: [
        {
          id: "inventory_management",
          name: "Inventory Management",
          description:
            "Tracking and managing stock levels across locations. Includes forecasting demand, reordering, managing SKUs, handling stockouts, and optimizing inventory costs.",
        },
      ],
    },
  ],
  manufacturing: [
    {
      id: "production",
      name: "Production",
      functions: [
        {
          id: "production_planning",
          name: "Production Planning",
          description:
            "Scheduling and coordinating manufacturing activities. Includes capacity planning, production scheduling, material requirements planning, and balancing demand with resources.",
        },
        {
          id: "manufacturing_operations",
          name: "Manufacturing Operations",
          description:
            "Running the day-to-day production processes. Includes managing production lines, coordinating workers, hitting output targets, and troubleshooting production issues.",
        },
        {
          id: "quality_control",
          name: "Quality Control",
          description:
            "Ensuring products meet quality standards. Includes inspection processes, testing protocols, defect tracking, continuous improvement, and managing quality certifications.",
        },
        {
          id: "equipment_maintenance",
          name: "Equipment Maintenance",
          description:
            "Keeping production equipment running reliably. Includes preventive maintenance schedules, repairs, spare parts management, and minimizing downtime.",
        },
        {
          id: "safety_environment",
          name: "Safety & Environment",
          description:
            "Managing workplace safety and environmental compliance. Includes safety training, incident prevention, environmental regulations, waste management, and sustainability initiatives.",
        },
      ],
    },
  ],
  ngo: [
    {
      id: "fundraising",
      name: "Fundraising",
      functions: [
        {
          id: "donor_acquisition",
          name: "Donor Acquisition",
          description:
            "Finding and converting new donors. Includes prospecting, outreach campaigns, donor qualification, first-gift strategies, and building a donor pipeline.",
        },
        {
          id: "donor_relations",
          name: "Donor Relations",
          description:
            "Maintaining and deepening relationships with existing donors. Includes stewardship, regular communications, recognition programs, and upgrading donor giving levels.",
        },
        {
          id: "grant_writing",
          name: "Grant Writing",
          description:
            "Securing foundation and government grants. Includes prospect research, proposal writing, budget preparation, reporting requirements, and grant compliance.",
        },
        {
          id: "corporate_partnerships",
          name: "Corporate Partnerships",
          description:
            "Building relationships with businesses for funding and support. Includes sponsorships, cause marketing, employee giving programs, and in-kind donations.",
        },
        {
          id: "events_campaigns",
          name: "Events / Campaigns",
          description:
            "Running fundraising events and campaigns. Includes galas, peer-to-peer campaigns, giving days, crowdfunding, and special appeals.",
        },
      ],
    },
    {
      id: "programs",
      name: "Programs",
      functions: [
        {
          id: "program_design",
          name: "Program Design",
          description:
            "Designing programs that achieve the mission. Includes needs assessment, theory of change, program logic models, and aligning activities with intended outcomes.",
        },
        {
          id: "program_delivery",
          name: "Program Delivery",
          description:
            "Executing programs and serving beneficiaries. Includes service delivery, participant management, quality assurance, and adapting programs based on feedback.",
        },
        {
          id: "impact_measurement",
          name: "Impact Measurement",
          description:
            "Measuring and demonstrating program effectiveness. Includes defining metrics, data collection, evaluation studies, and communicating impact to stakeholders.",
        },
        {
          id: "beneficiary_relations",
          name: "Beneficiary Relations",
          description:
            "Managing relationships with people the organization serves. Includes intake processes, case management, feedback mechanisms, and ensuring dignity in service delivery.",
        },
      ],
    },
    {
      id: "commercial_activities",
      name: "Commercial Activities",
      functions: [
        {
          id: "product_sales",
          name: "Product Sales (merch, goods)",
          description:
            "Selling products to generate earned revenue. Includes merchandise, mission-related goods, retail operations, and balancing revenue with mission alignment.",
        },
        {
          id: "service_sales",
          name: "Service Sales",
          description:
            "Providing fee-based services. Includes consulting, training, technical assistance, and other services that generate revenue while advancing the mission.",
        },
        {
          id: "pricing_strategy",
          name: "Pricing Strategy",
          description:
            "Setting prices for products and services. Includes cost analysis, sliding scale considerations, balancing access with sustainability, and competitive positioning.",
        },
        {
          id: "ecommerce_operations",
          name: "E-commerce Operations",
          description:
            "Running online sales operations. Includes website management, order fulfillment, customer service for purchases, and integrating with mission activities.",
        },
      ],
    },
    {
      id: "stakeholder_relations",
      name: "Stakeholder Relations",
      functions: [
        {
          id: "board_relations",
          name: "Board Relations",
          description:
            "Managing the relationship with the board of directors. Includes board recruitment, meeting preparation, committee support, and leveraging board expertise and networks.",
        },
        {
          id: "government_relations",
          name: "Government Relations",
          description:
            "Engaging with government at all levels. Includes policy advocacy, regulatory compliance, government contracts, and participating in public processes.",
        },
        {
          id: "partner_ngos",
          name: "Partner NGOs",
          description:
            "Collaborating with other nonprofits. Includes coalitions, joint programs, referral networks, and coordinating services to avoid duplication and maximize impact.",
        },
        {
          id: "media_relations",
          name: "Media Relations",
          description:
            "Managing relationships with journalists and media outlets. Includes press releases, story pitching, interview preparation, and building the organization's public profile.",
        },
      ],
    },
  ],
  media: [
    {
      id: "content",
      name: "Content",
      functions: [
        {
          id: "content_strategy",
          name: "Content Strategy",
          description:
            "Defining what content to create and why. Includes content planning, editorial calendars, audience segmentation, and aligning content with business goals.",
        },
        {
          id: "content_production",
          name: "Content Production",
          description:
            "Creating the actual content. Includes writing, filming, editing, graphic design, and managing the production workflow from concept to publish.",
        },
        {
          id: "editorial_curation",
          name: "Editorial / Curation",
          description:
            "Selecting and organizing content for audiences. Includes editorial judgment, content sequencing, quality standards, and maintaining editorial voice and integrity.",
        },
        {
          id: "talent_management",
          name: "Talent Management",
          description:
            "Managing relationships with creators and on-screen talent. Includes contracts, scheduling, development, and ensuring talent aligns with brand values.",
        },
        {
          id: "content_analytics",
          name: "Content Analytics",
          description:
            "Measuring content performance and audience behavior. Includes view metrics, engagement analysis, A/B testing, and using data to inform content decisions.",
        },
      ],
    },
    {
      id: "audience_relations",
      name: "Audience Relations",
      functions: [
        {
          id: "community_management",
          name: "Community Management",
          description:
            "Building and moderating audience communities. Includes managing comments, forums, social groups, and fostering positive engagement between community members.",
        },
        {
          id: "audience_support",
          name: "Support",
          description:
            "Helping audiences with access and technical issues. Includes subscription support, platform troubleshooting, and resolving audience complaints.",
        },
        {
          id: "audience_retention",
          name: "Retention / Engagement",
          description:
            "Keeping audiences coming back. Includes engagement strategies, loyalty programs, re-engagement campaigns, and reducing subscriber churn.",
        },
        {
          id: "feedback_research",
          name: "Feedback / Research",
          description:
            "Understanding audience needs and preferences. Includes surveys, focus groups, social listening, and incorporating audience insights into content strategy.",
        },
      ],
    },
  ],
};

// =============================================================================
// STATUS MATRICES BY ORG TYPE
// =============================================================================

type StageMatrix = Record<LifecycleStage, FunctionStatus>;

/**
 * Helper to create a stage matrix with common patterns
 */
const s = (
  f: FunctionStatus,
  e: FunctionStatus,
  g: FunctionStatus,
  m: FunctionStatus
): StageMatrix => ({
  formation: f,
  establishment: e,
  growth: g,
  maturity: m,
});

// Shortcuts for common patterns
const ALWAYS_ACTIVE = s("active", "active", "active", "active");
const GROWS_TO_ACTIVE = s("dimmed", "active", "active", "active");
const LATE_ACTIVE = s("dimmed", "dimmed", "active", "active");
const MATURE_ONLY = s("dimmed", "dimmed", "dimmed", "active");
const ALWAYS_DIMMED = s("dimmed", "dimmed", "dimmed", "dimmed");
const ALWAYS_HIDDEN = s("hidden", "hidden", "hidden", "hidden");

/**
 * Tech Product function status matrix
 */
export const TECH_PRODUCT_MATRIX: Record<string, StageMatrix> = {
  // Sales
  lead_generation: ALWAYS_ACTIVE,
  pipeline_management: s("dimmed", "active", "active", "active"),
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
};

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
};

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
};

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
};

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
};

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
};

// =============================================================================
// MATRIX LOOKUP
// =============================================================================

/**
 * Get the status matrix for an organization type
 */
export const getMatrixForOrgType = (orgType: OrganizationType): Record<string, StageMatrix> => {
  switch (orgType) {
    case "tech_product":
      return TECH_PRODUCT_MATRIX;
    case "services":
      return SERVICES_MATRIX;
    case "ecommerce":
      return ECOMMERCE_MATRIX;
    case "manufacturing":
      return MANUFACTURING_MATRIX;
    case "ngo":
      return NGO_MATRIX;
    case "media":
      return MEDIA_MATRIX;
    default:
      return TECH_PRODUCT_MATRIX;
  }
};

/**
 * Get function status for a specific org type, function, and stage
 */
export const getFunctionStatus = (
  orgType: OrganizationType,
  functionId: string,
  stage: LifecycleStage
): FunctionStatus => {
  const matrix = getMatrixForOrgType(orgType);
  const functionMatrix = matrix[functionId];

  if (!functionMatrix) {
    return "dimmed"; // Unknown functions default to dimmed
  }

  return functionMatrix[stage];
};

/**
 * Get all categories applicable to an organization type
 */
export const getCategoriesForOrgType = (
  orgType: OrganizationType
): FunctionCategoryDefinition[] => {
  const baseCategories = [...FUNCTION_CATEGORIES];
  const orgSpecific = ORG_SPECIFIC_CATEGORIES[orgType] || [];

  // Filter out categories that are completely hidden for this org type
  const matrix = getMatrixForOrgType(orgType);

  const filteredBase = baseCategories.filter((category) => {
    // Check if at least one function in this category is not hidden
    return category.functions.some((func) => {
      const funcMatrix = matrix[func.id];
      if (!funcMatrix) return true; // Unknown = show it
      return Object.values(funcMatrix).some((status) => status !== "hidden");
    });
  });

  return [...filteredBase, ...orgSpecific];
};

/**
 * Get functions for a category that are visible for an org type
 */
export const getVisibleFunctionsForCategory = (
  orgType: OrganizationType,
  categoryId: string,
  stage: LifecycleStage
): Array<{ id: string; name: string; description?: string; status: FunctionStatus }> => {
  const allCategories = getCategoriesForOrgType(orgType);
  const category = allCategories.find((c) => c.id === categoryId);

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

// =============================================================================
// BUSINESS MODEL OPTIONS BY ORG TYPE
// =============================================================================

export const BUSINESS_MODELS: Record<OrganizationType, Array<{ value: string; label: string }>> = {
  tech_product: [
    { value: "subscription_saas", label: "Subscription (SaaS)" },
    { value: "transactional", label: "Transactional (per use)" },
    { value: "freemium", label: "Freemium" },
    { value: "marketplace_platform", label: "Marketplace / Platform" },
    { value: "licensing", label: "Licensing" },
    { value: "hardware_software", label: "Hardware + Software" },
  ],
  services: [
    { value: "hourly_time_materials", label: "Hourly / Time & Materials" },
    { value: "fixed_price", label: "Fixed price projects" },
    { value: "retainer", label: "Retainer" },
    { value: "performance_based", label: "Performance-based" },
    { value: "productized_service", label: "Productized service" },
  ],
  ecommerce: [
    { value: "direct_sales", label: "Direct sales (own inventory)" },
    { value: "dropshipping", label: "Dropshipping" },
    { value: "marketplace", label: "Marketplace" },
    { value: "subscription_box", label: "Subscription box" },
    { value: "wholesale_retail", label: "Wholesale + Retail" },
  ],
  manufacturing: [
    { value: "b2b_oem", label: "B2B (OEM / components)" },
    { value: "b2c", label: "B2C (finished goods)" },
    { value: "contract_manufacturing", label: "Contract manufacturing" },
    { value: "white_label", label: "White label" },
    { value: "direct_distribution", label: "Direct + Distribution" },
  ],
  ngo: [
    { value: "grant_funded", label: "Grant-funded" },
    { value: "donation_based", label: "Donation-based" },
    { value: "membership", label: "Membership" },
    { value: "earned_revenue", label: "Earned revenue hybrid" },
    { value: "government_contracts", label: "Government contracts" },
  ],
  media: [
    { value: "advertising", label: "Advertising" },
    { value: "subscription", label: "Subscription" },
    { value: "sponsored_content", label: "Sponsored content" },
    { value: "events", label: "Events" },
    { value: "licensing_syndication", label: "Licensing / Syndication" },
    { value: "hybrid", label: "Hybrid" },
  ],
};

/**
 * Get business model options for an organization type
 */
export const getBusinessModelsForOrgType = (orgType: OrganizationType) => {
  return BUSINESS_MODELS[orgType] || [];
};

// =============================================================================
// ORG TYPE DISPLAY NAMES
// =============================================================================

export const ORG_TYPE_LABELS: Record<OrganizationType, string> = {
  tech_product: "Tech Product",
  services: "Services",
  ecommerce: "E-commerce / Retail",
  manufacturing: "Manufacturing",
  ngo: "NGO / Non-profit",
  media: "Media / Content",
};

export const ORG_TYPE_DESCRIPTIONS: Record<OrganizationType, string> = {
  tech_product: "SaaS, apps, platforms, digital products",
  services: "Agencies, consulting, outsourcing, professional services",
  ecommerce: "Online stores, D2C brands, marketplaces",
  manufacturing: "Physical goods production, hardware",
  ngo: "Foundations, social enterprises, charitable organizations",
  media: "Publishers, studios, creators, content platforms",
};

// =============================================================================
// LIFECYCLE STAGE LABELS
// =============================================================================

export const LIFECYCLE_STAGE_LABELS: Record<LifecycleStage, string> = {
  formation: "Formation",
  establishment: "Establishment",
  growth: "Growth",
  maturity: "Maturity",
};

export const LIFECYCLE_STAGE_DESCRIPTIONS: Record<LifecycleStage, string> = {
  formation: "Registered, operations started, <10 people",
  establishment: "Stable operations, growing team, 10-30 people",
  growth: "Scaling, formalizing processes, 30-100 people",
  maturity: "Established structure, 100+ people",
};
