import { getSetting } from "@/lib/settings.server";
import { getGlossaryTerms, getGlossaryCategories } from "@/lib/glossary.server";
import { GlossaryClient } from "./GlossaryClient";

// ============================================================================
// GLOSSARY PAGE (Server Component)
// Fetches glossary terms and settings from database
// ============================================================================

export default async function GlossaryPage() {
  // Fetch data in parallel
  const [capacity, terms, categories] = await Promise.all([
    getSetting<number>("standard_cenotaphery_capacity", 512),
    getGlossaryTerms(),
    getGlossaryCategories(),
  ]);

  return (
    <GlossaryClient cenotapheryCapacity={capacity} initialTerms={terms} categories={categories} />
  );
}
