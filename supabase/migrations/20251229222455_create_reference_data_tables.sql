-- Migration: Create reference data tables for organization types, lifecycle stages, and business models
-- Description: Migrate hardcoded constants from function-matrix.ts to database
-- Related Issue: #34

-- =============================================================================
-- ORGANIZATION TYPES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS organization_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type_key TEXT NOT NULL UNIQUE,              -- e.g., "tech_product", "services"
  label TEXT NOT NULL,                        -- Full label: "Tech Product"
  label_short TEXT NOT NULL,                  -- Short label for badges: "Tech Product"
  description TEXT,                           -- "SaaS, apps, platforms, digital products"
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,    -- For soft-deprecation
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_organization_types_order ON organization_types(display_order);
CREATE INDEX idx_organization_types_active ON organization_types(is_active) WHERE is_active = true;

-- =============================================================================
-- LIFECYCLE STAGES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS lifecycle_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_key TEXT NOT NULL UNIQUE,             -- e.g., "formation", "establishment"
  label TEXT NOT NULL,                        -- "Formation"
  description TEXT,                           -- "<10 people, operations started"
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lifecycle_stages_order ON lifecycle_stages(display_order);
CREATE INDEX idx_lifecycle_stages_active ON lifecycle_stages(is_active) WHERE is_active = true;

-- =============================================================================
-- BUSINESS MODELS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS business_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_key TEXT NOT NULL,                    -- e.g., "subscription_saas"
  org_type_key TEXT NOT NULL REFERENCES organization_types(type_key) ON DELETE CASCADE,
  label TEXT NOT NULL,                        -- "Subscription (SaaS)"
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(model_key, org_type_key)             -- Same model key can exist for different org types
);

CREATE INDEX idx_business_models_org_type ON business_models(org_type_key);
CREATE INDEX idx_business_models_order ON business_models(org_type_key, display_order);
CREATE INDEX idx_business_models_active ON business_models(is_active) WHERE is_active = true;

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE organization_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifecycle_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_models ENABLE ROW LEVEL SECURITY;

-- Public read access (reference data)
CREATE POLICY "Organization types are publicly readable"
  ON organization_types FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Lifecycle stages are publicly readable"
  ON lifecycle_stages FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Business models are publicly readable"
  ON business_models FOR SELECT
  TO public
  USING (true);

-- Only service role can insert
CREATE POLICY "Only service role can insert organization_types"
  ON organization_types FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Only service role can insert lifecycle_stages"
  ON lifecycle_stages FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Only service role can insert business_models"
  ON business_models FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Only service role can update
CREATE POLICY "Only service role can update organization_types"
  ON organization_types FOR UPDATE
  TO service_role
  USING (true);

CREATE POLICY "Only service role can update lifecycle_stages"
  ON lifecycle_stages FOR UPDATE
  TO service_role
  USING (true);

CREATE POLICY "Only service role can update business_models"
  ON business_models FOR UPDATE
  TO service_role
  USING (true);

-- Only service role can delete
CREATE POLICY "Only service role can delete organization_types"
  ON organization_types FOR DELETE
  TO service_role
  USING (true);

CREATE POLICY "Only service role can delete lifecycle_stages"
  ON lifecycle_stages FOR DELETE
  TO service_role
  USING (true);

CREATE POLICY "Only service role can delete business_models"
  ON business_models FOR DELETE
  TO service_role
  USING (true);

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE organization_types IS 'Reference table for organization type options (tech_product, services, etc.)';
COMMENT ON COLUMN organization_types.type_key IS 'Unique identifier matching TypeScript OrganizationType union';
COMMENT ON COLUMN organization_types.label IS 'Full display label (e.g., "E-commerce / Retail")';
COMMENT ON COLUMN organization_types.label_short IS 'Short label for badges and compact UI (e.g., "E-commerce")';
COMMENT ON COLUMN organization_types.is_active IS 'Soft-delete flag for deprecating types without breaking existing data';

COMMENT ON TABLE lifecycle_stages IS 'Reference table for organization lifecycle stages';
COMMENT ON COLUMN lifecycle_stages.stage_key IS 'Unique identifier matching TypeScript LifecycleStage union';

COMMENT ON TABLE business_models IS 'Reference table for business models, organized by organization type';
COMMENT ON COLUMN business_models.model_key IS 'Unique identifier for the business model within its org type';
COMMENT ON COLUMN business_models.org_type_key IS 'Foreign key to organization_types.type_key';
