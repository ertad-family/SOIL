-- Seed script: Populate org_functions tables
-- Run with: psql postgresql://postgres:PASSWORD@db.PROJECT_ID.supabase.co:5432/postgres -f supabase/seeds/seed_org_functions.sql

-- =============================================================================
-- CLEAR EXISTING DATA
-- =============================================================================

TRUNCATE org_functions CASCADE;
TRUNCATE function_categories CASCADE;

-- =============================================================================
-- COMMON CATEGORIES (org_type = NULL)
-- =============================================================================

INSERT INTO function_categories (category_id, category_name, org_type, display_order) VALUES
  ('sales', 'Sales', NULL, 1),
  ('marketing', 'Marketing', NULL, 2),
  ('product', 'Product', NULL, 3),
  ('engineering', 'Engineering', NULL, 4),
  ('operations', 'Operations', NULL, 5),
  ('finance', 'Finance', NULL, 6),
  ('people_hr', 'People / HR', NULL, 7),
  ('customer_success', 'Customer Success', NULL, 8),
  ('legal', 'Legal', NULL, 9),
  ('it_security', 'IT & Security', NULL, 10);

-- =============================================================================
-- ORG-SPECIFIC CATEGORIES
-- =============================================================================

-- E-commerce
INSERT INTO function_categories (category_id, category_name, org_type, display_order) VALUES
  ('inventory', 'Inventory', 'ecommerce', 11);

-- Manufacturing
INSERT INTO function_categories (category_id, category_name, org_type, display_order) VALUES
  ('production', 'Production', 'manufacturing', 11);

-- NGO
INSERT INTO function_categories (category_id, category_name, org_type, display_order) VALUES
  ('fundraising', 'Fundraising', 'ngo', 11),
  ('programs', 'Programs', 'ngo', 12),
  ('commercial_activities', 'Commercial Activities', 'ngo', 13),
  ('stakeholder_relations', 'Stakeholder Relations', 'ngo', 14);

-- Media
INSERT INTO function_categories (category_id, category_name, org_type, display_order) VALUES
  ('content', 'Content', 'media', 11),
  ('audience_relations', 'Audience Relations', 'media', 12);

-- =============================================================================
-- FUNCTIONS - SALES
-- =============================================================================

INSERT INTO org_functions (function_id, function_name, description, category_id, display_order, status_matrix) VALUES
  ('lead_generation', 'Lead Generation',
   'Finding and attracting potential customers through outbound efforts (cold calls, emails, ads) or inbound methods (content, SEO, referrals). Includes qualifying leads and building initial interest.',
   'sales', 1, '{
     "tech_product": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "services": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "media": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('pipeline_management', 'Pipeline Management',
   'Tracking deals from first contact to close. Includes managing CRM, forecasting revenue, prioritizing opportunities, and ensuring deals don''t fall through the cracks.',
   'sales', 2, '{
     "tech_product": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "services": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "manufacturing": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "media": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('closing_negotiation', 'Closing / Negotiation',
   'Converting qualified leads into paying customers. Includes pricing discussions, contract negotiations, handling objections, and getting final signatures.',
   'sales', 3, '{
     "tech_product": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "services": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "media": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('account_management', 'Account Management',
   'Maintaining relationships with existing customers to ensure satisfaction and identify growth opportunities. Includes regular check-ins, renewals, and being the customer''s advocate internally.',
   'sales', 4, '{
     "tech_product": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "services": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "manufacturing": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "media": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('sales_operations', 'Sales Operations',
   'Supporting the sales team with tools, processes, data, and reporting. Includes territory planning, compensation design, sales enablement, and performance analytics.',
   'sales', 5, '{
     "tech_product": {"formation": "dimmed", "establishment": "dimmed", "growth": "dimmed", "maturity": "active"},
     "services": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "media": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"}
   }'::jsonb);

-- =============================================================================
-- FUNCTIONS - MARKETING
-- =============================================================================

INSERT INTO org_functions (function_id, function_name, description, category_id, display_order, status_matrix) VALUES
  ('brand_positioning', 'Brand & Positioning',
   'Defining how the company is perceived in the market. Includes brand identity, messaging, competitive positioning, and ensuring consistency across all touchpoints.',
   'marketing', 1, '{
     "tech_product": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "services": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "media": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('content', 'Content',
   'Creating valuable content to attract and educate potential customers. Includes blog posts, videos, podcasts, case studies, whitepapers, and social media content.',
   'marketing', 2, '{
     "tech_product": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "services": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "media": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('performance_paid', 'Performance / Paid',
   'Running paid advertising campaigns to drive traffic and conversions. Includes Google Ads, social media ads, display advertising, and measuring ROI on ad spend.',
   'marketing', 3, '{
     "tech_product": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "services": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "media": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('pr_communications', 'PR & Communications',
   'Managing the company''s public image and media relationships. Includes press releases, media outreach, crisis communications, and thought leadership positioning.',
   'marketing', 4, '{
     "tech_product": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "services": {"formation": "dimmed", "establishment": "dimmed", "growth": "dimmed", "maturity": "active"},
     "ecommerce": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "dimmed", "establishment": "dimmed", "growth": "dimmed", "maturity": "active"},
     "ngo": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "media": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('community', 'Community',
   'Building and nurturing a community around the product or brand. Includes user groups, forums, events, ambassador programs, and fostering customer-to-customer connections.',
   'marketing', 5, '{
     "tech_product": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "services": {"formation": "dimmed", "establishment": "dimmed", "growth": "dimmed", "maturity": "active"},
     "ecommerce": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "ngo": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "media": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb);

-- =============================================================================
-- FUNCTIONS - PRODUCT
-- =============================================================================

INSERT INTO org_functions (function_id, function_name, description, category_id, display_order, status_matrix) VALUES
  ('product_strategy', 'Product Strategy',
   'Defining the product vision, roadmap, and priorities. Includes market research, competitive analysis, deciding what to build (and what not to), and aligning product direction with business goals.',
   'product', 1, '{
     "tech_product": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "services": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "media": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"}
   }'::jsonb),

  ('product_management', 'Product Management',
   'Translating strategy into features and coordinating their delivery. Includes writing requirements, prioritizing backlogs, working with engineering, and managing releases.',
   'product', 2, '{
     "tech_product": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "services": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "media": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"}
   }'::jsonb),

  ('ux_design', 'UX / Design',
   'Creating user experiences that are intuitive and delightful. Includes user research, wireframing, prototyping, visual design, and usability testing.',
   'product', 3, '{
     "tech_product": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "services": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "ecommerce": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "media": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"}
   }'::jsonb),

  ('product_analytics', 'Product Analytics',
   'Measuring how users interact with the product. Includes tracking metrics, analyzing user behavior, running experiments, and providing data-driven insights for product decisions.',
   'product', 4, '{
     "tech_product": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "services": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "media": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"}
   }'::jsonb);

-- =============================================================================
-- FUNCTIONS - ENGINEERING
-- =============================================================================

INSERT INTO org_functions (function_id, function_name, description, category_id, display_order, status_matrix) VALUES
  ('architecture', 'Architecture',
   'Designing the technical structure of the system. Includes technology choices, system design, scalability planning, and ensuring the codebase remains maintainable as it grows.',
   'engineering', 1, '{
     "tech_product": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "services": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "ecommerce": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "ngo": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "media": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('development', 'Development',
   'Writing and maintaining the code that powers the product. Includes frontend, backend, mobile development, code reviews, and implementing new features and fixes.',
   'engineering', 2, '{
     "tech_product": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "services": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "ecommerce": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "ngo": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "media": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('qa_testing', 'QA / Testing',
   'Ensuring the product works correctly before release. Includes manual testing, automated tests, regression testing, performance testing, and maintaining quality standards.',
   'engineering', 3, '{
     "tech_product": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "services": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "ecommerce": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "media": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('devops_infrastructure', 'DevOps / Infrastructure',
   'Managing servers, deployments, and operational systems. Includes cloud infrastructure, CI/CD pipelines, monitoring, incident response, and keeping systems running smoothly.',
   'engineering', 4, '{
     "tech_product": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "services": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "ecommerce": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "ngo": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "media": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('technical_debt', 'Technical Debt Management',
   'Addressing accumulated shortcuts and outdated code. Includes refactoring, upgrading dependencies, improving code quality, and balancing new features with maintenance work.',
   'engineering', 5, '{
     "tech_product": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "services": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "ecommerce": {"formation": "dimmed", "establishment": "dimmed", "growth": "dimmed", "maturity": "active"},
     "manufacturing": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "ngo": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "media": {"formation": "dimmed", "establishment": "dimmed", "growth": "dimmed", "maturity": "active"}
   }'::jsonb);

-- =============================================================================
-- FUNCTIONS - OPERATIONS
-- =============================================================================

INSERT INTO org_functions (function_id, function_name, description, category_id, display_order, status_matrix) VALUES
  ('process_design', 'Process Design',
   'Creating and optimizing workflows across the organization. Includes documenting procedures, identifying bottlenecks, implementing improvements, and ensuring consistency.',
   'operations', 1, '{
     "tech_product": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "services": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "media": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('vendor_management', 'Vendor Management',
   'Managing relationships with external suppliers and service providers. Includes negotiating contracts, evaluating performance, managing costs, and ensuring reliable delivery.',
   'operations', 2, '{
     "tech_product": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "services": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "media": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('logistics_fulfillment', 'Logistics / Fulfillment',
   'Getting physical products to customers. Includes inventory management, warehousing, shipping, returns processing, and optimizing delivery times and costs.',
   'operations', 3, '{
     "tech_product": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "services": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "ecommerce": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "media": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"}
   }'::jsonb),

  ('facilities', 'Facilities',
   'Managing physical workspace and office operations. Includes real estate, office setup, maintenance, supplies, and creating a productive work environment.',
   'operations', 4, '{
     "tech_product": {"formation": "dimmed", "establishment": "dimmed", "growth": "dimmed", "maturity": "active"},
     "services": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "media": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"}
   }'::jsonb);

-- =============================================================================
-- FUNCTIONS - FINANCE
-- =============================================================================

INSERT INTO org_functions (function_id, function_name, description, category_id, display_order, status_matrix) VALUES
  ('accounting', 'Accounting',
   'Recording and reporting financial transactions. Includes bookkeeping, financial statements, accounts payable/receivable, and ensuring accurate financial records.',
   'finance', 1, '{
     "tech_product": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "services": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "media": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('financial_planning', 'Financial Planning',
   'Budgeting and forecasting the company''s financial future. Includes creating budgets, financial modeling, scenario planning, and tracking actual vs. planned performance.',
   'finance', 2, '{
     "tech_product": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "services": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "media": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('cash_management', 'Cash Management',
   'Managing the company''s cash flow and liquidity. Includes monitoring cash position, managing payments timing, optimizing working capital, and ensuring the company can meet obligations.',
   'finance', 3, '{
     "tech_product": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "services": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "media": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('fundraising_ir', 'Fundraising / IR',
   'Raising capital and managing investor relationships. Includes preparing pitch materials, investor meetings, due diligence, cap table management, and ongoing investor communications.',
   'finance', 4, '{
     "tech_product": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "services": {"formation": "dimmed", "establishment": "dimmed", "growth": "dimmed", "maturity": "active"},
     "ecommerce": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "media": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('tax_compliance', 'Tax & Compliance',
   'Meeting tax obligations and regulatory requirements. Includes tax planning, filing returns, managing audits, and staying compliant with financial regulations.',
   'finance', 5, '{
     "tech_product": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "services": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "media": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb);

-- =============================================================================
-- FUNCTIONS - PEOPLE / HR
-- =============================================================================

INSERT INTO org_functions (function_id, function_name, description, category_id, display_order, status_matrix) VALUES
  ('recruiting', 'Recruiting',
   'Finding and hiring the right people. Includes sourcing candidates, screening, interviewing, making offers, and building an employer brand that attracts talent.',
   'people_hr', 1, '{
     "tech_product": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "services": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "media": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('onboarding', 'Onboarding',
   'Getting new hires productive and integrated. Includes orientation, training programs, setting up tools and access, assigning buddies, and ensuring new employees feel welcomed.',
   'people_hr', 2, '{
     "tech_product": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "services": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "media": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('performance_management', 'Performance Management',
   'Evaluating and developing employee performance. Includes goal setting, reviews, feedback processes, performance improvement plans, and career development discussions.',
   'people_hr', 3, '{
     "tech_product": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "services": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "media": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('compensation_benefits', 'Compensation & Benefits',
   'Managing pay, equity, and employee benefits. Includes salary benchmarking, bonus programs, equity administration, health insurance, and other perks.',
   'people_hr', 4, '{
     "tech_product": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "services": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "media": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('culture_engagement', 'Culture & Engagement',
   'Building and maintaining company culture. Includes defining values, team events, employee surveys, addressing workplace issues, and fostering a positive work environment.',
   'people_hr', 5, '{
     "tech_product": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "services": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "media": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('offboarding', 'Offboarding',
   'Managing employee departures professionally. Includes exit interviews, knowledge transfer, revoking access, final paperwork, and maintaining positive alumni relationships.',
   'people_hr', 6, '{
     "tech_product": {"formation": "dimmed", "establishment": "dimmed", "growth": "dimmed", "maturity": "active"},
     "services": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "dimmed", "establishment": "dimmed", "growth": "dimmed", "maturity": "active"},
     "manufacturing": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "dimmed", "establishment": "dimmed", "growth": "dimmed", "maturity": "active"},
     "media": {"formation": "dimmed", "establishment": "dimmed", "growth": "dimmed", "maturity": "active"}
   }'::jsonb);

-- =============================================================================
-- FUNCTIONS - CUSTOMER SUCCESS
-- =============================================================================

INSERT INTO org_functions (function_id, function_name, description, category_id, display_order, status_matrix) VALUES
  ('customer_onboarding', 'Customer Onboarding',
   'Getting new customers set up for success. Includes implementation, training, initial configuration, and ensuring customers achieve their first wins with the product.',
   'customer_success', 1, '{
     "tech_product": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "services": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "manufacturing": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "media": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"}
   }'::jsonb),

  ('support', 'Support',
   'Helping customers resolve issues and answer questions. Includes ticket management, troubleshooting, documentation, and ensuring customer problems are solved quickly.',
   'customer_success', 2, '{
     "tech_product": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "services": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "media": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"}
   }'::jsonb),

  ('retention', 'Retention',
   'Keeping customers engaged and preventing churn. Includes monitoring health scores, proactive outreach, understanding why customers leave, and implementing retention programs.',
   'customer_success', 3, '{
     "tech_product": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "services": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "media": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"}
   }'::jsonb),

  ('expansion_upsell', 'Expansion / Upsell',
   'Growing revenue from existing customers. Includes identifying expansion opportunities, cross-selling additional products, and upgrading customers to higher-value plans.',
   'customer_success', 4, '{
     "tech_product": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "services": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"},
     "media": {"formation": "hidden", "establishment": "hidden", "growth": "hidden", "maturity": "hidden"}
   }'::jsonb);

-- =============================================================================
-- FUNCTIONS - LEGAL
-- =============================================================================

INSERT INTO org_functions (function_id, function_name, description, category_id, display_order, status_matrix) VALUES
  ('contracts', 'Contracts',
   'Creating and managing legal agreements. Includes drafting contracts, reviewing terms, negotiating with counterparties, and maintaining a contract repository.',
   'legal', 1, '{
     "tech_product": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "services": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "media": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('ip_protection', 'IP Protection',
   'Protecting the company''s intellectual property. Includes patents, trademarks, copyrights, trade secrets, and defending against IP infringement.',
   'legal', 2, '{
     "tech_product": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "services": {"formation": "dimmed", "establishment": "dimmed", "growth": "dimmed", "maturity": "active"},
     "ecommerce": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "dimmed", "establishment": "dimmed", "growth": "dimmed", "maturity": "active"},
     "media": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('regulatory_compliance', 'Regulatory Compliance',
   'Meeting industry-specific legal requirements. Includes understanding regulations (GDPR, HIPAA, SOC2, etc.), implementing compliance programs, and managing audits.',
   'legal', 3, '{
     "tech_product": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "services": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "media": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('corporate_governance', 'Corporate Governance',
   'Managing corporate legal structure and obligations. Includes board meetings, shareholder matters, corporate filings, equity administration, and governance policies.',
   'legal', 4, '{
     "tech_product": {"formation": "dimmed", "establishment": "dimmed", "growth": "dimmed", "maturity": "active"},
     "services": {"formation": "dimmed", "establishment": "dimmed", "growth": "dimmed", "maturity": "active"},
     "ecommerce": {"formation": "dimmed", "establishment": "dimmed", "growth": "dimmed", "maturity": "active"},
     "manufacturing": {"formation": "dimmed", "establishment": "dimmed", "growth": "dimmed", "maturity": "active"},
     "ngo": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "media": {"formation": "dimmed", "establishment": "dimmed", "growth": "dimmed", "maturity": "active"}
   }'::jsonb);

-- =============================================================================
-- FUNCTIONS - IT & SECURITY
-- =============================================================================

INSERT INTO org_functions (function_id, function_name, description, category_id, display_order, status_matrix) VALUES
  ('internal_tools', 'Internal Tools',
   'Managing software and systems for employees. Includes selecting and administering tools (email, collaboration, productivity), integrations, and internal IT support.',
   'it_security', 1, '{
     "tech_product": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "services": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "media": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('data_management', 'Data Management',
   'Organizing and governing company data. Includes data architecture, backups, data quality, analytics infrastructure, and ensuring data is accessible and reliable.',
   'it_security', 2, '{
     "tech_product": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "services": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "media": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('security', 'Security',
   'Protecting company assets from threats. Includes security policies, vulnerability management, incident response, security training, and protecting customer data.',
   'it_security', 3, '{
     "tech_product": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "services": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "ecommerce": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "media": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('access_control', 'Access Control',
   'Managing who can access what systems and data. Includes identity management, permissions, SSO, audit logging, and ensuring the right people have the right access.',
   'it_security', 4, '{
     "tech_product": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "services": {"formation": "dimmed", "establishment": "dimmed", "growth": "dimmed", "maturity": "active"},
     "ecommerce": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "manufacturing": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"},
     "ngo": {"formation": "dimmed", "establishment": "dimmed", "growth": "dimmed", "maturity": "active"},
     "media": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"}
   }'::jsonb);

-- =============================================================================
-- ORG-SPECIFIC FUNCTIONS - ECOMMERCE: INVENTORY
-- =============================================================================

INSERT INTO org_functions (function_id, function_name, description, category_id, display_order, status_matrix) VALUES
  ('inventory_management', 'Inventory Management',
   'Tracking and managing stock levels across locations. Includes forecasting demand, reordering, managing SKUs, handling stockouts, and optimizing inventory costs.',
   'inventory', 1, '{
     "ecommerce": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb);

-- =============================================================================
-- ORG-SPECIFIC FUNCTIONS - MANUFACTURING: PRODUCTION
-- =============================================================================

INSERT INTO org_functions (function_id, function_name, description, category_id, display_order, status_matrix) VALUES
  ('production_planning', 'Production Planning',
   'Scheduling and coordinating manufacturing activities. Includes capacity planning, production scheduling, material requirements planning, and balancing demand with resources.',
   'production', 1, '{
     "manufacturing": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('manufacturing_operations', 'Manufacturing Operations',
   'Running the day-to-day production processes. Includes managing production lines, coordinating workers, hitting output targets, and troubleshooting production issues.',
   'production', 2, '{
     "manufacturing": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('quality_control', 'Quality Control',
   'Ensuring products meet quality standards. Includes inspection processes, testing protocols, defect tracking, continuous improvement, and managing quality certifications.',
   'production', 3, '{
     "manufacturing": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('equipment_maintenance', 'Equipment Maintenance',
   'Keeping production equipment running reliably. Includes preventive maintenance schedules, repairs, spare parts management, and minimizing downtime.',
   'production', 4, '{
     "manufacturing": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('safety_environment', 'Safety & Environment',
   'Managing workplace safety and environmental compliance. Includes safety training, incident prevention, environmental regulations, waste management, and sustainability initiatives.',
   'production', 5, '{
     "manufacturing": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb);

-- =============================================================================
-- ORG-SPECIFIC FUNCTIONS - NGO: FUNDRAISING
-- =============================================================================

INSERT INTO org_functions (function_id, function_name, description, category_id, display_order, status_matrix) VALUES
  ('donor_acquisition', 'Donor Acquisition',
   'Finding and converting new donors. Includes prospecting, outreach campaigns, donor qualification, first-gift strategies, and building a donor pipeline.',
   'fundraising', 1, '{
     "ngo": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('donor_relations', 'Donor Relations',
   'Maintaining and deepening relationships with existing donors. Includes stewardship, regular communications, recognition programs, and upgrading donor giving levels.',
   'fundraising', 2, '{
     "ngo": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('grant_writing', 'Grant Writing',
   'Securing foundation and government grants. Includes prospect research, proposal writing, budget preparation, reporting requirements, and grant compliance.',
   'fundraising', 3, '{
     "ngo": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('corporate_partnerships', 'Corporate Partnerships',
   'Building relationships with businesses for funding and support. Includes sponsorships, cause marketing, employee giving programs, and in-kind donations.',
   'fundraising', 4, '{
     "ngo": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('events_campaigns', 'Events / Campaigns',
   'Running fundraising events and campaigns. Includes galas, peer-to-peer campaigns, giving days, crowdfunding, and special appeals.',
   'fundraising', 5, '{
     "ngo": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb);

-- =============================================================================
-- ORG-SPECIFIC FUNCTIONS - NGO: PROGRAMS
-- =============================================================================

INSERT INTO org_functions (function_id, function_name, description, category_id, display_order, status_matrix) VALUES
  ('program_design', 'Program Design',
   'Designing programs that achieve the mission. Includes needs assessment, theory of change, program logic models, and aligning activities with intended outcomes.',
   'programs', 1, '{
     "ngo": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('program_delivery', 'Program Delivery',
   'Executing programs and serving beneficiaries. Includes service delivery, participant management, quality assurance, and adapting programs based on feedback.',
   'programs', 2, '{
     "ngo": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('impact_measurement', 'Impact Measurement',
   'Measuring and demonstrating program effectiveness. Includes defining metrics, data collection, evaluation studies, and communicating impact to stakeholders.',
   'programs', 3, '{
     "ngo": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('beneficiary_relations', 'Beneficiary Relations',
   'Managing relationships with people the organization serves. Includes intake processes, case management, feedback mechanisms, and ensuring dignity in service delivery.',
   'programs', 4, '{
     "ngo": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb);

-- =============================================================================
-- ORG-SPECIFIC FUNCTIONS - NGO: COMMERCIAL ACTIVITIES
-- =============================================================================

INSERT INTO org_functions (function_id, function_name, description, category_id, display_order, status_matrix) VALUES
  ('product_sales', 'Product Sales (merch, goods)',
   'Selling products to generate earned revenue. Includes merchandise, mission-related goods, retail operations, and balancing revenue with mission alignment.',
   'commercial_activities', 1, '{
     "ngo": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('service_sales', 'Service Sales',
   'Providing fee-based services. Includes consulting, training, technical assistance, and other services that generate revenue while advancing the mission.',
   'commercial_activities', 2, '{
     "ngo": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('pricing_strategy', 'Pricing Strategy',
   'Setting prices for products and services. Includes cost analysis, sliding scale considerations, balancing access with sustainability, and competitive positioning.',
   'commercial_activities', 3, '{
     "ngo": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('ecommerce_operations', 'E-commerce Operations',
   'Running online sales operations. Includes website management, order fulfillment, customer service for purchases, and integrating with mission activities.',
   'commercial_activities', 4, '{
     "ngo": {"formation": "dimmed", "establishment": "dimmed", "growth": "dimmed", "maturity": "active"}
   }'::jsonb);

-- =============================================================================
-- ORG-SPECIFIC FUNCTIONS - NGO: STAKEHOLDER RELATIONS
-- =============================================================================

INSERT INTO org_functions (function_id, function_name, description, category_id, display_order, status_matrix) VALUES
  ('board_relations', 'Board Relations',
   'Managing the relationship with the board of directors. Includes board recruitment, meeting preparation, committee support, and leveraging board expertise and networks.',
   'stakeholder_relations', 1, '{
     "ngo": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('government_relations', 'Government Relations',
   'Engaging with government at all levels. Includes policy advocacy, regulatory compliance, government contracts, and participating in public processes.',
   'stakeholder_relations', 2, '{
     "ngo": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('partner_ngos', 'Partner NGOs',
   'Collaborating with other nonprofits. Includes coalitions, joint programs, referral networks, and coordinating services to avoid duplication and maximize impact.',
   'stakeholder_relations', 3, '{
     "ngo": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('media_relations', 'Media Relations',
   'Managing relationships with journalists and media outlets. Includes press releases, story pitching, interview preparation, and building the organization''s public profile.',
   'stakeholder_relations', 4, '{
     "ngo": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"}
   }'::jsonb);

-- =============================================================================
-- ORG-SPECIFIC FUNCTIONS - MEDIA: CONTENT
-- =============================================================================

INSERT INTO org_functions (function_id, function_name, description, category_id, display_order, status_matrix) VALUES
  ('content_strategy', 'Content Strategy',
   'Defining what content to create and why. Includes content planning, editorial calendars, audience segmentation, and aligning content with business goals.',
   'content', 1, '{
     "media": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('content_production', 'Content Production',
   'Creating the actual content. Includes writing, filming, editing, graphic design, and managing the production workflow from concept to publish.',
   'content', 2, '{
     "media": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('editorial_curation', 'Editorial / Curation',
   'Selecting and organizing content for audiences. Includes editorial judgment, content sequencing, quality standards, and maintaining editorial voice and integrity.',
   'content', 3, '{
     "media": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('talent_management', 'Talent Management',
   'Managing relationships with creators and on-screen talent. Includes contracts, scheduling, development, and ensuring talent aligns with brand values.',
   'content', 4, '{
     "media": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('content_analytics', 'Content Analytics',
   'Measuring content performance and audience behavior. Includes view metrics, engagement analysis, A/B testing, and using data to inform content decisions.',
   'content', 5, '{
     "media": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb);

-- =============================================================================
-- ORG-SPECIFIC FUNCTIONS - MEDIA: AUDIENCE RELATIONS
-- =============================================================================

INSERT INTO org_functions (function_id, function_name, description, category_id, display_order, status_matrix) VALUES
  ('community_management', 'Community Management',
   'Building and moderating audience communities. Includes managing comments, forums, social groups, and fostering positive engagement between community members.',
   'audience_relations', 1, '{
     "media": {"formation": "active", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('audience_support', 'Support',
   'Helping audiences with access and technical issues. Includes subscription support, platform troubleshooting, and resolving audience complaints.',
   'audience_relations', 2, '{
     "media": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('audience_retention', 'Retention / Engagement',
   'Keeping audiences coming back. Includes engagement strategies, loyalty programs, re-engagement campaigns, and reducing subscriber churn.',
   'audience_relations', 3, '{
     "media": {"formation": "dimmed", "establishment": "active", "growth": "active", "maturity": "active"}
   }'::jsonb),

  ('feedback_research', 'Feedback / Research',
   'Understanding audience needs and preferences. Includes surveys, focus groups, social listening, and incorporating audience insights into content strategy.',
   'audience_relations', 4, '{
     "media": {"formation": "dimmed", "establishment": "dimmed", "growth": "active", "maturity": "active"}
   }'::jsonb);

-- =============================================================================
-- VERIFY DATA
-- =============================================================================

SELECT 'Categories:' as info, COUNT(*) as count FROM function_categories
UNION ALL
SELECT 'Functions:', COUNT(*) FROM org_functions;
