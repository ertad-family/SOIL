"use client";

import { SectionLabel } from "@/components/ui/section-label";
import { Button } from "@/components/ui/button";
import { GlossaryTerm } from "@/components/ui/glossary-term";

const methodologySteps = [
  {
    title: "Data Collection",
    description:
      "Our Interview Framework captures comprehensive organizational data through 6 structured modules - from functional mapping to founder narrative.",
  },
  {
    title: "Anonymization",
    description:
      "Privacy by default. All sensitive information is protected, ensuring safe participation for every contributor.",
  },
  {
    title: "Pattern Emergence",
    description:
      "Framework-agnostic analysis lets the data speak. We avoid imposing theories, allowing patterns to emerge naturally.",
  },
  {
    title: "Open Research",
    description:
      "Anonymized datasets available to researchers worldwide, enabling collaborative advancement of organizational science.",
  },
  {
    title: "Machine Learning",
    description:
      "Building specialized AI models trained on organizational data for future diagnostic and analytical tools.",
  },
];

export function MethodologySection() {
  return (
    <section className="py-16 md:py-24 animate-fade-in-up">
      <div className="max-w-content mx-auto px-6">
        {/* Hero: Two-column layout with subgrid for alignment */}
        <div className="grid lg:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-8 mb-16 md:mb-24">
          {/* Row 1: Label + Title | Description */}
          <div>
            <SectionLabel>methodology</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium mt-4 text-marble-100 leading-tight">
              Systematic approach to organization research at scale
            </h2>
          </div>

          <div>
            <p className="text-marble-100 text-lg leading-relaxed mb-6">
              SOIL is building the world&apos;s first systematic database of{" "}
              <GlossaryTerm term="Autopsy">organizational autopsies</GlossaryTerm>. We capture
              comprehensive data from founders who&apos;ve closed their ventures - not to judge, but
              to learn.
            </p>
            <p className="text-slate-400 text-lg leading-relaxed">
              Our proprietary Interview Framework guides founders through a structured reflection
              process across 6 modules: organizational mapping, financial analysis, timeline of
              events, environmental factors, founder context, and meaning-making narrative. Each
              module extracts actionable insights while providing therapeutic closure.
            </p>
          </div>

          {/* Row 2: Counter | Button - same row, aligned */}
          {/* Counter: 20k in Roman numeral style (X̄X̄ = 20,000) */}
          <div className="flex items-end">
            <div className="flex items-end gap-4">
              <span
                aria-hidden="true"
                className="relative font-serif text-7xl md:text-8xl lg:text-9xl font-normal select-none leading-none [color:transparent] [-webkit-text-stroke:1.5px_rgba(226,176,85,0.25)] before:absolute before:top-[0.05em] before:left-0 before:right-0 before:h-[2px] before:bg-[rgba(226,176,85,0.25)]"
              >
                XX
              </span>
              <span className="text-slate-400 text-lg pb-2 md:pb-3 lg:pb-4">
                <GlossaryTerm term="Autopsy">organization autopsies</GlossaryTerm> globally
                <br />
                is our minimal goal.
              </span>
            </div>
          </div>

          <div className="flex items-end pb-2 md:pb-3 lg:pb-4">
            <a href="#whitepaper" className="inline-block">
              <Button
                variant="dark-primary"
                size="lg"
                rightIcon={
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-5 h-5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                }
              >
                Read White Paper
              </Button>
            </a>
          </div>
        </div>

        {/* Methodology steps: 5 cards */}
        <div className="grid md:grid-cols-5 gap-6">
          {methodologySteps.map((step, index) => (
            <div
              key={index}
              className="relative p-6 bg-slate-800/30 rounded-xl border border-slate-700/50"
            >
              {/* Placeholder for custom icon */}
              <div className="w-16 h-16 mb-6 rounded-lg bg-slate-700/50 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border border-slate-500/50" />
              </div>

              <h3 className="font-display text-lg font-medium text-marble-100 mb-2">
                {step.title}
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
