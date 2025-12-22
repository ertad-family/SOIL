-- Fix RLS policy recursion on profiles table
-- The "Admins can view all profiles" policy caused infinite recursion
-- because it referenced the profiles table in a subquery

-- Drop the recursive policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Clean up duplicate SELECT policies
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "Authenticated can read own profile for admin check" ON profiles;

-- The remaining "Users can view own profile" policy (auth.uid() = id)
-- is sufficient for the admin check in middleware
