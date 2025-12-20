-- Migration: Create public_coined_stories view
-- Purpose: Expose only AI-refined data from coined stories for public display
-- SECURITY: Raw interview data (narrative, basic_info, functional_mapping, etc.) is NOT exposed

-- Create view with only AI-refined public-safe fields
CREATE OR REPLACE VIEW public_coined_stories AS
SELECT
  s.id,
  s.organization_id,
  s.user_id,
  s.founder_role,
  s.public_naming,
  s.ai_summary,
  s.coined_at
FROM stories s
WHERE s.status = 'coined'
  AND s.ai_summary IS NOT NULL;

-- Add comment explaining the view's purpose
COMMENT ON VIEW public_coined_stories IS
  'Read-only view of coined stories exposing only AI-refined data (ai_summary).
   Raw interview data (narrative, basic_info, functional_mapping, financial_picture,
   dynamic_picture, environment, founder_context) is intentionally NOT exposed for privacy.';

-- Grant SELECT to anon and authenticated roles
GRANT SELECT ON public_coined_stories TO anon;
GRANT SELECT ON public_coined_stories TO authenticated;
