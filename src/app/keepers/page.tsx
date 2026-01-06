"use client";

import { useState } from "react";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/section-label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GlossaryTerm } from "@/components/ui/glossary-term";
import {
  Shield,
  Users,
  Globe,
  Calendar,
  CheckCircle,
  ArrowRight,
  Heart,
  Award,
  Clock,
  Mail,
  MessageSquare,
  Search,
  ShieldCheck,
  Fingerprint,
  MapPin,
  Crown,
  Star,
  Network,
  LucideIcon,
} from "lucide-react";
import { siteConfig, mailtoLink } from "@/lib/site-config";

// ============================================================================
// KEEPER VALUES DATA
// ============================================================================
interface KeeperValue {
  id: string;
  label: string;
  title: string;
  description: string;
  category: "protects" | "receives";
  color: string;
  colorBg: string;
  colorStroke: string;
  icon: LucideIcon;
}

const keeperValues: KeeperValue[] = [
  // What Keeper protects
  {
    id: "data-quality",
    label: "DATA QUALITY",
    title: "Data Quality",
    description:
      "Ensures accuracy and authenticity of organizational stories through careful review and verification.",
    category: "protects",
    color: "rgba(100,180,130,1)",
    colorBg: "rgba(100,180,130,0.15)",
    colorStroke: "rgba(100,180,130,0.5)",
    icon: ShieldCheck,
  },
  {
    id: "community-trust",
    label: "COMMUNITY TRUST",
    title: "Community Trust",
    description:
      "Maintains integrity and creates a safe space for founders to share their experiences openly.",
    category: "protects",
    color: "rgba(100,180,130,1)",
    colorBg: "rgba(100,180,130,0.15)",
    colorStroke: "rgba(100,180,130,0.5)",
    icon: Fingerprint,
  },
  {
    id: "regional-identity",
    label: "REGIONAL IDENTITY",
    title: "Regional Identity",
    description:
      "Preserves local context and cultural nuances that make each region's stories unique and valuable.",
    category: "protects",
    color: "rgba(100,180,130,1)",
    colorBg: "rgba(100,180,130,0.15)",
    colorStroke: "rgba(100,180,130,0.5)",
    icon: MapPin,
  },
  // What Keeper receives
  {
    id: "leadership",
    label: "LEADERSHIP",
    title: "Leadership",
    description: "Become a recognized voice and leader in your local startup ecosystem.",
    category: "receives",
    color: "rgba(196,161,90,1)",
    colorBg: "rgba(196,161,90,0.15)",
    colorStroke: "rgba(196,161,90,0.5)",
    icon: Crown,
  },
  {
    id: "recognition",
    label: "RECOGNITION",
    title: "Recognition",
    description:
      "Be acknowledged as a founding guardian of your regional cenotaphery and a pioneer of organizational medicine.",
    category: "receives",
    color: "rgba(196,161,90,1)",
    colorBg: "rgba(196,161,90,0.15)",
    colorStroke: "rgba(196,161,90,0.5)",
    icon: Star,
  },
  {
    id: "global-network",
    label: "GLOBAL NETWORK",
    title: "Global Network",
    description: "Connect with founders, researchers, and fellow Keepers from around the world.",
    category: "receives",
    color: "rgba(196,161,90,1)",
    colorBg: "rgba(196,161,90,0.15)",
    colorStroke: "rgba(196,161,90,0.5)",
    icon: Network,
  },
];

// Hexagon positions (60 degrees apart, starting from top)
const hexagonRadius = 110;
const centerX = 200;
const centerY = 200;

function getHexagonPosition(index: number) {
  const angle = (index * 60 - 90) * (Math.PI / 180); // Start from top (-90°)
  return {
    x: centerX + hexagonRadius * Math.cos(angle),
    y: centerY + hexagonRadius * Math.sin(angle),
  };
}

// Calculate tooltip position based on value position in the diagram
function getTooltipPosition(index: number): { top: number; left: number; side: "left" | "right" } {
  const pos = getHexagonPosition(index);
  const topPercent = (pos.y / 400) * 100;
  const leftPercent = (pos.x / 400) * 100;
  const side = pos.x > centerX ? "right" : "left";
  return { top: topPercent, left: leftPercent, side };
}

interface ValueNodeProps {
  value: KeeperValue;
  position: { x: number; y: number };
  onHover: (valueId: string | null) => void;
  isHovered: boolean;
}

function ValueNode({ value, position, onHover, isHovered }: ValueNodeProps) {
  const nodeRadius = 22;
  const innerRadius = 7;

  return (
    <g
      className="cursor-pointer transition-transform duration-200"
      style={{
        transform: isHovered ? "scale(1.1)" : "scale(1)",
        transformOrigin: `${position.x}px ${position.y}px`,
      }}
      onMouseEnter={() => onHover(value.id)}
    >
      {/* Outer glow on hover */}
      {isHovered && (
        <circle
          cx={position.x}
          cy={position.y}
          r={nodeRadius + 8}
          fill={value.colorBg}
          className="animate-pulse"
        />
      )}

      {/* Outer circle */}
      <circle
        cx={position.x}
        cy={position.y}
        r={nodeRadius}
        fill={value.colorBg}
        stroke={isHovered ? value.color : value.colorStroke}
        strokeWidth={isHovered ? 3 : 2}
      />

      {/* Inner circle */}
      <circle
        cx={position.x}
        cy={position.y}
        r={innerRadius}
        fill={isHovered ? value.color : value.colorStroke}
      />

      {/* Label */}
      <text
        x={position.x}
        y={position.y + nodeRadius + 14}
        textAnchor="middle"
        fill={isHovered ? value.color : `${value.color.replace(",1)", ",0.7)")}`}
        fontSize={8}
        fontFamily="system-ui"
        fontWeight={isHovered ? 600 : 400}
      >
        {value.label}
      </text>
    </g>
  );
}

function KeeperValuesDiagram({
  onHover,
  hoveredValue,
}: {
  onHover: (valueId: string | null) => void;
  hoveredValue: string | null;
}) {
  return (
    <svg
      viewBox="0 0 400 400"
      className="w-[480px] h-[480px] md:w-[600px] md:h-[600px]"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Outer orbital rings */}
      {[0, 1, 2].map((i) => (
        <circle
          key={`orbit-${i}`}
          cx={centerX}
          cy={centerY}
          r={70 + i * 50}
          fill="none"
          stroke={`rgba(100,180,130,${0.12 - i * 0.03})`}
          strokeWidth="1"
          strokeDasharray={i % 2 === 0 ? "none" : "4 4"}
        />
      ))}

      {/* Hexagon outline */}
      <polygon
        points={keeperValues
          .map((_, i) => {
            const pos = getHexagonPosition(i);
            return `${pos.x},${pos.y}`;
          })
          .join(" ")}
        fill="none"
        stroke="rgba(100,180,130,0.15)"
        strokeWidth="1"
      />

      {/* Connection lines from center to each value */}
      {keeperValues.map((value, i) => {
        const pos = getHexagonPosition(i);
        const isHovered = hoveredValue === value.id;
        return (
          <line
            key={`line-${value.id}`}
            x1={centerX}
            y1={centerY}
            x2={pos.x}
            y2={pos.y}
            stroke={isHovered ? value.colorStroke : "rgba(100,180,130,0.2)"}
            strokeWidth={isHovered ? 2 : 1}
            className="transition-all duration-200"
          />
        );
      })}

      {/* Value nodes on hexagon vertices */}
      {keeperValues.map((value, i) => {
        const pos = getHexagonPosition(i);
        return (
          <ValueNode
            key={value.id}
            value={value}
            position={pos}
            onHover={onHover}
            isHovered={hoveredValue === value.id}
          />
        );
      })}

      {/* Central shield - Keeper symbol */}
      <g transform={`translate(${centerX}, ${centerY})`}>
        <path
          d="M0,-40 L35,-25 L35,15 Q35,40 0,55 Q-35,40 -35,15 L-35,-25 Z"
          fill="rgba(100,180,130,0.15)"
          stroke="rgba(100,180,130,0.5)"
          strokeWidth="2"
        />
        <text
          x="0"
          y="8"
          textAnchor="middle"
          fill="rgba(100,180,130,0.8)"
          fontSize="24"
          fontFamily="system-ui"
          fontWeight="bold"
        >
          K
        </text>
      </g>

      {/* Floating particles */}
      {[
        { cx: 60, cy: 60, r: 2 },
        { cx: 340, cy: 70, r: 1.5 },
        { cx: 360, cy: 200, r: 2 },
        { cx: 330, cy: 340, r: 1.5 },
        { cx: 70, cy: 330, r: 2 },
        { cx: 40, cy: 190, r: 1.5 },
      ].map((p, i) => (
        <circle key={`particle-${i}`} cx={p.cx} cy={p.cy} r={p.r} fill="rgba(100,180,130,0.4)" />
      ))}
    </svg>
  );
}

// Tooltip component for values
function ValueTooltip({
  value,
  valueIndex,
  onMouseEnter,
  onMouseLeave,
}: {
  value: KeeperValue;
  valueIndex: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const Icon = value.icon;
  const tooltipPos = getTooltipPosition(valueIndex);
  const offsetX = tooltipPos.side === "right" ? 30 : -260;
  const offsetY = -70;

  return (
    <div
      className="absolute z-20 pointer-events-auto"
      style={{
        top: `${tooltipPos.top}%`,
        left: `${tooltipPos.left}%`,
        transform: `translate(${offsetX}px, ${offsetY}px)`,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Card variant="dark" padding="md" className="w-56 shadow-xl animate-fade-in-up">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: value.colorBg }}
            >
              <Icon className="w-5 h-5" style={{ color: value.color }} />
            </div>
            <div>
              <CardTitle variant="dark" className="text-base">
                {value.title}
              </CardTitle>
              <span
                className="text-xs font-medium"
                style={{
                  color:
                    value.category === "protects"
                      ? "rgba(100,180,130,0.8)"
                      : "rgba(196,161,90,0.8)",
                }}
              >
                {value.category === "protects" ? "Keeper protects" : "Keeper receives"}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 text-sm leading-relaxed">{value.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// HERO SECTION
// ============================================================================
function HeroSection() {
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);
  const [isTooltipHovered, setIsTooltipHovered] = useState(false);

  // Find hovered value data and index
  const hoveredValueIndex = keeperValues.findIndex((v) => v.id === hoveredValue);
  const hoveredValueData = keeperValues.find((v) => v.id === hoveredValue);

  // Only hide tooltip if neither the node nor the tooltip is hovered
  const handleNodeHover = (valueId: string | null) => {
    if (valueId) {
      setHoveredValue(valueId);
    } else if (!isTooltipHovered) {
      setHoveredValue(null);
    }
  };

  const handleTooltipMouseEnter = () => {
    setIsTooltipHovered(true);
  };

  const handleTooltipMouseLeave = () => {
    setIsTooltipHovered(false);
    setHoveredValue(null);
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="w-full px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left: Content - 1/3 width */}
          <div className="flex flex-col animate-fade-in-up lg:w-1/3">
            {/* Text content with left padding */}
            <div className="flex-1 pl-4 lg:pl-8">
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-wide mb-6 text-marble-100 leading-tight">
                Become a <span className="text-gradient-gold">Regional Guardian</span>
              </h1>
              <p className="text-base lg:text-lg text-slate-400 mb-8 leading-relaxed">
                Keepers are volunteer community leaders who steward regional{" "}
                <GlossaryTerm term="Cenotaphery">cenotapheries</GlossaryTerm>. They moderate
                content, verify founder stories, organize local events, and help build the
                infrastructure for organizational medicine in their region.
              </p>

              {/* CTA Button */}
              <a href="#apply">
                <Button
                  variant="dark-primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Apply to Become a Keeper
                </Button>
              </a>
            </div>

            {/* Status Card */}
            <Card variant="dark" padding="lg" className="mt-8">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-400">Accepting applications for pioneer regions</span>
              </div>
            </Card>
          </div>

          {/* Right: Interactive Diagram - 2/3 width */}
          <div className="animate-fade-in-up stagger-1 lg:w-2/3">
            <Card
              variant="dark-elevated"
              padding="none"
              className="h-full relative overflow-visible flex items-center justify-center p-8"
            >
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-radial from-emerald-500/10 via-transparent to-transparent" />

              {/* Values Diagram with tooltips */}
              <div
                className="relative"
                onMouseLeave={() => {
                  if (!isTooltipHovered) {
                    setHoveredValue(null);
                  }
                }}
              >
                <KeeperValuesDiagram onHover={handleNodeHover} hoveredValue={hoveredValue} />

                {/* Tooltip positioned next to the value */}
                {hoveredValueData && (
                  <ValueTooltip
                    value={hoveredValueData}
                    valueIndex={hoveredValueIndex}
                    onMouseEnter={handleTooltipMouseEnter}
                    onMouseLeave={handleTooltipMouseLeave}
                  />
                )}
              </div>

              {/* Floating label */}
              <div className="absolute bottom-6 right-6 text-sm text-emerald-400/60 font-mono">
                HOVER TO EXPLORE
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Decorative divider */}
      <div className="divider-roman mt-16 md:mt-20 animate-fade-in-up stagger-2">
        <span className="text-gold-400 font-serif text-sm tracking-[0.3em] px-6">MMXXV</span>
      </div>
    </section>
  );
}

// ============================================================================
// WHAT KEEPERS DO SECTION
// ============================================================================
function WhatKeepersDoSection() {
  const responsibilities = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Moderate Cenotaphs",
      description:
        "Review and approve new cenotaphs, ensuring quality and authenticity of organizational stories in your region.",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Verify Stories",
      description:
        "Conduct verification spot checks to maintain the integrity of the data and build trust in the community.",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Engage Community",
      description:
        "Respond to community questions, welcome new founders, and foster meaningful connections between members.",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Organize Events",
      description:
        "Host local meetups and facilitate Day of the Dead Venture celebrations in your region.",
    },
  ];

  return (
    <section className="py-16 md:py-24 animate-fade-in-up">
      <div className="max-w-content mx-auto px-6">
        <SectionLabel>what keepers do</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
          Stewards of Regional Communities
        </h2>
        <p className="text-lg text-slate-400 max-w-3xl mb-12">
          Keepers are the backbone of SOIL&apos;s global network. They ensure every{" "}
          <GlossaryTerm term="Cenotaphery">cenotaphery</GlossaryTerm> maintains quality, every
          founder feels welcomed, and every region has a trusted community leader.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {responsibilities.map((item, index) => (
            <div key={index} className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                {item.icon}
              </div>
              <h3 className="font-display text-lg font-medium text-marble-100">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// WHY BECOME A KEEPER SECTION
// ============================================================================
function WhyBecomeKeeperSection() {
  const benefits = [
    {
      icon: <Globe className="w-7 h-7" />,
      title: "Community Leadership",
      description:
        "Become a recognized leader in your local startup ecosystem. Shape how founders in your region connect, share, and learn from each other.",
    },
    {
      icon: <Heart className="w-7 h-7" />,
      title: "Mission Impact",
      description:
        "Help build the foundation for a new scientific discipline. Your work directly contributes to understanding why organizations succeed or fail.",
    },
    {
      icon: <Award className="w-7 h-7" />,
      title: "Recognition",
      description:
        "Earn Respects for your contributions, receive Keeper badges, and be acknowledged as a founding guardian of your regional cenotaphery.",
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: "Global Network",
      description:
        "Connect with founders, researchers, and fellow Keepers worldwide. Be part of a community building something meaningful together.",
    },
  ];

  return (
    <>
      {/* Gradient transition into section */}
      <div className="h-24 bg-gradient-to-b from-slate-900 to-marble-950" />

      <section className="py-16 md:py-24 bg-marble-950 relative">
        <div className="max-w-content mx-auto px-6">
          <SectionLabel>why volunteer</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
            Why Become a Keeper
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mb-12">
            Being a Keeper is a volunteer commitment to community building and scientific progress.
            It&apos;s for those who believe in the mission and want to lead its growth in their
            region.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} variant="dark-elevated" padding="lg" className="h-full">
                <CardHeader>
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                    {benefit.icon}
                  </div>
                  <CardTitle variant="dark">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gradient transition out of section */}
      <div className="h-24 bg-gradient-to-b from-marble-950 to-slate-900" />
    </>
  );
}

// ============================================================================
// KEEPER PATH SECTION
// ============================================================================
function KeeperPathSection() {
  const stages = [
    {
      level: "Applicant",
      duration: "1-2 weeks",
      description:
        "Submit your application with your connection to the local startup ecosystem and your motivation to contribute.",
      status: "entry",
    },
    {
      level: "Apprentice",
      duration: "3 months",
      description:
        "Work under the guidance of a Senior Keeper or the SOIL team. Learn moderation, verification, and community management.",
      status: "learning",
    },
    {
      level: "Full Keeper",
      duration: "Ongoing",
      description:
        "Full responsibility for your regional cenotaphery. Moderate content, verify stories, organize events, and grow the community.",
      status: "active",
    },
    {
      level: "Senior Keeper",
      duration: "By invitation",
      description:
        "Mentor new Keepers, coordinate across multiple regions, and advise on platform direction. A recognition of exceptional contribution.",
      status: "senior",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        <SectionLabel>the journey</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
          The Keeper Path
        </h2>
        <p className="text-lg text-slate-400 max-w-3xl mb-12">
          Becoming a Keeper is a journey of growing responsibility and impact. Each stage builds on
          the previous, ensuring you&apos;re prepared to lead your community.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stages.map((stage, index) => (
            <div key={index} className="relative">
              {/* Connection line */}
              {index < stages.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-6 h-[2px] bg-gradient-to-r from-emerald-500/50 to-transparent" />
              )}

              <Card
                variant={stage.status === "senior" ? "dark-elevated" : "dark"}
                padding="lg"
                className="h-full"
              >
                {/* Step number */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      stage.status === "senior"
                        ? "bg-emerald-500/30 text-emerald-300"
                        : "bg-slate-700 text-slate-400"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="w-3 h-3" />
                    {stage.duration}
                  </div>
                </div>

                <h3
                  className={`font-display text-lg font-medium mb-2 ${
                    stage.status === "senior" ? "text-emerald-400" : "text-marble-100"
                  }`}
                >
                  {stage.level}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">{stage.description}</p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// REQUIREMENTS SECTION
// ============================================================================
function RequirementsSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left column: Content */}
          <div>
            <SectionLabel>what we look for</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
              Keeper Requirements
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              We&apos;re looking for volunteers who are connected to their local startup ecosystem
              and committed to building something meaningful. No prior experience with SOIL is
              required - just passion for the mission.
            </p>

            <ul className="space-y-4">
              {[
                "Connection to your local startup or business community",
                "Time commitment: a few hours per week for moderation and community",
                "Willingness to learn and grow with the platform",
                "Commitment to SOIL's mission and values",
                "Good communication skills in English (local language is a plus)",
              ].map((point, index) => (
                <li key={index} className="flex items-start gap-3 text-slate-400">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right column: Visual */}
          <div className="flex items-center justify-center">
            <Card variant="dark-elevated" padding="lg" className="w-full">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-4">
                    <Shield className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="font-display text-xl font-medium text-marble-100 mb-2">
                    Pioneer Keepers Wanted
                  </h3>
                  <p className="text-slate-400 text-sm">
                    We&apos;re building our initial network of Keepers. Join now to be a founding
                    guardian of your regional cenotaphery.
                  </p>
                </div>

                {/* Regions we're looking for */}
                <div className="pt-6 border-t border-slate-700">
                  <p className="text-sm text-slate-500 mb-3">Priority regions:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "North America",
                      "Europe",
                      "UK",
                      "LATAM",
                      "Southeast Asia",
                      "India",
                      "Africa",
                    ].map((region) => (
                      <span
                        key={region}
                        className="px-3 py-1 rounded-full text-sm bg-slate-700/50 text-slate-400"
                      >
                        {region}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-center text-sm text-emerald-400/80 pt-4 border-t border-slate-700">
                  <Globe className="w-4 h-4 inline mr-2" />
                  All regions welcome
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CURRENT STATUS SECTION
// ============================================================================
function CurrentStatusSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left column: Content */}
          <div>
            <SectionLabel>where we are</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
              Building the Network
            </h2>
            <p className="text-lg text-slate-400">
              SOIL is in its early stages, and we&apos;re actively recruiting our first generation
              of Keepers. This is a unique opportunity to shape how the platform grows in your
              region from the very beginning.
            </p>
          </div>

          {/* Right column: Status items */}
          <div className="space-y-6">
            {[
              { status: "progress", label: "Building core platform infrastructure" },
              { status: "progress", label: "Recruiting pioneer Keepers worldwide" },
              { status: "future", label: "Assigning Keepers to emerging regions" },
              { status: "future", label: "Keeper training program" },
              { status: "future", label: "Community governance systems" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div
                  className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    item.status === "complete"
                      ? "bg-success-500"
                      : item.status === "progress"
                        ? "bg-emerald-500 animate-pulse"
                        : "bg-slate-600"
                  }`}
                />
                <span className={item.status === "future" ? "text-slate-500" : "text-marble-100"}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// APPLICATION SECTION
// ============================================================================
function ApplicationSection() {
  return (
    <section id="apply" className="py-16 md:py-24 bg-slate-900/50">
      <div className="max-w-content mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <SectionLabel>join us</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
            Apply to Become a Keeper
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            Ready to lead your regional community? Send us an email with a bit about yourself and
            why you want to be a Keeper.
          </p>

          <Card variant="dark-elevated" padding="lg" className="mb-8">
            <div className="space-y-6">
              <div className="text-left">
                <p className="text-marble-100 font-medium mb-4">Include in your application:</p>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">•</span>
                    Your name and location (city/country)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">•</span>
                    Your connection to the local startup/business ecosystem
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">•</span>
                    Why you want to become a Keeper
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">•</span>
                    How much time you can dedicate weekly
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">•</span>
                    Links to your LinkedIn or relevant profiles (optional)
                  </li>
                </ul>
              </div>

              <a href={mailtoLink("community", "Keeper Application")}>
                <Button
                  variant="dark-primary"
                  size="lg"
                  className="w-full"
                  rightIcon={<Mail className="w-5 h-5" />}
                >
                  {siteConfig.emails.community}
                </Button>
              </a>

              <p className="text-sm text-slate-500">
                We review applications weekly and will respond within 1-2 weeks.
              </p>
            </div>
          </Card>

          {/* Alternative CTAs */}
          <div className="pt-8 border-t border-slate-800">
            <p className="text-slate-500 mb-6">Not ready to apply? Explore other ways to help:</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/community">
                <Button variant="dark-secondary" size="lg">
                  Join the Community
                </Button>
              </Link>
              <Link href="/organization/create">
                <Button variant="dark-ghost" size="lg">
                  Contribute Data
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// KEEPERS PAGE
// ============================================================================
export default function KeepersPage() {
  return (
    <>
      <HeroSection />
      <WhatKeepersDoSection />
      <WhyBecomeKeeperSection />
      <KeeperPathSection />
      <RequirementsSection />
      <CurrentStatusSection />
      <ApplicationSection />
    </>
  );
}
