"use client";

import { SectionLabel } from "@/components/ui/section-label";
import { Card } from "@/components/ui/card";
import { GlossaryTerm } from "@/components/ui/glossary-term";
import Link from "next/link";
import {
  Database,
  Microscope,
  Users,
  Heart,
  Scale,
  Shield,
  Eye,
  ArrowRight,
  Stethoscope,
  Activity,
  GraduationCap,
  Sparkles,
  HandHeart,
} from "lucide-react";

// ============================================================================
// HERO SECTION
// ============================================================================
function HeroSection() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="max-w-content mx-auto px-6">
        <div className="max-w-3xl animate-fade-in-up">
          <SectionLabel>about the project</SectionLabel>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-wide mt-4 mb-6 text-marble-100 leading-tight">
            What is <span className="text-gradient-gold">SOIL</span>?
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed mb-6">
            <strong className="text-marble-100">SOIL</strong> (Social Organizational Intelligence
            Lab) is a research-first nonprofit project devoted to collecting{" "}
            <GlossaryTerm term="Autopsy">organizational autopsy</GlossaryTerm> data at scale - to
            ignite a completely new scientific field:{" "}
            <strong className="text-marble-100">
              Organizational Biology, Health, and Medicine
            </strong>
            .
          </p>
          <p className="text-lg text-slate-400 leading-relaxed">
            We stand at the beginning of a new discipline. Organizations are born, grow, get sick,
            and die - yet we have no systematic understanding of why. No taxonomy of organizational
            diseases. No diagnostic frameworks. No preventive medicine. No treatment protocols. SOIL
            is building the foundation to change that.
          </p>
        </div>
      </div>

      {/* Decorative divider */}
      <div className="divider-roman mt-16 md:mt-20 animate-fade-in-up stagger-2">
        <span className="text-gold-400 font-serif text-sm tracking-[0.3em] px-6">✦</span>
      </div>
    </section>
  );
}

// ============================================================================
// MEDICAL ANALOGY SECTION
// ============================================================================
function MedicalAnalogySection() {
  return (
    <section className="py-16 md:py-24 animate-fade-in-up">
      <div className="max-w-content mx-auto px-6">
        <SectionLabel>the insight</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
          From Human Autopsies to Organizational Autopsies
        </h2>
        <p className="text-lg text-slate-400 max-w-3xl mb-12">
          Modern medicine developed through systematic{" "}
          <GlossaryTerm term="Autopsy">autopsy</GlossaryTerm> - the careful examination of deceased
          bodies to understand disease processes. Before autopsy became standard practice, medicine
          relied on theory and speculation. SOIL proposes the same approach for organizations.
        </p>

        {/* Visual comparison */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Medicine path */}
          <Card variant="dark" padding="lg" className="relative overflow-hidden">
            <div className="absolute top-4 right-4 opacity-20">
              <Stethoscope className="w-24 h-24 text-gold-400" />
            </div>
            <div className="relative z-10">
              <h3 className="font-display text-xl font-medium text-marble-100 mb-4">
                How Medicine Evolved
              </h3>
              <div className="space-y-4">
                {[
                  "Systematic human autopsies",
                  "Understanding of disease processes",
                  "Diagnostic frameworks",
                  "Preventive medicine",
                  "Treatment protocols",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 text-xs font-medium">
                      {i + 1}
                    </div>
                    <span className="text-slate-400">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-700">
                <span className="text-gold-400 text-sm font-medium">Result: Modern Healthcare</span>
              </div>
            </div>
          </Card>

          {/* SOIL path */}
          <Card variant="dark-elevated" padding="lg" className="relative overflow-hidden">
            <div className="absolute top-4 right-4 opacity-20">
              <Activity className="w-24 h-24 text-gold-400" />
            </div>
            <div className="relative z-10">
              <h3 className="font-display text-xl font-medium text-marble-100 mb-4">
                What SOIL is Building
              </h3>
              <div className="space-y-4">
                {[
                  "Systematic organizational autopsies",
                  "Understanding of failure patterns",
                  "Diagnostic frameworks",
                  "Early warning systems",
                  "Intervention protocols",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 text-xs font-medium">
                      {i + 1}
                    </div>
                    <span className="text-slate-400">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-700">
                <span className="text-gold-400 text-sm font-medium">
                  Goal: Organizational Medicine
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// ECOSYSTEM SECTION
// ============================================================================
function EcosystemSection() {
  const pillars = [
    {
      numeral: "I",
      title: "Cenotaphery",
      description:
        "Digital memorials honoring organizations. Founders share their stories through structured interviews, contributing data while finding closure.",
      icon: <Database className="w-7 h-7" />,
      href: "/cenotaphery",
      linkText: "Visit Cenotaphery",
      status: "active",
    },
    {
      numeral: "II",
      title: "Research Center",
      description:
        "Systematic analysis of organizational mortality. Pattern recognition, framework testing, and publication of findings.",
      icon: <Microscope className="w-7 h-7" />,
      href: "/research",
      linkText: "Explore Research",
      status: "active",
    },
    {
      numeral: "III",
      title: "Founder Community",
      description:
        "A network of founders who have experienced organizational closure. Peer support, knowledge sharing, and mentorship.",
      icon: <Users className="w-7 h-7" />,
      href: "/community",
      linkText: "Join Community",
      status: "active",
    },
  ];

  const futureInstitutions = [
    { title: "Diagnostics Center", href: "/diagnostics", icon: <Activity className="w-5 h-5" /> },
    { title: "Learning Hub", href: "/education", icon: <GraduationCap className="w-5 h-5" /> },
    { title: "Clinic", href: "/clinic", icon: <Stethoscope className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Gradient transition into section */}
      <div className="h-24 bg-gradient-to-b from-slate-900 to-marble-950" />

      <section className="py-16 md:py-24 bg-marble-950">
        <div className="max-w-content mx-auto px-6">
          <SectionLabel>ecosystem</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
            The SOIL Ecosystem
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mb-12">
            SOIL is not a single product but an ecosystem of interconnected institutions, each
            serving the broader mission of organizational health and longevity.
          </p>

          {/* Three pillars */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {pillars.map((pillar) => (
              <Card
                key={pillar.numeral}
                variant="dark-elevated"
                padding="lg"
                className="relative overflow-hidden flex flex-col min-h-[320px]"
              >
                {/* Large background Roman numeral */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none select-none">
                  <span
                    className="font-serif text-[140px] font-bold leading-none"
                    style={{
                      WebkitTextStroke: "2px rgba(201, 148, 61, 0.15)",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {pillar.numeral}
                  </span>
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-14 h-14 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 mb-4">
                    {pillar.icon}
                  </div>
                  <h3 className="font-display text-xl font-medium text-marble-100 mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed flex-1 mb-6">{pillar.description}</p>
                  <Link
                    href={pillar.href}
                    className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors text-sm font-medium"
                  >
                    {pillar.linkText}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {/* Future institutions */}
          <div className="border-t border-slate-700 pt-8">
            <p className="text-slate-500 text-sm mb-4">Future commercial spin-offs (Phase 3+):</p>
            <div className="flex flex-wrap gap-4">
              {futureInstitutions.map((inst) => (
                <Link
                  key={inst.title}
                  href={inst.href}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-marble-100 hover:border-gold-500/30 transition-colors"
                >
                  {inst.icon}
                  <span className="text-sm">{inst.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gradient transition out of section */}
      <div className="h-24 bg-gradient-to-b from-marble-950 to-slate-900" />
    </>
  );
}

// ============================================================================
// VALUES SECTION
// ============================================================================
function ValuesSection() {
  const values = [
    {
      icon: <Heart className="w-7 h-7" />,
      title: "Dignity",
      description: "Every founder and organization deserves respectful remembrance.",
    },
    {
      icon: <Scale className="w-7 h-7" />,
      title: "Truth",
      description: "Honest, systematic understanding of why organizations die.",
    },
    {
      icon: <HandHeart className="w-7 h-7" />,
      title: "Service",
      description: "Data serves the ecosystem, not just profit.",
    },
    {
      icon: <Sparkles className="w-7 h-7" />,
      title: "Beauty",
      description: "Excellence in design honors the effort founders invested.",
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: "Community",
      description: "Founders supporting founders through shared vulnerability.",
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: "Rigor",
      description: "Scientific standards for research and analysis.",
    },
    {
      icon: <Eye className="w-7 h-7" />,
      title: "Transparency",
      description: "Clear about how data is used and how revenue flows.",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        <SectionLabel>our values</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-12 text-marble-100">
          What We Stand For
        </h2>

        <div className="flex flex-wrap justify-center gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="space-y-4 w-full sm:w-[calc(50%-16px)] lg:w-[calc(25%-24px)] min-w-[200px]"
            >
              <div className="w-14 h-14 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400">
                {value.icon}
              </div>
              <h3 className="font-display text-xl font-medium text-marble-100">{value.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// ABOUT PAGE
// ============================================================================
export default function AboutPage() {
  return (
    <>
      <HeroSection />
      <MedicalAnalogySection />
      <EcosystemSection />
      <ValuesSection />
    </>
  );
}
