/**
 * Test to detect cluster frame overlaps in the Research Atlas graph
 * Run with: npx tsx tests/cluster-overlap.test.ts
 */

// Types matching the graph component
interface GraphNode {
  id: string;
  name: string;
  institution: string;
  discipline: string;
  citedByCount: number;
  parentUniversityName: string | null;
}

interface ClusterBounds {
  name: string;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

const MIN_RESEARCHERS_FOR_CLUSTER = 2;

// Simplified node radius calculation (matching the component)
function getNodeRadiusForLayout(citedByCount: number): number {
  const minRadius = 8;
  const maxRadius = 40;
  const maxCitations = 114008;
  const sqrtScale = Math.sqrt(citedByCount) / Math.sqrt(maxCitations);
  return minRadius + sqrtScale * (maxRadius - minRadius);
}

// Get significant universities (2+ researchers)
function getSignificantUniversities(nodes: GraphNode[]): Map<string, string[]> {
  const universityMap = new Map<string, string[]>();

  nodes.forEach((node) => {
    const uni = node.parentUniversityName || node.institution;
    if (uni && uni !== "Unknown") {
      if (!universityMap.has(uni)) {
        universityMap.set(uni, []);
      }
      universityMap.get(uni)!.push(node.id);
    }
  });

  // Filter to only universities with MIN_RESEARCHERS_FOR_CLUSTER+ researchers
  const significant = new Map<string, string[]>();
  universityMap.forEach((ids, name) => {
    if (ids.length >= MIN_RESEARCHERS_FOR_CLUSTER) {
      significant.set(name, ids);
    }
  });

  return significant;
}

// Seeded random for consistent positions
function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash % 1000) / 1000;
}

interface PositionedNode {
  id: string;
  x: number;
  y: number;
  citedByCount: number;
}

// Full node positioning algorithm matching the component
function calculateNodePositions(
  nodes: GraphNode[],
  width: number,
  height: number
): { positions: Map<string, { x: number; y: number }>; clusterBounds: ClusterBounds[] } {
  const padding = 60;
  const usableWidth = width - 2 * padding;
  const usableHeight = height - 2 * padding;

  const significantUniversities = getSignificantUniversities(nodes);
  const clusteredNodeIds = new Set<string>();
  significantUniversities.forEach((ids) => ids.forEach((id) => clusteredNodeIds.add(id)));

  const unclusteredNodes = nodes.filter((n) => !clusteredNodeIds.has(n.id));
  const universityList = Array.from(significantUniversities.entries());
  const numClusters = universityList.length;
  const clusterRows = Math.ceil(Math.sqrt(numClusters + 1));
  const clusterCols = Math.ceil((numClusters + 1) / clusterRows);

  const regionGap = 60;
  const regionWidth = (usableWidth - regionGap * (clusterCols - 1)) / clusterCols;
  const regionHeight = (usableHeight - regionGap * (clusterRows - 1)) / clusterRows;

  const result: PositionedNode[] = [];

  // Position clustered nodes - COMPACT placement in center of region
  universityList.forEach(([, nodeIds], clusterIdx) => {
    const row = Math.floor(clusterIdx / clusterCols);
    const col = clusterIdx % clusterCols;
    const regionX = padding + col * (regionWidth + regionGap);
    const regionY = padding + row * (regionHeight + regionGap);

    const clusterNodes = nodes
      .filter((n) => nodeIds.includes(n.id))
      .sort((a, b) => b.citedByCount - a.citedByCount);

    // Fixed compact cell size (matching component)
    const clusterCount = clusterNodes.length;
    const localCols = Math.ceil(Math.sqrt(clusterCount));
    const localRows = Math.ceil(clusterCount / localCols);
    const cellW = 80;
    const cellH = 80;

    // Center cluster content in region
    const clusterContentWidth = localCols * cellW;
    const clusterContentHeight = localRows * cellH;
    const clusterStartX = regionX + (regionWidth - clusterContentWidth) / 2;
    const clusterStartY = regionY + 20 + (regionHeight - 20 - clusterContentHeight) / 2;

    clusterNodes.forEach((node, idx) => {
      const localRow = Math.floor(idx / localCols);
      const localCol = idx % localCols;
      const jitterX = (seededRandom(node.id) - 0.5) * 20;
      const jitterY = (seededRandom(node.id + "y") - 0.5) * 20;

      result.push({
        id: node.id,
        x: clusterStartX + (localCol + 0.5) * cellW + jitterX,
        y: clusterStartY + (localRow + 0.5) * cellH + jitterY,
        citedByCount: node.citedByCount,
      });
    });
  });

  // Position unclustered nodes
  if (unclusteredNodes.length > 0) {
    const unclusteredRegionIdx = numClusters;
    const row = Math.floor(unclusteredRegionIdx / clusterCols);
    const col = unclusteredRegionIdx % clusterCols;
    const startX = padding + col * (regionWidth + regionGap);
    const startY = padding + row * (regionHeight + regionGap);
    const availableWidth = col < clusterCols - 1 ? (clusterCols - col) * regionWidth : regionWidth;
    const availableHeight =
      row < clusterRows - 1 ? (clusterRows - row) * regionHeight : regionHeight;

    const n = unclusteredNodes.length;
    const aspectRatio = availableWidth / availableHeight;
    const localCols = Math.ceil(Math.sqrt(n * aspectRatio));
    const localRows = Math.ceil(n / localCols);
    const cellWidth = availableWidth / localCols;
    const cellHeight = availableHeight / localRows;

    unclusteredNodes.forEach((node, idx) => {
      const localRow = Math.floor(idx / localCols);
      const localCol = idx % localCols;
      const jitterX = (seededRandom(node.id) - 0.5) * cellWidth * 0.5;
      const jitterY = (seededRandom(node.id + "y") - 0.5) * cellHeight * 0.5;

      result.push({
        id: node.id,
        x: startX + (localCol + 0.5) * cellWidth + jitterX,
        y: startY + (localRow + 0.5) * cellHeight + jitterY,
        citedByCount: node.citedByCount,
      });
    });
  }

  // Node-to-node collision resolution
  const minSeparation = 25;
  for (let iter = 0; iter < 100; iter++) {
    let hasOverlap = false;
    for (let i = 0; i < result.length; i++) {
      for (let j = i + 1; j < result.length; j++) {
        const dx = result[j].x - result[i].x;
        const dy = result[j].y - result[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.1;
        const ri = getNodeRadiusForLayout(result[i].citedByCount);
        const rj = getNodeRadiusForLayout(result[j].citedByCount);
        const minDist = ri + rj + minSeparation;

        if (dist < minDist) {
          hasOverlap = true;
          const overlap = minDist - dist;
          const pushX = (dx / dist) * overlap * 0.5;
          const pushY = (dy / dist) * overlap * 0.5;
          result[i].x -= pushX;
          result[i].y -= pushY;
          result[j].x += pushX;
          result[j].y += pushY;
          result[i].x = Math.max(padding + ri, Math.min(width - padding - ri, result[i].x));
          result[i].y = Math.max(padding + ri, Math.min(height - padding - ri, result[i].y));
          result[j].x = Math.max(padding + rj, Math.min(width - padding - rj, result[j].x));
          result[j].y = Math.max(padding + rj, Math.min(height - padding - rj, result[j].y));
        }
      }
    }
    if (!hasOverlap) break;
  }

  // Intra-cluster attraction: pull nodes towards their cluster center to make compact clusters
  const intraClusterIterations = 30;
  const intraClusterStrength = 0.15;

  for (let iter = 0; iter < intraClusterIterations; iter++) {
    // For each cluster, calculate center and pull nodes towards it
    universityList.forEach(([, nodeIds]) => {
      // Get indices of nodes in this cluster
      const clusterIndices: number[] = [];
      result.forEach((node, idx) => {
        if (nodeIds.includes(node.id)) {
          clusterIndices.push(idx);
        }
      });
      if (clusterIndices.length < 2) return;

      // Calculate cluster center
      let sumX = 0,
        sumY = 0;
      clusterIndices.forEach((idx) => {
        sumX += result[idx].x;
        sumY += result[idx].y;
      });
      const centerX = sumX / clusterIndices.length;
      const centerY = sumY / clusterIndices.length;

      // Pull each node towards center
      clusterIndices.forEach((idx) => {
        const dx = centerX - result[idx].x;
        const dy = centerY - result[idx].y;
        result[idx].x += dx * intraClusterStrength;
        result[idx].y += dy * intraClusterStrength;
      });
    });

    // Re-run collision resolution to prevent overlaps
    for (let collisionIter = 0; collisionIter < 5; collisionIter++) {
      let hasOverlap = false;
      for (let i = 0; i < result.length; i++) {
        for (let j = i + 1; j < result.length; j++) {
          const dx = result[j].x - result[i].x;
          const dy = result[j].y - result[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.1;
          const ri = getNodeRadiusForLayout(result[i].citedByCount);
          const rj = getNodeRadiusForLayout(result[j].citedByCount);
          const minDist = ri + rj + minSeparation;

          if (dist < minDist) {
            hasOverlap = true;
            const overlap = minDist - dist;
            const pushX = (dx / dist) * overlap * 0.5;
            const pushY = (dy / dist) * overlap * 0.5;
            result[i].x -= pushX;
            result[i].y -= pushY;
            result[j].x += pushX;
            result[j].y += pushY;
          }
        }
      }
      if (!hasOverlap) break;
    }
  }

  // Calculate initial cluster bounds
  const clusterPadding = 40;
  const clusterBounds: ClusterBounds[] = [];

  universityList.forEach(([name, nodeIds]) => {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    nodeIds.forEach((id) => {
      const node = result.find((n) => n.id === id);
      if (!node) return;
      const radius = getNodeRadiusForLayout(node.citedByCount);
      minX = Math.min(minX, node.x - radius);
      minY = Math.min(minY, node.y - radius);
      maxX = Math.max(maxX, node.x + radius);
      maxY = Math.max(maxY, node.y + radius);
    });
    clusterBounds.push({
      name,
      minX: minX - clusterPadding,
      maxX: maxX + clusterPadding,
      minY: minY - clusterPadding - 20,
      maxY: maxY + clusterPadding,
    });
  });

  // Map cluster index to node indices
  const clusterNodeIndices: number[][] = [];
  universityList.forEach(([, nodeIds]) => {
    const indices: number[] = [];
    result.forEach((node, idx) => {
      if (nodeIds.includes(node.id)) {
        indices.push(idx);
      }
    });
    clusterNodeIndices.push(indices);
  });

  // Cluster-to-cluster collision
  const clusterSeparation = 30;
  for (let clusterIter = 0; clusterIter < 50; clusterIter++) {
    let hasPush = false;

    // Recalculate cluster bounds
    for (let ci = 0; ci < clusterNodeIndices.length; ci++) {
      const indices = clusterNodeIndices[ci];
      if (indices.length === 0) continue;
      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;
      indices.forEach((idx) => {
        const node = result[idx];
        const radius = getNodeRadiusForLayout(node.citedByCount);
        minX = Math.min(minX, node.x - radius);
        minY = Math.min(minY, node.y - radius);
        maxX = Math.max(maxX, node.x + radius);
        maxY = Math.max(maxY, node.y + radius);
      });
      clusterBounds[ci] = {
        name: clusterBounds[ci].name,
        minX: minX - clusterPadding,
        maxX: maxX + clusterPadding,
        minY: minY - clusterPadding - 20,
        maxY: maxY + clusterPadding,
      };
    }

    // Check all pairs of clusters for overlap
    for (let ci = 0; ci < clusterBounds.length; ci++) {
      for (let cj = ci + 1; cj < clusterBounds.length; cj++) {
        const a = clusterBounds[ci];
        const b = clusterBounds[cj];
        const overlapX = a.maxX + clusterSeparation > b.minX && a.minX - clusterSeparation < b.maxX;
        const overlapY = a.maxY + clusterSeparation > b.minY && a.minY - clusterSeparation < b.maxY;

        if (overlapX && overlapY) {
          hasPush = true;
          const dx = b.minX + (b.maxX - b.minX) / 2 - (a.minX + (a.maxX - a.minX) / 2);
          const dy = b.minY + (b.maxY - b.minY) / 2 - (a.minY + (a.maxY - a.minY) / 2);
          const overlapAmountX =
            Math.min(a.maxX, b.maxX) - Math.max(a.minX, b.minX) + clusterSeparation;
          const overlapAmountY =
            Math.min(a.maxY, b.maxY) - Math.max(a.minY, b.minY) + clusterSeparation;

          let pushX = 0,
            pushY = 0;
          if (overlapAmountX < overlapAmountY) {
            pushX = (dx > 0 ? 1 : -1) * (overlapAmountX / 2 + 5);
          } else {
            pushY = (dy > 0 ? 1 : -1) * (overlapAmountY / 2 + 5);
          }

          clusterNodeIndices[ci].forEach((idx) => {
            result[idx].x -= pushX;
            result[idx].y -= pushY;
            const r = getNodeRadiusForLayout(result[idx].citedByCount);
            result[idx].x = Math.max(padding + r, Math.min(width - padding - r, result[idx].x));
            result[idx].y = Math.max(padding + r, Math.min(height - padding - r, result[idx].y));
          });

          clusterNodeIndices[cj].forEach((idx) => {
            result[idx].x += pushX;
            result[idx].y += pushY;
            const r = getNodeRadiusForLayout(result[idx].citedByCount);
            result[idx].x = Math.max(padding + r, Math.min(width - padding - r, result[idx].x));
            result[idx].y = Math.max(padding + r, Math.min(height - padding - r, result[idx].y));
          });
        }
      }
    }
    if (!hasPush) break;
  }

  // Final cluster bounds recalculation
  for (let ci = 0; ci < clusterNodeIndices.length; ci++) {
    const indices = clusterNodeIndices[ci];
    if (indices.length === 0) continue;
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    indices.forEach((idx) => {
      const node = result[idx];
      const radius = getNodeRadiusForLayout(node.citedByCount);
      minX = Math.min(minX, node.x - radius);
      minY = Math.min(minY, node.y - radius);
      maxX = Math.max(maxX, node.x + radius);
      maxY = Math.max(maxY, node.y + radius);
    });
    clusterBounds[ci] = {
      name: clusterBounds[ci].name,
      minX: minX - clusterPadding,
      maxX: maxX + clusterPadding,
      minY: minY - clusterPadding - 20,
      maxY: maxY + clusterPadding,
    };
  }

  // Convert to positions map
  const positions = new Map<string, { x: number; y: number }>();
  result.forEach((node) => {
    positions.set(node.id, { x: node.x, y: node.y });
  });

  return { positions, clusterBounds };
}

// Check if two rectangles overlap
function rectanglesOverlap(a: ClusterBounds, b: ClusterBounds, gap: number = 0): boolean {
  const overlapX = a.maxX + gap > b.minX && a.minX - gap < b.maxX;
  const overlapY = a.maxY + gap > b.minY && a.minY - gap < b.maxY;
  return overlapX && overlapY;
}

// Calculate overlap area
function calculateOverlapArea(a: ClusterBounds, b: ClusterBounds): number {
  const overlapX = Math.max(0, Math.min(a.maxX, b.maxX) - Math.max(a.minX, b.minX));
  const overlapY = Math.max(0, Math.min(a.maxY, b.maxY) - Math.max(a.minY, b.minY));
  return overlapX * overlapY;
}

// Main test function
async function testClusterOverlaps() {
  console.log("=== Cluster Overlap Test ===\n");

  // Fetch real data from API
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  let researchers: GraphNode[] = [];

  try {
    const response = await fetch(`${baseUrl}/api/researchers`);
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    const data = await response.json();
    researchers = data.researchers.map(
      (r: {
        id: string;
        name: string;
        institution: string;
        discipline: string;
        openalex_cited_by_count: number;
        parent_university_name: string | null;
      }) => ({
        id: r.id,
        name: r.name,
        institution: r.institution,
        discipline: r.discipline,
        citedByCount: r.openalex_cited_by_count || 0,
        parentUniversityName: r.parent_university_name,
      })
    );
    console.log(`Fetched ${researchers.length} researchers from API\n`);
  } catch (error) {
    console.error("Failed to fetch from API:", error);
    console.log("Using mock data instead...\n");

    // Mock data for testing without API
    researchers = [
      {
        id: "1",
        name: "R1",
        institution: "University of Michigan",
        discipline: "sociology",
        citedByCount: 50000,
        parentUniversityName: "University of Michigan",
      },
      {
        id: "2",
        name: "R2",
        institution: "University of Michigan",
        discipline: "sociology",
        citedByCount: 30000,
        parentUniversityName: "University of Michigan",
      },
      {
        id: "3",
        name: "R3",
        institution: "University of Michigan",
        discipline: "economics",
        citedByCount: 20000,
        parentUniversityName: "University of Michigan",
      },
      {
        id: "4",
        name: "R4",
        institution: "Northeastern University",
        discipline: "sociology",
        citedByCount: 15000,
        parentUniversityName: "Northeastern University",
      },
      {
        id: "5",
        name: "R5",
        institution: "Northeastern University",
        discipline: "psychology",
        citedByCount: 10000,
        parentUniversityName: "Northeastern University",
      },
      {
        id: "6",
        name: "R6",
        institution: "Arizona State University",
        discipline: "ecology",
        citedByCount: 8000,
        parentUniversityName: "Arizona State University",
      },
      {
        id: "7",
        name: "R7",
        institution: "Arizona State University",
        discipline: "biology",
        citedByCount: 5000,
        parentUniversityName: "Arizona State University",
      },
      {
        id: "8",
        name: "R8",
        institution: "Stanford University",
        discipline: "economics",
        citedByCount: 100000,
        parentUniversityName: "Stanford University",
      },
      {
        id: "9",
        name: "R9",
        institution: "Stanford GSB",
        discipline: "economics",
        citedByCount: 80000,
        parentUniversityName: "Stanford University",
      },
    ];
  }

  // Get significant universities
  const significantUniversities = getSignificantUniversities(researchers);
  console.log(
    `Found ${significantUniversities.size} clusters with ${MIN_RESEARCHERS_FOR_CLUSTER}+ researchers:`
  );
  significantUniversities.forEach((ids, name) => {
    console.log(`  - ${name}: ${ids.length} researchers`);
  });
  console.log();

  // Calculate dynamic viewBox
  const extraClusters = Math.max(0, significantUniversities.size - 5);
  const viewBoxWidth = 1400 + extraClusters * 180;
  const viewBoxHeight = 1000 + extraClusters * 120;
  console.log(`ViewBox: ${viewBoxWidth}x${viewBoxHeight}\n`);

  // Calculate positions and bounds
  const { clusterBounds } = calculateNodePositions(researchers, viewBoxWidth, viewBoxHeight);

  console.log("Cluster bounding boxes:");
  clusterBounds.forEach((bounds) => {
    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;
    console.log(`  ${bounds.name}:`);
    console.log(`    Position: (${bounds.minX.toFixed(0)}, ${bounds.minY.toFixed(0)})`);
    console.log(`    Size: ${width.toFixed(0)}x${height.toFixed(0)}`);
  });
  console.log();

  // Check for overlaps
  let overlapsFound = 0;
  const overlaps: { a: string; b: string; area: number }[] = [];

  for (let i = 0; i < clusterBounds.length; i++) {
    for (let j = i + 1; j < clusterBounds.length; j++) {
      const a = clusterBounds[i];
      const b = clusterBounds[j];

      if (rectanglesOverlap(a, b)) {
        overlapsFound++;
        const area = calculateOverlapArea(a, b);
        overlaps.push({ a: a.name, b: b.name, area });
      }
    }
  }

  console.log("=== RESULTS ===\n");

  if (overlapsFound === 0) {
    console.log("✅ NO OVERLAPS DETECTED!");
    console.log("All cluster frames are properly separated.\n");
  } else {
    console.log(`❌ FOUND ${overlapsFound} OVERLAP(S):\n`);
    overlaps.forEach(({ a, b, area }) => {
      console.log(`  ⚠️  "${a}" overlaps with "${b}"`);
      console.log(`      Overlap area: ${area.toFixed(0)} sq units\n`);
    });
  }

  // Also check for "near misses" (clusters that are very close)
  const nearMissGap = 30;
  const nearMisses: { a: string; b: string; gap: number }[] = [];

  for (let i = 0; i < clusterBounds.length; i++) {
    for (let j = i + 1; j < clusterBounds.length; j++) {
      const a = clusterBounds[i];
      const b = clusterBounds[j];

      if (!rectanglesOverlap(a, b) && rectanglesOverlap(a, b, nearMissGap)) {
        // Calculate actual gap
        const gapX = Math.max(b.minX - a.maxX, a.minX - b.maxX);
        const gapY = Math.max(b.minY - a.maxY, a.minY - b.maxY);
        const gap = Math.max(gapX, gapY);
        nearMisses.push({ a: a.name, b: b.name, gap });
      }
    }
  }

  if (nearMisses.length > 0) {
    console.log(`⚡ ${nearMisses.length} NEAR MISS(ES) (gap < ${nearMissGap}px):\n`);
    nearMisses.forEach(({ a, b, gap }) => {
      console.log(`  "${a}" ↔ "${b}": gap = ${gap.toFixed(0)}px`);
    });
    console.log();
  }

  // Check intra-cluster distances
  console.log("=== INTRA-CLUSTER DISTANCES ===\n");
  const { positions } = calculateNodePositions(researchers, viewBoxWidth, viewBoxHeight);

  const MAX_ACCEPTABLE_DISTANCE = 200; // Max distance between researchers in same cluster
  let hasLargeCluster = false;

  significantUniversities.forEach((nodeIds, universityName) => {
    if (nodeIds.length < 2) return;

    // Get positions for this cluster
    const clusterPositions: { id: string; x: number; y: number }[] = [];
    nodeIds.forEach((id) => {
      const pos = positions.get(id);
      if (pos) {
        clusterPositions.push({ id, x: pos.x, y: pos.y });
      }
    });

    if (clusterPositions.length < 2) return;

    // Calculate all pairwise distances
    const distances: number[] = [];
    for (let i = 0; i < clusterPositions.length; i++) {
      for (let j = i + 1; j < clusterPositions.length; j++) {
        const dx = clusterPositions[j].x - clusterPositions[i].x;
        const dy = clusterPositions[j].y - clusterPositions[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        distances.push(dist);
      }
    }

    const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
    const maxDistance = Math.max(...distances);
    const minDistance = Math.min(...distances);

    // Calculate cluster center
    const centerX = clusterPositions.reduce((sum, p) => sum + p.x, 0) / clusterPositions.length;
    const centerY = clusterPositions.reduce((sum, p) => sum + p.y, 0) / clusterPositions.length;

    // Max distance from center
    const maxFromCenter = Math.max(
      ...clusterPositions.map((p) => Math.sqrt((p.x - centerX) ** 2 + (p.y - centerY) ** 2))
    );

    const isLarge = maxDistance > MAX_ACCEPTABLE_DISTANCE;
    if (isLarge) hasLargeCluster = true;

    const status = isLarge ? "❌" : "✅";
    console.log(`${status} ${universityName} (${nodeIds.length} researchers):`);
    console.log(`    Min distance: ${minDistance.toFixed(0)}px`);
    console.log(`    Avg distance: ${avgDistance.toFixed(0)}px`);
    console.log(`    Max distance: ${maxDistance.toFixed(0)}px`);
    console.log(`    Max from center: ${maxFromCenter.toFixed(0)}px`);

    // Show individual positions
    clusterPositions.forEach((p) => {
      const researcher = researchers.find((r) => r.id === p.id);
      console.log(`      - ${researcher?.name || p.id}: (${p.x.toFixed(0)}, ${p.y.toFixed(0)})`);
    });
    console.log();
  });

  if (hasLargeCluster) {
    console.log(
      `\n❌ PROBLEM: Some clusters have researchers > ${MAX_ACCEPTABLE_DISTANCE}px apart!`
    );
    console.log("   Intra-cluster attraction is not working properly.\n");
  } else {
    console.log("\n✅ All clusters are compact (researchers within acceptable distance).\n");
  }

  // Exit with error code if overlaps found or clusters too large
  if (overlapsFound > 0 || hasLargeCluster) {
    process.exit(1);
  }
}

testClusterOverlaps().catch(console.error);
