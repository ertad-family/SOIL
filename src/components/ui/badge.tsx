'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  // Base styles - Roman Heritage: elegant with depth
  [
    'inline-flex items-center justify-center',
    'rounded-sm',
    'font-ui font-medium tracking-wide uppercase',
    'transition-all duration-200',
  ],
  {
    variants: {
      variant: {
        // Light mode (Cenotaphery default) - Subtle gradient with embossed effect
        default: [
          'bg-gradient-to-b from-marble-100 to-marble-200',
          'text-marble-700',
          'border border-marble-300/80',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_1px_2px_rgba(0,0,0,0.05)]',
        ],
        gold: [
          'bg-gradient-to-b from-gold-100 to-gold-200',
          'text-gold-800',
          'border border-gold-300/80',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_1px_2px_rgba(196,161,90,0.1)]',
        ],
        success: [
          'bg-gradient-to-b from-success-100 to-success-200',
          'text-success-700',
          'border border-success-300/80',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_1px_2px_rgba(34,197,94,0.1)]',
        ],
        warning: [
          'bg-gradient-to-b from-warning-100 to-warning-200',
          'text-warning-800',
          'border border-warning-300/80',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_1px_2px_rgba(245,158,11,0.1)]',
        ],
        error: [
          'bg-gradient-to-b from-error-100 to-error-200',
          'text-error-700',
          'border border-error-300/80',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_1px_2px_rgba(239,68,68,0.1)]',
        ],
        info: [
          'bg-gradient-to-b from-info-100 to-info-200',
          'text-info-700',
          'border border-info-300/80',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_1px_2px_rgba(59,130,246,0.1)]',
        ],

        // Solid variants (light mode) - Gradient with carved depth
        'solid-gold': [
          'bg-gradient-to-b from-gold-400 to-gold-500',
          'text-marble-950 font-semibold',
          'border border-gold-600/30',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_3px_rgba(196,161,90,0.3)]',
        ],
        'solid-success': [
          'bg-gradient-to-b from-success-400 to-success-500',
          'text-white font-semibold',
          'border border-success-600/30',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_3px_rgba(34,197,94,0.3)]',
        ],
        'solid-error': [
          'bg-gradient-to-b from-error-400 to-error-500',
          'text-white font-semibold',
          'border border-error-600/30',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_3px_rgba(239,68,68,0.3)]',
        ],

        // Dark mode variants - Visible on dark backgrounds with colored tints
        dark: [
          'bg-gradient-to-b from-slate-600 to-slate-700',
          'text-marble-200',
          'border border-slate-500/50',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.2)]',
        ],
        'dark-gold': [
          'bg-gradient-to-b from-gold-500/20 to-gold-600/20',
          'text-gold-300',
          'border border-gold-500/40',
          'shadow-[inset_0_1px_0_rgba(196,161,90,0.1),0_1px_2px_rgba(0,0,0,0.2)]',
        ],
        'dark-success': [
          'bg-gradient-to-b from-success-500/20 to-success-600/20',
          'text-success-300',
          'border border-success-500/40',
          'shadow-[inset_0_1px_0_rgba(34,197,94,0.1),0_1px_2px_rgba(0,0,0,0.2)]',
        ],
        'dark-warning': [
          'bg-gradient-to-b from-warning-500/20 to-warning-600/20',
          'text-warning-300',
          'border border-warning-500/40',
          'shadow-[inset_0_1px_0_rgba(245,158,11,0.1),0_1px_2px_rgba(0,0,0,0.2)]',
        ],
        'dark-error': [
          'bg-gradient-to-b from-error-500/20 to-error-600/20',
          'text-error-300',
          'border border-error-500/40',
          'shadow-[inset_0_1px_0_rgba(239,68,68,0.1),0_1px_2px_rgba(0,0,0,0.2)]',
        ],
        'dark-info': [
          'bg-gradient-to-b from-info-500/20 to-info-600/20',
          'text-info-300',
          'border border-info-500/40',
          'shadow-[inset_0_1px_0_rgba(59,130,246,0.1),0_1px_2px_rgba(0,0,0,0.2)]',
        ],

        // Solid dark variants
        'dark-solid-gold': [
          'bg-gradient-to-b from-gold-400 to-gold-500',
          'text-slate-900 font-semibold',
          'border border-gold-300/30',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_4px_rgba(196,161,90,0.4)]',
        ],

        // Special: Cenotaph verified badge - Premium glow
        verified: [
          'bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600',
          'text-marble-950 font-semibold',
          'border border-gold-400/50',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_2px_8px_rgba(196,161,90,0.4),0_0_12px_rgba(196,161,90,0.2)]',
        ],
      },
      size: {
        sm: 'text-[10px] px-1.5 py-0.5',
        md: 'text-[11px] px-2.5 py-1',
        lg: 'text-xs px-3 py-1.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
  dotColor?: string
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, dot, dotColor, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'w-1.5 h-1.5 rounded-full mr-1.5',
              dotColor || 'bg-current'
            )}
          />
        )}
        {children}
      </div>
    )
  }
)
Badge.displayName = 'Badge'

export { Badge, badgeVariants }
