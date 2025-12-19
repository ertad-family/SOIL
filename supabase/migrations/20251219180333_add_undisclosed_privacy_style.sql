-- Migration: Add 'undisclosed' option to privacy_display_style
-- Description: Adds "Undisclosed Organization" as a privacy display option

-- Drop existing constraint and add new one with 'undisclosed' option
ALTER TABLE organizations
DROP CONSTRAINT IF EXISTS organizations_privacy_display_style_check;

ALTER TABLE organizations
ADD CONSTRAINT organizations_privacy_display_style_check
CHECK (privacy_display_style IN (
  'veiled',       -- "Veiled Organization"
  'unnamed',      -- "Unnamed Organization"
  'undisclosed',  -- "Undisclosed Organization"
  'silent',       -- "Silent Organization"
  'redacted',     -- "Organization [Redacted]"
  'incognita',    -- "Incognita Organization"
  'sub_rosa'      -- "Organization Sub Rosa"
));

-- Update comment
COMMENT ON COLUMN organizations.privacy_display_style IS 'Display style for private organizations: veiled, unnamed, undisclosed, silent, redacted, incognita, sub_rosa';
