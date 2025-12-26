"use client";

import { SectionLabel } from "@/components/ui/section-label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GlossaryTerm } from "@/components/ui/glossary-term";
import { ArrowRight, Database, FlaskConical, FileText, Users } from "lucide-react";

// Custom SVG illustration for Researchers
function ResearchersIllustrationSVG() {
  return (
    <svg viewBox="0 0 300 300" className="w-full h-full" fill="none">
      {/* Data visualization / Research theme */}

      {/* Grid background */}
      <g stroke="rgba(147,112,219,0.1)" strokeWidth="0.5">
        {[...Array(10)].map((_, i) => (
          <line key={`h-${i}`} x1="30" y1={30 + i * 24} x2="270" y2={30 + i * 24} />
        ))}
        {[...Array(10)].map((_, i) => (
          <line key={`v-${i}`} x1={30 + i * 24} y1="30" x2={30 + i * 24} y2="270" />
        ))}
      </g>

      {/* Bar chart representation */}
      <g>
        {[
          { x: 60, h: 80 },
          { x: 90, h: 120 },
          { x: 120, h: 65 },
          { x: 150, h: 140 },
          { x: 180, h: 95 },
          { x: 210, h: 110 },
        ].map((bar, i) => (
          <rect
            key={i}
            x={bar.x}
            y={220 - bar.h}
            width="20"
            height={bar.h}
            fill={`rgba(147,112,219,${0.2 + i * 0.05})`}
            stroke="rgba(147,112,219,0.5)"
            strokeWidth="1"
          />
        ))}

        {/* Trend line */}
        <polyline
          points="70,180 100,140 130,190 160,120 190,160 220,130"
          fill="none"
          stroke="rgba(196,161,90,0.6)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points on trend line */}
        {[
          { cx: 70, cy: 180 },
          { cx: 100, cy: 140 },
          { cx: 130, cy: 190 },
          { cx: 160, cy: 120 },
          { cx: 190, cy: 160 },
          { cx: 220, cy: 130 },
        ].map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r="4" fill="rgba(196,161,90,0.8)" />
        ))}
      </g>

      {/* Central magnifying glass / research symbol */}
      <g transform="translate(150, 80)">
        <circle
          cx="0"
          cy="0"
          r="30"
          fill="rgba(147,112,219,0.1)"
          stroke="rgba(147,112,219,0.5)"
          strokeWidth="2"
        />
        <circle
          cx="0"
          cy="0"
          r="20"
          fill="none"
          stroke="rgba(147,112,219,0.3)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <line
          x1="22"
          y1="22"
          x2="40"
          y2="40"
          stroke="rgba(147,112,219,0.5)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Pattern inside lens */}
        <circle cx="-5" cy="-5" r="3" fill="rgba(147,112,219,0.4)" />
        <circle cx="5" cy="3" r="2" fill="rgba(147,112,219,0.3)" />
        <circle cx="-2" cy="8" r="2.5" fill="rgba(147,112,219,0.35)" />
      </g>

      {/* Connection nodes - representing collaboration */}
      <g>
        <circle
          cx="50"
          cy="70"
          r="8"
          fill="rgba(147,112,219,0.2)"
          stroke="rgba(147,112,219,0.4)"
          strokeWidth="1"
        />
        <circle
          cx="250"
          cy="80"
          r="10"
          fill="rgba(147,112,219,0.2)"
          stroke="rgba(147,112,219,0.4)"
          strokeWidth="1"
        />
        <circle
          cx="40"
          cy="200"
          r="6"
          fill="rgba(147,112,219,0.2)"
          stroke="rgba(147,112,219,0.4)"
          strokeWidth="1"
        />
        <circle
          cx="260"
          cy="180"
          r="8"
          fill="rgba(147,112,219,0.2)"
          stroke="rgba(147,112,219,0.4)"
          strokeWidth="1"
        />

        {/* Connection lines */}
        <line
          x1="50"
          y1="70"
          x2="120"
          y2="80"
          stroke="rgba(147,112,219,0.2)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <line
          x1="250"
          y1="80"
          x2="180"
          y2="80"
          stroke="rgba(147,112,219,0.2)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      </g>

      {/* Document/publication symbols */}
      <g transform="translate(240, 240)">
        <rect
          x="-15"
          y="-20"
          width="30"
          height="40"
          fill="rgba(196,161,90,0.15)"
          stroke="rgba(196,161,90,0.4)"
          strokeWidth="1"
          rx="2"
        />
        <line x1="-10" y1="-12" x2="10" y2="-12" stroke="rgba(196,161,90,0.3)" strokeWidth="1" />
        <line x1="-10" y1="-4" x2="8" y2="-4" stroke="rgba(196,161,90,0.3)" strokeWidth="1" />
        <line x1="-10" y1="4" x2="10" y2="4" stroke="rgba(196,161,90,0.3)" strokeWidth="1" />
        <line x1="-10" y1="12" x2="5" y2="12" stroke="rgba(196,161,90,0.3)" strokeWidth="1" />
      </g>
    </svg>
  );
}

const valueProps = [
  {
    icon: <Database className="w-5 h-5" />,
    title: "Unique Dataset",
    description: "Access structured data on organizational mortality unavailable anywhere else.",
  },
  {
    icon: <FlaskConical className="w-5 h-5" />,
    title: "Research Questions",
    description: "Explore uncharted territory in organizational science and failure studies.",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Publication Support",
    description: "Co-author papers with our team and access data for your research.",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Collaboration Network",
    description: "Connect with other researchers studying organizational mortality.",
  },
];

const steps = [
  "Explore our research program and methodology",
  "Propose your research project or join existing initiatives",
  "Access anonymized datasets for scholarly work",
];

export function ResearchersRoleSection() {
  return (
    <section id="researchers" className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Illustration (reversed layout) */}
          <div className="animate-fade-in-up order-2 lg:order-1">
            <Card
              variant="dark-elevated"
              padding="none"
              className="aspect-square relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-radial from-purple-500/5 via-transparent to-transparent" />
              <ResearchersIllustrationSVG />

              {/* Corner label */}
              <div className="absolute bottom-4 left-4 text-xs text-purple-400/50 font-mono">
                DATA-DRIVEN INSIGHTS
              </div>
            </Card>
          </div>

          {/* Right: Content */}
          <div className="animate-fade-in-up stagger-1 order-1 lg:order-2">
            <SectionLabel>for researchers</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
              Uncharted Research Territory
            </h2>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Organizational mortality is understudied because the data doesn&apos;t exist.
              We&apos;re building the first systematic dataset of{" "}
              <GlossaryTerm term="Autopsy">organizational autopsies</GlossaryTerm> - and we need
              researchers to help us make sense of it.
            </p>

            {/* Value propositions */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {valueProps.map((prop, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                    {prop.icon}
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-medium text-marble-100 mb-1">
                      {prop.title}
                    </h4>
                    <p className="text-slate-400 text-xs leading-relaxed">{prop.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Steps */}
            <Card variant="dark" padding="md" className="mb-8">
              <p className="text-purple-400/80 text-sm font-medium mb-3">How to participate:</p>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-slate-300 text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* CTA */}
            <a href="/research">
              <Button
                variant="dark-primary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Explore Research Program
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
