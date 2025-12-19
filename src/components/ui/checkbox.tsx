"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
> {
  variant?: "default" | "dark";
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, variant = "default", indeterminate, ...props }, ref) => (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer h-5 w-5 shrink-0",
        "rounded-sm border",
        "transition-all duration-fast ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Light mode (Cenotaphery default)
        variant === "default" && [
          "border-marble-400 bg-white",
          "hover:border-marble-500",
          "data-[state=checked]:bg-gold-500 data-[state=checked]:border-gold-500",
          "data-[state=indeterminate]:bg-gold-500 data-[state=indeterminate]:border-gold-500",
          "focus-visible:ring-gold-500 focus-visible:ring-offset-marble-50",
        ],
        // Dark mode (SOIL Scientific)
        variant === "dark" && [
          "border-slate-600 bg-slate-800",
          "hover:border-slate-500",
          "data-[state=checked]:bg-gold-500 data-[state=checked]:border-gold-500",
          "data-[state=indeterminate]:bg-gold-500 data-[state=indeterminate]:border-gold-500",
          "focus-visible:ring-gold-400 focus-visible:ring-offset-slate-900",
        ],
        className
      )}
      checked={indeterminate ? "indeterminate" : props.checked}
      {...props}
    >
      <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
        {indeterminate ? (
          <Minus className="h-3.5 w-3.5 text-marble-950" />
        ) : (
          <Check className="h-3.5 w-3.5 text-marble-950" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

// Checkbox with label wrapper
export interface CheckboxWithLabelProps extends CheckboxProps {
  label: string;
  description?: string;
  labelClassName?: string;
}

const CheckboxWithLabel = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxWithLabelProps
>(({ label, description, variant = "default", labelClassName, ...props }, ref) => {
  const id = React.useId();
  const isDark = variant === "dark";

  return (
    <div className="flex items-start gap-3">
      <Checkbox ref={ref} id={id} variant={variant} {...props} />
      <div className="flex flex-col gap-0.5">
        <label
          htmlFor={id}
          className={cn(
            "text-sm font-medium leading-none cursor-pointer",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            isDark ? "text-marble-200" : "text-marble-800",
            labelClassName
          )}
        >
          {label}
        </label>
        {description && (
          <p className={cn("text-xs", isDark ? "text-slate-400" : "text-marble-500")}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
});
CheckboxWithLabel.displayName = "CheckboxWithLabel";

export { Checkbox, CheckboxWithLabel };
