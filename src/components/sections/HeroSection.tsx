"use client";

import Link from "next/link";
import { Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlossaryTerm } from "@/components/ui/glossary-term";

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-[3fr_1fr] gap-12 lg:gap-16 items-end">
          {/* Left: Headline + Subheadline */}
          <div className="animate-fade-in-up">
            <h1 className="font-display text-4xl md:text-6xl lg:text-[100px] font-semibold leading-[1.1] text-marble-100">
              <span className="text-gradient-gold">Honor Your Venture. </span>
              <span className="text-marble-100">Help Others Learn. Advance the Science.</span>
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-marble-300 font-light">
              For founders who&apos;ve closed their ventures - and those seeking their wisdom
            </p>
          </div>

          {/* Right: Description and CTAs */}
          <div className="animate-fade-in-up stagger-1">
            <p className="text-slate-400 leading-relaxed mb-4">
              Your investment of time, money, and passion deserves more than your silent grief.
              Share your story - find closure while helping future founders avoid the same path.
            </p>
            <p className="text-slate-400 leading-relaxed mb-8">
              SOIL is building the world&apos;s first database of{" "}
              <GlossaryTerm term="Autopsy">organizational autopsies</GlossaryTerm>. Your experience
              becomes sniper-matched guidance for others facing similar challenges.
            </p>

            <div className="flex flex-col gap-4">
              <Link href="/organization/create">
                <Button
                  variant="dark-primary"
                  size="lg"
                  className="w-full sm:w-auto"
                  rightIcon={<Sprout className="w-5 h-5" />}
                >
                  Donate Your Story
                </Button>
              </Link>
              <Link href="/cenotaphery">
                <Button variant="dark-secondary" size="lg" className="w-full sm:w-auto">
                  Learn from Others
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width decorative divider under entire section */}
      <div className="divider-roman mt-24 md:mt-32 animate-fade-in-up stagger-3">
        <span className="text-gold-400 font-serif text-sm tracking-[0.3em] px-6">MMXXV</span>
      </div>
    </section>
  );
}
