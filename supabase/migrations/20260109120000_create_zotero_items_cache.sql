-- Migration: Create zotero_items cache table for local Zotero library sync
-- This enables proper FK relationships and faster queries

-- Create the zotero_items cache table
CREATE TABLE IF NOT EXISTS zotero_items (
  key text PRIMARY KEY,                    -- Zotero item key (e.g., "TJJH9FB8")
  item_type text NOT NULL,                 -- journalArticle, book, bookSection, etc.
  title text NOT NULL,
  authors text,                            -- Formatted author string
  year integer,                            -- Publication year
  publication text,                        -- Journal/publisher name
  doi text,
  url text,
  abstract text,
  tags text[] DEFAULT '{}',                -- Array of tags including SOIL:XX-NNN
  collections text[] DEFAULT '{}',         -- Zotero collection keys
  raw_data jsonb,                          -- Full Zotero item data for reference
  last_synced_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Index for tag-based queries (finding literature by pathology code)
CREATE INDEX IF NOT EXISTS idx_zotero_items_tags ON zotero_items USING GIN (tags);

-- Index for type filtering
CREATE INDEX IF NOT EXISTS idx_zotero_items_type ON zotero_items (item_type);

-- Index for year filtering
CREATE INDEX IF NOT EXISTS idx_zotero_items_year ON zotero_items (year);

-- Add comment explaining the table
COMMENT ON TABLE zotero_items IS
  'Local cache of Zotero library items. Synced via /api/zotero/sync endpoint.
   Tags with format SOIL:XX-NNN link items to pathology classifications.';

COMMENT ON COLUMN zotero_items.tags IS
  'Zotero tags. Use SOIL:XX-NNN format to link to pathologies (e.g., SOIL:LP-001).';

-- RLS policies
ALTER TABLE zotero_items ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access for zotero_items"
  ON zotero_items FOR SELECT
  USING (true);

-- Service role full access (for sync operations)
CREATE POLICY "Service role full access for zotero_items"
  ON zotero_items FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
