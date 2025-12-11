'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SidebarItem {
  label: string
  href?: string
  icon?: React.ReactNode
  children?: SidebarItem[]
  badge?: string | number
}

export interface SidebarProps {
  variant?: 'default' | 'dark'
  items: SidebarItem[]
  header?: React.ReactNode
  footer?: React.ReactNode
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  className?: string
}

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  (
    {
      variant = 'default',
      items,
      header,
      footer,
      collapsed = false,
      className,
    },
    ref
  ) => {
    const isDark = variant === 'dark'

    return (
      <aside
        ref={ref}
        className={cn(
          'flex flex-col h-full transition-all duration-300',
          collapsed ? 'w-16' : 'w-64',
          isDark
            ? 'bg-slate-900 border-r border-slate-700'
            : 'bg-marble-50 border-r border-marble-300',
          className
        )}
      >
        {/* Header */}
        {header && (
          <div
            className={cn(
              'flex items-center h-16 px-4 border-b',
              isDark ? 'border-slate-700' : 'border-marble-300'
            )}
          >
            {header}
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {items.map((item, index) => (
            <SidebarItemComponent
              key={item.href || index}
              item={item}
              variant={variant}
              collapsed={collapsed}
            />
          ))}
        </nav>

        {/* Footer */}
        {footer && (
          <div
            className={cn(
              'p-4 border-t',
              isDark ? 'border-slate-700' : 'border-marble-300'
            )}
          >
            {footer}
          </div>
        )}
      </aside>
    )
  }
)
Sidebar.displayName = 'Sidebar'

// Sidebar item component
const SidebarItemComponent: React.FC<{
  item: SidebarItem
  variant: 'default' | 'dark'
  collapsed: boolean
  depth?: number
}> = ({ item, variant, collapsed, depth = 0 }) => {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const hasChildren = item.children && item.children.length > 0
  const isActive = item.href ? pathname === item.href : false
  const isDark = variant === 'dark'

  // Auto-expand if a child is active
  React.useEffect(() => {
    if (hasChildren && item.children?.some((child) => pathname === child.href)) {
      setOpen(true)
    }
  }, [pathname, hasChildren, item.children])

  const baseClasses = cn(
    'flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium transition-colors w-full',
    depth > 0 && 'ml-4',
    isDark
      ? [
          isActive
            ? 'bg-slate-700 text-marble-100'
            : 'text-slate-400 hover:text-marble-100 hover:bg-slate-800',
        ]
      : [
          isActive
            ? 'bg-gold-100 text-marble-950'
            : 'text-marble-600 hover:text-marble-950 hover:bg-gold-50',
        ]
  )

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={baseClasses}
        >
          {item.icon && (
            <span className="shrink-0 w-5 h-5">{item.icon}</span>
          )}
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              {open ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </>
          )}
        </button>

        {open && !collapsed && (
          <div className="mt-1 space-y-1">
            {item.children?.map((child, index) => (
              <SidebarItemComponent
                key={child.href || index}
                item={child}
                variant={variant}
                collapsed={collapsed}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link href={item.href || '#'} className={baseClasses}>
      {item.icon && (
        <span className="shrink-0 w-5 h-5">{item.icon}</span>
      )}
      {!collapsed && (
        <>
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <span
              className={cn(
                'px-2 py-0.5 text-xs rounded-full',
                isDark
                  ? 'bg-gold-500/20 text-gold-400'
                  : 'bg-gold-100 text-gold-700'
              )}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  )
}

export { Sidebar }
