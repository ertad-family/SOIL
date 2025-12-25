import { getSetting } from "@/lib/settings.server";
import { GlossaryClient } from "./GlossaryClient";

// ============================================================================
// GLOSSARY PAGE (Server Component)
// Fetches cenotaphery capacity from database settings
// ============================================================================

export default async function GlossaryPage() {
  // Get cenotaphery capacity from DB settings
  const capacity = await getSetting<number>("standard_cenotaphery_capacity", 512);

  return <GlossaryClient cenotapheryCapacity={capacity} />;
}
