"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CenotapheryGallery, CenotapheryFilters } from "@/components/cenotaphery";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SectionLabel } from "@/components/ui/section-label";
import { Spinner } from "@/components/ui/spinner";
import { Landmark, ArrowRight, Award, Vote, Trophy, BookOpen, Crown, Star } from "lucide-react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

interface Cenotaph {
  id: string;
  organizationName: string;
  isPrivate?: boolean;
  organizationType: string | null;
  industry: string | null;
  epitaph: string | null;
  foundedDate: string | null;
  closedDate: string | null;
  location: string | null;
  cenotaphImageUrl: string;
  organizationId: string | null;
}

interface CenotapheryInfo {
  slug: string;
  name: string;
  description: string | null;
  location: string;
  capacity: number;
  status: string;
  style: string;
}

interface CenotapheryStats {
  totalCenotaphs: number;
  spotsRemaining: number;
  industriesCount: number;
  totalYearsOfHistory: number;
  totalRespects: number;
}

interface TopHonoredResident {
  id: string;
  organizationId: string | null;
  organizationName: string;
  isPrivate: boolean;
  respectsCount: number;
}

/**
 * Cenotaphery Content - Client component with gallery and filters
 */
export function CenotapheryContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const [cenotaphs, setCenotaphs] = useState<Cenotaph[]>([]);
  const [cenotapheryInfo, setCenotapheryInfo] = useState<CenotapheryInfo | null>(null);
  const [stats, setStats] = useState<CenotapheryStats | null>(null);
  const [topHonored, setTopHonored] = useState<TopHonoredResident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get cenotaphery display info from API or use slug as fallback
  const cenotapheryName = cenotapheryInfo?.name || `Cenotaphery: ${slug}`;
  const cenotapheryDescription =
    cenotapheryInfo?.description || "A digital memorial for organizations.";
  const isFirstCenotaphery = slug === "the-first";

  // Fetch cenotaphery with cenotaphs
  useEffect(() => {
    async function fetchCenotaphery() {
      setIsLoading(true);
      setError(null);

      try {
        // Build query params for filters
        const params = new URLSearchParams();

        const orgType = searchParams.get("org_type");
        const minAge = searchParams.get("min_age");
        const maxAge = searchParams.get("max_age");
        const foundedFrom = searchParams.get("founded_from");
        const foundedTo = searchParams.get("founded_to");

        if (orgType) params.set("org_type", orgType);
        if (minAge) params.set("min_age", minAge);
        if (maxAge) params.set("max_age", maxAge);
        if (foundedFrom) params.set("founded_from", foundedFrom);
        if (foundedTo) params.set("founded_to", foundedTo);

        const queryString = params.toString();
        const url = `/api/cenotapheries/${slug}${queryString ? `?${queryString}` : ""}`;
        const response = await fetch(url);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Cenotaphery not found.");
          } else {
            throw new Error("Failed to fetch cenotaphery");
          }
          return;
        }

        const data = await response.json();
        setCenotaphs(data.cenotaphs || []);

        // Update cenotaphery info from API response
        if (data.cenotaphery) {
          setCenotapheryInfo(data.cenotaphery);
        }
        if (data.stats) {
          setStats(data.stats);
        }
        if (data.topHonored) {
          setTopHonored(data.topHonored);
        }
      } catch (err) {
        console.error("Error fetching cenotaphery:", err);
        setError("Failed to load cenotaphery. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCenotaphery();
  }, [slug, searchParams]);

  // Track cenotaphery view when info is loaded
  useEffect(() => {
    if (cenotapheryInfo) {
      trackEvent("cenotaphery_view", {
        category: "discovery",
        properties: {
          cenotapherySlug: slug,
          cenotapheryName: cenotapheryInfo.name,
          cenotaphCount: cenotaphs.length,
        },
      });
    }
  }, [cenotapheryInfo, slug, cenotaphs.length]);

  // Calculate capacity percentage for progress bar
  const capacityPercentage = stats
    ? (stats.totalCenotaphs / (cenotapheryInfo?.capacity || 100)) * 100
    : 0;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section - Two Column Layout */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gold-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-content mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column: Title, Description & Benefits */}
            <div>
              {/* Section label */}
              <div className="mb-6">
                <SectionLabel>cenotaphery</SectionLabel>
              </div>

              {/* Title */}
              <h1 className="font-serif text-4xl md:text-5xl lg:text-5xl font-semibold mb-6 tracking-wide">
                <span className="text-gradient-gold">{cenotapheryName}</span>
              </h1>

              {/* Description */}
              <p className="text-lg text-slate-400 leading-relaxed mb-8">
                {cenotapheryDescription}
              </p>

              {/* First Founders Benefits - Only for "the-first" */}
              {isFirstCenotaphery && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-marble-200 uppercase tracking-wider">
                    Founding Member Benefits
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-slate-400">
                      <Crown className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" />
                      <span>
                        <span className="text-marble-200">Exclusivity</span> — Limited to the first
                        100 founders only
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-400">
                      <Star className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" />
                      <span>
                        <span className="text-marble-200">Premier Placement</span> — Forever first
                        on the platform
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-400">
                      <Vote className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" />
                      <span>
                        <span className="text-marble-200">Governance Rights</span> — Vote on project
                        roadmap
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-400">
                      <Trophy className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" />
                      <span>
                        <span className="text-marble-200">Awards Recognition</span> — Day of the
                        Dead Venture & Cenotavr Awards
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-400">
                      <Award className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" />
                      <span>
                        <span className="text-marble-200">Founder² Title</span> — Honorary
                        &quot;Founder Squared of SOIL&quot; status
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-400">
                      <BookOpen className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" />
                      <span>
                        <span className="text-marble-200">Research Citation</span> — Mentioned in
                        first research papers
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column: Stats & Top Honored */}
            <div className="space-y-6">
              {/* Capacity Card */}
              {stats && cenotapheryInfo && (
                <Card variant="dark-elevated" className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                        {isFirstCenotaphery ? "Founding Spots" : "Capacity"}
                      </span>
                      <span className="text-2xl font-serif text-gold-400">
                        {stats.spotsRemaining}
                        <span className="text-sm text-slate-500 ml-1">remaining</span>
                      </span>
                    </div>
                    <Progress value={capacityPercentage} variant="dark" className="h-3" />
                    <div className="flex justify-between mt-2 text-xs text-slate-500">
                      <span>{stats.totalCenotaphs} claimed</span>
                      <span>{cenotapheryInfo.capacity} total</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Stats - Bracket Counter Design */}
              {stats && (
                <div className="flex flex-wrap items-center justify-start gap-6 text-lg">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-2xl font-bold text-gold-400">
                      [{stats.totalCenotaphs}]
                    </span>
                    <span className="text-slate-400">cenotaphs</span>
                  </div>
                  <span className="text-slate-600 hidden sm:inline">·</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-2xl font-bold text-gold-400">
                      [{stats.industriesCount}]
                    </span>
                    <span className="text-slate-400">industries</span>
                  </div>
                  <span className="text-slate-600 hidden sm:inline">·</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-2xl font-bold text-gold-400">
                      [{stats.totalYearsOfHistory}]
                    </span>
                    <span className="text-slate-400">years of history</span>
                  </div>
                </div>
              )}

              {/* Top Honored Residents */}
              {topHonored.length > 0 && (
                <Card variant="dark-cenotaph" className="overflow-hidden">
                  <CardContent className="p-6">
                    <h3 className="text-sm font-medium text-gold-400 uppercase tracking-wider mb-4">
                      Most Honored Residents
                    </h3>
                    <ul className="space-y-3">
                      {topHonored.map((resident, index) => (
                        <li key={resident.id}>
                          <Link
                            href={
                              resident.organizationId
                                ? `/organization/${resident.organizationId}`
                                : "#"
                            }
                            className="flex items-center justify-between hover:bg-slate-800/50 -mx-2 px-2 py-1 rounded transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 text-xs font-medium">
                                {index + 1}
                              </span>
                              <span className="text-marble-200 truncate max-w-[180px] hover:text-gold-400 transition-colors">
                                {resident.organizationName}
                              </span>
                            </div>
                            <span className="text-gold-400 text-sm flex items-center gap-1">
                              {resident.respectsCount} <span className="text-gold-500">✦</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Roman divider */}
          <div className="divider-roman mt-12">
            <span className="text-gold-500 font-serif text-sm tracking-[0.3em] px-6">✦</span>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="max-w-content mx-auto px-6 mb-8">
        <CenotapheryFilters slug={slug} />
      </section>

      {/* Gallery Section */}
      <section className="max-w-content mx-auto px-6 pb-24">
        {isLoading ? (
          // Loading state
          <div className="flex flex-col items-center justify-center py-24">
            <Spinner size="lg" variant="dark" />
            <p className="text-slate-500 mt-4">Loading cenotaphs...</p>
          </div>
        ) : error ? (
          // Error state
          <div className="text-center py-24">
            <p className="text-error-400 mb-4">{error}</p>
            <Button variant="dark-primary" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : cenotaphs.length === 0 ? (
          // Empty state
          <EmptyState />
        ) : (
          // Gallery
          <>
            {/* Count badge */}
            <div className="mb-8">
              <p className="text-sm text-slate-500">
                Showing <span className="text-marble-200 font-medium">{cenotaphs.length}</span>{" "}
                cenotaph{cenotaphs.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Masonry gallery */}
            <CenotapheryGallery cenotaphs={cenotaphs} />
          </>
        )}
      </section>
    </div>
  );
}

/**
 * Empty State - Displayed when no cenotaphs match filters or none exist
 */
function EmptyState() {
  return (
    <div className="text-center py-24">
      {/* Icon */}
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
        <Landmark className="w-10 h-10 text-slate-500" />
      </div>

      {/* Message */}
      <h2 className="font-display text-2xl text-marble-100 mb-3">This cenotaphery is yet empty</h2>
      <p className="text-slate-400 max-w-md mx-auto mb-8">
        Be the first to create an organization with a cenotaph here. Honor your organization&apos;s
        journey and contribute to collective wisdom.
      </p>

      {/* CTA Button */}
      <Link href="/organization/create?returnTo=interview">
        <Button variant="dark-primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
          Create Organization
        </Button>
      </Link>

      {/* Decorative elements */}
      <div className="mt-12">
        <div className="divider-roman">
          <span className="text-gold-500/50 font-serif text-xs tracking-[0.3em] px-6">
            MEMENTO MORI
          </span>
        </div>
      </div>
    </div>
  );
}
