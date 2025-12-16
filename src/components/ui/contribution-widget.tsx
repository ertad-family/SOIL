'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ArrowRight } from 'lucide-react'
import { tabsData, colorClasses, ContributionOption } from '@/lib/contribution-data'
import { cn } from '@/lib/utils'

interface ContributionCardProps {
  option: ContributionOption
  color: keyof typeof colorClasses
  compact?: boolean
}

function ContributionCard({ option, color, compact }: ContributionCardProps) {
  const colors = colorClasses[color]

  return (
    <Card variant="dark" padding={compact ? 'md' : 'lg'} className="h-full flex flex-col">
      <CardHeader className={compact ? 'pb-2' : undefined}>
        <div className={cn(
          'rounded-full flex items-center justify-center mb-2',
          colors.iconBg,
          colors.iconText,
          compact ? 'w-10 h-10' : 'w-12 h-12'
        )}>
          {option.icon}
        </div>
        <CardTitle variant="dark" className={compact ? 'text-base' : undefined}>
          {option.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className={cn(
          'text-slate-400 leading-relaxed flex-1',
          compact ? 'text-xs mb-3' : 'text-sm mb-4'
        )}>
          {option.description}
        </p>
        {option.external ? (
          <a href={option.href} target="_blank" rel="noopener noreferrer">
            <Button
              variant="dark-secondary"
              size={compact ? 'sm' : 'md'}
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {option.cta}
            </Button>
          </a>
        ) : (
          <a href={option.href}>
            <Button
              variant="dark-secondary"
              size={compact ? 'sm' : 'md'}
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {option.cta}
            </Button>
          </a>
        )}
      </CardContent>
    </Card>
  )
}

interface ContributionWidgetProps {
  compact?: boolean
  className?: string
}

export function ContributionWidget({ compact, className }: ContributionWidgetProps) {
  return (
    <Tabs defaultValue="social" className={cn('w-full', className)}>
      <TabsList
        variant="dark"
        className={cn(
          'w-full grid grid-cols-2 md:grid-cols-4 h-auto p-1.5',
          compact ? 'mb-4' : 'mb-8'
        )}
      >
        {Object.entries(tabsData).map(([key, tab]) => (
          <TabsTrigger
            key={key}
            value={key}
            variant="dark"
            className={cn(
              'flex items-center gap-2',
              compact ? 'py-2 text-xs' : 'py-3'
            )}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {Object.entries(tabsData).map(([key, tab]) => (
        <TabsContent key={key} value={key} variant="dark">
          <div className={cn(
            'grid gap-4',
            compact ? 'md:grid-cols-3 gap-3' : 'md:grid-cols-3 gap-6'
          )}>
            {tab.options.map((option, index) => (
              <ContributionCard
                key={index}
                option={option}
                color={tab.color}
                compact={compact}
              />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
