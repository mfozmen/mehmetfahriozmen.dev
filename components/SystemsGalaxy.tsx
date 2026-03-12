"use client";

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { systemsGraph } from "@/data/systemsGraph";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

/* ------------------------------------------------------------------ */
/*  Node appearance — keyed by node.type for extensibility            */
/* ------------------------------------------------------------------ */

interface NodeStyle {
  radius: number;
  featuredRadius: number;
  color: string;
  featuredColor: string;
  labelColor: string;
  featuredLabelColor: string;
  labelSize: number;
}

const NODE_STYLES: Record<string, NodeStyle> = {
  system: {
    radius: 6,
    featuredRadius: 11,
    color: "rgba(160, 175, 240, 0.8)",
    featuredColor: "rgba(230, 235, 255, 0.95)",
    labelColor: "rgba(190, 195, 220, 0.85)",
    featuredLabelColor: "rgba(235, 235, 255, 0.95)",
    labelSize: 13,
  },
  domain: {
    radius: 4,
    featuredRadius: 5.5,
    color: "rgba(100, 120, 170, 0.4)",
    featuredColor: "rgba(130, 150, 200, 0.6)",
    labelColor: "rgba(120, 135, 165, 0.5)",
    featuredLabelColor: "rgba(140, 155, 185, 0.7)",
    labelSize: 9,
  },
  technology: {
    radius: 5,
    featuredRadius: 7,
    color: "rgba(130, 200, 170, 0.7)",
    featuredColor: "rgba(150, 230, 190, 0.9)",
    labelColor: "rgba(150, 210, 175, 0.8)",
    featuredLabelColor: "rgba(170, 230, 195, 0.9)",
    labelSize: 11,
  },
  post: {
    radius: 4,
    featuredRadius: 6,
    color: "rgba(200, 170, 130, 0.6)",
    featuredColor: "rgba(230, 195, 150, 0.8)",
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
  labelColor: "rgba(170, 170, 170, 0.7)",
  featuredLabelColor: "rgba(190, 190, 190, 0.85)",
  labelSize: 11,
};

function getStyle(type: string): NodeStyle {
  return NODE_STYLES[type] ?? DEFAULT_STYLE;
}

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface FGNode {
  id: string;
  label: string;
  type: string;
  featured?: boolean;
  neighbors: FGNode[];
  links: FGLink[];
  x?: number;
  y?: number;
}

interface FGLink {
  source: FGNode | string;
  target: FGNode | string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const LINK_COLOR = "rgba(100, 115, 160, 0.1)";
const LINK_HIGHLIGHT_COLOR = "rgba(170, 185, 240, 0.5)";
const BG_COLOR = "rgba(0, 0, 0, 0)";

// Responsive breakpoint
const MOBILE_BREAKPOINT = 640;

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function SystemsGalaxy() {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const graphRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 550 });
  const isMobile = dimensions.width < MOBILE_BREAKPOINT;

  const [highlightNodes, setHighlightNodes] = useState<Set<FGNode>>(
    new Set(),
  );
  const [highlightLinks, setHighlightLinks] = useState<Set<FGLink>>(
    new Set(),
  );
  const [hoverNode, setHoverNode] = useState<FGNode | null>(null);

  // Measure container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const w = Math.round(el.getBoundingClientRect().width);
      if (w > 0) {
        const h = w < MOBILE_BREAKPOINT ? 420 : 550;
        setDimensions({ width: w, height: h });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Build graph data with cross-linked neighbors
  const graphData = useMemo(() => {
    const nodes: FGNode[] = systemsGraph.nodes.map((n) => ({
      ...n,
      neighbors: [] as FGNode[],
      links: [] as FGLink[],
    }));

    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    const links: FGLink[] = systemsGraph.edges.map((e) => ({
      source: e.source,
      target: e.target,
    }));

    links.forEach((link) => {
      const a = nodeMap.get(link.source as string);
      const b = nodeMap.get(link.target as string);
      if (a && b) {
        a.neighbors.push(b);
        b.neighbors.push(a);
        a.links.push(link);
        b.links.push(link);
      }
    });

    return { nodes, links };
  }, []);

  // After stabilization: center and zoom to ~1.3×
  const hasZoomed = useRef(false);
  const handleEngineStop = useCallback(() => {
    if (hasZoomed.current) return;
    hasZoomed.current = true;
    const fg = graphRef.current;
    if (!fg) return;
    // Fit first, then nudge zoom slightly closer
    fg.zoomToFit(600, 60, () => true);
    setTimeout(() => {
      const currentZoom = fg.zoom();
      if (currentZoom < 1.3) {
        fg.zoom(1.3, 400);
      }
    }, 650);
  }, []);

  // Hover handlers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNodeHover = useCallback((node: any) => {
    const newNodes = new Set<FGNode>();
    const newLinks = new Set<FGLink>();

    if (node) {
      newNodes.add(node);
      node.neighbors.forEach((n: FGNode) => newNodes.add(n));
      node.links.forEach((l: FGLink) => newLinks.add(l));
    }

    setHoverNode(node);
    setHighlightNodes(newNodes);
    setHighlightLinks(newLinks);
  }, []);

  // Responsive scale factor
  const sf = isMobile ? 0.7 : 1;

  // Custom node painting
  const paintNode = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      if (node.x == null || node.y == null) return;

      const style = getStyle(node.type);
      const isFeatured = !!node.featured;
      const r = (isFeatured ? style.featuredRadius : style.radius) * sf;
      const color = isFeatured ? style.featuredColor : style.color;
      const isHL = highlightNodes.has(node);
      const hasHL = highlightNodes.size > 0;

      // Fade non-highlighted nodes when something is hovered
      ctx.globalAlpha = hasHL && !isHL ? 0.08 : 1;

      // Outer glow for featured nodes (always) and hovered node
      if (isFeatured || node === hoverNode) {
        const glowR = node === hoverNode ? r * 2.8 : r * 2.2;
        const glowAlpha = node === hoverNode ? 0.18 : 0.1;
        const gradient = ctx.createRadialGradient(
          node.x,
          node.y,
          r * 0.5,
          node.x,
          node.y,
          glowR,
        );
        gradient.addColorStop(0, `rgba(180, 195, 255, ${glowAlpha})`);
        gradient.addColorStop(1, "rgba(180, 195, 255, 0)");
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowR, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();

      // Label logic:
      // - Featured system nodes: always visible
      // - Domain nodes: only when zoomed in (globalScale > 1.5) or highlighted
      const showLabel =
        isFeatured ||
        node.type !== "domain" ||
        globalScale > 1.5 ||
        isHL;

      if (showLabel) {
        const baseFontSize = isFeatured
          ? style.labelSize + 1
          : style.labelSize;
        const fontSize = baseFontSize / globalScale;
        const weight = isFeatured ? 600 : 400;
        ctx.font = `${weight} ${fontSize}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = isFeatured ? style.featuredLabelColor : style.labelColor;

        const labelText =
          node.type === "domain" ? node.label.toUpperCase() : node.label;
        ctx.fillText(labelText, node.x, node.y + r + 4 / globalScale);
      }

      ctx.globalAlpha = 1;
    },
    [highlightNodes, hoverNode, sf],
  );

  // Pointer area for hover detection
  const paintPointerArea = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (node: any, color: string, ctx: CanvasRenderingContext2D) => {
      if (node.x == null || node.y == null) return;
      const style = getStyle(node.type);
      const r =
        (node.featured ? style.featuredRadius : style.radius) * sf + 6;
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    },
    [sf],
  );

  // Link styling
  const linkColor = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (link: any) =>
      highlightLinks.has(link) ? LINK_HIGHLIGHT_COLOR : LINK_COLOR,
    [highlightLinks],
  );

  const linkWidth = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (link: any) => (highlightLinks.has(link) ? 2 : 0.5),
    [highlightLinks],
  );

  // Configure d3 forces for node spacing
  useEffect(() => {
    const fg = graphRef.current;
    if (!fg) return;
    const linkDist = isMobile ? 90 : 140;
    const charge = isMobile ? -250 : -400;
    fg.d3Force("link")?.distance(linkDist);
    fg.d3Force("charge")?.strength(charge);
    fg.d3ReheatSimulation();
  }, [isMobile]);

  return (
    <section className="py-12 sm:py-20">
      <div
        ref={containerRef}
        className="relative mx-auto w-full max-w-5xl"
        style={{ height: dimensions.height }}
      >
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor={BG_COLOR}
          // Node rendering
          nodeCanvasObject={paintNode}
          nodeCanvasObjectMode={() => "replace"}
          nodePointerAreaPaint={paintPointerArea}
          // Link rendering
          linkColor={linkColor}
          linkWidth={linkWidth}
          // Interaction
          onNodeHover={handleNodeHover}
          onEngineStop={handleEngineStop}
          enableNodeDrag={false}
          // Physics — slow floating constellation
          cooldownTicks={200}
          d3AlphaDecay={0.008}
          d3VelocityDecay={0.15}
          d3AlphaMin={0.005}
        />
      </div>
    </section>
  );
}
