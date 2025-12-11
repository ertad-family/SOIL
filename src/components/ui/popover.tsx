'use client'

import * as React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { cn } from '@/lib/utils'

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverAnchor = PopoverPrimitive.Anchor

export interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  variant?: 'default' | 'dark'
}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(({ className, align = 'center', sideOffset = 4, variant = 'default', ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-50 w-72 rounded-sm outline-none overflow-hidden',
        // Light mode - No border, rely on shadow for depth
        variant === 'default' && [
          'bg-gradient-to-b from-white to-marble-50',
          'text-marble-950',
          'shadow-[0_4px_20px_rgba(0,0,0,0.15),0_2px_6px_rgba(0,0,0,0.1)]',
        ],
        // Dark mode - No border, rely on shadow for depth
        variant === 'dark' && [
          'bg-gradient-to-b from-slate-700 to-slate-800',
          'text-marble-100',
          'shadow-[0_4px_20px_rgba(0,0,0,0.5),0_2px_6px_rgba(0,0,0,0.4)]',
        ],
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
