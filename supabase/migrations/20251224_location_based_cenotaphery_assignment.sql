-- Migration: Location-based cenotaphery assignment
-- Issue: #222 (auto-spawn) + #107 (location-based)
--
-- Changes:
-- 1. Add location_region column to organizations (for full geographic hierarchy)
-- 2. Update default capacity to 512 for new cenotapheries
-- 3. Add index for efficient location-based lookup
-- 4. Update level CHECK constraint to include 'global'
--
-- Note: "the-first" cenotaphery stays as-is (capacity=100, special historical status)

-- =============================================================================
-- 1. ADD REGION COLUMN TO ORGANIZATIONS
-- =============================================================================
-- Region is determined automatically from city via GeoNames/geocoding API
-- Examples: "California" for Los Angeles, "Ile-de-France" for Paris, "Kartli" for Tbilisi

ALTER TABLE organizations ADD COLUMN IF NOT EXISTS location_region TEXT;

-- Index for region-based queries
CREATE INDEX IF NOT EXISTS idx_organizations_region
ON organizations(location_region) WHERE location_region IS NOT NULL;

-- =============================================================================
-- 2. UPDATE CENOTAPHERIES TABLE
-- =============================================================================

-- Update default capacity to 512 for new cenotapheries
ALTER TABLE cenotapheries ALTER COLUMN capacity SET DEFAULT 512;

-- Add 'global' to level check constraint
ALTER TABLE cenotapheries DROP CONSTRAINT IF EXISTS cenotapheries_level_check;
ALTER TABLE cenotapheries ADD CONSTRAINT cenotapheries_level_check
  CHECK (level IN ('global', 'country', 'region', 'city'));

-- Index for efficient location-based lookup (level + location + status)
CREATE INDEX IF NOT EXISTS idx_cenotapheries_level_location_status
ON cenotapheries(level, location, status);

-- Add comment documenting the assignment hierarchy
COMMENT ON TABLE cenotapheries IS
'Cenotapheries are geographic collections of cenotaphs. Assignment order (prestige hierarchy):
1. "the-first" (slug=the-first) - founding circle, capacity 100
2. Country level (level=country) - capacity 512
3. Region level (level=region) - capacity 512
4. City level (level=city) - capacity 512
5. Global fallback (level=global) - capacity 512

Early founders get more prestigious (larger geographic scope) cenotapheries.';
