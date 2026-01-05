"use client";

import { useMemo, useState, useCallback } from "react";

// Types
export interface GraphNode {
  id: string;
  name: string;
  institution: string;
  discipline: string;
  publicationCount: number;
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

// Calculate node radius based on publication count
function getNodeRadiusForLayout(publicationCount: number): number {
  const minRadius = 12;
  const maxRadius = 28;
  const minPubs = 1;
  const maxPubs = 20;
  const normalized = Math.min(1, Math.max(0, (publicationCount - minPubs) / (maxPubs - minPubs)));
  return minRadius + normalized * (maxRadius - minRadius);
}

// Simple collision detection and resolution
function resolveCollisions(nodes: GraphNode[], iterations: number = 50): GraphNode[] {
  const result = nodes.map((n) => ({ ...n }));
  const padding = 8; // Minimum gap between nodes

  for (let iter = 0; iter < iterations; iter++) {
    let hasCollision = false;

    for (let i = 0; i < result.length; i++) {
      for (let j = i + 1; j < result.length; j++) {
        const nodeA = result[i];
        const nodeB = result[j];

        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const radiusA = getNodeRadiusForLayout(nodeA.publicationCount);
        const radiusB = getNodeRadiusForLayout(nodeB.publicationCount);
        const minDistance = radiusA + radiusB + padding;

        if (distance < minDistance && distance > 0) {
          hasCollision = true;
          const overlap = minDistance - distance;
          const moveX = (dx / distance) * (overlap / 2);
          const moveY = (dy / distance) * (overlap / 2);

          result[i].x -= moveX;
          result[i].y -= moveY;
          result[j].x += moveX;
          result[j].y += moveY;
        }
      }
    }

    if (!hasCollision) break;
  }

  return result;
}

// Calculate node positions using discipline-based clustering with collision resolution
function calculateNodePositions(
  nodes: Omit<GraphNode, "x" | "y">[],
  width: number,
  height: number
): GraphNode[] {
  if (nodes.length === 0) return [];

  // Group nodes by discipline
  const disciplineGroups: Record<string, Omit<GraphNode, "x" | "y">[]> = {};

  nodes.forEach((node) => {
    if (!disciplineGroups[node.discipline]) {
      disciplineGroups[node.discipline] = [];
    }
    disciplineGroups[node.discipline].push(node);
  });

  const disciplines = Object.keys(disciplineGroups);
  const centerX = width / 2;
  const centerY = height / 2;
  const baseRadius = Math.min(width, height) * 0.32;

  const positionedNodes: GraphNode[] = [];

  // Use deterministic seed based on node id for consistent positioning
  const seededRandom = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash % 1000) / 1000;
  };

  disciplines.forEach((discipline, dIndex) => {
    const group = disciplineGroups[discipline];
    const sectorAngle = (2 * Math.PI) / disciplines.length;
    const sectorStart = sectorAngle * dIndex - Math.PI / 2; // Start from top

    // Sort by publication count (higher = closer to center)
    const sorted = [...group].sort((a, b) => b.publicationCount - a.publicationCount);

    sorted.forEach((node, nIndex) => {
      // Calculate radius: more publications = closer to center
      const maxInGroup = Math.max(sorted.length, 1);
      const radiusFactor = 0.25 + (nIndex / maxInGroup) * 0.75;
      const radius = baseRadius * radiusFactor;

      // Spread nodes within the discipline sector
      const angleRange = sectorAngle * 0.7; // Use 70% of sector
      const angleOffset = seededRandom(node.id) * angleRange - angleRange / 2;
      const angle = sectorStart + sectorAngle / 2 + angleOffset;

      // Small deterministic offset based on node id
      const offsetX = (seededRandom(node.id + "x") - 0.5) * 30;
      const offsetY = (seededRandom(node.id + "y") - 0.5) * 30;

      positionedNodes.push({
        ...node,
        x: centerX + Math.cos(angle) * radius + offsetX,
        y: centerY + Math.sin(angle) * radius + offsetY,
      });
    });
  });

  // Apply collision resolution
  const resolvedNodes = resolveCollisions(positionedNodes);

  // Ensure nodes stay within bounds
  const margin = 50;
  return resolvedNodes.map((node) => ({
    ...node,
    x: Math.max(margin, Math.min(width - margin, node.x)),
    y: Math.max(margin, Math.min(height - margin, node.y)),
  }));
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
  const viewBoxWidth = 900;
  const viewBoxHeight = 650;

  // Calculate positions once
  const positionedNodes = useMemo(() => {
    return calculateNodePositions(nodes, viewBoxWidth, viewBoxHeight);
  }, [nodes]);

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

  // Calculate node radius based on publication count
  const getNodeRadius = useCallback((publicationCount: number) => {
    const minRadius = 12;
    const maxRadius = 28;
    const minPubs = 1;
    const maxPubs = 20;
    const normalized = Math.min(1, Math.max(0, (publicationCount - minPubs) / (maxPubs - minPubs)));
    return minRadius + normalized * (maxRadius - minRadius);
  }, []);

  return (
    <svg
      className="w-full h-full"
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Background */}
      <rect width={viewBoxWidth} height={viewBoxHeight} fill="transparent" />

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
          const radius = getNodeRadius(node.publicationCount);
          const color = DISCIPLINE_COLORS[node.discipline] || "#6B7280";

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
              {(isSelected || isHovered) && <circle r={radius + 8} fill={color} opacity={0.3} />}

              {/* Node circle */}
              <circle
                r={radius}
                fill={color}
                stroke={isSelected ? "#F9FAFB" : "#1F2937"}
                strokeWidth={isSelected ? 3 : 2}
                className="transition-all duration-200"
              />

              {/* High publication count indicator ring */}
              {node.publicationCount >= 5 && (
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
                style={{ fontSize: node.publicationCount >= 5 ? "11px" : "10px" }}
              >
                {node.name.split(" ").pop()}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
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
        Larger nodes = more publications
      </div>
    </div>
  );
}
