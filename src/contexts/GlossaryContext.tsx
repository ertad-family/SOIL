"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

// ============================================================================
// GLOSSARY CONTEXT
// Provides cached glossary terms for GlossaryTerm components
// ============================================================================

interface GlossaryTermData {
  term: string;
  definition: string;
  category: string;
  link?: { text: string; url: string };
}

interface GlossaryContextValue {
  getTermDefinition: (term: string) => string | null;
  setTermDefinition: (term: string, definition: string) => void;
}

const GlossaryContext = createContext<GlossaryContextValue | null>(null);

export function GlossaryProvider({
  children,
  initialTerms = [],
}: {
  children: React.ReactNode;
  initialTerms?: GlossaryTermData[];
}) {
  const [termsCache, setTermsCache] = useState<Map<string, string>>(() => {
    const cache = new Map<string, string>();
    initialTerms.forEach((term) => {
      cache.set(term.term.toLowerCase(), term.definition);
    });
    return cache;
  });

  const getTermDefinition = useCallback(
    (term: string): string | null => {
      return termsCache.get(term.toLowerCase()) || null;
    },
    [termsCache]
  );

  const setTermDefinition = useCallback((term: string, definition: string) => {
    setTermsCache((prev) => new Map(prev).set(term.toLowerCase(), definition));
  }, []);

  return (
    <GlossaryContext.Provider value={{ getTermDefinition, setTermDefinition }}>
      {children}
    </GlossaryContext.Provider>
  );
}

export function useGlossary() {
  const context = useContext(GlossaryContext);
  if (!context) {
    throw new Error("useGlossary must be used within GlossaryProvider");
  }
  return context;
}
