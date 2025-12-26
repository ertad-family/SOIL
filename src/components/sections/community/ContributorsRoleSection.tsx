"use client";

import { SectionLabel } from "@/components/ui/section-label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Code, Palette, Languages, PenTool, Users, Github } from "lucide-react";

// Custom SVG illustration for Contributors
function ContributorsIllustrationSVG() {
  return (
    <svg viewBox="0 0 300 300" className="w-full h-full" fill="none">
      {/* Code/Development theme with collaborative elements */}

      {/* Background hex grid pattern */}
      <g stroke="rgba(230,126,90,0.1)" strokeWidth="0.5" fill="none">
        {[...Array(6)].map((_, row) =>
          [...Array(6)].map((_, col) => {
            const x = 40 + col * 45 + (row % 2) * 22;
            const y = 30 + row * 40;
            return (
              <polygon
                key={`hex-${row}-${col}`}
                points={`${x},${y - 15} ${x + 13},${y - 7} ${x + 13},${y + 7} ${x},${y + 15} ${x - 13},${y + 7} ${x - 13},${y - 7}`}
              />
            );
          })
        )}
      </g>

      {/* Central gear/cog - representing development */}
      <g transform="translate(150, 150)">
        {/* Outer teeth */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const x1 = Math.cos(angle) * 40;
          const y1 = Math.sin(angle) * 40;
          const x2 = Math.cos(angle) * 55;
          const y2 = Math.sin(angle) * 55;
          return (
            <rect
              key={i}
              x={x1 - 8}
              y={y1 - 8}
              width="16"
              height="16"
              rx="2"
              fill="rgba(230,126,90,0.2)"
              stroke="rgba(230,126,90,0.5)"
              strokeWidth="1"
              transform={`rotate(${i * 45} ${x1} ${y1})`}
            />
          );
        })}
        <circle
          cx="0"
          cy="0"
          r="35"
          fill="rgba(230,126,90,0.15)"
          stroke="rgba(230,126,90,0.5)"
          strokeWidth="2"
        />
        <circle
          cx="0"
          cy="0"
          r="15"
          fill="rgba(74,53,40,0.8)"
          stroke="rgba(230,126,90,0.6)"
          strokeWidth="1.5"
        />
      </g>

      {/* Code brackets around gear */}
      <text x="80" y="160" fill="rgba(230,126,90,0.6)" fontSize="40" fontFamily="monospace">
        {"{"}
      </text>
      <text x="200" y="160" fill="rgba(230,126,90,0.6)" fontSize="40" fontFamily="monospace">
        {"}"}
      </text>

      {/* Role icons positioned around */}
      {/* Developer - code */}
      <g transform="translate(70, 70)">
        <circle
          cx="0"
          cy="0"
          r="20"
          fill="rgba(230,126,90,0.15)"
          stroke="rgba(230,126,90,0.4)"
          strokeWidth="1"
        />
        <text
          x="0"
          y="5"
          textAnchor="middle"
          fill="rgba(230,126,90,0.8)"
          fontSize="14"
          fontFamily="monospace"
        >
          {"</>"}
        </text>
      </g>

      {/* Designer - palette */}
      <g transform="translate(230, 70)">
        <circle
          cx="0"
          cy="0"
          r="20"
          fill="rgba(230,126,90,0.15)"
          stroke="rgba(230,126,90,0.4)"
          strokeWidth="1"
        />
        <circle cx="-5" cy="-3" r="4" fill="rgba(147,112,219,0.6)" />
        <circle cx="5" cy="-5" r="3" fill="rgba(100,180,130,0.6)" />
        <circle cx="3" cy="5" r="3.5" fill="rgba(196,161,90,0.6)" />
      </g>

      {/* Translator - globe */}
      <g transform="translate(70, 230)">
        <circle
          cx="0"
          cy="0"
          r="20"
          fill="rgba(230,126,90,0.15)"
          stroke="rgba(230,126,90,0.4)"
          strokeWidth="1"
        />
        <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(230,126,90,0.5)" strokeWidth="1" />
        <ellipse
          cx="0"
          cy="0"
          rx="10"
          ry="5"
          fill="none"
          stroke="rgba(230,126,90,0.4)"
          strokeWidth="0.5"
        />
        <line x1="-10" y1="0" x2="10" y2="0" stroke="rgba(230,126,90,0.4)" strokeWidth="0.5" />
      </g>

      {/* Writer - pen */}
      <g transform="translate(230, 230)">
        <circle
          cx="0"
          cy="0"
          r="20"
          fill="rgba(230,126,90,0.15)"
          stroke="rgba(230,126,90,0.4)"
          strokeWidth="1"
        />
        <line
          x1="-6"
          y1="6"
          x2="6"
          y2="-6"
          stroke="rgba(230,126,90,0.6)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="7" cy="-7" r="2" fill="rgba(230,126,90,0.6)" />
      </g>

      {/* Community - users */}
      <g transform="translate(150, 260)">
        <circle
          cx="0"
          cy="0"
          r="20"
          fill="rgba(230,126,90,0.15)"
          stroke="rgba(230,126,90,0.4)"
          strokeWidth="1"
        />
        <circle cx="-5" cy="-3" r="4" fill="rgba(230,126,90,0.4)" />
        <circle cx="5" cy="-3" r="4" fill="rgba(230,126,90,0.4)" />
        <circle cx="0" cy="5" r="4" fill="rgba(230,126,90,0.5)" />
      </g>

      {/* Connection lines */}
      <g stroke="rgba(230,126,90,0.2)" strokeWidth="1" strokeDasharray="4 4">
        <line x1="70" y1="90" x2="110" y2="120" />
        <line x1="230" y1="90" x2="190" y2="120" />
        <line x1="70" y1="210" x2="110" y2="180" />
        <line x1="230" y1="210" x2="190" y2="180" />
        <line x1="150" y1="240" x2="150" y2="195" />
      </g>

      {/* Floating particles */}
      {[
        { cx: 40, cy: 150, r: 2 },
        { cx: 260, cy: 150, r: 2 },
        { cx: 150, cy: 40, r: 2.5 },
        { cx: 100, cy: 40, r: 1.5 },
        { cx: 200, cy: 40, r: 1.5 },
      ].map((p, i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill="rgba(230,126,90,0.5)" />
      ))}
    </svg>
  );
}

const contributorTypes = [
  {
    icon: <Code className="w-5 h-5" />,
    title: "Developers",
    description: "React, Three.js, TypeScript - build the platform.",
  },
  {
    icon: <Palette className="w-5 h-5" />,
    title: "Designers",
    description: "UI/UX, 3D models, illustrations - shape the experience.",
  },
  {
    icon: <Languages className="w-5 h-5" />,
    title: "Translators",
    description: "Localize SOIL for communities worldwide.",
  },
  {
    icon: <PenTool className="w-5 h-5" />,
    title: "Writers",
    description: "Documentation, content, founder stories.",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Community",
    description: "Moderation, support, event organization.",
  },
];

const techStack = [
  "Next.js 15 + React 19",
  "React Three Fiber",
  "TypeScript",
  "Tailwind CSS",
  "Supabase",
];

export function ContributorsRoleSection() {
  return (
    <section id="contributors" className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Illustration (reversed layout) */}
          <div className="animate-fade-in-up order-2 lg:order-1">
            <Card
              variant="dark-elevated"
              padding="none"
              className="aspect-square relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-radial from-orange-500/5 via-transparent to-transparent" />
              <ContributorsIllustrationSVG />

              {/* Corner label */}
              <div className="absolute bottom-4 left-4 text-xs text-orange-400/50 font-mono">
                BUILD TOGETHER
              </div>
            </Card>
          </div>

          {/* Right: Content */}
          <div className="animate-fade-in-up stagger-1 order-1 lg:order-2">
            <SectionLabel>for contributors</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
              Build Something Meaningful
            </h2>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              SOIL is open source and community-driven. Whether you code, design, write, translate,
              or organize - there&apos;s meaningful work waiting for you. Every contribution, no
              matter how small, helps preserve organizational wisdom.
            </p>

            {/* Contributor types */}
            <div className="flex flex-wrap gap-3 mb-6">
              {contributorTypes.map((type, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50"
                >
                  <span className="text-orange-400">{type.icon}</span>
                  <div>
                    <span className="text-marble-100 text-sm font-medium">{type.title}</span>
                    <span className="text-slate-500 text-xs ml-2 hidden sm:inline">
                      {type.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tech Stack */}
            <Card variant="dark" padding="md" className="mb-8">
              <p className="text-orange-400/80 text-sm font-medium mb-3">Tech Stack:</p>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded text-xs font-mono bg-slate-700/50 text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </Card>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <a href="/challenges">
                <Button
                  variant="dark-primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  View Open Tasks
                </Button>
              </a>
              <a
                href="https://github.com/ertad-family/soil"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="dark-secondary"
                  size="lg"
                  leftIcon={<Github className="w-5 h-5" />}
                >
                  GitHub
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
