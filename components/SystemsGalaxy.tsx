"use client";

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { systemsGraph } from "@/data/systemsGraph";

// Dynamic import to avoid SSR issues with canvas
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

/* ------------------------------------------------------------------ */
/*  Node appearance config — keyed by node.type for extensibility     */
/* ------------------------------------------------------------------ */

interface NodeStyle {
  radius: number;
  featuredRadius: number;
  color: string;
  featuredColor: string;
  labelColor: string;
  labelSize: number;
}

const NODE_STYLES: Record<string, NodeStyle> = {
  system: {
    radius: 5,
    featuredRadius: 8,
    color: "rgba(160, 170, 230, 0.85)",
    featuredColor: "rgba(220, 225, 255, 0.95)",
    labelColor: "rgba(210, 210, 230, 0.9)",
    labelSize: 12,
  },
  domain: {
    radius: 3.5,
    featuredRadius: 5,
    color: "rgba(120, 140, 180, 0.5)",
    featuredColor: "rgba(140, 160, 200, 0.7)",
    labelColor: "rgba(140, 150, 175, 0.65)",
    labelSize: 9,
  },
  technology: {
    radius: 4,
    featuredRadius: 6,
    color: "rgba(130, 200, 170, 0.7)",
    featuredColor: "rgba(150, 230, 190, 0.9)",
    labelColor: "rgba(150, 210, 175, 0.8)",
    labelSize: 10,
  },
  post: {
    radius: 3.5,
    featuredRadius: 5,
    color: "rgba(200, 170, 130, 0.6)",
    featuredColor: "rgba(230, 195, 150, 0.8)",
    labelColor: "rgba(210, 180, 145, 0.7)",
    labelSize: 10,
  },
};

const DEFAULT_STYLE: NodeStyle = {
  radius: 4,
  featuredRadius: 6,
  color: "rgba(160, 160, 160, 0.6)",
  featuredColor: "rgba(190, 190, 190, 0.8)",
  labelColor: "rgba(170, 170, 170, 0.7)",
  labelSize: 10,
};

function getStyle(type: string): NodeStyle {
  return NODE_STYLES[type] ?? DEFAULT_STYLE;
}

/* ------------------------------------------------------------------ */
/*  Types for the force-graph library's internal node/link objects     */
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

const LINK_COLOR = "rgba(100, 110, 140, 0.12)";
const LINK_HIGHLIGHT_COLOR = "rgba(170, 180, 230, 0.45)";
const BG_COLOR = "rgba(0, 0, 0, 0)";

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function SystemsGalaxy() {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const graphRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  const [highlightNodes, setHighlightNodes] = useState<Set<FGNode>>(new Set());
  const [highlightLinks, setHighlightLinks] = useState<Set<FGLink>>(new Set());
  const [hoverNode, setHoverNode] = useState<FGNode | null>(null);

  // Measure container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setDimensions({
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        });
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

    // Cross-link neighbors
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

  // Fit to view after engine stabilizes
  const handleEngineStop = useCallback(() => {
    graphRef.current?.zoomToFit(400, 40);
  }, []);

  // Hover handlers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNodeHover = useCallback((node: any) => {
    const newHighlightNodes = new Set<FGNode>();
    const newHighlightLinks = new Set<FGLink>();

    if (node) {
      newHighlightNodes.add(node);
      node.neighbors.forEach((n: FGNode) => newHighlightNodes.add(n));
      node.links.forEach((l: FGLink) => newHighlightLinks.add(l));
    }

    setHoverNode(node);
    setHighlightNodes(newHighlightNodes);
    setHighlightLinks(newHighlightLinks);
  }, []);

  // Custom node rendering
  const paintNode = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      if (node.x == null || node.y == null) return;

      const style = getStyle(node.type);
      const isFeatured = !!node.featured;
      const r = isFeatured ? style.featuredRadius : style.radius;
      const color = isFeatured ? style.featuredColor : style.color;
      const isHighlighted = highlightNodes.has(node);
      const hasHighlight = highlightNodes.size > 0;

      // Fade non-highlighted nodes
      ctx.globalAlpha = hasHighlight && !isHighlighted ? 0.1 : 1;

      // Glow for hovered or featured+highlighted nodes
      if (node === hoverNode || (isFeatured && isHighlighted && hasHighlight)) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 2.2, 0, 2 * Math.PI);
        ctx.fillStyle =
          node === hoverNode
            ? "rgba(180, 190, 255, 0.15)"
            : "rgba(180, 190, 255, 0.08)";
        ctx.fill();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();

      // Label
      const fontSize = style.labelSize / globalScale;
      ctx.font = `${isFeatured ? 500 : 400} ${fontSize}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = style.labelColor;

      const labelText =
        node.type === "domain" ? node.label.toUpperCase() : node.label;
      ctx.fillText(labelText, node.x, node.y + r + 3 / globalScale);

      ctx.globalAlpha = 1;
    },
    [highlightNodes, hoverNode],
  );

  // Node pointer area for hover detection
  const paintPointerArea = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (node: any, color: string, ctx: CanvasRenderingContext2D) => {
      if (node.x == null || node.y == null) return;
      const style = getStyle(node.type);
      const r = node.featured ? style.featuredRadius : style.radius;
      ctx.beginPath();
      ctx.arc(node.x, node.y, r + 4, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    },
    [],
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
    (link: any) => (highlightLinks.has(link) ? 1.8 : 0.6),
    [highlightLinks],
  );

  return (
    <section className="py-20">
      <div
        ref={containerRef}
        className="relative mx-auto aspect-[2/1] w-full max-w-4xl"
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
          // Disable node dragging to keep layout stable
          enableNodeDrag={false}
          // Zoom & pan enabled by default
          cooldownTicks={100}
          d3AlphaDecay={0.03}
          d3VelocityDecay={0.3}
        />
      </div>
    </section>
  );
}
