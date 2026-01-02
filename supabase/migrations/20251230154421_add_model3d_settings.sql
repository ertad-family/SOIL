-- Migration: Add 3D model generation settings
-- Issue: #254 - AI Pipeline for 3D Cenotaph Model Generation
--
-- Configurable settings for 3D model generation service

INSERT INTO project_settings (key, value, description, category) VALUES
  ('model3d_enabled', 'true', 'Enable 3D model generation feature', 'cenotaph'),
  ('model3d_provider', '"hitem3d"', 'Active 3D model provider: hitem3d', 'cenotaph'),
  ('model3d_resolution', '1024', 'Model resolution: 512, 1024, 1536', 'cenotaph'),
  ('model3d_polygon_count', '500000', 'Target polygon count (100000-2000000)', 'cenotaph'),
  ('model3d_hitem3d_model_version', '"hitem3dv2.0"', 'HitEM 3D model version', 'cenotaph')
ON CONFLICT (key) DO NOTHING;
