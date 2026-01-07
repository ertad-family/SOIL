"use client";

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

// Types
export interface GraphNode {
  id: string;
  name: string;
  institution: string;
  parentUniversityName: string | null; // For clustering sub-units with parent
  discipline: string;
  publicationCount: number;
  citedByCount: number;
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  label: string | null;
}

// University cluster for grouping
interface UniversityCluster {
  name: string;
  nodeIds: string[];
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ResearcherNetworkGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  selectedUniversity: string | null;
  filter: string;
  selectedDisciplines: Set<string>;
  onNodeSelect: (nodeId: string | null) => void;
  onNodeHover: (nodeId: string | null) => void;
  onUniversitySelect: (name: string | null) => void;
}

// Discipline colors matching the app's design system
const DISCIPLINE_COLORS: Record<string, string> = {
  biology: "#10B981", // green
  ecology: "#10B981", // green
  economics: "#F59E0B", // amber
  sociology: "#6366F1", // indigo
  psychology: "#8B5CF6", // purple
  political_science: "#EF4444", // red
  anthropology: "#F97316", // orange
  cybernetics: "#06B6D4", // cyan
  systems_theory: "#3B82F6", // blue
  information_theory: "#6366F1", // indigo
  evolutionary_theory: "#14B8A6", // teal
  medicine: "#EC4899", // pink
};

// Edge styles by connection type
const EDGE_STYLES: Record<string, { stroke: string; strokeWidth: number; dashArray: string }> = {
  coauthor: { stroke: "#4B5563", strokeWidth: 2, dashArray: "none" },
  cofounder: { stroke: "#1F2937", strokeWidth: 3, dashArray: "none" },
  colleague: { stroke: "#9CA3AF", strokeWidth: 1.5, dashArray: "5,5" },
  influence: { stroke: "#D1D5DB", strokeWidth: 1, dashArray: "3,3" },
  thematic: { stroke: "#E5E7EB", strokeWidth: 1, dashArray: "8,4" },
  advisor: { stroke: "#F59E0B", strokeWidth: 2, dashArray: "none" },
};

// Minimum researchers for a university to get its own cluster
const MIN_RESEARCHERS_FOR_CLUSTER = 2;

// Calculate node radius based on citation count (using sqrt scale for better visual differentiation)
// Distribution: min=0, median=5740, p75=14743, max=114008
function getNodeRadiusForLayout(citedByCount: number): number {
  const minRadius = 8;
  const maxRadius = 40;
  // Use sqrt scale - gives better visual spread than log for this distribution
  // sqrt(0) = 0, sqrt(5740) = 76, sqrt(114008) = 338
  const maxSqrt = Math.sqrt(120000); // ~346
  const sqrtCitations = Math.sqrt(citedByCount);
  const normalized = Math.min(1, sqrtCitations / maxSqrt);
  return minRadius + normalized * (maxRadius - minRadius);
}

// Identify significant universities (3+ researchers)
// Uses parentUniversityName for clustering (aggregates sub-units with parent)
function getSignificantUniversities(nodes: Omit<GraphNode, "x" | "y">[]): Map<string, string[]> {
  const universityMap = new Map<string, string[]>();

  nodes.forEach((node) => {
    // Use parent university name for clustering, fall back to institution
    const uni = node.parentUniversityName || node.institution;
    if (uni && uni !== "Unknown") {
      if (!universityMap.has(uni)) {
        universityMap.set(uni, []);
      }
      universityMap.get(uni)!.push(node.id);
    }
  });

  // Filter to only significant universities
  const significant = new Map<string, string[]>();
  universityMap.forEach((nodeIds, uni) => {
    if (nodeIds.length >= MIN_RESEARCHERS_FOR_CLUSTER) {
      significant.set(uni, nodeIds);
    }
  });

  return significant;
}

// Calculate bounding boxes for university clusters
function calculateClusterBounds(
  positionedNodes: GraphNode[],
  significantUniversities: Map<string, string[]>
): UniversityCluster[] {
  const clusters: UniversityCluster[] = [];
  const padding = 25; // Padding around cluster

  significantUniversities.forEach((nodeIds, universityName) => {
    const clusterNodes = positionedNodes.filter((n) => nodeIds.includes(n.id));
    if (clusterNodes.length === 0) return;

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    clusterNodes.forEach((node) => {
      const radius = getNodeRadiusForLayout(node.citedByCount);
      minX = Math.min(minX, node.x - radius);
      minY = Math.min(minY, node.y - radius);
      maxX = Math.max(maxX, node.x + radius);
      maxY = Math.max(maxY, node.y + radius);
    });

    clusters.push({
      name: universityName,
      nodeIds,
      x: minX - padding,
      y: minY - padding - 18, // Extra space for label
      width: maxX - minX + 2 * padding,
      height: maxY - minY + 2 * padding + 18,
    });
  });

  return clusters;
}

// Grid-based layout with university clustering
function calculateNodePositions(
  nodes: Omit<GraphNode, "x" | "y">[],
  edges: { source: string; target: string }[],
  width: number,
  height: number
): GraphNode[] {
  if (nodes.length === 0) return [];

  const padding = 60;
  const usableWidth = width - 2 * padding;
  const usableHeight = height - 2 * padding;

  // Create connection map
  const connections = new Map<string, Set<string>>();
  edges.forEach((e) => {
    if (!connections.has(e.source)) connections.set(e.source, new Set());
    if (!connections.has(e.target)) connections.set(e.target, new Set());
    connections.get(e.source)!.add(e.target);
    connections.get(e.target)!.add(e.source);
  });

  // Seeded random for jitter
  const seededRandom = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash % 1000) / 1000;
  };

  // Get significant universities
  const significantUniversities = getSignificantUniversities(nodes);
  const clusteredNodeIds = new Set<string>();
  significantUniversities.forEach((ids) => ids.forEach((id) => clusteredNodeIds.add(id)));

  // Separate clustered and unclustered nodes
  const unclusteredNodes = nodes.filter((n) => !clusteredNodeIds.has(n.id));
  const universityList = Array.from(significantUniversities.entries());

  // Calculate layout regions
  // Universities get dedicated rectangular regions, unclustered nodes fill remaining space
  const numClusters = universityList.length;
  const clusterRows = Math.ceil(Math.sqrt(numClusters + 1)); // +1 for unclustered
  const clusterCols = Math.ceil((numClusters + 1) / clusterRows);
  const regionWidth = usableWidth / clusterCols;
  const regionHeight = usableHeight / clusterRows;

  const result: GraphNode[] = [];

  // Position clustered nodes within their university regions
  universityList.forEach(([, nodeIds], clusterIdx) => {
    const row = Math.floor(clusterIdx / clusterCols);
    const col = clusterIdx % clusterCols;
    const regionX = padding + col * regionWidth;
    const regionY = padding + row * regionHeight;
    const innerPadding = 30;

    // Get cluster nodes and sort by citations
    const clusterNodes = nodes
      .filter((n) => nodeIds.includes(n.id))
      .sort((a, b) => b.citedByCount - a.citedByCount);

    // Position within region
    const clusterCount = clusterNodes.length;
    const localCols = Math.ceil(Math.sqrt(clusterCount));
    const localRows = Math.ceil(clusterCount / localCols);
    const cellW = (regionWidth - 2 * innerPadding) / Math.max(1, localCols);
    const cellH = (regionHeight - 2 * innerPadding - 20) / Math.max(1, localRows); // 20 for label

    clusterNodes.forEach((node, idx) => {
      const localRow = Math.floor(idx / localCols);
      const localCol = idx % localCols;
      const jitterX = (seededRandom(node.id) - 0.5) * cellW * 0.4;
      const jitterY = (seededRandom(node.id + "y") - 0.5) * cellH * 0.4;

      result.push({
        ...node,
        x: regionX + innerPadding + (localCol + 0.5) * cellW + jitterX,
        y: regionY + innerPadding + 20 + (localRow + 0.5) * cellH + jitterY, // +20 for label space
      });
    });
  });

  // Position unclustered nodes in remaining region(s)
  if (unclusteredNodes.length > 0) {
    const unclusteredRegionIdx = numClusters;
    const row = Math.floor(unclusteredRegionIdx / clusterCols);
    const col = unclusteredRegionIdx % clusterCols;

    // If there's remaining space, use it; otherwise spread in remaining cells
    const startX = padding + col * regionWidth;
    const startY = padding + row * regionHeight;

    // Calculate how much width/height is available
    const availableWidth = col < clusterCols - 1 ? (clusterCols - col) * regionWidth : regionWidth;
    const availableHeight =
      row < clusterRows - 1 ? (clusterRows - row) * regionHeight : regionHeight;

    const n = unclusteredNodes.length;
    const aspectRatio = availableWidth / availableHeight;
    const localCols = Math.ceil(Math.sqrt(n * aspectRatio));
    const localRows = Math.ceil(n / localCols);
    const cellWidth = availableWidth / localCols;
    const cellHeight = availableHeight / localRows;

    // Sort unclustered by connections
    const sortedUnclustered = [...unclusteredNodes].sort((a, b) => {
      const aConns = connections.get(a.id)?.size || 0;
      const bConns = connections.get(b.id)?.size || 0;
      return bConns - aConns;
    });

    sortedUnclustered.forEach((node, idx) => {
      const localRow = Math.floor(idx / localCols);
      const localCol = idx % localCols;
      const jitterX = (seededRandom(node.id) - 0.5) * cellWidth * 0.5;
      const jitterY = (seededRandom(node.id + "y") - 0.5) * cellHeight * 0.5;

      result.push({
        ...node,
        x: startX + (localCol + 0.5) * cellWidth + jitterX,
        y: startY + (localRow + 0.5) * cellHeight + jitterY,
      });
    });
  }

  // Collision resolution - push overlapping nodes apart until no overlaps
  const maxIterations = 100;
  const minSeparation = 25; // Extra pixels between nodes (includes space for labels)

  for (let iter = 0; iter < maxIterations; iter++) {
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

          // Push both nodes apart
          result[i].x -= pushX;
          result[i].y -= pushY;
          result[j].x += pushX;
          result[j].y += pushY;

          // Keep within bounds
          result[i].x = Math.max(padding + ri, Math.min(width - padding - ri, result[i].x));
          result[i].y = Math.max(padding + ri, Math.min(height - padding - ri, result[i].y));
          result[j].x = Math.max(padding + rj, Math.min(width - padding - rj, result[j].x));
          result[j].y = Math.max(padding + rj, Math.min(height - padding - rj, result[j].y));
        }
      }
    }

    // Stop if no overlaps found
    if (!hasOverlap) break;
  }

  // Cluster-aware collision: push unclustered nodes away from cluster boxes
  const clusterPadding = 40; // Extra padding around cluster boxes
  const clusterBounds: Array<{
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    centerX: number;
    centerY: number;
  }> = [];

  // Calculate cluster bounding boxes with extra padding
  significantUniversities.forEach((nodeIds) => {
    const clusterNodes = result.filter((n) => nodeIds.includes(n.id));
    if (clusterNodes.length === 0) return;

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    clusterNodes.forEach((node) => {
      const radius = getNodeRadiusForLayout(node.citedByCount);
      minX = Math.min(minX, node.x - radius);
      minY = Math.min(minY, node.y - radius);
      maxX = Math.max(maxX, node.x + radius);
      maxY = Math.max(maxY, node.y + radius);
    });

    clusterBounds.push({
      minX: minX - clusterPadding,
      maxX: maxX + clusterPadding,
      minY: minY - clusterPadding - 20, // Extra for label
      maxY: maxY + clusterPadding,
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2,
    });
  });

  // Push unclustered nodes away from cluster boxes
  for (let iter = 0; iter < 30; iter++) {
    let hasPush = false;

    for (let i = 0; i < result.length; i++) {
      // Skip nodes that belong to a cluster
      if (clusteredNodeIds.has(result[i].id)) continue;

      const nodeRadius = getNodeRadiusForLayout(result[i].citedByCount);

      for (const bounds of clusterBounds) {
        // Check if node overlaps with cluster box
        const nodeLeft = result[i].x - nodeRadius;
        const nodeRight = result[i].x + nodeRadius;
        const nodeTop = result[i].y - nodeRadius;
        const nodeBottom = result[i].y + nodeRadius;

        const overlapsX = nodeRight > bounds.minX && nodeLeft < bounds.maxX;
        const overlapsY = nodeBottom > bounds.minY && nodeTop < bounds.maxY;

        if (overlapsX && overlapsY) {
          hasPush = true;

          // Push away from cluster center
          const dx = result[i].x - bounds.centerX;
          const dy = result[i].y - bounds.centerY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.1;

          // Calculate minimum distance to escape the box
          const escapeX = dx > 0 ? bounds.maxX - nodeLeft + 5 : bounds.minX - nodeRight - 5;
          const escapeY = dy > 0 ? bounds.maxY - nodeTop + 5 : bounds.minY - nodeBottom - 5;

          // Push in the direction that requires less movement
          if (Math.abs(escapeX) < Math.abs(escapeY)) {
            result[i].x += escapeX;
          } else {
            result[i].y += escapeY;
          }

          // Keep within bounds
          result[i].x = Math.max(
            padding + nodeRadius,
            Math.min(width - padding - nodeRadius, result[i].x)
          );
          result[i].y = Math.max(
            padding + nodeRadius,
            Math.min(height - padding - nodeRadius, result[i].y)
          );
        }
      }
    }

    if (!hasPush) break;
  }

  // Light attraction for connected nodes (after collision resolution)
  const attractionIterations = 15;
  const attractionStrength = 0.01;

  for (let iter = 0; iter < attractionIterations; iter++) {
    const forces = result.map(() => ({ fx: 0, fy: 0 }));

    for (let i = 0; i < result.length; i++) {
      const nodeConnections = connections.get(result[i].id);
      if (nodeConnections) {
        for (let j = 0; j < result.length; j++) {
          if (nodeConnections.has(result[j].id)) {
            const dx = result[j].x - result[i].x;
            const dy = result[j].y - result[i].y;
            forces[i].fx += dx * attractionStrength;
            forces[i].fy += dy * attractionStrength;
          }
        }
      }
    }

    // Apply attraction
    for (let i = 0; i < result.length; i++) {
      result[i].x += forces[i].fx;
      result[i].y += forces[i].fy;
    }

    // Re-run collision resolution after attraction
    for (let collisionIter = 0; collisionIter < 10; collisionIter++) {
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

    // CRITICAL: Re-run cluster-aware collision after attraction pulled nodes around
    // This prevents nodes from being pulled back into cluster boxes
    for (let i = 0; i < result.length; i++) {
      if (clusteredNodeIds.has(result[i].id)) continue;

      const nodeRadius = getNodeRadiusForLayout(result[i].citedByCount);

      for (const bounds of clusterBounds) {
        const nodeLeft = result[i].x - nodeRadius;
        const nodeRight = result[i].x + nodeRadius;
        const nodeTop = result[i].y - nodeRadius;
        const nodeBottom = result[i].y + nodeRadius;

        const overlapsX = nodeRight > bounds.minX && nodeLeft < bounds.maxX;
        const overlapsY = nodeBottom > bounds.minY && nodeTop < bounds.maxY;

        if (overlapsX && overlapsY) {
          const dx = result[i].x - bounds.centerX;
          const dy = result[i].y - bounds.centerY;
          const escapeX = dx > 0 ? bounds.maxX - nodeLeft + 5 : bounds.minX - nodeRight - 5;
          const escapeY = dy > 0 ? bounds.maxY - nodeTop + 5 : bounds.minY - nodeBottom - 5;

          if (Math.abs(escapeX) < Math.abs(escapeY)) {
            result[i].x += escapeX;
          } else {
            result[i].y += escapeY;
          }

          result[i].x = Math.max(
            padding + nodeRadius,
            Math.min(width - padding - nodeRadius, result[i].x)
          );
          result[i].y = Math.max(
            padding + nodeRadius,
            Math.min(height - padding - nodeRadius, result[i].y)
          );
        }
      }
    }
  }

  // FINAL PASS: Ensure no unclustered nodes remain inside cluster boxes
  // This is critical because attraction and node-to-node collision can push nodes back in
  for (let finalIter = 0; finalIter < 50; finalIter++) {
    let anyPushed = false;

    for (let i = 0; i < result.length; i++) {
      if (clusteredNodeIds.has(result[i].id)) continue;

      const nodeRadius = getNodeRadiusForLayout(result[i].citedByCount);

      for (const bounds of clusterBounds) {
        const nodeLeft = result[i].x - nodeRadius;
        const nodeRight = result[i].x + nodeRadius;
        const nodeTop = result[i].y - nodeRadius;
        const nodeBottom = result[i].y + nodeRadius;

        const overlapsX = nodeRight > bounds.minX && nodeLeft < bounds.maxX;
        const overlapsY = nodeBottom > bounds.minY && nodeTop < bounds.maxY;

        if (overlapsX && overlapsY) {
          anyPushed = true;
          const dx = result[i].x - bounds.centerX;
          const dy = result[i].y - bounds.centerY;
          const escapeX = dx > 0 ? bounds.maxX - nodeLeft + 10 : bounds.minX - nodeRight - 10;
          const escapeY = dy > 0 ? bounds.maxY - nodeTop + 10 : bounds.minY - nodeBottom - 10;

          if (Math.abs(escapeX) < Math.abs(escapeY)) {
            result[i].x += escapeX;
          } else {
            result[i].y += escapeY;
          }

          result[i].x = Math.max(
            padding + nodeRadius,
            Math.min(width - padding - nodeRadius, result[i].x)
          );
          result[i].y = Math.max(
            padding + nodeRadius,
            Math.min(height - padding - nodeRadius, result[i].y)
          );
        }
      }
    }

    if (!anyPushed) break;
  }

  return result;
}

export function ResearcherNetworkGraph({
  nodes,
  edges,
  selectedNodeId,
  hoveredNodeId,
  selectedUniversity,
  filter,
  selectedDisciplines,
  onNodeSelect,
  onNodeHover,
  onUniversitySelect,
}: ResearcherNetworkGraphProps) {
  // Calculate dynamic viewBox based on number of clusters
  // More clusters = more space needed
  const significantUniversitiesCount = useMemo(() => {
    const universityMap = new Map<string, number>();
    nodes.forEach((node) => {
      const uni = node.parentUniversityName || node.institution;
      if (uni && uni !== "Unknown") {
        universityMap.set(uni, (universityMap.get(uni) || 0) + 1);
      }
    });
    return Array.from(universityMap.values()).filter(
      (count) => count >= MIN_RESEARCHERS_FOR_CLUSTER
    ).length;
  }, [nodes]);

  // Scale viewBox based on cluster count: base 1200x900, add 150px per cluster beyond 5
  const extraClusters = Math.max(0, significantUniversitiesCount - 5);
  const viewBoxWidth = 1200 + extraClusters * 120;
  const viewBoxHeight = 900 + extraClusters * 80;

  // Ref for attaching non-passive wheel listener
  const svgRef = useRef<SVGSVGElement>(null);

  // Zoom state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);

  // Sensible zoom limits: 50% to 200%
  const minZoom = 0.5;
  const maxZoom = 2;

  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(maxZoom, z * 1.3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(minZoom, z / 1.3));
  }, []);

  const handleReset = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Attach non-passive wheel listener to prevent page scroll
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom((z) => Math.min(maxZoom, Math.max(minZoom, z * delta)));
    };

    // Use { passive: false } to allow preventDefault
    svg.addEventListener("wheel", handleWheel, { passive: false });
    return () => svg.removeEventListener("wheel", handleWheel);
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 0) {
        // Prevent text selection during drag
        e.preventDefault();
        if ((e.target as SVGElement).tagName === "rect") {
          setIsDragging(true);
          setHasDragged(false);
          setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
        }
      }
    },
    [pan]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        // Mark as dragged if moved more than 5 pixels
        if (!hasDragged && (Math.abs(newX - pan.x) > 5 || Math.abs(newY - pan.y) > 5)) {
          setHasDragged(true);
        }
        setPan({ x: newX, y: newY });
      }
    },
    [isDragging, dragStart, hasDragged, pan]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      // If clicked on background without dragging, deselect
      if (isDragging && !hasDragged && (e.target as SVGElement).tagName === "rect") {
        onNodeSelect(null);
      }
      setIsDragging(false);
    },
    [isDragging, hasDragged, onNodeSelect]
  );

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Calculate positions: radial by discipline/citations + connection adjustment
  const positionedNodes = useMemo(() => {
    return calculateNodePositions(nodes, edges, viewBoxWidth, viewBoxHeight);
  }, [nodes, edges, viewBoxWidth, viewBoxHeight]);

  // Create node map for edge lookups
  const nodeMap = useMemo(() => {
    return new Map(positionedNodes.map((n) => [n.id, n]));
  }, [positionedNodes]);

  // Filter nodes by discipline (using legend multi-select)
  const filteredNodes = useMemo(() => {
    // If no disciplines selected in legend, show nothing
    if (selectedDisciplines.size === 0) return [];
    // Filter by both top filter bar and legend selection
    let filtered = positionedNodes;
    if (filter !== "all") {
      filtered = filtered.filter((n) => n.discipline === filter);
    }
    // Apply legend discipline filter
    filtered = filtered.filter((n) => selectedDisciplines.has(n.discipline));
    return filtered;
  }, [positionedNodes, filter, selectedDisciplines]);

  // Calculate university clusters for visible nodes
  const universityClusters = useMemo(() => {
    const significantUniversities = getSignificantUniversities(filteredNodes);
    return calculateClusterBounds(filteredNodes, significantUniversities);
  }, [filteredNodes]);

  const filteredNodeIds = useMemo(() => {
    return new Set(filteredNodes.map((n) => n.id));
  }, [filteredNodes]);

  // Filter edges to only include those between visible nodes
  const filteredEdges = useMemo(() => {
    return edges.filter((e) => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target));
  }, [edges, filteredNodeIds]);

  // Check if a node is connected to the active (selected or hovered) node
  const isConnected = useCallback(
    (nodeId: string) => {
      const activeNode = hoveredNodeId || selectedNodeId;
      if (!activeNode) return true;
      if (nodeId === activeNode) return true;
      return edges.some(
        (e) =>
          (e.source === activeNode && e.target === nodeId) ||
          (e.target === activeNode && e.source === nodeId)
      );
    },
    [edges, hoveredNodeId, selectedNodeId]
  );

  // Check if an edge is connected to the active node
  const isEdgeConnected = useCallback(
    (edge: GraphEdge) => {
      const activeNode = hoveredNodeId || selectedNodeId;
      if (!activeNode) return true;
      return edge.source === activeNode || edge.target === activeNode;
    },
    [hoveredNodeId, selectedNodeId]
  );

  // Calculate node radius based on citation count (using sqrt scale)
  const getNodeRadius = useCallback((citedByCount: number) => {
    const minRadius = 8;
    const maxRadius = 40;
    const maxSqrt = Math.sqrt(120000);
    const sqrtCitations = Math.sqrt(citedByCount);
    const normalized = Math.min(1, sqrtCitations / maxSqrt);
    return minRadius + normalized * (maxRadius - minRadius);
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Zoom Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
          title="Reset view"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <div className="mt-1 px-2 py-1 bg-slate-800/90 backdrop-blur-sm rounded text-xs text-slate-400 text-center border border-slate-700">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      <svg
        ref={svgRef}
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="xMidYMid meet"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background (clickable for pan) */}
        <rect
          width={viewBoxWidth}
          height={viewBoxHeight}
          fill="transparent"
          className="cursor-grab"
        />

        {/* Transform group for zoom and pan */}
        <g
          transform={`translate(${viewBoxWidth / 2 + pan.x / zoom}, ${viewBoxHeight / 2 + pan.y / zoom}) scale(${zoom}) translate(${-viewBoxWidth / 2}, ${-viewBoxHeight / 2})`}
        >
          {/* University cluster boxes */}
          <g className="clusters">
            {universityClusters.map((cluster) => {
              const isSelected = selectedUniversity === cluster.name;
              return (
                <g key={cluster.name}>
                  {/* Dashed border rectangle - clickable */}
                  <rect
                    x={cluster.x}
                    y={cluster.y}
                    width={cluster.width}
                    height={cluster.height}
                    fill={isSelected ? "rgba(59, 130, 246, 0.08)" : "rgba(59, 130, 246, 0.03)"}
                    stroke={isSelected ? "#60A5FA" : "#3B82F6"}
                    strokeWidth={isSelected ? 2 : 1}
                    strokeDasharray={isSelected ? "none" : "6,4"}
                    rx={8}
                    ry={8}
                    opacity={isSelected ? 0.9 : 0.6}
                    className="cursor-pointer hover:fill-blue-500/10 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUniversitySelect(isSelected ? null : cluster.name);
                    }}
                  />
                  {/* University name label */}
                  <text
                    x={cluster.x + 8}
                    y={cluster.y + 14}
                    className={`pointer-events-none transition-colors ${
                      isSelected ? "fill-blue-300" : "fill-blue-400/70"
                    }`}
                    style={{ fontSize: "10px", fontWeight: isSelected ? 600 : 500 }}
                  >
                    {cluster.name.length > 35 ? cluster.name.slice(0, 32) + "..." : cluster.name}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Edges */}
          <g className="edges">
            {filteredEdges.map((edge) => {
              const source = nodeMap.get(edge.source);
              const target = nodeMap.get(edge.target);
              if (!source || !target) return null;

              const style = EDGE_STYLES[edge.type] || EDGE_STYLES.thematic;
              const connected = isEdgeConnected(edge);

              return (
                <line
                  key={edge.id}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={style.stroke}
                  strokeWidth={style.strokeWidth}
                  strokeDasharray={style.dashArray}
                  opacity={connected ? 0.8 : 0.1}
                  className="transition-opacity duration-200"
                />
              );
            })}
          </g>

          {/* Nodes */}
          <g className="nodes">
            {filteredNodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isHovered = hoveredNodeId === node.id;
              const connected = isConnected(node.id);
              const radius = getNodeRadius(node.citedByCount);
              const color = DISCIPLINE_COLORS[node.discipline] || "#6B7280";
              // High citation threshold: 1000+ citations
              const isHighCitation = node.citedByCount >= 1000;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => onNodeSelect(isSelected ? null : node.id)}
                  onMouseEnter={() => onNodeHover(node.id)}
                  onMouseLeave={() => onNodeHover(null)}
                  className="cursor-pointer"
                  opacity={connected ? 1 : 0.2}
                >
                  {/* Glow effect for active nodes */}
                  {(isSelected || isHovered) && (
                    <circle r={radius + 8} fill={color} opacity={0.3} />
                  )}

                  {/* Node circle */}
                  <circle
                    r={radius}
                    fill={color}
                    stroke={isSelected ? "#F9FAFB" : "#1F2937"}
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-all duration-200"
                  />

                  {/* High citation indicator ring */}
                  {isHighCitation && (
                    <circle
                      r={radius + 4}
                      fill="none"
                      stroke={color}
                      strokeWidth={1}
                      strokeDasharray="3,3"
                      opacity={0.6}
                    />
                  )}

                  {/* Label (last name) */}
                  <text
                    y={radius + 14}
                    textAnchor="middle"
                    className="fill-slate-300 text-[10px] font-medium pointer-events-none"
                    style={{ fontSize: isHighCitation ? "11px" : "10px" }}
                  >
                    {node.name.split(" ").pop()}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      </svg>
    </div>
  );
}

// Legend component with clickable discipline filters
export function GraphLegend({
  disciplines,
  selectedDisciplines,
  onDisciplineToggle,
  onSelectAll,
  onSelectNone,
}: {
  disciplines: { key: string; label: string }[];
  selectedDisciplines: Set<string>;
  onDisciplineToggle: (discipline: string) => void;
  onSelectAll: () => void;
  onSelectNone: () => void;
}) {
  const allSelected = disciplines.every((d) => selectedDisciplines.has(d.key));
  const noneSelected = selectedDisciplines.size === 0;

  return (
    <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-lg p-3 text-xs border border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-slate-300">Disciplines</span>
        <div className="flex gap-1">
          <button
            onClick={onSelectAll}
            className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
              allSelected
                ? "bg-gold-500/20 text-gold-400"
                : "bg-slate-700 text-slate-400 hover:bg-slate-600"
            }`}
          >
            All
          </button>
          <button
            onClick={onSelectNone}
            className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
              noneSelected
                ? "bg-gold-500/20 text-gold-400"
                : "bg-slate-700 text-slate-400 hover:bg-slate-600"
            }`}
          >
            None
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {disciplines.slice(0, 12).map(({ key, label }) => {
          const isSelected = selectedDisciplines.has(key);
          return (
            <button
              key={key}
              onClick={() => onDisciplineToggle(key)}
              className={`flex items-center gap-1.5 text-left transition-opacity ${
                isSelected ? "opacity-100" : "opacity-40"
              } hover:opacity-100`}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0 transition-all"
                style={{
                  backgroundColor: DISCIPLINE_COLORS[key] || "#6B7280",
                  boxShadow: isSelected ? `0 0 6px ${DISCIPLINE_COLORS[key] || "#6B7280"}` : "none",
                }}
              />
              <span className="text-slate-400 truncate">{label}</span>
            </button>
          );
        })}
      </div>
      <div className="border-t border-slate-700 mt-2 pt-2">
        <div className="font-semibold mb-1 text-slate-300">Connections</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-gray-600" />
            <span className="text-slate-400">Co-author</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5" style={{ borderTop: "2px dashed #9CA3AF" }} />
            <span className="text-slate-400">Colleague / Influence</span>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-700 mt-2 pt-2 text-slate-500">
        Larger nodes = more citations
      </div>
    </div>
  );
}
