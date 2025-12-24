import { MailCheck, MailX, RefreshCw, Loader2 } from "lucide-react";
import type { VerificationRequest } from "../types";

interface EmailStatusResult {
  icon: React.ReactNode;
  label: string;
  className: string;
  tooltip?: string;
}

export function getEmailStatus(request: VerificationRequest): EmailStatusResult {
  // Email sent successfully
  if (request.email_sent_at) {
    return {
      icon: <MailCheck className="w-3.5 h-3.5" />,
      label: "Sent",
      className: "text-green-400",
    };
  }

  // Permanent recipient error (no retry)
  if (request.email_error_type === "recipient_error") {
    return {
      icon: <MailX className="w-3.5 h-3.5" />,
      label: "Failed",
      className: "text-red-400",
      tooltip: request.email_error || "Invalid email address",
    };
  }

  // Retrying after temporary error
  if (request.retry_count > 0 && request.email_error_type === "resend_error") {
    return {
      icon: <RefreshCw className="w-3.5 h-3.5" />,
      label: `Retry ${request.retry_count}/10`,
      className: "text-amber-400",
      tooltip: request.email_error || "Retrying...",
    };
  }

  // Waiting to be sent (new request)
  return {
    icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
    label: "Sending",
    className: "text-slate-400",
  };
}
