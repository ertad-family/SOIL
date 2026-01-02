-- Add render settings for 3D cenotaph models
-- These settings control how the 3D model is displayed (materials, lighting, etc.)

ALTER TABLE memorials
ADD COLUMN IF NOT EXISTS cenotaph_render_settings JSONB DEFAULT NULL;

-- Example structure:
-- {
--   "material": {
--     "metalness": 0.9,
--     "roughness": 0.25,
--     "envMapIntensity": 1.5
--   },
--   "environment": "sunset",
--   "lighting": {
--     "keyLight": { "intensity": 2.5, "color": "#ff9050" },
--     "fillLight": { "intensity": 1.0 },
--     "rimLight": { "intensity": 1.2, "color": "#ffaa70" }
--   },
--   "exposure": 1.5
-- }

COMMENT ON COLUMN memorials.cenotaph_render_settings IS 'JSON settings for 3D model rendering (materials, lighting, environment)';
