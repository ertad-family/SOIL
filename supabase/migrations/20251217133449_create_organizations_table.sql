-- Migration: Create organizations table and refactor stories
-- Description: Separates organization facts from founder perspectives (stories)
--
-- Architecture:
--   organizations (1) ---> (N) stories ---> (1) memorials
--   - organizations: factual data about the org (name, dates, type, etc.)
--   - stories: founder perspectives (functional mapping, financial picture, etc.)
--   - memorials: cenotaphs linked to organizations (not stories)

-- =============================================================================
-- ORGANIZATIONS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS organizations (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- URL-friendly identifier
  slug TEXT UNIQUE NOT NULL,

  -- Basic facts about the organization
  name TEXT NOT NULL,
  organization_type TEXT CHECK (organization_type IN (
    'tech_product', 'services', 'ecommerce', 'manufacturing', 'ngo', 'media'
  )),
  business_model TEXT,
  industry TEXT,
  description TEXT,

  -- Location
  location_country TEXT,
  location_city TEXT,

  -- Timeline
  founded_date TEXT,  -- YYYY or YYYY-MM format
  closed_date TEXT,   -- YYYY or YYYY-MM format
  stage_at_closure TEXT CHECK (stage_at_closure IN (
    'formation', 'establishment', 'growth', 'maturity'
  )),
  peak_team_size INTEGER,

  -- Verification status
  verification_status TEXT NOT NULL DEFAULT 'unverified'
    CHECK (verification_status IN ('unverified', 'pending', 'verified')),
  verification_count INTEGER NOT NULL DEFAULT 0,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,

  -- Creator tracking
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- UPDATE STORIES TABLE
-- =============================================================================

-- Add organization_id foreign key to stories
ALTER TABLE stories
ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

-- Add founder role and public naming (moved from basic_info JSONB)
ALTER TABLE stories
ADD COLUMN founder_role TEXT CHECK (founder_role IN (
  'founder', 'cofounder', 'ceo_non_founder', 'other'
));

ALTER TABLE stories
ADD COLUMN public_naming TEXT CHECK (public_naming IN (
  'yes', 'no', 'decide_later'
));

ALTER TABLE stories
ADD COLUMN contact_email TEXT;

-- =============================================================================
-- UPDATE MEMORIALS TABLE
-- =============================================================================

-- Add organization_id to memorials (replacing story_id as primary link)
ALTER TABLE memorials
ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

-- Add unique constraint - one memorial per organization
-- We'll add this after data migration to avoid conflicts
-- ALTER TABLE memorials ADD CONSTRAINT memorials_organization_id_unique UNIQUE (organization_id);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Organizations indexes
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_created_by ON organizations(created_by);
CREATE INDEX idx_organizations_verification_status ON organizations(verification_status);
CREATE INDEX idx_organizations_is_public ON organizations(is_public) WHERE is_public = TRUE;
CREATE INDEX idx_organizations_type ON organizations(organization_type);

-- Stories indexes
CREATE INDEX idx_stories_organization_id ON stories(organization_id);

-- Memorials indexes
CREATE INDEX idx_memorials_organization_id ON memorials(organization_id);

-- =============================================================================
-- ROW LEVEL SECURITY FOR ORGANIZATIONS
-- =============================================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Anyone can view public organizations
CREATE POLICY "Anyone can view public organizations"
  ON organizations
  FOR SELECT
  USING (is_public = TRUE);

-- Users can view organizations they created
CREATE POLICY "Users can view own organizations"
  ON organizations
  FOR SELECT
  USING (auth.uid() = created_by);

-- Users can view organizations they have stories for
CREATE POLICY "Users can view organizations they have stories for"
  ON organizations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.organization_id = organizations.id
      AND stories.user_id = auth.uid()
    )
  );

-- Users can insert organizations
CREATE POLICY "Users can insert organizations"
  ON organizations
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Users can update organizations they created (if not verified yet)
CREATE POLICY "Users can update own unverified organizations"
  ON organizations
  FOR UPDATE
  USING (auth.uid() = created_by AND verification_status = 'unverified')
  WITH CHECK (auth.uid() = created_by);

-- Users can delete organizations they created (if no other stories exist)
CREATE POLICY "Users can delete own organizations without other stories"
  ON organizations
  FOR DELETE
  USING (
    auth.uid() = created_by
    AND NOT EXISTS (
      SELECT 1 FROM stories
      WHERE stories.organization_id = organizations.id
      AND stories.user_id != auth.uid()
    )
  );

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Auto-update updated_at timestamp for organizations
CREATE OR REPLACE FUNCTION update_organizations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER organizations_updated_at_trigger
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_organizations_updated_at();

-- Auto-generate slug from organization name
CREATE OR REPLACE FUNCTION generate_organization_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  new_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Generate base slug from name
  base_slug := LOWER(REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := TRIM(BOTH '-' FROM base_slug);

  -- If slug is empty, use 'org'
  IF base_slug = '' THEN
    base_slug := 'org';
  END IF;

  -- Check for uniqueness and add counter if needed
  new_slug := base_slug;
  WHILE EXISTS (SELECT 1 FROM organizations WHERE slug = new_slug AND id != NEW.id) LOOP
    counter := counter + 1;
    new_slug := base_slug || '-' || counter;
  END LOOP;

  NEW.slug := new_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER organizations_generate_slug_trigger
  BEFORE INSERT ON organizations
  FOR EACH ROW
  WHEN (NEW.slug IS NULL OR NEW.slug = '')
  EXECUTE FUNCTION generate_organization_slug();

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE organizations IS 'Factual information about organizations (not perspectives)';
COMMENT ON COLUMN organizations.slug IS 'URL-friendly unique identifier';
COMMENT ON COLUMN organizations.verification_status IS 'unverified=new, pending=awaiting confirmations, verified=3+ confirmations';
COMMENT ON COLUMN organizations.verification_count IS 'Number of colleague/customer verifications received';
COMMENT ON COLUMN organizations.is_public IS 'Whether organization is publicly visible (requires verification)';
COMMENT ON COLUMN organizations.created_by IS 'User who first created this organization record';

COMMENT ON COLUMN stories.organization_id IS 'Organization this story/perspective belongs to';
COMMENT ON COLUMN stories.founder_role IS 'Role of the story author in the organization';
COMMENT ON COLUMN stories.public_naming IS 'Whether author wants to be publicly named';
COMMENT ON COLUMN stories.contact_email IS 'Contact email for verification and communication';

COMMENT ON COLUMN memorials.organization_id IS 'Organization this cenotaph memorializes (one per org)';
