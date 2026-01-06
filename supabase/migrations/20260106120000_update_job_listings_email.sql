-- Update default email for job listings to new domain
-- Note: The actual email comes from NEXT_PUBLIC_EMAIL_DOMAIN environment variable
-- This default is a fallback for direct DB insertions

ALTER TABLE job_listings
ALTER COLUMN application_email SET DEFAULT 'careers@soilplatform.org';

-- Update any existing records that use the old email domain
UPDATE job_listings
SET application_email = REPLACE(application_email, '@soil.rip', '@soilplatform.org')
WHERE application_email LIKE '%@soil.rip';
