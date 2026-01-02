-- Migration: Add 3D model URL field to memorials table
-- Issue: #253 - Add 3D Cenotaph Viewing to Organization Profile Page
--
-- Adds cenotaph_model_url field to store the URL of optimized 3D GLB models
-- stored in the cenotaph-designs Supabase bucket.
-- Path pattern: {memorialId}/model-{quality}.glb

-- Add cenotaph_model_url column to memorials table
ALTER TABLE memorials
ADD COLUMN IF NOT EXISTS cenotaph_model_url TEXT DEFAULT NULL;

-- Add comment explaining the field
COMMENT ON COLUMN memorials.cenotaph_model_url IS
  'URL to 3D GLB model file in cenotaph-designs bucket. Path pattern: {memorialId}/model-{quality}.glb';
