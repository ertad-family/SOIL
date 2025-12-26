"use client";

import Link from "next/link";
import { SectionLabel } from "@/components/ui/section-label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Construction, ArrowRight, Mail, Lightbulb } from "lucide-react";

export default function ChallengesPage() {
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
            Challenges & Roadmap
          </h1>
          <p className="text-lg text-slate-400 mb-8 leading-relaxed">
            We&apos;re building a governance system where founding members can submit ideas, vote on
            priorities, and help shape SOIL&apos;s roadmap. This feature is under development.
          </p>

          {/* What's Coming */}
          <Card variant="dark" padding="lg" className="text-left mb-8">
            <h2 className="font-display text-lg font-medium text-marble-100 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-gold-400" />
              What&apos;s Coming
            </h2>
            <ul className="space-y-3 text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                Submit strategic and product challenges
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                Vote on roadmap priorities (founding members)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                Discuss solutions with the community
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                Track progress on accepted ideas
              </li>
            </ul>
          </Card>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:community@soil.rip?subject=Challenge Idea">
              <Button variant="dark-primary" size="lg" rightIcon={<Mail className="w-5 h-5" />}>
                Submit an Idea via Email
              </Button>
            </a>
            <Link href="/volunteer">
              <Button
                variant="dark-secondary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Volunteer to Help Build
              </Button>
            </Link>
          </div>

          {/* Founding Member Note */}
          <p className="text-sm text-slate-500 mt-8">
            Founding members (first 100 founders + early volunteers) will have exclusive voting
            rights on roadmap priorities.
          </p>
        </div>
      </div>
    </section>
  );
}
