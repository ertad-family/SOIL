import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useState, useEffect } from "react";

/**
 * Combines class names with Tailwind merge support.
 * Use this for all className combinations to properly handle Tailwind conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number with commas for display
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

/**
 * Truncate text to a specific length with ellipsis
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

/**
 * Debounce function for rate limiting
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Check if we're running on the client side
 */
export const isClient = typeof window !== "undefined";

/**
 * Check if we're running on the server side
 */
export const isServer = typeof window === "undefined";

/**
 * Mobile breakpoint in pixels (matches Tailwind md breakpoint)
 */
const MOBILE_BREAKPOINT = 768;

/**
 * Hook to detect if the current device is mobile based on viewport width.
 * Used for performance optimizations (disabling heavy 3D effects on mobile).
 * Responds to orientation changes via debounced resize listener.
 *
 * @param breakpoint - Width threshold in pixels (default: 768)
 * @returns true if viewport width is less than breakpoint
 */
export function useIsMobile(breakpoint = MOBILE_BREAKPOINT): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check viewport width
    const checkMobile = () => window.innerWidth < breakpoint;
    setIsMobile(checkMobile());

    // Debounced resize listener for orientation changes
    const handleResize = debounce(() => setIsMobile(checkMobile()), 150);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}

/**
 * Format a number with K, M, B shorthand notation
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 1)
 */
export function formatShorthand(value: number, decimals: number = 1): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(decimals)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(decimals)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(decimals)}K`;
  }
  return value.toFixed(0);
}

/**
 * Format revenue with USD prefix and shorthand notation
 * @param value - The revenue amount in USD
 * @returns Formatted string like "$1.2M" or "$500K", or null if no value
 */
export function formatRevenueUSD(value: number | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  return `$${formatShorthand(value)}`;
}
