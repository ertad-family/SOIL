"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles - Roman marble aesthetic
  [
    "inline-flex items-center justify-center gap-3",
    "font-serif font-medium tracking-[0.2em] uppercase",
    "rounded-[3px]",
    "transition-all duration-300 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:translate-y-[1px]",
    "relative overflow-hidden",
    "cursor-pointer",
  ],
  {
    variants: {
      variant: {
        // Primary - Gold gradient with carved stone depth
        primary: [
          "bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600",
          "text-marble-950 font-semibold",
          "border border-gold-600/50",
          "shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.2)]",
          "hover:from-gold-500 hover:via-gold-600 hover:to-gold-700",
          "hover:shadow-[0_4px_12px_rgba(196,161,90,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]",
          "active:from-gold-600 active:via-gold-700 active:to-gold-800",
          "focus-visible:ring-gold-500 focus-visible:ring-offset-marble-50",
        ],
        // Secondary - Marble stone with carved effect
        secondary: [
          "bg-gradient-to-b from-marble-100 via-marble-200 to-marble-300",
          "text-marble-800 font-medium",
          "border border-marble-400/50",
          "shadow-[0_2px_4px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.5)]",
          "hover:from-marble-200 hover:via-marble-300 hover:to-marble-400",
          "hover:shadow-[0_4px_8px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)]",
          "active:from-marble-300 active:via-marble-400 active:to-marble-500",
          "focus-visible:ring-gold-500 focus-visible:ring-offset-marble-50",
        ],
        // Ghost - Minimal with gold accent on hover
        ghost: [
          "bg-transparent text-gold-600",
          "border border-transparent",
          "hover:bg-gold-50 hover:border-gold-200/50",
          "active:bg-gold-100",
          "focus-visible:ring-gold-500 focus-visible:ring-offset-marble-50",
        ],
        // Outline - Clean bordered with subtle depth
        outline: [
          "bg-transparent text-marble-700",
          "border-2 border-marble-300",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]",
          "hover:bg-marble-50 hover:border-marble-400",
          "hover:shadow-[0_2px_4px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.5)]",
          "active:bg-marble-100",
          "focus-visible:ring-gold-500 focus-visible:ring-offset-marble-50",
        ],
        // Destructive - Error with carved depth
        destructive: [
          "bg-gradient-to-b from-error-400 via-error-500 to-error-600",
          "text-white font-semibold",
          "border border-error-700/50",
          "shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.2)]",
          "hover:from-error-500 hover:via-error-600 hover:to-error-700",
          "hover:shadow-[0_4px_8px_rgba(239,68,68,0.3)]",
          "active:from-error-600 active:via-error-700 active:to-error-800",
          "focus-visible:ring-error-500 focus-visible:ring-offset-marble-50",
        ],
        // Link - Text only with underline animation
        link: [
          "bg-transparent text-gold-600",
          "hover:text-gold-700",
          "focus-visible:ring-gold-500 focus-visible:ring-offset-marble-50",
          "p-0 h-auto",
          "after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-gold-500",
          "after:transition-all after:duration-300",
          "hover:after:w-full",
        ],

        // === Dark Mode Variants (SOIL Scientific) ===
        // Dark Primary - Marble with gold inlay text (Concept 2 from buttons-demo)
        "dark-primary": [
          "bg-[linear-gradient(160deg,#f8f6f3_0%,#f2efe9_30%,#e8e4dd_45%,#f2efe9_55%,#f8f6f3_70%,#e8e4dd_85%,#f2efe9_100%)]",
          "text-[#6b5a42] font-semibold",
          "border border-[#d4cfc5]",
          "shadow-[0_3px_8px_rgba(0,0,0,0.18),0_6px_20px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]",
          "hover:border-[#b8b0a3]",
          "hover:shadow-[0_4px_12px_rgba(0,0,0,0.22),0_8px_28px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.9)]",
          "active:shadow-[0_1px_4px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.9)]",
          "focus-visible:ring-[#8b7355] focus-visible:ring-offset-slate-900",
          // Shine effect via btn-marble-shine class
          "btn-marble-shine",
        ],
        // Dark Secondary - Outline style (marble border on dark bg)
        "dark-secondary": [
          "bg-transparent",
          "text-[#f2efe9]",
          "border-2 border-[#d4cfc5]",
          "hover:bg-[#f2efe9] hover:text-[#2d2a26] hover:border-[#f2efe9]",
          "active:bg-[#e8e4dd]",
          "focus-visible:ring-[#d4cfc5] focus-visible:ring-offset-slate-900",
        ],
        "dark-ghost": [
          "bg-transparent text-[#d4cfc5]",
          "border border-transparent",
          "hover:text-[#f2efe9]",
          "after:absolute after:bottom-2 after:left-1/2 after:-translate-x-1/2",
          "after:w-0 after:h-[1px] after:bg-[#f2efe9]",
          "after:transition-all after:duration-300",
          "hover:after:w-[60%]",
          "focus-visible:ring-[#d4cfc5] focus-visible:ring-offset-slate-900",
        ],
        "dark-outline": [
          "bg-transparent text-[#f2efe9]",
          "border-2 border-[#d4cfc5]",
          "hover:bg-[#f2efe9] hover:text-[#2d2a26] hover:border-[#f2efe9]",
          "active:bg-[#e8e4dd]",
          "focus-visible:ring-[#d4cfc5] focus-visible:ring-offset-slate-900",
        ],

        // === Marble Button - Dark stone with polished shine ===
        // Marble - Dark polished stone, used for accent contrast on dark backgrounds
        marble: [
          "bg-[linear-gradient(135deg,#3d3a36_0%,#2d2a26_25%,#3d3a36_50%,#4a4640_75%,#2d2a26_100%)]",
          "text-[#f2efe9] font-semibold",
          "border border-transparent",
          "shadow-[0_2px_4px_rgba(0,0,0,0.3),0_4px_12px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]",
          "hover:bg-[linear-gradient(135deg,#4a4640_0%,#3d3a36_25%,#4a4640_50%,#5a5650_75%,#3d3a36_100%)]",
          "hover:shadow-[0_4px_8px_rgba(0,0,0,0.35),0_8px_20px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.1)]",
          "active:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]",
          "focus-visible:ring-[#4a4640] focus-visible:ring-offset-[#f2efe9]",
          // Shine effect
          "btn-marble-dark-shine",
        ],
        // === Cenotaph Special Variant - Premium gold with glow ===
        cenotaph: [
          "bg-gradient-to-b from-gold-300 via-gold-500 to-gold-600",
          "text-marble-950 font-semibold",
          "border border-gold-400/50",
          "shadow-[0_2px_8px_rgba(196,161,90,0.3),inset_0_1px_0_rgba(255,255,255,0.3)]",
          "hover:from-gold-200 hover:via-gold-400 hover:to-gold-500",
          "hover:shadow-[0_4px_20px_rgba(196,161,90,0.5),inset_0_1px_0_rgba(255,255,255,0.4)]",
          "active:from-gold-400 active:via-gold-600 active:to-gold-700",
          "focus-visible:ring-gold-500 focus-visible:ring-offset-marble-50",
        ],
      },
      size: {
        sm: "py-2.5 px-5 text-[10px]",
        md: "py-4 px-9 text-xs",
        lg: "py-5 px-12 text-[13px]",
        xl: "py-6 px-14 text-sm",
        icon: "h-10 w-10 p-0",
        "icon-sm": "h-8 w-8 p-0",
        "icon-lg": "h-12 w-12 p-0",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    // When asChild is true, Slot expects a single child element.
    // Icons and loading state are only supported for non-asChild buttons.
    const renderContent = () => {
      if (asChild) {
        // Pass children directly to Slot - it will merge props with the child
        return children;
      }

      if (isLoading) {
        return (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{children}</span>
          </>
        );
      }

      return (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      );
    };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {renderContent()}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
