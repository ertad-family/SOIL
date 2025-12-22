-- =============================================================================
-- UPDATE FIRST CENOTAPHERY DESCRIPTION
-- Issue: #173 - Enhance First Cenotaphery introduction
-- =============================================================================

-- Update the description to be more compelling and honor-focused
-- Emphasize: only GLOBAL cenotaphery (others will be regional), first 100 founders
UPDATE cenotapheries
SET
  description = 'The only global cenotaphery—all others will be regional. Join the founding circle of organizational science. As one of the first 100 founders to share your story, you become a pioneer with exclusive worldwide visibility, governance rights, and a permanent place in history.',
  updated_at = now()
WHERE slug = 'the-first';

COMMENT ON TABLE cenotapheries IS 'Collections of cenotaphs organized by location or theme. The First Cenotaphery (the-first) is the only global cenotaphery, limited to 100 founding members with special benefits.';
