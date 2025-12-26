"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { tabsData } from "@/lib/contribution-data";
import { cn } from "@/lib/utils";
import { ContributionCard } from "@/components/ui/contribution-card";

interface ContributionWidgetProps {
  compact?: boolean;
  className?: string;
}

export function ContributionWidget({ compact, className }: ContributionWidgetProps) {
  return (
    <Tabs defaultValue="social" className={cn("w-full", className)}>
      <TabsList
        variant="dark"
        className={cn(
          "w-full grid grid-cols-2 md:grid-cols-4 h-auto p-1.5",
          compact ? "mb-4" : "mb-8"
        )}
      >
        {Object.entries(tabsData).map(([key, tab]) => (
          <TabsTrigger
            key={key}
            value={key}
            variant="dark"
            className={cn("flex items-center gap-2", compact ? "py-2 text-xs" : "py-3")}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {Object.entries(tabsData).map(([key, tab]) => (
        <TabsContent key={key} value={key} variant="dark">
          <div
            className={cn("grid gap-4", compact ? "md:grid-cols-3 gap-3" : "md:grid-cols-3 gap-6")}
          >
            {tab.options.map((option, index) => (
              <ContributionCard key={index} option={option} color={tab.color} compact={compact} />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
