-- Migration: Fix respects trigger to bypass RLS
-- Issue: Pay respects button doesn't update memorials.respects_count
-- Root cause: Trigger function runs with SECURITY INVOKER (default),
--             but memorials table has no UPDATE policy for anonymous/authenticated users.
--             The UPDATE silently fails due to RLS.
-- Fix: Add SECURITY DEFINER to run with owner privileges (bypasses RLS)

-- =============================================================================
-- FIX TRIGGER FUNCTION
-- =============================================================================

CREATE OR REPLACE FUNCTION update_memorial_respects_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE memorials
  SET respects_count = respects_count + NEW.amount
  WHERE id = NEW.memorial_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON FUNCTION update_memorial_respects_count() IS
  'Trigger function to increment memorial respects_count. Uses SECURITY DEFINER to bypass RLS.';
