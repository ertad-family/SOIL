'use client'

import * as React from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { cva, type VariantProps } from 'class-variance-authority'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

const ToastProvider = ToastPrimitive.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-3 p-4',
      'sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitive.Viewport.displayName

const toastVariants = cva(
  // Base styles - Glassmorphic with visible glass effect
  [
    'group pointer-events-auto relative flex w-full items-center justify-between space-x-4',
    'overflow-hidden rounded-lg p-4 pr-10',
    'transition-all duration-300 ease-out',
    'backdrop-blur-xl backdrop-saturate-150',
    'data-[swipe=cancel]:translate-x-0',
    'data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]',
    'data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]',
    'data-[swipe=move]:transition-none',
    'data-[state=open]:animate-slide-up',
    'data-[state=closed]:animate-fade-out',
  ],
  {
    variants: {
      variant: {
        // Light mode (Cenotaphery default) - Glassmorphic with gold accent
        default: [
          'bg-gradient-to-br from-white/80 via-white/70 to-marble-100/60',
          'border border-white/50 border-l-[3px] border-l-gold-500',
          'text-marble-950',
          'shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-1px_0_rgba(0,0,0,0.05)]',
        ],
        success: [
          'bg-gradient-to-br from-success-50/80 via-success-50/70 to-success-100/60',
          'border border-success-200/50 border-l-[3px] border-l-success-500',
          'text-success-900',
          'shadow-[0_8px_32px_rgba(34,197,94,0.15),inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_0_rgba(34,197,94,0.1)]',
        ],
        error: [
          'bg-gradient-to-br from-error-50/80 via-error-50/70 to-error-100/60',
          'border border-error-200/50 border-l-[3px] border-l-error-500',
          'text-error-900',
          'shadow-[0_8px_32px_rgba(239,68,68,0.15),inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_0_rgba(239,68,68,0.1)]',
        ],
        warning: [
          'bg-gradient-to-br from-warning-50/80 via-warning-50/70 to-warning-100/60',
          'border border-warning-200/50 border-l-[3px] border-l-warning-500',
          'text-warning-900',
          'shadow-[0_8px_32px_rgba(245,158,11,0.18),inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_0_rgba(245,158,11,0.1)]',
        ],
        info: [
          'bg-gradient-to-br from-info-50/80 via-info-50/70 to-info-100/60',
          'border border-info-200/50 border-l-[3px] border-l-info-500',
          'text-info-900',
          'shadow-[0_8px_32px_rgba(59,130,246,0.15),inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_0_rgba(59,130,246,0.1)]',
        ],

        // Dark mode (SOIL Scientific) - Visible glass effect with gradient overlay
        dark: [
          'bg-gradient-to-br from-slate-700/70 via-slate-800/60 to-slate-900/50',
          'border border-slate-500/30 border-l-[3px] border-l-gold-500',
          'text-marble-100',
          'shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.2)]',
        ],
        'dark-success': [
          'bg-gradient-to-br from-slate-700/70 via-slate-800/60 to-success-900/30',
          'border border-success-500/30 border-l-[3px] border-l-success-500',
          'text-success-200',
          'shadow-[0_8px_32px_rgba(34,197,94,0.2),inset_0_1px_0_rgba(34,197,94,0.15),inset_0_-1px_0_rgba(0,0,0,0.2)]',
        ],
        'dark-error': [
          'bg-gradient-to-br from-slate-700/70 via-slate-800/60 to-error-900/30',
          'border border-error-500/30 border-l-[3px] border-l-error-500',
          'text-error-200',
          'shadow-[0_8px_32px_rgba(239,68,68,0.2),inset_0_1px_0_rgba(239,68,68,0.15),inset_0_-1px_0_rgba(0,0,0,0.2)]',
        ],
        'dark-warning': [
          'bg-gradient-to-br from-slate-700/70 via-slate-800/60 to-warning-900/30',
          'border border-warning-500/30 border-l-[3px] border-l-warning-500',
          'text-warning-200',
          'shadow-[0_8px_32px_rgba(245,158,11,0.2),inset_0_1px_0_rgba(245,158,11,0.15),inset_0_-1px_0_rgba(0,0,0,0.2)]',
        ],
        'dark-info': [
          'bg-gradient-to-br from-slate-700/70 via-slate-800/60 to-info-900/30',
          'border border-info-500/30 border-l-[3px] border-l-info-500',
          'text-info-200',
          'shadow-[0_8px_32px_rgba(59,130,246,0.2),inset_0_1px_0_rgba(59,130,246,0.15),inset_0_-1px_0_rgba(0,0,0,0.2)]',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitive.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitive.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Action> & {
    variant?: 'default' | 'dark'
  }
>(({ className, variant = 'default', ...props }, ref) => (
  <ToastPrimitive.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-sm border px-3',
      'text-sm font-medium',
      'transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      variant === 'dark'
        ? 'border-slate-600 hover:bg-slate-700 focus:ring-gold-400 focus:ring-offset-slate-800'
        : 'border-marble-300 hover:bg-marble-100 focus:ring-gold-500 focus:ring-offset-white',
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitive.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close> & {
    variant?: 'default' | 'dark'
  }
>(({ className, variant = 'default', ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-sm p-1',
      'opacity-0 transition-opacity group-hover:opacity-100',
      'focus:opacity-100 focus:outline-none focus:ring-2',
      variant === 'dark'
        ? 'text-slate-400 hover:text-marble-100'
        : 'text-marble-500 hover:text-marble-900',
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitive.Close>
))
ToastClose.displayName = ToastPrimitive.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn('text-sm font-ui font-semibold tracking-wide', className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitive.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn('text-sm opacity-80', className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitive.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

// Toast icons by variant
const ToastIcon: React.FC<{ variant?: string }> = ({ variant }) => {
  const iconClass = 'h-5 w-5 shrink-0'

  if (variant?.includes('success')) {
    return <CheckCircle className={cn(iconClass, 'text-success-500')} />
  }
  if (variant?.includes('error')) {
    return <AlertCircle className={cn(iconClass, 'text-error-500')} />
  }
  if (variant?.includes('warning')) {
    return <AlertTriangle className={cn(iconClass, 'text-warning-500')} />
  }
  if (variant?.includes('info')) {
    return <Info className={cn(iconClass, 'text-info-500')} />
  }
  return null
}

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  ToastIcon,
}
