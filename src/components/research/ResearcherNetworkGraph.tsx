"use client";

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

// Types
export interface GraphNode {
  id: string;
  name: string;
  institution: string;
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

interface ResearcherNetworkGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  filter: string;
  onNodeSelect: (nodeId: string | null) => void;
  onNodeHover: (nodeId: string | null) => void;
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

// Grid-based layout with connection adjustment
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

  // Calculate grid dimensions
  const n = nodes.length;
  const aspectRatio = usableWidth / usableHeight;
  const cols = Math.ceil(Math.sqrt(n * aspectRatio));
  const rows = Math.ceil(n / cols);
  const cellWidth = usableWidth / cols;
  const cellHeight = usableHeight / rows;

  // Seeded random for jitter
  const seededRandom = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash % 1000) / 1000;
  };

  // Sort nodes by connection count (more connected = more central)
  const sortedNodes = [...nodes].sort((a, b) => {
    const aConns = connections.get(a.id)?.size || 0;
    const bConns = connections.get(b.id)?.size || 0;
    return bConns - aConns;
  });

  // Place in grid with jitter
  const result: GraphNode[] = sortedNodes.map((node, idx) => {
    const row = Math.floor(idx / cols);
    const col = idx % cols;

    // Center position in cell with jitter
    const jitterX = (seededRandom(node.id) - 0.5) * cellWidth * 0.6;
    const jitterY = (seededRandom(node.id + "y") - 0.5) * cellHeight * 0.6;

    return {
      ...node,
      x: padding + (col + 0.5) * cellWidth + jitterX,
      y: padding + (row + 0.5) * cellHeight + jitterY,
    };
  });

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
  }

  return result;
}

export function ResearcherNetworkGraph({
  nodes,
  edges,
  selectedNodeId,
  hoveredNodeId,
  filter,
  onNodeSelect,
  onNodeHover,
}: ResearcherNetworkGraphProps) {
  const viewBoxWidth = 1200; // Increased for more space
  const viewBoxHeight = 900; // Increased for more space

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
  }, [nodes, edges]);

  // Create node map for edge lookups
  const nodeMap = useMemo(() => {
    return new Map(positionedNodes.map((n) => [n.id, n]));
  }, [positionedNodes]);

  // Filter nodes by discipline
  const filteredNodes = useMemo(() => {
    if (filter === "all") return positionedNodes;
    return positionedNodes.filter((n) => n.discipline === filter);
  }, [positionedNodes, filter]);

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

// Legend component
export function GraphLegend({ disciplines }: { disciplines: { key: string; label: string }[] }) {
  return (
    <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-lg p-3 text-xs border border-slate-700">
      <div className="font-semibold mb-2 text-slate-300">Disciplines</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {disciplines.slice(0, 8).map(({ key, label }) => (
          <div key={key} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: DISCIPLINE_COLORS[key] || "#6B7280" }}
            />
            <span className="text-slate-400 truncate">{label}</span>
          </div>
        ))}
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
