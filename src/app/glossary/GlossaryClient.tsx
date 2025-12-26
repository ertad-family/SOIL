"use client";

import { useState, useMemo } from "react";
import { SectionLabel } from "@/components/ui/section-label";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";

// ============================================================================
// GLOSSARY CLIENT COMPONENT
// Interactive search and filtering for glossary terms
// ============================================================================

interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
  link?: { text: string; url: string };
}

interface GlossaryClientProps {
  cenotapheryCapacity: number;
  initialTerms: GlossaryTerm[];
  categories: string[];
}

export function GlossaryClient({
  cenotapheryCapacity,
  initialTerms,
  categories,
}: GlossaryClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Transform terms to include dynamic capacity in Cenotaphery definition
  const glossaryTerms = useMemo<GlossaryTerm[]>(
    () =>
      initialTerms.map((term) => {
        // Replace capacity placeholder in Cenotaphery definition
        if (term.term === "Cenotaphery") {
          return {
            ...term,
            definition: `Virtual cemetery where cenotaphs stand, organized geographically. Each region has its own cenotaphery (country, state, city level) that can hold ${cenotapheryCapacity.toLocaleString()} cenotaphs before splitting into smaller geographic units.`,
          };
        }
        return term;
      }),
    [initialTerms, cenotapheryCapacity]
  );

  // Filter terms based on search query
  const filteredTerms = useMemo(() => {
    if (!searchQuery.trim()) return glossaryTerms;

    const query = searchQuery.toLowerCase();
    return glossaryTerms.filter(
      (term) =>
        term.term.toLowerCase().includes(query) ||
        term.definition.toLowerCase().includes(query) ||
        term.category.toLowerCase().includes(query)
    );
  }, [searchQuery, glossaryTerms]);

  // Group filtered terms by category
  const groupedTerms = useMemo(() => {
    const grouped: Record<string, GlossaryTerm[]> = {};
    categories.forEach((cat) => {
      grouped[cat] = [];
    });

    filteredTerms.forEach((term) => {
      if (grouped[term.category]) {
        grouped[term.category].push(term);
      }
    });

    return grouped;
  }, [filteredTerms, categories]);

  const hasResults = filteredTerms.length > 0;

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl animate-fade-in-up mb-12">
          <SectionLabel>terminology</SectionLabel>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-wide mt-4 mb-6 text-marble-100 leading-tight">
            Glossary
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            A comprehensive guide to SOIL project-specific terms and concepts. Understanding this
            vocabulary helps navigate the unique approach to organizational autopsy, research, and
            community building.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500/50 transition-colors"
            />
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-slate-500">
              {hasResults
                ? `Found ${filteredTerms.length} term${filteredTerms.length !== 1 ? "s" : ""}`
                : "No terms found"}
            </p>
          )}
        </div>

        {/* Terms by Category */}
        {hasResults ? (
          <div className="space-y-16">
            {categories.map((category) => {
              const terms = groupedTerms[category];
              if (terms.length === 0) return null;

              return (
                <section key={category}>
                  <h2 className="font-display text-2xl font-medium text-marble-100 mb-6">
                    {category}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {terms.map((term) => (
                      <Card key={term.term} variant="dark" padding="lg" className="h-full">
                        <h3 className="font-display text-lg font-semibold text-gold-400 mb-3">
                          {term.term}
                        </h3>
                        <p className="text-slate-400 leading-relaxed">{term.definition}</p>
                        {term.link && (
                          <p className="mt-3">
                            <a
                              href={term.link.url}
                              className="text-sm text-gold-400 hover:text-gold-300 underline transition-colors"
                            >
                              {term.link.text} →
                            </a>
                          </p>
                        )}
                      </Card>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <Card variant="dark" padding="lg" className="text-center">
            <p className="text-slate-400">
              No terms match your search. Try a different keyword or{" "}
              <button
                onClick={() => setSearchQuery("")}
                className="text-gold-400 hover:text-gold-300 underline"
              >
                clear the search
              </button>
              .
            </p>
          </Card>
        )}

        {/* Decorative divider */}
        {hasResults && (
          <div className="divider-roman mt-16 pt-12">
            <span className="text-gold-400 font-serif text-lg px-6">✦</span>
          </div>
        )}

        {/* Additional Resources */}
        {hasResults && (
          <div className="mt-12 max-w-3xl">
            <Card variant="dark-elevated" padding="lg" className="border-gold-500/20 border">
              <h3 className="font-display text-xl font-medium text-marble-100 mb-4">Learn More</h3>
              <p className="text-slate-400 leading-relaxed mb-4">
                For deeper understanding of SOIL&apos;s mission, methodology, and vision, explore:
              </p>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="/about" className="text-gold-400 hover:text-gold-300 transition-colors">
                    About the Project
                  </a>{" "}
                  — SOIL&apos;s mission and scientific foundation
                </li>
                <li>
                  <a
                    href="/research"
                    className="text-gold-400 hover:text-gold-300 transition-colors"
                  >
                    Research Center
                  </a>{" "}
                  — Our approach to studying organizational mortality
                </li>
                <li>
                  <a
                    href="/community"
                    className="text-gold-400 hover:text-gold-300 transition-colors"
                  >
                    Founder Community
                  </a>{" "}
                  — Join others who&apos;ve experienced organizational closure
                </li>
              </ul>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
