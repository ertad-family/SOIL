-- Migration: Add privacy_display_style column to organizations
-- Description: Allows organization owners to choose how their private org appears
-- Issue: #64 - Respect organization privacy settings when displaying names

-- Add privacy_display_style column with check constraint
ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS privacy_display_style TEXT DEFAULT 'veiled'
CHECK (privacy_display_style IN (
  'veiled',      -- "Veiled Organization" - suggests something covered/protected
  'unnamed',     -- "Unnamed Organization" - simple, factual
  'silent',      -- "Silent Organization" - poetic, fits memorial theme
  'redacted',    -- "Organization [Redacted]" - modern, deliberate withholding
  'incognita',   -- "Incognita Organization" - Latin, from "terra incognita"
  'sub_rosa'     -- "Organization Sub Rosa" - Latin, ancient secrecy symbol
));

-- Add comment for documentation
COMMENT ON COLUMN organizations.privacy_display_style IS 'Display style for private organizations: veiled, unnamed, silent, redacted, incognita, sub_rosa';
