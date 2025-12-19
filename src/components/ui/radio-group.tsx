"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RadioGroupProps extends React.ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Root
> {
  variant?: "default" | "dark";
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn("grid gap-3", className)} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export interface RadioGroupItemProps extends React.ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Item
> {
  variant?: "default" | "dark";
}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, variant = "default", ...props }, ref) => {
  const isDark = variant === "dark";

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-5 w-5 rounded-full border",
        "transition-all duration-200 ease-out",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        isDark
          ? [
              "border-slate-600 bg-slate-800",
              "text-gold-500",
              "focus-visible:ring-gold-500/50 focus-visible:ring-offset-slate-900",
              "hover:border-slate-500",
              "data-[state=checked]:border-gold-500",
            ]
          : [
              "border-marble-300 bg-white",
              "text-gold-500",
              "focus-visible:ring-gold-500/50 focus-visible:ring-offset-marble-100",
              "hover:border-marble-400",
              "data-[state=checked]:border-gold-500",
            ],
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

// Radio with label wrapper
export interface RadioGroupItemWithLabelProps extends RadioGroupItemProps {
  label: string;
  description?: string;
  labelClassName?: string;
}

const RadioGroupItemWithLabel = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemWithLabelProps
>(({ label, description, variant = "default", labelClassName, value, ...props }, ref) => {
  const isDark = variant === "dark";

  return (
    <div className="flex items-start gap-3">
      <RadioGroupItem ref={ref} value={value} variant={variant} {...props} />
      <div className="flex flex-col gap-0.5">
        <label
          htmlFor={value}
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
    </div>
  );
});
RadioGroupItemWithLabel.displayName = "RadioGroupItemWithLabel";

export { RadioGroup, RadioGroupItem, RadioGroupItemWithLabel };
