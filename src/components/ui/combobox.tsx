'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
}

export interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  variant?: 'default' | 'dark'
  disabled?: boolean
  className?: string
}

const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      options,
      value,
      onValueChange,
      placeholder = 'Select option...',
      searchPlaceholder = 'Search...',
      emptyText = 'No results found.',
      variant = 'default',
      disabled = false,
      className,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState(value || '')

    const currentValue = value !== undefined ? value : internalValue
    const selectedOption = options.find((opt) => opt.value === currentValue)

    const handleSelect = (optionValue: string) => {
      const newValue = optionValue === currentValue ? '' : optionValue
      if (value === undefined) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
      setOpen(false)
    }

    const isDark = variant === 'dark'

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant={isDark ? 'dark-outline' : 'outline'}
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              'w-full justify-between font-normal',
              // Custom styles for combobox trigger
              isDark
                ? [
                    'bg-gradient-to-b from-slate-700 to-slate-800',
                    'border-slate-600/80',
                    'shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.2)]',
                    'hover:border-slate-500',
                  ]
                : [
                    'bg-gradient-to-b from-white to-marble-50',
                    'border-marble-300/80',
                    'shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.05)]',
                    'hover:border-marble-400',
                  ],
              !selectedOption && (isDark ? 'text-slate-400' : 'text-marble-400'),
              className
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
            <ChevronsUpDown
              className={cn(
                'ml-2 h-4 w-4 shrink-0',
                isDark ? 'text-slate-400' : 'text-marble-400'
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          variant={variant}
          className="w-[--radix-popover-trigger-width] p-0"
          align="start"
        >
          <Command variant={variant}>
            <CommandInput placeholder={searchPlaceholder} variant={variant} />
            <CommandList>
              <CommandEmpty variant={variant}>{emptyText}</CommandEmpty>
              <CommandGroup variant={variant}>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={handleSelect}
                    disabled={option.disabled}
                    variant={variant}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4 text-gold-500',
                        currentValue === option.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)
Combobox.displayName = 'Combobox'

export { Combobox }
