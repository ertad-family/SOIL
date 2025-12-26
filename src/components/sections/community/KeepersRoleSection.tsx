"use client";

import { SectionLabel } from "@/components/ui/section-label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GlossaryTerm } from "@/components/ui/glossary-term";
import { ArrowRight, Shield, Calendar, Globe, TrendingUp } from "lucide-react";

// Custom SVG illustration for Keepers - showing hierarchy/path
function KeepersIllustrationSVG() {
  return (
    <svg viewBox="0 0 300 300" className="w-full h-full" fill="none">
      {/* Keeper path visualization - ascending levels */}

      {/* Background circular pattern - representing regional coverage */}
      <circle
        cx="150"
        cy="150"
        r="120"
        fill="none"
        stroke="rgba(100,180,130,0.1)"
        strokeWidth="1"
      />
      <circle
        cx="150"
        cy="150"
        r="90"
        fill="none"
        stroke="rgba(100,180,130,0.15)"
        strokeWidth="1"
      />
      <circle cx="150" cy="150" r="60" fill="none" stroke="rgba(100,180,130,0.2)" strokeWidth="1" />

      {/* Keeper path - ascending steps */}
      <g>
        {/* Level 1: Applicant */}
        <rect
          x="40"
          y="230"
          width="60"
          height="30"
          rx="4"
          fill="rgba(100,180,130,0.15)"
          stroke="rgba(100,180,130,0.4)"
          strokeWidth="1.5"
        />
        <text
          x="70"
          y="250"
          textAnchor="middle"
          fill="rgba(100,180,130,0.8)"
          fontSize="8"
          fontFamily="system-ui"
        >
          APPLICANT
        </text>

        {/* Arrow 1 */}
        <path
          d="M100 235 L115 220"
          stroke="rgba(100,180,130,0.4)"
          strokeWidth="1.5"
          strokeLinecap="round"
          markerEnd="url(#arrowhead)"
        />

        {/* Level 2: Apprentice */}
        <rect
          x="100"
          y="180"
          width="60"
          height="30"
          rx="4"
          fill="rgba(100,180,130,0.2)"
          stroke="rgba(100,180,130,0.5)"
          strokeWidth="1.5"
        />
        <text
          x="130"
          y="200"
          textAnchor="middle"
          fill="rgba(100,180,130,0.9)"
          fontSize="8"
          fontFamily="system-ui"
        >
          APPRENTICE
        </text>

        {/* Arrow 2 */}
        <path
          d="M160 185 L175 170"
          stroke="rgba(100,180,130,0.5)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Level 3: Full Keeper */}
        <rect
          x="160"
          y="130"
          width="60"
          height="30"
          rx="4"
          fill="rgba(100,180,130,0.25)"
          stroke="rgba(100,180,130,0.6)"
          strokeWidth="1.5"
        />
        <text
          x="190"
          y="150"
          textAnchor="middle"
          fill="rgba(100,180,130,1)"
          fontSize="8"
          fontFamily="system-ui"
        >
          KEEPER
        </text>

        {/* Arrow 3 */}
        <path
          d="M220 135 L235 120"
          stroke="rgba(100,180,130,0.6)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Level 4: Senior Keeper - highlighted */}
        <rect
          x="200"
          y="80"
          width="70"
          height="30"
          rx="4"
          fill="rgba(100,180,130,0.3)"
          stroke="rgba(100,180,130,0.8)"
          strokeWidth="2"
        />
        <text
          x="235"
          y="100"
          textAnchor="middle"
          fill="rgba(100,180,130,1)"
          fontSize="8"
          fontFamily="system-ui"
          fontWeight="600"
        >
          SENIOR
        </text>

        {/* Crown/star symbol for senior */}
        <polygon
          points="235,70 238,60 241,70 250,70 243,77 246,87 235,80 224,87 227,77 220,70"
          fill="rgba(196,161,90,0.6)"
        />
      </g>

      {/* Regional nodes - representing cenotapheries managed */}
      <g>
        <circle
          cx="60"
          cy="100"
          r="12"
          fill="rgba(100,180,130,0.15)"
          stroke="rgba(100,180,130,0.4)"
          strokeWidth="1"
        />
        <circle cx="60" cy="100" r="4" fill="rgba(100,180,130,0.6)" />

        <circle
          cx="90"
          cy="60"
          r="10"
          fill="rgba(100,180,130,0.15)"
          stroke="rgba(100,180,130,0.4)"
          strokeWidth="1"
        />
        <circle cx="90" cy="60" r="3" fill="rgba(100,180,130,0.6)" />

        <circle
          cx="150"
          cy="40"
          r="14"
          fill="rgba(100,180,130,0.15)"
          stroke="rgba(100,180,130,0.4)"
          strokeWidth="1"
        />
        <circle cx="150" cy="40" r="5" fill="rgba(100,180,130,0.6)" />

        {/* Connecting lines to center */}
        <line
          x1="60"
          y1="100"
          x2="150"
          y2="150"
          stroke="rgba(100,180,130,0.2)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <line
          x1="90"
          y1="60"
          x2="150"
          y2="150"
          stroke="rgba(100,180,130,0.2)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <line
          x1="150"
          y1="40"
          x2="150"
          y2="150"
          stroke="rgba(100,180,130,0.2)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      </g>

      {/* Central shield symbol */}
      <g transform="translate(150, 150)">
        <path
          d="M0,-25 L20,-15 L20,10 Q20,25 0,35 Q-20,25 -20,10 L-20,-15 Z"
          fill="rgba(100,180,130,0.2)"
          stroke="rgba(100,180,130,0.6)"
          strokeWidth="2"
        />
        <text
          x="0"
          y="5"
          textAnchor="middle"
          fill="rgba(100,180,130,0.8)"
          fontSize="16"
          fontFamily="system-ui"
          fontWeight="bold"
        >
          K
        </text>
      </g>

      {/* Event symbols around shield */}
      <circle cx="120" cy="170" r="6" fill="rgba(196,161,90,0.3)" />
      <circle cx="180" cy="170" r="6" fill="rgba(196,161,90,0.3)" />
      <circle cx="150" cy="200" r="6" fill="rgba(196,161,90,0.3)" />
    </svg>
  );
}

const valueProps = [
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Regional Leadership",
    description: (
      <>
        Become the guardian of a <GlossaryTerm term="Cenotaphery">cenotaphery</GlossaryTerm> in your
        region.
      </>
    ),
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    title: "Event Organization",
    description: "Host Day of the Dead Venture celebrations and local meetups.",
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: "Network Building",
    description: "Connect founders in your area and grow the local community.",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "Ecosystem Growth",
    description: "Shape how SOIL develops in your region and beyond.",
  },
];

const keeperPath = [
  { level: "Applicant", description: "Submit your application and demonstrate commitment" },
  { level: "Apprentice", description: "Learn under a Senior Keeper's guidance" },
  {
    level: "Full Keeper",
    description: (
      <>
        Manage your regional <GlossaryTerm term="Cenotaphery">cenotaphery</GlossaryTerm>
      </>
    ),
  },
  { level: "Senior Keeper", description: "Mentor new Keepers and lead major initiatives" },
];

export function KeepersRoleSection() {
  return (
    <section id="keepers" className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="animate-fade-in-up">
            <SectionLabel>for keepers</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
              Lead Your Regional Community
            </h2>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Keepers are the backbone of SOIL. They moderate regional{" "}
              <GlossaryTerm term="Cenotaphery">cenotapheries</GlossaryTerm>, organize local events,
              verify founder stories, and build the community infrastructure that makes everything
              else possible.
            </p>

            {/* Value propositions */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {valueProps.map((prop, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
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

            {/* Keeper Path */}
            <Card variant="dark" padding="md" className="mb-8">
              <p className="text-emerald-400/80 text-sm font-medium mb-3">The Keeper Path:</p>
              <div className="flex flex-wrap gap-2">
                {keeperPath.map((step, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        index === keeperPath.length - 1
                          ? "bg-emerald-500/30 text-emerald-300"
                          : "bg-slate-700/50 text-slate-400"
                      }`}
                    >
                      {step.level}
                    </span>
                    {index < keeperPath.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-slate-600" />
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* CTA */}
            <a href="/keepers">
              <Button
                variant="dark-primary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Apply to Become a Keeper
              </Button>
            </a>
          </div>

          {/* Right: Illustration */}
          <div className="animate-fade-in-up stagger-1">
            <Card
              variant="dark-elevated"
              padding="none"
              className="aspect-square relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-radial from-emerald-500/5 via-transparent to-transparent" />
              <KeepersIllustrationSVG />

              {/* Corner label */}
              <div className="absolute bottom-4 right-4 text-xs text-emerald-400/50 font-mono">
                COMMUNITY GUARDIANS
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
