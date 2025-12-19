"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "default" | "dark";
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "md", variant = "default", ...props }, ref) => {
    const isDark = variant === "dark";

    const sizes = {
      xs: "h-3 w-3",
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-8 w-8",
      xl: "h-12 w-12",
    };

    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading"
        className={cn("inline-flex", className)}
        {...props}
      >
        <Loader2 className={cn("animate-spin text-gold-500", sizes[size])} />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);
Spinner.displayName = "Spinner";

// Dots spinner variant
export interface DotsSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "dark";
}

const DotsSpinner = React.forwardRef<HTMLDivElement, DotsSpinnerProps>(
  ({ className, size = "md", variant = "default", ...props }, ref) => {
    const sizes = {
      sm: "h-1.5 w-1.5",
      md: "h-2 w-2",
      lg: "h-3 w-3",
    };

    const dotClass = cn("rounded-full animate-pulse bg-gold-500", sizes[size]);

    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading"
        className={cn("inline-flex items-center gap-1", className)}
        {...props}
      >
        <div className={cn(dotClass, "animation-delay-0")} />
        <div className={cn(dotClass, "animation-delay-200")} />
        <div className={cn(dotClass, "animation-delay-500")} />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);
DotsSpinner.displayName = "DotsSpinner";

// Full page loading overlay
export interface LoadingOverlayProps {
  isLoading: boolean;
  variant?: "default" | "dark";
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  variant = "default",
  message,
}) => {
  const isDark = variant === "dark";

  if (!isLoading) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center gap-4",
        isDark ? "bg-slate-900/90 backdrop-blur-sm" : "bg-marble-100/90 backdrop-blur-sm"
      )}
    >
      <Spinner size="xl" variant={variant} />
      {message && (
        <p className={cn("text-sm", isDark ? "text-slate-400" : "text-marble-600")}>{message}</p>
      )}
    </div>
  );
};

export { Spinner, DotsSpinner, LoadingOverlay };
