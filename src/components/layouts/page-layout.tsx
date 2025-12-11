'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface PageLayoutProps {
  variant?: 'default' | 'dark'
  children: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'content'
  className?: string
}

const PageLayout = React.forwardRef<HTMLDivElement, PageLayoutProps>(
  (
    {
      variant = 'default',
      children,
      header,
      footer,
      maxWidth = 'content',
      className,
    },
    ref
  ) => {
    const isDark = variant === 'dark'
    const maxWidths = {
      sm: 'max-w-2xl',
      md: 'max-w-4xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
      full: 'max-w-full',
      content: 'max-w-content',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'min-h-screen flex flex-col',
          isDark ? 'bg-slate-900' : 'bg-marble-50',
          className
        )}
      >
        {header}

        <main className="flex-1">
          <div className={cn('mx-auto px-4 sm:px-6 lg:px-8 py-8', maxWidths[maxWidth])}>
            {children}
          </div>
        </main>

        {footer}
      </div>
    )
  }
)
PageLayout.displayName = 'PageLayout'

export { PageLayout }
