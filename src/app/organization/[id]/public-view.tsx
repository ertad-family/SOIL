"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SectionLabel } from "@/components/ui/section-label";
import {
  Calendar,
  MapPin,
  Building2,
  Briefcase,
  Users,
  Quote,
  Lightbulb,
  MessageCircle,
  BookOpen,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  LogIn,
  Plus,
  Flag,
  ShieldCheck,
  Eye,
} from "lucide-react";
import type {
  OrganizationType,
  LifecycleStage,
  VerificationStatus,
  NarrativeData,
  NarrativeSection,
  FounderRole,
  PublicNamingPreference,
} from "@/types/interview";
import { cn } from "@/lib/utils";

// =============================================================================
// TYPES
// =============================================================================

interface OrganizationData {
  id: string;
  slug: string;
  name: string;
  organization_type: OrganizationType | null;
  business_model: string | null;
  industry: string | null;
  description: string | null;
  location_country: string | null;
  location_city: string | null;
  founded_date: string | null;
  closed_date: string | null;
  stage_at_closure: LifecycleStage | null;
  peak_team_size: number | null;
  verification_status: VerificationStatus;
  verification_count: number;
  is_public: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface MemorialData {
  id: string;
  slug: string;
  epitaph: string | null;
  tombstone_style: string;
  tombstone_color: string;
  views_count: number;
  respects_count: number;
  cenotaph_image_url: string | null;
  design_status: string | null;
}

interface PublicNarrativeData {
  storyId: string;
  authorName: string | null;
  founderRole: FounderRole | null;
  publicNaming: PublicNamingPreference | null;
  narrative: NarrativeData;
  coinedAt: string;
}

interface PublicViewProps {
  organization: OrganizationData;
  memorial: MemorialData | null;
  publicNarratives: PublicNarrativeData[];
  currentUserId: string | null;
  currentUserStoryId: string | null;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const ORG_TYPE_LABELS: Record<OrganizationType, string> = {
  tech_product: "Tech Product",
  services: "Services",
  ecommerce: "E-commerce",
  manufacturing: "Manufacturing",
  ngo: "NGO",
  media: "Media",
};

const FOUNDER_ROLE_LABELS: Record<FounderRole, string> = {
  founder: "Founder",
  cofounder: "Co-Founder",
  ceo_non_founder: "CEO",
  other: "Team Member",
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function formatDateRange(founded: string | null, closed: string | null): string | null {
  if (!founded && !closed) return null;

  const formatYear = (date: string | null) => {
    if (!date) return "?";
    return new Date(date).getFullYear().toString();
  };

  return `${formatYear(founded)} — ${formatYear(closed)}`;
}

function getDisplayName(
  organization: OrganizationData,
  authorName: string | null,
  publicNaming: PublicNamingPreference | null
): { orgName: string; authorDisplay: string | null } {
  // If organization is public, show real name
  // If private, show anonymous
  const orgName = organization.is_public ? organization.name : "Anonymous Organization";

  // Author name: show only if org is public AND author chose to show their name
  const authorDisplay = organization.is_public && publicNaming === "yes" ? authorName : null;

  return { orgName, authorDisplay };
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/** Hero section with cenotaph monument */
function HeroSection({
  organization,
  memorial,
  dateRange,
  location,
}: {
  organization: OrganizationData;
  memorial: MemorialData | null;
  dateRange: string | null;
  location: string | null;
}) {
  const [showFullImage, setShowFullImage] = useState(false);
  const { orgName } = getDisplayName(organization, null, null);

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800" />

      {/* Subtle radial glow */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(201, 148, 61, 0.15) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container-content py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Cenotaph Monument */}
          <div className="flex justify-center lg:justify-end">
            {memorial?.cenotaph_image_url ? (
              <button
                onClick={() => setShowFullImage(true)}
                className="group relative max-w-sm w-full"
              >
                {/* Marble frame */}
                <div
                  className={cn(
                    "relative aspect-[3/4] rounded-sm overflow-hidden",
                    "bg-gradient-to-b from-marble-100 via-marble-200 to-marble-300",
                    "p-[4px]",
                    "shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_60px_rgba(201,148,61,0.15)]",
                    "transition-all duration-500",
                    "group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_80px_rgba(201,148,61,0.25)]",
                    "group-hover:-translate-y-1"
                  )}
                >
                  <img
                    src={memorial.cenotaph_image_url}
                    alt="Memorial cenotaph"
                    className="w-full h-full object-cover rounded-sm"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 bg-marble-100 text-slate-900 text-sm font-medium rounded">
                      View Full Size
                    </span>
                  </div>

                  {/* Corner ornaments */}
                  <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-gold-400/50" />
                  <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-gold-400/50" />
                  <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-gold-400/50" />
                  <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-gold-400/50" />
                </div>
              </button>
            ) : (
              /* Placeholder when no cenotaph image */
              <div className="max-w-sm w-full aspect-[3/4] rounded-sm bg-slate-800 border border-slate-700 flex items-center justify-center">
                <div className="text-center p-8">
                  <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500">Cenotaph design in progress</p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Organization Info */}
          <div className="text-center lg:text-left">
            {/* Verification badge */}
            {organization.verification_status === "verified" && (
              <Badge variant="dark-verified" size="sm" className="mb-4">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}

            {/* Organization name */}
            <h1
              className={cn(
                "font-display text-4xl md:text-5xl lg:text-6xl font-semibold mb-6",
                organization.is_public ? "text-marble-100" : "text-slate-400 italic"
              )}
            >
              {orgName}
            </h1>

            {/* Epitaph */}
            {memorial?.epitaph && (
              <blockquote className="relative mb-8">
                <Quote className="absolute -top-2 -left-4 w-8 h-8 text-gold-500/30" />
                <p className="font-serif text-xl md:text-2xl text-gold-300/90 italic leading-relaxed pl-6">
                  &ldquo;{memorial.epitaph}&rdquo;
                </p>
              </blockquote>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-slate-400">
              {organization.organization_type && (
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  {ORG_TYPE_LABELS[organization.organization_type]}
                </span>
              )}
              {organization.industry && (
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  {organization.industry}
                </span>
              )}
              {dateRange && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {dateRange}
                </span>
              )}
              {location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {location}
                </span>
              )}
              {organization.peak_team_size && (
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  Peak: {organization.peak_team_size} people
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full image modal */}
      {showFullImage && memorial?.cenotaph_image_url && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setShowFullImage(false)}
        >
          <img
            src={memorial.cenotaph_image_url}
            alt="Memorial cenotaph"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
          <button
            className="absolute top-4 right-4 text-marble-300 hover:text-marble-100"
            onClick={() => setShowFullImage(false)}
          >
            <span className="sr-only">Close</span>
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}

/** Section divider with Roman styling */
function SectionDivider() {
  return (
    <div className="divider-roman">
      <span className="text-gold-500 text-2xl">&#10022;</span>
    </div>
  );
}

/** Narrative section - displays Q&A from stories */
function NarrativeSection({
  title,
  icon: Icon,
  sections,
  organization,
  authorName,
  publicNaming,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  sections: NarrativeSection[];
  organization: OrganizationData;
  authorName: string | null;
  publicNaming: PublicNamingPreference | null;
}) {
  const { authorDisplay } = getDisplayName(organization, authorName, publicNaming);
  const answeredSections = sections.filter((s) => s.answer && !s.skipped);

  if (answeredSections.length === 0) return null;

  return (
    <div className="mb-12">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-gold-400" />
        </div>
        <h3 className="font-display text-2xl text-marble-100">{title}</h3>
        {authorDisplay && (
          <span className="text-sm text-slate-500 ml-auto">by {authorDisplay}</span>
        )}
      </div>

      {/* Q&A cards */}
      <div className="space-y-6">
        {answeredSections.map((section) => (
          <div
            key={section.questionId}
            className={cn(
              "relative pl-6 py-4",
              "border-l-2 border-gold-500/30",
              "bg-gradient-to-r from-slate-800/50 to-transparent",
              "rounded-r-lg"
            )}
          >
            <p className="text-sm text-slate-500 mb-2 uppercase tracking-wider">
              {section.question}
            </p>
            <p className="text-marble-200 leading-relaxed whitespace-pre-wrap">{section.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Get Involved section - different options for public vs private orgs */
function GetInvolvedSection({
  organization,
  currentUserId,
  currentUserStoryId,
}: {
  organization: OrganizationData;
  currentUserId: string | null;
  currentUserStoryId: string | null;
}) {
  const isAuthenticated = !!currentUserId;
  const hasOwnStory = !!currentUserStoryId;
  const isPublicOrg = organization.is_public;

  return (
    <section className="py-16 md:py-24 bg-slate-900">
      <div className="max-w-content mx-auto px-6">
        <SectionLabel>get involved</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-12 text-marble-100">
          Join the Movement
        </h2>

        {/* Cards grid */}
        <div
          className={cn(
            "grid gap-6",
            isPublicOrg ? "md:grid-cols-2 max-w-4xl" : "md:grid-cols-1 max-w-lg"
          )}
        >
          {/* Add Perspective - only for public orgs */}
          {isPublicOrg && (
            <Card variant="dark-elevated" className="h-full flex flex-col">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 mb-4">
                  <Plus className="w-8 h-8" />
                </div>
                <CardTitle variant="dark">Add Your Perspective</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-slate-400 leading-relaxed flex-1">
                  Were you part of this organization? Every perspective matters. Share your story to
                  help others learn from this experience.
                </p>
                <div className="mt-6">
                  {!isAuthenticated ? (
                    <Link href={`/login?returnTo=/organization/${organization.id}`}>
                      <Button
                        variant="dark-primary"
                        size="lg"
                        className="w-full"
                        leftIcon={<LogIn className="w-5 h-5" />}
                      >
                        Sign in to Contribute
                      </Button>
                    </Link>
                  ) : hasOwnStory ? (
                    <Link href={`/interview/${currentUserStoryId}`}>
                      <Button
                        variant="dark-secondary"
                        size="lg"
                        className="w-full"
                        rightIcon={<ChevronRight className="w-5 h-5" />}
                      >
                        View Your Story
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/interview?org=${organization.id}`}>
                      <Button
                        variant="dark-primary"
                        size="lg"
                        className="w-full"
                        leftIcon={<Plus className="w-5 h-5" />}
                      >
                        Add Your Perspective
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Coin Your Story - always shown */}
          <Card variant="dark-elevated" className="h-full flex flex-col">
            <CardHeader>
              <div className="w-14 h-14 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <CardTitle variant="dark">Coin Your Own Story</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <p className="text-slate-400 leading-relaxed flex-1">
                Have your own organization story to tell? Transform your experience into knowledge
                that helps future founders avoid the same mistakes.
              </p>
              <div className="mt-6">
                <Link href="/organization/create">
                  <Button variant="marble" size="lg" className="w-full">
                    Coin Your Story
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Claim Ownership link - only for authenticated users on public orgs */}
        {isAuthenticated && isPublicOrg && (
          <div className="text-center mt-12">
            <p className="text-sm text-slate-500 mb-3">Something wrong with this page?</p>
            <button
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-gold-400 transition-colors"
              onClick={() => {
                // TODO: Implement claim ownership modal/flow
                alert("Claim ownership feature coming soon. Please contact support.");
              }}
            >
              <Flag className="w-4 h-4" />
              Report or Claim Ownership
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/** Consultation CTA - only for public orgs */
function ConsultationCTA({ organization }: { organization: OrganizationData }) {
  if (!organization.is_public) return null;

  return (
    <section className="py-12 bg-gold-500/10 border-y border-gold-500/20">
      <div className="container-content">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-xl text-marble-100 mb-2">
              Learn from this experience
            </h3>
            <p className="text-slate-400">Connect with the founder for insights and consultation</p>
          </div>
          <Button
            variant="dark-primary"
            size="lg"
            leftIcon={<MessageCircle className="w-5 h-5" />}
            onClick={() => {
              // TODO: Implement consultation request
              alert("Consultation requests coming soon!");
            }}
          >
            Request Consultation
          </Button>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function PublicView({
  organization,
  memorial,
  publicNarratives,
  currentUserId,
  currentUserStoryId,
}: PublicViewProps) {
  const dateRange = formatDateRange(organization.founded_date, organization.closed_date);
  const location = [organization.location_city, organization.location_country]
    .filter(Boolean)
    .join(", ");

  // Get the first narrative (primary story) - we can expand to show multiple later
  const primaryNarrative = publicNarratives[0];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero with Cenotaph */}
      <HeroSection
        organization={organization}
        memorial={memorial}
        dateRange={dateRange}
        location={location}
      />

      {/* Consultation CTA - only for public orgs */}
      <ConsultationCTA organization={organization} />

      {/* Narrative Content */}
      {primaryNarrative && (
        <section className="py-16 md:py-24">
          <div className="container-content max-w-4xl">
            {/* Understanding Section */}
            <NarrativeSection
              title="Understanding What Happened"
              icon={AlertTriangle}
              sections={primaryNarrative.narrative.sections.understanding}
              organization={organization}
              authorName={primaryNarrative.authorName}
              publicNaming={primaryNarrative.publicNaming}
            />

            <SectionDivider />

            {/* Hindsight Section */}
            <NarrativeSection
              title="In Hindsight"
              icon={Eye}
              sections={primaryNarrative.narrative.sections.hindsight}
              organization={organization}
              authorName={primaryNarrative.authorName}
              publicNaming={primaryNarrative.publicNaming}
            />

            <SectionDivider />

            {/* Lessons Section */}
            <NarrativeSection
              title="Lessons Learned"
              icon={Lightbulb}
              sections={primaryNarrative.narrative.sections.lessons}
              organization={organization}
              authorName={primaryNarrative.authorName}
              publicNaming={primaryNarrative.publicNaming}
            />

            <SectionDivider />

            {/* Advice Section */}
            <NarrativeSection
              title="Advice for Others"
              icon={MessageCircle}
              sections={primaryNarrative.narrative.sections.advice}
              organization={organization}
              authorName={primaryNarrative.authorName}
              publicNaming={primaryNarrative.publicNaming}
            />

            <SectionDivider />

            {/* Legacy Section */}
            <NarrativeSection
              title="Legacy"
              icon={BookOpen}
              sections={primaryNarrative.narrative.sections.legacy}
              organization={organization}
              authorName={primaryNarrative.authorName}
              publicNaming={primaryNarrative.publicNaming}
            />
          </div>
        </section>
      )}

      {/* Empty state if no narratives */}
      {publicNarratives.length === 0 && (
        <section className="py-16 md:py-24">
          <div className="container-content max-w-2xl text-center">
            <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-6" />
            <h2 className="font-display text-2xl text-marble-100 mb-4">Story Coming Soon</h2>
            <p className="text-slate-400 mb-8">
              The founder is still working on documenting this organization&apos;s story. Check back
              later or add your own perspective if you were part of it.
            </p>
          </div>
        </section>
      )}

      {/* Get Involved Section */}
      <GetInvolvedSection
        organization={organization}
        currentUserId={currentUserId}
        currentUserStoryId={currentUserStoryId}
      />
    </div>
  );
}
