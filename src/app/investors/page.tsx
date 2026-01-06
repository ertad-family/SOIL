"use client";

import Link from "next/link";
import { SectionLabel } from "@/components/ui/section-label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Construction, ArrowRight, Mail, TrendingUp } from "lucide-react";
import { siteConfig, mailtoLink } from "@/lib/site-config";

export default function InvestorsPage() {
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
            Invest in SOIL
          </h1>
          <p className="text-lg text-slate-400 mb-8 leading-relaxed">
            We&apos;re preparing our investor relations materials. If you&apos;re interested in
            supporting SOIL&apos;s mission to preserve organizational wisdom, please reach out
            directly.
          </p>

          {/* What We're Building */}
          <Card variant="dark" padding="lg" className="text-left mb-8">
            <h2 className="font-display text-lg font-medium text-marble-100 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gold-400" />
              What We&apos;re Building
            </h2>
            <ul className="space-y-3 text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                The first systematic archive of organizational mortality data
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                AI-powered analysis of failure patterns and lessons learned
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                Research platform for organizational medicine
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                Community-driven knowledge preservation
              </li>
            </ul>
          </Card>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={mailtoLink("investors", "Investment Inquiry")}>
              <Button variant="dark-primary" size="lg" rightIcon={<Mail className="w-5 h-5" />}>
                Contact Us
              </Button>
            </a>
            <Link href="/research">
              <Button
                variant="dark-secondary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Learn About Our Research
              </Button>
            </Link>
          </div>

          {/* Note */}
          <p className="text-sm text-slate-500 mt-8">
            Pitch deck and detailed financials available upon request.
          </p>
        </div>
      </div>
    </section>
  );
}
