-- Migration: Migrate existing data to organizations table
-- Description: Moves basic_info data from stories to organizations
--
-- This migration:
-- 1. Creates organizations from existing stories.basic_info
-- 2. Links stories to their organizations
-- 3. Moves founder_role, public_naming, contact_email to stories columns
-- 4. Updates memorials to link to organizations

-- =============================================================================
-- MIGRATE STORIES TO ORGANIZATIONS
-- =============================================================================

-- Create organizations from existing stories
INSERT INTO organizations (
  id,  -- Use story ID as org ID for simplicity (1:1 for now)
  slug,
  name,
  organization_type,
  business_model,
  industry,
  description,
  location_country,
  location_city,
  founded_date,
  closed_date,
  stage_at_closure,
  peak_team_size,
  created_by,
  created_at,
  updated_at
)
SELECT
  s.id,  -- Reuse story ID as organization ID
  -- Generate slug from name
  LOWER(REGEXP_REPLACE(
    COALESCE(s.basic_info->>'organizationName', 'org-' || SUBSTRING(s.id::text, 1, 8)),
    '[^a-zA-Z0-9]+', '-', 'g'
  )),
  COALESCE(s.basic_info->>'organizationName', 'Unnamed Organization'),
  s.basic_info->>'organizationType',
  s.basic_info->>'businessModel',
  s.basic_info->>'industry',
  s.basic_info->>'description',
  s.basic_info->'location'->>'country',
  s.basic_info->'location'->>'city',
  s.basic_info->>'foundedDate',
  s.basic_info->>'closedDate',
  s.basic_info->>'stageAtClosure',
  (s.basic_info->>'peakTeamSize')::integer,
  s.user_id,
  s.created_at,
  s.updated_at
FROM stories s
WHERE NOT EXISTS (
  SELECT 1 FROM organizations o WHERE o.id = s.id
);

-- Link stories to organizations
UPDATE stories s
SET
  organization_id = s.id,  -- Same ID since we used story ID for org
  founder_role = s.basic_info->>'founderRole',
  public_naming = s.basic_info->>'publicNaming',
  contact_email = s.basic_info->>'contactEmail'
WHERE s.organization_id IS NULL;

-- =============================================================================
-- UPDATE MEMORIALS
-- =============================================================================

-- Link memorials to organizations via story_id
UPDATE memorials m
SET organization_id = s.organization_id
FROM stories s
WHERE m.story_id = s.id
  AND m.organization_id IS NULL;

-- For memorials without story_id but with matching organization name,
-- try to link via name match
UPDATE memorials m
SET organization_id = o.id
FROM organizations o
WHERE m.organization_id IS NULL
  AND LOWER(m.organization_name) = LOWER(o.name);

-- =============================================================================
-- ADD CONSTRAINTS (after data migration)
-- =============================================================================

-- Make organization_id NOT NULL for stories (all should be linked now)
-- Note: Run this manually after verifying data migration
-- ALTER TABLE stories ALTER COLUMN organization_id SET NOT NULL;

-- Add unique constraint for memorials (one per organization)
-- Note: Run this manually after verifying no duplicates
-- ALTER TABLE memorials ADD CONSTRAINT memorials_organization_id_unique UNIQUE (organization_id);

-- =============================================================================
-- VERIFICATION
-- =============================================================================

-- Check migration results
DO $$
DECLARE
  stories_count INTEGER;
  orgs_count INTEGER;
  linked_stories INTEGER;
  unlinked_stories INTEGER;
BEGIN
  SELECT COUNT(*) INTO stories_count FROM stories;
  SELECT COUNT(*) INTO orgs_count FROM organizations;
  SELECT COUNT(*) INTO linked_stories FROM stories WHERE organization_id IS NOT NULL;
  SELECT COUNT(*) INTO unlinked_stories FROM stories WHERE organization_id IS NULL;

  RAISE NOTICE 'Migration Summary:';
  RAISE NOTICE '  Total stories: %', stories_count;
  RAISE NOTICE '  Organizations created: %', orgs_count;
  RAISE NOTICE '  Stories linked to orgs: %', linked_stories;
  RAISE NOTICE '  Stories NOT linked: %', unlinked_stories;

  IF unlinked_stories > 0 THEN
    RAISE WARNING 'There are % stories without organization_id!', unlinked_stories;
  END IF;
END $$;
