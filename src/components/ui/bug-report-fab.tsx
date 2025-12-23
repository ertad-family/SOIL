"use client";

import { useState } from "react";
import { Bug } from "lucide-react";
import { BugReportModal } from "@/components/feedback/BugReportModal";
import { cn } from "@/lib/utils";

/**
 * Floating Action Button for bug reporting.
 * Always visible in bottom-left corner.
 */
export function BugReportFab() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={cn(
          "fixed bottom-6 left-6 z-40",
          "w-12 h-12 rounded-full",
          "flex items-center justify-center",
          "transition-all duration-300",
          "hover:scale-110 active:scale-95",
          "group"
        )}
        style={{
          background: "rgba(37, 34, 32, 0.65)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.15),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1)
          `,
        }}
        aria-label="Report a bug"
        title="Report a bug"
      >
        {/* Inner shine */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)",
          }}
        />
        <Bug className="w-5 h-5 text-marble-300 group-hover:text-marble-100 transition-colors relative z-10" />
      </button>

      <BugReportModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
