"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { systemsGraph, GraphNode, GraphEdge } from "@/data/systemsGraph";

/* ------------------------------------------------------------------ */
/*  Node appearance — keyed by node.type                              */
/* ------------------------------------------------------------------ */

interface NodeStyle {
  radius: number;
  featuredRadius: number;
  color: string;
  featuredColor: string;
  glowColor: string;
  labelColor: string;
  featuredLabelColor: string;
  labelSize: number;
}

const NODE_STYLES: Record<string, NodeStyle> = {
  system: {
    radius: 4.5,
    featuredRadius: 7,
    color: "rgba(180, 190, 240, 0.85)",
    featuredColor: "rgba(240, 243, 255, 0.95)",
    glowColor: "rgba(180, 195, 255, 0.12)",
    labelColor: "rgba(190, 195, 225, 0.85)",
    featuredLabelColor: "rgba(240, 240, 255, 0.95)",
    labelSize: 12,
  },
  domain: {
    radius: 3,
    featuredRadius: 4,
    color: "rgba(100, 125, 185, 0.45)",
    featuredColor: "rgba(120, 145, 205, 0.6)",
    glowColor: "transparent",
    labelColor: "rgba(110, 130, 170, 0.55)",
    featuredLabelColor: "rgba(130, 150, 190, 0.7)",
    labelSize: 9,
  },
  technology: {
    radius: 4,
    featuredRadius: 6,
    color: "rgba(130, 200, 170, 0.7)",
    featuredColor: "rgba(150, 230, 190, 0.9)",
    glowColor: "rgba(130, 200, 170, 0.1)",
    labelColor: "rgba(150, 210, 175, 0.8)",
    featuredLabelColor: "rgba(170, 230, 195, 0.9)",
    labelSize: 11,
  },
  post: {
    radius: 3.5,
    featuredRadius: 5,
    color: "rgba(200, 170, 130, 0.6)",
    featuredColor: "rgba(230, 195, 150, 0.8)",
    glowColor: "transparent",
    labelColor: "rgba(210, 180, 145, 0.7)",
    featuredLabelColor: "rgba(230, 200, 165, 0.8)",
    labelSize: 11,
  },
};

const DEFAULT_STYLE: NodeStyle = {
  radius: 4,
  featuredRadius: 6,
  color: "rgba(160, 160, 160, 0.6)",
  featuredColor: "rgba(190, 190, 190, 0.8)",
  glowColor: "transparent",
  labelColor: "rgba(170, 170, 170, 0.7)",
  featuredLabelColor: "rgba(190, 190, 190, 0.85)",
  labelSize: 11,
};

function getStyle(type: string): NodeStyle {
  return NODE_STYLES[type] ?? DEFAULT_STYLE;
}

/* ------------------------------------------------------------------ */
/*  Layout helpers                                                    */
/* ------------------------------------------------------------------ */

interface LayoutNode {
  id: string;
  label: string;
  type: string;
  featured: boolean;
  baseX: number;
  baseY: number;
  x: number;
  y: number;
}

function buildAdjacency(edges: GraphEdge[]) {
  const adj = new Map<string, string[]>();
  for (const e of edges) {
    if (!adj.has(e.source)) adj.set(e.source, []);
    if (!adj.has(e.target)) adj.set(e.target, []);
    adj.get(e.source)!.push(e.target);
    adj.get(e.target)!.push(e.source);
  }
  return adj;
}

function computeRadialLayout(
  nodes: GraphNode[],
  edges: GraphEdge[],
  cx: number,
  cy: number,
  isMobile: boolean,
): LayoutNode[] {
  const adj = buildAdjacency(edges);
  const domainNodes = nodes.filter((n) => n.type === "domain");
  const systemNodes = nodes.filter((n) => n.type !== "domain");

  const innerRadius = isMobile ? 100 : 160;
  const outerRadius = isMobile ? 185 : 270;

  // Place domains evenly on the inner ring
  const domainPositions = new Map<string, { x: number; y: number; angle: number }>();
  domainNodes.forEach((node, i) => {
    const angle = (i / domainNodes.length) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(angle) * innerRadius;
    const y = cy + Math.sin(angle) * innerRadius;
    domainPositions.set(node.id, { x, y, angle });
  });

  // Place system nodes: average angle of connected domains, on outer ring
  const systemPositions: LayoutNode[] = [];
  const usedAngles: number[] = [];

  for (const node of systemNodes) {
    const connectedDomains = (adj.get(node.id) || [])
      .map((id) => domainPositions.get(id))
      .filter(Boolean) as { x: number; y: number; angle: number }[];

    let angle: number;
    if (connectedDomains.length > 0) {
      // Average angle of connected domains using atan2 of mean vector
      const sumX = connectedDomains.reduce((s, d) => s + Math.cos(d.angle), 0);
      const sumY = connectedDomains.reduce((s, d) => s + Math.sin(d.angle), 0);
      angle = Math.atan2(sumY, sumX);
    } else {
      angle = Math.random() * Math.PI * 2;
    }

    // Nudge to avoid overlaps with other system nodes
    const MIN_ANGLE_GAP = 0.3;
    let attempts = 0;
    while (attempts < 20) {
      const tooClose = usedAngles.some((a) => {
        let diff = Math.abs(angle - a);
        if (diff > Math.PI) diff = Math.PI * 2 - diff;
        return diff < MIN_ANGLE_GAP;
      });
      if (!tooClose) break;
      angle += MIN_ANGLE_GAP * 0.6;
      attempts++;
    }
    usedAngles.push(angle);

    const r = outerRadius + (node.featured ? -15 : 10);
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;

    systemPositions.push({
      id: node.id,
      label: node.label,
      type: node.type,
      featured: !!node.featured,
      baseX: x,
      baseY: y,
      x,
      y,
    });
  }

  // Build domain layout nodes
  const domainLayoutNodes: LayoutNode[] = domainNodes.map((node) => {
    const pos = domainPositions.get(node.id)!;
    return {
      id: node.id,
      label: node.label,
      type: node.type,
      featured: !!node.featured,
      baseX: pos.x,
      baseY: pos.y,
      x: pos.x,
      y: pos.y,
    };
  });

  return [...domainLayoutNodes, ...systemPositions];
}

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const EDGE_COLOR = "rgba(100, 120, 175, 0.08)";
const EDGE_HIGHLIGHT_COLOR = "rgba(170, 185, 245, 0.45)";
const MOBILE_BREAKPOINT = 640;

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function SystemsGalaxy() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const layoutRef = useRef<LayoutNode[]>([]);
  const timeRef = useRef(0);

  const [dimensions, setDimensions] = useState({ width: 900, height: 600 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const isMobile = dimensions.width < MOBILE_BREAKPOINT;

  // Adjacency for highlight lookups — stable since graph data is static
  const adjacencyRef = useRef(buildAdjacency(systemsGraph.edges));

  const getConnected = useCallback((nodeId: string): Set<string> => {
    const set = new Set<string>();
    set.add(nodeId);
    const neighbors = adjacencyRef.current.get(nodeId);
    if (neighbors) neighbors.forEach((id) => set.add(id));
    return set;
  }, []);

  // Measure and layout
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const w = Math.round(el.getBoundingClientRect().width);
      if (w <= 0) return;
      const mobile = w < MOBILE_BREAKPOINT;
      const h = mobile ? 450 : 600;
      setDimensions({ width: w, height: h });
      layoutRef.current = computeRadialLayout(
        systemsGraph.nodes,
        systemsGraph.edges,
        w / 2,
        h / 2,
        mobile,
      );
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Animation loop — subtle floating
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const w = dimensions.width;
      const h = dimensions.height;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.clearRect(0, 0, w, h);

      const nodes = layoutRef.current;
      if (nodes.length === 0) {
        animFrameRef.current = requestAnimationFrame(draw);
        return;
      }

      const time = timeRef.current;
      timeRef.current += 0.003;

      // Update positions with subtle drift
      const nodeMap = new Map<string, LayoutNode>();
      for (const node of nodes) {
        const drift = node.type === "domain" ? 2 : 4;
        const speed = node.featured ? 0.4 : 0.6;
        // Use node id hash for unique phase offset
        let hash = 0;
        for (let i = 0; i < node.id.length; i++) {
          hash = ((hash << 5) - hash + node.id.charCodeAt(i)) | 0;
        }
        const phase = (hash % 1000) / 1000 * Math.PI * 2;
        node.x = node.baseX + Math.sin(time * speed + phase) * drift;
        node.y = node.baseY + Math.cos(time * speed * 0.7 + phase + 1) * drift;
        nodeMap.set(node.id, node);
      }

      const highlighted = hoveredId ? getConnected(hoveredId) : null;

      // Draw edges
      for (const edge of systemsGraph.edges) {
        const from = nodeMap.get(edge.source);
        const to = nodeMap.get(edge.target);
        if (!from || !to) continue;

        const isHL =
          highlighted &&
          highlighted.has(edge.source) &&
          highlighted.has(edge.target);
        const faded = highlighted && !isHL;

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = isHL ? EDGE_HIGHLIGHT_COLOR : EDGE_COLOR;
        ctx.lineWidth = isHL ? 1.5 : 0.5;
        ctx.globalAlpha = faded ? 0.03 : 1;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      // Draw nodes
      for (const node of nodes) {
        const style = getStyle(node.type);
        const isFeatured = node.featured;
        const sf = isMobile ? 0.75 : 1;
        const r = (isFeatured ? style.featuredRadius : style.radius) * sf;
        const color = isFeatured ? style.featuredColor : style.color;
        const isHL = !highlighted || highlighted.has(node.id);
        const isHovered = node.id === hoveredId;

        ctx.globalAlpha = highlighted && !isHL ? 0.06 : 1;

        // Glow for featured / hovered nodes
        if ((isFeatured || isHovered) && style.glowColor !== "transparent") {
          const glowR = isHovered ? r * 3.5 : r * 2.5;
          const glowAlpha = isHovered ? 0.2 : 0.12;
          const gradient = ctx.createRadialGradient(
            node.x, node.y, r * 0.3,
            node.x, node.y, glowR,
          );
          gradient.addColorStop(0, `rgba(180, 195, 255, ${glowAlpha})`);
          gradient.addColorStop(1, "rgba(180, 195, 255, 0)");
          ctx.beginPath();
          ctx.arc(node.x, node.y, glowR, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Node dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Label
        const baseFontSize = isFeatured ? style.labelSize + 1 : style.labelSize;
        const fontSize = baseFontSize * sf;
        const weight = isFeatured ? 600 : 400;
        ctx.font = `${weight} ${fontSize}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = isFeatured ? style.featuredLabelColor : style.labelColor;

        const labelText =
          node.type === "domain" ? node.label.toUpperCase() : node.label;
        ctx.fillText(labelText, node.x, node.y + r + 4);

        ctx.globalAlpha = 1;
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [dimensions, hoveredId, isMobile, getConnected]);

  // Mouse interaction — find nearest node
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      let closest: LayoutNode | null = null;
      let closestDist = Infinity;

      for (const node of layoutRef.current) {
        const style = getStyle(node.type);
        const r = node.featured ? style.featuredRadius : style.radius;
        const hitRadius = r + 12;
        const dx = node.x - mx;
        const dy = node.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < hitRadius && dist < closestDist) {
          closest = node;
          closestDist = dist;
        }
      }

      setHoveredId(closest?.id ?? null);
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null);
  }, []);

  return (
    <section className="py-12 sm:py-20">
      <div
        ref={containerRef}
        className="relative mx-auto w-full max-w-5xl"
        style={{ height: dimensions.height }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{ cursor: hoveredId ? "pointer" : "default" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
      </div>
    </section>
  );
}
