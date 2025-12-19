"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, Filter } from "lucide-react";

interface CenotapheryFiltersProps {
  slug: string;
}

// Organization types
const ORG_TYPES = [
  { value: "tech_product", label: "Tech Product" },
  { value: "services", label: "Services" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "ngo", label: "NGO" },
  { value: "media", label: "Media" },
];

// Age ranges (years since closure)
const AGE_RANGES = [
  { value: "0-1", label: "< 1 year ago" },
  { value: "1-3", label: "1-3 years ago" },
  { value: "3-5", label: "3-5 years ago" },
  { value: "5-10", label: "5-10 years ago" },
  { value: "10+", label: "10+ years ago" },
];

// Founded decade ranges
const FOUNDED_RANGES = [
  { value: "2020-2029", label: "2020s" },
  { value: "2010-2019", label: "2010s" },
  { value: "2000-2009", label: "2000s" },
  { value: "1990-1999", label: "1990s" },
  { value: "1980-1989", label: "1980s" },
  { value: "pre-1980", label: "Before 1980" },
];

/**
 * CenotapheryFilters - URL-based filter bar for cenotaphery gallery
 *
 * Filters:
 * - Organization type
 * - Industry (text input - future enhancement)
 * - Age (years since closure)
 * - Founded decade
 */
export function CenotapheryFilters({ slug }: CenotapheryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current filter values
  const currentOrgType = searchParams.get("org_type") || "";
  const currentAge = searchParams.get("age") || "";
  const currentFounded = searchParams.get("founded") || "";

  // Check if any filters are active
  const hasActiveFilters = currentOrgType || currentAge || currentFounded;

  // Update URL with new params
  const updateFilters = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      // Handle age range splitting
      if (key === "age" && value) {
        params.delete("min_age");
        params.delete("max_age");

        if (value === "0-1") {
          params.set("max_age", "1");
        } else if (value === "1-3") {
          params.set("min_age", "1");
          params.set("max_age", "3");
        } else if (value === "3-5") {
          params.set("min_age", "3");
          params.set("max_age", "5");
        } else if (value === "5-10") {
          params.set("min_age", "5");
          params.set("max_age", "10");
        } else if (value === "10+") {
          params.set("min_age", "10");
        }
      }

      // Handle founded range splitting
      if (key === "founded" && value) {
        params.delete("founded_from");
        params.delete("founded_to");

        if (value === "pre-1980") {
          params.set("founded_to", "1979");
        } else {
          const [from, to] = value.split("-");
          params.set("founded_from", from);
          params.set("founded_to", to);
        }
      }

      router.push(`/cenotaphery/${slug}?${params.toString()}`);
    },
    [router, searchParams, slug]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    router.push(`/cenotaphery/${slug}`);
  }, [router, slug]);

  return (
    <div className="relative">
      {/* Filter bar container */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 backdrop-blur-sm">
        {/* Filter icon */}
        <div className="flex items-center gap-2 text-slate-400">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:inline">Filter</span>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-700 hidden sm:block" />

        {/* Organization Type */}
        <Select
          value={currentOrgType}
          onValueChange={(value) => updateFilters("org_type", value || null)}
        >
          <SelectTrigger variant="dark" className="w-[140px] h-9 text-sm bg-slate-800/80">
            <SelectValue placeholder="Org Type" />
          </SelectTrigger>
          <SelectContent variant="dark">
            {ORG_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value} variant="dark">
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Age Range */}
        <Select value={currentAge} onValueChange={(value) => updateFilters("age", value || null)}>
          <SelectTrigger variant="dark" className="w-[140px] h-9 text-sm bg-slate-800/80">
            <SelectValue placeholder="Closed" />
          </SelectTrigger>
          <SelectContent variant="dark">
            {AGE_RANGES.map((range) => (
              <SelectItem key={range.value} value={range.value} variant="dark">
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Founded Range */}
        <Select
          value={currentFounded}
          onValueChange={(value) => updateFilters("founded", value || null)}
        >
          <SelectTrigger variant="dark" className="w-[130px] h-9 text-sm bg-slate-800/80">
            <SelectValue placeholder="Founded" />
          </SelectTrigger>
          <SelectContent variant="dark">
            {FOUNDED_RANGES.map((range) => (
              <SelectItem key={range.value} value={range.value} variant="dark">
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear filters button */}
        {hasActiveFilters && (
          <>
            <div className="h-6 w-px bg-slate-700" />
            <Button
              variant="dark-ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9 text-sm text-slate-400 hover:text-marble-100"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default CenotapheryFilters;
