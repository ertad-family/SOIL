"use client";

import { useState, useCallback, useRef, ChangeEvent } from "react";
import { Upload, X, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { getConsoleLogs } from "@/lib/console-capture";
import { cn } from "@/lib/utils";

interface BugReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Get browser and OS information
 */
function getBrowserInfo(): string {
  if (typeof window === "undefined") return "Unknown";

  const ua = navigator.userAgent;
  let browser = "Unknown Browser";
  let os = "Unknown OS";

  // Detect browser
  if (ua.includes("Firefox/")) {
    browser = `Firefox ${ua.split("Firefox/")[1]?.split(" ")[0] || ""}`;
  } else if (ua.includes("Chrome/") && !ua.includes("Edg/")) {
    browser = `Chrome ${ua.split("Chrome/")[1]?.split(" ")[0] || ""}`;
  } else if (ua.includes("Safari/") && !ua.includes("Chrome/")) {
    browser = `Safari ${ua.split("Version/")[1]?.split(" ")[0] || ""}`;
  } else if (ua.includes("Edg/")) {
    browser = `Edge ${ua.split("Edg/")[1]?.split(" ")[0] || ""}`;
  }

  // Detect OS
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

  return `${browser} on ${os}`;
}

export function BugReportModal({ open, onOpenChange }: BugReportModalProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [description, setDescription] = useState("");
  const [stepsToReproduce, setStepsToReproduce] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedIssueUrl, setSubmittedIssueUrl] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setDescription("");
    setStepsToReproduce("");
    setScreenshot(null);
    setScreenshotName(null);
    setSubmittedIssueUrl(null);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onOpenChange(false);
  }, [onOpenChange, resetForm]);

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (PNG, JPG, etc.)",
          variant: "dark-warning",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "dark-warning",
        });
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onload = () => {
        setScreenshot(reader.result as string);
        setScreenshotName(file.name);
      };
      reader.onerror = () => {
        toast({
          title: "Failed to read file",
          description: "Please try again",
          variant: "dark-warning",
        });
      };
      reader.readAsDataURL(file);
    },
    [toast]
  );

  const handleRemoveScreenshot = useCallback(() => {
    setScreenshot(null);
    setScreenshotName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!description.trim()) {
      toast({
        title: "Description required",
        description: "Please describe the bug you encountered",
        variant: "dark-warning",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bug-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: description.trim(),
          stepsToReproduce: stepsToReproduce.trim() || undefined,
          url: window.location.href,
          timestamp: new Date().toISOString(),
          browserInfo: getBrowserInfo(),
          consoleLogs: getConsoleLogs(),
          screenshot: screenshot || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to submit bug report");
      }

      setSubmittedIssueUrl(data.issueUrl);

      toast({
        title: "Bug report submitted",
        description: `Issue #${data.issueNumber} created. Thank you for your feedback!`,
        variant: "dark",
      });
    } catch (error) {
      console.error("Failed to submit bug report:", error);
      toast({
        title: "Failed to submit",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "dark-warning",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [description, stepsToReproduce, screenshot, toast]);

  // Success state - show link to created issue
  if (submittedIssueUrl) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent variant="dark" size="md">
          <DialogHeader>
            <DialogTitle variant="dark">Bug Report Submitted</DialogTitle>
            <DialogDescription variant="dark">
              Thank you for helping us improve SOIL!
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-slate-300 mb-4">
              Your bug report has been created as a GitHub issue.
            </p>
            <a
              href={submittedIssueUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors"
            >
              View issue on GitHub
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <DialogFooter>
            <Button variant="dark-primary" onClick={handleClose}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="dark" size="md">
        <DialogHeader>
          <DialogTitle variant="dark">Report a Bug</DialogTitle>
          <DialogDescription variant="dark">
            Help us improve SOIL by reporting issues you encounter. Your browser info and console
            logs will be automatically included.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Description */}
          <div className="space-y-2">
            <Label variant="dark" htmlFor="bug-description">
              What happened? <span className="text-red-400">*</span>
            </Label>
            <Textarea
              id="bug-description"
              variant="dark"
              placeholder="Describe the bug you encountered..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              showCount
              maxLength={1000}
              rows={3}
            />
          </div>

          {/* Steps to Reproduce */}
          <div className="space-y-2">
            <Label variant="dark" htmlFor="bug-steps">
              Steps to reproduce (optional)
            </Label>
            <Textarea
              id="bug-steps"
              variant="dark"
              placeholder="1. Go to...&#10;2. Click on...&#10;3. See error..."
              value={stepsToReproduce}
              onChange={(e) => setStepsToReproduce(e.target.value)}
              showCount
              maxLength={1000}
              rows={3}
            />
          </div>

          {/* Screenshot Upload */}
          <div className="space-y-2">
            <Label variant="dark">Screenshot (optional)</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {screenshot ? (
              <div className="relative rounded-lg border border-slate-700 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element -- base64 data URLs not compatible with next/image */}
                <img
                  src={screenshot}
                  alt="Screenshot preview"
                  className="w-full max-h-48 object-contain bg-slate-900"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    type="button"
                    onClick={handleRemoveScreenshot}
                    className="p-1.5 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    aria-label="Remove screenshot"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="px-3 py-2 bg-slate-800/50 text-xs text-slate-400 truncate">
                  {screenshotName}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "w-full py-8 rounded-lg border-2 border-dashed border-slate-700",
                  "hover:border-slate-600 hover:bg-slate-800/30",
                  "flex flex-col items-center gap-2 transition-colors"
                )}
              >
                <Upload className="w-6 h-6 text-slate-500" />
                <span className="text-sm text-slate-400">Click to upload a screenshot</span>
                <span className="text-xs text-slate-500">PNG, JPG up to 5MB</span>
              </button>
            )}
          </div>

          {/* Auto-collected info notice */}
          <p className="text-xs text-slate-500">
            We&apos;ll automatically include your current page URL, browser info, and recent console
            logs to help diagnose the issue.
          </p>
        </div>

        <DialogFooter>
          <Button variant="dark-ghost" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="dark-primary" onClick={handleSubmit} isLoading={isSubmitting}>
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
