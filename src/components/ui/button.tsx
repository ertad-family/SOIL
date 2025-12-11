'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base styles - Modern carved stone aesthetic
  [
    'inline-flex items-center justify-center gap-2',
    'font-ui font-medium tracking-wide uppercase',
    'rounded-sm',
    'transition-all duration-300 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:translate-y-[1px]',
    'relative overflow-hidden',
  ],
  {
    variants: {
      variant: {
        // Primary - Gold gradient with carved stone depth
        primary: [
          'bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600',
          'text-marble-950 font-semibold',
          'border border-gold-600/50',
          'shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.2)]',
          'hover:from-gold-500 hover:via-gold-600 hover:to-gold-700',
          'hover:shadow-[0_4px_12px_rgba(196,161,90,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]',
          'active:from-gold-600 active:via-gold-700 active:to-gold-800',
          'focus-visible:ring-gold-500 focus-visible:ring-offset-marble-50',
        ],
        // Secondary - Marble stone with carved effect
        secondary: [
          'bg-gradient-to-b from-marble-100 via-marble-200 to-marble-300',
          'text-marble-800 font-medium',
          'border border-marble-400/50',
          'shadow-[0_2px_4px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.5)]',
          'hover:from-marble-200 hover:via-marble-300 hover:to-marble-400',
          'hover:shadow-[0_4px_8px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)]',
          'active:from-marble-300 active:via-marble-400 active:to-marble-500',
          'focus-visible:ring-gold-500 focus-visible:ring-offset-marble-50',
        ],
        // Ghost - Minimal with gold accent on hover
        ghost: [
          'bg-transparent text-gold-600',
          'border border-transparent',
          'hover:bg-gold-50 hover:border-gold-200/50',
          'active:bg-gold-100',
          'focus-visible:ring-gold-500 focus-visible:ring-offset-marble-50',
        ],
        // Outline - Clean bordered with subtle depth
        outline: [
          'bg-transparent text-marble-700',
          'border-2 border-marble-300',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]',
          'hover:bg-marble-50 hover:border-marble-400',
          'hover:shadow-[0_2px_4px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.5)]',
          'active:bg-marble-100',
          'focus-visible:ring-gold-500 focus-visible:ring-offset-marble-50',
        ],
        // Destructive - Error with carved depth
        destructive: [
          'bg-gradient-to-b from-error-400 via-error-500 to-error-600',
          'text-white font-semibold',
          'border border-error-700/50',
          'shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.2)]',
          'hover:from-error-500 hover:via-error-600 hover:to-error-700',
          'hover:shadow-[0_4px_8px_rgba(239,68,68,0.3)]',
          'active:from-error-600 active:via-error-700 active:to-error-800',
          'focus-visible:ring-error-500 focus-visible:ring-offset-marble-50',
        ],
        // Link - Text only with underline animation
        link: [
          'bg-transparent text-gold-600',
          'hover:text-gold-700',
          'focus-visible:ring-gold-500 focus-visible:ring-offset-marble-50',
          'p-0 h-auto',
          'after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-gold-500',
          'after:transition-all after:duration-300',
          'hover:after:w-full',
        ],

        // === Dark Mode Variants (SOIL Scientific) ===
        'dark-primary': [
          'bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600',
          'text-slate-900 font-semibold',
          'border border-gold-500/50',
          'shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]',
          'hover:from-gold-300 hover:via-gold-400 hover:to-gold-500',
          'hover:shadow-[0_4px_16px_rgba(196,161,90,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]',
          'active:from-gold-500 active:via-gold-600 active:to-gold-700',
          'focus-visible:ring-gold-400 focus-visible:ring-offset-slate-900',
        ],
        'dark-secondary': [
          'bg-gradient-to-b from-slate-600 via-slate-700 to-slate-800',
          'text-marble-200 font-medium',
          'border border-slate-500/50',
          'shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]',
          'hover:from-slate-500 hover:via-slate-600 hover:to-slate-700',
          'hover:shadow-[0_4px_8px_rgba(0,0,0,0.4)]',
          'active:from-slate-700 active:via-slate-800 active:to-slate-900',
          'focus-visible:ring-gold-400 focus-visible:ring-offset-slate-900',
        ],
        'dark-ghost': [
          'bg-transparent text-gold-400',
          'border border-transparent',
          'hover:bg-slate-800 hover:border-slate-700',
          'active:bg-slate-700',
          'focus-visible:ring-gold-400 focus-visible:ring-offset-slate-900',
        ],
        'dark-outline': [
          'bg-transparent text-marble-200',
          'border-2 border-slate-600',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]',
          'hover:bg-slate-800/50 hover:border-slate-500',
          'active:bg-slate-700',
          'focus-visible:ring-gold-400 focus-visible:ring-offset-slate-900',
        ],

        // === Cenotaph Special Variant - Premium gold with glow ===
        cenotaph: [
          'bg-gradient-to-b from-gold-300 via-gold-500 to-gold-600',
          'text-marble-950 font-semibold',
          'border border-gold-400/50',
          'shadow-[0_2px_8px_rgba(196,161,90,0.3),inset_0_1px_0_rgba(255,255,255,0.3)]',
          'hover:from-gold-200 hover:via-gold-400 hover:to-gold-500',
          'hover:shadow-[0_4px_20px_rgba(196,161,90,0.5),inset_0_1px_0_rgba(255,255,255,0.4)]',
          'active:from-gold-400 active:via-gold-600 active:to-gold-700',
          'focus-visible:ring-gold-500 focus-visible:ring-offset-marble-50',
        ],
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10 p-0',
        'icon-sm': 'h-8 w-8 p-0',
        'icon-lg': 'h-12 w-12 p-0',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
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
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
