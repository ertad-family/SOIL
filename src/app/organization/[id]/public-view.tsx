"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { trackEvent } from "@/lib/analytics";
import { useRefTracking } from "@/hooks/useRefTracking";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SectionLabel } from "@/components/ui/section-label";
import {
  MapPin,
  Building2,
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
  Eye,
  Calendar,
  TrendingUp,
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
import { cn, formatRevenueUSD } from "@/lib/utils";
import { ShareButton } from "@/components/ui/share-button";
import { PayRespectsButton, RespectsCounter } from "@/components/ui/pay-respects-button";
import { VerifiedBadgeWithTooltip } from "@/components/ui/verified-badge-tooltip";
import { BackButton } from "@/components/ui/back-button";

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
  location_lat: number | null;
  location_lng: number | null;
  location_geo_id: number | null;
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
  cenotaphery_slug: string | null;
}

interface PublicSummaryData {
  text: string;
  keyFacts: string[];
  closurePattern: string | null;
}

interface PublicNarrativeData {
  storyId: string;
  authorName: string | null;
  founderRole: FounderRole | null;
  publicNaming: PublicNamingPreference | null;
  coinedAt: string;
  summary: PublicSummaryData | null;
}

interface PublicViewProps {
  organization: OrganizationData;
  memorial: MemorialData | null;
  publicNarratives: PublicNarrativeData[];
  currentUserId: string | null;
  currentUserStoryId: string | null;
  peakRevenueUSD: number | null;
  /** Issue #62: When owner is previewing the visitor view */
  isOwnerPreview?: boolean;
  /** Issue #62: Callback to exit preview mode */
  onExitPreview?: () => void;
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

/** Calculate organization age in years */
function calculateAge(founded: string | null, closed: string | null): number | null {
  if (!founded || !closed) return null;

  const foundedDate = new Date(founded);
  const closedDate = new Date(closed);

  // Calculate difference in years
  const diffTime = closedDate.getTime() - foundedDate.getTime();
  const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));

  return diffYears > 0 ? diffYears : null;
}

/** Convert year to Roman numerals */
function toRomanNumerals(year: number): string {
  const romanNumerals: [number, string][] = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];

  let result = "";
  let remaining = year;

  for (const [value, numeral] of romanNumerals) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
  }

  return result;
}

/** Format date range as Roman numerals */
function formatDateRangeRoman(founded: string | null, closed: string | null): string | null {
  if (!founded && !closed) return null;

  const getYear = (date: string | null) => {
    if (!date) return null;
    return new Date(date).getFullYear();
  };

  const foundedYear = getYear(founded);
  const closedYear = getYear(closed);

  if (foundedYear && closedYear) {
    return `${toRomanNumerals(foundedYear)} — ${toRomanNumerals(closedYear)}`;
  } else if (foundedYear) {
    return toRomanNumerals(foundedYear);
  } else if (closedYear) {
    return toRomanNumerals(closedYear);
  }

  return null;
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

/** Hero section with cenotaph monument - dramatic full-width design */
function HeroSection({
  organization,
  memorial,
  dateRange,
  location,
  isOwnCenotaph,
  peakRevenueUSD,
}: {
  organization: OrganizationData;
  memorial: MemorialData | null;
  dateRange: string | null;
  location: string | null;
  isOwnCenotaph: boolean;
  peakRevenueUSD: number | null;
}) {
  const { orgName } = getDisplayName(organization, null, null);
  const romanDateRange = formatDateRangeRoman(organization.founded_date, organization.closed_date);

  // Calculate organization age
  const organizationAge = calculateAge(organization.founded_date, organization.closed_date);

  // Format peak revenue in USD with shorthand notation
  const formattedRevenue = formatRevenueUSD(peakRevenueUSD);

  return (
    <>
      <section className="relative min-h-[85vh] overflow-hidden w-screen ml-[calc(-50vw+50%)]">
        {/* Background - consistent slate-900 */}
        <div className="absolute inset-0 bg-slate-900" />

        {/* Content grid */}
        <div className="relative z-10 min-h-[85vh] grid grid-cols-1 lg:grid-cols-2">
          {/* Left: Cenotaph as full-column background */}
          <div className="relative min-h-[50vh] lg:min-h-[85vh]">
            {memorial?.cenotaph_image_url ? (
              <div className="absolute inset-0">
                <Image
                  src={memorial.cenotaph_image_url}
                  alt="Memorial cenotaph"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain object-center"
                />
              </div>
            ) : (
              /* Placeholder when no cenotaph image */
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-marble-900/50 border border-marble-800 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-marble-600" />
                  </div>
                  <p className="text-marble-500 font-medium">Cenotaph design in progress</p>
                </div>
              </div>
            )}

            {/* Respects counter - positioned at bottom center of cenotaph */}
            {memorial && (
              <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
                <RespectsCounter
                  memorialId={memorial.id}
                  initialCount={memorial.respects_count}
                  className="text-lg text-marble-300/80 [&>span:first-child]:text-xl [&>span:first-child]:text-gold-400"
                />
              </div>
            )}
          </div>

          {/* Right: Organization Info */}
          <div className="relative flex items-center lg:pl-8 xl:pl-16 px-6 lg:px-12 pb-16 lg:pb-0">
            {/* Back to Cenotaphery button - positioned at bottom right */}
            {memorial?.cenotaphery_slug && (
              <BackButton
                href={`/cenotaphery/${memorial.cenotaphery_slug}`}
                text="Back to Cenotaphery"
                className="absolute bottom-6 right-6 lg:bottom-8 lg:right-8 z-30"
              />
            )}

            <div className="relative z-10 max-w-xl">
              {/* Verification badge above name */}
              {organization.verification_status === "verified" && (
                <div className="mb-4">
                  <VerifiedBadgeWithTooltip
                    headline="Verified Organization"
                    description="This organization's existence has been confirmed by multiple independent sources, ensuring this memorial represents a real organization."
                    showButton={false}
                  />
                </div>
              )}

              {/* Organization name */}
              <h1
                className={cn(
                  "font-display text-4xl md:text-5xl xl:text-6xl font-semibold leading-tight mb-6",
                  organization.is_public ? "text-marble-100" : "text-slate-400 italic"
                )}
              >
                {orgName}
              </h1>

              {/* Epitaph */}
              {memorial?.epitaph && (
                <blockquote className="relative mb-10">
                  <Quote className="absolute -top-1 -left-6 w-8 h-8 text-gold-500/20" />
                  <p className="font-serif text-xl md:text-2xl text-gold-400/80 italic leading-relaxed">
                    &ldquo;{memorial.epitaph}&rdquo;
                  </p>
                </blockquote>
              )}

              {/* Metadata - vertical stack for elegance */}
              <div className="space-y-3 text-sm">
                {organization.organization_type && (
                  <div className="flex items-center gap-3 text-slate-400">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    <span>{ORG_TYPE_LABELS[organization.organization_type]}</span>
                    {organization.industry && (
                      <>
                        <span className="text-slate-600">·</span>
                        <span>{organization.industry}</span>
                      </>
                    )}
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-3 text-slate-400">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>{location}</span>
                  </div>
                )}
                {organizationAge && (
                  <div className="flex items-center gap-3 text-slate-400">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>
                      {organizationAge} {organizationAge === 1 ? "year" : "years"} of operation
                    </span>
                  </div>
                )}
                {organization.peak_team_size && (
                  <div className="flex items-center gap-3 text-slate-400">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span>Peak team: {organization.peak_team_size} people</span>
                  </div>
                )}
                {formattedRevenue && (
                  <div className="flex items-center gap-3 text-slate-400">
                    <TrendingUp className="w-4 h-4 text-slate-500" />
                    <span>Peak revenue: {formattedRevenue}</span>
                  </div>
                )}
              </div>

              {/* Pay Respects + Share Button - inline, only for verified orgs with cenotaph */}
              {organization.verification_status === "verified" && memorial && (
                <div className="mt-8 flex flex-row flex-wrap items-center gap-3">
                  {/* Pay Respects */}
                  <PayRespectsButton memorialId={memorial.id} isOwnCenotaph={isOwnCenotaph} />

                  {/* Share Button */}
                  {memorial.cenotaph_image_url && (
                    <ShareButton
                      url={
                        typeof window !== "undefined"
                          ? `${window.location.origin}/organization/${organization.id}`
                          : ""
                      }
                      title={`${orgName} - preserved at SOIL`}
                      description="A story of organizational experience, preserved for future founders to learn from."
                      memorialId={memorial.id}
                      organizationId={organization.id}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Roman divider with lifespan in Roman numerals */}
      <div className="divider-roman bg-slate-900 py-8 w-screen ml-[calc(-50vw+50%)]">
        <span className="text-gold-400 font-serif text-sm tracking-[0.3em] px-6">
          {romanDateRange || "✦"}
        </span>
      </div>
    </>
  );
}

/** Section divider with Roman styling - 128px margins */
function SectionDivider() {
  return (
    <div className="divider-roman py-32">
      <span className="text-gold-500 text-2xl">&#10022;</span>
    </div>
  );
}

// =============================================================================
// STORY INSIGHTS SECTION - AI refined data only
// =============================================================================

/** Closure pattern labels for display */
const CLOSURE_PATTERN_LABELS: Record<string, string> = {
  cash_crisis: "Cash Flow Crisis",
  market_failure: "Market Failure",
  team_collapse: "Team Collapse",
  founder_burnout: "Founder Burnout",
  competition: "Competitive Pressure",
  pivot_failure: "Failed Pivot",
  regulatory: "Regulatory Issues",
  funding_gap: "Funding Gap",
  product_market_fit: "Product-Market Fit Issues",
  scaling_failure: "Scaling Challenges",
};

/** Combined story insights section with newspaper layout */
function StoryInsightsSection({ summary }: { summary: PublicSummaryData }) {
  const { text, keyFacts, closurePattern } = summary;

  // Split text into paragraphs for two-column layout
  const paragraphs = text.split("\n\n").filter((p) => p.trim());
  const midPoint = Math.ceil(paragraphs.length / 2);
  const leftColumn = paragraphs.slice(0, midPoint);
  const rightColumn = paragraphs.slice(midPoint);

  // Get human-readable closure pattern label
  const patternLabel = closurePattern
    ? CLOSURE_PATTERN_LABELS[closurePattern] || closurePattern
    : null;

  return (
    <section className="py-12 md:py-16">
      <div className="container-content">
        {/* Key Insights + Closure Pattern - Full width section (first for quick overview) */}
        {(keyFacts.length > 0 || patternLabel) && (
          <div className="mb-16">
            <div className="grid md:grid-cols-4 gap-8">
              {/* Key Insights - 3 columns */}
              {keyFacts.length > 0 && (
                <div className="md:col-span-3">
                  <SectionLabel>key insights</SectionLabel>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {keyFacts.map((fact, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-slate-800/40 rounded-lg border border-slate-700/30"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                        <p className="text-marble-300 text-base leading-relaxed">{fact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Closure Pattern - 1 column */}
              {patternLabel && (
                <div className={keyFacts.length === 0 ? "md:col-span-4" : ""}>
                  <SectionLabel>the pattern</SectionLabel>
                  <div className="mt-6">
                    <Card variant="dark-elevated" padding="lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center">
                          <AlertTriangle className="w-6 h-6 text-gold-400" />
                        </div>
                        <span className="font-display text-lg text-marble-100">{patternLabel}</span>
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* The Story - Newspaper two-column layout (detailed reading for interested visitors) */}
        <div className="max-w-6xl mx-auto">
          <SectionLabel>the story</SectionLabel>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 mt-8">
            <div className="space-y-5">
              {leftColumn.map((paragraph, index) => (
                <p key={index} className="text-marble-300 leading-relaxed text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="space-y-5">
              {rightColumn.map((paragraph, index) => (
                <p key={index} className="text-marble-300 leading-relaxed text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
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
  peakRevenueUSD,
  isOwnerPreview = false,
  onExitPreview,
}: PublicViewProps) {
  const dateRange = formatDateRange(organization.founded_date, organization.closed_date);
  const location = [organization.location_city, organization.location_country]
    .filter(Boolean)
    .join(", ");

  // Get the first narrative (primary story) - we can expand to show multiple later
  const primaryNarrative = publicNarratives[0];

  // Check if current user is the owner (cannot pay respects to own cenotaph)
  const isOwnCenotaph = currentUserId === organization.created_by;

  // Track referral clicks from shared links
  useRefTracking();

  // Track cenotaph view on mount (skip when owner is previewing)
  useEffect(() => {
    if (memorial?.id && !isOwnerPreview) {
      trackEvent("cenotaph_view", {
        category: "discovery",
        properties: {
          memorialId: memorial.id,
          organizationId: organization.id,
          organizationName: organization.name,
        },
      });
    }
  }, [memorial?.id, organization.id, organization.name, isOwnerPreview]);

  return (
    <div className="min-h-screen bg-slate-900 overflow-x-hidden">
      {/* Owner Preview Banner */}
      {isOwnerPreview && (
        <div className="sticky top-0 z-50 bg-gold-500/90 backdrop-blur-sm text-slate-900 py-2 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">
                You&apos;re viewing this page as a visitor
              </span>
            </div>
            {onExitPreview && (
              <button
                onClick={onExitPreview}
                className="text-sm font-medium underline hover:no-underline"
              >
                Back to Owner View
              </button>
            )}
          </div>
        </div>
      )}
      {/* Hero with Cenotaph */}
      <HeroSection
        organization={organization}
        memorial={memorial}
        dateRange={dateRange}
        location={location}
        isOwnCenotaph={isOwnCenotaph}
        peakRevenueUSD={peakRevenueUSD}
      />

      {/* Story Insights - AI refined data only */}
      {primaryNarrative?.summary && (
        <>
          <StoryInsightsSection summary={primaryNarrative.summary} />

          {/* TODO: Move ConsultationCTA to founder profile page */}
          {/* <ConsultationCTA organization={organization} /> */}

          {/* Roman divider after story block */}
          <SectionDivider />
        </>
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
