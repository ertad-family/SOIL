"use client";

import { useState, useEffect, useRef } from "react";

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  delay?: number;
}

/**
 * Animated counter that counts up from 0 to the target value
 */
function AnimatedCounter({ end, duration = 2000, delay = 600 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const startTime = Date.now() + delay;
    const step = () => {
      const now = Date.now();
      if (now < startTime) {
        requestAnimationFrame(step);
        return;
      }

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic for natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [end, duration, delay]);

  return <span>{count.toLocaleString()}</span>;
}

interface MemorialsHeroSectionProps {
  stats: {
    countries: number;
    cities: number;
    founders: number;
    organizations: number;
  };
}

/**
 * Hero section for the Memorials page
 * Features animated title, subtitle, and statistics counters
 */
export function MemorialsHeroSection({ stats }: MemorialsHeroSectionProps) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 z-10">
      {/* Content */}
      <div className="max-w-4xl mx-auto text-center">
        {/* Main heading */}
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-wide text-marble-100">
          Every ending deserves dignity
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg md:text-xl lg:text-2xl text-slate-400 max-w-2xl mx-auto">
          A global memorial where organizations find rest
          <br className="hidden md:block" /> and their stories become immortal wisdom
        </p>

        {/* Statistics */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 md:gap-8 text-lg md:text-xl">
          <div className="flex items-center gap-2">
            <span className="font-mono text-2xl md:text-3xl font-bold text-gold-400">
              [<AnimatedCounter end={stats.countries} />]
            </span>
            <span className="text-slate-400">countries</span>
          </div>

          <span className="text-slate-600 hidden md:inline">·</span>

          <div className="flex items-center gap-2">
            <span className="font-mono text-2xl md:text-3xl font-bold text-gold-400">
              [<AnimatedCounter end={stats.cities} delay={700} />]
            </span>
            <span className="text-slate-400">cities</span>
          </div>

          <span className="text-slate-600 hidden md:inline">·</span>

          <div className="flex items-center gap-2">
            <span className="font-mono text-2xl md:text-3xl font-bold text-gold-400">
              [<AnimatedCounter end={stats.founders} delay={900} />]
            </span>
            <span className="text-slate-400">founders</span>
          </div>

          <span className="text-slate-600 hidden md:inline">·</span>

          <div className="flex items-center gap-2">
            <span className="font-mono text-2xl md:text-3xl font-bold text-gold-400">
              [<AnimatedCounter end={stats.organizations} delay={1100} />]
            </span>
            <span className="text-slate-400">organizations</span>
          </div>
        </div>
      </div>

      {/* Decorative divider at bottom - clickable to scroll */}
      <button
        onClick={() => {
          window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth",
          });
        }}
        className="absolute bottom-20 left-0 right-0 cursor-pointer hover:opacity-80 transition-opacity"
        aria-label="Scroll to explore"
      >
        <div className="divider-roman">
          <span className="text-gold-400 font-serif text-sm tracking-[0.3em] px-6">EXPLORE</span>
        </div>
      </button>
    </section>
  );
}
