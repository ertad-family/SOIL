"use client";

import Image from "next/image";
import { Calendar, MapPin, Briefcase } from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/utils";

// Blur placeholder for smooth image loading (matches CenotaphCard)
const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNTMiIHZpZXdCb3g9IjAgMCA0MCA1MyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMWUyOTNiIi8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiMzMzQxNTUiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwZjE3MjkiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNTMiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=";

interface FeaturedStory {
  id: string;
  quote: string;
  companyName: string;
  isPrivate?: boolean;
  years: string;
  location: string;
  industry: string;
  industryColor: string;
  cenotaphImageUrl?: string | null;
  respects: number;
}

interface FeaturedStoriesSectionProps {
  stories: FeaturedStory[];
}

/**
 * Story card component with cenotaph image and design system styling
 * Design: Roman heritage meets ultra-modern, matching CenotaphCard styling
 */
function StoryCard({ story }: { story: FeaturedStory }) {
  return (
    <article
      className={cn(
        // Base styles - consistent with CenotaphCard
        "group relative flex flex-col overflow-hidden rounded-lg",
        "bg-gradient-to-b from-slate-800 via-slate-800 to-slate-900",
        "border border-slate-700/80",
        // Left gold accent (Roman tablet motif)
        "border-l-[3px] border-l-gold-500/70",
        // Shadow and hover effects
        "shadow-[0_2px_8px_rgba(0,0,0,0.2),0_8px_24px_rgba(196,161,90,0.08)]",
        "transition-all duration-300 ease-out",
        "hover:border-l-gold-400",
        "hover:shadow-[0_4px_12px_rgba(0,0,0,0.25),0_12px_32px_rgba(196,161,90,0.15)]",
        "hover:-translate-y-1",
        // Card size for mobile scroll
        "min-w-[280px] md:min-w-0"
      )}
    >
      {/* Cenotaph Image */}
      {story.cenotaphImageUrl && (
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={story.cenotaphImageUrl}
            alt={
              story.isPrivate
                ? "Cenotaph for a private organization"
                : `Cenotaph for ${story.companyName}`
            }
            fill
            sizes="(max-width: 640px) 280px, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            loading="lazy"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent opacity-50" />

          {/* Decorative corner ornaments */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-gold-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-gold-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Industry badge - design system styling */}
          <div className="absolute top-3 right-3 px-2 py-1 rounded bg-slate-900/80 backdrop-blur-sm border border-slate-700/50">
            <span className="flex items-center gap-1.5 text-xs font-medium text-gold-400">
              <Briefcase className="w-3 h-3" />
              {story.industry}
            </span>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="flex-1 p-4 space-y-3">
        {/* Quote / Epitaph */}
        <blockquote className="text-slate-400 text-sm leading-relaxed italic font-serif">
          &ldquo;{story.quote}&rdquo;
        </blockquote>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-gold-500/30 via-gold-500/10 to-transparent" />

        {/* Company info */}
        <div className="space-y-1">
          <h3
            className={cn(
              "font-display text-base font-medium leading-tight transition-colors duration-300",
              story.isPrivate
                ? "text-slate-400 group-hover:text-slate-300"
                : "text-marble-100 group-hover:text-gold-300"
            )}
            title={story.isPrivate ? "This organization has chosen to remain private" : undefined}
          >
            {story.companyName}
          </h3>

          {/* Metadata row */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {story.years}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {story.location}
            </span>
          </div>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-t from-gold-500/5 to-transparent" />
      </div>
    </article>
  );
}

/**
 * Featured Stories section displaying notable cenotaph stories with images
 * Shows 6 stories on desktop (2 rows of 3), 4 on mobile (horizontal scroll)
 */
export function FeaturedStoriesSection({ stories }: FeaturedStoriesSectionProps) {
  // Show only first 4 on mobile scroll, all 6 on desktop grid
  const mobileStories = stories.slice(0, 4);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-content mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <SectionLabel>wisdom</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-4 text-marble-100">
            Stories that teach
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl">
            Each ending carries lessons. These organizations shared their stories so others might
            learn from their journey.
          </p>
        </div>

        {/* Mobile: Horizontal scroll (4 stories) */}
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 md:hidden scrollbar-hide">
          {mobileStories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>

        {/* Desktop: 3-column grid (6 stories) */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </section>
  );
}
