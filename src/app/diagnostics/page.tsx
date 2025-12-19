"use client";

import { useState } from "react";
import { SectionLabel } from "@/components/ui/section-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Activity,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Database,
  ArrowRight,
  CheckCircle,
  Clock,
  Microscope,
  Shield,
} from "lucide-react";
import Link from "next/link";

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
                The Future of <span className="text-gradient-gold">Organizational Health</span>
              </h1>
              <p className="text-base lg:text-lg text-slate-400 mb-8 leading-relaxed">
                We are building toward a diagnostic center that will help organizations identify
                risks early — powered by patterns discovered through systematic research on
                organizational mortality.
              </p>

              {/* CTA Button */}
              <a href="#waitlist">
                <Button
                  variant="dark-primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Join the Waitlist
                </Button>
              </a>
            </div>

            {/* Status Card */}
            <Card variant="dark" padding="lg" className="mt-8">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-gold-500 animate-pulse" />
                <span className="text-slate-400">Currently in research phase</span>
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
              <div className="absolute inset-0 bg-gradient-radial from-gold-500/10 via-transparent to-transparent" />

              {/* Decorative SVG - Health monitoring themed */}
              <svg
                viewBox="0 0 400 400"
                className="w-auto h-full max-h-[65vh] scale-110"
                fill="none"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Pulse/heartbeat line */}
                <path
                  d="M50,200 L120,200 L140,150 L160,250 L180,180 L200,220 L220,200 L350,200"
                  fill="none"
                  stroke="rgba(196,161,90,0.4)"
                  strokeWidth="2"
                />

                {/* Concentric circles - health rings */}
                {[0, 1, 2, 3].map((i) => (
                  <circle
                    key={`ring-${i}`}
                    cx="200"
                    cy="200"
                    r={50 + i * 35}
                    fill="none"
                    stroke={`rgba(196,161,90,${0.3 - i * 0.05})`}
                    strokeWidth="1"
                    strokeDasharray={i === 0 ? "0" : `${5 + i * 3} ${3 + i * 2}`}
                  />
                ))}

                {/* Center indicator */}
                <circle
                  cx="200"
                  cy="200"
                  r="30"
                  fill="rgba(196,161,90,0.1)"
                  stroke="rgba(196,161,90,0.5)"
                  strokeWidth="2"
                />
                <circle cx="200" cy="200" r="10" fill="rgba(196,161,90,0.3)" />

                {/* Data points on rings */}
                {[
                  { cx: 200, cy: 115, r: 5 },
                  { cx: 285, cy: 200, r: 4 },
                  { cx: 200, cy: 285, r: 5 },
                  { cx: 115, cy: 200, r: 4 },
                  { cx: 260, cy: 140, r: 3 },
                  { cx: 140, cy: 260, r: 3 },
                  { cx: 320, cy: 200, r: 4 },
                  { cx: 80, cy: 200, r: 4 },
                ].map((point, i) => (
                  <circle
                    key={`point-${i}`}
                    cx={point.cx}
                    cy={point.cy}
                    r={point.r}
                    fill="rgba(196,161,90,0.6)"
                  />
                ))}

                {/* Warning indicators (small triangles) */}
                <polygon
                  points="320,120 330,140 310,140"
                  fill="rgba(196,161,90,0.3)"
                  stroke="rgba(196,161,90,0.5)"
                  strokeWidth="1"
                />
                <polygon
                  points="80,280 90,300 70,300"
                  fill="rgba(196,161,90,0.3)"
                  stroke="rgba(196,161,90,0.5)"
                  strokeWidth="1"
                />
              </svg>

              {/* Floating labels */}
              <div className="absolute top-6 right-6 text-xs text-gold-400/60 font-mono">
                HEALTH ASSESSMENT
              </div>
              <div className="absolute bottom-6 left-6 text-xs text-gold-400/60 font-mono">
                EARLY DETECTION
              </div>
              <div className="absolute top-1/2 right-6 -translate-y-1/2 text-xs text-gold-400/60 font-mono">
                RISK SCORING
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
// VISION SECTION
// ============================================================================
function VisionSection() {
  return (
    <section className="py-16 md:py-24 animate-fade-in-up">
      <div className="max-w-content mx-auto px-6">
        <SectionLabel>our vision</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
          What We Are Building Toward
        </h2>
        <p className="text-lg text-slate-400 max-w-3xl mb-12">
          Just as modern medicine uses diagnostic tools to detect health issues before they become
          critical, we envision a future where organizations can assess their health and identify
          risks early. This requires a foundation of research data that does not yet exist.
        </p>

        {/* Research → Models → Diagnostics flow */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Database className="w-8 h-8" />,
              step: "I",
              title: "Research Foundation",
              description:
                "Thousands of organizational autopsies collected through the Cenotaphery, creating the first comprehensive mortality database.",
              status: "In Progress",
            },
            {
              icon: <Microscope className="w-8 h-8" />,
              step: "II",
              title: "Pattern Discovery",
              description:
                "Statistical analysis reveals recurring patterns, failure archetypes, and early warning indicators across organizations.",
              status: "Future",
            },
            {
              icon: <Activity className="w-8 h-8" />,
              step: "III",
              title: "Diagnostic Tools",
              description:
                "Validated predictive models enable health assessment and risk scoring for living organizations.",
              status: "Future",
            },
          ].map((item, index) => (
            <div key={index} className="relative">
              {/* Connection line */}
              {index < 2 && (
                <div className="hidden md:block absolute top-12 left-full w-8 h-[2px] bg-gradient-to-r from-gold-500/50 to-transparent -translate-x-4" />
              )}

              <div className="space-y-4">
                {/* Icon with step */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400">
                    {item.icon}
                  </div>
                  <span className="font-serif text-3xl text-gold-500/30">{item.step}</span>
                </div>

                {/* Status badge */}
                <div
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${
                    item.status === "In Progress"
                      ? "bg-gold-500/20 text-gold-400"
                      : "bg-slate-700/50 text-slate-500"
                  }`}
                >
                  {item.status === "In Progress" ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                  ) : (
                    <Clock className="w-3 h-3" />
                  )}
                  {item.status}
                </div>

                <h3 className="font-display text-xl font-medium text-marble-100">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// POTENTIAL CAPABILITIES SECTION
// ============================================================================
function PotentialCapabilitiesSection() {
  const capabilities = [
    {
      icon: <AlertTriangle className="w-7 h-7" />,
      title: "Early Warning Systems",
      description:
        "The research aims to identify indicators that precede organizational failure, potentially enabling early detection of risks.",
    },
    {
      icon: <BarChart3 className="w-7 h-7" />,
      title: "Health Benchmarking",
      description:
        "Organizations may be able to compare their health metrics against patterns from the mortality database.",
    },
    {
      icon: <TrendingUp className="w-7 h-7" />,
      title: "Risk Assessment",
      description:
        "Predictive models could help identify which organizational characteristics correlate with higher mortality risk.",
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: "Prevention Protocols",
      description:
        "Research findings may lead to evidence-based intervention recommendations for at-risk organizations.",
    },
  ];

  return (
    <>
      {/* Gradient transition into section */}
      <div className="h-24 bg-gradient-to-b from-slate-900 to-marble-950" />

      <section className="py-16 md:py-24 bg-marble-950 relative">
        <div className="max-w-content mx-auto px-6">
          <SectionLabel>potential capabilities</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
            What Diagnostics May Enable
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mb-12">
            When sufficient research data is collected and validated, the Diagnostics Center aims to
            provide the following capabilities. These are goals, not guarantees.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {capabilities.map((capability, index) => (
              <Card key={index} variant="dark-elevated" padding="lg" className="h-full">
                <CardHeader>
                  <div className="w-14 h-14 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 mb-2">
                    {capability.icon}
                  </div>
                  <CardTitle variant="dark">{capability.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 leading-relaxed">{capability.description}</p>
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
// RESEARCH FOUNDATION SECTION
// ============================================================================
function ResearchFoundationSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left column: Content */}
          <div>
            <SectionLabel>built on research</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
              Data Integrity First
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              The Diagnostics Center will be a commercial service that licenses aggregated patterns
              and anonymized models from SOIL&apos;s nonprofit Research Center. This ensures:
            </p>

            <ul className="space-y-4 mb-8">
              {[
                "Raw founder stories are never sold or shared",
                "Only aggregated, anonymized patterns power diagnostics",
                "Revenue flows back to fund continued research",
                "Clear separation between nonprofit mission and commercial services",
              ].map((point, index) => (
                <li key={index} className="flex items-start gap-3 text-slate-400">
                  <CheckCircle className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <Link href="/research">
              <Button
                variant="dark-secondary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Learn About Our Research
              </Button>
            </Link>
          </div>

          {/* Right column: Visual */}
          <div className="flex items-center justify-center">
            <Card variant="dark-elevated" padding="lg" className="w-full">
              <div className="space-y-6">
                {/* Flow diagram */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 mb-4">
                    <Database className="w-5 h-5 text-gold-400" />
                    <span className="text-marble-100 font-medium">Research Core</span>
                    <span className="text-xs text-slate-500">(Nonprofit)</span>
                  </div>

                  <div className="w-[2px] h-8 bg-gold-500/30 mx-auto" />
                  <div className="text-xs text-slate-500 py-2">Aggregated Patterns</div>
                  <div className="w-[2px] h-8 bg-gold-500/30 mx-auto" />

                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500/10 border border-gold-500/30">
                    <Activity className="w-5 h-5 text-gold-400" />
                    <span className="text-marble-100 font-medium">Diagnostics Center</span>
                    <span className="text-xs text-slate-500">(Commercial)</span>
                  </div>
                </div>

                <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-700">
                  Revenue from diagnostics funds continued research
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
            <SectionLabel>where we are today</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
              Honest About Our Progress
            </h2>
            <p className="text-lg text-slate-400">
              Building a diagnostic system for organizational health requires a research foundation
              that does not yet exist. We are transparent about what we have and what we are working
              toward.
            </p>
          </div>

          {/* Right column: Status items */}
          <div className="space-y-6">
            {[
              {
                status: "complete",
                label: "Research methodology designed",
              },
              {
                status: "progress",
                label: "Data collection infrastructure built",
              },
              {
                status: "progress",
                label: "Initial organizational autopsies being collected",
              },
              {
                status: "future",
                label: "Statistical significance for pattern detection",
              },
              {
                status: "future",
                label: "Predictive model development",
              },
              {
                status: "future",
                label: "Diagnostics Center launch",
              },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div
                  className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    item.status === "complete"
                      ? "bg-success-500"
                      : item.status === "progress"
                        ? "bg-gold-500 animate-pulse"
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
// WAITLIST SECTION
// ============================================================================
function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual waitlist submission
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section id="waitlist" className="py-16 md:py-24 bg-slate-900/50">
      <div className="max-w-content mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <SectionLabel>stay informed</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
            Join the Waitlist
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            Be the first to know when the Diagnostics Center becomes available. We&apos;ll send
            occasional updates on our research progress — no spam, ever.
          </p>

          {submitted ? (
            <Card variant="dark-elevated" padding="lg">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-success-500/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-success-500" />
                </div>
                <h3 className="font-display text-xl font-medium text-marble-100">
                  You&apos;re on the list
                </h3>
                <p className="text-slate-400">We&apos;ll keep you updated on our progress.</p>
              </div>
            </Card>
          ) : (
            <Card variant="dark-elevated" padding="lg">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    variant="dark"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                    required
                  />
                  <Button
                    type="submit"
                    variant="dark-primary"
                    size="lg"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Join Waitlist
                  </Button>
                </div>
                <p className="text-xs text-slate-500">
                  Your email will only be used for Diagnostics Center updates. You can unsubscribe
                  at any time.
                </p>
              </form>
            </Card>
          )}

          {/* Alternative CTAs */}
          <div className="mt-12 pt-8 border-t border-slate-800">
            <p className="text-slate-500 mb-6">Want to help build this future?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/research">
                <Button variant="dark-secondary" size="lg">
                  Join the Research
                </Button>
              </Link>
              <Link href="/memorials/cenotaphery">
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
// DIAGNOSTICS PAGE
// ============================================================================
export default function DiagnosticsPage() {
  return (
    <>
      <HeroSection />
      <VisionSection />
      <PotentialCapabilitiesSection />
      <ResearchFoundationSection />
      <CurrentStatusSection />
      <WaitlistSection />
    </>
  );
}
