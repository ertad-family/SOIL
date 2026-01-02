"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/section-label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

  const ITEMS_PER_PAGE = 20;

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

            <div className="flex-shrink-0 animate-fade-in-up stagger-1">
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
    </>
  );
}
