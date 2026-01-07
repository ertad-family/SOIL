/**
 * Populate universities table from researchers.institution field
 * with deduplication: sub-units linked to parent universities
 *
 * Run with: npx tsx scripts/populate-universities.ts
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Deduplication rules: patterns that indicate sub-units
const SUB_UNIT_PATTERNS = [
  // Business schools
  { pattern: /(.+?) Business School$/i, parentSuffix: " University" },
  { pattern: /(.+?) Graduate School of Business$/i, parentSuffix: " University" },
  { pattern: /(.+?) School of Business$/i, parentSuffix: " University" },
  // Medical schools & hospitals
  { pattern: /(.+?) Medical School$/i, parentSuffix: " University" },
  { pattern: /(.+?) School of Medicine$/i, parentSuffix: " University" },
  // Press/publishers (link to university but flag as publisher)
  { pattern: /(.+?) University Press$/i, parentSuffix: " University", isPublisher: true },
  // Graduate schools
  { pattern: /(.+?) Graduate School$/i, parentSuffix: " University" },
  // Specific patterns
  { pattern: /^Stanford Graduate School of Business$/i, parentName: "Stanford University" },
  { pattern: /^Harvard Business School$/i, parentName: "Harvard University" },
  { pattern: /^Harvard University Press$/i, parentName: "Harvard University", isPublisher: true },
  {
    pattern: /^Harvard Affiliated Emergency Medicine Residency$/i,
    parentName: "Harvard University",
  },
  { pattern: /^Jönköping International Business School$/i, parentName: "Jönköping University" },
];

// Known parent universities that should be created first
const KNOWN_PARENTS = ["Stanford University", "Harvard University", "Jönköping University"];

interface InstitutionInfo {
  name: string;
  parentName: string | null;
  isPublisher: boolean;
}

function analyzeInstitution(institution: string): InstitutionInfo {
  // Check specific patterns first
  for (const rule of SUB_UNIT_PATTERNS) {
    if (rule.parentName && rule.pattern.test(institution)) {
      return {
        name: institution,
        parentName: rule.parentName,
        isPublisher: rule.isPublisher || false,
      };
    }
  }

  // Check generic patterns
  for (const rule of SUB_UNIT_PATTERNS) {
    if (!rule.parentName) {
      const match = institution.match(rule.pattern);
      if (match && match[1]) {
        const potentialParent = match[1] + rule.parentSuffix;
        return {
          name: institution,
          parentName: potentialParent,
          isPublisher: rule.isPublisher || false,
        };
      }
    }
  }

  // No pattern matched - this is a standalone institution
  return {
    name: institution,
    parentName: null,
    isPublisher: false,
  };
}

async function main() {
  console.log("=== Populating Universities Table ===\n");

  // Step 1: Get all unique institutions
  const { data: researchers, error } = await supabase
    .from("researchers")
    .select("id, institution")
    .neq("institution", "Unknown");

  if (error) {
    console.error("Error fetching researchers:", error);
    process.exit(1);
  }

  const institutions = new Set<string>();
  researchers?.forEach((r) => {
    if (r.institution) institutions.add(r.institution);
  });

  console.log(`Found ${institutions.size} unique institutions\n`);

  // Step 2: Analyze institutions and identify parents/sub-units
  const analyzed: InstitutionInfo[] = [];
  const parentNames = new Set<string>();
  const subUnits: InstitutionInfo[] = [];

  for (const inst of institutions) {
    const info = analyzeInstitution(inst);
    analyzed.push(info);

    if (info.parentName) {
      parentNames.add(info.parentName);
      subUnits.push(info);
    }
  }

  // Add known parents
  KNOWN_PARENTS.forEach((p) => parentNames.add(p));

  console.log(`Identified ${parentNames.size} parent universities`);
  console.log(`Identified ${subUnits.length} sub-units\n`);

  // Step 3: Create parent universities first
  const universityMap = new Map<string, string>(); // name -> id

  for (const parentName of parentNames) {
    // Check if this parent is also in our institutions list
    const existsInList = institutions.has(parentName);

    const { data, error: insertError } = await supabase
      .from("universities")
      .upsert(
        {
          name: parentName,
          display_name: parentName,
        },
        { onConflict: "name" }
      )
      .select("id")
      .single();

    if (insertError) {
      console.error(`Error creating parent ${parentName}:`, insertError);
      continue;
    }

    if (data) {
      universityMap.set(parentName, data.id);
      console.log(`Created parent: ${parentName}${existsInList ? " (also in institutions)" : ""}`);
    }
  }

  // Step 4: Create all other institutions (non-parents and sub-units)
  for (const inst of institutions) {
    if (universityMap.has(inst)) continue; // Already created as parent

    const info = analyzeInstitution(inst);
    const parentId = info.parentName ? universityMap.get(info.parentName) : null;

    const { data, error: insertError } = await supabase
      .from("universities")
      .upsert(
        {
          name: inst,
          display_name: inst,
          parent_id: parentId || null,
        },
        { onConflict: "name" }
      )
      .select("id")
      .single();

    if (insertError) {
      console.error(`Error creating ${inst}:`, insertError);
      continue;
    }

    if (data) {
      universityMap.set(inst, data.id);
      if (parentId) {
        console.log(`Created sub-unit: ${inst} -> ${info.parentName}`);
      } else {
        console.log(`Created standalone: ${inst}`);
      }
    }
  }

  // Step 5: Update researchers with university_id
  console.log("\n=== Updating researchers with university_id ===\n");

  let updated = 0;
  let errors = 0;

  for (const researcher of researchers || []) {
    const universityId = universityMap.get(researcher.institution);
    if (!universityId) {
      console.warn(`No university found for: ${researcher.institution}`);
      continue;
    }

    const { error: updateError } = await supabase
      .from("researchers")
      .update({ university_id: universityId })
      .eq("id", researcher.id);

    if (updateError) {
      console.error(`Error updating researcher ${researcher.id}:`, updateError);
      errors++;
    } else {
      updated++;
    }
  }

  console.log(`\nUpdated ${updated} researchers, ${errors} errors`);

  // Step 6: Summary
  console.log("\n=== Summary ===");
  const { count: uniCount } = await supabase
    .from("universities")
    .select("*", { count: "exact", head: true });

  const { count: parentCount } = await supabase
    .from("universities")
    .select("*", { count: "exact", head: true })
    .is("parent_id", null);

  const { count: linkedCount } = await supabase
    .from("researchers")
    .select("*", { count: "exact", head: true })
    .not("university_id", "is", null);

  console.log(`Total universities: ${uniCount}`);
  console.log(`Parent universities (no parent_id): ${parentCount}`);
  console.log(`Sub-units (has parent_id): ${(uniCount || 0) - (parentCount || 0)}`);
  console.log(`Researchers linked: ${linkedCount}`);

  // Show universities with 3+ researchers after deduplication
  console.log("\n=== Universities with 3+ researchers (for clustering) ===");

  const { data: clusterData } = await supabase.rpc("get_university_researcher_counts");

  if (clusterData) {
    const filtered = clusterData.filter((u: { count: number }) => u.count >= 3);
    filtered.forEach((u: { name: string; count: number }) => {
      console.log(`  ${u.name}: ${u.count} researchers`);
    });
  } else {
    // Manual query if RPC doesn't exist
    const { data: manualData } = await supabase
      .from("researchers")
      .select("university_id, universities!inner(name, parent_id)")
      .not("university_id", "is", null);

    if (manualData) {
      const countByParent = new Map<string, number>();
      for (const r of manualData) {
        // Supabase returns arrays for joins
        type UniJoin = Array<{ name: string; parent_id: string | null }>;
        const uniArray = r.universities as UniJoin;
        const uni = uniArray?.[0];
        if (!uni) continue;
        // Use parent name if sub-unit, else use own name
        const clusterName = uni.parent_id ? universityMap.get(uni.name) || uni.name : uni.name;
        countByParent.set(clusterName, (countByParent.get(clusterName) || 0) + 1);
      }

      for (const [name, count] of countByParent) {
        if (count >= 3) {
          console.log(`  ${name}: ${count} researchers`);
        }
      }
    }
  }

  console.log("\n=== Done ===");
}

main().catch(console.error);
