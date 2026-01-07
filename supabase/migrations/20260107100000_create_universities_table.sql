-- Create universities table for Research Atlas clustering and detail panels
-- This enables grouping researchers by institution with proper deduplication

CREATE TABLE universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,           -- Canonical name (e.g., "Stanford University")
  display_name TEXT,                   -- Optional display name if different
  parent_id UUID REFERENCES universities(id), -- For sub-units (e.g., "Stanford GSB" -> "Stanford University")
  country TEXT,
  city TEXT,
  website_url TEXT,
  logo_url TEXT,
  openalex_id TEXT,                    -- OpenAlex institution ID for enrichment
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for parent lookups
CREATE INDEX idx_universities_parent ON universities(parent_id);

-- Add foreign key to researchers table
ALTER TABLE researchers
ADD COLUMN university_id UUID REFERENCES universities(id);

-- Index for researcher lookups by university
CREATE INDEX idx_researchers_university ON researchers(university_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_universities_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER universities_updated_at
  BEFORE UPDATE ON universities
  FOR EACH ROW
  EXECUTE FUNCTION update_universities_updated_at();

-- Comment explaining the parent_id relationship
COMMENT ON COLUMN universities.parent_id IS 'Reference to parent university for sub-units. E.g., "Stanford Graduate School of Business" has parent_id pointing to "Stanford University"';
