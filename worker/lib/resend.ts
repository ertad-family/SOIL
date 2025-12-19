import { Resend } from "resend";

let resendClient: Resend | null = null;

export function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("Missing RESEND_API_KEY environment variable");
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

// Result type for email sending
export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  errorType?: "resend_error" | "recipient_error";
}

// Classify Resend errors into temporary (retry) or permanent (no retry)
export function classifyResendError(error: unknown): {
  message: string;
  type: "resend_error" | "recipient_error";
} {
  // Extract error message - Resend errors are objects with message property
  let errorMessage: string;
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    errorMessage = String((error as { message: unknown }).message);
  } else if (error && typeof error === "object") {
    errorMessage = JSON.stringify(error);
  } else {
    errorMessage = String(error);
  }

  // Permanent recipient errors - don't retry
  const recipientErrorPatterns = [
    "invalid email",
    "email address is not valid",
    "recipient rejected",
    "hard bounce",
    "mailbox not found",
    "user unknown",
    "no such user",
    "address rejected",
    "recipient address rejected",
    "undeliverable",
    "does not exist",
  ];

  const isRecipientError = recipientErrorPatterns.some((pattern) =>
    errorMessage.toLowerCase().includes(pattern)
  );

  return {
    message: errorMessage,
    type: isRecipientError ? "recipient_error" : "resend_error",
  };
}

// Calculate next retry time based on retry count
// Exponential backoff: 5min, 15min, 30min, 1hr, 2hr, 4hr, 8hr, 12hr, 16hr, 20hr
// Total: ~64 hours (~3 days)
export function calculateNextRetryTime(retryCount: number): Date {
  const retryDelaysMinutes = [
    5, // retry 1: 5 min
    15, // retry 2: 15 min
    30, // retry 3: 30 min
    60, // retry 4: 1 hour
    120, // retry 5: 2 hours
    240, // retry 6: 4 hours
    480, // retry 7: 8 hours
    720, // retry 8: 12 hours
    960, // retry 9: 16 hours
    1200, // retry 10: 20 hours
  ];

  const delayMinutes = retryDelaysMinutes[retryCount] || 1200;
  const nextRetry = new Date();
  nextRetry.setMinutes(nextRetry.getMinutes() + delayMinutes);
  return nextRetry;
}
