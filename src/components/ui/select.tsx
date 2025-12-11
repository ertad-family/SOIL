'use client'

import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    variant?: 'default' | 'dark' | 'error' | 'dark-error'
  }
>(({ className, children, variant = 'default', ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between',
      'rounded-sm px-3 py-2',
      'text-base font-sans',
      'border',
      'transition-all duration-200',
      'focus:outline-none',
      'disabled:cursor-not-allowed disabled:opacity-50',
      '[&>span]:line-clamp-1',
      // Light mode (Cenotaphery default) - Gradient with embossed effect
      variant === 'default' && [
        'bg-gradient-to-b from-white to-marble-50',
        'text-marble-950 border-marble-300/80',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.05)]',
        'hover:border-marble-400 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.08)]',
        'focus:border-gold-500 focus:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_0_0_2px_rgba(196,161,90,0.2)]',
      ],
      variant === 'error' && [
        'bg-gradient-to-b from-white to-error-50/30',
        'text-marble-950 border-error-400/80',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_2px_rgba(239,68,68,0.1)]',
        'hover:border-error-500',
        'focus:border-error-500 focus:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_0_0_2px_rgba(239,68,68,0.2)]',
      ],
      // Dark mode (SOIL Scientific) - Gradient with depth
      variant === 'dark' && [
        'bg-gradient-to-b from-slate-700 to-slate-800',
        'text-marble-100 border-slate-600/80',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.2)]',
        'hover:border-slate-500 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_4px_rgba(0,0,0,0.3)]',
        'focus:border-gold-400 focus:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_0_0_2px_rgba(196,161,90,0.3)]',
      ],
      variant === 'dark-error' && [
        'bg-gradient-to-b from-slate-700 to-error-900/30',
        'text-marble-100 border-error-500/60',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(239,68,68,0.15)]',
        'hover:border-error-400',
        'focus:border-error-400 focus:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_0_0_2px_rgba(239,68,68,0.3)]',
      ],
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className={cn(
        'h-4 w-4 transition-transform duration-200',
        (variant === 'dark' || variant === 'dark-error') ? 'text-slate-400' : 'text-marble-500'
      )} />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
    variant?: 'default' | 'dark'
  }
>(({ className, children, position = 'popper', variant = 'default', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      sideOffset={4}
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden',
        'rounded-sm border',
        // Light mode - Gradient with depth
        variant === 'default' && [
          'bg-gradient-to-b from-white to-marble-50',
          'text-marble-950 border-marble-300/80',
          'shadow-[0_4px_16px_rgba(0,0,0,0.12),0_2px_4px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.8)]',
        ],
        // Dark mode - Gradient with depth
        variant === 'dark' && [
          'bg-gradient-to-b from-slate-700 to-slate-800',
          'text-marble-100 border-slate-600/80',
          'shadow-[0_4px_16px_rgba(0,0,0,0.4),0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]',
        ],
        position === 'popper' && [
          'data-[side=bottom]:translate-y-1',
          'data-[side=left]:-translate-x-1',
          'data-[side=right]:translate-x-1',
          'data-[side=top]:-translate-y-1',
        ],
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' && [
            'w-full min-w-[var(--radix-select-trigger-width)]',
          ]
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label> & {
    variant?: 'default' | 'dark'
  }
>(({ className, variant = 'default', ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      'py-1.5 pl-8 pr-2 text-xs font-semibold',
      variant === 'dark' ? 'text-slate-400' : 'text-marble-500',
      className
    )}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    variant?: 'default' | 'dark'
  }
>(({ className, children, variant = 'default', ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-pointer select-none items-center',
      'rounded-sm py-2.5 pl-8 pr-3',
      'text-sm outline-none',
      'transition-all duration-150',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      // Light mode - Gold highlight on hover/focus
      variant === 'default' && [
        'hover:bg-gold-50/70',
        'focus:bg-gradient-to-r focus:from-gold-100/80 focus:to-gold-50/50 focus:text-marble-950',
        'data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-gold-100 data-[state=checked]:to-gold-50',
        'data-[state=checked]:font-medium',
      ],
      // Dark mode - Subtle highlight
      variant === 'dark' && [
        'hover:bg-slate-600/50',
        'focus:bg-gradient-to-r focus:from-slate-600/80 focus:to-slate-700/50 focus:text-marble-100',
        'data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-gold-500/20 data-[state=checked]:to-gold-600/10',
        'data-[state=checked]:font-medium',
      ],
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4 text-gold-500" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator> & {
    variant?: 'default' | 'dark'
  }
>(({ className, variant = 'default', ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn(
      '-mx-1 my-1 h-px',
      variant === 'dark' ? 'bg-slate-600' : 'bg-marble-200',
      className
    )}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
