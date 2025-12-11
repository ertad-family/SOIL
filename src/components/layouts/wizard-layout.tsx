'use client'

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ArrowLeft, X, Check } from 'lucide-react'

export interface WizardStep {
  id: string
  label: string
  description?: string
}

export interface WizardLayoutProps {
  variant?: 'default' | 'dark'
  children: React.ReactNode
  steps: WizardStep[]
  currentStep: number
  onBack?: () => void
  onNext?: () => void
  title?: string
  subtitle?: string
  backLabel?: string
  nextLabel?: string
  cancelHref?: string
  isLoading?: boolean
  canGoBack?: boolean
  canGoNext?: boolean
  footerContent?: React.ReactNode
  className?: string
}

const WizardLayout = React.forwardRef<HTMLDivElement, WizardLayoutProps>(
  (
    {
      variant = 'default',
      children,
      steps,
      currentStep,
      onBack,
      onNext,
      title,
      subtitle,
      backLabel = 'Back',
      nextLabel = 'Continue',
      cancelHref = '/',
      isLoading = false,
      canGoBack = true,
      canGoNext = true,
      footerContent,
      className,
    },
    ref
  ) => {
    const progress = ((currentStep + 1) / steps.length) * 100
    const currentStepData = steps[currentStep]
    const isDark = variant === 'dark'

    return (
      <div
        ref={ref}
        className={cn(
          'min-h-screen flex flex-col',
          isDark ? 'bg-slate-gradient' : 'bg-marble-gradient',
          className
        )}
      >
        {/* Header */}
        <header
          className={cn(
            'sticky top-0 z-40 w-full backdrop-blur-md',
            isDark
              ? 'bg-slate-900/90 border-b border-slate-700'
              : 'bg-white/90 border-b border-marble-300'
          )}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            {/* Top row: Cancel and progress */}
            <div className="flex items-center justify-between mb-4">
              <Link href={cancelHref}>
                <Button
                  variant={isDark ? 'dark-ghost' : 'ghost'}
                  size="sm"
                >
                  <X className="h-4 w-4 mr-2" />
                  Save & Exit
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-sm">
                <span className={isDark ? 'text-slate-400' : 'text-marble-600'}>
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className={cn(
              'h-1 rounded-full overflow-hidden',
              isDark ? 'bg-slate-700' : 'bg-marble-200'
            )}>
              <div
                className="h-full bg-gold-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Step indicator */}
            <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    'flex items-center gap-2 shrink-0',
                    index !== steps.length - 1 && 'pr-4'
                  )}
                >
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                      index < currentStep && 'bg-gold-500 text-marble-950',
                      index === currentStep && 'bg-gold-500 text-marble-950 ring-4 ring-gold-200',
                      index > currentStep && (isDark ? 'bg-slate-700 text-slate-400' : 'bg-marble-200 text-marble-500')
                    )}
                  >
                    {index < currentStep ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-sm whitespace-nowrap hidden sm:inline',
                      index === currentStep
                        ? (isDark ? 'text-marble-100 font-medium' : 'text-marble-950 font-medium')
                        : (isDark ? 'text-slate-500' : 'text-marble-500')
                    )}
                  >
                    {step.label}
                  </span>
                  {index !== steps.length - 1 && (
                    <div
                      className={cn(
                        'hidden sm:block w-8 h-px',
                        index < currentStep ? 'bg-gold-500' : (isDark ? 'bg-slate-700' : 'bg-marble-200')
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            {/* Step title */}
            {(title || currentStepData) && (
              <div className="mb-8 text-center">
                <h1
                  className={cn(
                    'font-serif text-2xl sm:text-3xl font-semibold tracking-wide',
                    isDark ? 'text-marble-100' : 'text-marble-950'
                  )}
                >
                  {title || currentStepData.label}
                </h1>
                {(subtitle || currentStepData.description) && (
                  <p
                    className={cn(
                      'mt-2 text-base',
                      isDark ? 'text-slate-400' : 'text-marble-600'
                    )}
                  >
                    {subtitle || currentStepData.description}
                  </p>
                )}
              </div>
            )}

            {/* Form content */}
            <div
              className={cn(
                'rounded-md p-6 sm:p-8',
                isDark
                  ? 'bg-slate-800 border border-slate-700'
                  : 'bg-white border border-marble-300 shadow-sm'
              )}
            >
              {children}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer
          className={cn(
            'sticky bottom-0 w-full backdrop-blur-md',
            isDark
              ? 'bg-slate-900/90 border-t border-slate-700'
              : 'bg-white/90 border-t border-marble-300'
          )}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Back button */}
              <div>
                {currentStep > 0 && canGoBack && (
                  <Button
                    variant={isDark ? 'dark-secondary' : 'secondary'}
                    onClick={onBack}
                    disabled={isLoading}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {backLabel}
                  </Button>
                )}
              </div>

              {/* Custom footer content or Next button */}
              <div className="flex items-center gap-3">
                {footerContent}
                {canGoNext && (
                  <Button
                    variant={isDark ? 'dark-primary' : 'primary'}
                    onClick={onNext}
                    disabled={isLoading}
                    isLoading={isLoading}
                  >
                    {currentStep === steps.length - 1 ? 'Complete' : nextLabel}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
  }
)
WizardLayout.displayName = 'WizardLayout'

export { WizardLayout }
