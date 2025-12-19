-- Add geographic coordinates to cenotapheries table for globe display
-- Cenotapheries without coordinates will default to USA position

ALTER TABLE cenotapheries ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION;
ALTER TABLE cenotapheries ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION;
ALTER TABLE cenotapheries ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'country';

-- Add comment for clarity
COMMENT ON COLUMN cenotapheries.lat IS 'Latitude for globe marker placement';
COMMENT ON COLUMN cenotapheries.lng IS 'Longitude for globe marker placement';
COMMENT ON COLUMN cenotapheries.level IS 'Geographic level: country, region, or city';

-- Update "the-first" cenotaphery with USA coordinates (geographic center)
UPDATE cenotapheries
SET lat = 39.8283, lng = -98.5795, level = 'country'
WHERE slug = 'the-first';

-- Create index for potential geographic queries
CREATE INDEX IF NOT EXISTS idx_cenotapheries_coordinates ON cenotapheries (lat, lng);
