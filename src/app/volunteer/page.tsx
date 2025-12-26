"use client";

import Link from "next/link";
import { SectionLabel } from "@/components/ui/section-label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GlossaryTerm } from "@/components/ui/glossary-term";
import {
  Shield,
  Code,
  Palette,
  FileText,
  FlaskConical,
  Calendar,
  HelpCircle,
  ArrowRight,
  Heart,
  Users,
  Globe,
  Sparkles,
  CheckCircle,
  Clock,
  Mail,
  Github,
  ChevronDown,
  ChevronUp,
  LucideIcon,
} from "lucide-react";
import { useState } from "react";

// ============================================================================
// VOLUNTEER ROLES DATA
// ============================================================================
interface VolunteerRole {
  id: string;
  title: string;
  description: string;
  timeCommitment: string;
  skills: string[];
  icon: LucideIcon;
  color: string;
  colorBg: string;
  cta: string;
  ctaLink: string;
  external?: boolean;
}

const volunteerRoles: VolunteerRole[] = [
  {
    id: "keepers",
    title: "Keepers",
    description:
      "Regional moderators who verify stories, moderate cenotaphs, organize events, and build local community infrastructure.",
    timeCommitment: "Few hours/week",
    skills: ["Community management", "Local ecosystem knowledge", "Communication"],
    icon: Shield,
    color: "rgba(100,180,130,1)",
    colorBg: "rgba(100,180,130,0.15)",
    cta: "Apply to Become a Keeper",
    ctaLink: "/keepers#apply",
  },
  {
    id: "code",
    title: "Code Contributors",
    description:
      "Help improve the platform through bug fixes, new features, localization, and accessibility improvements.",
    timeCommitment: "Flexible",
    skills: ["React", "TypeScript", "Node.js", "Next.js"],
    icon: Code,
    color: "rgba(147,112,219,1)",
    colorBg: "rgba(147,112,219,0.15)",
    cta: "View Open Issues",
    ctaLink: "https://github.com/ertad-family/SOIL/issues",
    external: true,
  },
  {
    id: "design",
    title: "Design Contributors",
    description:
      "Create UI/UX improvements, cenotaph visual styles, regional design customizations, and marketing assets.",
    timeCommitment: "Flexible",
    skills: ["Figma", "UI/UX Design", "3D Modeling", "Visual Design"],
    icon: Palette,
    color: "rgba(236,72,153,1)",
    colorBg: "rgba(236,72,153,0.15)",
    cta: "Contact Us",
    ctaLink: "mailto:community@soil.rip?subject=Design Contribution",
  },
  {
    id: "content",
    title: "Content & Translation",
    description:
      "Write documentation, tutorials, and help translate the platform to new languages for global accessibility.",
    timeCommitment: "Flexible",
    skills: ["Writing", "Multilingual", "Documentation", "Technical writing"],
    icon: FileText,
    color: "rgba(59,130,246,1)",
    colorBg: "rgba(59,130,246,0.15)",
    cta: "Contact Us",
    ctaLink: "mailto:community@soil.rip?subject=Content Contribution",
  },
  {
    id: "research",
    title: "Research Contributors",
    description:
      "Contribute to framework analysis, methodology review, data insights, and academic research partnerships.",
    timeCommitment: "Flexible",
    skills: ["Research methodology", "Data analysis", "Academic writing"],
    icon: FlaskConical,
    color: "rgba(234,179,8,1)",
    colorBg: "rgba(234,179,8,0.15)",
    cta: "Contact Us",
    ctaLink: "mailto:research@soil.rip?subject=Research Contribution",
  },
  {
    id: "events",
    title: "Event Volunteers",
    description:
      "Help organize Day of the Dead Venture celebrations, local meetups, and community gatherings in your area.",
    timeCommitment: "Event-based",
    skills: ["Event planning", "Local connections", "Community organizing"],
    icon: Calendar,
    color: "rgba(249,115,22,1)",
    colorBg: "rgba(249,115,22,0.15)",
    cta: "Contact Us",
    ctaLink: "mailto:community@soil.rip?subject=Event Volunteering",
  },
  {
    id: "general",
    title: "Not Sure Where You Fit?",
    description:
      "Want to help but not sure which role suits you best? Tell us about your skills and interests, and we'll find the perfect way for you to contribute.",
    timeCommitment: "We'll figure it out together",
    skills: ["Any skills welcome", "Enthusiasm", "Willingness to help"],
    icon: HelpCircle,
    color: "rgba(100,180,130,1)",
    colorBg: "rgba(100,180,130,0.15)",
    cta: "Get in Touch",
    ctaLink: "mailto:community@soil.rip?subject=I Want to Help",
  },
];

// ============================================================================
// FAQ DATA
// ============================================================================
interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "Do I need to be a founder to volunteer?",
    answer:
      "No! While many volunteers are founders who experienced organizational closure, we welcome anyone passionate about preserving organizational knowledge. Researchers, designers, developers, community builders - all backgrounds are valuable.",
  },
  {
    question: "How much time do I need to commit?",
    answer:
      "It depends on the role. Keepers typically dedicate a few hours per week. Code, design, and content contributors work on flexible schedules based on their availability. Event volunteers help during specific events. We'll work with you to find a commitment level that fits your life.",
  },
  {
    question: "Can I contribute remotely?",
    answer:
      "Absolutely! Most volunteer roles can be done entirely remotely. Code contributors, designers, translators, and content writers work from anywhere. Even Keepers primarily work online, though they may organize local events in their region.",
  },
  {
    question: "What skills do I need?",
    answer:
      "Different roles require different skills. Technical roles need programming or design experience. Keepers need community management skills and local ecosystem knowledge. But if you're passionate and willing to learn, there's likely a place for you - just reach out!",
  },
  {
    question: "How do I get started?",
    answer:
      "Choose a role that interests you and click the action button on that card. For Keepers, you'll go to our application page. For code contributors, you'll find open issues on GitHub. For other roles, you'll email us directly and we'll set up a conversation.",
  },
  {
    question: "Is there any compensation?",
    answer:
      "Currently, all volunteer roles are unpaid. However, volunteers receive recognition, build their portfolio, and make meaningful connections. As SOIL grows, we plan to introduce contributor rewards and potential paths to paid positions.",
  },
];

// ============================================================================
// HERO SECTION
// ============================================================================
function HeroSection() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="max-w-content mx-auto px-6">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-wide mb-6 text-marble-100 leading-tight animate-fade-in-up">
            Join the <span className="text-gradient-gold">Mission</span>
          </h1>
          <p className="text-lg lg:text-xl text-slate-400 mb-8 leading-relaxed animate-fade-in-up stagger-1">
            SOIL is building the infrastructure for organizational medicine - and we need your help.
            Whether you have a few hours a week or just occasional availability, there&apos;s a way
            for you to contribute to preserving organizational wisdom for future generations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up stagger-2">
            <a href="#roles">
              <Button
                variant="dark-primary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Explore Volunteer Roles
              </Button>
            </a>
            <a href="mailto:community@soil.rip?subject=I Want to Help">
              <Button variant="dark-secondary" size="lg">
                Contact Us Directly
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Decorative divider */}
      <div className="divider-roman mt-16 md:mt-20 animate-fade-in-up stagger-3">
        <span className="text-gold-400 font-serif text-sm tracking-[0.3em] px-6">MMXXV</span>
      </div>
    </section>
  );
}

// ============================================================================
// WHY VOLUNTEER SECTION
// ============================================================================
function WhyVolunteerSection() {
  const benefits = [
    {
      icon: <Heart className="w-7 h-7" />,
      title: "Mission Impact",
      description:
        "Help build the foundation for organizational medicine. Your work directly contributes to understanding why organizations succeed or fail.",
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: "Global Community",
      description:
        "Join a worldwide network of founders, researchers, and builders who believe in preserving organizational knowledge.",
    },
    {
      icon: <Globe className="w-7 h-7" />,
      title: "Recognition",
      description:
        "Get credited for your contributions, earn badges on your profile, and build your portfolio with meaningful open-source work.",
    },
    {
      icon: <Sparkles className="w-7 h-7" />,
      title: "Growth Opportunities",
      description:
        "Develop new skills, gain leadership experience, and potentially transition to paid roles as SOIL grows.",
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
            Make a Meaningful Difference
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mb-12">
            Volunteering with SOIL isn&apos;t just about donating time - it&apos;s about being part
            of something bigger. Every contribution helps preserve organizational wisdom that would
            otherwise be lost forever.
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
// VOLUNTEER ROLES SECTION
// ============================================================================
function RoleCard({ role }: { role: VolunteerRole }) {
  const Icon = role.icon;

  return (
    <Card variant="dark" padding="lg" className="h-full flex flex-col">
      <CardHeader>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
          style={{ backgroundColor: role.colorBg }}
        >
          <Icon className="w-6 h-6" style={{ color: role.color }} />
        </div>
        <CardTitle variant="dark" className="text-lg">
          {role.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1">{role.description}</p>

        {/* Time & Skills */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-slate-400">{role.timeCommitment}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {role.skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-full text-xs bg-slate-700/50 text-slate-400"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        {role.external ? (
          <a href={role.ctaLink} target="_blank" rel="noopener noreferrer">
            <Button
              variant="dark-secondary"
              size="sm"
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {role.cta}
            </Button>
          </a>
        ) : (
          <a href={role.ctaLink}>
            <Button
              variant="dark-secondary"
              size="sm"
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {role.cta}
            </Button>
          </a>
        )}
      </CardContent>
    </Card>
  );
}

function VolunteerRolesSection() {
  return (
    <section id="roles" className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        <SectionLabel>volunteer opportunities</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
          Find Your Role
        </h2>
        <p className="text-lg text-slate-400 max-w-3xl mb-12">
          Every skill has a place at SOIL. From technical contributions to community building,
          choose the role that matches your interests and availability.
        </p>

        {/* Roles Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {volunteerRoles.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// HOW TO GET STARTED SECTION
// ============================================================================
function HowToStartSection() {
  const steps = [
    {
      number: "01",
      title: "Choose Your Path",
      description:
        "Review the volunteer roles above and pick one that matches your skills and interests. Not sure? Use the general application.",
    },
    {
      number: "02",
      title: "Reach Out",
      description:
        "Click the action button on your chosen role card. You'll either be directed to an application form, GitHub issues, or an email link.",
    },
    {
      number: "03",
      title: "Get Connected",
      description:
        "We'll review your application and get back to you within a week. For code contributors, just pick an issue and start contributing!",
    },
    {
      number: "04",
      title: "Start Contributing",
      description:
        "Once onboarded, you'll receive guidance, resources, and support to make your contributions as impactful as possible.",
    },
  ];

  return (
    <>
      {/* Gradient transition into section */}
      <div className="h-16 bg-gradient-to-b from-slate-900 to-marble-950" />

      <section className="py-16 md:py-24 bg-marble-950">
        <div className="max-w-content mx-auto px-6">
          <SectionLabel>getting started</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
            How to Begin
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mb-12">
            Getting involved is simple. Here&apos;s how to go from interested to contributing.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connection line for larger screens */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-6 h-[2px] bg-gradient-to-r from-emerald-500/50 to-transparent" />
                )}

                <Card variant="dark" padding="lg" className="h-full">
                  <div className="text-emerald-500/50 font-mono text-sm mb-3">{step.number}</div>
                  <h3 className="font-display text-lg font-medium text-marble-100 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                </Card>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <Card variant="dark-elevated" padding="lg" className="mt-12">
            <h3 className="font-display text-lg font-medium text-marble-100 mb-4">Quick Links</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <a
                href="https://github.com/ertad-family/SOIL"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
              >
                <Github className="w-5 h-5 text-slate-400" />
                <span className="text-marble-100 text-sm">GitHub Repository</span>
              </a>
              <a
                href="https://github.com/ertad-family/SOIL/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
              >
                <FileText className="w-5 h-5 text-slate-400" />
                <span className="text-marble-100 text-sm">Contributing Guide</span>
              </a>
              <a
                href="mailto:community@soil.rip"
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
              >
                <Mail className="w-5 h-5 text-slate-400" />
                <span className="text-marble-100 text-sm">community@soil.rip</span>
              </a>
            </div>
          </Card>
        </div>
      </section>

      {/* Gradient transition out of section */}
      <div className="h-16 bg-gradient-to-b from-marble-950 to-slate-900" />
    </>
  );
}

// ============================================================================
// FAQ SECTION
// ============================================================================
function FAQItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-slate-800 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="font-display text-marble-100 pr-4">{item.question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4">
          <p className="text-slate-400 leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Header */}
          <div>
            <SectionLabel>faq</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-400">
              Have questions about volunteering? Here are answers to the most common ones. If you
              don&apos;t find what you&apos;re looking for, feel free to{" "}
              <a href="mailto:community@soil.rip" className="text-emerald-400 hover:underline">
                reach out directly
              </a>
              .
            </p>
          </div>

          {/* Right: FAQ Items */}
          <Card variant="dark" padding="lg">
            {faqItems.map((item, index) => (
              <FAQItem
                key={index}
                item={item}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </Card>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CTA SECTION
// ============================================================================
function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-slate-900/50">
      <div className="max-w-content mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <SectionLabel>ready to help?</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
            Your Skills Can Make a Difference
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            Join a global community of volunteers helping to preserve organizational wisdom. Every
            contribution, no matter how small, moves the mission forward.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/keepers#apply">
              <Button variant="dark-primary" size="lg" rightIcon={<Shield className="w-5 h-5" />}>
                Apply to Become a Keeper
              </Button>
            </Link>
            <a
              href="https://github.com/ertad-family/SOIL/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="dark-secondary" size="lg" rightIcon={<Github className="w-5 h-5" />}>
                Start Contributing on GitHub
              </Button>
            </a>
          </div>

          {/* Secondary CTAs */}
          <div className="pt-8 border-t border-slate-800">
            <p className="text-slate-500 mb-4">Not ready to commit? Explore first:</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/community">
                <Button variant="dark-ghost" size="md">
                  Learn About the Community
                </Button>
              </Link>
              <a href="mailto:community@soil.rip?subject=I Want to Help">
                <Button variant="dark-ghost" size="md" rightIcon={<Mail className="w-4 h-4" />}>
                  Just Say Hello
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// VOLUNTEERS PAGE
// ============================================================================
export default function VolunteersPage() {
  return (
    <>
      <HeroSection />
      <WhyVolunteerSection />
      <VolunteerRolesSection />
      <HowToStartSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
