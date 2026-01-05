"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/section-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ExternalLink, Search, Users, Filter, Loader2 } from "lucide-react";
import {
  ResearcherNetworkGraph,
  GraphLegend,
  GraphNode,
  GraphEdge,
} from "@/components/research/ResearcherNetworkGraph";
import { ResearcherDetailPanel } from "@/components/research/ResearcherDetailPanel";

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
      discipline: r.discipline,
      publicationCount: r.publication_count,
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

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
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
                <a href="mailto:research@soil.rip">
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
        </div>
      </section>

      {/* Opt-in Notice */}
      <div className="px-6 py-3 bg-slate-800/30 border-b border-slate-800">
        <div className="max-w-content mx-auto flex items-center gap-3 text-sm">
          <Users className="w-4 h-4 text-gold-400 flex-shrink-0" />
          <p className="text-slate-400">
            The Research Atlas includes profiles only with researcher consent. Interested in being
            featured?{" "}
            <a href="mailto:research@soil.rip" className="text-gold-400 hover:text-gold-300">
              Contact us
            </a>
          </p>
        </div>
      </div>

      {/* Main Content: Graph + Detail Panel */}
      <div className="flex flex-1 overflow-hidden">
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
                filter={selectedDiscipline}
                onNodeSelect={setSelectedNodeId}
                onNodeHover={setHoveredNodeId}
              />
              <GraphLegend disciplines={legendDisciplines} />

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

        {/* Detail Panel (shows when researcher selected) */}
        {selectedResearcher && (
          <ResearcherDetailPanel
            researcher={selectedResearcher}
            connections={selectedConnections}
            allResearchers={researchers}
            onClose={() => setSelectedNodeId(null)}
            onSelectResearcher={setSelectedNodeId}
          />
        )}
      </div>
    </div>
  );
}
