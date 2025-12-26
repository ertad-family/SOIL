"use client";

import Link from "next/link";
import { SectionLabel } from "@/components/ui/section-label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Construction, ArrowRight, Mail, Award } from "lucide-react";

export default function SponsorsPage() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          {/* Under Construction Icon */}
          <div className="w-20 h-20 rounded-full bg-gold-500/20 flex items-center justify-center mx-auto mb-8 animate-pulse">
            <Construction className="w-10 h-10 text-gold-400" />
          </div>

          <SectionLabel>coming soon</SectionLabel>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-wide mt-4 mb-6 text-marble-100">
            Sponsor SOIL
          </h1>
          <p className="text-lg text-slate-400 mb-8 leading-relaxed">
            We&apos;re developing our sponsorship program. Soon you&apos;ll be able to fund specific
            features, research projects, or regional cenotapheries — with your name immortalized in
            the platform.
          </p>

          {/* Sponsorship Opportunities */}
          <Card variant="dark" padding="lg" className="text-left mb-8">
            <h2 className="font-display text-lg font-medium text-marble-100 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-gold-400" />
              Sponsorship Opportunities
            </h2>
            <ul className="space-y-3 text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                Feature sponsorship — fund specific platform capabilities
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                Research projects — support specific studies or analyses
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                Regional cenotapheries — establish local memorial spaces
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                Community events — sponsor Day of the Dead Venture gatherings
              </li>
            </ul>
          </Card>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:sponsors@soil.rip?subject=Sponsorship Inquiry">
              <Button variant="dark-primary" size="lg" rightIcon={<Mail className="w-5 h-5" />}>
                Discuss Sponsorship
              </Button>
            </a>
            <Link href="/community">
              <Button
                variant="dark-secondary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Explore Other Ways to Help
              </Button>
            </Link>
          </div>

          {/* Note */}
          <p className="text-sm text-slate-500 mt-8">
            All sponsors receive permanent recognition in the Cenotaphery and platform credits.
          </p>
        </div>
      </div>
    </section>
  );
}
