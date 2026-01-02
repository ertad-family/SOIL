-- Migration: Add 3D model generation tracking fields
-- Issue: #254 - AI Pipeline for 3D Cenotaph Model Generation
--
-- Adds fields to track async 3D model generation status and provider

-- Add 3D model generation tracking columns
ALTER TABLE memorials
ADD COLUMN IF NOT EXISTS model_generation_status TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS model_generation_task_id TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS model_generation_provider TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS model_generated_at TIMESTAMPTZ DEFAULT NULL;

-- Add comments
COMMENT ON COLUMN memorials.model_generation_status IS '3D generation status: pending, processing, success, failed';
COMMENT ON COLUMN memorials.model_generation_task_id IS 'External API task ID for polling status';
COMMENT ON COLUMN memorials.model_generation_provider IS 'Provider used for generation: hitem3d, etc.';
COMMENT ON COLUMN memorials.model_generated_at IS 'Timestamp when 3D model was successfully generated';
