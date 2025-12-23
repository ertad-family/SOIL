-- Security Fix: Restore proper RLS for organizations table
-- Issue: #78 - Security Audit: Fix RLS bypass vulnerability
--
-- The previous migration (20251219_update_organizations_rls_public_view.sql)
-- changed the policy to USING (true) which allows ANYONE to view ALL organizations,
-- including private ones. This is a security vulnerability.
--
-- Privacy masking at the application layer is not sufficient because:
-- 1. Direct Supabase client queries can bypass application layer
-- 2. Crafted API requests may leak data
-- 3. This violates defense-in-depth security principles

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can view all organizations" ON organizations;

-- Restore the correct policy that only allows viewing PUBLIC organizations
-- Private organizations (is_public = false) can only be seen by their owner
CREATE POLICY "Anyone can view public organizations" ON organizations
FOR SELECT
USING (is_public = TRUE);

-- Policy for owners to view their own organizations (public or private)
-- Check if this policy already exists, if not create it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'organizations'
    AND policyname = 'Users can view their own organizations'
  ) THEN
    CREATE POLICY "Users can view their own organizations" ON organizations
    FOR SELECT
    USING (auth.uid() = created_by);
  END IF;
END $$;

COMMENT ON POLICY "Anyone can view public organizations" ON organizations IS
'Allows anonymous and authenticated users to view organizations marked as public (is_public = TRUE).
Private organizations are hidden at the database level for proper security.';
