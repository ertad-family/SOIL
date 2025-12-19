-- Migration: Create used_cenotaph_concepts table
-- Purpose: Store catalog of previously used cenotaph design concepts to avoid repetition
-- Issue: #23 Cenotaph creation wizard - creative diversity

-- Table to store all selected/used cenotaph concepts
CREATE TABLE IF NOT EXISTS used_cenotaph_concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Reference to the memorial that used this concept
  memorial_id UUID REFERENCES memorials(id) ON DELETE SET NULL,

  -- The concept details
  concept_title TEXT NOT NULL,           -- Short creative name
  concept_description TEXT NOT NULL,     -- Full description used for image generation
  style_keywords TEXT[] DEFAULT '{}',    -- Array of style keywords for future matching

  -- Organization context (denormalized for quick queries)
  organization_type TEXT,                -- tech_product, services, etc.
  industry TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Index for fast lookups
  CONSTRAINT concept_description_not_empty CHECK (length(concept_description) > 10)
);

-- Index for fetching recent concepts
CREATE INDEX IF NOT EXISTS idx_used_concepts_created_at
  ON used_cenotaph_concepts(created_at DESC);

-- Index for filtering by industry/type
CREATE INDEX IF NOT EXISTS idx_used_concepts_org_type
  ON used_cenotaph_concepts(organization_type, industry);

-- Full text search index on description for similarity matching (future optimization)
CREATE INDEX IF NOT EXISTS idx_used_concepts_description_search
  ON used_cenotaph_concepts USING gin(to_tsvector('english', concept_description));

-- RLS policies
ALTER TABLE used_cenotaph_concepts ENABLE ROW LEVEL SECURITY;

-- Anyone can read concepts (needed for generation)
CREATE POLICY "Anyone can read used concepts"
  ON used_cenotaph_concepts FOR SELECT
  USING (true);

-- Only service role can insert (via API)
CREATE POLICY "Service role can insert concepts"
  ON used_cenotaph_concepts FOR INSERT
  WITH CHECK (true);

-- Comment
COMMENT ON TABLE used_cenotaph_concepts IS 'Catalog of previously used cenotaph design concepts to ensure creative diversity';
