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
}

const categories = [
  "Core Concepts",
  "Places & Objects",
  "People & Roles",
  "Interview System",
  "Events & Awards",
  "Navigation & Interface",
];

export function GlossaryClient({ cenotapheryCapacity }: GlossaryClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Build glossary terms with dynamic capacity value
  const glossaryTerms = useMemo<GlossaryTerm[]>(
    () => [
      // Core Concepts
      {
        term: "SOIL",
        definition:
          "Social Organizational Intelligence Lab - research platform for organizational autopsy data collection. A research-first nonprofit project devoted to collecting organizational autopsy data at scale to establish a new scientific field: Organizational Biology, Health, and Medicine.",
        category: "Core Concepts",
      },
      {
        term: "Organizational Autopsy",
        definition:
          "Systematic analysis of why organizations die. Similar to medical autopsy, this process examines the complete lifecycle, structure, and causes of organizational closure to extract valuable lessons for future ventures.",
        category: "Core Concepts",
      },
      {
        term: "Organizational Biology/Medicine",
        definition:
          "The new scientific field SOIL aims to create. Just as medical science developed through systematic autopsy of human bodies, organizational medicine seeks to understand organizational health and mortality through rigorous research and data collection.",
        category: "Core Concepts",
      },
      {
        term: "Organizational Mortality",
        definition:
          "The death or closure of organizations. SOIL studies this phenomenon systematically to identify patterns, causes, and preventive measures.",
        category: "Core Concepts",
      },

      // Places & Objects
      {
        term: "Cenotaph",
        definition:
          "Monument honoring an organization whose &apos;body&apos; is gone. A digital memorial created by founders to preserve the story, data, and lessons of their closed organization. Each cenotaph includes structured interview data, timeline, and narrative.",
        category: "Places & Objects",
      },
      {
        term: "Cenotaphery",
        definition: `Virtual cemetery where cenotaphs stand, organized geographically. Each region has its own cenotaphery (country, state, city level) that can hold ${cenotapheryCapacity.toLocaleString()} cenotaphs before splitting into smaller geographic units.`,
        category: "Places & Objects",
      },
      {
        term: "Crypt",
        definition:
          "Secure storage for documents, code, and media from the failed organization. Preserves digital artifacts associated with the organization for future reference and research.",
        category: "Places & Objects",
      },
      {
        term: "Roman Dodecahedron",
        definition:
          "Ancient bronze artifact (2nd-4th century AD) that serves as SOIL&apos;s navigation interface and central symbol. Features 12 pentagonal faces with circular holes of varying diameters and 20 vertices topped with small spheres. Its unknown purpose mirrors lost organizational knowledge that SOIL seeks to preserve.",
        category: "Places & Objects",
      },

      // People & Roles
      {
        term: "Keeper",
        definition:
          "Regional moderator and community leader who operates a cenotaphery. Keepers review cenotaphs, moderate community, organize local events including Day of the Dead Venture, and earn revenue from their region&apos;s activities.",
        category: "People & Roles",
      },
      {
        term: "Pathologist",
        definition:
          "Professional who conducts founder interviews. Trained interviewers who guide founders through the structured autopsy process, extracting detailed data while providing therapeutic support during the closure process.",
        category: "People & Roles",
      },
      {
        term: "Founder",
        definition:
          "Person who created or led the failed organization. Founders contribute their organizational stories through the interview process, creating cenotaphs and joining the community of those who have experienced closure.",
        category: "People & Roles",
      },
      {
        term: "Contributor",
        definition:
          "Community member who contributes code, translations, or other improvements to the SOIL platform. Contributors earn recognition and may qualify for Keeper or staff positions.",
        category: "People & Roles",
      },

      // Interview System
      {
        term: "Wizard",
        definition:
          "Interview modules for structured data collection. Six modules: Functional Mapping, Financial Picture, Dynamic Picture, Environment Analysis, Founder Context, and Narrative. Each wizard captures different aspects of the organizational story.",
        category: "Interview System",
      },
      {
        term: "Peak Operations",
        definition:
          "Temporal anchor - the moment when the organization was working at its best. All functional data is collected at this point to capture maximum capabilities and minimize bias from the final crisis period.",
        category: "Interview System",
      },

      // Events & Awards
      {
        term: "Day of the Dead Venture",
        definition:
          "Annual global celebration on October 19th honoring failed organizations. Features global virtual ceremony, local gatherings led by Keepers, founder stories, and announcement of the Cenotavr Award. Date chosen to coincide with Black Monday 1987 - the largest single-day global market crash.",
        category: "Events & Awards",
      },
      {
        term: "Cenotavr Award",
        definition:
          "Annual award for most impactful cenotaph, determined by community engagement metrics during the year. Announced during Day of the Dead Venture ceremony. Purely metric-based with no applications or jury - every public, verified cenotaph is automatically eligible.",
        category: "Events & Awards",
      },

      // Navigation & Interface
      {
        term: "Portal",
        definition:
          "Circular holes in the dodecahedron&apos;s pentagonal faces that serve as navigation entry points. Users fly through these portals to access different sections of the SOIL platform. Hole diameters vary to indicate section importance.",
        category: "Navigation & Interface",
      },
      {
        term: "Vertex Sphere",
        definition:
          "Small spheres topping the 20 vertices of the dodecahedron (matching the original Roman artifact). Serve as secondary navigation for utility functions like profile, settings, search, and notifications. Clicking a sphere takes users inside for a 360° panoramic interface.",
        category: "Navigation & Interface",
      },

      // Additional Terms from Documentation
      {
        term: "Framework-Agnostic Approach",
        definition:
          "SOIL&apos;s core research methodology - collecting data in neutral formats without imposing a single theoretical framework, then applying multiple analytical lenses (biology, economics, sociology, etc.) post-hoc to test which best explain organizational mortality.",
        category: "Core Concepts",
      },
      {
        term: "Verification",
        definition:
          "Process ensuring authenticity of cenotaphs through social verification (3+ colleague confirmations) or documentary verification (official documents). Only verified data can be used in organizational research. Allows publishing organization name publicly.",
        category: "Interview System",
        link: { text: "Learn more about verification", url: "/about/verification" },
      },
      {
        term: "Publicity Tiers",
        definition:
          "Founder-controlled visibility levels: Full Anonymity (default - pattern and data only), Pseudonym + Story (industry, geography, dates without names), or Full Publicity (organization name, founder name, AI-generated summary visible).",
        category: "Interview System",
      },
    ],
    [cenotapheryCapacity]
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
  }, [filteredTerms]);

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
