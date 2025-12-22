-- =============================================================================
-- UPDATE FIRST CENOTAPHERY DESCRIPTION
-- Issue: #173 - Enhance First Cenotaphery introduction
-- =============================================================================

-- Update the description to be more compelling and honor-focused
UPDATE cenotapheries
SET
  description = 'Join the founding circle of organizational science. As one of the first 100 founders to share your story, you become a pioneer in preserving collective business wisdom—earning exclusive recognition, governance rights, and a permanent place in history.',
  updated_at = now()
WHERE slug = 'the-first';

COMMENT ON TABLE cenotapheries IS 'Collections of cenotaphs organized by location or theme. The First Cenotaphery (the-first) is limited to 100 founding members with special benefits.';
