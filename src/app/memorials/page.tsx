"use client";

import { useEffect, useState } from "react";
import {
  MemorialsHeroSection,
  GlobeSection,
  FeaturedStoriesSection,
  GetInvolvedSection,
  MemorialsCTASection,
} from "@/components/sections/memorials";
import type {
  CenotapheryMarker,
  CenotapheryLevel,
  CenotapheryStatus,
  CenotapheryStyle,
} from "@/types/cenotaphery";

interface ApiCenotaphery {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  level: CenotapheryLevel;
  coordinates: {
    lat: number;
    lng: number;
  };
  statistics: {
    cenotaphCount: number;
    capacity: number;
    fillPercentage: number;
  };
  status: CenotapheryStatus;
  style: CenotapheryStyle;
  location: string;
  recentActivity: {
    newCenotaphsThisWeek: number;
    totalVisitsThisWeek: number;
  };
}

interface ApiCenotapheriesResponse {
  cenotapheries: ApiCenotaphery[];
  globalStats: {
    totalCenotapheries: number;
    totalCenotaphs: number;
    totalCapacity: number;
  };
}

interface FeaturedStory {
  id: string;
  quote: string;
  companyName: string;
  years: string;
  location: string;
  industry: string;
  industryColor: string;
  respects: number;
}

interface ApiFeaturedResponse {
  stories: FeaturedStory[];
}

// Transform API cenotaphery to CenotapheryMarker format
function transformToMarker(cenotaphery: ApiCenotaphery): CenotapheryMarker {
  // Derive country name from location field or use a default
  const locationParts = cenotaphery.location.split(",");
  const country =
    locationParts.length > 1
      ? locationParts[locationParts.length - 1].trim()
      : cenotaphery.location === "all"
        ? "Global"
        : cenotaphery.location;

  return {
    id: cenotaphery.id,
    name: cenotaphery.name,
    level: cenotaphery.level,
    coordinates: cenotaphery.coordinates,
    statistics: cenotaphery.statistics,
    status: cenotaphery.status,
    style: cenotaphery.style,
    recentActivity: cenotaphery.recentActivity,
    location: {
      country,
    },
  };
}

/**
 * Memorials page - Global memorial with interactive 3D globe navigation
 *
 * Features:
 * - Hero section with animated statistics
 * - Interactive 3D globe with cenotaphery markers
 * - Side panel with memorial details
 * - Featured stories section
 * - CTA for creating cenotaphs
 *
 * Header, Footer, MenuTransition, and GlobalParticles are provided by AppShell.
 */
export default function MemorialsPage() {
  const [markers, setMarkers] = useState<CenotapheryMarker[]>([]);
  const [stories, setStories] = useState<FeaturedStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiStats, setApiStats] = useState<ApiCenotapheriesResponse["globalStats"] | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch cenotapheries and featured stories in parallel
        const [cenotapheriesRes, featuredRes] = await Promise.all([
          fetch("/api/cenotapheries"),
          fetch("/api/cenotaph/featured"),
        ]);

        if (!cenotapheriesRes.ok) {
          throw new Error("Failed to fetch cenotapheries");
        }

        if (!featuredRes.ok) {
          throw new Error("Failed to fetch featured stories");
        }

        const cenotapheriesData: ApiCenotapheriesResponse = await cenotapheriesRes.json();
        const featuredData: ApiFeaturedResponse = await featuredRes.json();

        // Transform cenotapheries to markers
        const transformedMarkers = cenotapheriesData.cenotapheries.map(transformToMarker);

        setMarkers(transformedMarkers);
        setStories(featuredData.stories);
        setApiStats(cenotapheriesData.globalStats);
      } catch (err) {
        console.error("Error fetching memorials data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Calculate hero stats from real data
  const heroStats = {
    countries: apiStats?.totalCenotapheries || 0, // Each cenotaphery represents a location
    cities: 0, // Not tracked yet
    founders: 0, // Not tracked yet
    organizations: apiStats?.totalCenotaphs || 0,
  };

  // Calculate globe sidebar stats
  const globeStats = {
    totalStories: apiStats?.totalCenotaphs || 0,
    totalCountries: apiStats?.totalCenotapheries || 0,
    totalIndustries: 0, // Could be calculated from unique industries
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading memorials...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center max-w-md mx-auto px-6">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gold-500 text-slate-900 rounded hover:bg-gold-400 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero with title and animated stats */}
      <MemorialsHeroSection stats={heroStats} />

      {/* Interactive 3D Globe with markers */}
      <GlobeSection markers={markers} globalStats={globeStats} />

      {/* Featured stories from cenotaphs */}
      {stories.length > 0 && <FeaturedStoriesSection stories={stories} />}

      {/* CTA to create cenotaph */}
      <MemorialsCTASection />

      {/* Roman separator */}
      <div className="divider-roman py-12 md:py-16 bg-slate-950">
        <span className="text-gold-400 font-serif text-sm tracking-[0.3em] px-6">✦</span>
      </div>

      {/* Get Involved - appeal to future Keepers */}
      <GetInvolvedSection />
    </>
  );
}
