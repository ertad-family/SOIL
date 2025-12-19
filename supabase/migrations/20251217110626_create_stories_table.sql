-- Migration: Create stories table for interview wizard
-- Description: Stores organizational autopsy interview data (Story Coining Process)

-- =============================================================================
-- STORIES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS stories (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign key to auth.users
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'in_progress', 'coined', 'archived')),

  -- Module progress
  current_module TEXT NOT NULL DEFAULT 'basic_info'
    CHECK (current_module IN (
      'basic_info', 'functional', 'financial', 'dynamic',
      'environment', 'founder', 'narrative'
    )),
  completed_modules TEXT[] DEFAULT '{}',

  -- Module data (JSONB for flexibility)
  -- Module 0: Basic Info
  basic_info JSONB NOT NULL DEFAULT '{
    "organizationName": "",
    "description": "",
    "organizationType": null,
    "businessModel": null,
    "industry": null,
    "location": {"country": null, "city": null},
    "foundedDate": null,
    "closedDate": null,
    "stageAtClosure": null,
    "peakTeamSize": null,
    "founderRole": null,
    "publicNaming": null,
    "contactEmail": null
  }'::jsonb,

  -- Module 1: Functional Mapping
  functional_mapping JSONB NOT NULL DEFAULT '{
    "functions": [],
    "customCategories": []
  }'::jsonb,

  -- Module 2: Financial Picture
  financial_picture JSONB NOT NULL DEFAULT '{
    "uploadedFiles": [],
    "metrics": null,
    "dynamics": [],
    "events": []
  }'::jsonb,

  -- Module 3: Dynamic Picture
  dynamic_picture JSONB NOT NULL DEFAULT '{
    "detectedPatterns": [],
    "patternQuestions": [],
    "events": []
  }'::jsonb,

  -- Module 4: Environment Analysis
  environment JSONB NOT NULL DEFAULT '{
    "resourceAssessments": [],
    "events": []
  }'::jsonb,

  -- Module 5: Founder Context
  founder_context JSONB NOT NULL DEFAULT '{
    "background": {
      "priorExperience": null,
      "domainKnowledge": null,
      "lifeSituation": null,
      "commitment": null,
      "startedWith": null,
      "howFoundCoFounders": null,
      "roleClarity": null,
      "motivationEvolution": null,
      "fadingNoticedAt": null,
      "cofounderRelationship": null,
      "investmentLevel": null,
      "healthImpact": null,
      "relationshipImpact": null,
      "financeImpact": null,
      "recoveryTime": null,
      "timeSinceEnd": null,
      "currentFeeling": null,
      "whatHelpedProcess": null,
      "wouldDoAgain": null
    },
    "events": []
  }'::jsonb,

  -- Module 6: Narrative
  narrative JSONB NOT NULL DEFAULT '{
    "sections": {
      "understanding": [],
      "hindsight": [],
      "lessons": [],
      "advice": [],
      "legacy": []
    }
  }'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  coined_at TIMESTAMPTZ
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Index for user lookups (most common query)
CREATE INDEX idx_stories_user_id ON stories(user_id);

-- Index for status filtering
CREATE INDEX idx_stories_status ON stories(status);

-- Index for user + status combination
CREATE INDEX idx_stories_user_status ON stories(user_id, status);

-- Index for finding incomplete stories
CREATE INDEX idx_stories_user_current_module ON stories(user_id, current_module)
  WHERE status IN ('draft', 'in_progress');

-- GIN index for searching within basic_info JSONB
CREATE INDEX idx_stories_basic_info ON stories USING GIN (basic_info);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Users can view their own stories
CREATE POLICY "Users can view own stories"
  ON stories
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own stories
CREATE POLICY "Users can insert own stories"
  ON stories
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own stories
CREATE POLICY "Users can update own stories"
  ON stories
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own stories
CREATE POLICY "Users can delete own stories"
  ON stories
  FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_stories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER stories_updated_at_trigger
  BEFORE UPDATE ON stories
  FOR EACH ROW
  EXECUTE FUNCTION update_stories_updated_at();

-- Auto-set coined_at when status changes to 'coined'
CREATE OR REPLACE FUNCTION set_stories_coined_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'coined' AND OLD.status != 'coined' THEN
    NEW.coined_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER stories_coined_at_trigger
  BEFORE UPDATE ON stories
  FOR EACH ROW
  EXECUTE FUNCTION set_stories_coined_at();

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE stories IS 'Organizational autopsy interview data for the Story Coining Process';
COMMENT ON COLUMN stories.status IS 'draft=incomplete basic_info, in_progress=basic_info complete, coined=all modules complete, archived=soft deleted';
COMMENT ON COLUMN stories.current_module IS 'The module the user is currently working on or should continue from';
COMMENT ON COLUMN stories.completed_modules IS 'Array of module IDs that have been completed';
COMMENT ON COLUMN stories.basic_info IS 'Module 0: Organization basics, timeline, founder role';
COMMENT ON COLUMN stories.functional_mapping IS 'Module 1: Organization structure at peak operations';
COMMENT ON COLUMN stories.financial_picture IS 'Module 2: Financial metrics, dynamics, and events';
COMMENT ON COLUMN stories.dynamic_picture IS 'Module 3: Internal events from peak to closure';
COMMENT ON COLUMN stories.environment IS 'Module 4: External conditions and events';
COMMENT ON COLUMN stories.founder_context IS 'Module 5: Founder background, journey, and personal impact';
COMMENT ON COLUMN stories.narrative IS 'Module 6: Meaning, lessons, and legacy';
COMMENT ON COLUMN stories.coined_at IS 'Timestamp when story was marked as coined (all modules complete)';
