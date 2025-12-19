-- Migration: Add verification roles and document verification
-- Description:
--   1. Add requester_name and claimed_role to verification_requests for combined verification
--   2. Create verification_documents table for documentary verification
--   3. Add verification_method to organizations
--   4. Expand author_role options in stories for non-founder perspectives

-- =============================================================================
-- ENUM TYPES
-- =============================================================================

-- Document verification status
CREATE TYPE document_verification_status AS ENUM (
  'pending_review',  -- Waiting for admin review
  'approved',        -- Document approved, org verified
  'rejected'         -- Document rejected
);

-- Verification method (how the org was verified)
CREATE TYPE verification_method AS ENUM (
  'social',      -- 3 social confirmations
  'documentary'  -- Registration documents approved
);

-- Author role for story perspectives (broader than founder_role)
-- This covers all types of people who can share perspectives
CREATE TYPE story_author_role AS ENUM (
  'founder',
  'co_founder',
  'executive',
  'employee',
  'customer',
  'supplier',
  'partner',
  'investor',
  'other'
);

-- =============================================================================
-- UPDATE VERIFICATION_REQUESTS TABLE
-- =============================================================================

-- Add requester name (display name of the person asking for verification)
ALTER TABLE verification_requests
ADD COLUMN requester_name TEXT;

-- Add claimed role (the role user claims to have had, copied from their story)
ALTER TABLE verification_requests
ADD COLUMN claimed_role TEXT;

-- Add comment
COMMENT ON COLUMN verification_requests.requester_name IS 'Display name of the user requesting verification';
COMMENT ON COLUMN verification_requests.claimed_role IS 'Role claimed by requester (e.g., founder, co_founder) - verifier confirms this';

-- =============================================================================
-- UPDATE ORGANIZATIONS TABLE
-- =============================================================================

-- Add verification method to track how org was verified
ALTER TABLE organizations
ADD COLUMN verification_method verification_method;

COMMENT ON COLUMN organizations.verification_method IS 'How the org was verified: social (3 refs) or documentary (docs)';

-- =============================================================================
-- UPDATE STORIES TABLE - ADD AUTHOR_ROLE
-- =============================================================================

-- Add author_role column for perspective authors (broader than founder_role)
ALTER TABLE stories
ADD COLUMN author_role story_author_role;

COMMENT ON COLUMN stories.author_role IS 'Role of the story author in relation to the organization';

-- =============================================================================
-- VERIFICATION DOCUMENTS TABLE
-- =============================================================================

CREATE TABLE verification_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- References
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- File info (stored in Supabase Storage)
  file_path TEXT NOT NULL,           -- Path in storage bucket
  file_name TEXT NOT NULL,           -- Original file name
  file_size INTEGER,                 -- Size in bytes
  file_type TEXT,                    -- MIME type (application/pdf, image/jpeg, etc.)

  -- Document details
  document_type TEXT NOT NULL CHECK (document_type IN (
    'registration',      -- Company registration certificate
    'extract',           -- Official registry extract (EGRUL, etc.)
    'charter',           -- Company charter/bylaws
    'shareholder_list',  -- List of shareholders/founders
    'other'              -- Other supporting document
  )),
  description TEXT,                  -- User's description of the document

  -- Moderation
  status document_verification_status NOT NULL DEFAULT 'pending_review',
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  admin_notes TEXT,                  -- Internal notes for admins

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_verification_documents_organization ON verification_documents(organization_id);
CREATE INDEX idx_verification_documents_status ON verification_documents(status);
CREATE INDEX idx_verification_documents_uploaded_by ON verification_documents(uploaded_by);

-- =============================================================================
-- RLS FOR VERIFICATION_DOCUMENTS
-- =============================================================================

ALTER TABLE verification_documents ENABLE ROW LEVEL SECURITY;

-- Organization owners can view their documents
CREATE POLICY "Owners can view verification documents"
  ON verification_documents
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organizations
      WHERE organizations.id = verification_documents.organization_id
      AND organizations.created_by = auth.uid()
    )
  );

-- Organization owners can upload documents
CREATE POLICY "Owners can upload verification documents"
  ON verification_documents
  FOR INSERT
  WITH CHECK (
    uploaded_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM organizations
      WHERE organizations.id = verification_documents.organization_id
      AND organizations.created_by = auth.uid()
    )
  );

-- Organization owners can delete pending documents
CREATE POLICY "Owners can delete pending documents"
  ON verification_documents
  FOR DELETE
  USING (
    status = 'pending_review'
    AND EXISTS (
      SELECT 1 FROM organizations
      WHERE organizations.id = verification_documents.organization_id
      AND organizations.created_by = auth.uid()
    )
  );

-- =============================================================================
-- TRIGGER FOR DOCUMENT APPROVAL
-- =============================================================================

-- Function to update organization when document is approved
CREATE OR REPLACE FUNCTION update_organization_on_document_approval()
RETURNS TRIGGER AS $$
BEGIN
  -- When document status changes to 'approved'
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    -- Update organization verification status
    UPDATE organizations
    SET
      verification_status = 'verified',
      verification_method = 'documentary',
      verification_count = COALESCE(verification_count, 0) + 1
    WHERE id = NEW.organization_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for document approval
CREATE TRIGGER on_document_approved
  AFTER INSERT OR UPDATE OF status
  ON verification_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_organization_on_document_approval();

-- =============================================================================
-- UPDATE EXISTING TRIGGER FOR SOCIAL VERIFICATION
-- =============================================================================

-- Drop and recreate the verification trigger to set verification_method
DROP TRIGGER IF EXISTS on_verification_confirmed ON verification_requests;

CREATE OR REPLACE FUNCTION update_organization_verification()
RETURNS TRIGGER AS $$
DECLARE
  confirmed_count INTEGER;
BEGIN
  -- Only process when status changes to 'confirmed'
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    -- Count confirmed verifications for this organization
    SELECT COUNT(*) INTO confirmed_count
    FROM verification_requests
    WHERE organization_id = NEW.organization_id
    AND status = 'confirmed';

    -- Update organization verification_count and status
    UPDATE organizations
    SET
      verification_count = confirmed_count,
      verification_status = CASE
        WHEN confirmed_count >= 3 THEN 'verified'::verification_status
        WHEN confirmed_count > 0 THEN 'pending'::verification_status
        ELSE 'unverified'::verification_status
      END,
      -- Set verification_method to 'social' when verified via 3 confirmations
      verification_method = CASE
        WHEN confirmed_count >= 3 AND verification_method IS NULL THEN 'social'::verification_method
        ELSE verification_method
      END
    WHERE id = NEW.organization_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER on_verification_confirmed
  AFTER INSERT OR UPDATE OF status
  ON verification_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_organization_verification();

-- =============================================================================
-- AUTO-UPDATE updated_at FOR DOCUMENTS
-- =============================================================================

CREATE TRIGGER verification_documents_updated_at_trigger
  BEFORE UPDATE ON verification_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_organizations_updated_at();

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE verification_documents IS 'Documents uploaded for documentary verification of organization ownership';
COMMENT ON COLUMN verification_documents.file_path IS 'Path in Supabase Storage bucket';
COMMENT ON COLUMN verification_documents.document_type IS 'Type: registration, extract, charter, shareholder_list, other';
COMMENT ON COLUMN verification_documents.status IS 'Moderation status: pending_review, approved, rejected';
