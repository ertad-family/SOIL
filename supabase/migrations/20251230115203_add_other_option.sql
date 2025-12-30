-- Migration: Add "Other" option for Organization Type and Business Model
-- Issue: #32
-- Description: Allow users to specify custom organization type and business model

-- ============================================================================
-- Step 1: Update organizations table - add custom fields
-- ============================================================================

-- Add columns for custom "Other" values
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS organization_type_other TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS business_model_other TEXT;

-- ============================================================================
-- Step 2: Update organization_type CHECK constraint to include "other"
-- ============================================================================

-- Drop existing constraint
ALTER TABLE organizations DROP CONSTRAINT IF EXISTS organizations_organization_type_check;

-- Add updated constraint with "other" option
ALTER TABLE organizations
ADD CONSTRAINT organizations_organization_type_check
CHECK (organization_type IS NULL OR organization_type IN (
  'tech_product', 'services', 'ecommerce', 'manufacturing', 'ngo', 'media', 'other'
));

-- ============================================================================
-- Step 3: Add "other" to organization_types reference table
-- ============================================================================

INSERT INTO organization_types (type_key, label, label_short, description, display_order, is_active)
VALUES ('other', 'Other', 'Other', 'Organization type not listed above', 99, true)
ON CONFLICT (type_key) DO NOTHING;

-- ============================================================================
-- Step 4: Add "other" business model for each org type
-- ============================================================================

INSERT INTO business_models (model_key, org_type_key, label, display_order, is_active)
VALUES
  ('other', 'tech_product', 'Other', 99, true),
  ('other', 'services', 'Other', 99, true),
  ('other', 'ecommerce', 'Other', 99, true),
  ('other', 'manufacturing', 'Other', 99, true),
  ('other', 'ngo', 'Other', 99, true),
  ('other', 'media', 'Other', 99, true),
  ('other', 'other', 'Other', 99, true)
ON CONFLICT (model_key, org_type_key) DO NOTHING;
