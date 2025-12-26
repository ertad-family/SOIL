"use client";

import { useState } from "react";
import { Users, Shield, Code, GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const communityFeatures = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "Founders",
    description: "Share your story, connect with peers, offer consultations.",
    steps: ["Create your cenotaph", "Join the consultation network", "Connect with peers"],
    cta: { label: "Create Your Cenotaph", href: "/organization/create" },
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: "Researchers",
    description: "Access unique datasets on organizational mortality.",
    steps: ["Explore research program", "Propose your project", "Access anonymized data"],
    cta: { label: "Explore Research", href: "/research" },
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Keepers",
    description: "Lead regional communities and organize events.",
    steps: ["Apply as Keeper", "Train with a Senior", "Lead your region"],
    cta: { label: "Become a Keeper", href: "/keepers" },
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "Volunteers",
    description: "Help build the platform and community.",
    steps: ["Explore open tasks", "Pick your contribution", "Join the team"],
    cta: { label: "Volunteer", href: "/volunteer" },
  },
];

export function CommunitySection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-16 md:py-24 bg-marble-900">
      <div className="max-w-content mx-auto px-6">
        {/* Header: Two columns */}
        <div className="grid lg:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-8 mb-16">
          {/* Left: Label + Title */}
          <div>
            {/*<SectionLabel>community</SectionLabel>*/}
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium mt-4 text-marble-100 leading-tight">
              The Heart of SOIL: building together
            </h2>
          </div>

          {/* Right: Large outline text + description */}
          <div>
            {/* Large outline "SOIL" text */}
            <span
              aria-hidden="true"
              className="font-display text-6xl md:text-7xl lg:text-8xl font-medium select-none leading-none [color:transparent] [-webkit-text-stroke:1.5px_rgba(226,176,85,0.3)]"
            >
              COMMUNITY
            </span>
            <p className="text-marble-100 text-lg leading-relaxed mt-4">
              Our success is measured by the strength of our community. Together, we transform
              individual efforts into collective wisdom that benefits future generations.
            </p>
          </div>
        </div>
      </div>

      {/* Content: Full-width left image, contained right tabs */}
      <div className="grid lg:grid-cols-2 gap-6 min-h-[500px]">
        {/* Left: Dynamic content panel */}
        <div className="relative rounded-r-2xl overflow-hidden bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border border-slate-700/50 border-l-0">
          {(() => {
            const feature = communityFeatures[activeIndex];
            return (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8 max-w-md">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400">
                    {feature.icon}
                  </div>
                  <h3 className="font-display text-2xl font-medium text-marble-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-lg mb-6">{feature.description}</p>

                  {/* Steps */}
                  <div className="space-y-2 mb-6 text-left inline-block">
                    <p className="text-sm font-medium text-gold-400/80 mb-3">How to participate:</p>
                    {feature.steps.map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-400 text-xs flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-slate-300 text-sm">{step}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="block">
                    <a href={feature.cta.href}>
                      <Button
                        variant="dark-secondary"
                        size="md"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        {feature.cta.label}
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            );
          })()}
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none" />
        </div>

        {/* Right: Feature cards (tabs) - contained */}
        <div className="flex flex-col gap-4 px-6 lg:pl-0 lg:pr-[max(1.5rem,calc((100vw-1200px)/2+1.5rem))]">
          {communityFeatures.map((feature, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`text-left p-6 rounded-xl border transition-all duration-300 ${
                activeIndex === index
                  ? "bg-slate-800/80 border-gold-500/50 border-l-[3px] border-l-gold-500"
                  : "bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    activeIndex === index
                      ? "bg-gold-500/20 text-gold-400"
                      : "bg-slate-700/50 text-slate-400"
                  }`}
                >
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-display text-lg font-medium text-marble-100 mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </button>
          ))}

          {/* CTA to Community page */}
          <a href="/community" className="mt-2">
            <Button
              variant="dark-primary"
              size="lg"
              className="w-full"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              See all ways to contribute
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
