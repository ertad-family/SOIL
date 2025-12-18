-- Create storage bucket for verification documents
-- This bucket stores registration documents, extracts, charters, etc.

-- Create the bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'verification-documents',
  'verification-documents',
  false,  -- Private bucket (requires auth)
  10485760,  -- 10MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- RLS POLICIES FOR STORAGE
-- =============================================================================

-- Allow authenticated users to upload to their organization's folder
CREATE POLICY "Users can upload to own organization folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'verification-documents'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM organizations WHERE created_by = auth.uid()
  )
);

-- Allow users to read their own organization's documents
CREATE POLICY "Users can read own organization documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'verification-documents'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM organizations WHERE created_by = auth.uid()
  )
);

-- Allow users to delete their own organization's pending documents
CREATE POLICY "Users can delete own pending documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'verification-documents'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM organizations WHERE created_by = auth.uid()
  )
);

-- =============================================================================
-- COMMENT
-- =============================================================================

COMMENT ON COLUMN storage.buckets.id IS 'verification-documents: Stores documents for organization verification (registration, extracts, etc.)';
