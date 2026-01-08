-- Add citation fields to pathology_classification for academic credibility
-- Part of issue #258: Pathology Classification citation requirements
-- Enables Zenodo publication and proper academic referencing

-- ============================================================================
-- ADD CITATION FIELDS
-- ============================================================================

-- Primary/defining source (the first academic definition)
ALTER TABLE pathology_classification
  ADD COLUMN IF NOT EXISTS primary_source_title TEXT,
  ADD COLUMN IF NOT EXISTS primary_source_authors TEXT,
  ADD COLUMN IF NOT EXISTS primary_source_year INTEGER,
  ADD COLUMN IF NOT EXISTS primary_source_journal TEXT,
  ADD COLUMN IF NOT EXISTS primary_source_doi TEXT,
  ADD COLUMN IF NOT EXISTS primary_source_url TEXT,
  ADD COLUMN IF NOT EXISTS primary_source_abstract TEXT;

-- Add comments for documentation
COMMENT ON COLUMN pathology_classification.primary_source_title IS 'Title of the defining academic publication';
COMMENT ON COLUMN pathology_classification.primary_source_authors IS 'Authors of the defining publication (formatted)';
COMMENT ON COLUMN pathology_classification.primary_source_year IS 'Publication year of the defining source';
COMMENT ON COLUMN pathology_classification.primary_source_journal IS 'Journal or publication venue';
COMMENT ON COLUMN pathology_classification.primary_source_doi IS 'DOI of the defining source (if available)';
COMMENT ON COLUMN pathology_classification.primary_source_url IS 'URL to access the defining source';
COMMENT ON COLUMN pathology_classification.primary_source_abstract IS 'Abstract from the defining source for context';
