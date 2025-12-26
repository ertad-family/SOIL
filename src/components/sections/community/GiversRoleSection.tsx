"use client";

import { SectionLabel } from "@/components/ui/section-label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GlossaryTerm } from "@/components/ui/glossary-term";
import { ArrowRight, Heart, TrendingUp, Award, Gift } from "lucide-react";

// Pre-computed radiating line endpoints (12 lines, 30 degrees apart)
// Calculated as: x2 = 150 + cos(angle) * 140, y2 = 150 + sin(angle) * 140
const radiatingLines = [
  { x2: 290, y2: 150 }, // 0°
  { x2: 271.24, y2: 220 }, // 30°
  { x2: 220, y2: 271.24 }, // 60°
  { x2: 150, y2: 290 }, // 90°
  { x2: 80, y2: 271.24 }, // 120°
  { x2: 28.76, y2: 220 }, // 150°
  { x2: 10, y2: 150 }, // 180°
  { x2: 28.76, y2: 80 }, // 210°
  { x2: 80, y2: 28.76 }, // 240°
  { x2: 150, y2: 10 }, // 270°
  { x2: 220, y2: 28.76 }, // 300°
  { x2: 271.24, y2: 80 }, // 330°
];

// Custom SVG illustration for Givers - using gold/marble colors
function GiversIllustrationSVG() {
  return (
    <svg viewBox="0 0 300 300" className="w-full h-full" fill="none">
      {/* Background radiating lines */}
      <g stroke="rgba(196,161,90,0.1)" strokeWidth="1">
        {radiatingLines.map((line, i) => (
          <line key={i} x1="150" y1="150" x2={line.x2} y2={line.y2} />
        ))}
      </g>

      {/* Outer circle rings */}
      <circle cx="150" cy="150" r="120" fill="none" stroke="rgba(196,161,90,0.1)" strokeWidth="1" />
      <circle
        cx="150"
        cy="150"
        r="90"
        fill="none"
        stroke="rgba(196,161,90,0.15)"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      <circle cx="150" cy="150" r="60" fill="none" stroke="rgba(196,161,90,0.2)" strokeWidth="1" />

      {/* Central heart symbol */}
      <g transform="translate(150, 140)">
        <path
          d="M0 15 C-5 10 -15 0 -15 -8 C-15 -18 -5 -22 0 -15 C5 -22 15 -18 15 -8 C15 0 5 10 0 15Z"
          fill="rgba(196,161,90,0.3)"
          stroke="rgba(196,161,90,0.6)"
          strokeWidth="2"
          transform="scale(2.5)"
        />
      </g>

      {/* Giving types around the heart */}
      {/* Donate - coin */}
      <g transform="translate(80, 80)">
        <circle
          cx="0"
          cy="0"
          r="25"
          fill="rgba(196,161,90,0.15)"
          stroke="rgba(196,161,90,0.4)"
          strokeWidth="1.5"
        />
        <circle
          cx="0"
          cy="0"
          r="15"
          fill="rgba(196,161,90,0.2)"
          stroke="rgba(196,161,90,0.5)"
          strokeWidth="1"
        />
        <text
          x="0"
          y="5"
          textAnchor="middle"
          fill="rgba(196,161,90,0.8)"
          fontSize="14"
          fontFamily="serif"
        >
          $
        </text>
      </g>

      {/* Invest - trending up */}
      <g transform="translate(220, 80)">
        <circle
          cx="0"
          cy="0"
          r="25"
          fill="rgba(196,161,90,0.15)"
          stroke="rgba(196,161,90,0.4)"
          strokeWidth="1.5"
        />
        <path
          d="M-8 5 L-2 -2 L4 2 L10 -6"
          stroke="rgba(196,161,90,0.7)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polygon points="7,-8 12,-6 10,-1" fill="rgba(196,161,90,0.7)" />
      </g>

      {/* Sponsor - award/star */}
      <g transform="translate(80, 220)">
        <circle
          cx="0"
          cy="0"
          r="25"
          fill="rgba(196,161,90,0.15)"
          stroke="rgba(196,161,90,0.4)"
          strokeWidth="1.5"
        />
        <polygon
          points="0,-10 3,-4 10,-4 5,1 7,8 0,4 -7,8 -5,1 -10,-4 -3,-4"
          fill="rgba(196,161,90,0.5)"
          stroke="rgba(196,161,90,0.7)"
          strokeWidth="1"
        />
      </g>

      {/* Gift - box */}
      <g transform="translate(220, 220)">
        <circle
          cx="0"
          cy="0"
          r="25"
          fill="rgba(196,161,90,0.15)"
          stroke="rgba(196,161,90,0.4)"
          strokeWidth="1.5"
        />
        <rect
          x="-8"
          y="-4"
          width="16"
          height="12"
          fill="rgba(196,161,90,0.3)"
          stroke="rgba(196,161,90,0.6)"
          strokeWidth="1"
          rx="1"
        />
        <rect
          x="-10"
          y="-8"
          width="20"
          height="6"
          fill="rgba(196,161,90,0.4)"
          stroke="rgba(196,161,90,0.6)"
          strokeWidth="1"
          rx="1"
        />
        <line x1="0" y1="-8" x2="0" y2="8" stroke="rgba(196,161,90,0.7)" strokeWidth="2" />
      </g>

      {/* Connection lines to heart */}
      <g stroke="rgba(196,161,90,0.25)" strokeWidth="1.5" strokeDasharray="3 3">
        <line x1="100" y1="95" x2="125" y2="120" />
        <line x1="200" y1="95" x2="175" y2="120" />
        <line x1="100" y1="205" x2="125" y2="180" />
        <line x1="200" y1="205" x2="175" y2="180" />
      </g>

      {/* Floating hearts */}
      {[
        { x: 50, y: 150, scale: 0.4 },
        { x: 250, y: 150, scale: 0.4 },
        { x: 150, y: 50, scale: 0.5 },
        { x: 150, y: 250, scale: 0.5 },
      ].map((h, i) => (
        <path
          key={i}
          d={`M${h.x} ${h.y + 5 * h.scale} C${h.x - 2 * h.scale} ${h.y + 3 * h.scale} ${h.x - 6 * h.scale} ${h.y} ${h.x - 6 * h.scale} ${h.y - 3 * h.scale} C${h.x - 6 * h.scale} ${h.y - 7 * h.scale} ${h.x - 2 * h.scale} ${h.y - 8 * h.scale} ${h.x} ${h.y - 5 * h.scale} C${h.x + 2 * h.scale} ${h.y - 8 * h.scale} ${h.x + 6 * h.scale} ${h.y - 7 * h.scale} ${h.x + 6 * h.scale} ${h.y - 3 * h.scale} C${h.x + 6 * h.scale} ${h.y} ${h.x + 2 * h.scale} ${h.y + 3 * h.scale} ${h.x} ${h.y + 5 * h.scale}Z`}
          fill="rgba(196,161,90,0.4)"
        />
      ))}

      {/* Sparkles */}
      {[
        { cx: 40, cy: 120, r: 2 },
        { cx: 260, cy: 120, r: 2 },
        { cx: 40, cy: 180, r: 1.5 },
        { cx: 260, cy: 180, r: 1.5 },
        { cx: 120, cy: 40, r: 2 },
        { cx: 180, cy: 40, r: 2 },
      ].map((p, i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill="rgba(196,161,90,0.6)" />
      ))}
    </svg>
  );
}

const givingTypes = [
  {
    icon: <Heart className="w-5 h-5" />,
    title: "Donate",
    description: "One-time or recurring support (coming soon).",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "Invest",
    description: "Strategic investment in the platform.",
  },
  {
    icon: <Award className="w-5 h-5" />,
    title: "Sponsor",
    description: "Fund specific features or research.",
  },
  {
    icon: <Gift className="w-5 h-5" />,
    title: "Gift",
    description: "In-kind contributions and resources.",
  },
];

export function GiversRoleSection() {
  return (
    <section id="givers" className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="animate-fade-in-up">
            <SectionLabel>for givers</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
              Invest in Preservation
            </h2>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Financial support enables us to build the infrastructure for preserving organizational
              wisdom. Whether through donations, investments, or sponsorships - your contribution
              has lasting impact. Your name can be immortalized in the platform.
            </p>

            {/* Giving types */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {givingTypes.map((type, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
                >
                  <span className="text-gold-400">{type.icon}</span>
                  <div>
                    <span className="text-marble-100 text-sm font-medium block">{type.title}</span>
                    <span className="text-slate-500 text-xs">{type.description}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Impact note */}
            <Card variant="dark" padding="md" className="mb-8">
              <p className="text-gold-400/80 text-sm font-medium mb-2">Your Impact:</p>
              <p className="text-slate-400 text-sm">
                100% of donations go directly to platform development, research initiatives, and
                community programs. All sponsors receive recognition in the{" "}
                <GlossaryTerm term="Cenotaphery">Cenotaphery</GlossaryTerm>.
              </p>
            </Card>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <a href="/donate">
                <Button
                  variant="dark-primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Support SOIL
                </Button>
              </a>
              <a href="/investors">
                <Button variant="dark-secondary" size="lg">
                  Become an Investor
                </Button>
              </a>
            </div>
          </div>

          {/* Right: Illustration */}
          <div className="animate-fade-in-up stagger-1">
            <Card
              variant="dark-elevated"
              padding="none"
              className="aspect-square relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-radial from-gold-500/5 via-transparent to-transparent" />
              <GiversIllustrationSVG />

              {/* Corner label */}
              <div className="absolute bottom-4 right-4 text-xs text-gold-400/50 font-mono">
                GIVE FORWARD
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
