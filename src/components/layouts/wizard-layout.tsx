"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from "lucide-react";

export interface WizardStep {
  id: string;
  label: string;
  description?: string;
}

export interface WizardLayoutProps {
  variant?: "default" | "dark";
  children: React.ReactNode;
  steps: WizardStep[];
  currentStep: number;
  onBack?: () => void;
  onNext?: () => void;
  title?: string;
  subtitle?: string;
  backLabel?: string;
  nextLabel?: string;
  cancelHref?: string;
  isLoading?: boolean;
  canGoBack?: boolean;
  canGoNext?: boolean;
  footerContent?: React.ReactNode;
  className?: string;
  /** Custom progress percentage (0-100). If not provided, calculated from steps. */
  progress?: number;
  /** Use wider content area (max-w-6xl instead of max-w-4xl) */
  wide?: boolean;
  /** Hide the card wrapper around content */
  noCard?: boolean;
}

const WizardLayout = React.forwardRef<HTMLDivElement, WizardLayoutProps>(
  (
    {
      variant = "default",
      children,
      steps,
      currentStep,
      onBack,
      onNext,
      title,
      subtitle,
      backLabel = "Back",
      nextLabel = "Continue",
      cancelHref = "/",
      isLoading = false,
      canGoBack = true,
      canGoNext = true,
      footerContent,
      className,
      progress: customProgress,
      wide = false,
      noCard = false,
    },
    ref
  ) => {
    const progress = customProgress ?? ((currentStep + 1) / steps.length) * 100;
    const currentStepData = steps[currentStep];
    const isDark = variant === "dark";

    return (
      <div
        ref={ref}
        className={cn(
          "min-h-screen flex flex-col",
          isDark ? "bg-slate-gradient" : "bg-marble-gradient",
          className
        )}
      >
        {/* Header - compact single row */}
        <header
          className={cn(
            "sticky top-0 z-40 w-full backdrop-blur-md",
            isDark
              ? "bg-slate-900/90 border-b border-slate-700"
              : "bg-white/90 border-b border-marble-300"
          )}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-center gap-4">
              {/* Cancel button */}
              <Link href={cancelHref}>
                <Button variant={isDark ? "dark-ghost" : "ghost"} size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Save & Exit
                </Button>
              </Link>

              {/* Progress bar - flexible width */}
              <div
                className={cn(
                  "flex-1 h-1.5 rounded-full overflow-hidden",
                  isDark ? "bg-slate-700" : "bg-marble-200"
                )}
              >
                <div
                  className="h-full bg-gold-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Progress percentage */}
              <span
                className={cn(
                  "text-sm font-medium tabular-nums",
                  isDark ? "text-slate-400" : "text-marble-600"
                )}
              >
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">
          <div className={cn("mx-auto px-4 sm:px-6 py-8", wide ? "max-w-7xl" : "max-w-4xl")}>
            {/* Step title */}
            {(title || currentStepData) && (
              <div className={cn("text-center", noCard ? "mb-4" : "mb-8")}>
                <h1
                  className={cn(
                    "font-serif text-2xl sm:text-3xl font-semibold tracking-wide",
                    isDark ? "text-marble-100" : "text-marble-950"
                  )}
                >
                  {title || currentStepData.label}
                </h1>
                {(subtitle || currentStepData.description) && (
                  <p
                    className={cn("mt-2 text-base", isDark ? "text-slate-400" : "text-marble-600")}
                  >
                    {subtitle || currentStepData.description}
                  </p>
                )}
              </div>
            )}

            {/* Form content */}
            {noCard ? (
              children
            ) : (
              <div
                className={cn(
                  "rounded-md p-6 sm:p-8",
                  isDark
                    ? "bg-slate-800 border border-slate-700"
                    : "bg-white border border-marble-300 shadow-sm"
                )}
              >
                {children}
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer
          className={cn(
            "w-full backdrop-blur-md",
            isDark
              ? "bg-slate-900/90 border-t border-slate-700"
              : "bg-white/90 border-t border-marble-300"
          )}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Back button */}
              <div>
                {currentStep > 0 && canGoBack && (
                  <Button
                    variant={isDark ? "dark-secondary" : "secondary"}
                    onClick={onBack}
                    disabled={isLoading}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {backLabel}
                  </Button>
                )}
              </div>

              {/* Custom footer content or Next button */}
              <div className="flex items-center gap-3">
                {footerContent}
                {canGoNext && (
                  <Button
                    variant={isDark ? "dark-primary" : "primary"}
                    onClick={onNext}
                    disabled={isLoading}
                    isLoading={isLoading}
                  >
                    {currentStep === steps.length - 1 ? "Complete" : nextLabel}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </footer>

        {/* Bottom separator section - prevents gradient overlay from covering footer */}
        <div className={cn("w-full", isDark ? "bg-slate-900" : "bg-marble-50")}>
          <div className="divider-roman">
            <span className="text-gold-400 text-lg px-6">✦</span>
          </div>
        </div>
      </div>
    );
  }
);
WizardLayout.displayName = "WizardLayout";

export { WizardLayout };
