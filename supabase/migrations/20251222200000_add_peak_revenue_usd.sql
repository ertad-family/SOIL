-- Migration: Add USD-converted peak revenue to organizations
-- Purpose: Store peak annual revenue in USD for consistent public display
-- Exchange rate is fetched at story coining time

-- Add columns to organizations table
ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS peak_revenue_usd numeric,
ADD COLUMN IF NOT EXISTS peak_revenue_exchange_rate numeric,
ADD COLUMN IF NOT EXISTS peak_revenue_rate_date timestamptz;

-- Add comments for documentation
COMMENT ON COLUMN organizations.peak_revenue_usd IS
'Peak annual revenue converted to USD at time of story coining';

COMMENT ON COLUMN organizations.peak_revenue_exchange_rate IS
'Exchange rate used for USD conversion (original currency to USD)';

COMMENT ON COLUMN organizations.peak_revenue_rate_date IS
'Date when the exchange rate was fetched';

-- Grant access (organizations table already has appropriate RLS policies)
