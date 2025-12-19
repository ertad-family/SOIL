import { cn } from "@/lib/utils";

type RomanNumeralValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 50 | 100;

interface RomanNumeralProps {
  value: RomanNumeralValue;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "dark";
}

const ROMAN_NUMERALS: Record<RomanNumeralValue, string> = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
  5: "V",
  6: "VI",
  7: "VII",
  8: "VIII",
  9: "IX",
  10: "X",
  50: "L",
  100: "C",
};

const sizeClasses = {
  sm: "text-5xl", // 48px
  md: "text-7xl", // 72px
  lg: "text-8xl", // 96px
  xl: "text-9xl", // 128px
};

/**
 * Decorative Roman Numeral component
 * Large outline numerals as visual anchors - reinforces Roman heritage theme
 *
 * Usage:
 * <RomanNumeral value={1} />  // Renders "I"
 * <RomanNumeral value={4} />  // Renders "IV"
 * <RomanNumeral value={6} size="lg" />  // Large "VI"
 *
 * Typically positioned absolutely as background decoration
 */
export function RomanNumeral({
  value,
  className,
  size = "lg",
  variant = "default",
}: RomanNumeralProps) {
  const numeral = ROMAN_NUMERALS[value];

  return (
    <span
      aria-hidden="true"
      className={cn(
        "font-serif font-normal select-none pointer-events-none",
        sizeClasses[size],
        // Outline text effect with gold stroke
        variant === "default"
          ? "[color:transparent] [-webkit-text-stroke:1.5px_rgba(201,148,61,0.2)]"
          : "[color:transparent] [-webkit-text-stroke:1.5px_rgba(226,176,85,0.25)]",
        className
      )}
    >
      {numeral}
    </span>
  );
}

/**
 * Positioned variant for use as background decoration
 */
interface PositionedRomanNumeralProps extends RomanNumeralProps {
  position?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "center-left"
    | "center-right";
}

const positionClasses = {
  "top-left": "absolute top-0 left-0",
  "top-right": "absolute top-0 right-0",
  "bottom-left": "absolute bottom-0 left-0",
  "bottom-right": "absolute bottom-0 right-0",
  "center-left": "absolute top-1/2 left-0 -translate-y-1/2",
  "center-right": "absolute top-1/2 right-0 -translate-y-1/2",
};

export function PositionedRomanNumeral({
  position = "top-left",
  className,
  ...props
}: PositionedRomanNumeralProps) {
  return <RomanNumeral className={cn(positionClasses[position], className)} {...props} />;
}
