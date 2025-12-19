"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CommandProps extends React.ComponentPropsWithoutRef<typeof CommandPrimitive> {
  variant?: "default" | "dark";
}

const Command = React.forwardRef<React.ElementRef<typeof CommandPrimitive>, CommandProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <CommandPrimitive
      ref={ref}
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-sm border-0",
        // Use transparent background - parent (Popover) provides the styled background
        variant === "dark" ? "bg-transparent text-marble-100" : "bg-transparent text-marble-950",
        className
      )}
      {...props}
    />
  )
);
Command.displayName = CommandPrimitive.displayName;

export interface CommandInputProps extends React.ComponentPropsWithoutRef<
  typeof CommandPrimitive.Input
> {
  variant?: "default" | "dark";
}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  CommandInputProps
>(({ className, variant = "default", ...props }, ref) => (
  <div
    className="flex items-center px-3 !border-0 !border-none !outline-none !ring-0"
    cmdk-input-wrapper=""
    style={{ border: "none", outline: "none" }}
  >
    <Search
      className={cn(
        "mr-2 h-4 w-4 shrink-0 !border-0",
        variant === "dark" ? "text-slate-400" : "text-marble-400"
      )}
    />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-10 w-full bg-transparent py-2.5 text-sm",
        "!border-0 !border-none !outline-none !ring-0 !shadow-none",
        "focus:!border-0 focus:!ring-0 focus:!outline-none focus:!shadow-none",
        "focus-visible:!ring-0 focus-visible:!outline-none",
        variant === "dark"
          ? "placeholder:text-slate-400 text-marble-100"
          : "placeholder:text-marble-400 text-marble-950",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      style={{ border: "none", outline: "none", boxShadow: "none" }}
      {...props}
    />
  </div>
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden border-0", className)}
    {...props}
  />
));
CommandList.displayName = CommandPrimitive.List.displayName;

export interface CommandEmptyProps extends React.ComponentPropsWithoutRef<
  typeof CommandPrimitive.Empty
> {
  variant?: "default" | "dark";
}

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  CommandEmptyProps
>(({ className, variant = "default", ...props }, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className={cn(
      "py-6 text-center text-sm",
      variant === "dark" ? "text-slate-400" : "text-marble-500",
      className
    )}
    {...props}
  />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

export interface CommandGroupProps extends React.ComponentPropsWithoutRef<
  typeof CommandPrimitive.Group
> {
  variant?: "default" | "dark";
}

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  CommandGroupProps
>(({ className, variant = "default", ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 border-0",
      variant === "dark"
        ? "[&_[cmdk-group-heading]]:text-slate-400"
        : "[&_[cmdk-group-heading]]:text-marble-500",
      "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
      className
    )}
    {...props}
  />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

export interface CommandSeparatorProps extends React.ComponentPropsWithoutRef<
  typeof CommandPrimitive.Separator
> {
  variant?: "default" | "dark";
}

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  CommandSeparatorProps
>(({ className, variant = "default", ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 h-px", variant === "dark" ? "bg-slate-700" : "bg-marble-200", className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

export interface CommandItemProps extends React.ComponentPropsWithoutRef<
  typeof CommandPrimitive.Item
> {
  variant?: "default" | "dark";
}

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  CommandItemProps
>(({ className, variant = "default", ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2.5 text-sm outline-none border-0",
      "transition-all duration-150",
      "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
      variant === "dark"
        ? [
            // Dark mode - gold tinted highlight
            "text-marble-200",
            "aria-selected:bg-gradient-to-r aria-selected:from-gold-500/20 aria-selected:to-gold-600/10",
            "aria-selected:text-gold-200",
            "data-[selected=true]:bg-gradient-to-r data-[selected=true]:from-gold-500/20 data-[selected=true]:to-gold-600/10",
          ]
        : [
            // Light mode - gold gradient highlight
            "text-marble-700",
            "aria-selected:bg-gradient-to-r aria-selected:from-gold-100 aria-selected:to-gold-50/50",
            "aria-selected:text-marble-950",
            "data-[selected=true]:bg-gradient-to-r data-[selected=true]:from-gold-100 data-[selected=true]:to-gold-50/50",
          ],
      className
    )}
    {...props}
  />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className={cn("ml-auto text-xs tracking-widest text-marble-400", className)} {...props} />
  );
};
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
