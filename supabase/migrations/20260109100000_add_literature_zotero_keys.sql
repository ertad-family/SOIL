-- Migration: Add literature_zotero_keys column for proper Zotero-linked references
-- This replaces the plain text literature_references field

-- Add new column for Zotero item keys
ALTER TABLE pathology_classification
ADD COLUMN IF NOT EXISTS literature_zotero_keys text[] DEFAULT '{}';

-- Add comment explaining the field
COMMENT ON COLUMN pathology_classification.literature_zotero_keys IS
  'Array of Zotero item keys for additional literature references. Frontend fetches full citation data from Zotero API.';
