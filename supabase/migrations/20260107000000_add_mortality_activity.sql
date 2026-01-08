-- Add Mortality Activity Index columns to researchers table
-- Issue #277: Filter out researchers who have pivoted away from organizational mortality research

-- ============================================================================
-- ADD MORTALITY ACTIVITY TRACKING COLUMNS
-- ============================================================================

-- Score from 0-100 indicating how active the researcher is in mortality research
-- 0 = no recent mortality-related publications
-- 100 = all recent publications are mortality-related
ALTER TABLE researchers ADD COLUMN IF NOT EXISTS mortality_activity_score INTEGER DEFAULT 0;

-- When the mortality activity was last analyzed
ALTER TABLE researchers ADD COLUMN IF NOT EXISTS mortality_activity_updated_at TIMESTAMPTZ;

-- Count of recent works (last 5 years) that are mortality-related
ALTER TABLE researchers ADD COLUMN IF NOT EXISTS recent_mortality_works INTEGER DEFAULT 0;

-- Year of most recent mortality-related publication
ALTER TABLE researchers ADD COLUMN IF NOT EXISTS last_mortality_publication_year INTEGER;

-- ============================================================================
-- CREATE INDEX FOR FILTERING
-- ============================================================================

-- Index for efficient filtering by activity score
CREATE INDEX IF NOT EXISTS idx_researchers_mortality_score ON researchers(mortality_activity_score);
