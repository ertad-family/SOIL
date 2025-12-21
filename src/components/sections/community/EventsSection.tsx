"use client";

import { SectionLabel } from "@/components/ui/section-label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Globe, MapPin, Users, ArrowRight, Search } from "lucide-react";

// Day of the Dead Venture illustration SVG
function DayOfDeadVentureSVG() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-auto max-w-[160px]" fill="none">
      {/* Background glow */}
      <circle cx="100" cy="100" r="80" fill="rgba(196,161,90,0.1)" />

      {/* Outer ring with candles */}
      <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(196,161,90,0.3)" strokeWidth="1" />

      {/* Candles around the circle */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 100 + 70 * Math.cos(rad);
        const y = 100 + 70 * Math.sin(rad);
        return (
          <g key={i} transform={`translate(${x}, ${y})`}>
            <rect x="-3" y="-8" width="6" height="12" fill="rgba(196,161,90,0.6)" rx="1" />
            <ellipse cx="0" cy="-10" rx="3" ry="4" fill="rgba(255,200,100,0.8)" />
          </g>
        );
      })}

      {/* Central memorial structure */}
      <rect
        x="85"
        y="70"
        width="30"
        height="50"
        fill="rgba(196,161,90,0.2)"
        stroke="rgba(196,161,90,0.5)"
        strokeWidth="1"
        rx="2"
      />
      <rect x="90" y="75" width="20" height="10" fill="rgba(196,161,90,0.3)" rx="1" />
      <rect x="90" y="90" width="20" height="3" fill="rgba(196,161,90,0.4)" />
      <rect x="90" y="97" width="20" height="3" fill="rgba(196,161,90,0.4)" />
      <rect x="90" y="104" width="20" height="3" fill="rgba(196,161,90,0.4)" />

      {/* Marigold flowers */}
      {[
        { cx: 70, cy: 130 },
        { cx: 100, cy: 140 },
        { cx: 130, cy: 130 },
      ].map((pos, i) => (
        <g key={`flower-${i}`}>
          <circle cx={pos.cx} cy={pos.cy} r="8" fill="rgba(255,150,50,0.6)" />
          <circle cx={pos.cx} cy={pos.cy} r="4" fill="rgba(255,200,100,0.8)" />
        </g>
      ))}

      {/* Stars */}
      {[
        { cx: 50, cy: 50, r: 2 },
        { cx: 150, cy: 45, r: 1.5 },
        { cx: 40, cy: 90, r: 1 },
        { cx: 160, cy: 85, r: 1.5 },
        { cx: 60, cy: 160, r: 1 },
        { cx: 140, cy: 155, r: 1 },
      ].map((star, i) => (
        <circle
          key={`star-${i}`}
          cx={star.cx}
          cy={star.cy}
          r={star.r}
          fill="rgba(196,161,90,0.7)"
        />
      ))}
    </svg>
  );
}

// Meetup illustration SVG
function MeetupSVG() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-auto max-w-[160px]" fill="none">
      {/* Background */}
      <circle cx="100" cy="100" r="75" fill="rgba(147,112,219,0.1)" />

      {/* Table */}
      <ellipse
        cx="100"
        cy="130"
        rx="60"
        ry="15"
        fill="rgba(147,112,219,0.2)"
        stroke="rgba(147,112,219,0.4)"
        strokeWidth="1"
      />

      {/* People around the table */}
      {[
        { x: 50, y: 100, color: "rgba(196,161,90,0.6)" },
        { x: 80, y: 85, color: "rgba(147,112,219,0.6)" },
        { x: 120, y: 85, color: "rgba(100,180,130,0.6)" },
        { x: 150, y: 100, color: "rgba(230,126,90,0.6)" },
        { x: 65, y: 110, color: "rgba(196,161,90,0.5)" },
        { x: 135, y: 110, color: "rgba(147,112,219,0.5)" },
      ].map((person, i) => (
        <g key={i}>
          {/* Body */}
          <ellipse cx={person.x} cy={person.y + 15} rx="10" ry="12" fill={person.color} />
          {/* Head */}
          <circle cx={person.x} cy={person.y} r="8" fill={person.color} />
        </g>
      ))}

      {/* Speech bubbles */}
      <g opacity="0.5">
        <ellipse cx="70" cy="60" rx="15" ry="10" fill="rgba(196,161,90,0.3)" />
        <ellipse cx="130" cy="55" rx="12" ry="8" fill="rgba(147,112,219,0.3)" />
      </g>

      {/* Connection lines */}
      <g stroke="rgba(196,161,90,0.2)" strokeWidth="1" strokeDasharray="2 2">
        <line x1="60" y1="95" x2="90" y2="90" />
        <line x1="110" y1="90" x2="140" y2="95" />
        <line x1="75" y1="105" x2="125" y2="105" />
      </g>
    </svg>
  );
}

// Pre-calculated positions for orbiting cenotaphs (angles: 0, 72, 144, 216, 288 degrees)
// This avoids hydration mismatches from floating point precision differences
const orbitPositions = [
  { x: 155, y: 100 }, // 0°
  { x: 117, y: 152.33 }, // 72°
  { x: 55.5, y: 132.33 }, // 144°
  { x: 55.5, y: 67.67 }, // 216°
  { x: 117, y: 47.67 }, // 288°
];

// Cenotaph Network illustration SVG
function CenotaphNetworkSVG() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-auto max-w-[160px]" fill="none">
      {/* Background */}
      <circle cx="100" cy="100" r="75" fill="rgba(196,161,90,0.08)" />

      {/* Central cenotaph/memorial */}
      <g transform="translate(100, 100)">
        <rect
          x="-15"
          y="-25"
          width="30"
          height="40"
          fill="rgba(196,161,90,0.25)"
          stroke="rgba(196,161,90,0.5)"
          strokeWidth="1"
          rx="2"
        />
        <rect x="-10" y="-20" width="20" height="8" fill="rgba(196,161,90,0.35)" rx="1" />
        <circle
          cx="0"
          cy="-5"
          r="6"
          fill="rgba(196,161,90,0.4)"
          stroke="rgba(196,161,90,0.6)"
          strokeWidth="1"
        />
      </g>

      {/* Orbiting cenotaphs */}
      {orbitPositions.map((pos, i) => (
        <g key={i} transform={`translate(${pos.x}, ${pos.y})`}>
          <rect
            x="-8"
            y="-12"
            width="16"
            height="20"
            fill="rgba(196,161,90,0.15)"
            stroke="rgba(196,161,90,0.35)"
            strokeWidth="1"
            rx="1"
          />
          <circle cx="0" cy="-2" r="3" fill="rgba(196,161,90,0.4)" />
        </g>
      ))}

      {/* Connection lines */}
      <g stroke="rgba(196,161,90,0.25)" strokeWidth="1" strokeDasharray="3 3">
        {orbitPositions.map((pos, i) => (
          <line key={i} x1="100" y1="100" x2={pos.x} y2={pos.y} />
        ))}
      </g>

      {/* Search/magnifying glass */}
      <g transform="translate(145, 50)">
        <circle cx="0" cy="0" r="12" fill="none" stroke="rgba(196,161,90,0.5)" strokeWidth="2" />
        <line
          x1="8"
          y1="8"
          x2="16"
          y2="16"
          stroke="rgba(196,161,90,0.5)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* Sparkles */}
      <circle cx="40" cy="60" r="2" fill="rgba(196,161,90,0.6)" />
      <circle cx="160" cy="70" r="1.5" fill="rgba(196,161,90,0.6)" />
      <circle cx="50" cy="150" r="1.5" fill="rgba(196,161,90,0.6)" />
      <circle cx="155" cy="145" r="2" fill="rgba(196,161,90,0.6)" />
    </svg>
  );
}

const events = [
  {
    id: "day-of-dead",
    title: "Day of the Dead Venture",
    subtitle: "Annual Global Celebration",
    description:
      "A worldwide celebration honoring organizations that have ended their journey. Share stories, light virtual candles, and connect with the community in remembrance.",
    date: "November annually",
    format: "Hybrid (Virtual + Local)",
    icon: <Globe className="w-5 h-5" />,
    illustration: <DayOfDeadVentureSVG />,
    features: [
      "Virtual memorial ceremonies",
      "Local community gatherings",
      "Storytelling sessions",
      "New cenotaph dedications",
    ],
    cta: "Join Waitlist",
    href: "#waitlist",
  },
  {
    id: "meetups",
    title: "Regional Meetups",
    subtitle: "Quarterly Community Events",
    description:
      "Connect with local founders, researchers, and contributors. Share experiences, learn from failures, and build meaningful connections in a supportive environment.",
    date: "Quarterly",
    format: "In-person (FuckUp Nights format)",
    icon: <MapPin className="w-5 h-5" />,
    illustration: <MeetupSVG />,
    features: [
      "Organized by local Keepers",
      "Failure storytelling sessions",
      "Networking opportunities",
      "Research presentations",
    ],
    cta: "Find Local Events",
    href: "#local-events",
  },
];

// Founders Network card data (separate for center positioning)
const foundersNetwork = {
  id: "cenotaph-network",
  title: "Founders Network",
  subtitle: "Explore & Connect",
  description:
    "Discover cenotaphs with similar stories to yours. Search by industry, failure type, timeline, or challenges faced. Connect directly with founders who understand your journey.",
  date: "Always available",
  format: "Platform feature",
  icon: <Search className="w-5 h-5" />,
  illustration: <CenotaphNetworkSVG />,
  features: [
    "Search by failure patterns",
    "Find similar experiences",
    "Request 1-on-1 conversations",
    "Exchange lessons learned",
  ],
  cta: "Explore Cenotaphs",
  href: "/cenotaphery",
};

export function EventsSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>events & gatherings</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
            Connect In Person & Online
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            From annual celebrations and local meetups to our founders network — there are many ways
            to connect with the SOIL community.
          </p>
        </div>

        {/* Top row: 2 event cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {events.map((event) => (
            <Card key={event.id} variant="dark" padding="lg" className="h-full">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-gold-400 text-sm mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <CardTitle variant="dark" className="text-xl mb-1">
                      {event.title}
                    </CardTitle>
                    <p className="text-sm text-slate-500">{event.subtitle}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0">{event.illustration}</div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{event.description}</p>

                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                  {event.icon}
                  <span>{event.format}</span>
                </div>

                <div className="space-y-2 mb-6">
                  {event.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-slate-400">
                      <Users className="w-3 h-3 text-gold-400/60" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <a href={event.href}>
                  <Button
                    variant="dark-secondary"
                    size="md"
                    className="w-full"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    {event.cta}
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Center row: Founders Network */}
        <div className="flex justify-center">
          <Card variant="dark" padding="lg" className="max-w-xl w-full">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-gold-400 text-sm mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{foundersNetwork.date}</span>
                  </div>
                  <CardTitle variant="dark" className="text-xl mb-1">
                    {foundersNetwork.title}
                  </CardTitle>
                  <p className="text-sm text-slate-500">{foundersNetwork.subtitle}</p>
                </div>
                <div className="ml-4 flex-shrink-0">{foundersNetwork.illustration}</div>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                {foundersNetwork.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                {foundersNetwork.icon}
                <span>{foundersNetwork.format}</span>
              </div>

              <div className="space-y-2 mb-6">
                {foundersNetwork.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-slate-400">
                    <Users className="w-3 h-3 text-gold-400/60" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <a href={foundersNetwork.href}>
                <Button
                  variant="dark-secondary"
                  size="md"
                  className="w-full"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {foundersNetwork.cta}
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
