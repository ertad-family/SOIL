-- Fix verification trigger to not cast to non-existent enum type
-- The verification_status column is TEXT, not an enum

-- Drop the existing trigger first
DROP TRIGGER IF EXISTS on_verification_confirmed ON verification_requests;

-- Recreate the function without type casting (column is TEXT, not enum)
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
    -- Note: verification_status is TEXT with CHECK constraint, not an enum
    UPDATE organizations
    SET
      verification_count = confirmed_count,
      verification_status = CASE
        WHEN confirmed_count >= 3 THEN 'verified'
        WHEN confirmed_count > 0 THEN 'pending'
        ELSE 'unverified'
      END
    WHERE id = NEW.organization_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_verification_confirmed
  AFTER INSERT OR UPDATE OF status
  ON verification_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_organization_verification();

-- Also need RLS policy for anonymous users to update verification_requests via token
-- Create policy for public token-based updates
CREATE POLICY "Public can update verification via token"
  ON verification_requests
  FOR UPDATE
  USING (
    status = 'pending'
    AND expires_at > now()
  )
  WITH CHECK (
    status IN ('confirmed', 'declined')
  );
