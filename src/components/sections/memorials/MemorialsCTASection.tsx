"use client";

import Link from "next/link";
import { Clock, Shield, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Call-to-action section encouraging users to share their story
 */
export function MemorialsCTASection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-3xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-marble-100 mb-6">
          Your story deserves a place too
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl text-slate-400 mb-8 leading-relaxed">
          Sharing your experience is an act of dignity.
          <br className="hidden md:block" />
          Your story becomes part of research that helps others.
        </p>

        {/* CTA Button */}
        <Link href="/organization/create">
          <Button variant="dark-primary" size="xl" className="mb-8">
            Share your story
          </Button>
        </Link>

        {/* Supporting info */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>~2 hours to complete</span>
          </div>
          <div className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            <span>Save and return anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Private by default</span>
          </div>
        </div>
      </div>
    </section>
  );
}
