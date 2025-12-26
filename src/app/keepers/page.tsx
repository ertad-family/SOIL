"use client";

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
} from "lucide-react";

// ============================================================================
// HERO SECTION
// ============================================================================
function HeroSection() {
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

          {/* Right: Decorative Graphic - 2/3 width */}
          <div className="animate-fade-in-up stagger-1 lg:w-2/3">
            <Card
              variant="dark-elevated"
              padding="none"
              className="h-full max-h-[70vh] relative overflow-hidden flex items-center justify-center"
            >
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-radial from-emerald-500/10 via-transparent to-transparent" />

              {/* Decorative SVG - Regional hierarchy themed */}
              <svg
                viewBox="0 0 400 400"
                className="w-auto h-full max-h-[65vh] scale-110"
                fill="none"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Background circular patterns - representing regional coverage */}
                <circle
                  cx="200"
                  cy="200"
                  r="150"
                  fill="none"
                  stroke="rgba(100,180,130,0.1)"
                  strokeWidth="1"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="110"
                  fill="none"
                  stroke="rgba(100,180,130,0.15)"
                  strokeWidth="1"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="70"
                  fill="none"
                  stroke="rgba(100,180,130,0.2)"
                  strokeWidth="1"
                />

                {/* Central shield - Keeper symbol */}
                <g transform="translate(200, 200)">
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

                {/* Regional nodes around the center */}
                {[
                  { cx: 200, cy: 80, label: "Country", size: 20 },
                  { cx: 300, cy: 140, label: "Region", size: 16 },
                  { cx: 320, cy: 260, label: "City", size: 14 },
                  { cx: 200, cy: 320, label: "City", size: 14 },
                  { cx: 80, cy: 260, label: "City", size: 14 },
                  { cx: 100, cy: 140, label: "Region", size: 16 },
                ].map((node, i) => (
                  <g key={`node-${i}`}>
                    {/* Connection line to center */}
                    <line
                      x1={node.cx}
                      y1={node.cy}
                      x2="200"
                      y2="200"
                      stroke="rgba(100,180,130,0.2)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    {/* Node */}
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r={node.size}
                      fill="rgba(100,180,130,0.1)"
                      stroke="rgba(100,180,130,0.4)"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r={node.size * 0.4}
                      fill="rgba(100,180,130,0.5)"
                    />
                  </g>
                ))}

                {/* Keeper path - ascending steps on the right */}
                <g>
                  {/* Level 1: Applicant */}
                  <rect
                    x="280"
                    y="320"
                    width="70"
                    height="24"
                    rx="4"
                    fill="rgba(100,180,130,0.1)"
                    stroke="rgba(100,180,130,0.3)"
                    strokeWidth="1"
                  />
                  <text
                    x="315"
                    y="336"
                    textAnchor="middle"
                    fill="rgba(100,180,130,0.6)"
                    fontSize="9"
                    fontFamily="system-ui"
                  >
                    APPLICANT
                  </text>

                  {/* Level 2: Apprentice */}
                  <rect
                    x="300"
                    y="280"
                    width="70"
                    height="24"
                    rx="4"
                    fill="rgba(100,180,130,0.15)"
                    stroke="rgba(100,180,130,0.4)"
                    strokeWidth="1"
                  />
                  <text
                    x="335"
                    y="296"
                    textAnchor="middle"
                    fill="rgba(100,180,130,0.7)"
                    fontSize="9"
                    fontFamily="system-ui"
                  >
                    APPRENTICE
                  </text>

                  {/* Level 3: Keeper */}
                  <rect
                    x="310"
                    y="240"
                    width="60"
                    height="24"
                    rx="4"
                    fill="rgba(100,180,130,0.2)"
                    stroke="rgba(100,180,130,0.5)"
                    strokeWidth="1.5"
                  />
                  <text
                    x="340"
                    y="256"
                    textAnchor="middle"
                    fill="rgba(100,180,130,0.9)"
                    fontSize="9"
                    fontFamily="system-ui"
                  >
                    KEEPER
                  </text>

                  {/* Level 4: Senior */}
                  <rect
                    x="315"
                    y="200"
                    width="60"
                    height="24"
                    rx="4"
                    fill="rgba(100,180,130,0.25)"
                    stroke="rgba(100,180,130,0.6)"
                    strokeWidth="2"
                  />
                  <text
                    x="345"
                    y="216"
                    textAnchor="middle"
                    fill="rgba(100,180,130,1)"
                    fontSize="9"
                    fontFamily="system-ui"
                    fontWeight="600"
                  >
                    SENIOR
                  </text>

                  {/* Star for senior */}
                  <polygon
                    points="345,190 347,183 350,190 357,190 352,195 354,202 345,198 336,202 338,195 333,190"
                    fill="rgba(196,161,90,0.5)"
                  />
                </g>
              </svg>

              {/* Floating labels */}
              <div className="absolute top-6 right-6 text-sm text-emerald-400/60 font-mono">
                REGIONAL NETWORK
              </div>
              <div className="absolute bottom-6 left-6 text-sm text-emerald-400/60 font-mono">
                COMMUNITY GUARDIANS
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
              required — just passion for the mission.
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

              <a href="mailto:community@soil.rip?subject=Keeper Application">
                <Button
                  variant="dark-primary"
                  size="lg"
                  className="w-full"
                  rightIcon={<Mail className="w-5 h-5" />}
                >
                  community@soil.rip
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
