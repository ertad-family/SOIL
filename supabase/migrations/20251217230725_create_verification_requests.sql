-- Create verification_requests table
-- This table stores verification requests sent to ex-colleagues, customers, suppliers, partners

-- Relationship types enum
CREATE TYPE verification_relationship AS ENUM (
  'colleague',
  'customer',
  'supplier',
  'partner',
  'investor',
  'other'
);

-- Verification request status enum
CREATE TYPE verification_request_status AS ENUM (
  'pending',
  'confirmed',
  'declined',
  'expired'
);

-- Create the verification_requests table
CREATE TABLE verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- References
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Verifier info
  verifier_email TEXT NOT NULL,
  verifier_name TEXT,
  relationship verification_relationship NOT NULL,
  relationship_details TEXT, -- Optional additional context

  -- Status tracking
  status verification_request_status NOT NULL DEFAULT 'pending',

  -- Secure token for verification link
  token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '30 days'),
  responded_at TIMESTAMPTZ,

  -- Verifier response (optional message)
  response_message TEXT,

  -- Prevent duplicate requests to same email for same organization
  UNIQUE(organization_id, verifier_email)
);

-- Indexes
CREATE INDEX idx_verification_requests_organization ON verification_requests(organization_id);
CREATE INDEX idx_verification_requests_token ON verification_requests(token);
CREATE INDEX idx_verification_requests_status ON verification_requests(status);
CREATE INDEX idx_verification_requests_expires ON verification_requests(expires_at) WHERE status = 'pending';

-- RLS Policies
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;

-- Organization owners can view all requests for their organizations
CREATE POLICY "Owners can view verification requests"
  ON verification_requests
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organizations
      WHERE organizations.id = verification_requests.organization_id
      AND organizations.created_by = auth.uid()
    )
  );

-- Organization owners can create verification requests
CREATE POLICY "Owners can create verification requests"
  ON verification_requests
  FOR INSERT
  WITH CHECK (
    requester_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM organizations
      WHERE organizations.id = verification_requests.organization_id
      AND organizations.created_by = auth.uid()
    )
  );

-- Organization owners can delete pending requests
CREATE POLICY "Owners can delete pending requests"
  ON verification_requests
  FOR DELETE
  USING (
    status = 'pending'
    AND EXISTS (
      SELECT 1 FROM organizations
      WHERE organizations.id = verification_requests.organization_id
      AND organizations.created_by = auth.uid()
    )
  );

-- Public can view by token (for verification page) - handled via API with service role

-- Function to update organization verification status when requests are confirmed
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

    -- Update organization verification_count
    UPDATE organizations
    SET
      verification_count = confirmed_count,
      verification_status = CASE
        WHEN confirmed_count >= 3 THEN 'verified'::verification_status
        WHEN confirmed_count > 0 THEN 'pending'::verification_status
        ELSE 'unverified'::verification_status
      END
    WHERE id = NEW.organization_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically update organization verification status
CREATE TRIGGER on_verification_confirmed
  AFTER INSERT OR UPDATE OF status
  ON verification_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_organization_verification();

-- Add comment
COMMENT ON TABLE verification_requests IS 'Stores verification requests sent to ex-colleagues, customers, suppliers, and partners to verify organization existence';
