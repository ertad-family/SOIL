-- Add bonus generation attempt to memorial when organization becomes verified
-- Modifies the existing update_organization_verification trigger function

CREATE OR REPLACE FUNCTION update_organization_verification()
RETURNS TRIGGER AS $$
DECLARE
  confirmed_count INTEGER;
  old_status TEXT;
  new_status TEXT;
  memorial_record RECORD;
  current_bonus INTEGER;
  current_metadata JSONB;
BEGIN
  -- Only process when status changes to 'confirmed'
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    -- Count confirmed verifications for this organization
    SELECT COUNT(*) INTO confirmed_count
    FROM verification_requests
    WHERE organization_id = NEW.organization_id
    AND status = 'confirmed';

    -- Get current verification status before update
    SELECT verification_status INTO old_status
    FROM organizations
    WHERE id = NEW.organization_id;

    -- Calculate new status
    new_status := CASE
      WHEN confirmed_count >= 3 THEN 'verified'
      WHEN confirmed_count > 0 THEN 'pending'
      ELSE 'unverified'
    END;

    -- Update organization verification_count and status
    UPDATE organizations
    SET
      verification_count = confirmed_count,
      verification_status = new_status
    WHERE id = NEW.organization_id;

    -- Add bonus generation attempt when organization becomes verified (status changes to 'verified')
    IF new_status = 'verified' AND (old_status IS NULL OR old_status != 'verified') THEN
      -- Find memorial for this organization
      SELECT id, design_metadata INTO memorial_record
      FROM memorials
      WHERE organization_id = NEW.organization_id
      LIMIT 1;

      IF memorial_record.id IS NOT NULL THEN
        -- Get current metadata
        current_metadata := COALESCE(memorial_record.design_metadata, '{}'::jsonb);

        -- Check if bonus already applied (verificationBonus flag)
        IF NOT COALESCE((current_metadata->>'verificationBonus')::boolean, false) THEN
          -- Get current bonus attempts
          current_bonus := COALESCE((current_metadata->>'bonusAttempts')::integer, 0);

          -- Add +1 bonus attempt and set verificationBonus flag
          UPDATE memorials
          SET design_metadata = current_metadata || jsonb_build_object(
            'bonusAttempts', current_bonus + 1,
            'verificationBonus', true
          )
          WHERE id = memorial_record.id;

          RAISE NOTICE 'Added verification bonus attempt to memorial % (org: %)', memorial_record.id, NEW.organization_id;
        END IF;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: The trigger already exists and will use the updated function
COMMENT ON FUNCTION update_organization_verification IS 'Updates organization verification status and adds bonus generation attempt to memorial when organization becomes verified';
