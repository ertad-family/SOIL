"use client";

import { useState } from "react";
import { File, Clock, CheckCircle2, XCircle, Trash2, Loader2 } from "lucide-react";
import { DOCUMENT_TYPE_LABELS } from "../constants";
import type { VerificationDocument } from "../types";

interface DocumentItemProps {
  document: VerificationDocument;
  onDelete: () => void;
}

const statusIcons = {
  pending_review: <Clock className="w-4 h-4 text-gold-400" />,
  approved: <CheckCircle2 className="w-4 h-4 text-green-400" />,
  rejected: <XCircle className="w-4 h-4 text-red-400" />,
};

const statusLabels = {
  pending_review: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
};

export function DocumentItem({ document, onDelete }: DocumentItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this document?")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/verification/documents?id=${document.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        onDelete();
      }
    } catch (err) {
      console.error("Failed to delete document:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-between py-2.5 px-3 rounded bg-slate-800/50 text-sm">
      <div className="flex items-center gap-2 min-w-0">
        <File className="w-4 h-4 text-slate-500 flex-shrink-0" />
        <div className="min-w-0">
          <span className="text-slate-300 truncate block">{document.file_name}</span>
          <span className="text-slate-500 text-xs">
            {DOCUMENT_TYPE_LABELS[document.document_type]}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        <div className="flex items-center gap-1.5">
          {statusIcons[document.status]}
          <span
            className={`${
              document.status === "approved"
                ? "text-green-400"
                : document.status === "rejected"
                  ? "text-red-400"
                  : "text-gold-400"
            }`}
          >
            {statusLabels[document.status]}
          </span>
        </div>
        {document.status === "pending_review" && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1 text-slate-500 hover:text-red-400 transition-colors"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      {document.status === "rejected" && document.rejection_reason && (
        <div className="absolute left-0 right-0 -bottom-6 text-sm text-red-400 truncate">
          Reason: {document.rejection_reason}
        </div>
      )}
    </div>
  );
}
