-- Migration: Create storage bucket for cenotaph designs
-- Issue: #23 Cenotaph creation wizard
-- Description: Creates a public bucket for AI-generated cenotaph images

-- =============================================================================
-- CREATE STORAGE BUCKET
-- =============================================================================

-- Create the cenotaph-designs bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cenotaph-designs',
  'cenotaph-designs',
  true,  -- Public read access
  5242880,  -- 5MB max file size
  ARRAY['image/png', 'image/jpeg', 'image/webp']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- STORAGE POLICIES
-- =============================================================================

-- Allow public read access to all cenotaph designs
CREATE POLICY "Public read access for cenotaph designs"
ON storage.objects
FOR SELECT
USING (bucket_id = 'cenotaph-designs');

-- Allow authenticated users to upload their own cenotaph designs
CREATE POLICY "Authenticated users can upload cenotaph designs"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'cenotaph-designs'
  AND auth.role() = 'authenticated'
);

-- Allow users to update their own cenotaph designs
CREATE POLICY "Users can update their cenotaph designs"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'cenotaph-designs'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'cenotaph-designs'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own cenotaph designs
CREATE POLICY "Users can delete their cenotaph designs"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'cenotaph-designs'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
