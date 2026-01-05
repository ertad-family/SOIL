"use client";

import { useState, useEffect } from "react";
import {
  X,
  ExternalLink,
  BookOpen,
  Users,
  Loader2,
  GraduationCap,
  Quote,
  Award,
} from "lucide-react";

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
}

interface Connection {
  id: string;
  researcher_a_id: string;
  researcher_b_id: string;
  connection_type: string;
  label: string | null;
}

interface Publication {
  key: string;
  title: string;
  date: string | null;
  itemType: string;
  coauthors: string[];
  doi: string | null;
  url: string | null;
  publicationTitle: string | null;
}

interface OpenAlexData {
  openalex_id: string | null;
  works_count: number;
  cited_by_count: number;
  h_index: number | null;
  i10_index: number | null;
  top_concepts: string[];
  profile_url: string | null;
}

interface ResearcherDetailPanelProps {
  researcher: Researcher;
  connections: Connection[];
  allResearchers: Researcher[];
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

// Connection type labels
const CONNECTION_LABELS: Record<string, string> = {
  coauthor: "Co-author",
  cofounder: "Co-founder",
  colleague: "Colleague",
  influence: "Influence",
  thematic: "Thematic",
  advisor: "Advisor",
};

export function ResearcherDetailPanel({
  researcher,
  connections,
  allResearchers,
  onClose,
  onSelectResearcher,
}: ResearcherDetailPanelProps) {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loadingPubs, setLoadingPubs] = useState(false);
  const [showAllPubs, setShowAllPubs] = useState(false);
  const [openAlexData, setOpenAlexData] = useState<OpenAlexData | null>(null);
  const [loadingOpenAlex, setLoadingOpenAlex] = useState(false);

  const config = DISCIPLINE_CONFIG[researcher.discipline] || {
    label: researcher.discipline,
    color: "bg-slate-500/20 text-slate-400",
  };

  // Get connected researchers
  const connectedResearchers = connections
    .map((conn) => {
      const otherId =
        conn.researcher_a_id === researcher.id ? conn.researcher_b_id : conn.researcher_a_id;
      const other = allResearchers.find((r) => r.id === otherId);
      return other ? { ...conn, researcher: other } : null;
    })
    .filter(Boolean) as (Connection & { researcher: Researcher })[];

  // Fetch publications and OpenAlex data when researcher changes
  useEffect(() => {
    async function fetchPublications() {
      setLoadingPubs(true);
      try {
        const response = await fetch(`/api/researchers/${researcher.id}/publications`);
        if (response.ok) {
          const data = await response.json();
          setPublications(data.publications || []);
        }
      } catch (error) {
        console.error("Failed to fetch publications:", error);
      } finally {
        setLoadingPubs(false);
      }
    }

    async function fetchOpenAlexData() {
      setLoadingOpenAlex(true);
      try {
        const response = await fetch(`/api/researchers/${researcher.id}/openalex`);
        if (response.ok) {
          const result = await response.json();
          if (result.matched) {
            setOpenAlexData(result.data);
          } else {
            setOpenAlexData(null);
          }
        }
      } catch (error) {
        console.error("Failed to fetch OpenAlex data:", error);
      } finally {
        setLoadingOpenAlex(false);
      }
    }

    fetchPublications();
    fetchOpenAlexData();
  }, [researcher.id]);

  const displayedPubs = showAllPubs ? publications : publications.slice(0, 5);

  return (
    <div className="w-96 bg-slate-900 border-l border-slate-700 overflow-y-auto h-full">
      {/* Header */}
      <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 p-4 z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-400 flex-shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-lg font-medium text-marble-100 truncate">
                {researcher.name}
                {researcher.death_year && (
                  <span className="text-slate-500 font-normal ml-1.5">
                    ({researcher.birth_year || "?"}–{researcher.death_year})
                  </span>
                )}
              </h2>
              <p className="text-slate-400 text-sm truncate">{researcher.institution}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Discipline badge */}
        <div className="flex items-center gap-2 mt-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}
          >
            {config.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Bio */}
        {researcher.bio && (
          <div>
            <p className="text-slate-400 text-sm leading-relaxed">{researcher.bio}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="text-2xl font-display font-semibold text-gold-400">
              {researcher.publication_count}
            </div>
            <div className="text-xs text-slate-500">In Bibliography</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="text-2xl font-display font-semibold text-gold-400">
              {connectedResearchers.length}
            </div>
            <div className="text-xs text-slate-500">Connections</div>
          </div>
        </div>

        {/* OpenAlex Academic Metrics */}
        {loadingOpenAlex ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-5 h-5 text-slate-500 animate-spin" />
            <span className="ml-2 text-slate-500 text-sm">Loading academic metrics...</span>
          </div>
        ) : openAlexData && openAlexData.cited_by_count > 0 ? (
          <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Academic Impact (OpenAlex)
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-lg font-display font-semibold text-gold-400">
                  {openAlexData.cited_by_count.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">Citations</div>
              </div>
              {openAlexData.h_index !== null && (
                <div>
                  <div className="text-lg font-display font-semibold text-gold-400">
                    {openAlexData.h_index}
                  </div>
                  <div className="text-xs text-slate-500">h-index</div>
                </div>
              )}
              <div>
                <div className="text-lg font-display font-semibold text-gold-400">
                  {openAlexData.works_count.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">Total Works</div>
              </div>
            </div>
            {openAlexData.profile_url && (
              <a
                href={openAlexData.profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 mt-3"
              >
                View on OpenAlex
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        ) : null}

        {/* Publications */}
        <div>
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Publications in Bibliography
          </h3>

          {loadingPubs ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-gold-400 animate-spin" />
            </div>
          ) : publications.length === 0 ? (
            <p className="text-slate-500 text-sm">No publications found in bibliography</p>
          ) : (
            <div className="space-y-2">
              {displayedPubs.map((pub) => (
                <a
                  key={pub.key}
                  href={
                    pub.doi
                      ? `https://doi.org/${pub.doi}`
                      : pub.url ||
                        `https://www.zotero.org/groups/studies_of_organizational_illness_and_loss/items/${pub.key}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors group"
                >
                  <div className="text-sm text-marble-100 line-clamp-2 group-hover:text-gold-400 transition-colors">
                    {pub.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {pub.date && (
                      <span className="text-xs text-slate-500">{pub.date.slice(0, 4)}</span>
                    )}
                    {pub.coauthors.length > 0 && (
                      <span className="text-xs text-slate-500">
                        with {pub.coauthors.slice(0, 2).join(", ")}
                        {pub.coauthors.length > 2 && ` +${pub.coauthors.length - 2}`}
                      </span>
                    )}
                  </div>
                </a>
              ))}

              {publications.length > 5 && (
                <button
                  onClick={() => setShowAllPubs(!showAllPubs)}
                  className="w-full text-sm text-gold-400 hover:text-gold-300 py-2"
                >
                  {showAllPubs ? "Show less" : `Show all ${publications.length} publications`}
                </button>
              )}
            </div>
          )}

          {publications.length > 0 && (
            <a
              href={`https://www.zotero.org/groups/studies_of_organizational_illness_and_loss/items?q=${encodeURIComponent(researcher.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-gold-400 hover:text-gold-300 mt-3"
            >
              View in Zotero Library
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Connections */}
        {connectedResearchers.length > 0 && (
          <div>
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Connections ({connectedResearchers.length})
            </h3>
            <div className="space-y-2">
              {connectedResearchers.map((conn) => {
                const connConfig = DISCIPLINE_CONFIG[conn.researcher.discipline] || {
                  label: conn.researcher.discipline,
                  color: "bg-slate-500/20 text-slate-400",
                };

                return (
                  <button
                    key={conn.id}
                    onClick={() => onSelectResearcher(conn.researcher.id)}
                    className="w-full p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-400 flex-shrink-0">
                        <span className="text-xs font-medium">
                          {conn.researcher.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-marble-100 group-hover:text-gold-400 transition-colors truncate">
                          {conn.researcher.name}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">
                            {CONNECTION_LABELS[conn.connection_type] || conn.connection_type}
                          </span>
                          {conn.label && (
                            <>
                              <span className="text-slate-600">·</span>
                              <span className="text-xs text-slate-500 truncate">{conn.label}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* External link */}
        {researcher.website_url && (
          <div className="pt-4 border-t border-slate-700">
            <a
              href={researcher.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-gold-400 hover:text-gold-300"
            >
              View External Profile
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
