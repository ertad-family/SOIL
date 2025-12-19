-- Migration: Add cenotaph design generation fields to memorials table
-- Issue: #23 Cenotaph creation wizard
-- Description: Adds fields for AI-generated cenotaph designs

-- =============================================================================
-- ADD NEW COLUMNS TO MEMORIALS TABLE
-- =============================================================================

-- Design options JSON - stores generated design variants
-- Structure: { options: [{id, url, prompt, created_at}], selected_id: string }
ALTER TABLE memorials
ADD COLUMN IF NOT EXISTS cenotaph_design JSONB;

-- Final selected cenotaph image URL (after user selection)
ALTER TABLE memorials
ADD COLUMN IF NOT EXISTS cenotaph_image_url TEXT;

-- User's custom design prompt/wishes
ALTER TABLE memorials
ADD COLUMN IF NOT EXISTS user_design_prompt TEXT;

-- Design generation status tracking
ALTER TABLE memorials
ADD COLUMN IF NOT EXISTS design_status TEXT
DEFAULT 'not_started'
CHECK (design_status IN ('not_started', 'generating', 'options_ready', 'completed', 'failed'));

-- Generation metadata (for analytics and debugging)
-- Structure: { attempts: number, last_error: string, model_used: string, cost_estimate: number }
ALTER TABLE memorials
ADD COLUMN IF NOT EXISTS design_metadata JSONB;

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Index for filtering by design status
CREATE INDEX IF NOT EXISTS idx_memorials_design_status
ON memorials(design_status)
WHERE design_status != 'not_started';

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON COLUMN memorials.cenotaph_design IS 'JSON containing AI-generated design options: {options: [{id, url, prompt}], selected_id}';
COMMENT ON COLUMN memorials.cenotaph_image_url IS 'Final selected cenotaph image URL from Supabase Storage';
COMMENT ON COLUMN memorials.user_design_prompt IS 'User-provided preferences and wishes for the cenotaph design';
COMMENT ON COLUMN memorials.design_status IS 'Status of design generation: not_started, generating, options_ready, completed, failed';
COMMENT ON COLUMN memorials.design_metadata IS 'Generation metadata: attempts, errors, model info, cost tracking';
