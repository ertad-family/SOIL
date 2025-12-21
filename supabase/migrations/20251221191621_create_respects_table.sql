-- Migration: Create respects table for Pay Respects feature
-- Issue: #103 Add 'Pay Respects' button to public organization page
-- Description: Tracks individual respect payments to prevent duplicates
--              and updates memorial respects_count automatically

-- =============================================================================
-- RESPECTS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS respects (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Memorial being honored
  memorial_id UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,

  -- Who paid respects (nullable for anonymous visitors)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Visitor fingerprint for anonymous tracking (cookie-based UUID)
  -- Always stored, even for logged-in users, to prevent anonymous-then-login exploit
  visitor_fingerprint TEXT NOT NULL,

  -- Amount of respects (default 1, allows future bonus respects)
  amount INTEGER NOT NULL DEFAULT 1 CHECK (amount > 0),

  -- Timestamp
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Fast lookup by memorial
CREATE INDEX idx_respects_memorial_id ON respects(memorial_id);

-- Fast lookup by user
CREATE INDEX idx_respects_user_id ON respects(user_id) WHERE user_id IS NOT NULL;

-- Fast lookup by fingerprint
CREATE INDEX idx_respects_visitor_fingerprint ON respects(visitor_fingerprint);

-- Unique constraint: one respect per fingerprint per memorial
-- This is the PRIMARY duplicate prevention mechanism
CREATE UNIQUE INDEX idx_respects_unique_fingerprint
  ON respects(memorial_id, visitor_fingerprint);

-- =============================================================================
-- TRIGGER: Update memorial respects_count on insert
-- =============================================================================

CREATE OR REPLACE FUNCTION update_memorial_respects_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE memorials
  SET respects_count = respects_count + NEW.amount
  WHERE id = NEW.memorial_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER respects_increment_trigger
  AFTER INSERT ON respects
  FOR EACH ROW
  EXECUTE FUNCTION update_memorial_respects_count();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE respects ENABLE ROW LEVEL SECURITY;

-- Anyone can insert respects (validation done in API)
CREATE POLICY "Anyone can insert respects"
  ON respects
  FOR INSERT
  WITH CHECK (true);

-- Users can view their own respects
CREATE POLICY "Users can view own respects"
  ON respects
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can read all for counting
CREATE POLICY "Service role can read all respects"
  ON respects
  FOR SELECT
  USING (auth.role() = 'service_role');

-- Anyone can read respects (needed for realtime subscriptions)
CREATE POLICY "Anyone can read respects for realtime"
  ON respects
  FOR SELECT
  USING (true);

-- =============================================================================
-- REALTIME
-- =============================================================================

-- Enable realtime for live counter updates
ALTER PUBLICATION supabase_realtime ADD TABLE respects;

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE respects IS 'Tracks individual respect payments to cenotaphs';
COMMENT ON COLUMN respects.memorial_id IS 'The memorial/cenotaph receiving respects';
COMMENT ON COLUMN respects.user_id IS 'User who paid respects (NULL for anonymous visitors)';
COMMENT ON COLUMN respects.visitor_fingerprint IS 'Cookie-based visitor ID for duplicate prevention';
COMMENT ON COLUMN respects.amount IS 'Number of respects paid (default 1, for future bonus respects)';
