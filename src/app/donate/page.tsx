"use client";

import Link from "next/link";
import { SectionLabel } from "@/components/ui/section-label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Construction, ArrowRight, Mail, Heart } from "lucide-react";

export default function DonatePage() {
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
            Support SOIL
          </h1>
          <p className="text-lg text-slate-400 mb-8 leading-relaxed">
            We&apos;re setting up our donation infrastructure. Soon you&apos;ll be able to support
            SOIL&apos;s mission with one-time or recurring contributions.
          </p>

          {/* What Your Support Enables */}
          <Card variant="dark" padding="lg" className="text-left mb-8">
            <h2 className="font-display text-lg font-medium text-marble-100 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-gold-400" />
              What Your Support Enables
            </h2>
            <ul className="space-y-3 text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                Platform development and maintenance
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                Research initiatives and data analysis
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                Community programs and events
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                Free access for founders worldwide
              </li>
            </ul>
          </Card>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:donate@soil.rip?subject=Donation Inquiry">
              <Button variant="dark-primary" size="lg" rightIcon={<Mail className="w-5 h-5" />}>
                Get Notified When Ready
              </Button>
            </a>
            <Link href="/volunteer">
              <Button
                variant="dark-secondary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Contribute Your Time Instead
              </Button>
            </Link>
          </div>

          {/* Note */}
          <p className="text-sm text-slate-500 mt-8">
            100% of donations will go directly to platform development, research, and community
            programs.
          </p>
        </div>
      </div>
    </section>
  );
}
