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
    featuredRadius: 8,
    color: "rgba(180, 190, 240, 0.85)",
    featuredColor: "rgba(245, 247, 255, 0.97)",
    glowColor: "rgba(170, 190, 255, 0.18)",
    labelColor: "rgba(190, 195, 225, 0.85)",
    featuredLabelColor: "rgba(240, 240, 255, 0.95)",
    labelSize: 12,
  },
  domain: {
    radius: 4.5,
    featuredRadius: 5.5,
    color: "rgba(110, 135, 200, 0.5)",
    featuredColor: "rgba(130, 155, 220, 0.65)",
    glowColor: "rgba(110, 140, 210, 0.08)",
    labelColor: "rgba(140, 160, 200, 0.7)",
    featuredLabelColor: "rgba(160, 180, 215, 0.8)",
    labelSize: 10.5,
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

type StarLayer = "far" | "mid" | "near";

/** Per-arm asymmetry for diffraction spikes */
interface SpikeGeometry {
  /** Base spike length = radius * this multiplier */
  lengthMul: number;
  /** Asymmetry per arm: [left, right, top, bottom] as 0.6–1.2 multipliers */
  arms: [number, number, number, number];
  /** Whether this star also gets short diagonal spikes */
  diagonals: boolean;
  /** Diagonal asymmetry per arm: [tl, br, tr, bl] */
  diagArms: [number, number, number, number];
}

interface BgStar {
  x: number;
  y: number;
  r: number;
  alpha: number;
  layer: StarLayer;
  /** Unique phase for twinkle */
  phase: number;
  /** RGB color string */
  color: string;
  /** Pre-computed spike geometry, or null if no spikes */
  spike: SpikeGeometry | null;
}

/** Layer-specific config for depth, parallax, drift, and glow */
const STAR_LAYERS: Record<StarLayer, {
  radiusMin: number; radiusMax: number;
  alphaMin: number; alphaMax: number;
  parallax: number;
  driftMul: number;
  glowMul: number;    // glow radius = star radius * glowMul
}> = {
  far:  { radiusMin: 0.2, radiusMax: 0.5, alphaMin: 0.08, alphaMax: 0.2,  parallax: 0.3, driftMul: 0.3, glowMul: 2 },
  mid:  { radiusMin: 0.5, radiusMax: 0.9, alphaMin: 0.15, alphaMax: 0.35, parallax: 0.7, driftMul: 0.7, glowMul: 4 },
  near: { radiusMin: 0.9, radiusMax: 1.4, alphaMin: 0.25, alphaMax: 0.5,  parallax: 1.5, driftMul: 1.3, glowMul: 6 },
};

/** Weighted color temperature palette for background stars */
const STAR_COLORS = [
  { color: "255,255,255", weight: 0.85 },   // white
  { color: "230,240,255", weight: 0.07 },   // blue-white
  { color: "255,210,127", weight: 0.06 },   // warm yellow
  { color: "255,176,122", weight: 0.02 },   // soft orange
];

interface Nebula {
  x: number;
  y: number;
  radius: number;
  color: string;
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

/** Deterministic pseudo-random from seed */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pickStarColor(rand: () => number): string {
  const roll = rand();
  let cumulative = 0;
  for (const entry of STAR_COLORS) {
    cumulative += entry.weight;
    if (roll < cumulative) return entry.color;
  }
  return STAR_COLORS[0].color;
}

function generateBgStars(w: number, h: number, count: number): BgStar[] {
  const rand = seededRandom(42);
  const stars: BgStar[] = [];
  // Distribute: ~50% far, ~30% mid, ~20% near
  const layerDist: { layer: StarLayer; share: number }[] = [
    { layer: "far", share: 0.5 },
    { layer: "mid", share: 0.3 },
    { layer: "near", share: 0.2 },
  ];
  for (const { layer, share } of layerDist) {
    const cfg = STAR_LAYERS[layer];
    const n = Math.round(count * share);
    for (let i = 0; i < n; i++) {
      // Spikes: ~45% near, ~15% mid, 0% far
      const spikeChance = layer === "near" ? 0.45 : layer === "mid" ? 0.15 : 0;
      const hasSpikes = rand() < spikeChance;
      let spike: SpikeGeometry | null = null;
      if (hasSpikes) {
        const armRand = () => 0.6 + rand() * 0.6; // 0.6–1.2
        spike = {
          lengthMul: 4 + rand() * 5, // 4–9× radius
          arms: [armRand(), armRand(), armRand(), armRand()],
          diagonals: rand() < 0.4, // 40% of spiked stars get diagonals
          diagArms: [armRand(), armRand(), armRand(), armRand()],
        };
      }
      stars.push({
        x: rand() * w,
        y: rand() * h,
        r: cfg.radiusMin + rand() * (cfg.radiusMax - cfg.radiusMin),
        alpha: cfg.alphaMin + rand() * (cfg.alphaMax - cfg.alphaMin),
        layer,
        phase: rand() * Math.PI * 2,
        color: pickStarColor(rand),
        spike,
      });
    }
  }
  return stars;
}

function generateNebulae(w: number, h: number): Nebula[] {
  const rand = seededRandom(7);
  const colors = [
    "rgba(120, 150, 255, 0.06)",
    "rgba(255, 200, 120, 0.05)",
    "rgba(160, 120, 255, 0.04)",
    "rgba(100, 200, 220, 0.04)",
  ];
  return colors.map((color) => ({
    x: w * 0.15 + rand() * w * 0.7,
    y: h * 0.15 + rand() * h * 0.7,
    radius: Math.min(w, h) * (0.25 + rand() * 0.2),
    color,
  }));
}

function computeRadialLayout(
  nodes: GraphNode[],
  edges: GraphEdge[],
  cx: number,
  cy: number,
  containerWidth: number,
  isMobile: boolean,
): LayoutNode[] {
  const adj = buildAdjacency(edges);
  const domainNodes = nodes.filter((n) => n.type === "domain");
  const systemNodes = nodes.filter((n) => n.type !== "domain");

  // Scale radii to ~42% / ~55% of container half-width
  const outerRadius = isMobile
    ? containerWidth * 0.38
    : containerWidth * 0.42;
  const innerRadius = outerRadius * 0.55;

  // Place domains evenly on the inner ring
  const domainPositions = new Map<
    string,
    { x: number; y: number; angle: number }
  >();
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
      const sumX = connectedDomains.reduce(
        (s, d) => s + Math.cos(d.angle),
        0,
      );
      const sumY = connectedDomains.reduce(
        (s, d) => s + Math.sin(d.angle),
        0,
      );
      angle = Math.atan2(sumY, sumX);
    } else {
      angle = Math.random() * Math.PI * 2;
    }

    // Nudge to avoid overlaps
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

    const r = outerRadius + (node.featured ? -10 : 15);
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
const BG_STAR_COUNT = 800;

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function SystemsGalaxy() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const layoutRef = useRef<LayoutNode[]>([]);
  const bgStarsRef = useRef<BgStar[]>([]);
  const nebulaeRef = useRef<Nebula[]>([]);
  const mouseOffsetRef = useRef({ x: 0, y: 0 });

  const [dimensions, setDimensions] = useState({ width: 900, height: 600 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hoveredIdRef = useRef<string | null>(null);

  const isMobile = dimensions.width < MOBILE_BREAKPOINT;
  const isMobileRef = useRef(isMobile);

  // Keep refs in sync for animation loop reads
  useEffect(() => { hoveredIdRef.current = hoveredId; }, [hoveredId]);
  useEffect(() => { isMobileRef.current = isMobile; }, [isMobile]);

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
      bgStarsRef.current = generateBgStars(w, h, BG_STAR_COUNT);
      nebulaeRef.current = generateNebulae(w, h);
      layoutRef.current = computeRadialLayout(
        systemsGraph.nodes,
        systemsGraph.edges,
        w / 2,
        h / 2,
        w,
        mobile,
      );
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Animation loop — runs continuously, reads state from refs
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const animate = (timestamp: number) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // Time in seconds from rAF timestamp
      const time = timestamp / 1000;

      const dpr = window.devicePixelRatio || 1;
      const w = dimensions.width;
      const h = dimensions.height;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.clearRect(0, 0, w, h);

      const px = mouseOffsetRef.current.x;
      const py = mouseOffsetRef.current.y;

      // Slow directional drift — linear flow toward upper-left
      // ~3px/sec horizontal, ~1.5px/sec vertical
      const driftSpeed = 3;
      const driftAngle = -2.6; // roughly toward upper-left (radians)
      const driftX = time * driftSpeed * Math.cos(driftAngle);
      const driftY = time * driftSpeed * Math.sin(driftAngle);

      // Nebula layer (behind everything) — bounded slow oscillation
      const nebulaDriftX = Math.sin(time * 0.15) * 6 * Math.cos(driftAngle);
      const nebulaDriftY = Math.sin(time * 0.15) * 6 * Math.sin(driftAngle);
      for (const neb of nebulaeRef.current) {
        const nx = neb.x + nebulaDriftX + px * 0.5;
        const ny = neb.y + nebulaDriftY + py * 0.5;
        const gradient = ctx.createRadialGradient(
          nx, ny, 0,
          nx, ny, neb.radius,
        );
        gradient.addColorStop(0, neb.color);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      }

      // Star field — layered depth with glow + core
      for (const star of bgStarsRef.current) {
        const cfg = STAR_LAYERS[star.layer];
        let sx = star.x + driftX * cfg.driftMul + px * cfg.parallax;
        let sy = star.y + driftY * cfg.driftMul + py * cfg.parallax;
        sx += Math.sin(time * 0.3 + star.phase) * 0.5;
        sy += Math.cos(time * 0.25 + star.phase) * 0.5;
        sx = ((sx % w) + w) % w;
        sy = ((sy % h) + h) % h;

        // Twinkle modulates both glow and core
        const twinkle = 1 + Math.sin(time * 1.5 + star.phase) * 0.15;
        const baseAlpha = star.alpha * twinkle;

        // Soft radial glow
        const glowR = star.r * cfg.glowMul;
        const glowGradient = ctx.createRadialGradient(
          sx, sy, star.r * 0.3,
          sx, sy, glowR,
        );
        glowGradient.addColorStop(0, `rgba(${star.color}, ${baseAlpha * 0.4})`);
        glowGradient.addColorStop(0.5, `rgba(${star.color}, ${baseAlpha * 0.1})`);
        glowGradient.addColorStop(1, `rgba(${star.color}, 0)`);
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(sx, sy, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        // Bright core
        ctx.globalAlpha = baseAlpha;
        ctx.beginPath();
        ctx.arc(sx, sy, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${star.color})`;
        ctx.fill();

        // Diffraction spikes — asymmetrical cross lines
        if (star.spike) {
          const sp = star.spike;
          const baseLen = star.r * sp.lengthMul * (0.85 + twinkle * 0.15);
          const spikeAlpha = baseAlpha * 0.3;
          ctx.strokeStyle = `rgb(${star.color})`;
          ctx.lineWidth = 0.5;

          // Horizontal: left / right with independent asymmetry
          ctx.globalAlpha = spikeAlpha;
          ctx.beginPath();
          ctx.moveTo(sx - baseLen * sp.arms[0], sy);
          ctx.lineTo(sx + baseLen * sp.arms[1], sy);
          ctx.stroke();

          // Vertical: top / bottom
          ctx.beginPath();
          ctx.moveTo(sx, sy - baseLen * sp.arms[2]);
          ctx.lineTo(sx, sy + baseLen * sp.arms[3]);
          ctx.stroke();

          // Optional short diagonals (~50% base length)
          if (sp.diagonals) {
            const diagBase = baseLen * 0.5;
            ctx.globalAlpha = spikeAlpha * 0.45;
            ctx.beginPath();
            ctx.moveTo(sx - diagBase * sp.diagArms[0], sy - diagBase * sp.diagArms[0]);
            ctx.lineTo(sx + diagBase * sp.diagArms[1], sy + diagBase * sp.diagArms[1]);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(sx + diagBase * sp.diagArms[2], sy - diagBase * sp.diagArms[2]);
            ctx.lineTo(sx - diagBase * sp.diagArms[3], sy + diagBase * sp.diagArms[3]);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      const nodes = layoutRef.current;
      if (nodes.length === 0) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // Constellation nodes — bounded oscillation keeps them centered
      // Gentle directional float within ±4px range
      const constellationDriftX = Math.sin(time * 0.25) * 4 * Math.cos(driftAngle);
      const constellationDriftY = Math.sin(time * 0.25) * 4 * Math.sin(driftAngle);
      const nodeMap = new Map<string, LayoutNode>();
      for (const node of nodes) {
        let hash = 0;
        for (let i = 0; i < node.id.length; i++) {
          hash = ((hash << 5) - hash + node.id.charCodeAt(i)) | 0;
        }
        const phase = ((hash % 1000) / 1000) * Math.PI * 2;
        const noiseX = Math.sin(time * 0.3 + phase) * 0.5;
        const noiseY = Math.cos(time * 0.25 + phase + 1) * 0.5;

        node.x = node.baseX + constellationDriftX + px + noiseX;
        node.y = node.baseY + constellationDriftY + py + noiseY;
        nodeMap.set(node.id, node);
      }

      const currentHoveredId = hoveredIdRef.current;
      const highlighted = currentHoveredId ? getConnected(currentHoveredId) : null;

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

      const sf = isMobileRef.current ? 0.75 : 1;

      // Draw nodes
      for (const node of nodes) {
        const style = getStyle(node.type);
        const isFeatured = node.featured;
        const isSystem = node.type !== "domain";
        const isHL = !highlighted || highlighted.has(node.id);
        const isHovered = node.id === currentHoveredId;

        // Compute per-node hash for twinkle phase
        let hash = 0;
        for (let c = 0; c < node.id.length; c++) {
          hash = ((hash << 5) - hash + node.id.charCodeAt(c)) | 0;
        }
        const nodePhase = ((hash % 1000) / 1000) * Math.PI * 2;

        // Base radius with hover boost for system nodes
        let r = (isFeatured ? style.featuredRadius : style.radius) * sf;
        if (isHovered && isSystem) r *= 1.25;

        const color = isFeatured ? style.featuredColor : style.color;

        ctx.globalAlpha = highlighted && !isHL ? 0.06 : 1;

        // Twinkle for system nodes: subtle brightness pulse (±10%)
        const twinkle = isSystem
          ? 1 + Math.sin(time * 1.2 + nodePhase) * 0.1
          : 1;

        if (isSystem) {
          // --- System nodes: star-like glow using shadowBlur ---

          // Radial gradient glow layer
          const glowR = isHovered ? r * 5 : isFeatured ? r * 4 : r * 2.8;
          const glowAlpha = (isHovered ? 0.35 : isFeatured ? 0.25 : 0.12) * twinkle;
          const gradient = ctx.createRadialGradient(
            node.x, node.y, r * 0.15,
            node.x, node.y, glowR,
          );
          gradient.addColorStop(0, `rgba(180, 200, 255, ${glowAlpha})`);
          gradient.addColorStop(0.4, `rgba(160, 185, 255, ${glowAlpha * 0.4})`);
          gradient.addColorStop(1, "rgba(160, 185, 255, 0)");
          ctx.beginPath();
          ctx.arc(node.x, node.y, glowR, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          // Core dot with canvas shadowBlur
          const blurAmount = isHovered ? 20 : isFeatured ? 16 : 8;
          ctx.save();
          ctx.shadowColor = isFeatured
            ? "rgba(200, 215, 255, 0.7)"
            : "rgba(180, 195, 255, 0.5)";
          ctx.shadowBlur = blurAmount * twinkle;
          ctx.beginPath();
          ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
          ctx.restore();
        } else {
          // --- Domain nodes: soft subtle dot ---
          if (style.glowColor !== "transparent") {
            const glowR = r * 2;
            const gradient = ctx.createRadialGradient(
              node.x, node.y, r * 0.2,
              node.x, node.y, glowR,
            );
            gradient.addColorStop(0, "rgba(110, 140, 210, 0.06)");
            gradient.addColorStop(1, "rgba(110, 140, 210, 0)");
            ctx.beginPath();
            ctx.arc(node.x, node.y, glowR, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }

        // Label
        const baseFontSize = isFeatured
          ? style.labelSize + 1
          : style.labelSize;
        const fontSize = baseFontSize * sf;
        const weight = isFeatured ? 600 : 400;
        ctx.font = `${weight} ${fontSize}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = isFeatured
          ? style.featuredLabelColor
          : style.labelColor;

        const labelText =
          node.type === "domain"
            ? node.label.toUpperCase()
            : node.label;

        if (node.type === "domain") {
          ctx.letterSpacing = "1.5px";
          ctx.fillText(labelText, node.x, node.y + r + 5);
          ctx.letterSpacing = "0px";
        } else {
          ctx.fillText(labelText, node.x, node.y + r + 4);
        }

        ctx.globalAlpha = 1;
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [dimensions, getConnected]);

  // Mouse interaction — hover detection + parallax offset
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      // Parallax: normalize mouse to -1..1 from center, scale to 3px max
      const nx = (mx / rect.width - 0.5) * 2;
      const ny = (my / rect.height - 0.5) * 2;
      mouseOffsetRef.current = { x: nx * 3, y: ny * 3 };

      let closest: LayoutNode | null = null;
      let closestDist = Infinity;

      for (const node of layoutRef.current) {
        const style = getStyle(node.type);
        const r = node.featured ? style.featuredRadius : style.radius;
        const hitRadius = r + 14;
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
    mouseOffsetRef.current = { x: 0, y: 0 };
  }, []);

  return (
    <section className="pt-6 pb-12 sm:pt-10 sm:pb-20">
      {/* Heading */}
      <div className="mx-auto mb-4 max-w-2xl px-4 text-center sm:mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-100 sm:text-3xl">
          Systems I&apos;ve helped build
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-neutral-500 sm:text-base">
          A constellation of systems across commerce, search platforms
          and distributed infrastructure.
        </p>
      </div>

      {/* Canvas */}
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
