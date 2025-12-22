-- Migration: Create get_global_stats function
-- Purpose: Provide global statistics for cenotaphery page without RLS restrictions
-- SECURITY: Uses SECURITY DEFINER to bypass RLS, only returns aggregate counts (no PII)

CREATE OR REPLACE FUNCTION get_global_stats()
RETURNS TABLE (
  total_countries BIGINT,
  total_cities BIGINT,
  total_founders BIGINT,
  total_organizations BIGINT
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    -- Count distinct countries from all organizations
    (SELECT COUNT(DISTINCT location_country)
     FROM organizations
     WHERE location_country IS NOT NULL) AS total_countries,

    -- Count distinct cities from all organizations
    (SELECT COUNT(DISTINCT location_city)
     FROM organizations
     WHERE location_city IS NOT NULL) AS total_cities,

    -- Count registered founders (all users in profiles)
    (SELECT COUNT(*) FROM profiles) AS total_founders,

    -- Count published memorials with completed designs (cenotaphs)
    (SELECT COUNT(*)
     FROM memorials
     WHERE status = 'published'
       AND design_status = 'completed'
       AND cenotaph_image_url IS NOT NULL) AS total_organizations;
$$;

COMMENT ON FUNCTION get_global_stats() IS
  'Returns global statistics for the cenotaphery page. Uses SECURITY DEFINER to bypass RLS.';

GRANT EXECUTE ON FUNCTION get_global_stats() TO anon;
GRANT EXECUTE ON FUNCTION get_global_stats() TO authenticated;
