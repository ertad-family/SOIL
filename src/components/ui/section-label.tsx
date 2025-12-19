import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Bracketed section label component
 * Pattern: [ section name ]
 *
 * Usage:
 * <SectionLabel>how it works</SectionLabel>
 * <SectionLabel>about soil</SectionLabel>
 * <SectionLabel>step iii</SectionLabel>
 */
export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <span
      className={cn(
        "inline-block font-sans text-sm font-medium tracking-[0.05em] text-gold-500 lowercase",
        'before:content-["[_"] after:content-["_]"]',
        className
      )}
    >
      {children}
    </span>
  );
}
