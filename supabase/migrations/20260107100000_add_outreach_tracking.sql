-- Add Outreach Tracking columns to researchers table
-- Issue #279: Researcher Outreach Tracking System

-- ============================================================================
-- ADD OUTREACH TRACKING COLUMNS
-- ============================================================================

-- Outreach status: not_contacted, contacted, responded, interested, declined, joined
ALTER TABLE researchers ADD COLUMN IF NOT EXISTS outreach_status TEXT DEFAULT 'not_contacted';

-- Free-form notes about outreach
ALTER TABLE researchers ADD COLUMN IF NOT EXISTS outreach_notes TEXT;

-- When the researcher was last contacted
ALTER TABLE researchers ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMPTZ;

-- Reminder date for follow-up
ALTER TABLE researchers ADD COLUMN IF NOT EXISTS follow_up_date DATE;

-- ============================================================================
-- CREATE INDEX FOR FILTERING
-- ============================================================================

-- Index for efficient filtering by outreach status
CREATE INDEX IF NOT EXISTS idx_researchers_outreach_status ON researchers(outreach_status);

-- Index for finding researchers needing follow-up
CREATE INDEX IF NOT EXISTS idx_researchers_follow_up ON researchers(follow_up_date) WHERE follow_up_date IS NOT NULL;
