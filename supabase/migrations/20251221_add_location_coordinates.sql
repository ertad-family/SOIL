-- Migration: Add geographic coordinates to organizations table
-- Issue: #33 - Smart geo location picker for cenotaphery placement
--
-- Purpose: Store standardized location data with coordinates for:
-- 1. Accurate placement on cemetery globe
-- 2. Deduplication via GeoNames ID
-- 3. Consistent location data (no more "USA" vs "United States" variations)

-- Add latitude column
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS location_lat DOUBLE PRECISION;

-- Add longitude column
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS location_lng DOUBLE PRECISION;

-- Add GeoNames ID for deduplication and standardization
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS location_geo_id INTEGER;

-- Add comments for clarity
COMMENT ON COLUMN organizations.location_lat IS 'Latitude from GeoNames/Geoapify geocoding';
COMMENT ON COLUMN organizations.location_lng IS 'Longitude from GeoNames/Geoapify geocoding';
COMMENT ON COLUMN organizations.location_geo_id IS 'GeoNames ID for location deduplication';

-- Create index for potential geographic queries
CREATE INDEX IF NOT EXISTS idx_organizations_coordinates
  ON organizations (location_lat, location_lng)
  WHERE location_lat IS NOT NULL AND location_lng IS NOT NULL;

-- Create index on geo_id for deduplication queries
CREATE INDEX IF NOT EXISTS idx_organizations_geo_id
  ON organizations (location_geo_id)
  WHERE location_geo_id IS NOT NULL;
