"use client";

import { CenotaphCard } from "./CenotaphCard";
import { cn } from "@/lib/utils";

interface Cenotaph {
  id: string;
  slug: string;
  organization_name: string;
  organization_type: string | null;
  industry: string | null;
  epitaph: string | null;
  founded_date: string | null;
  closed_date: string | null;
  location: string | null;
  cenotaph_image_url: string;
  organization_id: string | null;
}

interface CenotapheryGalleryProps {
  cenotaphs: Cenotaph[];
  className?: string;
}

/**
 * CenotapheryGallery - Masonry grid layout for cenotaph cards
 *
 * Uses CSS columns for true masonry effect:
 * - 1 column on mobile
 * - 2 columns on tablet
 * - 3 columns on desktop
 * - 4 columns on wide screens
 *
 * Cards naturally have different heights based on epitaph length.
 */
export function CenotapheryGallery({ cenotaphs, className }: CenotapheryGalleryProps) {
  return (
    <div
      className={cn(
        // CSS columns-based masonry
        "columns-1 md:columns-2 lg:columns-3 xl:columns-4",
        "gap-6",
        // Animation for cards
        "[&>*]:animate-fade-in",
        className
      )}
    >
      {cenotaphs.map((cenotaph, index) => (
        <CenotaphCard
          key={cenotaph.id}
          id={cenotaph.id}
          slug={cenotaph.slug}
          organizationName={cenotaph.organization_name}
          organizationType={cenotaph.organization_type}
          industry={cenotaph.industry}
          epitaph={cenotaph.epitaph}
          foundedDate={cenotaph.founded_date}
          closedDate={cenotaph.closed_date}
          location={cenotaph.location}
          cenotaphImageUrl={cenotaph.cenotaph_image_url}
          organizationId={cenotaph.organization_id}
          // Stagger animation delay
          style={{ animationDelay: `${index * 50}ms` }}
        />
      ))}
    </div>
  );
}

export default CenotapheryGallery;
