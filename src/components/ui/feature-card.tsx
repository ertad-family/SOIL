import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
  variant?: "default" | "dark" | "highlighted" | "dark-highlighted";
  href?: string;
  onClick?: () => void;
}

/**
 * Feature Card component
 * Icon + title + description pattern for showcasing features, services, or concepts
 *
 * Usage:
 * <FeatureCard
 *   icon={<IconComponent />}
 *   title="Feature Name"
 *   description="Brief description of the feature or concept."
 * />
 */
export function FeatureCard({
  icon,
  title,
  description,
  className,
  variant = "default",
  href,
  onClick,
}: FeatureCardProps) {
  const isInteractive = href || onClick;

  const cardClasses = cn(
    "p-6 md:p-8 rounded-md transition-all duration-200",
    // Base styles by variant
    {
      // Default light
      "bg-transparent": variant === "default",
      // Default dark
      "bg-slate-800/50": variant === "dark",
      // Highlighted light - with left gold accent
      "bg-marble-50 border-l-2 border-gold-500/30": variant === "highlighted",
      // Highlighted dark - with left gold accent
      "bg-slate-800 border-l-2 border-gold-400/40": variant === "dark-highlighted",
    },
    // Interactive states
    isInteractive && "cursor-pointer",
    isInteractive && variant === "default" && "hover:bg-marble-50",
    isInteractive && variant === "dark" && "hover:bg-slate-700/50",
    isInteractive &&
      (variant === "highlighted" || variant === "dark-highlighted") &&
      "hover:-translate-y-0.5",
    className
  );

  const iconClasses = cn(
    "w-12 h-12 md:w-14 md:h-14 flex items-center justify-center mb-4",
    // Icon container styling
    {
      "text-gold-500": variant === "default" || variant === "highlighted",
      "text-gold-400": variant === "dark" || variant === "dark-highlighted",
    }
  );

  const titleClasses = cn("font-display text-lg md:text-xl font-medium mb-2", {
    "text-marble-950": variant === "default" || variant === "highlighted",
    "text-marble-100": variant === "dark" || variant === "dark-highlighted",
  });

  const descriptionClasses = cn("text-sm md:text-base leading-relaxed", {
    "text-marble-600": variant === "default" || variant === "highlighted",
    "text-slate-400": variant === "dark" || variant === "dark-highlighted",
  });

  const content = (
    <>
      <div className={iconClasses}>{icon}</div>
      <h4 className={titleClasses}>{title}</h4>
      <p className={descriptionClasses}>{description}</p>
    </>
  );

  if (href) {
    return (
      <a href={href} className={cardClasses}>
        {content}
      </a>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cardClasses}>
        {content}
      </button>
    );
  }

  return <div className={cardClasses}>{content}</div>;
}

/**
 * Feature Card Grid container
 * Responsive grid: 4 columns desktop, 2 tablet, 1 mobile
 */
interface FeatureCardGridProps {
  children: ReactNode;
  className?: string;
  columns?: 2 | 3 | 4;
}

export function FeatureCardGrid({ children, className, columns = 4 }: FeatureCardGridProps) {
  const gridClasses = cn(
    "grid gap-6",
    {
      "grid-cols-1 md:grid-cols-2": columns === 2,
      "grid-cols-1 md:grid-cols-2 lg:grid-cols-3": columns === 3,
      "grid-cols-1 md:grid-cols-2 lg:grid-cols-4": columns === 4,
    },
    className
  );

  return <div className={gridClasses}>{children}</div>;
}
