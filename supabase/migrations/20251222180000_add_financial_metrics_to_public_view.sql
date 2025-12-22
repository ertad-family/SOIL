-- Migration: Add financial metrics access for public organization pages
-- Purpose: Expose peak revenue and currency for public organization pages
-- Only essential metrics are exposed, not the full financial_picture

-- Drop and recreate the view with financial metrics
DROP VIEW IF EXISTS public_coined_stories;

CREATE VIEW public_coined_stories AS
SELECT
    id,
    organization_id,
    user_id,
    founder_role,
    public_naming,
    ai_summary,
    coined_at,
    -- Extract only essential financial metrics for public display
    financial_picture->'currency' AS revenue_currency,
    financial_picture->'essentialMetrics'->'revenue'->'peakAnnual' AS peak_annual_revenue
FROM stories s
WHERE status = 'coined' AND ai_summary IS NOT NULL;

-- Grant SELECT to authenticated and anonymous users (existing policy)
GRANT SELECT ON public_coined_stories TO anon, authenticated;

COMMENT ON VIEW public_coined_stories IS
'Public view of coined stories with AI-refined data and essential financial metrics.
Raw interview data is NOT exposed for privacy.';

-- Create SECURITY DEFINER function to fetch financial metrics
-- This bypasses RLS and allows public access to essential financial data
-- for coined stories, even if ai_summary is not yet generated
CREATE OR REPLACE FUNCTION get_public_financial_metrics(org_id uuid)
RETURNS TABLE(
    peak_annual_revenue text,
    revenue_currency text
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT
        financial_picture->'essentialMetrics'->'revenue'->>'peakAnnual' as peak_annual_revenue,
        financial_picture->>'currency' as revenue_currency
    FROM stories
    WHERE organization_id = org_id
      AND status = 'coined'
      AND financial_picture IS NOT NULL
    ORDER BY coined_at ASC
    LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION get_public_financial_metrics(uuid) TO anon, authenticated;

COMMENT ON FUNCTION get_public_financial_metrics IS
'Securely fetch peak revenue and currency for public display without exposing full financial data';
