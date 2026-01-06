"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/section-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ExternalLink, Search, Users, Filter, Loader2, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  ResearcherNetworkGraph,
  GraphLegend,
  GraphNode,
  GraphEdge,
} from "@/components/research/ResearcherNetworkGraph";
import { ResearcherDetailPanel } from "@/components/research/ResearcherDetailPanel";
import { UniversityDetailPanel } from "@/components/research/UniversityDetailPanel";
import { siteConfig, mailtoLink } from "@/lib/site-config";

// Types from API
interface Researcher {
  id: string;
  name: string;
  institution: string;
  discipline: string;
  bio: string | null;
  website_url: string | null;
  publication_count: number;
  zotero_creator_name: string | null;
  birth_year: number | null;
  death_year: number | null;
  openalex_works_count: number;
  openalex_cited_by_count: number;
  university_id: string | null;
  parent_university_name: string | null; // For clustering sub-units with parent
}

interface Connection {
  id: string;
  researcher_a_id: string;
  researcher_b_id: string;
  connection_type: string;
  label: string | null;
  is_auto_detected: boolean;
}

interface DisciplineCount {
  discipline: string;
  label: string;
  count: number;
}

interface ResearchersResponse {
  researchers: Researcher[];
  connections?: Connection[];
  total: number;
  disciplines: DisciplineCount[];
}

// Discipline filter config
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
    <div className="flex flex-wrap gap-2">
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

// Sync result type
interface SyncResult {
  success: boolean;
  summary?: {
    totalItems: number;
    uniqueAuthors: number;
    newResearchers: number;
    updatedResearchers: number;
    deletedResearchers: number;
    coauthorConnections: number;
    errors: number;
  };
  error?: string;
}

// Main Atlas Page
export default function AtlasPage() {
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [disciplines, setDisciplines] = useState<DisciplineCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);

  // Multi-select disciplines for legend filtering
  const [selectedDisciplines, setSelectedDisciplines] = useState<Set<string>>(new Set());

  // Admin sync state
  const [isAdmin, setIsAdmin] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);

  // Fetch researchers with connections
  const fetchResearchers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/researchers?include=connections");
      if (!response.ok) throw new Error("Failed to fetch researchers");

      const data: ResearchersResponse = await response.json();
      setResearchers(data.researchers);
      setConnections(data.connections || []);
      setDisciplines(data.disciplines);
      // Initialize all disciplines as selected
      setSelectedDisciplines(new Set(data.disciplines.map((d) => d.discipline)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchResearchers();
  }, [fetchResearchers]);

  // Check if user is admin
  useEffect(() => {
    async function checkAdminRole() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        setIsAdmin(profile?.role === "admin");
      }
    }

    checkAdminRole();
  }, []);

  // Sync from Zotero
  const handleSync = async () => {
    setSyncing(true);
    setSyncResult(null);

    try {
      const response = await fetch("/api/researchers/sync-from-zotero", {
        method: "POST",
      });

      const result: SyncResult = await response.json();
      setSyncResult(result);

      // Refresh data if sync was successful
      if (result.success) {
        await fetchResearchers();
      }
    } catch (err) {
      setSyncResult({
        success: false,
        error: err instanceof Error ? err.message : "Sync failed",
      });
    } finally {
      setSyncing(false);
    }
  };

  // Convert to graph nodes (filter by search)
  const graphNodes: GraphNode[] = useMemo(() => {
    let filtered = researchers;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) => r.name.toLowerCase().includes(query) || r.institution.toLowerCase().includes(query)
      );
    }

    return filtered.map((r) => ({
      id: r.id,
      name: r.name,
      institution: r.institution,
      parentUniversityName: r.parent_university_name, // For clustering sub-units with parent
      discipline: r.discipline,
      publicationCount: r.publication_count,
      citedByCount: r.openalex_cited_by_count,
      x: 0, // Will be calculated by the component
      y: 0,
    }));
  }, [researchers, searchQuery]);

  // Convert to graph edges
  const graphEdges: GraphEdge[] = useMemo(() => {
    return connections.map((c) => ({
      id: c.id,
      source: c.researcher_a_id,
      target: c.researcher_b_id,
      type: c.connection_type,
      label: c.label,
    }));
  }, [connections]);

  // Get selected researcher
  const selectedResearcher = useMemo(() => {
    return researchers.find((r) => r.id === selectedNodeId) || null;
  }, [researchers, selectedNodeId]);

  // Get connections for selected researcher
  const selectedConnections = useMemo(() => {
    if (!selectedNodeId) return [];
    return connections.filter(
      (c) => c.researcher_a_id === selectedNodeId || c.researcher_b_id === selectedNodeId
    );
  }, [connections, selectedNodeId]);

  // Legend disciplines
  const legendDisciplines = useMemo(() => {
    return disciplines.map((d) => ({
      key: d.discipline,
      label: DISCIPLINE_CONFIG[d.discipline]?.label || d.label,
    }));
  }, [disciplines]);

  // Discipline legend handlers
  const handleDisciplineToggle = useCallback((discipline: string) => {
    setSelectedDisciplines((prev) => {
      const next = new Set(prev);
      if (next.has(discipline)) {
        next.delete(discipline);
      } else {
        next.add(discipline);
      }
      return next;
    });
  }, []);

  const handleSelectAllDisciplines = useCallback(() => {
    setSelectedDisciplines(new Set(disciplines.map((d) => d.discipline)));
  }, [disciplines]);

  const handleSelectNoneDisciplines = useCallback(() => {
    setSelectedDisciplines(new Set());
  }, []);

  // Handle researcher selection (clears university selection)
  const handleResearcherSelect = useCallback((nodeId: string | null) => {
    setSelectedNodeId(nodeId);
    if (nodeId) {
      setSelectedUniversity(null); // Clear university when researcher selected
    }
  }, []);

  // Handle university selection (clears researcher selection)
  const handleUniversitySelect = useCallback((name: string | null) => {
    setSelectedUniversity(name);
    if (name) {
      setSelectedNodeId(null); // Clear researcher when university selected
    }
  }, []);

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)]">
      {/* Header Section */}
      <section className="py-6 px-6 border-b border-slate-800">
        <div className="max-w-content mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <Link
                href="/research"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-gold-400 transition-colors mb-3"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Research Hub
              </Link>
              <div className="flex items-center gap-4">
                <div>
                  <SectionLabel>research atlas</SectionLabel>
                  <h1 className="font-display text-2xl md:text-3xl font-semibold mt-2 text-marble-100">
                    Academic Network
                  </h1>
                </div>
                <a href={`mailto:${siteConfig.emails.research}`}>
                  <Button
                    variant="dark-secondary"
                    size="sm"
                    rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                  >
                    Join the Atlas
                  </Button>
                </a>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-3 items-center">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  type="text"
                  placeholder="Search researchers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>
              <Button
                variant="dark-secondary"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>

              {/* Admin Sync Button */}
              {isAdmin && (
                <Button variant="dark-secondary" size="sm" onClick={handleSync} disabled={syncing}>
                  {syncing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Sync
                </Button>
              )}
            </div>
          </div>

          {/* Discipline Filters (collapsible) */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-800">
              <DisciplineFilter
                disciplines={disciplines}
                selected={selectedDiscipline}
                onChange={setSelectedDiscipline}
              />
            </div>
          )}

          {/* Sync Result Notification */}
          {syncResult && (
            <div
              className={`mt-4 p-3 rounded-lg border ${
                syncResult.success
                  ? "bg-green-900/20 border-green-700/50 text-green-400"
                  : "bg-red-900/20 border-red-700/50 text-red-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  {syncResult.success && syncResult.summary ? (
                    <p className="text-sm">
                      Synced: {syncResult.summary.totalItems} items | +
                      {syncResult.summary.newResearchers} new |{" "}
                      {syncResult.summary.updatedResearchers} updated |{" "}
                      {syncResult.summary.deletedResearchers > 0 && (
                        <span className="text-red-400">
                          -{syncResult.summary.deletedResearchers} deleted |{" "}
                        </span>
                      )}
                      {syncResult.summary.coauthorConnections} connections
                      {syncResult.summary.errors > 0 && (
                        <span className="text-amber-400 ml-2">
                          ({syncResult.summary.errors} errors)
                        </span>
                      )}
                    </p>
                  ) : (
                    <p className="text-sm">Sync failed: {syncResult.error}</p>
                  )}
                </div>
                <button
                  onClick={() => setSyncResult(null)}
                  className="text-slate-400 hover:text-slate-200 text-sm"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Opt-in Notice */}
      <div className="px-6 py-3 bg-slate-800/30 border-b border-slate-800">
        <div className="max-w-content mx-auto flex items-center gap-3 text-sm">
          <Users className="w-4 h-4 text-gold-400 flex-shrink-0" />
          <p className="text-slate-400">
            The Research Atlas displays publicly available information about researchers in the
            organizational mortality field extracted from our{" "}
            <Link href="/research/bibliography" className="text-gold-400 hover:text-gold-300">
              bibliography
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Main Content: Graph + Detail Panel */}
      <div className="flex h-[600px] lg:h-[700px] overflow-hidden">
        {/* Graph Container */}
        <div className="flex-1 relative bg-slate-900/50">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <Button variant="dark-secondary" onClick={fetchResearchers}>
                  Try Again
                </Button>
              </div>
            </div>
          ) : graphNodes.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-slate-400">No researchers found matching your criteria.</p>
            </div>
          ) : (
            <>
              <ResearcherNetworkGraph
                nodes={graphNodes}
                edges={graphEdges}
                selectedNodeId={selectedNodeId}
                hoveredNodeId={hoveredNodeId}
                selectedUniversity={selectedUniversity}
                filter={selectedDiscipline}
                selectedDisciplines={selectedDisciplines}
                onNodeSelect={handleResearcherSelect}
                onNodeHover={setHoveredNodeId}
                onUniversitySelect={handleUniversitySelect}
              />
              <GraphLegend
                disciplines={legendDisciplines}
                selectedDisciplines={selectedDisciplines}
                onDisciplineToggle={handleDisciplineToggle}
                onSelectAll={handleSelectAllDisciplines}
                onSelectNone={handleSelectNoneDisciplines}
              />

              {/* Stats overlay */}
              <div className="absolute top-4 right-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 text-xs border border-slate-700">
                <div className="flex gap-6">
                  <div>
                    <div className="text-lg font-display font-semibold text-gold-400">
                      {researchers.length}
                    </div>
                    <div className="text-slate-400">Researchers</div>
                  </div>
                  <div>
                    <div className="text-lg font-display font-semibold text-gold-400">
                      {connections.length}
                    </div>
                    <div className="text-slate-400">Connections</div>
                  </div>
                  <div>
                    <div className="text-lg font-display font-semibold text-gold-400">
                      {disciplines.length}
                    </div>
                    <div className="text-slate-400">Disciplines</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Detail Panel (shows when researcher or university selected) */}
        {selectedResearcher && (
          <ResearcherDetailPanel
            researcher={selectedResearcher}
            connections={selectedConnections}
            allResearchers={researchers}
            onClose={() => handleResearcherSelect(null)}
            onSelectResearcher={handleResearcherSelect}
          />
        )}
        {selectedUniversity && !selectedResearcher && (
          <UniversityDetailPanel
            universityName={selectedUniversity}
            researchers={researchers}
            onClose={() => handleUniversitySelect(null)}
            onSelectResearcher={handleResearcherSelect}
          />
        )}
      </div>

      {/* Roman Divider */}
      <div className="divider-roman py-12 md:py-16">
        <span className="text-gold-400 font-serif text-sm tracking-[0.3em] px-6">✦</span>
      </div>

      {/* About Section */}
      <section className="py-12 md:py-16 px-6">
        <div className="max-w-content mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-medium text-marble-100 mb-4">
                About the Research Atlas
              </h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                The Research Atlas visualizes the network of scholars working on organizational
                mortality. Each node represents a researcher whose work appears in our bibliography,
                with connections based on co-authorship and thematic relationships.
              </p>
              <p className="text-slate-400 leading-relaxed">
                This is an opt-in directory. If you&apos;re a researcher in this field and would
                like to be included or update your information, please contact us.
              </p>
            </div>
            <div className="space-y-6">
              <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <h3 className="font-display text-lg font-medium text-marble-100 mb-2">
                  Data Sources
                </h3>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-gold-400 mt-1">•</span>
                    <span>Publication data from SOIL Bibliography (Zotero)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold-400 mt-1">•</span>
                    <span>Citation metrics from OpenAlex</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold-400 mt-1">•</span>
                    <span>Biographical data from Wikidata</span>
                  </li>
                </ul>
              </div>
              <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <h3 className="font-display text-lg font-medium text-marble-100 mb-2">
                  Request Updates
                </h3>
                <p className="text-slate-400 text-sm mb-3">
                  To add, update, or remove your profile from the Atlas:
                </p>
                <a
                  href={mailtoLink("research", "Research Atlas Update Request")}
                  className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors text-sm"
                >
                  {siteConfig.emails.research}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
