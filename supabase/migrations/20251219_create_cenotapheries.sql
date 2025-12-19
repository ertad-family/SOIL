-- =============================================================================
-- CREATE CENOTAPHERIES TABLE
-- Issue: #42 - Create the first cenotaphery page
-- =============================================================================

-- Cenotapheries are collections of cenotaphs, organized by location or theme
-- Each cenotaphery can have different visual styles and capacity limits

CREATE TABLE IF NOT EXISTS cenotapheries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identification
  slug TEXT UNIQUE NOT NULL,           -- URL-friendly identifier (e.g., 'the-first', 'new-york')
  name TEXT NOT NULL,                  -- Display name (e.g., 'The First Cenotaphery')
  description TEXT,                    -- Description for the cenotaphery

  -- Location filter
  location TEXT NOT NULL DEFAULT 'all', -- 'all', country code, city, or region

  -- Capacity and status
  capacity INTEGER DEFAULT 1024,        -- Max number of cenotaphs
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'full', 'coming_soon')),

  -- Visual style
  style TEXT DEFAULT 'modern' CHECK (style IN ('modern', 'mediterranean', 'nordic', 'asian', 'middle_eastern', 'african', 'classical')),

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add cenotaphery_id to memorials table
ALTER TABLE memorials
  ADD COLUMN IF NOT EXISTS cenotaphery_id UUID REFERENCES cenotapheries(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_memorials_cenotaphery_id ON memorials(cenotaphery_id);
CREATE INDEX IF NOT EXISTS idx_cenotapheries_slug ON cenotapheries(slug);
CREATE INDEX IF NOT EXISTS idx_cenotapheries_location ON cenotapheries(location);

-- Insert the first cenotaphery
INSERT INTO cenotapheries (slug, name, description, location, capacity, status, style)
VALUES (
  'the-first',
  'The First Cenotaphery',
  'The inaugural global cenotaphery. A sacred digital space where organizations find eternal rest, and their stories become wisdom for future generations.',
  'all',
  1024,
  'active',
  'modern'
) ON CONFLICT (slug) DO NOTHING;

-- Assign all existing published memorials to the first cenotaphery
UPDATE memorials
SET cenotaphery_id = (SELECT id FROM cenotapheries WHERE slug = 'the-first')
WHERE status = 'published'
  AND design_status = 'completed'
  AND cenotaph_image_url IS NOT NULL
  AND cenotaphery_id IS NULL;

-- Enable RLS
ALTER TABLE cenotapheries ENABLE ROW LEVEL SECURITY;

-- Public can read cenotapheries
CREATE POLICY "Cenotapheries are publicly readable"
  ON cenotapheries FOR SELECT
  USING (true);

-- Only admins can modify cenotapheries (for now, no admin role - just block all)
CREATE POLICY "Cenotapheries are admin-only for modifications"
  ON cenotapheries FOR ALL
  USING (false);

COMMENT ON TABLE cenotapheries IS 'Collections of cenotaphs organized by location or theme';
COMMENT ON COLUMN cenotapheries.slug IS 'URL-friendly identifier';
COMMENT ON COLUMN cenotapheries.location IS 'Filter: all, country code, city, or region';
COMMENT ON COLUMN cenotapheries.capacity IS 'Maximum number of cenotaphs allowed';
COMMENT ON COLUMN cenotapheries.style IS 'Architectural/visual style of the cenotaphery';
