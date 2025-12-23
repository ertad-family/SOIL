"use client";

import { cn } from "@/lib/utils";

interface StarRatingProps {
  /** Current rating value (1-5) */
  value: number;
  /** Callback when rating changes */
  onChange?: (rating: number) => void;
  /** Whether the rating is interactive or display-only */
  readonly?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Additional class names */
  className?: string;
}

const sizeClasses = {
  sm: "text-lg gap-1",
  md: "text-2xl gap-1.5",
  lg: "text-3xl gap-2",
};

/**
 * Star rating component using gold ✦ characters
 * Matches the design pattern from CommunityTestimonialsSection
 */
export function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
  className,
}: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, rating: number) => {
    if (!readonly && onChange && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onChange(rating);
    }
  };

  return (
    <div
      className={cn("flex items-center", sizeClasses[size], className)}
      role="group"
      aria-label="Rating"
    >
      {stars.map((star) => {
        const isActive = star <= value;
        const starElement = (
          <span
            key={star}
            className={cn(
              "transition-all duration-150 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]",
              isActive ? "text-gold-500" : "text-slate-600",
              !readonly && "cursor-pointer hover:scale-110"
            )}
            onClick={() => handleClick(star)}
            onKeyDown={(e) => handleKeyDown(e, star)}
            tabIndex={readonly ? undefined : 0}
            role={readonly ? undefined : "button"}
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            aria-pressed={readonly ? undefined : isActive}
          >
            ✦
          </span>
        );

        return starElement;
      })}
    </div>
  );
}

/**
 * Display-only star rating for showing existing ratings
 */
export function StarRatingDisplay({
  rating,
  size = "sm",
  className,
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return <StarRating value={rating} readonly size={size} className={className} />;
}
