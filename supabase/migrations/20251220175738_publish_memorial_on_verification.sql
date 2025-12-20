-- Migration: Publish memorial when organization becomes verified
-- Issue: #85 - Memorial not published after creation workflow
-- Description: Updates the verification trigger to also set memorial.status = 'published'

-- =============================================================================
-- UPDATE VERIFICATION TRIGGER
-- =============================================================================

-- Replace the existing function to also publish the memorial
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
      END
    WHERE id = NEW.organization_id;

    -- If organization is now verified (3+ confirmations), publish the memorial
    IF confirmed_count >= 3 THEN
      UPDATE memorials
      SET status = 'published'
      WHERE organization_id = NEW.organization_id
        AND status = 'draft';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON FUNCTION update_organization_verification() IS
  'Trigger function that updates organization verification status and publishes memorial when verified (3+ confirmations)';
