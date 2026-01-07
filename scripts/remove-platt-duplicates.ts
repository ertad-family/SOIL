/**
 * Remove duplicate Platt researchers
 *
 * Duplicates found:
 * - "Harlan Platt" (9c03227b-b226-4eec-a625-48c130e8539e) -> duplicate of "Harlan D. Platt"
 * - "Marjorie Platt" (71779d57-d91a-4e6d-9ee0-93025ac4b4c9) -> duplicate of "Marjorie B. Platt"
 *
 * Run with: npx tsx scripts/remove-platt-duplicates.ts
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Duplicate IDs to remove
const DUPLICATES_TO_REMOVE = [
  "9c03227b-b226-4eec-a625-48c130e8539e", // Harlan Platt (duplicate of Harlan D. Platt)
  "71779d57-d91a-4e6d-9ee0-93025ac4b4c9", // Marjorie Platt (duplicate of Marjorie B. Platt)
];

async function main() {
  console.log("=== Removing Platt Duplicates ===\n");

  // Step 1: Delete connections involving duplicates
  console.log("Step 1: Removing connections involving duplicates...");

  for (const id of DUPLICATES_TO_REMOVE) {
    const { data: connections, error: fetchError } = await supabase
      .from("researcher_connections")
      .select("id")
      .or(`researcher_a_id.eq.${id},researcher_b_id.eq.${id}`);

    if (fetchError) {
      console.error(`Error fetching connections for ${id}:`, fetchError);
      continue;
    }

    if (connections && connections.length > 0) {
      console.log(`  Found ${connections.length} connection(s) for researcher ${id}`);

      const { error: deleteError } = await supabase
        .from("researcher_connections")
        .delete()
        .or(`researcher_a_id.eq.${id},researcher_b_id.eq.${id}`);

      if (deleteError) {
        console.error(`  Error deleting connections:`, deleteError);
      } else {
        console.log(`  Deleted ${connections.length} connection(s)`);
      }
    } else {
      console.log(`  No connections found for researcher ${id}`);
    }
  }

  // Step 2: Delete the duplicate researchers
  console.log("\nStep 2: Removing duplicate researchers...");

  for (const id of DUPLICATES_TO_REMOVE) {
    // First, get the name for logging
    const { data: researcher } = await supabase
      .from("researchers")
      .select("name, institution")
      .eq("id", id)
      .single();

    if (researcher) {
      const { error: deleteError } = await supabase.from("researchers").delete().eq("id", id);

      if (deleteError) {
        console.error(`  Error deleting ${researcher.name}:`, deleteError);
      } else {
        console.log(`  Deleted: ${researcher.name} (${researcher.institution})`);
      }
    } else {
      console.log(`  Researcher ${id} not found (already deleted?)`);
    }
  }

  // Step 3: Verify
  console.log("\n=== Verification ===");

  const { data: remaining } = await supabase
    .from("researchers")
    .select("name, institution")
    .ilike("name", "%Platt%")
    .order("name");

  console.log("\nRemaining Platt researchers:");
  remaining?.forEach((r) => {
    console.log(`  - ${r.name} (${r.institution})`);
  });

  console.log("\n=== Done ===");
}

main().catch(console.error);
