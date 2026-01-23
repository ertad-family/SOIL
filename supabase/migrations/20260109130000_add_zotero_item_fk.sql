-- Migration: Add foreign key constraint from pathology_classification to zotero_items
-- This ensures referential integrity and cascading deletes when Zotero items are removed

-- Add FK constraint with ON DELETE SET NULL
-- When a Zotero item is deleted (e.g., merged), the reference becomes NULL
ALTER TABLE pathology_classification
ADD CONSTRAINT fk_pathology_zotero_item
FOREIGN KEY (zotero_item_key)
REFERENCES zotero_items(key)
ON DELETE SET NULL;

-- Add comment explaining the constraint
COMMENT ON CONSTRAINT fk_pathology_zotero_item ON pathology_classification IS
  'Foreign key to zotero_items cache. SET NULL on delete ensures orphaned references are cleared when Zotero items are merged/deleted.';
