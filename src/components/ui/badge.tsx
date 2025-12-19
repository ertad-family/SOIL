"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  // Base styles - Roman marble tablet aesthetic
  [
    "inline-flex items-center justify-center",
    "rounded-[2px]",
    "font-serif font-medium tracking-[0.15em] uppercase",
    "transition-all duration-200",
  ],
  {
    variants: {
      variant: {
        // === DARK THEME VARIANTS (for dark backgrounds) ===

        // Dark Primary: Light marble tablet with gold inlay text
        "dark-marble": [
          "bg-[linear-gradient(160deg,#f8f6f3_0%,#f2efe9_30%,#e8e4dd_45%,#f2efe9_55%,#f8f6f3_70%,#e8e4dd_85%,#f2efe9_100%)]",
          "text-[#6b5a42] font-medium",
          "border border-[#d4cfc5]",
          "shadow-[0_1px_3px_rgba(0,0,0,0.2),0_2px_6px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.8)]",
        ],
        // Dark Outline: Marble border on transparent
        "dark-outline": ["bg-transparent", "text-[#f2efe9]", "border border-[#d4cfc5]"],
        // Dark Ghost: Minimal
        "dark-ghost": ["bg-transparent", "text-[#d4cfc5]", "border border-transparent"],
        // Dark Success: Green-tinted marble
        "dark-success": [
          "bg-[linear-gradient(160deg,#e8ebe8_0%,#dfe5df_30%,#d4dcd4_50%,#dfe5df_70%,#e8ebe8_100%)]",
          "text-[#4a5d4a]",
          "border border-[#c4cfc4]",
          "shadow-[0_1px_3px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.8)]",
        ],
        // Dark Warning: Amber-tinted marble
        "dark-warning": [
          "bg-[linear-gradient(160deg,#f5f0e8_0%,#ede5d8_30%,#e5dccb_50%,#ede5d8_70%,#f5f0e8_100%)]",
          "text-[#7d6b4a]",
          "border border-[#d4c9b0]",
          "shadow-[0_1px_3px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.8)]",
        ],
        // Dark Error: Rose-tinted marble
        "dark-error": [
          "bg-[linear-gradient(160deg,#f5e8e8_0%,#eddcdc_30%,#e5d0d0_50%,#eddcdc_70%,#f5e8e8_100%)]",
          "text-[#6b4a4a]",
          "border border-[#d4bfbf]",
          "shadow-[0_1px_3px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.8)]",
        ],
        // Dark Verified: Gold with glow
        "dark-verified": [
          "bg-[linear-gradient(135deg,#d4b978_0%,#c4a15a_30%,#b8934a_50%,#c4a15a_70%,#d4b978_100%)]",
          "text-[#2d2a26] font-semibold",
          "border border-[rgba(212,185,120,0.5)]",
          "shadow-[0_0_8px_rgba(196,161,90,0.4),0_2px_4px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)]",
        ],

        // === LIGHT THEME VARIANTS (for light backgrounds) ===

        // Light Primary: Dark marble tablet
        "light-marble": [
          "bg-[linear-gradient(135deg,#3d3a36_0%,#2d2a26_25%,#3d3a36_50%,#4a4640_75%,#2d2a26_100%)]",
          "text-[#f2efe9]",
          "border border-transparent",
          "shadow-[0_1px_3px_rgba(0,0,0,0.3),0_2px_6px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.08)]",
        ],
        // Light Outline: Dark border on transparent
        "light-outline": ["bg-transparent", "text-[#2d2a26]", "border border-[#4a4640]"],
        // Light Ghost: Minimal
        "light-ghost": ["bg-transparent", "text-[#4a4640]", "border border-transparent"],
        // Light Success: Dark green marble
        "light-success": [
          "bg-[linear-gradient(135deg,#4a5d4a_0%,#3d4d3d_25%,#4a5d4a_50%,#526352_75%,#3d4d3d_100%)]",
          "text-[#e8ebe8]",
          "border border-transparent",
          "shadow-[0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]",
        ],
        // Light Warning: Dark amber marble
        "light-warning": [
          "bg-[linear-gradient(135deg,#7d6b4a_0%,#6b5a3d_25%,#7d6b4a_50%,#8a7552_75%,#6b5a3d_100%)]",
          "text-[#f5f0e8]",
          "border border-transparent",
          "shadow-[0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]",
        ],
        // Light Error: Dark rose marble
        "light-error": [
          "bg-[linear-gradient(135deg,#6b4a4a_0%,#5a3d3d_25%,#6b4a4a_50%,#7a5252_75%,#5a3d3d_100%)]",
          "text-[#f5e8e8]",
          "border border-transparent",
          "shadow-[0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]",
        ],
        // Light Verified: Gold (same for both themes)
        "light-verified": [
          "bg-[linear-gradient(135deg,#d4b978_0%,#c4a15a_30%,#b8934a_50%,#c4a15a_70%,#d4b978_100%)]",
          "text-[#2d2a26] font-semibold",
          "border border-[rgba(212,185,120,0.3)]",
          "shadow-[0_0_8px_rgba(196,161,90,0.3),0_2px_4px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.3)]",
        ],

        // === LEGACY VARIANTS (kept for backward compatibility) ===
        default: [
          "bg-gradient-to-b from-marble-100 to-marble-200",
          "text-marble-700",
          "border border-marble-300/80",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_1px_2px_rgba(0,0,0,0.05)]",
        ],
        gold: [
          "bg-gradient-to-b from-gold-100 to-gold-200",
          "text-gold-800",
          "border border-gold-300/80",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_1px_2px_rgba(196,161,90,0.1)]",
        ],
        success: [
          "bg-gradient-to-b from-success-100 to-success-200",
          "text-success-700",
          "border border-success-300/80",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_1px_2px_rgba(34,197,94,0.1)]",
        ],
        warning: [
          "bg-gradient-to-b from-warning-100 to-warning-200",
          "text-warning-800",
          "border border-warning-300/80",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_1px_2px_rgba(245,158,11,0.1)]",
        ],
        error: [
          "bg-gradient-to-b from-error-100 to-error-200",
          "text-error-700",
          "border border-error-300/80",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_1px_2px_rgba(239,68,68,0.1)]",
        ],
        info: [
          "bg-gradient-to-b from-info-100 to-info-200",
          "text-info-700",
          "border border-info-300/80",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_1px_2px_rgba(59,130,246,0.1)]",
        ],
        dark: [
          "bg-gradient-to-b from-slate-600 to-slate-700",
          "text-marble-200",
          "border border-slate-500/50",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.2)]",
        ],
        "dark-gold": [
          "bg-gradient-to-b from-gold-500/20 to-gold-600/20",
          "text-gold-300",
          "border border-gold-500/40",
          "shadow-[inset_0_1px_0_rgba(196,161,90,0.1),0_1px_2px_rgba(0,0,0,0.2)]",
        ],
        "dark-info": [
          "bg-gradient-to-b from-info-500/20 to-info-600/20",
          "text-info-300",
          "border border-info-500/40",
          "shadow-[inset_0_1px_0_rgba(59,130,246,0.1),0_1px_2px_rgba(0,0,0,0.2)]",
        ],
        "solid-gold": [
          "bg-gradient-to-b from-gold-400 to-gold-500",
          "text-marble-950 font-semibold",
          "border border-gold-600/30",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_3px_rgba(196,161,90,0.3)]",
        ],
        "solid-success": [
          "bg-gradient-to-b from-success-400 to-success-500",
          "text-white font-semibold",
          "border border-success-600/30",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_3px_rgba(34,197,94,0.3)]",
        ],
        "solid-error": [
          "bg-gradient-to-b from-error-400 to-error-500",
          "text-white font-semibold",
          "border border-error-600/30",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_3px_rgba(239,68,68,0.3)]",
        ],
        "dark-solid-gold": [
          "bg-gradient-to-b from-gold-400 to-gold-500",
          "text-slate-900 font-semibold",
          "border border-gold-300/30",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_4px_rgba(196,161,90,0.4)]",
        ],
        verified: [
          "bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600",
          "text-marble-950 font-semibold",
          "border border-gold-400/50",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_2px_8px_rgba(196,161,90,0.4),0_0_12px_rgba(196,161,90,0.2)]",
        ],
      },
      size: {
        sm: "text-[9px] px-2 py-1",
        md: "text-[10px] px-3 py-1.5",
        lg: "text-[11px] px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "dark-marble",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  dot?: boolean;
  dotColor?: string;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, dot, dotColor, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(badgeVariants({ variant, size, className }))} {...props}>
        {dot && (
          <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", dotColor || "bg-current")} />
        )}
        {children}
      </div>
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
