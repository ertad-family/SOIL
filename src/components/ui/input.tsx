"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  // Base styles - Modern minimal with animated underline focus
  [
    "flex w-full",
    "font-sans text-base",
    "rounded-sm",
    "border",
    "transition-all duration-300 ease-out",
    "focus:outline-none",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
  ],
  {
    variants: {
      variant: {
        // Light mode (Cenotaphery default) - Clean with gold underline focus
        default: [
          "bg-white/80 text-marble-950",
          "border-marble-300/80 border-b-2",
          "placeholder:text-marble-400",
          "hover:border-marble-400 hover:bg-white",
          "focus:border-marble-300 focus:border-b-gold-500 focus:bg-white",
          "focus:shadow-[0_2px_0_0_rgba(196,161,90,0.3)]",
          "disabled:bg-marble-100/50",
        ],
        // Light mode error - Red underline
        error: [
          "bg-white/80 text-marble-950",
          "border-error-300/80 border-b-2 border-b-error-500",
          "placeholder:text-marble-400",
          "hover:border-error-400",
          "focus:border-error-300 focus:border-b-error-600",
          "focus:shadow-[0_2px_0_0_rgba(239,68,68,0.3)]",
        ],
        // Dark mode (SOIL Scientific) - Subtle glow on focus
        dark: [
          "bg-slate-800/80 text-marble-100",
          "border-slate-600/80 border-b-2",
          "placeholder:text-slate-500",
          "hover:border-slate-500 hover:bg-slate-800",
          "focus:border-slate-600 focus:border-b-gold-400 focus:bg-slate-800",
          "focus:shadow-[0_2px_0_0_rgba(196,161,90,0.4)]",
          "disabled:bg-slate-900/50",
        ],
        // Dark mode error
        "dark-error": [
          "bg-slate-800/80 text-marble-100",
          "border-error-500/50 border-b-2 border-b-error-500",
          "placeholder:text-slate-500",
          "hover:border-error-400",
          "focus:border-error-500/50 focus:border-b-error-400",
          "focus:shadow-[0_2px_0_0_rgba(239,68,68,0.4)]",
        ],
        // Minimal variant - Border only on bottom
        minimal: [
          "bg-transparent text-marble-950",
          "border-0 border-b-2 border-b-marble-300",
          "rounded-none",
          "placeholder:text-marble-400",
          "hover:border-b-marble-400",
          "focus:border-b-gold-500",
          "focus:shadow-[0_2px_0_0_rgba(196,161,90,0.3)]",
        ],
        // Minimal dark variant
        "minimal-dark": [
          "bg-transparent text-marble-100",
          "border-0 border-b-2 border-b-slate-600",
          "rounded-none",
          "placeholder:text-slate-500",
          "hover:border-b-slate-500",
          "focus:border-b-gold-400",
          "focus:shadow-[0_2px_0_0_rgba(196,161,90,0.4)]",
        ],
      },
      inputSize: {
        sm: "h-8 px-2 text-sm",
        md: "h-10 px-3 text-base",
        lg: "h-12 px-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
    },
  }
);

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      variant,
      inputSize,
      leftIcon,
      rightIcon,
      leftAddon,
      rightAddon,
      error,
      ...props
    },
    ref
  ) => {
    // Auto-switch to error variant if error prop is true
    const resolvedVariant = error
      ? variant === "dark" || variant === "dark-error"
        ? "dark-error"
        : "error"
      : variant;

    const isDark = variant === "dark" || variant === "dark-error";

    // Simple input without addons
    if (!leftIcon && !rightIcon && !leftAddon && !rightAddon) {
      return (
        <input
          type={type}
          className={cn(inputVariants({ variant: resolvedVariant, inputSize, className }))}
          ref={ref}
          {...props}
        />
      );
    }

    // Input with icons/addons
    return (
      <div className="relative flex items-center w-full">
        {/* Left addon */}
        {leftAddon && (
          <div
            className={cn(
              "flex items-center justify-center",
              "px-3 h-full",
              "border border-r-0 rounded-l-sm",
              "text-sm",
              isDark
                ? "bg-slate-700 border-slate-600 text-slate-400"
                : "bg-marble-100 border-marble-300 text-marble-600"
            )}
          >
            {leftAddon}
          </div>
        )}

        {/* Left icon */}
        {leftIcon && (
          <div
            className={cn(
              "absolute left-3 flex items-center pointer-events-none",
              isDark ? "text-slate-400" : "text-marble-500"
            )}
          >
            {leftIcon}
          </div>
        )}

        <input
          type={type}
          className={cn(
            inputVariants({ variant: resolvedVariant, inputSize }),
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            leftAddon && "rounded-l-none",
            rightAddon && "rounded-r-none",
            className
          )}
          ref={ref}
          {...props}
        />

        {/* Right icon */}
        {rightIcon && (
          <div
            className={cn(
              "absolute right-3 flex items-center pointer-events-none",
              isDark ? "text-slate-400" : "text-marble-500"
            )}
          >
            {rightIcon}
          </div>
        )}

        {/* Right addon */}
        {rightAddon && (
          <div
            className={cn(
              "flex items-center justify-center",
              "px-3 h-full",
              "border border-l-0 rounded-r-sm",
              "text-sm",
              isDark
                ? "bg-slate-700 border-slate-600 text-slate-400"
                : "bg-marble-100 border-marble-300 text-marble-600"
            )}
          >
            {rightAddon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
