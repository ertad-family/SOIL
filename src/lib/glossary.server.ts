import { createClient } from "@/lib/supabase/server";

// ============================================================================
// GLOSSARY SERVER FUNCTIONS
// Server-side functions for fetching glossary terms from database
// ============================================================================

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: string;
  link_text: string | null;
  link_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface GlossaryTermForClient {
  term: string;
  definition: string;
  category: string;
  link?: { text: string; url: string };
}

/**
 * Fetches all glossary terms from the database
 * Results are automatically cached by Next.js
 */
export async function getGlossaryTerms(): Promise<GlossaryTermForClient[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("glossary_terms")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching glossary terms:", error);
    throw new Error("Failed to fetch glossary terms");
  }

  // Transform data for client consumption
  return (data || []).map((term: GlossaryTerm) => ({
    term: term.term,
    definition: term.definition,
    category: term.category,
    ...(term.link_text && term.link_url
      ? { link: { text: term.link_text, url: term.link_url } }
      : {}),
  }));
}

/**
 * Gets all unique categories from glossary terms in display order
 * Results are automatically cached by Next.js
 */
export async function getGlossaryCategories(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("glossary_terms")
    .select("category")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching glossary categories:", error);
    throw new Error("Failed to fetch glossary categories");
  }

  // Return unique categories in order they appear
  const categories = new Set<string>();
  (data || []).forEach((row) => categories.add(row.category));
  return Array.from(categories);
}
