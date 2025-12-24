-- Fix: Allow viewing all organizations (public and private)
-- Issue: Security fix from #78 was too restrictive
--
-- Context:
-- - The previous migration (20251223) changed RLS to only allow viewing public organizations
-- - This caused 404 errors for non-public organization pages
-- - Non-public organizations should be viewable, just with their NAME masked
-- - Name masking is handled at the application layer (src/lib/privacy.ts)
-- - All other organization data (industry, location, stories) is intentionally public
--
-- This migration reverts to allowing all organizations to be viewed while
-- maintaining the owner policy for consistency.

-- Drop the restrictive policy
DROP POLICY IF EXISTS "Anyone can view public organizations" ON organizations;

-- Create policy allowing viewing all organizations
-- Privacy of the name is enforced at the application layer
CREATE POLICY "Anyone can view all organizations" ON organizations
FOR SELECT
USING (true);

COMMENT ON POLICY "Anyone can view all organizations" ON organizations IS
'Allows viewing all organizations. The organization NAME is masked at the application layer
(src/lib/privacy.ts) for non-public organizations. All other data is intentionally public.';
