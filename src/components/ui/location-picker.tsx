"use client";

import * as React from "react";
import { MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { GeoLocation } from "@/types/interview";

/** Search result from geocoding APIs */
interface GeoSearchResult {
  city: string;
  country: string;
  countryCode: string;
  adminName?: string; // State/province for disambiguation
  latitude: number;
  longitude: number;
  geoId?: number;
  displayName: string; // Full display string like "Paris, Île-de-France, France"
}

export interface LocationPickerProps {
  value?: GeoLocation;
  onValueChange?: (location: GeoLocation) => void;
  placeholder?: string;
  variant?: "default" | "dark";
  disabled?: boolean;
  className?: string;
}

const GEONAMES_USERNAME = "soil";
const GEOAPIFY_API_KEY = "f0056b8481ff4757a2c8e37ca409ab78";
const DEBOUNCE_MS = 300;
const MIN_SEARCH_LENGTH = 2;

/**
 * Search cities using GeoNames API
 * @see http://www.geonames.org/export/web-services.html
 */
async function searchGeoNames(query: string): Promise<GeoSearchResult[]> {
  const url = new URL("https://secure.geonames.org/searchJSON");
  url.searchParams.set("q", query);
  url.searchParams.set("maxRows", "8");
  url.searchParams.set("featureClass", "P"); // Populated places only
  url.searchParams.set("orderby", "population"); // Most populated first
  url.searchParams.set("username", GEONAMES_USERNAME);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`GeoNames API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.geonames || !Array.isArray(data.geonames)) {
    return [];
  }

  return data.geonames.map(
    (item: {
      name: string;
      countryName: string;
      countryCode: string;
      adminName1?: string;
      lat: string;
      lng: string;
      geonameId: number;
    }) => {
      // Build display name with disambiguation
      const parts = [item.name];
      if (item.adminName1 && item.adminName1 !== item.name) {
        parts.push(item.adminName1);
      }
      parts.push(item.countryName);

      return {
        city: item.name,
        country: item.countryName,
        countryCode: item.countryCode,
        adminName: item.adminName1,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lng),
        geoId: item.geonameId,
        displayName: parts.join(", "),
      };
    }
  );
}

/**
 * Search cities using Geoapify API (fallback)
 * @see https://www.geoapify.com/address-autocomplete/
 */
async function searchGeoapify(query: string): Promise<GeoSearchResult[]> {
  const url = new URL("https://api.geoapify.com/v1/geocode/autocomplete");
  url.searchParams.set("text", query);
  url.searchParams.set("type", "city");
  url.searchParams.set("limit", "8");
  url.searchParams.set("apiKey", GEOAPIFY_API_KEY);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Geoapify API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.features || !Array.isArray(data.features)) {
    return [];
  }

  return data.features.map(
    (feature: {
      properties: {
        city?: string;
        name?: string;
        country: string;
        country_code: string;
        state?: string;
        lat: number;
        lon: number;
        place_id: string;
      };
    }) => {
      const props = feature.properties;
      const cityName = props.city || props.name || "";

      // Build display name with disambiguation
      const parts = [cityName];
      if (props.state && props.state !== cityName) {
        parts.push(props.state);
      }
      parts.push(props.country);

      return {
        city: cityName,
        country: props.country,
        countryCode: props.country_code?.toUpperCase() || "",
        adminName: props.state,
        latitude: props.lat,
        longitude: props.lon,
        displayName: parts.join(", "),
      };
    }
  );
}

/**
 * Search cities with GeoNames primary and Geoapify fallback
 */
async function searchCities(query: string): Promise<GeoSearchResult[]> {
  try {
    const results = await searchGeoNames(query);
    if (results.length > 0) {
      return results;
    }
    // If GeoNames returns empty, try Geoapify
    return await searchGeoapify(query);
  } catch {
    // If GeoNames fails, fallback to Geoapify
    try {
      return await searchGeoapify(query);
    } catch {
      return [];
    }
  }
}

/**
 * LocationPicker - Smart geo location picker with city autocomplete
 *
 * Features:
 * - City-first search with autocomplete
 * - Auto-populates country when city is selected
 * - Stores lat/lng coordinates for cenotaphery placement
 * - GeoNames primary, Geoapify fallback
 * - Dark variant for wizard compatibility
 */
const LocationPicker = React.forwardRef<HTMLInputElement, LocationPickerProps>(
  (
    {
      value,
      onValueChange,
      placeholder = "Search for a city...",
      variant = "default",
      disabled = false,
      className,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [results, setResults] = React.useState<GeoSearchResult[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Forward ref
    React.useImperativeHandle(ref, () => inputRef.current!);

    // Display value - show city, country if we have a value
    const displayValue = React.useMemo(() => {
      if (!value?.city) return "";
      const parts = [value.city];
      if (value.country) parts.push(value.country);
      return parts.join(", ");
    }, [value]);

    // Debounced search
    React.useEffect(() => {
      if (searchQuery.length < MIN_SEARCH_LENGTH) {
        setResults([]);
        return;
      }

      const timeoutId = setTimeout(async () => {
        setIsLoading(true);
        try {
          const searchResults = await searchCities(searchQuery);
          setResults(searchResults);
        } catch {
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      }, DEBOUNCE_MS);

      return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleSelect = (result: GeoSearchResult) => {
      const newLocation: GeoLocation = {
        city: result.city,
        country: result.country,
        region: result.adminName || null, // State/province/region from GeoNames
        latitude: result.latitude,
        longitude: result.longitude,
        geoId: result.geoId,
      };
      onValueChange?.(newLocation);
      setSearchQuery("");
      setResults([]);
      setOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = e.target.value;
      setSearchQuery(newQuery);
      if (newQuery.length >= MIN_SEARCH_LENGTH) {
        setOpen(true);
      }
    };

    const handleClear = () => {
      onValueChange?.({
        city: null,
        country: null,
        region: null,
        latitude: null,
        longitude: null,
      });
      setSearchQuery("");
      setResults([]);
      inputRef.current?.focus();
    };

    const isDark = variant === "dark";

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className={cn("relative", className)}>
            <MapPin
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
                isDark ? "text-slate-400" : "text-marble-400"
              )}
            />
            <Input
              ref={inputRef}
              variant={variant}
              value={open ? searchQuery : displayValue}
              onChange={handleInputChange}
              onFocus={() => {
                if (searchQuery.length >= MIN_SEARCH_LENGTH || results.length > 0) {
                  setOpen(true);
                }
              }}
              placeholder={placeholder}
              disabled={disabled}
              className={cn("pl-10 pr-10", displayValue && !open && "text-marble-100")}
            />
            {isLoading && (
              <Loader2
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin",
                  isDark ? "text-slate-400" : "text-marble-400"
                )}
              />
            )}
            {!isLoading && displayValue && !open && (
              <button
                type="button"
                onClick={handleClear}
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2 text-sm",
                  isDark
                    ? "text-slate-400 hover:text-slate-300"
                    : "text-marble-400 hover:text-marble-600"
                )}
              >
                Clear
              </button>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          variant={variant}
          className="w-[--radix-popover-trigger-width] p-0"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command variant={variant} shouldFilter={false}>
            <CommandList>
              {isLoading && (
                <div
                  className={cn(
                    "py-6 text-center text-sm",
                    isDark ? "text-slate-400" : "text-marble-500"
                  )}
                >
                  Searching...
                </div>
              )}
              {!isLoading && searchQuery.length >= MIN_SEARCH_LENGTH && results.length === 0 && (
                <CommandEmpty variant={variant}>No cities found</CommandEmpty>
              )}
              {!isLoading && searchQuery.length > 0 && searchQuery.length < MIN_SEARCH_LENGTH && (
                <div
                  className={cn(
                    "py-6 text-center text-sm",
                    isDark ? "text-slate-400" : "text-marble-500"
                  )}
                >
                  Type at least {MIN_SEARCH_LENGTH} characters to search
                </div>
              )}
              {results.length > 0 && (
                <CommandGroup variant={variant}>
                  {results.map((result, index) => (
                    <CommandItem
                      key={`${result.displayName}-${result.geoId || index}`}
                      value={result.displayName}
                      onSelect={() => handleSelect(result)}
                      variant={variant}
                    >
                      <MapPin className="mr-2 h-4 w-4 text-gold-500 shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="truncate font-medium">{result.city}</span>
                        <span
                          className={cn(
                            "text-xs truncate",
                            isDark ? "text-slate-400" : "text-marble-500"
                          )}
                        >
                          {result.adminName
                            ? `${result.adminName}, ${result.country}`
                            : result.country}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);
LocationPicker.displayName = "LocationPicker";

export { LocationPicker };
