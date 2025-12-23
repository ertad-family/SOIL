-- Migration: Create org_functions tables
-- Description: Store function catalog data for interview wizard
-- Two tables: function_categories and org_functions

-- =============================================================================
-- FUNCTION CATEGORIES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS function_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id TEXT NOT NULL UNIQUE,           -- e.g., "sales", "marketing"
  category_name TEXT NOT NULL,                -- e.g., "Sales", "Marketing"
  -- NULL = common to all org types, otherwise specific org type
  org_type TEXT,                              -- e.g., "ngo", "media", "ecommerce", "manufacturing"
  display_order INT NOT NULL DEFAULT 0,       -- for consistent ordering
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for filtering by org type
CREATE INDEX idx_function_categories_org_type ON function_categories(org_type);

-- =============================================================================
-- ORG FUNCTIONS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS org_functions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  function_id TEXT NOT NULL UNIQUE,           -- e.g., "lead_generation"
  function_name TEXT NOT NULL,                -- e.g., "Lead Generation"
  description TEXT,                           -- detailed description
  category_id TEXT NOT NULL REFERENCES function_categories(category_id) ON DELETE CASCADE,
  display_order INT NOT NULL DEFAULT 0,       -- for consistent ordering within category
  -- Status matrix: { "tech_product": {"formation": "active", ...}, ... }
  -- Each org type has 4 lifecycle stages: formation, establishment, growth, maturity
  -- Status values: "active", "dimmed", "hidden"
  status_matrix JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for filtering by category
CREATE INDEX idx_org_functions_category ON org_functions(category_id);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS
ALTER TABLE function_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_functions ENABLE ROW LEVEL SECURITY;

-- Public read access (this is reference data)
CREATE POLICY "Function categories are publicly readable"
  ON function_categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Org functions are publicly readable"
  ON org_functions FOR SELECT
  TO public
  USING (true);

-- Only service role can modify (via migrations/admin)
CREATE POLICY "Only service role can insert function_categories"
  ON function_categories FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Only service role can update function_categories"
  ON function_categories FOR UPDATE
  TO service_role
  USING (true);

CREATE POLICY "Only service role can delete function_categories"
  ON function_categories FOR DELETE
  TO service_role
  USING (true);

CREATE POLICY "Only service role can insert org_functions"
  ON org_functions FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Only service role can update org_functions"
  ON org_functions FOR UPDATE
  TO service_role
  USING (true);

CREATE POLICY "Only service role can delete org_functions"
  ON org_functions FOR DELETE
  TO service_role
  USING (true);

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE function_categories IS 'Catalog of organizational function categories';
COMMENT ON COLUMN function_categories.category_id IS 'Unique identifier for the category (e.g., sales, marketing)';
COMMENT ON COLUMN function_categories.org_type IS 'NULL for common categories, org type for specific ones';

COMMENT ON TABLE org_functions IS 'Catalog of organizational functions with status matrix per org type';
COMMENT ON COLUMN org_functions.function_id IS 'Unique identifier for the function (e.g., lead_generation)';
COMMENT ON COLUMN org_functions.status_matrix IS 'JSONB with status per org_type and lifecycle_stage';
