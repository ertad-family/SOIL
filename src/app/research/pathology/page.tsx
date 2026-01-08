"use client";

import { useState, useEffect, useMemo } from "react";
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
  ChevronDown,
} from "lucide-react";
import { ContributeModal } from "./contribute-modal";

// Types
type PathologyLocalization = "LP" | "SP" | "FP" | "CP" | "MP" | "OP";
type PathologyEtiology = "ETI-F" | "ETI-M" | "ETI-C" | "ETI-R" | "ETI-T" | "ETI-S" | "ETI-I";
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

// Available filter options (for dependent filtering)
interface AvailableFilterOptions {
  localizations: { value: PathologyLocalization; label: string; count: number }[];
  etiologies: { value: PathologyEtiology; label: string; count: number }[];
  courses: { value: PathologyCourse; label: string; count: number }[];
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
  "ETI-I": "Iatrogenic",
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

            <p className="text-slate-400 text-sm mb-3 line-clamp-4">{pathology.definition}</p>

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
  availableOptions,
  selectedLocalization,
  selectedEtiology,
  selectedCourse,
  onLocalizationChange,
  onEtiologyChange,
  onCourseChange,
}: {
  availableOptions: AvailableFilterOptions;
  selectedLocalization: string;
  selectedEtiology: string;
  selectedCourse: string;
  onLocalizationChange: (localization: string) => void;
  onEtiologyChange: (etiology: string) => void;
  onCourseChange: (course: string) => void;
}) {
  // State for collapsible sections - folded by default
  const [localizationOpen, setLocalizationOpen] = useState(false);
  const [etiologyOpen, setEtiologyOpen] = useState(false);
  const [courseOpen, setCourseOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Localization Filter */}
      <div>
        <button
          onClick={() => setLocalizationOpen(!localizationOpen)}
          className="w-full font-display text-sm font-medium text-marble-100 flex items-center gap-2 py-2 hover:text-gold-400 transition-colors"
        >
          <Microscope className="w-4 h-4 text-gold-400" />
          <span className="flex-1 text-left">Localization</span>
          {selectedLocalization && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-gold-500/20 text-gold-400">
              {LOCALIZATION_LABELS[selectedLocalization as PathologyLocalization]}
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-500 transition-transform ${localizationOpen ? "rotate-180" : ""}`}
          />
        </button>
        {localizationOpen && (
          <div className="space-y-1 mt-2 pl-6">
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
            {availableOptions.localizations.map((loc) => (
              <button
                key={loc.value}
                onClick={() => onLocalizationChange(loc.value)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  selectedLocalization === loc.value
                    ? "bg-gold-500/20 text-gold-400"
                    : "text-slate-400 hover:bg-slate-800"
                }`}
              >
                {getLocalizationIcon(loc.value)}
                <span className="flex-1">{loc.label}</span>
                <span className="text-slate-500">({loc.count})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Etiology Filter */}
      <div>
        <button
          onClick={() => setEtiologyOpen(!etiologyOpen)}
          className="w-full font-display text-sm font-medium text-marble-100 flex items-center gap-2 py-2 hover:text-gold-400 transition-colors"
        >
          <Filter className="w-4 h-4 text-gold-400" />
          <span className="flex-1 text-left">Etiology</span>
          {selectedEtiology && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-gold-500/20 text-gold-400">
              {ETIOLOGY_LABELS[selectedEtiology as PathologyEtiology]}
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-500 transition-transform ${etiologyOpen ? "rotate-180" : ""}`}
          />
        </button>
        {etiologyOpen && (
          <div className="space-y-1 mt-2 pl-6">
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
            {availableOptions.etiologies.map((eti) => (
              <button
                key={eti.value}
                onClick={() => onEtiologyChange(eti.value)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  selectedEtiology === eti.value
                    ? "bg-gold-500/20 text-gold-400"
                    : "text-slate-400 hover:bg-slate-800"
                }`}
              >
                <span className="flex-1">{eti.label}</span>
                <span className="text-slate-500">({eti.count})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Course Filter */}
      <div>
        <button
          onClick={() => setCourseOpen(!courseOpen)}
          className="w-full font-display text-sm font-medium text-marble-100 flex items-center gap-2 py-2 hover:text-gold-400 transition-colors"
        >
          <Clock className="w-4 h-4 text-gold-400" />
          <span className="flex-1 text-left">Course</span>
          {selectedCourse && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-gold-500/20 text-gold-400">
              {COURSE_LABELS[selectedCourse as PathologyCourse]}
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-500 transition-transform ${courseOpen ? "rotate-180" : ""}`}
          />
        </button>
        {courseOpen && (
          <div className="space-y-1 mt-2 pl-6">
            <button
              onClick={() => onCourseChange("")}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                !selectedCourse
                  ? "bg-gold-500/20 text-gold-400"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              All Courses
            </button>
            {availableOptions.courses.map((crs) => {
              const courseInfo = getCourseInfo(crs.value);
              return (
                <button
                  key={crs.value}
                  onClick={() => onCourseChange(crs.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                    selectedCourse === crs.value
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
        )}
      </div>
    </div>
  );
}

// Helper to calculate available options based on current filters
function calculateAvailableOptions(
  allPathologies: Pathology[],
  selectedLocalization: string,
  selectedEtiology: string,
  selectedCourse: string,
  searchQuery: string
): AvailableFilterOptions {
  // Helper to filter pathologies by specific criteria (excluding one filter)
  const filterPathologies = (
    excludeFilter: "localization" | "etiology" | "course" | "none"
  ): Pathology[] => {
    return allPathologies.filter((p) => {
      // Always apply search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!p.name.toLowerCase().includes(query) && !p.definition.toLowerCase().includes(query)) {
          return false;
        }
      }
      // Apply localization filter (unless excluded)
      if (
        excludeFilter !== "localization" &&
        selectedLocalization &&
        p.localization !== selectedLocalization
      ) {
        return false;
      }
      // Apply etiology filter (unless excluded)
      if (
        excludeFilter !== "etiology" &&
        selectedEtiology &&
        p.primary_etiology !== selectedEtiology
      ) {
        return false;
      }
      // Apply course filter (unless excluded)
      if (excludeFilter !== "course" && selectedCourse && p.typical_course !== selectedCourse) {
        return false;
      }
      return true;
    });
  };

  // Calculate localizations available (excluding localization filter)
  const forLocalizations = filterPathologies("localization");
  const localizationCounts: Record<string, number> = {};
  forLocalizations.forEach((p) => {
    localizationCounts[p.localization] = (localizationCounts[p.localization] || 0) + 1;
  });
  const localizations = Object.entries(localizationCounts)
    .map(([value, count]) => ({
      value: value as PathologyLocalization,
      label: LOCALIZATION_LABELS[value as PathologyLocalization],
      count,
    }))
    .sort((a, b) => b.count - a.count);

  // Calculate etiologies available (excluding etiology filter)
  const forEtiologies = filterPathologies("etiology");
  const etiologyCounts: Record<string, number> = {};
  forEtiologies.forEach((p) => {
    etiologyCounts[p.primary_etiology] = (etiologyCounts[p.primary_etiology] || 0) + 1;
  });
  const etiologies = Object.entries(etiologyCounts)
    .map(([value, count]) => ({
      value: value as PathologyEtiology,
      label: ETIOLOGY_LABELS[value as PathologyEtiology],
      count,
    }))
    .sort((a, b) => b.count - a.count);

  // Calculate courses available (excluding course filter)
  const forCourses = filterPathologies("course");
  const courseCounts: Record<string, number> = {};
  forCourses.forEach((p) => {
    courseCounts[p.typical_course] = (courseCounts[p.typical_course] || 0) + 1;
  });
  const courses = Object.entries(courseCounts)
    .map(([value, count]) => ({
      value: value as PathologyCourse,
      label: COURSE_LABELS[value as PathologyCourse],
      count,
    }))
    .sort((a, b) => b.count - a.count);

  return { localizations, etiologies, courses };
}

// Main Page Component
export default function PathologyPage() {
  const [allPathologies, setAllPathologies] = useState<Pathology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocalization, setSelectedLocalization] = useState("");
  const [selectedEtiology, setSelectedEtiology] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);

  // Fetch all pathologies once
  useEffect(() => {
    const fetchPathologies = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/pathologies");
        if (!response.ok) throw new Error("Failed to fetch pathologies");

        const data = await response.json();
        setAllPathologies(data.pathologies);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPathologies();
  }, []);

  // Filter pathologies client-side
  const filteredPathologies = useMemo(() => {
    return allPathologies.filter((p) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!p.name.toLowerCase().includes(query) && !p.definition.toLowerCase().includes(query)) {
          return false;
        }
      }
      if (selectedLocalization && p.localization !== selectedLocalization) {
        return false;
      }
      if (selectedEtiology && p.primary_etiology !== selectedEtiology) {
        return false;
      }
      if (selectedCourse && p.typical_course !== selectedCourse) {
        return false;
      }
      return true;
    });
  }, [allPathologies, searchQuery, selectedLocalization, selectedEtiology, selectedCourse]);

  // Calculate available filter options (dependent on current selections)
  const availableOptions = useMemo(() => {
    return calculateAvailableOptions(
      allPathologies,
      selectedLocalization,
      selectedEtiology,
      selectedCourse,
      searchQuery
    );
  }, [allPathologies, selectedLocalization, selectedEtiology, selectedCourse, searchQuery]);

  const clearFilters = () => {
    setSelectedLocalization("");
    setSelectedEtiology("");
    setSelectedCourse("");
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedLocalization || selectedEtiology || selectedCourse || searchQuery;

  // Refetch function for error retry
  const refetch = () => {
    window.location.reload();
  };

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

      {/* Main Content */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-content mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <FilterSidebar
                  availableOptions={availableOptions}
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
                    availableOptions={availableOptions}
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
                  <Button variant="dark-secondary" onClick={refetch}>
                    Try Again
                  </Button>
                </Card>
              )}

              {/* Pathologies Grid */}
              {!loading && !error && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredPathologies.map((pathology) => (
                      <PathologyCard key={pathology.id} pathology={pathology} />
                    ))}
                  </div>

                  {filteredPathologies.length === 0 && (
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
