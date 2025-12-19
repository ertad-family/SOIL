"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textareaVariants = cva(
  // Base styles - Roman Heritage: clean, subtle
  [
    "flex w-full min-h-[120px]",
    "font-sans text-base",
    "rounded-sm",
    "px-3 py-3",
    "border",
    "transition-all duration-fast",
    "focus:outline-none",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "resize-y",
  ],
  {
    variants: {
      variant: {
        // Light mode (Cenotaphery default)
        default: [
          "bg-white text-marble-950 border-marble-300",
          "placeholder:text-marble-500",
          "hover:border-marble-400",
          "focus:border-gold-500 focus:ring-1 focus:ring-gold-500",
          "disabled:bg-marble-100",
        ],
        // Light mode error
        error: [
          "bg-white text-marble-950 border-error-500",
          "placeholder:text-marble-500",
          "hover:border-error-600",
          "focus:border-error-500 focus:ring-1 focus:ring-error-500",
        ],
        // Dark mode (SOIL Scientific)
        dark: [
          "bg-slate-800 text-marble-100 border-slate-600",
          "placeholder:text-slate-400",
          "hover:border-slate-500",
          "focus:border-gold-400 focus:ring-1 focus:ring-gold-400",
          "disabled:bg-slate-700",
        ],
        // Dark mode error
        "dark-error": [
          "bg-slate-800 text-marble-100 border-error-500",
          "placeholder:text-slate-400",
          "hover:border-error-400",
          "focus:border-error-400 focus:ring-1 focus:ring-error-400",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, VariantProps<typeof textareaVariants> {
  showCount?: boolean;
  maxLength?: number;
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, showCount, maxLength, value, onChange, error, ...props }, ref) => {
    const [charCount, setCharCount] = React.useState(typeof value === "string" ? value.length : 0);

    // Auto-switch to error variant if error prop is true
    const resolvedVariant = error
      ? variant === "dark" || variant === "dark-error"
        ? "dark-error"
        : "error"
      : variant;

    const isDark = variant === "dark" || variant === "dark-error";

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className="relative w-full">
        <textarea
          className={cn(textareaVariants({ variant: resolvedVariant, className }))}
          ref={ref}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          {...props}
        />
        {showCount && maxLength && (
          <div
            className={cn(
              "absolute bottom-3 right-3",
              "text-xs",
              isDark ? "text-slate-400" : "text-marble-500",
              charCount >= maxLength && "text-error-500"
            )}
          >
            {charCount}/{maxLength}
          </div>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
