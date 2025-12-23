/**
 * Functional Mapping Category Questions
 *
 * These questions are shown in Step 2 of the simplified Functional Mapping chapter.
 * Only categories with at least one selected function will show questions.
 */

export interface CategoryQuestion {
  id: "organization" | "satisfaction" | "health";
  label: string;
  placeholder: string;
}

export interface CategoryQuestionConfig {
  categoryId: string;
  categoryName: string;
  /** Header text shown above questions - includes context about selected functions */
  headerTemplate: string;
  questions: CategoryQuestion[];
}

/**
 * Template for generating header text for each category.
 * {categoryName} and {selectedFunctions} are replaced at runtime.
 */
export const CATEGORY_HEADER_TEMPLATE = `We want to understand how these functions worked in your organization - who owned them, how satisfied you were, and what challenges you faced. The more detail you provide, the more valuable your story becomes.`;

/**
 * Questions asked for each category (same structure for all categories)
 */
export const CATEGORY_QUESTIONS: CategoryQuestion[] = [
  {
    id: "organization",
    label: "How were these functions organized?",
    placeholder:
      "Who owned these functions - dedicated people, shared responsibility, or founder-handled? Were they in-house, outsourced, or hybrid? How formal were the processes?",
  },
  {
    id: "satisfaction",
    label: "How satisfied were you with how this area worked?",
    placeholder:
      "What worked well? What were the main pain points or frustrations? Were there any moments when this area really shone or really struggled?",
  },
  {
    id: "health",
    label: "Were there any health issues in this area?",
    placeholder:
      "Think about: turnover (people leaving), understaffing, budget pressure, quality issues, leadership gaps, conflicts with other teams. What challenges did you face?",
  },
];

/**
 * Category-specific context to add to headers.
 * Provides hints about what aspects to consider for each category.
 */
export const CATEGORY_CONTEXT: Record<string, string> = {
  sales:
    "Sales is often where founder involvement is highest in early stages. Think about how deals were closed and who managed customer relationships.",
  marketing:
    "Marketing efforts vary widely - from grassroots community building to paid campaigns. Consider both what you tried and what actually worked.",
  product:
    "Product decisions shape the entire organization. Think about who made decisions about what to build and how priorities were set.",
  engineering:
    "Technical execution is critical for product companies. Consider code quality, technical leadership, and how technical decisions were made.",
  operations:
    "Operations keep the business running day-to-day. Think about processes, vendors, and how work actually got done.",
  finance:
    "Finance is often neglected until it's critical. Consider how financial decisions were made and who tracked the numbers.",
  people_hr:
    "People functions scale with the team. Think about how hiring happened, how people were managed, and what the culture was like.",
  customer_success:
    "Customer relationships drive retention and growth. Consider how customers were supported and kept happy.",
  legal:
    "Legal needs grow with complexity and risk. Think about contracts, compliance, and protecting the business.",
  it_security:
    "IT and security needs grow with scale. Consider internal tools, data protection, and who managed systems access.",
  // Org-specific categories
  inventory:
    "Inventory management is crucial for e-commerce. Think about stock levels, forecasting, and fulfillment challenges.",
  production:
    "Production is the heart of manufacturing. Consider how production was planned, quality controlled, and equipment maintained.",
  fundraising:
    "Fundraising sustains nonprofit operations. Think about donor relationships, grant writing, and revenue diversification.",
  programs:
    "Programs are how nonprofits deliver on their mission. Consider program design, delivery, and measuring impact.",
  commercial_activities:
    "Earned revenue can strengthen sustainability. Think about how commercial activities balanced with mission.",
  stakeholder_relations:
    "Stakeholders shape nonprofit direction. Consider board relations, government engagement, and partnerships.",
  content:
    "Content is the core product for media organizations. Think about content creation, editorial decisions, and quality.",
  audience_relations:
    "Audience relationships drive media success. Consider community management, engagement, and understanding audience needs.",
};

/**
 * Get the header text for a category with selected functions.
 */
export function getCategoryHeader(categoryName: string, selectedFunctionNames: string[]): string {
  const functionsList =
    selectedFunctionNames.length > 0 ? selectedFunctionNames.join(", ") : "selected functions";

  return `You selected: ${functionsList}\n\n${CATEGORY_HEADER_TEMPLATE}`;
}

/**
 * Get category-specific context hint, if available.
 */
export function getCategoryContext(categoryId: string): string | undefined {
  return CATEGORY_CONTEXT[categoryId];
}
