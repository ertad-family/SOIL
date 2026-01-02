-- Migration: Add 3D model eligibility settings
-- Issue: #254 - AI Pipeline for 3D Cenotaph Model Generation
--
-- Configurable eligibility requirements for 3D model generation
-- (matching the pattern used for cenotaph design requirements)

INSERT INTO project_settings (key, value, description, category) VALUES
  ('model3d_require_verification', 'true', 'Require organization to be verified for 3D model generation', 'cenotaph'),
  ('model3d_require_coined_story', 'true', 'Require at least one coined story for 3D model generation', 'cenotaph'),
  ('model3d_require_multiple_perspectives', 'true', 'Require multiple stories (perspectives) for 3D model generation', 'cenotaph'),
  ('model3d_min_stories', '2', 'Minimum number of stories required for 3D model generation', 'cenotaph'),
  ('model3d_min_coined_stories', '1', 'Minimum number of coined stories required for 3D model generation', 'cenotaph')
ON CONFLICT (key) DO NOTHING;
