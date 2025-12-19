"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CenotapheryGallery, CenotapheryFilters } from "@/components/cenotaphery";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";
import { Spinner } from "@/components/ui/spinner";
import { Landmark, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Cenotaph {
  id: string;
  slug: string;
  organization_name: string;
  organization_type: string | null;
  industry: string | null;
  epitaph: string | null;
  founded_date: string | null;
  closed_date: string | null;
  location: string | null;
  cenotaph_image_url: string;
  organization_id: string | null;
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

interface CenotapheryPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Cenotaphery Page - Gallery of cenotaphs with masonry layout
 *
 * Route: /cenotaphery/[slug]
 * First cenotaphery: /cenotaphery/the-first
 *
 * Features:
 * - Masonry gallery of cenotaph cards
 * - URL-based filters (org type, age, founded)
 * - Empty state with CTA
 * - Responsive design
 */
function CenotapheryContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const [cenotaphs, setCenotaphs] = useState<Cenotaph[]>([]);
  const [cenotapheryInfo, setCenotapheryInfo] = useState<CenotapheryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get cenotaphery display info from API or use slug as fallback
  const cenotapheryName = cenotapheryInfo?.name || `Cenotaphery: ${slug}`;
  const cenotapheryDescription =
    cenotapheryInfo?.description || "A digital memorial for organizations.";

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
      } catch (err) {
        console.error("Error fetching cenotaphery:", err);
        setError("Failed to load cenotaphery. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCenotaphery();
  }, [slug, searchParams]);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-content mx-auto px-6">
          {/* Section label */}
          <div className="text-center mb-6">
            <SectionLabel>cenotaphery</SectionLabel>
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-center mb-6 tracking-wide">
            <span className="text-gradient-gold">{cenotapheryName}</span>
          </h1>

          {/* Description */}
          <p className="text-lg text-slate-400 text-center max-w-2xl mx-auto leading-relaxed">
            {cenotapheryDescription}
          </p>

          {/* Roman divider */}
          <div className="divider-roman mt-10">
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

/**
 * Main Page Component with Suspense boundary for useSearchParams
 */
export default function CenotapheryPage({ params }: CenotapheryPageProps) {
  const [slug, setSlug] = useState<string>("");

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  if (!slug) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Spinner size="lg" variant="dark" />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <Spinner size="lg" variant="dark" />
        </div>
      }
    >
      <CenotapheryContent slug={slug} />
    </Suspense>
  );
}
