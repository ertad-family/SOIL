import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createSupabaseClient, type PendingEmailRequest } from "../../lib/supabase.js";
import { getResendClient, classifyResendError, calculateNextRetryTime } from "../../lib/resend.js";
import { generateVerificationEmail } from "../../lib/templates/verification-email.js";

// Maximum emails to process per cron run (to avoid timeouts)
const BATCH_SIZE = 10;

// Maximum retry attempts before giving up
const MAX_RETRIES = 10;

export default async function handler(request: VercelRequest, response: VercelResponse) {
  // Only allow GET requests (Vercel cron uses GET)
  if (request.method !== "GET") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  // Verify cron secret if configured (additional security layer)
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.authorization;
    if (authHeader !== `Bearer ${cronSecret}`) {
      return response.status(401).json({ error: "Unauthorized" });
    }
  }

  try {
    const supabase = createSupabaseClient();
    const resend = getResendClient();
    const appUrl = process.env.APP_URL || "https://soil.vercel.app";
    const emailFrom = process.env.EMAIL_FROM || "SOIL <noreply@soil.vercel.app>";

    // Query pending verification requests that need emails sent
    // Conditions:
    // - email_sent_at IS NULL (not sent yet)
    // - email_error_type IS NULL OR email_error_type = 'resend_error' (not permanent failure)
    // - retry_count < MAX_RETRIES
    // - next_retry_at IS NULL OR next_retry_at <= now() (ready for retry)
    // - status = 'pending' (not already responded)
    const now = new Date().toISOString();

    const { data: pendingRequests, error: fetchError } = await supabase
      .from("verification_requests")
      .select(
        `
        *,
        organization:organizations!inner(id, name, location_city, location_country)
      `
      )
      .is("email_sent_at", null)
      .eq("status", "pending")
      .lt("retry_count", MAX_RETRIES)
      .or(`email_error_type.is.null,email_error_type.eq.resend_error`)
      .or(`next_retry_at.is.null,next_retry_at.lte.${now}`)
      .order("created_at", { ascending: true })
      .limit(BATCH_SIZE);

    if (fetchError) {
      console.error("Error fetching pending requests:", fetchError);
      return response.status(500).json({
        error: "Failed to fetch pending requests",
        details: fetchError.message,
      });
    }

    if (!pendingRequests || pendingRequests.length === 0) {
      return response.status(200).json({
        message: "No pending emails to send",
        processed: 0,
      });
    }

    console.log(`Processing ${pendingRequests.length} pending email(s)`);

    const results = {
      processed: 0,
      sent: 0,
      failed: 0,
      errors: [] as Array<{ requestId: string; error: string }>,
    };

    // Process each pending request
    for (const request of pendingRequests as PendingEmailRequest[]) {
      results.processed++;

      try {
        // Generate email content
        const emailContent = generateVerificationEmail(request, appUrl);

        // Send email via Resend
        const { data: sendResult, error: sendError } = await resend.emails.send({
          from: emailFrom,
          to: request.verifier_email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        });

        if (sendError) {
          throw sendError;
        }

        // Success - update database
        const { error: updateError } = await supabase
          .from("verification_requests")
          .update({
            email_sent_at: new Date().toISOString(),
            email_error: null,
            email_error_type: null,
          })
          .eq("id", request.id);

        if (updateError) {
          console.error(
            `Failed to update request ${request.id} after successful send:`,
            updateError
          );
        }

        console.log(
          `Email sent successfully to ${request.verifier_email} (message ID: ${sendResult?.id})`
        );
        results.sent++;
      } catch (error) {
        // Classify the error
        const { message, type } = classifyResendError(error);
        console.error(`Failed to send email for request ${request.id}:`, message);

        const newRetryCount = request.retry_count + 1;
        const isPermanentFailure = type === "recipient_error" || newRetryCount >= MAX_RETRIES;

        // Calculate next retry time (only for resend_error and under max retries)
        const nextRetryAt =
          type === "resend_error" && newRetryCount < MAX_RETRIES
            ? calculateNextRetryTime(request.retry_count).toISOString()
            : null;

        // Update database with error info
        const { error: updateError } = await supabase
          .from("verification_requests")
          .update({
            email_error: message,
            email_error_type: type,
            retry_count: newRetryCount,
            next_retry_at: nextRetryAt,
          })
          .eq("id", request.id);

        if (updateError) {
          console.error(`Failed to update request ${request.id} with error:`, updateError);
        }

        results.failed++;
        results.errors.push({
          requestId: request.id,
          error: `${type}: ${message}${isPermanentFailure ? " (permanent)" : ""}`,
        });
      }
    }

    console.log(
      `Completed: ${results.sent} sent, ${results.failed} failed out of ${results.processed} processed`
    );

    return response.status(200).json({
      message: "Email processing completed",
      ...results,
    });
  } catch (error) {
    console.error("Unexpected error in cron job:", error);
    return response.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
