"use client";

import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/utils";

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
}

interface FeaturedStoriesSectionProps {
  stories: FeaturedStory[];
}

/**
 * Story card component with industry color accent
 */
function StoryCard({ story }: { story: FeaturedStory }) {
  return (
    <div className="group relative flex flex-col p-6 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-slate-700 transition-all duration-300 min-w-[300px] md:min-w-0">
      {/* Industry color accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
        style={{ backgroundColor: story.industryColor }}
      />

      {/* Quote */}
      <blockquote className="flex-1 mt-2 mb-6">
        <p className="text-marble-100 text-lg leading-relaxed italic">
          &ldquo;{story.quote}&rdquo;
        </p>
      </blockquote>

      {/* Divider */}
      <div className="border-t border-slate-800 my-4" />

      {/* Company info */}
      <div className="space-y-1">
        <p
          className={cn("font-medium", story.isPrivate ? "text-slate-400" : "text-marble-100")}
          title={story.isPrivate ? "This organization has chosen to remain private" : undefined}
        >
          {story.companyName}
        </p>
        <p className="text-sm text-slate-400">
          {story.years} · {story.location}
        </p>
      </div>

      {/* Industry badge */}
      <div
        className="absolute top-4 right-4 px-2 py-1 rounded text-xs font-medium"
        style={{
          backgroundColor: `${story.industryColor}20`,
          color: story.industryColor,
        }}
      >
        {story.industry}
      </div>
    </div>
  );
}

/**
 * Featured Stories section displaying notable cenotaph stories
 */
export function FeaturedStoriesSection({ stories }: FeaturedStoriesSectionProps) {
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

        {/* Stories grid - horizontal scroll on mobile */}
        <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:overflow-visible scrollbar-hide">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </section>
  );
}
