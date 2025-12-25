-- Migration: Project Settings System
-- Purpose: Database-backed project configuration for admin management
--
-- Features:
-- - Key-value settings with JSONB values (supports any type)
-- - Categorized settings for organized UI
-- - Audit trail (updated_at, updated_by)
-- - RLS: Anyone can read, only admins can write

-- =============================================================================
-- 1. CREATE PROJECT_SETTINGS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS project_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Index for category-based queries (admin UI grouping)
CREATE INDEX IF NOT EXISTS idx_project_settings_category
ON project_settings(category);

-- =============================================================================
-- 2. ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE project_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (needed for feature flags on client)
CREATE POLICY "Anyone can read settings" ON project_settings
  FOR SELECT USING (true);

-- Only admins can modify settings
CREATE POLICY "Admins can manage settings" ON project_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =============================================================================
-- 3. AUTO-UPDATE TIMESTAMP TRIGGER
-- =============================================================================

CREATE OR REPLACE FUNCTION update_project_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS project_settings_updated ON project_settings;
CREATE TRIGGER project_settings_updated
  BEFORE UPDATE ON project_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_project_settings_timestamp();

-- =============================================================================
-- 4. INITIAL SETTINGS
-- =============================================================================

INSERT INTO project_settings (key, value, description, category) VALUES
  -- Features
  ('require_verification_for_cenotaph', 'false',
   'Require organization verification before creating cenotaph', 'features'),
  ('enable_ai_cenotaph_generation', 'true',
   'Enable AI-powered cenotaph image generation', 'features'),

  -- Cenotapheries
  ('the_first_capacity', '100',
   'Capacity of the-first founding cenotaphery', 'cenotapheries'),
  ('standard_cenotaphery_capacity', '512',
   'Default capacity for new cenotapheries', 'cenotapheries'),

  -- System
  ('maintenance_mode', 'false',
   'Put site in maintenance mode (shows maintenance page)', 'system')
ON CONFLICT (key) DO NOTHING;

-- =============================================================================
-- 5. HELPER COMMENT
-- =============================================================================

COMMENT ON TABLE project_settings IS
'Project-wide configuration settings managed via admin dashboard.
Categories: features, cenotapheries, system
Values are JSONB - can store booleans, numbers, strings, or complex objects.';
