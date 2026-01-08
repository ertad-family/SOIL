-- Add zotero_item_key to link pathologies to Zotero bibliography items
-- This enables bidirectional sync between pathology citations and the SOIL Zotero library (group 6367540)

ALTER TABLE pathology_classification
  ADD COLUMN IF NOT EXISTS zotero_item_key TEXT;

-- Index for efficient Zotero lookups
CREATE INDEX IF NOT EXISTS idx_pathology_zotero_item_key ON pathology_classification(zotero_item_key)
  WHERE zotero_item_key IS NOT NULL;

-- Add comment explaining the column purpose
COMMENT ON COLUMN pathology_classification.zotero_item_key IS
  'Zotero item key from SOIL group library (6367540). Used for bidirectional citation sync.';
