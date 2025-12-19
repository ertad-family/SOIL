-- Migration: Add email tracking columns to verification_requests
-- Description:
--   Add columns to track email sending status, errors, and retry logic
--   for the email worker that sends verification request emails via Resend

-- =============================================================================
-- EMAIL ERROR TYPE ENUM
-- =============================================================================

-- Error type to distinguish temporary vs permanent failures
CREATE TYPE email_error_type AS ENUM (
  'resend_error',     -- Temporary: network issues, rate limits, 5xx errors -> retry
  'recipient_error'   -- Permanent: invalid email, hard bounce -> no retry
);

-- =============================================================================
-- ADD EMAIL TRACKING COLUMNS
-- =============================================================================

-- When email was successfully sent
ALTER TABLE verification_requests
ADD COLUMN email_sent_at TIMESTAMPTZ;

-- Error message if email failed
ALTER TABLE verification_requests
ADD COLUMN email_error TEXT;

-- Type of error (temporary or permanent)
ALTER TABLE verification_requests
ADD COLUMN email_error_type email_error_type;

-- Number of retry attempts (max 10)
ALTER TABLE verification_requests
ADD COLUMN retry_count INTEGER NOT NULL DEFAULT 0;

-- When to retry next (null = can retry immediately)
ALTER TABLE verification_requests
ADD COLUMN next_retry_at TIMESTAMPTZ;

-- =============================================================================
-- INDEXES FOR EMAIL WORKER QUERIES
-- =============================================================================

-- Index for finding pending emails to send
-- Worker queries: email_sent_at IS NULL AND (next_retry_at IS NULL OR next_retry_at <= NOW())
CREATE INDEX idx_verification_requests_pending_emails
ON verification_requests (email_sent_at, next_retry_at)
WHERE email_sent_at IS NULL
  AND (email_error_type IS NULL OR email_error_type != 'recipient_error')
  AND retry_count < 10;

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON COLUMN verification_requests.email_sent_at IS 'Timestamp when verification email was successfully sent via Resend';
COMMENT ON COLUMN verification_requests.email_error IS 'Error message from last failed email send attempt';
COMMENT ON COLUMN verification_requests.email_error_type IS 'Type of error: resend_error (retry) or recipient_error (permanent)';
COMMENT ON COLUMN verification_requests.retry_count IS 'Number of retry attempts for failed email sends (max 10)';
COMMENT ON COLUMN verification_requests.next_retry_at IS 'Timestamp when next retry should be attempted';
