-- Migration: Remove literature_zotero_keys column
-- Literature references are now managed via Zotero tags (SOIL:XX-NNN format)

-- Drop the column
ALTER TABLE pathology_classification
DROP COLUMN IF EXISTS literature_zotero_keys;

-- Also drop the old literature_references column (plain text, superseded by Zotero tags)
-- Keep it for now as fallback for pathologies without Zotero references
-- ALTER TABLE pathology_classification DROP COLUMN IF EXISTS literature_references;
