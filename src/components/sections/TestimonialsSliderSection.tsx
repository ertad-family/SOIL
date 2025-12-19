"use client";

import { useState } from "react";
import { SectionLabel } from "@/components/ui/section-label";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Sharing my story with SOIL was unexpectedly healing. The interview framework helped me see patterns I had missed while living through the chaos. This isn't just data collection — it's a form of closure.",
    author: "Sarah Chen",
    role: "Former CEO, TechStart Inc.",
  },
  {
    quote:
      "I was skeptical at first, but the anonymization gave me confidence to be completely honest. Knowing my experience might help future founders avoid the same mistakes made it worthwhile.",
    author: "Marcus Webb",
    role: "Serial Entrepreneur",
  },
  {
    quote:
      "The structured reflection process helped me understand why we failed, not just how. That insight is invaluable for my next venture. I recommend SOIL to every founder winding down.",
    author: "Elena Rodriguez",
    role: "Founder, GreenPath Solutions",
  },
  {
    quote:
      "Finally, a place where failure isn't stigmatized but studied. SOIL treats organizational endings with the dignity they deserve. My company's story now contributes to something larger.",
    author: "David Kim",
    role: "Co-founder, DataSync",
  },
];

// Quote icon SVG
function QuoteIcon() {
  return (
    <svg
      width="48"
      height="36"
      viewBox="0 0 48 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-marble-300 mb-8"
    >
      <path
        d="M0 36V22.5C0 18.3 0.9 14.475 2.7 11.025C4.5 7.575 7.2 4.35 10.8 1.35L16.2 5.85C14.1 7.65 12.375 9.6 11.025 11.7C9.675 13.8 9 16.05 9 18.45H16.5V36H0ZM27 36V22.5C27 18.3 27.9 14.475 29.7 11.025C31.5 7.575 34.2 4.35 37.8 1.35L43.2 5.85C41.1 7.65 39.375 9.6 38.025 11.7C36.675 13.8 36 16.05 36 18.45H43.5V36H27Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TestimonialsSliderSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Gradient background: marble-900 -> slate-900 (inverse of previous transition) */}
      <div className="absolute inset-0 bg-gradient-to-b from-marble-900 via-slate-800/50 to-slate-900 pointer-events-none" />
      <div className="max-w-content mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_500px] gap-6 min-h-[500px] lg:min-h-[600px]">
          {/* Left side - Testimonial Card (full width/height with accent) */}
          <div className="relative bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border border-slate-700/80 border-l-[3px] border-l-gold-500 rounded-xl p-8 lg:p-12 flex flex-col justify-between">
            <div>
              <QuoteIcon />

              <div className="min-h-[180px]">
                <p className="text-marble-100 text-xl md:text-2xl leading-relaxed mb-8 transition-opacity duration-300">
                  {currentTestimonial.quote}
                </p>
                <span className="text-slate-400 text-base">
                  - {currentTestimonial.author}, {currentTestimonial.role}
                </span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-2 mt-8">
              <button
                onClick={prevSlide}
                className="w-12 h-12 rounded-full bg-slate-700/50 hover:bg-slate-700 flex items-center justify-center transition-colors border border-slate-600/50"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 text-marble-300" />
              </button>
              <button
                onClick={nextSlide}
                className="w-12 h-12 rounded-full bg-slate-700/50 hover:bg-slate-700 flex items-center justify-center transition-colors border border-slate-600/50"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 text-marble-300" />
              </button>
            </div>
          </div>

          {/* Right side - Content with background */}
          <div className="relative overflow-hidden rounded-xl">
            {/* Gradient background placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold-600/20 via-slate-700 to-slate-800">
              {/* Abstract pattern overlay */}
              <div className="absolute inset-0 opacity-30">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 400 500"
                  preserveAspectRatio="xMidYMid slice"
                >
                  {[...Array(20)].map((_, i) => (
                    <path
                      key={i}
                      d={`M${-50 + i * 25} 0 Q${100 + i * 25} 250 ${-50 + i * 25} 500`}
                      fill="none"
                      stroke="rgba(196, 161, 90, 0.3)"
                      strokeWidth="1"
                    />
                  ))}
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-8 lg:p-12 h-full flex flex-col justify-between">
              <div>
                <SectionLabel className="text-gold-400">testimonials</SectionLabel>
                <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-medium mt-4 text-marble-100 leading-tight">
                  Hear what founders say about sharing their story
                </h2>
              </div>

              {/* Counter */}
              <div className="mt-auto pt-12">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-5xl md:text-6xl font-medium text-marble-100/80">
                    500
                  </span>
                  <span className="font-display text-4xl md:text-5xl font-medium text-marble-100/80">
                    +
                  </span>
                </div>
                <span className="text-marble-300 text-base mt-2 block">
                  Founders joined our community
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
