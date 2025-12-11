'use client'

import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '@/lib/utils'

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  variant?: 'default' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  color?: 'default' | 'success' | 'warning' | 'error'
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, variant = 'default', size = 'md', showValue = false, color = 'default', ...props }, ref) => {
  const isDark = variant === 'dark'

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  const colors = {
    default: 'bg-gold-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
  }

  return (
    <div className="w-full">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          'relative w-full overflow-hidden rounded-full',
          sizes[size],
          isDark ? 'bg-slate-700' : 'bg-marble-200',
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            'h-full w-full flex-1 transition-all duration-500 ease-out rounded-full',
            colors[color]
          )}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
      {showValue && (
        <div
          className={cn(
            'mt-1 text-xs text-right',
            isDark ? 'text-slate-400' : 'text-marble-600'
          )}
        >
          {value}%
        </div>
      )}
    </div>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

// Circular Progress (for loading states)
export interface CircularProgressProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'dark'
  value?: number
  className?: string
}

const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  ({ size = 'md', variant = 'default', value, className }, ref) => {
    const isDark = variant === 'dark'

    const sizes = {
      sm: { wrapper: 'w-8 h-8', stroke: 2 },
      md: { wrapper: 'w-12 h-12', stroke: 3 },
      lg: { wrapper: 'w-16 h-16', stroke: 4 },
    }

    const isIndeterminate = value === undefined
    const radius = 45
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = isIndeterminate
      ? 0
      : circumference - ((value || 0) / 100) * circumference

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center',
          sizes[size].wrapper,
          isIndeterminate && 'animate-spin',
          className
        )}
      >
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth={sizes[size].stroke}
            className={isDark ? 'stroke-slate-700' : 'stroke-marble-200'}
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth={sizes[size].stroke}
            strokeLinecap="round"
            className="stroke-gold-500 transition-all duration-500 ease-out"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: isIndeterminate ? circumference * 0.75 : strokeDashoffset,
            }}
          />
        </svg>
      </div>
    )
  }
)
CircularProgress.displayName = 'CircularProgress'

export { Progress, CircularProgress }
