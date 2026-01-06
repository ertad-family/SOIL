"use client";

import { useMemo } from "react";
import { X, Users, BookOpen, GraduationCap, Quote, Building2 } from "lucide-react";

// Types
interface Researcher {
  id: string;
  name: string;
  institution: string;
  discipline: string;
  bio: string | null;
  website_url: string | null;
  publication_count: number;
  birth_year?: number | null;
  death_year?: number | null;
  openalex_works_count: number;
  openalex_cited_by_count: number;
  university_id: string | null;
  parent_university_name: string | null;
}

interface UniversityDetailPanelProps {
  universityName: string;
  researchers: Researcher[];
  onClose: () => void;
  onSelectResearcher: (id: string) => void;
}

// Discipline display config
const DISCIPLINE_CONFIG: Record<string, { label: string; color: string }> = {
  biology: { label: "Biology", color: "bg-green-500/20 text-green-400" },
  ecology: { label: "Ecology", color: "bg-emerald-500/20 text-emerald-400" },
  economics: { label: "Economics", color: "bg-amber-500/20 text-amber-400" },
  sociology: { label: "Sociology", color: "bg-purple-500/20 text-purple-400" },
  psychology: { label: "Psychology", color: "bg-pink-500/20 text-pink-400" },
  political_science: { label: "Political Science", color: "bg-red-500/20 text-red-400" },
  anthropology: { label: "Anthropology", color: "bg-orange-500/20 text-orange-400" },
  cybernetics: { label: "Cybernetics", color: "bg-cyan-500/20 text-cyan-400" },
  systems_theory: { label: "Systems Theory", color: "bg-blue-500/20 text-blue-400" },
  information_theory: { label: "Information Theory", color: "bg-indigo-500/20 text-indigo-400" },
  evolutionary_theory: { label: "Evolutionary Theory", color: "bg-teal-500/20 text-teal-400" },
  medicine: { label: "Medicine", color: "bg-rose-500/20 text-rose-400" },
};

// Format large numbers
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

export function UniversityDetailPanel({
  universityName,
  researchers,
  onClose,
  onSelectResearcher,
}: UniversityDetailPanelProps) {
  // Filter researchers belonging to this university (by parent_university_name or institution)
  const universityResearchers = useMemo(() => {
    return researchers
      .filter(
        (r) => r.parent_university_name === universityName || r.institution === universityName
      )
      .sort((a, b) => b.openalex_cited_by_count - a.openalex_cited_by_count);
  }, [researchers, universityName]);

  // Calculate aggregate stats
  const stats = useMemo(() => {
    const totalPublications = universityResearchers.reduce(
      (sum, r) => sum + r.publication_count,
      0
    );
    const totalCitations = universityResearchers.reduce(
      (sum, r) => sum + r.openalex_cited_by_count,
      0
    );
    const disciplines = new Set(universityResearchers.map((r) => r.discipline));
    return {
      researcherCount: universityResearchers.length,
      totalPublications,
      totalCitations,
      disciplineCount: disciplines.size,
    };
  }, [universityResearchers]);

  // Get discipline breakdown
  const disciplineBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    universityResearchers.forEach((r) => {
      counts[r.discipline] = (counts[r.discipline] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([discipline, count]) => ({ discipline, count }))
      .sort((a, b) => b.count - a.count);
  }, [universityResearchers]);

  return (
    <div className="w-96 bg-slate-900 border-l border-slate-700 overflow-y-auto h-full">
      {/* Header */}
      <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 p-4 z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-lg font-medium text-marble-100 leading-tight">
                {universityName}
              </h2>
              <p className="text-slate-400 text-sm mt-1">Academic Institution</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-slate-500">Researchers</span>
            </div>
            <div className="text-2xl font-display font-semibold text-gold-400">
              {stats.researcherCount}
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-slate-500">Publications</span>
            </div>
            <div className="text-2xl font-display font-semibold text-gold-400">
              {stats.totalPublications}
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Quote className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-slate-500">Total Citations</span>
            </div>
            <div className="text-2xl font-display font-semibold text-gold-400">
              {formatNumber(stats.totalCitations)}
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-slate-500">Disciplines</span>
            </div>
            <div className="text-2xl font-display font-semibold text-gold-400">
              {stats.disciplineCount}
            </div>
          </div>
        </div>

        {/* Discipline Breakdown */}
        {disciplineBreakdown.length > 0 && (
          <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
              Disciplines
            </h3>
            <div className="flex flex-wrap gap-2">
              {disciplineBreakdown.map(({ discipline, count }) => {
                const config = DISCIPLINE_CONFIG[discipline] || {
                  label: discipline,
                  color: "bg-slate-500/20 text-slate-400",
                };
                return (
                  <span
                    key={discipline}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
                  >
                    {config.label}
                    <span className="opacity-60">({count})</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Researchers List */}
        <div>
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Researchers ({universityResearchers.length})
          </h3>
          <div className="space-y-2">
            {universityResearchers.map((researcher) => {
              const config = DISCIPLINE_CONFIG[researcher.discipline] || {
                label: researcher.discipline,
                color: "bg-slate-500/20 text-slate-400",
              };

              return (
                <button
                  key={researcher.id}
                  onClick={() => onSelectResearcher(researcher.id)}
                  className="w-full p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-400 flex-shrink-0">
                      <span className="text-xs font-medium">
                        {researcher.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-marble-100 group-hover:text-gold-400 transition-colors truncate">
                        {researcher.name}
                        {researcher.death_year && (
                          <span className="text-slate-500 font-normal ml-1.5">
                            ({researcher.birth_year || "?"}–{researcher.death_year})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${config.color}`}
                        >
                          {config.label}
                        </span>
                        {researcher.openalex_cited_by_count > 0 && (
                          <span className="text-xs text-slate-500">
                            {formatNumber(researcher.openalex_cited_by_count)} citations
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
