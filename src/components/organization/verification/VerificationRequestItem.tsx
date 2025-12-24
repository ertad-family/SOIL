"use client";

import { useState } from "react";
import { Mail, Clock, CheckCircle2, XCircle, Trash2, Loader2 } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { RELATIONSHIP_LABELS } from "../constants";
import { getEmailStatus } from "./email-status";
import type { VerificationRequest } from "../types";

interface VerificationRequestItemProps {
  request: VerificationRequest;
  onCancel?: (id: string) => void;
}

const statusIcons = {
  pending: <Clock className="w-4 h-4 text-gold-400" />,
  confirmed: <CheckCircle2 className="w-4 h-4 text-green-400" />,
  declined: <XCircle className="w-4 h-4 text-red-400" />,
  expired: <Clock className="w-4 h-4 text-slate-500" />,
};

const statusLabels = {
  pending: "Pending",
  confirmed: "Confirmed",
  declined: "Declined",
  expired: "Expired",
};

export function VerificationRequestItem({ request, onCancel }: VerificationRequestItemProps) {
  const [isCancelling, setIsCancelling] = useState(false);

  // Only show email status for pending requests
  const emailStatus = request.status === "pending" ? getEmailStatus(request) : null;

  // Can cancel if email hasn't been sent yet and status is pending
  const canCancel = !request.email_sent_at && request.status === "pending";

  const handleCancel = async () => {
    if (!onCancel || isCancelling) return;
    setIsCancelling(true);
    onCancel(request.id);
  };

  return (
    <div className="flex items-center justify-between py-2.5 px-3 rounded bg-slate-800/50 text-sm">
      <div className="flex items-center gap-2 min-w-0">
        <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
        <span className="text-slate-300 truncate">
          {request.verifier_name || request.verifier_email.split("@")[0]}
        </span>
        <span className="text-slate-500 truncate">{request.verifier_email}</span>
        <span className="text-slate-500 flex-shrink-0">
          ({RELATIONSHIP_LABELS[request.relationship]})
        </span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0 ml-2">
        {/* Cancel button (only for unsent requests) */}
        {canCancel && onCancel && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                className="p-1 text-slate-500 hover:text-red-400 transition-colors disabled:opacity-50"
              >
                {isCancelling ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Cancel request</p>
            </TooltipContent>
          </Tooltip>
        )}
        {/* Email status indicator (only for pending requests) */}
        {emailStatus && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`flex items-center gap-1 ${emailStatus.className}`}>
                {emailStatus.icon}
                <span className="text-xs">{emailStatus.label}</span>
              </div>
            </TooltipTrigger>
            {emailStatus.tooltip && (
              <TooltipContent>
                <p className="max-w-xs text-xs">{emailStatus.tooltip}</p>
              </TooltipContent>
            )}
          </Tooltip>
        )}
        {/* Verification status */}
        <div className="flex items-center gap-1.5">
          {statusIcons[request.status]}
          <span
            className={`${
              request.status === "confirmed"
                ? "text-green-400"
                : request.status === "declined"
                  ? "text-red-400"
                  : request.status === "pending"
                    ? "text-gold-400"
                    : "text-slate-500"
            }`}
          >
            {statusLabels[request.status]}
          </span>
        </div>
      </div>
    </div>
  );
}
