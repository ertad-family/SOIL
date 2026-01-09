-- Create reference table for pathology enum values
-- This replaces hardcoded frontend values and provides single source of truth

CREATE TABLE pathology_enum_values (
  enum_type TEXT NOT NULL,  -- 'localization', 'etiology', 'course', 'functional_impairment'
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,           -- For frontend icon mapping (e.g., 'User', 'Building2')
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (enum_type, value)
);

-- Enable RLS
ALTER TABLE pathology_enum_values ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can view enum values"
  ON pathology_enum_values FOR SELECT
  USING (true);

-- Admin write access
CREATE POLICY "Admins can manage enum values"
  ON pathology_enum_values FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Populate localization values
INSERT INTO pathology_enum_values (enum_type, value, label, description, icon_name, sort_order) VALUES
  ('localization', 'LP', 'Leadership Pathology', 'Pathologies affecting leadership and governance', 'User', 1),
  ('localization', 'SP', 'Structural Pathology', 'Pathologies affecting organizational structure', 'Building2', 2),
  ('localization', 'FP', 'Financial Pathology', 'Pathologies affecting financial health', 'DollarSign', 3),
  ('localization', 'CP', 'Cultural Pathology', 'Pathologies affecting organizational culture', 'Users', 4),
  ('localization', 'MP', 'Market Pathology', 'Pathologies affecting market position', 'TrendingUp', 5),
  ('localization', 'OP', 'Operational Pathology', 'Pathologies affecting operations', 'Cog', 6);

-- Populate etiology values
INSERT INTO pathology_enum_values (enum_type, value, label, description, icon_name, sort_order) VALUES
  ('etiology', 'ETI-F', 'Founder-induced', 'Caused by founder decisions or behavior', NULL, 1),
  ('etiology', 'ETI-M', 'Market-induced', 'Caused by market conditions or shifts', NULL, 2),
  ('etiology', 'ETI-C', 'Competition-induced', 'Caused by competitive pressure', NULL, 3),
  ('etiology', 'ETI-R', 'Regulatory-induced', 'Caused by regulatory changes', NULL, 4),
  ('etiology', 'ETI-T', 'Technology-induced', 'Caused by technology disruption', NULL, 5),
  ('etiology', 'ETI-S', 'Stochastic', 'Random events or bad luck', NULL, 6),
  ('etiology', 'ETI-I', 'Iatrogenic', 'Success-induced (own success becomes weakness)', NULL, 7),
  ('etiology', 'ETI-E', 'External', 'Shock or trauma from external events', NULL, 8);

-- Populate course values
INSERT INTO pathology_enum_values (enum_type, value, label, description, icon_name, sort_order) VALUES
  ('course', 'ACU', 'Acute', 'Sudden onset, rapid progression', 'Zap', 1),
  ('course', 'CHR', 'Chronic', 'Slow decline over time', 'Clock', 2),
  ('course', 'REL', 'Relapsing', 'Recurring crisis cycles', 'RefreshCw', 3),
  ('course', 'LAT', 'Latent', 'Hidden, manifests later', 'EyeOff', 4);

-- Populate functional impairment values
INSERT INTO pathology_enum_values (enum_type, value, label, description, icon_name, sort_order) VALUES
  ('functional_impairment', 'SEN', 'Sensing', 'Signal detection impairment', NULL, 1),
  ('functional_impairment', 'PER', 'Perception', 'Signal interpretation impairment', NULL, 2),
  ('functional_impairment', 'COG', 'Cognition', 'Reasoning impairment', NULL, 3),
  ('functional_impairment', 'AFF', 'Affect', 'Emotional/cultural impairment', NULL, 4),
  ('functional_impairment', 'EXE', 'Executive', 'Planning/coordination impairment', NULL, 5),
  ('functional_impairment', 'VOL', 'Volition', 'Will/motivation impairment', NULL, 6),
  ('functional_impairment', 'MEM', 'Memory', 'Learning/retention impairment', NULL, 7),
  ('functional_impairment', 'IDE', 'Identity', 'Self-concept impairment', NULL, 8);

-- Create index for faster lookups
CREATE INDEX idx_pathology_enum_values_type ON pathology_enum_values(enum_type);

COMMENT ON TABLE pathology_enum_values IS 'Reference table for pathology classification enum values. Single source of truth for labels and descriptions.';
