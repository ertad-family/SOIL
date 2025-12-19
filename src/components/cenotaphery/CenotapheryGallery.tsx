"use client";

import { CenotaphCard } from "./CenotaphCard";
import { cn } from "@/lib/utils";

interface Cenotaph {
  id: string;
  organizationName: string;
  isPrivate?: boolean;
  organizationType: string | null;
  industry: string | null;
  epitaph: string | null;
  foundedDate: string | null;
  closedDate: string | null;
  location: string | null;
  cenotaphImageUrl: string;
  organizationId: string | null;
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
        className
      )}
    >
      {cenotaphs.map((cenotaph) => (
        <CenotaphCard
          key={cenotaph.id}
          id={cenotaph.id}
          organizationName={cenotaph.organizationName}
          isPrivate={cenotaph.isPrivate}
          organizationType={cenotaph.organizationType}
          industry={cenotaph.industry}
          epitaph={cenotaph.epitaph}
          foundedDate={cenotaph.foundedDate}
          closedDate={cenotaph.closedDate}
          location={cenotaph.location}
          cenotaphImageUrl={cenotaph.cenotaphImageUrl}
          organizationId={cenotaph.organizationId}
        />
      ))}
    </div>
  );
}

export default CenotapheryGallery;
