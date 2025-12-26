"use client";

import { useState } from "react";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/section-label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  MapPin,
  Clock,
  Briefcase,
  X,
  Mail,
  Users,
  Heart,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
import type { JobListing } from "./page";

// ============================================================================
// JOB CARD COMPONENT
// ============================================================================
interface JobCardProps {
  job: JobListing;
  onClick: () => void;
}

function JobCard({ job, onClick }: JobCardProps) {
  return (
    <Card
      variant="dark"
      padding="lg"
      className="h-full flex flex-col cursor-pointer hover:border-emerald-500/30 transition-colors"
      onClick={onClick}
    >
      <CardHeader>
        {job.department && (
          <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider mb-2">
            {job.department}
          </span>
        )}
        <CardTitle variant="dark" className="text-lg">
          {job.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* Meta info */}
        <div className="flex flex-wrap gap-3 mb-4 text-sm text-slate-400">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{job.employment_type}</span>
          </div>
        </div>

        {/* Description preview */}
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 flex-1">
          {job.description.replace(/[#*`]/g, "").slice(0, 200)}...
        </p>

        {/* View button */}
        <div className="mt-4">
          <Button
            variant="dark-secondary"
            size="sm"
            className="w-full"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            View Position
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// JOB DETAIL MODAL
// ============================================================================
interface JobModalProps {
  job: JobListing;
  onClose: () => void;
}

function JobModal({ job, onClose }: JobModalProps) {
  const applyUrl = `mailto:${job.application_email}?subject=Application: ${encodeURIComponent(job.title)}`;
  const referUrl = `mailto:${job.application_email}?subject=Referral: ${encodeURIComponent(job.title)}`;

  // Simple markdown rendering for job descriptions
  const renderMarkdown = (text: string) => {
    return text.split("\n").map((line, idx) => {
      if (line.startsWith("## ")) {
        return (
          <h3 key={idx} className="text-lg font-semibold text-marble-100 mt-6 mb-3">
            {line.replace("## ", "")}
          </h3>
        );
      }
      if (line.startsWith("- ")) {
        return (
          <li key={idx} className="text-slate-400 ml-4 mb-1">
            {line.replace("- ", "")}
          </li>
        );
      }
      if (line.trim() === "") {
        return <br key={idx} />;
      }
      return (
        <p key={idx} className="text-slate-400 mb-2">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-start justify-between">
          <div>
            {job.department && (
              <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                {job.department}
              </span>
            )}
            <h2 className="text-xl font-semibold text-marble-100 mt-1">{job.title}</h2>
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-400">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{job.employment_type}</span>
              </div>
              {job.salary_range && (
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  <span>{job.salary_range}</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-marble-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Description */}
          <div className="prose prose-invert prose-sm max-w-none">
            {renderMarkdown(job.description)}
          </div>

          {/* Requirements */}
          {job.requirements && (
            <div className="mt-6 pt-6 border-t border-slate-800">
              <h3 className="text-lg font-semibold text-marble-100 mb-3">Requirements</h3>
              <div className="prose prose-invert prose-sm max-w-none">
                {renderMarkdown(job.requirements)}
              </div>
            </div>
          )}
        </div>

        {/* Footer with CTAs */}
        <div className="sticky bottom-0 bg-slate-900 border-t border-slate-800 px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={applyUrl} className="flex-1">
              <Button
                variant="dark-primary"
                size="lg"
                className="w-full"
                rightIcon={<Mail className="w-5 h-5" />}
              >
                Apply Now
              </Button>
            </a>
            <a href={referUrl}>
              <Button
                variant="dark-secondary"
                size="lg"
                rightIcon={<ExternalLink className="w-4 h-4" />}
              >
                Refer Someone
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// HERO SECTION
// ============================================================================
function HeroSection() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="max-w-content mx-auto px-6">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-wide mb-6 text-marble-100 leading-tight animate-fade-in-up">
            Build the Future of <span className="text-gradient-gold">Organizational Medicine</span>
          </h1>
          <p className="text-lg lg:text-xl text-slate-400 mb-8 leading-relaxed animate-fade-in-up stagger-1">
            Join a mission-driven team working to preserve organizational wisdom for future
            generations. We&apos;re building something that has never existed before.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up stagger-2">
            <a href="#positions">
              <Button
                variant="dark-primary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                View Open Positions
              </Button>
            </a>
            <Link href="/volunteer">
              <Button variant="dark-secondary" size="lg">
                Volunteer Instead
              </Button>
            </Link>
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
// WHY JOIN SECTION
// ============================================================================
function WhyJoinSection() {
  const reasons = [
    {
      icon: <Heart className="w-7 h-7" />,
      title: "Meaningful Mission",
      description:
        "Help build the infrastructure for organizational medicine. Your work directly contributes to preserving knowledge that would otherwise be lost.",
    },
    {
      icon: <Lightbulb className="w-7 h-7" />,
      title: "Unique Challenge",
      description:
        "Work on problems no one has solved before. We're creating new frameworks, methodologies, and tools from scratch.",
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: "Small Team, Big Impact",
      description:
        "As an early team member, you'll have direct influence on product direction, culture, and how we grow.",
    },
  ];

  return (
    <>
      <div className="h-24 bg-gradient-to-b from-slate-900 to-marble-950" />

      <section className="py-16 md:py-24 bg-marble-950 relative">
        <div className="max-w-content mx-auto px-6">
          <SectionLabel>why join soil</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
            More Than Just a Job
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mb-12">
            At SOIL, you&apos;ll work with passionate people on a mission that matters. We&apos;re
            building something unprecedented - and we want you to be part of it.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {reasons.map((reason, index) => (
              <Card key={index} variant="dark-elevated" padding="lg" className="h-full">
                <CardHeader>
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                    {reason.icon}
                  </div>
                  <CardTitle variant="dark">{reason.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 leading-relaxed">{reason.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="h-24 bg-gradient-to-b from-marble-950 to-slate-900" />
    </>
  );
}

// ============================================================================
// OPEN POSITIONS SECTION
// ============================================================================
interface OpenPositionsSectionProps {
  jobs: JobListing[];
  onJobClick: (job: JobListing) => void;
}

function OpenPositionsSection({ jobs, onJobClick }: OpenPositionsSectionProps) {
  const departments = [...new Set(jobs.map((j) => j.department).filter(Boolean))];

  return (
    <section id="positions" className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        <SectionLabel>open positions</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
          Current Openings
        </h2>

        {jobs.length === 0 ? (
          <Card variant="dark" padding="lg" className="text-center">
            <p className="text-slate-400 mb-4">
              No open positions at the moment. Check back soon or consider volunteering!
            </p>
            <Link href="/volunteer">
              <Button variant="dark-secondary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View Volunteer Opportunities
              </Button>
            </Link>
          </Card>
        ) : (
          <>
            {/* Department filter */}
            {departments.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="text-sm text-slate-500 py-1">Filter by department:</span>
                {departments.map((dept) => (
                  <span
                    key={dept}
                    className="px-3 py-1 rounded-full text-sm bg-slate-800/50 text-slate-400"
                  >
                    {dept}
                  </span>
                ))}
              </div>
            )}

            {/* Jobs grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} onClick={() => onJobClick(job)} />
              ))}
            </div>
          </>
        )}
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
          <SectionLabel>don&apos;t see a fit?</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
            Stay Connected
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            We&apos;re always looking for talented people. Even if you don&apos;t see a perfect
            match right now, we&apos;d love to hear from you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:careers@soil.rip?subject=General Interest">
              <Button variant="dark-primary" size="lg" rightIcon={<Mail className="w-5 h-5" />}>
                Send Your Resume
              </Button>
            </a>
            <Link href="/volunteer">
              <Button variant="dark-secondary" size="lg">
                Explore Volunteering
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN CONTENT COMPONENT
// ============================================================================
interface CareersContentProps {
  jobs: JobListing[];
}

export function CareersContent({ jobs }: CareersContentProps) {
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);

  return (
    <>
      <HeroSection />
      <WhyJoinSection />
      <OpenPositionsSection jobs={jobs} onJobClick={setSelectedJob} />
      <CTASection />

      {/* Job Detail Modal */}
      {selectedJob && <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </>
  );
}
