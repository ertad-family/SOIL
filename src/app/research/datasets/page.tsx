"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/section-label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  ExternalLink,
  Search,
  Database,
  Building2,
  GraduationCap,
  Briefcase,
  BookOpen,
  Filter,
  X,
  Loader2,
  Globe,
  Clock,
  Lock,
  Unlock,
  DollarSign,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Types
type DatasetCategory = "government" | "academic" | "industry" | "qualitative";
type DatasetAccess = "open" | "restricted" | "paid";

interface DatasetCoverage {
  geography?: string[];
  time_period?: string;
  org_types?: string[];
}

interface Dataset {
  id: string;
  name: string;
  slug: string;
  url: string;
  description: string;
  category: DatasetCategory;
  access: DatasetAccess;
  coverage: DatasetCoverage;
  granularity: string | null;
  limitations: string[] | null;
  related_publications: string[] | null;
  compatible_with: string[] | null;
  created_at: string;
  updated_at: string;
}

interface DatasetStats {
  total: number;
  byCategory: { category: DatasetCategory; label: string; count: number }[];
  byAccess: { access: DatasetAccess; label: string; count: number }[];
}

interface DatasetsResponse {
  datasets: Dataset[];
  total: number;
  stats: DatasetStats;
}

// Display labels
const CATEGORY_LABELS: Record<DatasetCategory, string> = {
  government: "Government Registries",
  academic: "Academic Datasets",
  industry: "Industry Sources",
  qualitative: "Qualitative Archives",
};

const ACCESS_LABELS: Record<DatasetAccess, string> = {
  open: "Open Access",
  restricted: "Restricted",
  paid: "Paid",
};

// Helper function to get category icon
function getCategoryIcon(category: DatasetCategory) {
  switch (category) {
    case "government":
      return <Building2 className="w-4 h-4" />;
    case "academic":
      return <GraduationCap className="w-4 h-4" />;
    case "industry":
      return <Briefcase className="w-4 h-4" />;
    case "qualitative":
      return <BookOpen className="w-4 h-4" />;
    default:
      return <Database className="w-4 h-4" />;
  }
}

// Helper function to get access icon and color
function getAccessInfo(access: DatasetAccess) {
  switch (access) {
    case "open":
      return {
        icon: <Unlock className="w-3 h-3" />,
        color: "bg-green-500/20 text-green-400",
        label: "Open Access",
      };
    case "restricted":
      return {
        icon: <Lock className="w-3 h-3" />,
        color: "bg-yellow-500/20 text-yellow-400",
        label: "Restricted",
      };
    case "paid":
      return {
        icon: <DollarSign className="w-3 h-3" />,
        color: "bg-red-500/20 text-red-400",
        label: "Paid",
      };
    default:
      return {
        icon: <Database className="w-3 h-3" />,
        color: "bg-slate-500/20 text-slate-400",
        label: access,
      };
  }
}

// Stats Section Component
function StatsSection({ stats }: { stats: DatasetStats | null }) {
  if (!stats) return null;

  const governmentCount = stats.byCategory.find((c) => c.category === "government")?.count || 0;
  const academicCount = stats.byCategory.find((c) => c.category === "academic")?.count || 0;
  const openCount = stats.byAccess.find((a) => a.access === "open")?.count || 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card variant="dark" padding="md">
        <div className="text-center">
          <span className="font-display text-3xl font-semibold text-gold-400">{stats.total}</span>
          <p className="text-slate-400 text-sm mt-1">Total Datasets</p>
        </div>
      </Card>
      <Card variant="dark" padding="md">
        <div className="text-center">
          <span className="font-display text-3xl font-semibold text-gold-400">
            {governmentCount}
          </span>
          <p className="text-slate-400 text-sm mt-1">Government Registries</p>
        </div>
      </Card>
      <Card variant="dark" padding="md">
        <div className="text-center">
          <span className="font-display text-3xl font-semibold text-gold-400">{academicCount}</span>
          <p className="text-slate-400 text-sm mt-1">Academic Datasets</p>
        </div>
      </Card>
      <Card variant="dark" padding="md">
        <div className="text-center">
          <span className="font-display text-3xl font-semibold text-gold-400">{openCount}</span>
          <p className="text-slate-400 text-sm mt-1">Open Access</p>
        </div>
      </Card>
    </div>
  );
}

// Dataset Card Component
function DatasetCard({ dataset }: { dataset: Dataset }) {
  const [showLimitations, setShowLimitations] = useState(false);
  const accessInfo = getAccessInfo(dataset.access);
  const coverage = dataset.coverage;

  return (
    <Card variant="dark" padding="md" className="h-full">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-400 flex-shrink-0 mt-1">
          {getCategoryIcon(dataset.category)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <a
              href={dataset.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex-1"
            >
              <h3 className="font-display text-base font-medium text-marble-100 group-hover:text-gold-400 transition-colors line-clamp-2">
                {dataset.name}
                <ExternalLink className="w-3 h-3 inline-block ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
            </a>
            <span
              className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded flex-shrink-0 ${accessInfo.color}`}
            >
              {accessInfo.icon}
              {accessInfo.label}
            </span>
          </div>

          <p className="text-slate-400 text-sm mb-3 line-clamp-2">{dataset.description}</p>

          {/* Coverage badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            {coverage.geography && coverage.geography.length > 0 && (
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-slate-700/50 text-slate-400">
                <Globe className="w-3 h-3" />
                {coverage.geography.join(", ")}
              </span>
            )}
            {coverage.time_period && (
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-slate-700/50 text-slate-400">
                <Clock className="w-3 h-3" />
                {coverage.time_period}
              </span>
            )}
            {dataset.granularity && (
              <span className="text-xs px-2 py-0.5 rounded bg-slate-700/50 text-slate-400">
                {dataset.granularity}
              </span>
            )}
          </div>

          {/* Category badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2 py-0.5 rounded bg-gold-500/10 text-gold-400/80">
              {CATEGORY_LABELS[dataset.category]}
            </span>
          </div>

          {/* Limitations (expandable) */}
          {dataset.limitations && dataset.limitations.length > 0 && (
            <div className="border-t border-slate-700/50 pt-3 mt-3">
              <button
                onClick={() => setShowLimitations(!showLimitations)}
                className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-400 transition-colors"
              >
                <AlertTriangle className="w-3 h-3" />
                {dataset.limitations.length} known limitation
                {dataset.limitations.length > 1 ? "s" : ""}
                {showLimitations ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
              {showLimitations && (
                <ul className="mt-2 space-y-1">
                  {dataset.limitations.map((limitation, index) => (
                    <li
                      key={index}
                      className="text-xs text-slate-500 pl-4 relative before:content-['•'] before:absolute before:left-1 before:text-slate-600"
                    >
                      {limitation}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Related publications */}
          {dataset.related_publications && dataset.related_publications.length > 0 && (
            <div className="border-t border-slate-700/50 pt-3 mt-3">
              <p className="text-xs text-slate-500 mb-1">Related publications:</p>
              <ul className="space-y-0.5">
                {dataset.related_publications.slice(0, 2).map((pub, index) => (
                  <li key={index} className="text-xs text-slate-400 line-clamp-1">
                    {pub}
                  </li>
                ))}
                {dataset.related_publications.length > 2 && (
                  <li className="text-xs text-slate-500">
                    +{dataset.related_publications.length - 2} more
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

// Filter Sidebar Component
function FilterSidebar({
  stats,
  selectedCategory,
  selectedAccess,
  onCategoryChange,
  onAccessChange,
}: {
  stats: DatasetStats | null;
  selectedCategory: string;
  selectedAccess: string;
  onCategoryChange: (category: string) => void;
  onAccessChange: (access: string) => void;
}) {
  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h3 className="font-display text-sm font-medium text-marble-100 mb-3 flex items-center gap-2">
          <Database className="w-4 h-4 text-gold-400" />
          Category
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => onCategoryChange("")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !selectedCategory
                ? "bg-gold-500/20 text-gold-400"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            All Categories
          </button>
          {stats.byCategory.map((cat) => (
            <button
              key={cat.category}
              onClick={() => onCategoryChange(cat.category)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                selectedCategory === cat.category
                  ? "bg-gold-500/20 text-gold-400"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              {getCategoryIcon(cat.category)}
              <span className="flex-1">{cat.label}</span>
              <span className="text-slate-500">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Access Filter */}
      <div>
        <h3 className="font-display text-sm font-medium text-marble-100 mb-3 flex items-center gap-2">
          <Filter className="w-4 h-4 text-gold-400" />
          Access Type
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => onAccessChange("")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !selectedAccess ? "bg-gold-500/20 text-gold-400" : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            All Access Types
          </button>
          {stats.byAccess.map((acc) => {
            const accessInfo = getAccessInfo(acc.access);
            return (
              <button
                key={acc.access}
                onClick={() => onAccessChange(acc.access)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  selectedAccess === acc.access
                    ? "bg-gold-500/20 text-gold-400"
                    : "text-slate-400 hover:bg-slate-800"
                }`}
              >
                {accessInfo.icon}
                <span className="flex-1">{acc.label}</span>
                <span className="text-slate-500">({acc.count})</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Main Page Component
export default function DatasetsPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [stats, setStats] = useState<DatasetStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAccess, setSelectedAccess] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch datasets
  const fetchDatasets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (selectedCategory) params.set("category", selectedCategory);
      if (selectedAccess) params.set("access", selectedAccess);
      if (searchQuery) params.set("search", searchQuery);

      const response = await fetch(`/api/datasets?${params}`);
      if (!response.ok) throw new Error("Failed to fetch datasets");

      const data: DatasetsResponse = await response.json();
      setDatasets(data.datasets);
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedAccess, searchQuery]);

  // Initial fetch
  useEffect(() => {
    fetchDatasets();
  }, [fetchDatasets]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDatasets();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchDatasets]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedAccess("");
    setSearchQuery("");
  };

  const hasActiveFilters = selectedCategory || selectedAccess || searchQuery;

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
              <SectionLabel>dataset registry</SectionLabel>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold mt-4 mb-4 text-marble-100">
                Data Sources on Organizational Mortality
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl">
                A curated catalog of datasets covering business demographics, startup failures, and
                organizational mortality from government registries to academic archives.
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
                  selectedCategory={selectedCategory}
                  selectedAccess={selectedAccess}
                  onCategoryChange={setSelectedCategory}
                  onAccessChange={setSelectedAccess}
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
                    placeholder="Search datasets..."
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
                    selectedCategory={selectedCategory}
                    selectedAccess={selectedAccess}
                    onCategoryChange={(c) => {
                      setSelectedCategory(c);
                      setShowFilters(false);
                    }}
                    onAccessChange={(a) => {
                      setSelectedAccess(a);
                      setShowFilters(false);
                    }}
                  />
                </Card>
              )}

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="text-slate-500 text-sm">Active filters:</span>
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gold-500/20 text-gold-400 text-sm">
                      {CATEGORY_LABELS[selectedCategory as DatasetCategory]}
                      <button onClick={() => setSelectedCategory("")}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedAccess && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gold-500/20 text-gold-400 text-sm">
                      {ACCESS_LABELS[selectedAccess as DatasetAccess]}
                      <button onClick={() => setSelectedAccess("")}>
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
                  <Button variant="dark-secondary" onClick={fetchDatasets}>
                    Try Again
                  </Button>
                </Card>
              )}

              {/* Datasets Grid */}
              {!loading && !error && (
                <>
                  <div className="grid gap-4">
                    {datasets.map((dataset) => (
                      <DatasetCard key={dataset.id} dataset={dataset} />
                    ))}
                  </div>

                  {datasets.length === 0 && (
                    <Card variant="dark" padding="lg" className="text-center">
                      <p className="text-slate-400">No datasets found matching your criteria.</p>
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
            Know a Dataset We Missed?
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-8">
            Help us build the most comprehensive registry of organizational mortality data sources.
            Contact us to suggest a dataset for inclusion.
          </p>
          <a href="mailto:research@soil.rip">
            <Button variant="dark-primary" size="lg">
              Suggest a Dataset
            </Button>
          </a>
        </div>
      </section>
    </>
  );
}
