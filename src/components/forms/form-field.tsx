"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  label?: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  variant?: "default" | "dark";
  children: React.ReactNode;
  className?: string;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, htmlFor, required, error, hint, variant = "default", children, className }, ref) => {
    const isDark = variant === "dark";

    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        {label && (
          <Label htmlFor={htmlFor} variant={variant} required={required}>
            {label}
          </Label>
        )}
        {children}
        {error && (
          <p className="text-sm text-error-500 flex items-center gap-1.5">
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p className={cn("text-sm", isDark ? "text-slate-400" : "text-marble-500")}>{hint}</p>
        )}
      </div>
    );
  }
);
FormField.displayName = "FormField";

// Form Section - groups related fields
export interface FormSectionProps {
  title?: string;
  description?: string;
  variant?: "default" | "dark";
  children: React.ReactNode;
  className?: string;
}

const FormSection = React.forwardRef<HTMLDivElement, FormSectionProps>(
  ({ title, description, variant = "default", children, className }, ref) => {
    const isDark = variant === "dark";

    return (
      <div ref={ref} className={cn("space-y-6", className)}>
        {(title || description) && (
          <div className="space-y-1">
            {title && (
              <h3
                className={cn(
                  "font-serif text-lg font-medium tracking-wide",
                  isDark ? "text-marble-100" : "text-marble-950"
                )}
              >
                {title}
              </h3>
            )}
            {description && (
              <p className={cn("text-sm", isDark ? "text-slate-400" : "text-marble-600")}>
                {description}
              </p>
            )}
          </div>
        )}
        <div className="space-y-4">{children}</div>
      </div>
    );
  }
);
FormSection.displayName = "FormSection";

// Form Actions - button container at end of forms
export interface FormActionsProps {
  align?: "left" | "right" | "center" | "between";
  children: React.ReactNode;
  className?: string;
}

const FormActions = React.forwardRef<HTMLDivElement, FormActionsProps>(
  ({ align = "right", children, className }, ref) => {
    const alignments = {
      left: "justify-start",
      right: "justify-end",
      center: "justify-center",
      between: "justify-between",
    };

    return (
      <div
        ref={ref}
        className={cn("flex flex-wrap items-center gap-3 pt-6", alignments[align], className)}
      >
        {children}
      </div>
    );
  }
);
FormActions.displayName = "FormActions";

// Inline form field layout
export interface InlineFieldsProps {
  children: React.ReactNode;
  className?: string;
}

const InlineFields = React.forwardRef<HTMLDivElement, InlineFieldsProps>(
  ({ children, className }, ref) => {
    return (
      <div ref={ref} className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
        {children}
      </div>
    );
  }
);
InlineFields.displayName = "InlineFields";

export { FormField, FormSection, FormActions, InlineFields };
