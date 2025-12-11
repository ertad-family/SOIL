'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cardVariants = cva(
  // Base styles - Modern Roman aesthetic with depth
  [
    'rounded-md',
    'transition-all duration-300 ease-out',
    'relative',
  ],
  {
    variants: {
      variant: {
        // Light mode (Cenotaphery default) - Subtle gradient and layered shadow
        default: [
          'bg-gradient-to-br from-white via-white to-marble-50',
          'border border-marble-300/80',
          'shadow-[0_1px_3px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.03)]',
        ],
        // Elevated - More prominent depth
        elevated: [
          'bg-gradient-to-br from-white via-white to-marble-100',
          'border border-marble-200',
          'shadow-[0_2px_4px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)]',
        ],
        // Ghost - Minimal with subtle border
        ghost: [
          'bg-transparent',
          'border border-marble-300/60',
        ],
        // Glass - Frosted glass with blur
        glass: [
          'bg-white/70 backdrop-blur-xl',
          'border border-white/50',
          'shadow-[0_4px_24px_rgba(0,0,0,0.06)]',
        ],

        // Cenotaph special - Asymmetric gold accent (Roman tablet motif)
        cenotaph: [
          'bg-gradient-to-br from-marble-50 via-marble-50 to-marble-100',
          'border border-marble-300/80',
          'border-l-[3px] border-l-gold-500',
          'shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_24px_rgba(196,161,90,0.08)]',
          // Corner accent via pseudo-element (defined in globals.css)
        ],

        // Dark mode (SOIL Scientific) - Deep layered shadows
        dark: [
          'bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900',
          'border border-slate-700/80',
          'shadow-[0_1px_3px_rgba(0,0,0,0.2),0_4px_12px_rgba(0,0,0,0.15)]',
        ],
        'dark-elevated': [
          'bg-gradient-to-br from-slate-750 via-slate-800 to-slate-850',
          'border border-slate-600',
          'shadow-[0_2px_4px_rgba(0,0,0,0.2),0_8px_32px_rgba(0,0,0,0.25)]',
        ],
        'dark-ghost': [
          'bg-transparent',
          'border border-slate-700/60',
        ],
        'dark-glass': [
          'bg-slate-800/70 backdrop-blur-xl',
          'border border-slate-700/50',
          'shadow-[0_4px_24px_rgba(0,0,0,0.3)]',
        ],

        // Dark mode Cenotaph - Gold accent on dark background
        'dark-cenotaph': [
          'bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900',
          'border border-slate-700/80',
          'border-l-[3px] border-l-gold-500',
          'shadow-[0_2px_8px_rgba(0,0,0,0.2),0_8px_24px_rgba(196,161,90,0.1)]',
        ],
      },
      interactive: {
        true: 'cursor-pointer',
        false: '',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    compoundVariants: [
      // Light mode hover states - Enhanced lift effect
      {
        variant: 'default',
        interactive: true,
        className: [
          'hover:border-marble-400/80',
          'hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_12px_28px_rgba(0,0,0,0.08)]',
          'hover:-translate-y-0.5',
        ],
      },
      {
        variant: 'elevated',
        interactive: true,
        className: [
          'hover:border-marble-300',
          'hover:shadow-[0_4px_8px_rgba(0,0,0,0.06),0_16px_40px_rgba(0,0,0,0.1)]',
          'hover:-translate-y-1',
        ],
      },
      {
        variant: 'cenotaph',
        interactive: true,
        className: [
          'hover:border-l-gold-400',
          'hover:shadow-[0_4px_12px_rgba(0,0,0,0.06),0_12px_32px_rgba(196,161,90,0.15)]',
          'hover:-translate-y-0.5',
        ],
      },
      {
        variant: 'glass',
        interactive: true,
        className: [
          'hover:bg-white/80',
          'hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)]',
          'hover:-translate-y-0.5',
        ],
      },
      // Dark mode hover states
      {
        variant: 'dark',
        interactive: true,
        className: [
          'hover:border-slate-600',
          'hover:shadow-[0_2px_4px_rgba(0,0,0,0.25),0_12px_28px_rgba(0,0,0,0.3)]',
          'hover:-translate-y-0.5',
        ],
      },
      {
        variant: 'dark-elevated',
        interactive: true,
        className: [
          'hover:border-slate-500',
          'hover:shadow-[0_4px_8px_rgba(0,0,0,0.3),0_20px_48px_rgba(0,0,0,0.35)]',
          'hover:-translate-y-1',
        ],
      },
      {
        variant: 'dark-glass',
        interactive: true,
        className: [
          'hover:bg-slate-800/80',
          'hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
          'hover:-translate-y-0.5',
        ],
      },
      {
        variant: 'dark-cenotaph',
        interactive: true,
        className: [
          'hover:border-l-gold-400',
          'hover:shadow-[0_4px_12px_rgba(0,0,0,0.25),0_12px_32px_rgba(196,161,90,0.2)]',
          'hover:-translate-y-0.5',
        ],
      },
    ],
    defaultVariants: {
      variant: 'default',
      interactive: false,
      padding: 'md',
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, interactive, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, interactive, padding, className }))}
      {...props}
    />
  )
)
Card.displayName = 'Card'

// Determine if variant is dark mode
const isDarkVariant = (variant?: string | null) =>
  variant?.startsWith('dark')

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: string | null }
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col space-y-1.5 pb-4',
      className
    )}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & { variant?: string | null }
>(({ className, variant, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'font-serif text-xl font-medium leading-none tracking-wide',
      isDarkVariant(variant) ? 'text-marble-100' : 'text-marble-950',
      className
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { variant?: string | null }
>(({ className, variant, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-sm',
      isDarkVariant(variant) ? 'text-slate-400' : 'text-marble-600',
      className
    )}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: string | null }
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center pt-4',
      isDarkVariant(variant) ? 'border-slate-700' : 'border-marble-300',
      className
    )}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants }
