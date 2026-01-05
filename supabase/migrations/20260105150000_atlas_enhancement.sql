-- Research Atlas Enhancement Migration
-- Part of issue #259: Add interactive graph, Zotero integration, connections

-- ============================================================================
-- UPDATE RESEARCHERS TABLE: Add Zotero linking fields
-- ============================================================================

-- Add zotero_creator_name for matching with Zotero publications
-- Format: "lastname, firstname" (lowercase) or single name for organizations
ALTER TABLE researchers ADD COLUMN IF NOT EXISTS zotero_creator_name TEXT;

-- Add publication_count for display (cached from Zotero)
ALTER TABLE researchers ADD COLUMN IF NOT EXISTS publication_count INTEGER DEFAULT 0;

-- Create index for Zotero name lookups
CREATE INDEX IF NOT EXISTS idx_researchers_zotero_name ON researchers(zotero_creator_name);

-- ============================================================================
-- RESEARCHER CONNECTIONS TABLE: Store relationships between researchers
-- ============================================================================

-- Connection type enum
DO $$ BEGIN
  CREATE TYPE connection_type AS ENUM (
    'coauthor',      -- Automatically detected from shared publications
    'cofounder',     -- Manual: co-founded theory/field
    'colleague',     -- Manual: same institution
    'influence',     -- Manual: intellectual influence
    'thematic',      -- Manual: similar research themes
    'advisor'        -- Manual: PhD advisor/advisee
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS researcher_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Connection participants (order-independent)
  researcher_a_id UUID NOT NULL REFERENCES researchers(id) ON DELETE CASCADE,
  researcher_b_id UUID NOT NULL REFERENCES researchers(id) ON DELETE CASCADE,

  -- Connection details
  connection_type connection_type NOT NULL,
  label TEXT,                      -- e.g., "Grief research", "Stanford", "Org Ecology papers"
  shared_publication_keys TEXT[],  -- Zotero item keys for coauthor connections
  is_auto_detected BOOLEAN DEFAULT FALSE,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Ensure researcher_a_id < researcher_b_id for consistent ordering
  CONSTRAINT check_researcher_order CHECK (researcher_a_id < researcher_b_id),

  -- Prevent duplicate connections of the same type
  CONSTRAINT unique_connection UNIQUE (researcher_a_id, researcher_b_id, connection_type)
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_connections_researcher_a ON researcher_connections(researcher_a_id);
CREATE INDEX IF NOT EXISTS idx_connections_researcher_b ON researcher_connections(researcher_b_id);
CREATE INDEX IF NOT EXISTS idx_connections_type ON researcher_connections(connection_type);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_connections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS connections_updated_at_trigger ON researcher_connections;
CREATE TRIGGER connections_updated_at_trigger
  BEFORE UPDATE ON researcher_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_connections_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY FOR CONNECTIONS
-- ============================================================================
ALTER TABLE researcher_connections ENABLE ROW LEVEL SECURITY;

-- Anyone can view connections (public page)
CREATE POLICY "Anyone can view connections"
  ON researcher_connections FOR SELECT
  USING (true);

-- Admins can manage connections
CREATE POLICY "Admins can manage connections"
  ON researcher_connections FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Service role has full access
CREATE POLICY "Service role full access on connections"
  ON researcher_connections FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================================
-- HELPER FUNCTION: Get or create connection (handles ordering)
-- ============================================================================
CREATE OR REPLACE FUNCTION upsert_researcher_connection(
  p_researcher_a_id UUID,
  p_researcher_b_id UUID,
  p_connection_type connection_type,
  p_label TEXT DEFAULT NULL,
  p_shared_publication_keys TEXT[] DEFAULT NULL,
  p_is_auto_detected BOOLEAN DEFAULT FALSE
) RETURNS UUID AS $$
DECLARE
  v_id UUID;
  v_ordered_a UUID;
  v_ordered_b UUID;
BEGIN
  -- Ensure consistent ordering (smaller UUID first)
  IF p_researcher_a_id < p_researcher_b_id THEN
    v_ordered_a := p_researcher_a_id;
    v_ordered_b := p_researcher_b_id;
  ELSE
    v_ordered_a := p_researcher_b_id;
    v_ordered_b := p_researcher_a_id;
  END IF;

  -- Upsert the connection
  INSERT INTO researcher_connections (
    researcher_a_id, researcher_b_id, connection_type,
    label, shared_publication_keys, is_auto_detected
  ) VALUES (
    v_ordered_a, v_ordered_b, p_connection_type,
    p_label, p_shared_publication_keys, p_is_auto_detected
  )
  ON CONFLICT (researcher_a_id, researcher_b_id, connection_type)
  DO UPDATE SET
    label = COALESCE(EXCLUDED.label, researcher_connections.label),
    shared_publication_keys = COALESCE(EXCLUDED.shared_publication_keys, researcher_connections.shared_publication_keys),
    updated_at = NOW()
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$ LANGUAGE plpgsql;
