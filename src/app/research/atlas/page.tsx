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
  Users,
  GraduationCap,
  Filter,
  Loader2,
  BookOpen,
  Microscope,
  Brain,
  Network,
  FlaskConical,
  Globe,
  Building2,
} from "lucide-react";

// Types
interface Researcher {
  id: string;
  name: string;
  institution: string;
  discipline: string;
  tier: number;
  bio: string | null;
  key_works: string[] | null;
  soil_relevance: string | null;
  website_url: string | null;
  consent_status: "pending" | "opted_in" | "declined";
}

interface DisciplineCount {
  discipline: string;
  label: string;
  count: number;
}

interface ResearchersResponse {
  researchers: Researcher[];
  total: number;
  disciplines: DisciplineCount[];
}

// Discipline display config
const DISCIPLINE_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  biology: {
    label: "Biology",
    icon: <FlaskConical className="w-4 h-4" />,
    color: "bg-green-500/20 text-green-400",
  },
  ecology: {
    label: "Ecology",
    icon: <Globe className="w-4 h-4" />,
    color: "bg-emerald-500/20 text-emerald-400",
  },
  economics: {
    label: "Economics",
    icon: <Building2 className="w-4 h-4" />,
    color: "bg-amber-500/20 text-amber-400",
  },
  sociology: {
    label: "Sociology",
    icon: <Users className="w-4 h-4" />,
    color: "bg-purple-500/20 text-purple-400",
  },
  psychology: {
    label: "Psychology",
    icon: <Brain className="w-4 h-4" />,
    color: "bg-pink-500/20 text-pink-400",
  },
  political_science: {
    label: "Political Science",
    icon: <Building2 className="w-4 h-4" />,
    color: "bg-red-500/20 text-red-400",
  },
  anthropology: {
    label: "Anthropology",
    icon: <Users className="w-4 h-4" />,
    color: "bg-orange-500/20 text-orange-400",
  },
  cybernetics: {
    label: "Cybernetics",
    icon: <Network className="w-4 h-4" />,
    color: "bg-cyan-500/20 text-cyan-400",
  },
  systems_theory: {
    label: "Systems Theory",
    icon: <Network className="w-4 h-4" />,
    color: "bg-blue-500/20 text-blue-400",
  },
  information_theory: {
    label: "Information Theory",
    icon: <Network className="w-4 h-4" />,
    color: "bg-indigo-500/20 text-indigo-400",
  },
  evolutionary_theory: {
    label: "Evolutionary Theory",
    icon: <Microscope className="w-4 h-4" />,
    color: "bg-teal-500/20 text-teal-400",
  },
  medicine: {
    label: "Medicine",
    icon: <Microscope className="w-4 h-4" />,
    color: "bg-rose-500/20 text-rose-400",
  },
};

// Stats Section Component
function StatsSection({ total, disciplines }: { total: number; disciplines: DisciplineCount[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card variant="dark" padding="md">
        <div className="text-center">
          <span className="font-display text-3xl font-semibold text-gold-400">{total}</span>
          <p className="text-slate-400 text-sm mt-1">Researchers</p>
        </div>
      </Card>
      <Card variant="dark" padding="md">
        <div className="text-center">
          <span className="font-display text-3xl font-semibold text-gold-400">
            {disciplines.length}
          </span>
          <p className="text-slate-400 text-sm mt-1">Disciplines</p>
        </div>
      </Card>
      <Card variant="dark" padding="md">
        <div className="text-center">
          <span className="font-display text-3xl font-semibold text-gold-400">12</span>
          <p className="text-slate-400 text-sm mt-1">Lenses Framework</p>
        </div>
      </Card>
      <Card variant="dark" padding="md">
        <div className="text-center">
          <span className="font-display text-3xl font-semibold text-gold-400">5</span>
          <p className="text-slate-400 text-sm mt-1">Priority Disciplines</p>
        </div>
      </Card>
    </div>
  );
}

// Researcher Card Component
function ResearcherCard({ researcher }: { researcher: Researcher }) {
  const config = DISCIPLINE_CONFIG[researcher.discipline] || {
    label: researcher.discipline,
    icon: <GraduationCap className="w-4 h-4" />,
    color: "bg-slate-500/20 text-slate-400",
  };

  return (
    <Card variant="dark" padding="md" className="h-full">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-400 flex-shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-medium text-marble-100 line-clamp-1">
              {researcher.name}
            </h3>
            <p className="text-slate-400 text-sm line-clamp-1">{researcher.institution}</p>
          </div>
        </div>

        {/* Discipline Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}
          >
            {config.icon}
            {config.label}
          </span>
          {researcher.tier === 1 && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-gold-500/20 text-gold-400">
              Tier 1
            </span>
          )}
        </div>

        {/* Bio */}
        {researcher.bio && (
          <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
            {researcher.bio}
          </p>
        )}

        {/* Key Works */}
        {researcher.key_works && researcher.key_works.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
              Key Works
            </h4>
            <ul className="space-y-1">
              {researcher.key_works.slice(0, 2).map((work, idx) => (
                <li key={idx} className="text-sm text-slate-400 flex items-start gap-2">
                  <BookOpen className="w-3 h-3 mt-1 flex-shrink-0 text-slate-500" />
                  <span className="line-clamp-1">{work}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* SOIL Relevance */}
        {researcher.soil_relevance && (
          <div className="mb-4 flex-1">
            <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
              SOIL Relevance
            </h4>
            <p className="text-sm text-slate-400 line-clamp-2">{researcher.soil_relevance}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-slate-700/50">
          {researcher.website_url ? (
            <a
              href={researcher.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-gold-400 hover:text-gold-300 transition-colors"
            >
              View Profile
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="text-sm text-slate-500">Profile coming soon</span>
          )}
        </div>
      </div>
    </Card>
  );
}

// Discipline Filter Component
function DisciplineFilter({
  disciplines,
  selected,
  onChange,
}: {
  disciplines: DisciplineCount[];
  selected: string;
  onChange: (discipline: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onChange("all")}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          selected === "all"
            ? "bg-gold-500/20 text-gold-400"
            : "bg-slate-800 text-slate-400 hover:bg-slate-700"
        }`}
      >
        All ({disciplines.reduce((sum, d) => sum + d.count, 0)})
      </button>
      {disciplines.map((d) => {
        const config = DISCIPLINE_CONFIG[d.discipline];
        return (
          <button
            key={d.discipline}
            onClick={() => onChange(d.discipline)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selected === d.discipline
                ? "bg-gold-500/20 text-gold-400"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            {config?.label || d.label} ({d.count})
          </button>
        );
      })}
    </div>
  );
}

// Main Atlas Page
export default function AtlasPage() {
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [disciplines, setDisciplines] = useState<DisciplineCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch researchers
  const fetchResearchers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (selectedDiscipline !== "all") {
        params.set("discipline", selectedDiscipline);
      }
      if (searchQuery) {
        params.set("search", searchQuery);
      }

      const response = await fetch(`/api/researchers?${params}`);
      if (!response.ok) throw new Error("Failed to fetch researchers");

      const data: ResearchersResponse = await response.json();
      setResearchers(data.researchers);
      setDisciplines(data.disciplines);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [selectedDiscipline, searchQuery]);

  // Initial fetch and when filters change
  useEffect(() => {
    fetchResearchers();
  }, [fetchResearchers]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResearchers();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchResearchers]);

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
              <SectionLabel>research atlas</SectionLabel>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold mt-4 mb-4 text-marble-100">
                Academic Landscape
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl">
                Explore the researchers shaping our understanding of organizational mortality. The
                Atlas maps scholars across 12 disciplines who contribute to this emerging field.
              </p>
            </div>

            <div className="flex-shrink-0 animate-fade-in-up stagger-1">
              <a href="mailto:research@soil.rip">
                <Button
                  variant="dark-primary"
                  size="lg"
                  rightIcon={<ExternalLink className="w-4 h-4" />}
                >
                  Join the Atlas
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Opt-in Notice */}
      <section className="pb-8">
        <div className="max-w-content mx-auto px-6">
          <Card variant="dark" padding="md" className="border-gold-500/30">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-medium text-marble-100 mb-1">
                  Opt-in Research Community
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  The Research Atlas includes profiles only with researcher consent. If you work in
                  organizational mortality research and would like to be featured, please contact us
                  at{" "}
                  <a href="mailto:research@soil.rip" className="text-gold-400 hover:text-gold-300">
                    research@soil.rip
                  </a>
                  .
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="pb-8">
        <div className="max-w-content mx-auto px-6">
          <StatsSection total={researchers.length} disciplines={disciplines} />
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-content mx-auto px-6">
          {/* Search and Filter */}
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                type="text"
                placeholder="Search researchers..."
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

          {/* Discipline Filters */}
          <div className={showFilters ? "block lg:block" : "hidden lg:block"}>
            <DisciplineFilter
              disciplines={disciplines}
              selected={selectedDiscipline}
              onChange={setSelectedDiscipline}
            />
          </div>

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
              <Button variant="dark-secondary" onClick={fetchResearchers}>
                Try Again
              </Button>
            </Card>
          )}

          {/* Researchers Grid */}
          {!loading && !error && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {researchers.map((researcher) => (
                  <ResearcherCard key={researcher.id} researcher={researcher} />
                ))}
              </div>

              {researchers.length === 0 && (
                <Card variant="dark" padding="lg" className="text-center">
                  <p className="text-slate-400">No researchers found matching your criteria.</p>
                </Card>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-slate-900/50">
        <div className="max-w-content mx-auto px-6 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-medium mb-4 text-marble-100">
            Contribute to the Atlas
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-8">
            Are you a researcher working on organizational mortality, entrepreneurial failure, or
            related topics? Join our growing network of academics building the foundation for
            Organizational Medicine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:research@soil.rip">
              <Button variant="dark-primary" size="lg">
                Request Inclusion
              </Button>
            </a>
            <Link href="/research/bibliography">
              <Button
                variant="dark-secondary"
                size="lg"
                rightIcon={<BookOpen className="w-4 h-4" />}
              >
                Browse Bibliography
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
