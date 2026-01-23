"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/section-label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ExternalLink,
  Search,
  BookOpen,
  FileText,
  GraduationCap,
  Library,
  Filter,
  X,
  Loader2,
  PlusCircle,
  Check,
  ChevronDown,
  AlertCircle,
} from "lucide-react";

// Types
interface ZoteroCreator {
  creatorType: string;
  firstName?: string;
  lastName?: string;
  name?: string;
}

interface ZoteroTag {
  tag: string;
}

interface ZoteroItemData {
  key: string;
  itemType: string;
  title: string;
  creators: ZoteroCreator[];
  abstractNote?: string;
  publicationTitle?: string;
  date?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  DOI?: string;
  url?: string;
  tags: ZoteroTag[];
  publisher?: string;
  place?: string;
}

interface ZoteroItem {
  key: string;
  meta: {
    creatorSummary?: string;
    parsedDate?: string;
  };
  data: ZoteroItemData;
}

interface ZoteroCollection {
  key: string;
  name: string;
  numItems: number;
}

interface ZoteroStats {
  totalItems: number;
  collections: ZoteroCollection[];
  itemTypes: { type: string; count: number }[];
  topTags: { tag: string; count: number }[];
}

interface ItemsResponse {
  items: ZoteroItem[];
  total: number;
  limit: number;
  start: number;
}

const ZOTERO_GROUP_URL =
  "https://www.zotero.org/groups/6367540/studies_of_organizational_illness_and_loss";

// Helper function to format authors
function formatAuthors(creators: ZoteroCreator[]): string {
  if (!creators || creators.length === 0) return "Unknown";

  const authors = creators
    .filter((c) => c.creatorType === "author")
    .map((c) => {
      if (c.name) return c.name;
      if (c.lastName && c.firstName) return `${c.lastName}, ${c.firstName[0]}.`;
      if (c.lastName) return c.lastName;
      return "";
    })
    .filter(Boolean);

  if (authors.length === 0) return "Unknown";
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return authors.join(" & ");
  return `${authors[0]} et al.`;
}

// Helper function to get item type icon
function getItemTypeIcon(itemType: string) {
  switch (itemType) {
    case "book":
      return <BookOpen className="w-4 h-4" />;
    case "journalArticle":
      return <FileText className="w-4 h-4" />;
    case "thesis":
      return <GraduationCap className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
}

// Helper function to format item type label
function formatItemType(itemType: string): string {
  switch (itemType) {
    case "journalArticle":
      return "Journal Article";
    case "book":
      return "Book";
    case "bookSection":
      return "Book Chapter";
    case "thesis":
      return "Thesis";
    default:
      return itemType;
  }
}

// Stats Section Component
function StatsSection({ stats }: { stats: ZoteroStats | null }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card variant="dark" padding="md">
        <div className="text-center">
          <span className="font-display text-3xl font-semibold text-gold-400">
            {stats.totalItems}
          </span>
          <p className="text-slate-400 text-sm mt-1">Publications</p>
        </div>
      </Card>
      <Card variant="dark" padding="md">
        <div className="text-center">
          <span className="font-display text-3xl font-semibold text-gold-400">
            {stats.collections.length}
          </span>
          <p className="text-slate-400 text-sm mt-1">Collections</p>
        </div>
      </Card>
      <Card variant="dark" padding="md">
        <div className="text-center">
          <span className="font-display text-3xl font-semibold text-gold-400">
            {stats.itemTypes.find((t) => t.type === "journalArticle")?.count || 0}
          </span>
          <p className="text-slate-400 text-sm mt-1">Journal Articles</p>
        </div>
      </Card>
      <Card variant="dark" padding="md">
        <div className="text-center">
          <span className="font-display text-3xl font-semibold text-gold-400">
            {stats.itemTypes.find((t) => t.type === "book")?.count || 0}
          </span>
          <p className="text-slate-400 text-sm mt-1">Books</p>
        </div>
      </Card>
    </div>
  );
}

// Publication Card Component
function PublicationCard({ item }: { item: ZoteroItem }) {
  const { data, meta } = item;
  const authors = formatAuthors(data.creators);
  const year = meta.parsedDate || data.date || "";

  // Build citation
  let citation = "";
  if (data.publicationTitle) {
    citation = data.publicationTitle;
    if (data.volume) citation += `, ${data.volume}`;
    if (data.issue) citation += `(${data.issue})`;
    if (data.pages) citation += `, ${data.pages}`;
  } else if (data.publisher) {
    citation = data.publisher;
    if (data.place) citation = `${data.place}: ${citation}`;
  }

  const zoteroLink = `https://www.zotero.org/groups/studies_of_organizational_illness_and_loss/items/${data.key}`;

  return (
    <Card variant="dark" padding="md" className="h-full">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-400 flex-shrink-0 mt-1">
          {getItemTypeIcon(data.itemType)}
        </div>
        <div className="flex-1 min-w-0">
          <a
            href={data.DOI ? `https://doi.org/${data.DOI}` : data.url || zoteroLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <h3 className="font-display text-base font-medium text-marble-100 group-hover:text-gold-400 transition-colors line-clamp-2 mb-2">
              {data.title}
            </h3>
          </a>
          <p className="text-slate-400 text-sm mb-1">
            {authors} {year && `(${year})`}
          </p>
          {citation && <p className="text-slate-500 text-sm italic line-clamp-1">{citation}</p>}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded bg-slate-700/50 text-slate-400">
              {formatItemType(data.itemType)}
            </span>
            {data.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.tag}
                className="text-xs px-2 py-0.5 rounded bg-gold-500/10 text-gold-400/80"
              >
                {tag.tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

// Filter Sidebar Component
function FilterSidebar({
  stats,
  selectedCollection,
  selectedTag,
  onCollectionChange,
  onTagChange,
}: {
  stats: ZoteroStats | null;
  selectedCollection: string;
  selectedTag: string;
  onCollectionChange: (collection: string) => void;
  onTagChange: (tag: string) => void;
}) {
  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Collections Filter */}
      <div>
        <h3 className="font-display text-sm font-medium text-marble-100 mb-3 flex items-center gap-2">
          <Library className="w-4 h-4 text-gold-400" />
          Collections
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => onCollectionChange("")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !selectedCollection
                ? "bg-gold-500/20 text-gold-400"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            All Collections
          </button>
          {stats.collections.map((collection) => (
            <button
              key={collection.key}
              onClick={() => onCollectionChange(collection.key)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCollection === collection.key
                  ? "bg-gold-500/20 text-gold-400"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              {collection.name}
              <span className="text-slate-500 ml-1">({collection.numItems})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tags Filter */}
      <div>
        <h3 className="font-display text-sm font-medium text-marble-100 mb-3 flex items-center gap-2">
          <Filter className="w-4 h-4 text-gold-400" />
          Popular Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {stats.topTags.slice(0, 12).map((tagItem) => (
            <button
              key={tagItem.tag}
              onClick={() => onTagChange(selectedTag === tagItem.tag ? "" : tagItem.tag)}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                selectedTag === tagItem.tag
                  ? "bg-gold-500/30 text-gold-400"
                  : "bg-slate-700/50 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {tagItem.tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// CrossRef metadata type
interface CrossRefMetadata {
  title: string;
  authors: string;
  date: string;
  publicationTitle: string;
  publisher: string;
  itemType: string;
  url: string;
}

// Propose Publication Dialog Component
function ProposePublicationDialog({
  open,
  onOpenChange,
  collections,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collections: ZoteroCollection[];
  onSuccess: () => void;
}) {
  // DOI fetch state
  const [doiInput, setDoiInput] = useState("");
  const [fetchingDoi, setFetchingDoi] = useState(false);
  const [doiError, setDoiError] = useState<string | null>(null);
  const [metadataFetched, setMetadataFetched] = useState(false);

  // Manual entry toggle
  const [showManualEntry, setShowManualEntry] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    itemType: "journalArticle",
    title: "",
    authors: "",
    date: "",
    publicationTitle: "",
    publisher: "",
    doi: "",
    url: "",
    collection: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Clean DOI input (remove URL prefix if present)
  const cleanDoi = (input: string): string => {
    const trimmed = input.trim();
    // Handle full URLs like https://doi.org/10.1234/...
    if (trimmed.includes("doi.org/")) {
      return trimmed.split("doi.org/")[1];
    }
    // Handle dx.doi.org URLs
    if (trimmed.includes("dx.doi.org/")) {
      return trimmed.split("dx.doi.org/")[1];
    }
    return trimmed;
  };

  // Fetch metadata from CrossRef
  const fetchFromDoi = async () => {
    const doi = cleanDoi(doiInput);
    if (!doi) {
      setDoiError("Please enter a DOI");
      return;
    }

    setFetchingDoi(true);
    setDoiError(null);

    try {
      const response = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("DOI not found. Please check the DOI or enter details manually.");
        }
        throw new Error("Failed to fetch metadata from CrossRef");
      }

      const data = await response.json();
      const work = data.message;

      // Parse authors
      const authors =
        work.author
          ?.map((a: { family?: string; given?: string; name?: string }) => {
            if (a.family && a.given) {
              return `${a.family}, ${a.given}`;
            }
            return a.name || a.family || "";
          })
          .filter(Boolean)
          .join("; ") || "";

      // Determine item type
      let itemType = "journalArticle";
      if (work.type === "book" || work.type === "monograph") {
        itemType = "book";
      } else if (work.type === "book-chapter") {
        itemType = "bookSection";
      } else if (work.type === "proceedings-article") {
        itemType = "conferencePaper";
      } else if (work.type === "report") {
        itemType = "report";
      } else if (work.type === "dissertation") {
        itemType = "thesis";
      }

      // Extract year
      const datePublished =
        work.published?.["date-parts"]?.[0]?.[0] ||
        work["published-print"]?.["date-parts"]?.[0]?.[0] ||
        work["published-online"]?.["date-parts"]?.[0]?.[0] ||
        "";

      const metadata: CrossRefMetadata = {
        title: work.title?.[0] || "",
        authors,
        date: datePublished?.toString() || "",
        publicationTitle: work["container-title"]?.[0] || "",
        publisher: work.publisher || "",
        itemType,
        url: work.URL || `https://doi.org/${doi}`,
      };

      setFormData({
        ...metadata,
        doi,
        collection: "",
      });
      setMetadataFetched(true);
    } catch (err) {
      setDoiError(err instanceof Error ? err.message : "Failed to fetch metadata");
    } finally {
      setFetchingDoi(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      // Convert "none" to empty string for collection
      const submissionData = {
        ...formData,
        collection: formData.collection === "none" ? "" : formData.collection,
      };
      const response = await fetch("/api/zotero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add publication");
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        onSuccess();
        onOpenChange(false);
        // Reset all state
        resetForm();
      }, 1500);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setDoiInput("");
    setDoiError(null);
    setMetadataFetched(false);
    setShowManualEntry(false);
    setFormData({
      itemType: "journalArticle",
      title: "",
      authors: "",
      date: "",
      publicationTitle: "",
      publisher: "",
      doi: "",
      url: "",
      collection: "",
    });
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Check if form has required fields
  const canSubmit = formData.title.trim() && formData.authors.trim();

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm();
        onOpenChange(isOpen);
      }}
    >
      <DialogContent variant="dark" size="lg">
        <DialogHeader>
          <DialogTitle variant="dark">Propose a Publication</DialogTitle>
          <DialogDescription variant="dark">
            Enter a DOI to auto-fill publication details, or enter them manually.
          </DialogDescription>
        </DialogHeader>

        {submitSuccess ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="font-display text-xl font-medium text-marble-100 mb-2">
              Publication Added!
            </h3>
            <p className="text-slate-400">Thank you for your contribution to the bibliography.</p>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {/* DOI Fetch Section */}
            {!metadataFetched && !showManualEntry && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    DOI (Digital Object Identifier)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      variant="dark"
                      value={doiInput}
                      onChange={(e) => {
                        setDoiInput(e.target.value);
                        setDoiError(null);
                      }}
                      placeholder="10.1234/example or https://doi.org/10.1234/example"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          fetchFromDoi();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="dark-primary"
                      onClick={fetchFromDoi}
                      disabled={fetchingDoi || !doiInput.trim()}
                    >
                      {fetchingDoi ? <Loader2 className="w-4 h-4 animate-spin" /> : "Fetch"}
                    </Button>
                  </div>
                  {doiError && (
                    <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {doiError}
                    </div>
                  )}
                </div>

                {/* Manual Entry Toggle */}
                <button
                  type="button"
                  onClick={() => setShowManualEntry(true)}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                  No DOI? Enter details manually
                </button>
              </div>
            )}

            {/* Form Fields (shown after DOI fetch or manual entry) */}
            {(metadataFetched || showManualEntry) && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {metadataFetched && (
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 mb-4">
                    <p className="text-green-400 text-sm flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Metadata fetched from DOI. You can edit the fields below if needed.
                    </p>
                  </div>
                )}

                {/* Item Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Publication Type *
                  </label>
                  <Select
                    value={formData.itemType}
                    onValueChange={(value) => updateField("itemType", value)}
                  >
                    <SelectTrigger variant="dark">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent variant="dark">
                      <SelectItem value="journalArticle">Journal Article</SelectItem>
                      <SelectItem value="book">Book</SelectItem>
                      <SelectItem value="bookSection">Book Chapter</SelectItem>
                      <SelectItem value="thesis">Thesis</SelectItem>
                      <SelectItem value="report">Report</SelectItem>
                      <SelectItem value="conferencePaper">Conference Paper</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Title *</label>
                  <Input
                    variant="dark"
                    value={formData.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="Full title of the publication"
                    required
                  />
                </div>

                {/* Authors */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Authors *
                  </label>
                  <Input
                    variant="dark"
                    value={formData.authors}
                    onChange={(e) => updateField("authors", e.target.value)}
                    placeholder="LastName, FirstName; LastName2, FirstName2"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Separate multiple authors with semicolons
                  </p>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Year</label>
                  <Input
                    variant="dark"
                    value={formData.date}
                    onChange={(e) => updateField("date", e.target.value)}
                    placeholder="2024"
                    maxLength={4}
                  />
                </div>

                {/* Journal/Publisher (conditional) */}
                {(formData.itemType === "journalArticle" ||
                  formData.itemType === "conferencePaper") && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      {formData.itemType === "conferencePaper"
                        ? "Conference/Proceedings"
                        : "Journal Name"}
                    </label>
                    <Input
                      variant="dark"
                      value={formData.publicationTitle}
                      onChange={(e) => updateField("publicationTitle", e.target.value)}
                      placeholder={
                        formData.itemType === "conferencePaper"
                          ? "e.g., Academy of Management Proceedings"
                          : "e.g., Academy of Management Review"
                      }
                    />
                  </div>
                )}

                {(formData.itemType === "book" || formData.itemType === "bookSection") && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Publisher
                    </label>
                    <Input
                      variant="dark"
                      value={formData.publisher}
                      onChange={(e) => updateField("publisher", e.target.value)}
                      placeholder="e.g., Oxford University Press"
                    />
                  </div>
                )}

                {/* DOI (if manual entry) */}
                {showManualEntry && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">DOI</label>
                    <Input
                      variant="dark"
                      value={formData.doi}
                      onChange={(e) => updateField("doi", e.target.value)}
                      placeholder="10.1234/example.doi"
                    />
                  </div>
                )}

                {/* URL */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">URL</label>
                  <Input
                    variant="dark"
                    value={formData.url}
                    onChange={(e) => updateField("url", e.target.value)}
                    placeholder="https://..."
                    type="url"
                  />
                </div>

                {/* Collection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Collection
                  </label>
                  <Select
                    value={formData.collection}
                    onValueChange={(value) => updateField("collection", value)}
                  >
                    <SelectTrigger variant="dark">
                      <SelectValue placeholder="Select a collection (optional)" />
                    </SelectTrigger>
                    <SelectContent variant="dark">
                      <SelectItem value="none">No collection</SelectItem>
                      {collections.map((c) => (
                        <SelectItem key={c.key} value={c.key}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Error Message */}
                {submitError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                    <p className="text-red-400 text-sm">{submitError}</p>
                  </div>
                )}

                <DialogFooter>
                  <Button
                    type="button"
                    variant="dark-secondary"
                    onClick={() => {
                      if (metadataFetched) {
                        setMetadataFetched(false);
                        setFormData({
                          itemType: "journalArticle",
                          title: "",
                          authors: "",
                          date: "",
                          publicationTitle: "",
                          publisher: "",
                          doi: "",
                          url: "",
                          collection: "",
                        });
                      } else {
                        setShowManualEntry(false);
                      }
                    }}
                    disabled={submitting}
                  >
                    Back
                  </Button>
                  <Button type="submit" variant="dark-primary" disabled={submitting || !canSubmit}>
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add Publication
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Main Bibliography Page
export default function BibliographyPage() {
  const [stats, setStats] = useState<ZoteroStats | null>(null);
  const [items, setItems] = useState<ZoteroItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentStart, setCurrentStart] = useState(0);
  const [showProposeDialog, setShowProposeDialog] = useState(false);

  const ITEMS_PER_PAGE = 20;

  // Check cache staleness and sync in background if needed
  useEffect(() => {
    async function checkAndSync() {
      try {
        const statusResponse = await fetch("/api/zotero/sync");
        if (!statusResponse.ok) return;
        const status = await statusResponse.json();

        if (status.stale) {
          console.log("Zotero cache is stale, syncing in background...");
          // Sync in background - don't await, let it run
          fetch("/api/zotero/sync", { method: "POST" })
            .then((res) => res.json())
            .then((data) => console.log("Background sync complete:", data))
            .catch((err) => console.error("Background sync error:", err));
        }
      } catch (err) {
        console.error("Error checking sync status:", err);
      }
    }
    checkAndSync();
  }, []);

  // Fetch stats on mount
  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/zotero?action=stats");
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    }
    fetchStats();
  }, []);

  // Fetch items when filters change
  const fetchItems = useCallback(
    async (start: number = 0, append: boolean = false) => {
      if (start === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      try {
        const params = new URLSearchParams({
          action: "items",
          limit: ITEMS_PER_PAGE.toString(),
          start: start.toString(),
        });

        if (selectedCollection) params.set("collection", selectedCollection);
        if (selectedTag) params.set("tag", selectedTag);
        if (searchQuery) params.set("q", searchQuery);

        const response = await fetch(`/api/zotero?${params}`);
        if (!response.ok) throw new Error("Failed to fetch items");

        const data: ItemsResponse = await response.json();

        if (append) {
          setItems((prev) => [...prev, ...data.items]);
        } else {
          setItems(data.items);
        }

        setCurrentStart(start);
        setHasMore(start + data.items.length < data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [selectedCollection, selectedTag, searchQuery]
  );

  // Initial fetch and filter changes
  useEffect(() => {
    fetchItems(0);
  }, [fetchItems]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchItems]);

  const handleLoadMore = () => {
    fetchItems(currentStart + ITEMS_PER_PAGE, true);
  };

  const clearFilters = () => {
    setSelectedCollection("");
    setSelectedTag("");
    setSearchQuery("");
  };

  const refreshData = async () => {
    // Refresh stats
    try {
      const response = await fetch("/api/zotero?action=stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Error refreshing stats:", err);
    }
    // Refresh items
    fetchItems(0);
  };

  const hasActiveFilters = selectedCollection || selectedTag || searchQuery;

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
              <SectionLabel>research bibliography</SectionLabel>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold mt-4 mb-4 text-marble-100">
                Organizational Mortality Literature
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl">
                A curated collection of academic publications on organizational failure, death, and
                mortality. Searchable, filterable, and continuously updated.
              </p>
            </div>

            <div className="flex-shrink-0 animate-fade-in-up stagger-1 flex flex-col sm:flex-row gap-3">
              <Button variant="dark-secondary" size="lg" onClick={() => setShowProposeDialog(true)}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Propose Publication
              </Button>
              <a href={ZOTERO_GROUP_URL} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="dark-primary"
                  size="lg"
                  rightIcon={<ExternalLink className="w-4 h-4" />}
                >
                  Open in Zotero
                </Button>
              </a>
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
                  selectedCollection={selectedCollection}
                  selectedTag={selectedTag}
                  onCollectionChange={setSelectedCollection}
                  onTagChange={setSelectedTag}
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
                    placeholder="Search publications..."
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
                    selectedCollection={selectedCollection}
                    selectedTag={selectedTag}
                    onCollectionChange={(c) => {
                      setSelectedCollection(c);
                      setShowFilters(false);
                    }}
                    onTagChange={(t) => {
                      setSelectedTag(t);
                      setShowFilters(false);
                    }}
                  />
                </Card>
              )}

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="text-slate-500 text-sm">Active filters:</span>
                  {selectedCollection && stats && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gold-500/20 text-gold-400 text-sm">
                      {stats.collections.find((c) => c.key === selectedCollection)?.name}
                      <button onClick={() => setSelectedCollection("")}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedTag && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gold-500/20 text-gold-400 text-sm">
                      {selectedTag}
                      <button onClick={() => setSelectedTag("")}>
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
                  <Button variant="dark-secondary" onClick={() => fetchItems(0)}>
                    Try Again
                  </Button>
                </Card>
              )}

              {/* Publications Grid */}
              {!loading && !error && (
                <>
                  <div className="grid gap-4">
                    {items.map((item) => (
                      <PublicationCard key={item.key} item={item} />
                    ))}
                  </div>

                  {items.length === 0 && (
                    <Card variant="dark" padding="lg" className="text-center">
                      <p className="text-slate-400">
                        No publications found matching your criteria.
                      </p>
                    </Card>
                  )}

                  {/* Load More Button */}
                  {hasMore && items.length > 0 && (
                    <div className="flex justify-center mt-8">
                      <Button
                        variant="dark-secondary"
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                      >
                        {loadingMore ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          "Load More"
                        )}
                      </Button>
                    </div>
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
            Prefer Native Zotero?
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-8">
            Access the full bibliography directly in Zotero. Subscribe to updates, export citations
            in any format, and integrate with your existing research workflow.
          </p>
          <a href={ZOTERO_GROUP_URL} target="_blank" rel="noopener noreferrer">
            <Button
              variant="dark-primary"
              size="lg"
              rightIcon={<ExternalLink className="w-4 h-4" />}
            >
              Open Zotero Group Library
            </Button>
          </a>
        </div>
      </section>

      {/* Propose Publication Dialog */}
      <ProposePublicationDialog
        open={showProposeDialog}
        onOpenChange={setShowProposeDialog}
        collections={stats?.collections || []}
        onSuccess={refreshData}
      />
    </>
  );
}
