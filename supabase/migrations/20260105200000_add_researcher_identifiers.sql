-- Add external identifiers and biographical data to researchers table
-- Part of issue #259: Research Atlas improvements

-- ============================================================================
-- ADD EXTERNAL IDENTIFIERS FOR DISAMBIGUATION
-- ============================================================================

-- OpenAlex author ID (e.g., "A5109978106" or full URL)
ALTER TABLE researchers ADD COLUMN IF NOT EXISTS openalex_id TEXT;

-- ORCID identifier (e.g., "0000-0002-1234-5678")
ALTER TABLE researchers ADD COLUMN IF NOT EXISTS orcid TEXT;

-- Wikidata entity ID (e.g., "Q28870693")
ALTER TABLE researchers ADD COLUMN IF NOT EXISTS wikidata_id TEXT;

-- Semantic Scholar author ID (numeric string)
ALTER TABLE researchers ADD COLUMN IF NOT EXISTS semantic_scholar_id TEXT;

-- ============================================================================
-- ADD BIOGRAPHICAL DATA
-- ============================================================================

-- Birth year (e.g., 1943)
ALTER TABLE researchers ADD COLUMN IF NOT EXISTS birth_year INTEGER;

-- Death year (null if still alive)
ALTER TABLE researchers ADD COLUMN IF NOT EXISTS death_year INTEGER;

-- ============================================================================
-- CREATE INDEXES FOR LOOKUPS
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_researchers_openalex_id ON researchers(openalex_id);
CREATE INDEX IF NOT EXISTS idx_researchers_orcid ON researchers(orcid);
CREATE INDEX IF NOT EXISTS idx_researchers_wikidata_id ON researchers(wikidata_id);

-- ============================================================================
-- ADD CONSTRAINTS
-- ============================================================================

-- Ensure birth_year is reasonable (1800-current)
ALTER TABLE researchers ADD CONSTRAINT check_birth_year
  CHECK (birth_year IS NULL OR (birth_year >= 1800 AND birth_year <= EXTRACT(YEAR FROM NOW())));

-- Ensure death_year is after birth_year
ALTER TABLE researchers ADD CONSTRAINT check_death_after_birth
  CHECK (death_year IS NULL OR birth_year IS NULL OR death_year >= birth_year);
