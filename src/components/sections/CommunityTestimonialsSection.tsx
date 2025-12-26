"use client";

import { useState, useEffect } from "react";

interface Testimonial {
  id: string;
  content: string;
  rating: number | null;
  display_name: string | null;
}

const MIN_TESTIMONIALS_TO_SHOW = 5;

function StarRating() {
  return (
    <div className="flex gap-1 text-gold-500 text-xl mb-3">
      {[...Array(5)].map((_, i) => (
        <span key={i} className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
          ✦
        </span>
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="p-5 bg-slate-800/40 rounded-lg border border-slate-700/50 break-inside-avoid mb-4">
      {testimonial.display_name && (
        <p className="text-marble-100 font-medium mb-2">{testimonial.display_name}</p>
      )}
      <StarRating />
      <p className="text-slate-400 text-sm leading-relaxed">{testimonial.content}</p>
    </div>
  );
}

export function CommunityTestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        // Fetch both general and story_contribution testimonials in parallel
        const [generalRes, storyRes] = await Promise.all([
          fetch("/api/testimonials?type=general&limit=20"),
          fetch("/api/testimonials?type=story_contribution&limit=20"),
        ]);

        const [generalData, storyData] = await Promise.all([generalRes.json(), storyRes.json()]);

        const combined: Testimonial[] = [
          ...(generalData.success ? generalData.testimonials : []),
          ...(storyData.success ? storyData.testimonials : []),
        ];

        setTestimonials(combined);
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  // Hide section if loading or less than minimum testimonials
  if (isLoading || testimonials.length < MIN_TESTIMONIALS_TO_SHOW) {
    return null;
  }

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center gap-2 text-gold-500 text-3xl mb-4">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
                ✦
              </span>
            ))}
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-marble-100 leading-tight">
            Community voices: hear from founders
            <br />
            who shared their stories
          </h2>
        </div>

        {/* Masonry grid */}
        <div className="columns-1 sm:columns-2 lg:columns-4 gap-4">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
