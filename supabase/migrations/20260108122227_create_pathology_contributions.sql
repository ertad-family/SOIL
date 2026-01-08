-- Pathology Contributions: PR-style proposal system for community additions/edits
-- Part of the SOIL open research infrastructure

-- Contribution types
CREATE TYPE contribution_type AS ENUM (
  'new_pathology',      -- Propose a new pathology
  'edit_pathology',     -- Suggest edit to existing pathology
  'add_case',           -- Add a known case example
  'add_reference'       -- Add a literature reference
);

-- Contribution status
CREATE TYPE contribution_status AS ENUM (
  'pending',            -- Awaiting review
  'under_review',       -- Being reviewed by maintainer
  'needs_revision',     -- Returned for changes
  'approved',           -- Accepted and applied
  'rejected'            -- Not accepted
);

-- Main contributions table
CREATE TABLE IF NOT EXISTS pathology_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Contribution type and target
  contribution_type contribution_type NOT NULL,
  target_pathology_id UUID REFERENCES pathology_classification(id) ON DELETE SET NULL,

  -- Contributor info (works for both anonymous and logged-in users)
  contributor_name TEXT NOT NULL,
  contributor_email TEXT NOT NULL,
  contributor_affiliation TEXT,
  contributor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Contribution content
  proposed_data JSONB NOT NULL,
  rationale TEXT NOT NULL,

  -- Evidence/sources
  supporting_references TEXT[],
  zotero_item_keys TEXT[],

  -- Review workflow
  status contribution_status NOT NULL DEFAULT 'pending',
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewer_notes TEXT,
  reviewed_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_contributions_status ON pathology_contributions(status);
CREATE INDEX idx_contributions_type ON pathology_contributions(contribution_type);
CREATE INDEX idx_contributions_target ON pathology_contributions(target_pathology_id)
  WHERE target_pathology_id IS NOT NULL;
CREATE INDEX idx_contributions_contributor ON pathology_contributions(contributor_email);
CREATE INDEX idx_contributions_created ON pathology_contributions(created_at DESC);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_contribution_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contribution_updated_at_trigger
  BEFORE UPDATE ON pathology_contributions
  FOR EACH ROW
  EXECUTE FUNCTION update_contribution_updated_at();

-- RLS Policies
ALTER TABLE pathology_contributions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit contributions (insert)
CREATE POLICY "Anyone can submit contributions"
  ON pathology_contributions FOR INSERT
  WITH CHECK (true);

-- Contributors can view their own submissions
CREATE POLICY "Contributors can view own submissions"
  ON pathology_contributions FOR SELECT
  USING (
    contributor_email = current_setting('request.jwt.claims', true)::json->>'email'
    OR contributor_user_id = auth.uid()
  );

-- Admins can view and manage all contributions
CREATE POLICY "Admins can manage contributions"
  ON pathology_contributions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Service role full access
CREATE POLICY "Service role full access to contributions"
  ON pathology_contributions FOR ALL
  USING (auth.role() = 'service_role');

-- Comments for documentation
COMMENT ON TABLE pathology_contributions IS
  'PR-style contribution proposals for the SOIL Pathology Classification. Enables community additions while maintaining academic quality through review.';

COMMENT ON COLUMN pathology_contributions.proposed_data IS
  'JSONB containing proposed pathology fields. Structure depends on contribution_type.';

COMMENT ON COLUMN pathology_contributions.rationale IS
  'Contributor explanation of why this addition/change should be accepted.';
