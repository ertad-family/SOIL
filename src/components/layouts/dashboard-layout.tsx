'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

export interface DashboardLayoutProps {
  variant?: 'default' | 'dark'
  children: React.ReactNode
  sidebar?: React.ReactNode
  header?: React.ReactNode
  pageTitle?: string
  pageDescription?: string
  pageActions?: React.ReactNode
  className?: string
}

const DashboardLayout = React.forwardRef<HTMLDivElement, DashboardLayoutProps>(
  (
    {
      variant = 'default',
      children,
      sidebar,
      header,
      pageTitle,
      pageDescription,
      pageActions,
      className,
    },
    ref
  ) => {
    const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)
    const isDark = variant === 'dark'

    return (
      <div
        ref={ref}
        className={cn(
          'min-h-screen flex flex-col',
          isDark ? 'bg-slate-900' : 'bg-marble-50',
          className
        )}
      >
        {/* Header */}
        {header}

        <div className="flex flex-1 overflow-hidden">
          {/* Desktop Sidebar */}
          {sidebar && (
            <div className="hidden lg:block">
              {sidebar}
            </div>
          )}

          {/* Mobile Sidebar Overlay */}
          {mobileSidebarOpen && sidebar && (
            <div className="fixed inset-0 z-40 lg:hidden">
              {/* Backdrop */}
              <div
                className={cn(
                  'fixed inset-0 backdrop-blur-sm',
                  isDark ? 'bg-slate-950/80' : 'bg-marble-950/60'
                )}
                onClick={() => setMobileSidebarOpen(false)}
              />
              {/* Sidebar */}
              <div className="fixed inset-y-0 left-0 w-64 z-50">
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-end p-4">
                    <Button
                      variant={isDark ? 'dark-ghost' : 'ghost'}
                      size="icon-sm"
                      onClick={() => setMobileSidebarOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {sidebar}
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            {/* Mobile sidebar toggle */}
            {sidebar && (
              <div className={cn(
                'lg:hidden p-4 border-b',
                isDark ? 'border-slate-700' : 'border-marble-300'
              )}>
                <Button
                  variant={isDark ? 'dark-ghost' : 'ghost'}
                  size="sm"
                  onClick={() => setMobileSidebarOpen(true)}
                >
                  <Menu className="h-4 w-4 mr-2" />
                  Menu
                </Button>
              </div>
            )}

            <div className="p-6 lg:p-8">
              {/* Page Header */}
              {(pageTitle || pageDescription || pageActions) && (
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    {pageTitle && (
                      <h1
                        className={cn(
                          'font-serif text-2xl font-semibold tracking-wide',
                          isDark ? 'text-marble-100' : 'text-marble-950'
                        )}
                      >
                        {pageTitle}
                      </h1>
                    )}
                    {pageDescription && (
                      <p
                        className={cn(
                          'mt-1 text-sm',
                          isDark ? 'text-slate-400' : 'text-marble-600'
                        )}
                      >
                        {pageDescription}
                      </p>
                    )}
                  </div>
                  {pageActions && (
                    <div className="flex items-center gap-3">{pageActions}</div>
                  )}
                </div>
              )}

              {/* Page Content */}
              {children}
            </div>
          </main>
        </div>
      </div>
    )
  }
)
DashboardLayout.displayName = 'DashboardLayout'

export { DashboardLayout }
