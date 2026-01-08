"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/section-label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  Microscope,
  User,
  Building2,
  DollarSign,
  Users,
  TrendingUp,
  Cog,
  Filter,
  X,
  Loader2,
  Zap,
  Clock,
  RefreshCw,
  EyeOff,
} from "lucide-react";
import { ContributeModal } from "./contribute-modal";

// Types
type PathologyLocalization = "LP" | "SP" | "FP" | "CP" | "MP" | "OP";
type PathologyEtiology = "ETI-F" | "ETI-M" | "ETI-C" | "ETI-R" | "ETI-T" | "ETI-S";
type PathologyCourse = "ACU" | "CHR" | "REL" | "LAT";

interface Pathology {
  id: string;
  code: string;
  slug: string;
  name: string;
  alternative_names: string[];
  definition: string;
  localization: PathologyLocalization;
  primary_etiology: PathologyEtiology;
  typical_course: PathologyCourse;
  key_authors: string[];
  created_at: string;
  updated_at: string;
}

interface PathologyStats {
  total: number;
  byLocalization: { localization: PathologyLocalization; label: string; count: number }[];
  byEtiology: { etiology: PathologyEtiology; label: string; count: number }[];
  byCourse: { course: PathologyCourse; label: string; count: number }[];
}

interface PathologiesResponse {
  pathologies: Pathology[];
  total: number;
  stats: PathologyStats;
}

// Display labels
const LOCALIZATION_LABELS: Record<PathologyLocalization, string> = {
  LP: "Leadership",
  SP: "Structural",
  FP: "Financial",
  CP: "Cultural",
  MP: "Market",
  OP: "Operational",
};

const ETIOLOGY_LABELS: Record<PathologyEtiology, string> = {
  "ETI-F": "Founder-induced",
  "ETI-M": "Market-induced",
  "ETI-C": "Competition-induced",
  "ETI-R": "Regulatory-induced",
  "ETI-T": "Technology-induced",
  "ETI-S": "Stochastic",
};

const COURSE_LABELS: Record<PathologyCourse, string> = {
  ACU: "Acute",
  CHR: "Chronic",
  REL: "Relapsing",
  LAT: "Latent",
};

// Helper function to get localization icon
function getLocalizationIcon(localization: PathologyLocalization) {
  switch (localization) {
    case "LP":
      return <User className="w-4 h-4" />;
    case "SP":
      return <Building2 className="w-4 h-4" />;
    case "FP":
      return <DollarSign className="w-4 h-4" />;
    case "CP":
      return <Users className="w-4 h-4" />;
    case "MP":
      return <TrendingUp className="w-4 h-4" />;
    case "OP":
      return <Cog className="w-4 h-4" />;
    default:
      return <Microscope className="w-4 h-4" />;
  }
}

// Helper function to get course icon and color
function getCourseInfo(course: PathologyCourse) {
  switch (course) {
    case "ACU":
      return {
        icon: <Zap className="w-3 h-3" />,
        color: "bg-red-500/20 text-red-400",
        label: "Acute",
      };
    case "CHR":
      return {
        icon: <Clock className="w-3 h-3" />,
        color: "bg-yellow-500/20 text-yellow-400",
        label: "Chronic",
      };
    case "REL":
      return {
        icon: <RefreshCw className="w-3 h-3" />,
        color: "bg-orange-500/20 text-orange-400",
        label: "Relapsing",
      };
    case "LAT":
      return {
        icon: <EyeOff className="w-3 h-3" />,
        color: "bg-purple-500/20 text-purple-400",
        label: "Latent",
      };
    default:
      return {
        icon: <Microscope className="w-3 h-3" />,
        color: "bg-slate-500/20 text-slate-400",
        label: course,
      };
  }
}

// Stats Section Component
function StatsSection({ stats }: { stats: PathologyStats | null }) {
  if (!stats) return null;

  const leadershipCount = stats.byLocalization.find((l) => l.localization === "LP")?.count || 0;
  const structuralCount = stats.byLocalization.find((l) => l.localization === "SP")?.count || 0;
  const financialCount = stats.byLocalization.find((l) => l.localization === "FP")?.count || 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card variant="dark" padding="md">
        <div className="text-center">
          <span className="font-display text-3xl font-semibold text-gold-400">{stats.total}</span>
          <p className="text-slate-400 text-sm mt-1">Total Pathologies</p>
        </div>
      </Card>
      <Card variant="dark" padding="md">
        <div className="text-center">
          <span className="font-display text-3xl font-semibold text-gold-400">
            {leadershipCount}
          </span>
          <p className="text-slate-400 text-sm mt-1">Leadership (LP)</p>
        </div>
      </Card>
      <Card variant="dark" padding="md">
        <div className="text-center">
          <span className="font-display text-3xl font-semibold text-gold-400">
            {structuralCount}
          </span>
          <p className="text-slate-400 text-sm mt-1">Structural (SP)</p>
        </div>
      </Card>
      <Card variant="dark" padding="md">
        <div className="text-center">
          <span className="font-display text-3xl font-semibold text-gold-400">
            {financialCount}
          </span>
          <p className="text-slate-400 text-sm mt-1">Financial (FP)</p>
        </div>
      </Card>
    </div>
  );
}

// Pathology Card Component
function PathologyCard({ pathology }: { pathology: Pathology }) {
  const courseInfo = getCourseInfo(pathology.typical_course);

  return (
    <Link href={`/research/pathology/${pathology.slug}`}>
      <Card
        variant="dark"
        padding="md"
        className="h-full group hover:border-gold-500/30 transition-colors cursor-pointer"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-400 flex-shrink-0 mt-1 group-hover:bg-gold-500/20 group-hover:text-gold-400 transition-colors">
            {getLocalizationIcon(pathology.localization)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <span className="text-xs font-mono text-gold-400/80 block mb-1">
                  {pathology.code}
                </span>
                <h3 className="font-display text-base font-medium text-marble-100 group-hover:text-gold-400 transition-colors line-clamp-1">
                  {pathology.name}
                </h3>
              </div>
              <span
                className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded flex-shrink-0 ${courseInfo.color}`}
              >
                {courseInfo.icon}
                {courseInfo.label}
              </span>
            </div>

            <p className="text-slate-400 text-sm mb-3 line-clamp-2">{pathology.definition}</p>

            {/* Classification badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-xs px-2 py-0.5 rounded bg-slate-700/50 text-slate-400">
                {LOCALIZATION_LABELS[pathology.localization]}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-700/50 text-slate-400">
                {ETIOLOGY_LABELS[pathology.primary_etiology]}
              </span>
            </div>

            {/* Key authors */}
            {pathology.key_authors && pathology.key_authors.length > 0 && (
              <p className="text-xs text-slate-500">
                Key authors: {pathology.key_authors.join(", ")}
              </p>
            )}

            {/* View details arrow */}
            <div className="flex items-center gap-1 mt-3 text-xs text-slate-500 group-hover:text-gold-400 transition-colors">
              View details
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

// Filter Sidebar Component
function FilterSidebar({
  stats,
  selectedLocalization,
  selectedEtiology,
  selectedCourse,
  onLocalizationChange,
  onEtiologyChange,
  onCourseChange,
}: {
  stats: PathologyStats | null;
  selectedLocalization: string;
  selectedEtiology: string;
  selectedCourse: string;
  onLocalizationChange: (localization: string) => void;
  onEtiologyChange: (etiology: string) => void;
  onCourseChange: (course: string) => void;
}) {
  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Localization Filter */}
      <div>
        <h3 className="font-display text-sm font-medium text-marble-100 mb-3 flex items-center gap-2">
          <Microscope className="w-4 h-4 text-gold-400" />
          Localization
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => onLocalizationChange("")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !selectedLocalization
                ? "bg-gold-500/20 text-gold-400"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            All Types
          </button>
          {stats.byLocalization.map((loc) => (
            <button
              key={loc.localization}
              onClick={() => onLocalizationChange(loc.localization)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                selectedLocalization === loc.localization
                  ? "bg-gold-500/20 text-gold-400"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              {getLocalizationIcon(loc.localization)}
              <span className="flex-1">{loc.label}</span>
              <span className="text-slate-500">({loc.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Etiology Filter */}
      <div>
        <h3 className="font-display text-sm font-medium text-marble-100 mb-3 flex items-center gap-2">
          <Filter className="w-4 h-4 text-gold-400" />
          Etiology
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => onEtiologyChange("")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !selectedEtiology
                ? "bg-gold-500/20 text-gold-400"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            All Causes
          </button>
          {stats.byEtiology.map((eti) => (
            <button
              key={eti.etiology}
              onClick={() => onEtiologyChange(eti.etiology)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                selectedEtiology === eti.etiology
                  ? "bg-gold-500/20 text-gold-400"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              <span className="flex-1">{eti.label}</span>
              <span className="text-slate-500">({eti.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Course Filter */}
      <div>
        <h3 className="font-display text-sm font-medium text-marble-100 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-gold-400" />
          Course
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => onCourseChange("")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !selectedCourse ? "bg-gold-500/20 text-gold-400" : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            All Courses
          </button>
          {stats.byCourse.map((crs) => {
            const courseInfo = getCourseInfo(crs.course);
            return (
              <button
                key={crs.course}
                onClick={() => onCourseChange(crs.course)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  selectedCourse === crs.course
                    ? "bg-gold-500/20 text-gold-400"
                    : "text-slate-400 hover:bg-slate-800"
                }`}
              >
                {courseInfo.icon}
                <span className="flex-1">{crs.label}</span>
                <span className="text-slate-500">({crs.count})</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Main Page Component
export default function PathologyPage() {
  const [pathologies, setPathologies] = useState<Pathology[]>([]);
  const [stats, setStats] = useState<PathologyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocalization, setSelectedLocalization] = useState("");
  const [selectedEtiology, setSelectedEtiology] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);

  // Fetch pathologies
  const fetchPathologies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (selectedLocalization) params.set("localization", selectedLocalization);
      if (selectedEtiology) params.set("etiology", selectedEtiology);
      if (selectedCourse) params.set("course", selectedCourse);
      if (searchQuery) params.set("search", searchQuery);

      const response = await fetch(`/api/pathologies?${params}`);
      if (!response.ok) throw new Error("Failed to fetch pathologies");

      const data: PathologiesResponse = await response.json();
      setPathologies(data.pathologies);
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [selectedLocalization, selectedEtiology, selectedCourse, searchQuery]);

  // Initial fetch
  useEffect(() => {
    fetchPathologies();
  }, [fetchPathologies]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPathologies();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchPathologies]);

  const clearFilters = () => {
    setSelectedLocalization("");
    setSelectedEtiology("");
    setSelectedCourse("");
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedLocalization || selectedEtiology || selectedCourse || searchQuery;

  return (
    <>
      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-content mx-auto px-6">
          <Link
            href="/research"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-gold-400 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Research Hub
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="animate-fade-in-up">
              <SectionLabel>pathology classification</SectionLabel>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold mt-4 mb-4 text-marble-100">
                SOIL-PC: Organizational Pathologies
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl">
                A systematic classification of organizational diseases - an ICD analog for
                organizations. Each pathology is categorized by where it manifests, what causes it,
                and how it develops.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="pb-8">
        <div className="max-w-content mx-auto px-6">
          <StatsSection stats={stats} />
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-content mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <FilterSidebar
                  stats={stats}
                  selectedLocalization={selectedLocalization}
                  selectedEtiology={selectedEtiology}
                  selectedCourse={selectedCourse}
                  onLocalizationChange={setSelectedLocalization}
                  onEtiologyChange={setSelectedEtiology}
                  onCourseChange={setSelectedCourse}
                />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Search and Mobile Filter Toggle */}
              <div className="flex gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    type="text"
                    placeholder="Search pathologies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="dark-secondary"
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-5 h-5" />
                </Button>
              </div>

              {/* Mobile Filters */}
              {showFilters && (
                <Card variant="dark" padding="md" className="mb-6 lg:hidden">
                  <FilterSidebar
                    stats={stats}
                    selectedLocalization={selectedLocalization}
                    selectedEtiology={selectedEtiology}
                    selectedCourse={selectedCourse}
                    onLocalizationChange={(l) => {
                      setSelectedLocalization(l);
                      setShowFilters(false);
                    }}
                    onEtiologyChange={(e) => {
                      setSelectedEtiology(e);
                      setShowFilters(false);
                    }}
                    onCourseChange={(c) => {
                      setSelectedCourse(c);
                      setShowFilters(false);
                    }}
                  />
                </Card>
              )}

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="text-slate-500 text-sm">Active filters:</span>
                  {selectedLocalization && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gold-500/20 text-gold-400 text-sm">
                      {LOCALIZATION_LABELS[selectedLocalization as PathologyLocalization]}
                      <button onClick={() => setSelectedLocalization("")}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedEtiology && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gold-500/20 text-gold-400 text-sm">
                      {ETIOLOGY_LABELS[selectedEtiology as PathologyEtiology]}
                      <button onClick={() => setSelectedEtiology("")}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedCourse && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gold-500/20 text-gold-400 text-sm">
                      {COURSE_LABELS[selectedCourse as PathologyCourse]}
                      <button onClick={() => setSelectedCourse("")}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gold-500/20 text-gold-400 text-sm">
                      &quot;{searchQuery}&quot;
                      <button onClick={() => setSearchQuery("")}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={clearFilters}
                    className="text-slate-500 text-sm hover:text-slate-300"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
                </div>
              )}

              {/* Error State */}
              {error && (
                <Card variant="dark" padding="lg" className="text-center">
                  <p className="text-red-400 mb-4">{error}</p>
                  <Button variant="dark-secondary" onClick={fetchPathologies}>
                    Try Again
                  </Button>
                </Card>
              )}

              {/* Pathologies Grid */}
              {!loading && !error && (
                <>
                  <div className="grid gap-4">
                    {pathologies.map((pathology) => (
                      <PathologyCard key={pathology.id} pathology={pathology} />
                    ))}
                  </div>

                  {pathologies.length === 0 && (
                    <Card variant="dark" padding="lg" className="text-center">
                      <p className="text-slate-400">No pathologies found matching your criteria.</p>
                    </Card>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-slate-900/50">
        <div className="max-w-content mx-auto px-6 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-medium mb-4 text-marble-100">
            Help Us Expand SOIL-PC
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-8">
            The pathology classification is a living document. If you&apos;ve encountered an
            organizational disease not yet classified, or have research to contribute, we want to
            hear from you.
          </p>
          <Button variant="dark-primary" size="lg" onClick={() => setShowContributeModal(true)}>
            Propose a Pathology
          </Button>
        </div>
      </section>

      {/* Contribute Modal */}
      <ContributeModal isOpen={showContributeModal} onClose={() => setShowContributeModal(false)} />
    </>
  );
}
