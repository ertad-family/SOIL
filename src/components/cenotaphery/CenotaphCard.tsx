"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Calendar, Building2, Briefcase, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface CenotaphCardProps {
  id: string;
  slug: string;
  organizationName: string;
  organizationType: string | null;
  industry: string | null;
  epitaph: string | null;
  foundedDate: string | null;
  closedDate: string | null;
  location: string | null;
  cenotaphImageUrl: string;
  organizationId: string | null;
  className?: string;
  style?: React.CSSProperties;
}

// Map org types to display labels
const ORG_TYPE_LABELS: Record<string, string> = {
  tech_product: "Tech Product",
  services: "Services",
  ecommerce: "E-commerce",
  manufacturing: "Manufacturing",
  ngo: "NGO",
  media: "Media",
};

/**
 * CenotaphCard - A memorial card for the cenotaphery gallery
 *
 * Design: Roman heritage meets ultra-modern
 * - Marble frame effect with gold accents
 * - Variable height based on epitaph length (masonry-friendly)
 * - Hover state with subtle lift and glow
 * - Links to organization public page
 */
export function CenotaphCard({
  organizationName,
  organizationType,
  industry,
  epitaph,
  foundedDate,
  closedDate,
  location,
  cenotaphImageUrl,
  organizationId,
  className,
  style,
}: CenotaphCardProps) {
  // Format date range
  const formatDateRange = () => {
    if (!foundedDate && !closedDate) return null;

    const formatYear = (date: string | null) => {
      if (!date) return "?";
      return new Date(date).getFullYear().toString();
    };

    return `${formatYear(foundedDate)} — ${formatYear(closedDate)}`;
  };

  const dateRange = formatDateRange();
  const orgTypeLabel = organizationType ? ORG_TYPE_LABELS[organizationType] : null;

  // Determine link destination
  const href = organizationId ? `/organization/${organizationId}` : "#";

  return (
    <Link
      href={href}
      className={cn(
        // Base styles - break-inside-avoid for masonry
        "block break-inside-avoid mb-6 group",
        className
      )}
      style={style}
    >
      <article
        className={cn(
          // Card container with marble frame effect
          "relative overflow-hidden rounded-lg",
          "bg-gradient-to-b from-slate-800 via-slate-800 to-slate-900",
          "border border-slate-700/80",
          // Left gold accent (Roman tablet motif)
          "border-l-[3px] border-l-gold-500/70",
          // Shadow and hover effects
          "shadow-[0_2px_8px_rgba(0,0,0,0.2),0_8px_24px_rgba(196,161,90,0.08)]",
          "transition-all duration-300 ease-out",
          "hover:border-l-gold-400",
          "hover:shadow-[0_4px_12px_rgba(0,0,0,0.25),0_12px_32px_rgba(196,161,90,0.15)]",
          "hover:-translate-y-1"
        )}
      >
        {/* Cenotaph Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={cenotaphImageUrl}
            alt={`Cenotaph for ${organizationName}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-60" />

          {/* Organization type badge */}
          {orgTypeLabel && (
            <div className="absolute top-3 right-3">
              <Badge variant="dark-marble" size="sm" className="backdrop-blur-sm bg-slate-900/70">
                {orgTypeLabel}
              </Badge>
            </div>
          )}

          {/* Decorative corner ornaments */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-gold-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-gold-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          {/* Organization Name */}
          <h3 className="font-display text-lg font-medium text-marble-100 leading-tight group-hover:text-gold-300 transition-colors duration-300">
            {organizationName}
          </h3>

          {/* Epitaph - Variable height, key for masonry effect */}
          {epitaph && (
            <p className="text-slate-400 text-sm leading-relaxed italic font-serif">
              &ldquo;{epitaph}&rdquo;
            </p>
          )}

          {/* Metadata row */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
            {dateRange && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {dateRange}
              </span>
            )}

            {industry && (
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                {industry}
              </span>
            )}

            {location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {location}
              </span>
            )}
          </div>

          {/* Bottom decorative line */}
          <div className="pt-2">
            <div className="h-px bg-gradient-to-r from-gold-500/30 via-gold-500/10 to-transparent" />
          </div>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-t from-gold-500/5 to-transparent" />
        </div>
      </article>
    </Link>
  );
}

export default CenotaphCard;
