-- Migration: Add AI summary fields to stories table
-- Description: Stores AI-generated, privacy-stripped summaries for live feedback during interview

-- =============================================================================
-- ADD AI SUMMARY COLUMNS
-- =============================================================================

-- AI-generated summary (privacy-stripped, research-ready)
ALTER TABLE stories ADD COLUMN IF NOT EXISTS ai_summary JSONB DEFAULT NULL;
-- Structure: {
--   text: "Privacy-stripped narrative summary...",
--   lastModuleProcessed: "functional",
--   keyFacts: ["fact1", "fact2", ...],
--   organizationType: "tech_product",
--   industry: "fintech",
--   lifespanMonths: 24,
--   peakTeamSize: 15,
--   closurePattern: "cash_crisis"
-- }

-- Processing status for UI feedback
ALTER TABLE stories ADD COLUMN IF NOT EXISTS ai_summary_status TEXT DEFAULT 'idle'
  CHECK (ai_summary_status IN ('idle', 'generating', 'ready', 'failed'));

-- Last update timestamp for summary
ALTER TABLE stories ADD COLUMN IF NOT EXISTS ai_summary_updated_at TIMESTAMPTZ DEFAULT NULL;

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON COLUMN stories.ai_summary IS 'AI-generated privacy-stripped summary of completed modules, used for cenotaph generation and public pages';
COMMENT ON COLUMN stories.ai_summary_status IS 'Processing status: idle=not started, generating=in progress, ready=available, failed=error occurred';
COMMENT ON COLUMN stories.ai_summary_updated_at IS 'Timestamp of last successful summary generation';
