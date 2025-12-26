"use client";

import { useState, useEffect } from "react";

interface Testimonial {
  id: string;
  content: string;
  rating: number | null;
  display_name: string | null;
}

// Fallback testimonials if no real ones in database
const fallbackTestimonials: Testimonial[] = [
  {
    id: "fallback-1",
    content:
      "Finally, a place where my experience matters. Sharing my story helped me process what happened and maybe help someone avoid the same mistakes.",
    rating: 5,
    display_name: "alex_founder",
  },
  {
    id: "fallback-2",
    content:
      "The interview process was surprisingly therapeutic. I expected it to be painful, but it felt more like closure. The framework really guides you through reflection.",
    rating: 5,
    display_name: "maria_ceo",
  },
  {
    id: "fallback-3",
    content:
      "As a researcher, the data quality here is remarkable. Real founders, real stories, structured in a way that actually enables pattern discovery.",
    rating: 5,
    display_name: "david_tech",
  },
  {
    id: "fallback-4",
    content:
      "I wish this existed when I was starting out. Learning from others' failures is just as important as learning from successes.",
    rating: 5,
    display_name: "sarah_ventures",
  },
  {
    id: "fallback-5",
    content:
      "Three startups, three different endings. SOIL helped me see the common threads I was blind to. Invaluable for my next venture.",
    rating: 5,
    display_name: "james_serial",
  },
  {
    id: "fallback-6",
    content:
      "The anonymization gave me confidence to be completely honest. No judgment, just contribution to collective knowledge.",
    rating: 5,
    display_name: "nina_advisor",
  },
  {
    id: "fallback-7",
    content:
      "Building something and watching it end is lonely. Here, I found a community that understands. We're not failures — we're data points for progress.",
    rating: 5,
    display_name: "chen_founder",
  },
  {
    id: "fallback-8",
    content:
      "Quick process, thoughtful questions. The team clearly understands what founders go through.",
    rating: 5,
    display_name: "marcus_ops",
  },
  {
    id: "fallback-9",
    content:
      "The cenotaph concept is beautiful. My company deserves to be remembered, not just forgotten. This gives it dignity.",
    rating: 5,
    display_name: "elena_startup",
  },
  {
    id: "fallback-10",
    content:
      "I recommend SOIL to every founder in my portfolio who's winding down. It's part of a healthy closure process.",
    rating: 5,
    display_name: "tom_investor",
  },
];

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
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const response = await fetch("/api/testimonials?type=community&limit=20");
        const data = await response.json();

        if (data.success && data.testimonials && data.testimonials.length > 0) {
          setTestimonials(data.testimonials);
        }
        // If no testimonials from API, keep showing fallbacks
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
        // Keep fallback testimonials on error
      } finally {
        setIsLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

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
