"use client";

import { ShieldCheck } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface VerifiedBadgeWithTooltipProps {
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
  headline?: string;
  description?: string;
  showButton?: boolean;
  buttonLink?: string;
  buttonText?: string;
}

/**
 * Verified badge with tooltip showing verification benefits.
 * Reusable component for both owner and public organization pages.
 */
export function VerifiedBadgeWithTooltip({
  className,
  side = "bottom",
  headline = "This organization is verified",
  description = "Your story can now be used in research, your cenotaph is public and searchable, and you can offer consulting to the founder community.",
  showButton = true,
  buttonLink = "/about/verification",
  buttonText = "Learn more",
}: VerifiedBadgeWithTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="dark-verified" size="sm" className={cn("cursor-help", className)}>
          <ShieldCheck className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      </TooltipTrigger>
      <TooltipContent variant="dark" side={side} className="max-w-sm p-5 not-italic">
        <div className="space-y-4">
          <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-marble-100 mb-2">{headline}</h4>
            <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
          </div>
          {showButton && (
            <Button variant="dark-secondary" size="sm" fullWidth asChild>
              <a href={buttonLink}>
                {buttonText}
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
