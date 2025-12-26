"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { colorClasses, ContributionOption } from "@/lib/contribution-data";
import { cn } from "@/lib/utils";
import { ShareButton } from "@/components/ui/share-button";

export interface ContributionCardProps {
  option: ContributionOption;
  color: keyof typeof colorClasses;
  /**
   * Variant determines sizing and styling:
   * - "default": Responsive height, supports compact prop
   * - "fab": Fixed 240x280 size with transparent background for FAB usage
   */
  variant?: "default" | "fab";
  /** Only applies when variant="default" - uses smaller padding and text */
  compact?: boolean;
}

export function ContributionCard({
  option,
  color,
  variant = "default",
  compact = false,
}: ContributionCardProps) {
  const colors = colorClasses[color];
  const isFab = variant === "fab";

  // FAB variant always uses compact-like sizing
  const useCompactSizing = isFab || compact;

  return (
    <Card
      variant="dark"
      padding={useCompactSizing ? "md" : "lg"}
      className={cn(
        "flex flex-col",
        isFab ? "w-[240px] h-[280px] bg-transparent border-white/10" : "h-full"
      )}
    >
      <CardHeader className={useCompactSizing ? "pb-2" : undefined}>
        <div
          className={cn(
            "rounded-full flex items-center justify-center mb-2",
            colors.iconBg,
            colors.iconText,
            useCompactSizing ? "w-10 h-10" : "w-12 h-12"
          )}
        >
          {option.icon}
        </div>
        <CardTitle variant="dark" className={useCompactSizing ? "text-base" : undefined}>
          {option.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p
          className={cn(
            "text-slate-400 leading-relaxed flex-1",
            useCompactSizing ? "text-xs mb-3" : "text-sm mb-4",
            isFab && "line-clamp-4"
          )}
        >
          {option.description}
        </p>
        {option.title === "Spread the Word" ? (
          <ShareButton
            url={option.href}
            title="SOIL - Where founders share their stories for science"
            description="Help build the future of organizational research. Join the movement at soil.rip"
            className="w-full"
          />
        ) : option.external ? (
          <a href={option.href} target="_blank" rel="noopener noreferrer">
            <Button
              variant="dark-secondary"
              size={useCompactSizing ? "sm" : "md"}
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
              size={useCompactSizing ? "sm" : "md"}
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {option.cta}
            </Button>
          </a>
        )}
      </CardContent>
    </Card>
  );
}
