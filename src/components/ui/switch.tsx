"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  variant?: "default" | "dark";
  size?: "sm" | "md" | "lg";
}

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const isDark = variant === "dark";

    const sizes = {
      sm: {
        root: "h-5 w-9",
        thumb: "h-4 w-4 data-[state=checked]:translate-x-4",
      },
      md: {
        root: "h-6 w-11",
        thumb: "h-5 w-5 data-[state=checked]:translate-x-5",
      },
      lg: {
        root: "h-7 w-14",
        thumb: "h-6 w-6 data-[state=checked]:translate-x-7",
      },
    };

    return (
      <SwitchPrimitive.Root
        className={cn(
          "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
          "transition-all duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          sizes[size].root,
          isDark
            ? [
                "bg-slate-600",
                "data-[state=checked]:bg-gold-500",
                "focus-visible:ring-gold-500/50 focus-visible:ring-offset-slate-900",
              ]
            : [
                "bg-marble-300",
                "data-[state=checked]:bg-gold-500",
                "focus-visible:ring-gold-500/50 focus-visible:ring-offset-marble-100",
              ],
          className
        )}
        {...props}
        ref={ref}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            "pointer-events-none block rounded-full shadow-lg ring-0",
            "transition-transform duration-200 ease-out",
            "data-[state=unchecked]:translate-x-0",
            sizes[size].thumb,
            isDark ? "bg-marble-100" : "bg-white"
          )}
        />
      </SwitchPrimitive.Root>
    );
  }
);
Switch.displayName = SwitchPrimitive.Root.displayName;

// Switch with label wrapper
export interface SwitchWithLabelProps extends SwitchProps {
  label: string;
  description?: string;
  labelClassName?: string;
  labelPosition?: "left" | "right";
}

const SwitchWithLabel = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchWithLabelProps
>(
  (
    { label, description, variant = "default", labelClassName, labelPosition = "right", ...props },
    ref
  ) => {
    const id = React.useId();
    const isDark = variant === "dark";

    const labelContent = (
      <div className="flex flex-col gap-0.5">
        <label
          htmlFor={id}
          className={cn(
            "text-sm font-medium leading-none cursor-pointer",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            isDark ? "text-marble-100" : "text-marble-800",
            labelClassName
          )}
        >
          {label}
        </label>
        {description && (
          <p className={cn("text-xs", isDark ? "text-slate-500" : "text-marble-500")}>
            {description}
          </p>
        )}
      </div>
    );

    return (
      <div className="flex items-center gap-3">
        {labelPosition === "left" && labelContent}
        <Switch ref={ref} id={id} variant={variant} {...props} />
        {labelPosition === "right" && labelContent}
      </div>
    );
  }
);
SwitchWithLabel.displayName = "SwitchWithLabel";

export { Switch, SwitchWithLabel };
