'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const labelVariants = cva(
  // Base styles
  'font-sans text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      variant: {
        // Light mode (Cenotaphery default)
        default: 'text-marble-700',
        // Dark mode (SOIL Scientific)
        dark: 'text-marble-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  required?: boolean
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, variant, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(labelVariants({ variant, className }))}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-1 text-gold-500">*</span>
      )}
    </label>
  )
)
Label.displayName = 'Label'

export { Label, labelVariants }
