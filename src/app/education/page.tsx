"use client";

import { useState } from "react";
import { SectionLabel } from "@/components/ui/section-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  GraduationCap,
  Users,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  Clock,
  Database,
  FileText,
  Award,
  Briefcase,
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
                Knowledge for <span className="text-gradient-gold">Organizational Resilience</span>
              </h1>
              <p className="text-base lg:text-lg text-slate-400 mb-8 leading-relaxed">
                We are building an educational platform that will translate research findings into
                practical knowledge — courses, resources, and training for anyone working to build
                healthier organizations.
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
                <span className="text-slate-400">Curriculum in development</span>
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

              {/* Decorative SVG - Education/knowledge themed */}
              <svg
                viewBox="0 0 400 400"
                className="w-auto h-full max-h-[65vh] scale-110"
                fill="none"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Book/knowledge base at center */}
                <rect
                  x="160"
                  y="170"
                  width="80"
                  height="60"
                  rx="4"
                  fill="rgba(196,161,90,0.1)"
                  stroke="rgba(196,161,90,0.5)"
                  strokeWidth="2"
                />
                {/* Book spine */}
                <line
                  x1="200"
                  y1="170"
                  x2="200"
                  y2="230"
                  stroke="rgba(196,161,90,0.3)"
                  strokeWidth="2"
                />
                {/* Book pages */}
                {[0, 1, 2].map((i) => (
                  <line
                    key={`page-${i}`}
                    x1={170 + i * 10}
                    y1="180"
                    x2={170 + i * 10}
                    y2="220"
                    stroke="rgba(196,161,90,0.2)"
                    strokeWidth="1"
                  />
                ))}
                {[0, 1, 2].map((i) => (
                  <line
                    key={`page2-${i}`}
                    x1={210 + i * 10}
                    y1="180"
                    x2={210 + i * 10}
                    y2="220"
                    stroke="rgba(196,161,90,0.2)"
                    strokeWidth="1"
                  />
                ))}

                {/* Knowledge rays emanating from book */}
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                  const angle = (i * 45 - 90) * (Math.PI / 180);
                  const x1 = 200 + Math.cos(angle) * 50;
                  const y1 = 200 + Math.sin(angle) * 50;
                  const x2 = 200 + Math.cos(angle) * 100;
                  const y2 = 200 + Math.sin(angle) * 100;
                  return (
                    <line
                      key={`ray-${i}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="rgba(196,161,90,0.2)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  );
                })}

                {/* Learning nodes around the center */}
                {[
                  { cx: 200, cy: 80, label: "Courses" },
                  { cx: 300, cy: 140, label: "Resources" },
                  { cx: 320, cy: 260, label: "Training" },
                  { cx: 200, cy: 320, label: "Certification" },
                  { cx: 80, cy: 260, label: "Community" },
                  { cx: 100, cy: 140, label: "Research" },
                ].map((node, i) => (
                  <g key={`node-${i}`}>
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r="25"
                      fill="rgba(196,161,90,0.1)"
                      stroke="rgba(196,161,90,0.3)"
                      strokeWidth="1.5"
                    />
                    <circle cx={node.cx} cy={node.cy} r="8" fill="rgba(196,161,90,0.4)" />
                  </g>
                ))}

                {/* Graduation cap icon at top */}
                <path
                  d="M200,60 L230,75 L200,90 L170,75 Z"
                  fill="rgba(196,161,90,0.3)"
                  stroke="rgba(196,161,90,0.5)"
                  strokeWidth="1.5"
                />
                <line
                  x1="200"
                  y1="75"
                  x2="200"
                  y2="55"
                  stroke="rgba(196,161,90,0.5)"
                  strokeWidth="1.5"
                />
              </svg>

              {/* Floating labels */}
              <div className="absolute top-6 right-6 text-xs text-gold-400/60 font-mono">
                COURSES
              </div>
              <div className="absolute bottom-6 left-6 text-xs text-gold-400/60 font-mono">
                RESOURCES
              </div>
              <div className="absolute top-1/2 right-6 -translate-y-1/2 text-xs text-gold-400/60 font-mono">
                CERTIFICATION
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
          From Research to Practice
        </h2>
        <p className="text-lg text-slate-400 max-w-3xl mb-12">
          The Learning Hub will bridge the gap between academic research and practical application.
          As patterns emerge from organizational mortality data, we will translate these insights
          into educational content that helps people build and sustain healthier organizations.
        </p>

        {/* Research → Education → Application flow */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Database className="w-8 h-8" />,
              step: "I",
              title: "Research Insights",
              description:
                "Patterns and findings from organizational mortality research form the foundation of all educational content.",
              status: "In Progress",
            },
            {
              icon: <BookOpen className="w-8 h-8" />,
              step: "II",
              title: "Educational Content",
              description:
                "Research findings are translated into courses, guides, and resources accessible to diverse audiences.",
              status: "Future",
            },
            {
              icon: <Lightbulb className="w-8 h-8" />,
              step: "III",
              title: "Practical Application",
              description:
                "Learners apply evidence-based knowledge to build resilient organizations and prevent common failure modes.",
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
// POTENTIAL OFFERINGS SECTION
// ============================================================================
function PotentialOfferingsSection() {
  const offerings = [
    {
      icon: <BookOpen className="w-7 h-7" />,
      title: "Online Courses",
      description:
        "Self-paced courses on organizational health, resilience, and common failure patterns — grounded in research findings.",
    },
    {
      icon: <FileText className="w-7 h-7" />,
      title: "Knowledge Resources",
      description:
        "Guides, frameworks, and tools for assessing and improving organizational health, available to all.",
    },
    {
      icon: <GraduationCap className="w-7 h-7" />,
      title: "Professional Training",
      description:
        "Structured programs preparing consultants and specialists for careers in organizational medicine.",
    },
    {
      icon: <Award className="w-7 h-7" />,
      title: "Certification Preparation",
      description:
        "Educational pathways supporting future certification in organizational medicine specialties.",
    },
  ];

  return (
    <>
      {/* Gradient transition into section */}
      <div className="h-24 bg-gradient-to-b from-slate-900 to-marble-950" />

      <section className="py-16 md:py-24 bg-marble-950 relative">
        <div className="max-w-content mx-auto px-6">
          <SectionLabel>potential offerings</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
            What the Learning Hub May Provide
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mb-12">
            As research findings accumulate and patterns become clear, we aim to develop educational
            offerings across these areas. Content will evolve as our understanding deepens.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {offerings.map((offering, index) => (
              <Card key={index} variant="dark-elevated" padding="lg" className="h-full">
                <CardHeader>
                  <div className="w-14 h-14 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 mb-2">
                    {offering.icon}
                  </div>
                  <CardTitle variant="dark">{offering.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 leading-relaxed">{offering.description}</p>
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
// AUDIENCE SECTION
// ============================================================================
function AudienceSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left column: Content */}
          <div>
            <SectionLabel>who this is for</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
              Education for Every Role
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              The Learning Hub will serve diverse audiences — from founders wanting to build
              resilient organizations, to professionals pursuing careers in organizational health.
              Different tracks for different needs.
            </p>

            <ul className="space-y-4 mb-8">
              {[
                "Founders and executives building organizations",
                "Consultants advising on organizational health",
                "Researchers studying organizational dynamics",
                "Future specialists in organizational medicine",
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
                {/* Audience tracks */}
                <div className="space-y-4">
                  {[
                    {
                      icon: <Briefcase className="w-5 h-5" />,
                      label: "Founders & Executives",
                      desc: "Building resilient organizations",
                    },
                    {
                      icon: <Users className="w-5 h-5" />,
                      label: "Consultants & Advisors",
                      desc: "Guiding organizational health",
                    },
                    {
                      icon: <BookOpen className="w-5 h-5" />,
                      label: "Researchers & Academics",
                      desc: "Advancing the field",
                    },
                    {
                      icon: <GraduationCap className="w-5 h-5" />,
                      label: "Future Specialists",
                      desc: "Professional certification path",
                    },
                  ].map((track, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
                    >
                      <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 flex-shrink-0">
                        {track.icon}
                      </div>
                      <div>
                        <div className="text-marble-100 font-medium">{track.label}</div>
                        <div className="text-xs text-slate-500">{track.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-700">
                  Different paths, shared knowledge foundation
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
              Educational content must be grounded in validated research. We are collecting data and
              identifying patterns first — curriculum development follows as findings emerge and are
              validated.
            </p>
          </div>

          {/* Right column: Status items */}
          <div className="space-y-6">
            {[
              {
                status: "progress",
                label: "Collecting organizational autopsy data",
              },
              {
                status: "progress",
                label: "Identifying preliminary patterns",
              },
              {
                status: "future",
                label: "Validating research findings",
              },
              {
                status: "future",
                label: "Curriculum development",
              },
              {
                status: "future",
                label: "Course creation and testing",
              },
              {
                status: "future",
                label: "Learning Hub launch",
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
            Be the first to know when the Learning Hub launches. We&apos;ll send occasional updates
            on our progress — no spam, ever.
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
                  Your email will only be used for Learning Hub updates. You can unsubscribe at any
                  time.
                </p>
              </form>
            </Card>
          )}

          {/* Alternative CTAs */}
          <div className="mt-12 pt-8 border-t border-slate-800">
            <p className="text-slate-500 mb-6">Want to contribute to the research?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/research">
                <Button variant="dark-secondary" size="lg">
                  Learn About Research
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
// EDUCATION PAGE
// ============================================================================
export default function EducationPage() {
  return (
    <>
      <HeroSection />
      <VisionSection />
      <PotentialOfferingsSection />
      <AudienceSection />
      <CurrentStatusSection />
      <WaitlistSection />
    </>
  );
}
