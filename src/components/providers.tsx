"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { GlossaryProvider } from "@/contexts/GlossaryContext";

// ============================================================================
// CLIENT PROVIDERS
// Wraps app with client-side providers (Tooltip, Glossary)
// ============================================================================

interface GlossaryTermData {
  term: string;
  definition: string;
  category: string;
  link?: { text: string; url: string };
}

// Core glossary terms for tooltips across the site
const CORE_GLOSSARY_TERMS: GlossaryTermData[] = [
  {
    term: "Cenotaph",
    definition:
      "Monument honoring an organization whose 'body' is gone. A digital memorial created by founders to preserve the story, data, and lessons of their closed organization.",
    category: "Places & Objects",
  },
  {
    term: "Cenotaphery",
    definition:
      "Virtual cemetery where cenotaphs stand, organized geographically. Each region has its own cenotaphery that can hold a configurable number of cenotaphs before splitting into smaller geographic units.",
    category: "Places & Objects",
  },
  {
    term: "Organizational Autopsy",
    definition:
      "Systematic analysis of why organizations die. Similar to medical autopsy, this process examines the complete lifecycle, structure, and causes of organizational closure to extract valuable lessons for future ventures.",
    category: "Core Concepts",
  },
  {
    term: "Autopsy",
    definition:
      "Systematic analysis of why organizations die. Similar to medical autopsy, this process examines the complete lifecycle, structure, and causes of organizational closure to extract valuable lessons for future ventures.",
    category: "Core Concepts",
  },
];

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <GlossaryProvider initialTerms={CORE_GLOSSARY_TERMS}>{children}</GlossaryProvider>
    </TooltipProvider>
  );
}
