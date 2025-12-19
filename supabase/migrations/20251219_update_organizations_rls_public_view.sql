-- Update RLS policy for organizations to allow public viewing
-- Privacy constraints (hiding org name, founder name) are handled in the application layer

-- Drop the old restrictive policy that only allowed viewing public orgs
DROP POLICY IF EXISTS "Anyone can view public organizations" ON organizations;

-- Create new policy that allows everyone to view all organizations
-- This enables the public memorial page feature where:
-- - Public orgs show full details
-- - Private orgs show content but hide identifying information (org name, founder name)
CREATE POLICY "Anyone can view all organizations" ON organizations
FOR SELECT
USING (true);

COMMENT ON POLICY "Anyone can view all organizations" ON organizations IS 
'Allows anonymous and authenticated users to view all organizations. 
Privacy (hiding org name, founder info for private orgs) is enforced at the application layer.';
