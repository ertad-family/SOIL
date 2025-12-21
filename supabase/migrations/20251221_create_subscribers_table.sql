-- Migration: Create subscribers table for Newsletter and Waitlist
-- Issue: #137 Implement Newsletter and Waitlist subscription functionality
-- Description: Stores email subscriptions for newsletter and event waitlists

-- =============================================================================
-- SUBSCRIBERS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS subscribers (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Email address (required)
  email TEXT NOT NULL,

  -- Type of subscription
  subscription_type TEXT NOT NULL CHECK (subscription_type IN ('newsletter', 'waitlist')),

  -- Source of subscription (e.g., 'footer', 'community_page', 'homepage')
  source TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Fast lookup by email
CREATE INDEX idx_subscribers_email ON subscribers(email);

-- Fast lookup by subscription type
CREATE INDEX idx_subscribers_type ON subscribers(subscription_type);

-- Unique constraint: one subscription per email per type
-- Allows same email to subscribe to both newsletter AND waitlist
CREATE UNIQUE INDEX idx_subscribers_unique_email_type
  ON subscribers(email, subscription_type);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe (insert)
CREATE POLICY "Anyone can subscribe"
  ON subscribers
  FOR INSERT
  WITH CHECK (true);

-- Service role can read all for admin/analytics
CREATE POLICY "Service role can read all subscribers"
  ON subscribers
  FOR SELECT
  USING (auth.role() = 'service_role');

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE subscribers IS 'Email subscriptions for newsletter and event waitlists';
COMMENT ON COLUMN subscribers.email IS 'Subscriber email address';
COMMENT ON COLUMN subscribers.subscription_type IS 'Type: newsletter or waitlist';
COMMENT ON COLUMN subscribers.source IS 'Where the subscription originated (footer, community_page, etc.)';
COMMENT ON COLUMN subscribers.confirmed_at IS 'When email was confirmed (for double opt-in, if implemented)';
COMMENT ON COLUMN subscribers.unsubscribed_at IS 'When user unsubscribed (soft delete)';
