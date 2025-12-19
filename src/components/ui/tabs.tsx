"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

export interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  variant?: "default" | "dark";
}

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const isDark = variant === "dark";

    return (
      <TabsPrimitive.List
        ref={ref}
        className={cn(
          "inline-flex h-11 items-center justify-center rounded-sm p-1 gap-1",
          isDark
            ? [
                "bg-gradient-to-b from-slate-800 to-slate-900",
                "border border-slate-700/50",
                "shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.05)]",
                "text-slate-400",
              ]
            : [
                "bg-gradient-to-b from-marble-100 to-marble-200",
                "border border-marble-300/50",
                "shadow-[inset_0_1px_2px_rgba(0,0,0,0.05),0_1px_0_rgba(255,255,255,0.8)]",
                "text-marble-600",
              ],
          className
        )}
        {...props}
      />
    );
  }
);
TabsList.displayName = TabsPrimitive.List.displayName;

export interface TabsTriggerProps extends React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Trigger
> {
  variant?: "default" | "dark";
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant = "default", ...props }, ref) => {
  const isDark = variant === "dark";

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap",
        "rounded-sm px-4 py-1.5",
        "text-sm font-ui font-medium tracking-wide",
        "ring-offset-background",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        isDark
          ? [
              // Inactive state - subtle
              "hover:text-marble-200 hover:bg-slate-700/50",
              // Active state - raised with gradient
              "data-[state=active]:bg-gradient-to-b data-[state=active]:from-slate-600 data-[state=active]:to-slate-700",
              "data-[state=active]:text-marble-100",
              "data-[state=active]:border data-[state=active]:border-slate-500/50",
              "data-[state=active]:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.3)]",
              "focus-visible:ring-gold-400 focus-visible:ring-offset-slate-900",
            ]
          : [
              // Inactive state - subtle
              "hover:text-marble-800 hover:bg-marble-50/80",
              // Active state - raised with gradient and gold accent
              "data-[state=active]:bg-gradient-to-b data-[state=active]:from-white data-[state=active]:to-marble-50",
              "data-[state=active]:text-marble-950",
              "data-[state=active]:border data-[state=active]:border-marble-200/80",
              "data-[state=active]:border-b-gold-500 data-[state=active]:border-b-2",
              "data-[state=active]:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.08)]",
              "focus-visible:ring-gold-500 focus-visible:ring-offset-marble-100",
            ],
        className
      )}
      {...props}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export interface TabsContentProps extends React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Content
> {
  variant?: "default" | "dark";
}

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, variant = "default", ...props }, ref) => {
  const isDark = variant === "dark";

  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "mt-4 ring-offset-background",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        isDark
          ? "focus-visible:ring-gold-500 focus-visible:ring-offset-slate-900"
          : "focus-visible:ring-gold-500 focus-visible:ring-offset-marble-100",
        className
      )}
      {...props}
    />
  );
});
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
