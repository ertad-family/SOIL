"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  Mail,
  Calendar,
  ExternalLink,
  ChevronDown,
  Check,
  AlertCircle,
} from "lucide-react";

interface Researcher {
  id: string;
  name: string;
  institution: string;
  discipline: string;
  email: string | null;
  website_url: string | null;
  tier: number;
  mortality_activity_score: number | null;
  openalex_cited_by_count: number;
  outreach_status: string;
  outreach_notes: string | null;
  last_contacted_at: string | null;
  follow_up_date: string | null;
}

interface OutreachResponse {
  researchers: Researcher[];
  total: number;
  statusCounts: Record<string, number>;
}

type StatusFilter =
  | "all"
  | "not_contacted"
  | "contacted"
  | "responded"
  | "interested"
  | "declined"
  | "joined";

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  not_contacted: { label: "Not Contacted", color: "text-slate-400", bgColor: "bg-slate-500/20" },
  contacted: { label: "Contacted", color: "text-yellow-400", bgColor: "bg-yellow-500/20" },
  responded: { label: "Responded", color: "text-blue-400", bgColor: "bg-blue-500/20" },
  interested: { label: "Interested", color: "text-emerald-400", bgColor: "bg-emerald-500/20" },
  declined: { label: "Declined", color: "text-red-400", bgColor: "bg-red-500/20" },
  joined: { label: "Joined RAB", color: "text-gold-400", bgColor: "bg-gold-500/20" },
};

export default function AdminOutreachPage() {
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState<StatusFilter>("not_contacted");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [editingFollowUp, setEditingFollowUp] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchResearchers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filter !== "all") {
        params.set("status", filter);
      }
      if (searchQuery) {
        params.set("search", searchQuery);
      }

      const response = await fetch(`/api/admin/researchers/outreach?${params.toString()}`);
      const data: OutreachResponse = await response.json();

      if (!response.ok) {
        throw new Error("error" in data ? String(data) : "Failed to fetch researchers");
      }

      setResearchers(data.researchers);
      setStatusCounts(data.statusCounts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch researchers");
    } finally {
      setIsLoading(false);
    }
  }, [filter, searchQuery]);

  useEffect(() => {
    fetchResearchers();
  }, [fetchResearchers]);

  const updateOutreach = async (
    id: string,
    updates: {
      outreach_status?: string;
      outreach_notes?: string;
      last_contacted_at?: string;
      follow_up_date?: string | null;
    }
  ) => {
    setSaving(id);
    try {
      const response = await fetch(`/api/admin/researchers/${id}/outreach`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        // Update local state
        setResearchers((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
        // Refetch to update counts
        if (updates.outreach_status) {
          fetchResearchers();
        }
      }
    } catch (err) {
      console.error("Failed to update outreach:", err);
    } finally {
      setSaving(null);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const updates: Record<string, string> = { outreach_status: newStatus };

    // Auto-set last_contacted_at when marking as contacted
    if (newStatus === "contacted") {
      updates.last_contacted_at = new Date().toISOString();
    }

    await updateOutreach(id, updates);
  };

  const handleMarkContacted = async (id: string) => {
    await updateOutreach(id, {
      outreach_status: "contacted",
      last_contacted_at: new Date().toISOString(),
    });
  };

  const handleNotesBlur = async (id: string, notes: string) => {
    setEditingNotes(null);
    const researcher = researchers.find((r) => r.id === id);
    if (researcher && researcher.outreach_notes !== notes) {
      await updateOutreach(id, { outreach_notes: notes });
    }
  };

  const handleFollowUpChange = async (id: string, date: string) => {
    setEditingFollowUp(null);
    await updateOutreach(id, { follow_up_date: date || null });
  };

  const getActivityScoreColor = (score: number | null) => {
    if (score === null) return "text-slate-500";
    if (score >= 70) return "text-emerald-400";
    if (score >= 40) return "text-yellow-400";
    if (score > 0) return "text-orange-400";
    return "text-red-400";
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue = (followUpDate: string | null) => {
    if (!followUpDate) return false;
    return new Date(followUpDate) < new Date();
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-gold-400" />
          <h1 className="text-2xl font-semibold text-marble-100">Researcher Outreach</h1>
        </div>
        <div className="text-sm text-slate-400">{researchers.length} researchers shown</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        {Object.entries(STATUS_CONFIG).map(([status, config]) => (
          <button
            key={status}
            onClick={() => setFilter(status as StatusFilter)}
            className={`p-4 rounded-lg border transition-colors ${
              filter === status
                ? `${config.bgColor} border-current ${config.color}`
                : "bg-slate-800/50 border-slate-700 hover:bg-slate-800"
            }`}
          >
            <div
              className={`text-2xl font-bold ${filter === status ? config.color : "text-marble-100"}`}
            >
              {statusCounts[status] || 0}
            </div>
            <div className="text-xs text-slate-400 mt-1">{config.label}</div>
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or institution..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-marble-100 placeholder:text-slate-500 focus:outline-none focus:border-gold-500/50"
          />
        </div>
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-gold-500/20 text-gold-400 border border-gold-500/50"
              : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
          }`}
        >
          Show All
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-400">Loading researchers...</div>
      ) : researchers.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          No researchers found for this filter.
        </div>
      ) : (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 text-left">
                  <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Researcher
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Citations
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Last Contact
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Follow Up
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {researchers.map((researcher) => (
                  <tr key={researcher.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Researcher Info */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-marble-100">{researcher.name}</span>
                        <span className="text-sm text-slate-400">{researcher.institution}</span>
                        <span className="text-xs text-slate-500 capitalize">
                          {researcher.discipline}
                        </span>
                      </div>
                    </td>

                    {/* Activity Score */}
                    <td className="px-4 py-3">
                      <span
                        className={`font-mono text-sm ${getActivityScoreColor(researcher.mortality_activity_score)}`}
                      >
                        {researcher.mortality_activity_score ?? "-"}
                      </span>
                    </td>

                    {/* Citations */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-marble-100">
                        {researcher.openalex_cited_by_count.toLocaleString()}
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-4 py-3">
                      <div className="relative">
                        <select
                          value={researcher.outreach_status}
                          onChange={(e) => handleStatusChange(researcher.id, e.target.value)}
                          disabled={saving === researcher.id}
                          className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-sm font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-500/50 ${
                            STATUS_CONFIG[researcher.outreach_status]?.bgColor || "bg-slate-700"
                          } ${STATUS_CONFIG[researcher.outreach_status]?.color || "text-slate-400"}`}
                        >
                          {Object.entries(STATUS_CONFIG).map(([value, config]) => (
                            <option
                              key={value}
                              value={value}
                              className="bg-slate-800 text-marble-100"
                            >
                              {config.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-current opacity-50" />
                      </div>
                    </td>

                    {/* Last Contact */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-400">
                        {formatDate(researcher.last_contacted_at)}
                      </span>
                    </td>

                    {/* Follow Up Date */}
                    <td className="px-4 py-3">
                      {editingFollowUp === researcher.id ? (
                        <input
                          type="date"
                          defaultValue={researcher.follow_up_date?.split("T")[0] || ""}
                          onBlur={(e) => handleFollowUpChange(researcher.id, e.target.value)}
                          autoFocus
                          className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm text-marble-100 focus:outline-none focus:border-gold-500/50"
                        />
                      ) : (
                        <button
                          onClick={() => setEditingFollowUp(researcher.id)}
                          className={`text-sm flex items-center gap-1 ${
                            isOverdue(researcher.follow_up_date)
                              ? "text-red-400"
                              : "text-slate-400 hover:text-marble-100"
                          }`}
                        >
                          {isOverdue(researcher.follow_up_date) && (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          {formatDate(researcher.follow_up_date)}
                        </button>
                      )}
                    </td>

                    {/* Notes */}
                    <td className="px-4 py-3 max-w-xs">
                      {editingNotes === researcher.id ? (
                        <textarea
                          defaultValue={researcher.outreach_notes || ""}
                          onBlur={(e) => handleNotesBlur(researcher.id, e.target.value)}
                          autoFocus
                          rows={2}
                          className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm text-marble-100 focus:outline-none focus:border-gold-500/50 resize-none"
                          placeholder="Add notes..."
                        />
                      ) : (
                        <button
                          onClick={() => setEditingNotes(researcher.id)}
                          className="text-sm text-slate-400 hover:text-marble-100 text-left truncate max-w-[200px] block"
                          title={researcher.outreach_notes || "Click to add notes"}
                        >
                          {researcher.outreach_notes || "Add notes..."}
                        </button>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {researcher.outreach_status === "not_contacted" && (
                          <button
                            onClick={() => handleMarkContacted(researcher.id)}
                            disabled={saving === researcher.id}
                            className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                            title="Mark as Contacted"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {researcher.email && (
                          <a
                            href={`mailto:${researcher.email}`}
                            className="p-1.5 rounded-lg bg-slate-700 text-slate-400 hover:bg-blue-500/20 hover:text-blue-400 transition-colors"
                            title={`Email: ${researcher.email}`}
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        )}
                        {researcher.website_url && (
                          <a
                            href={researcher.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-700 text-slate-400 hover:bg-slate-600 transition-colors"
                            title="Visit Website"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => setEditingFollowUp(researcher.id)}
                          className="p-1.5 rounded-lg bg-slate-700 text-slate-400 hover:bg-slate-600 transition-colors"
                          title="Set Follow-up Date"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
