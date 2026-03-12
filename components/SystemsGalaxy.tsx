import { systemsGraph, GraphNode } from "@/data/systemsGraph";

const systemNodes = systemsGraph.nodes.filter((n) => n.type === "system");
const domainNodes = systemsGraph.nodes.filter((n) => n.type === "domain");
const featuredSystems = systemNodes.filter((n) => n.featured);
const secondarySystems = systemNodes.filter((n) => !n.featured);

// Deterministic layout positions keyed by node id
const positions: Record<string, { x: number; y: number }> = {
  // Featured systems — larger nodes
  mobilet: { x: 20, y: 30 },
  villasepeti: { x: 55, y: 60 },
  magicpags: { x: 80, y: 25 },
  // Secondary systems — smaller nodes
  decktopus: { x: 10, y: 70 },
  beforesunset: { x: 40, y: 15 },
  foodservicedirect: { x: 70, y: 75 },
  "internal-tools": { x: 90, y: 50 },
  // Domains — label-only
  commerce: { x: 35, y: 48 },
  "distributed-systems": { x: 65, y: 42 },
  microservices: { x: 15, y: 48 },
  "search-platforms": { x: 50, y: 85 },
  "developer-tools": { x: 85, y: 68 },
};

function pos(node: GraphNode) {
  return positions[node.id] ?? { x: 50, y: 50 };
}

export default function SystemsGalaxy() {
  return (
    <section className="py-20">
      <div className="relative mx-auto aspect-[2/1] w-full max-w-4xl">
        {/* Edge lines */}
        <svg className="absolute inset-0 h-full w-full">
          {systemsGraph.edges.map((edge, i) => {
            const from = positions[edge.source];
            const to = positions[edge.target];
            if (!from || !to) return null;
            return (
              <line
                key={i}
                x1={`${from.x}%`}
                y1={`${from.y}%`}
                x2={`${to.x}%`}
                y2={`${to.y}%`}
                stroke="rgba(115, 115, 115, 0.15)"
                strokeWidth="1"
              />
            );
          })}
        </svg>

        {/* Featured system nodes */}
        {featuredSystems.map((node) => {
          const p = pos(node);
          return (
            <div
              key={node.id}
              className="absolute flex flex-col items-center"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="h-3 w-3 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.3)]" />
              <span className="mt-2 text-sm font-medium text-neutral-200">
                {node.label}
              </span>
            </div>
          );
        })}

        {/* Secondary system nodes */}
        {secondarySystems.map((node) => {
          const p = pos(node);
          return (
            <div
              key={node.id}
              className="absolute flex flex-col items-center"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="h-2 w-2 rounded-full bg-neutral-500" />
              <span className="mt-1.5 text-xs text-neutral-500">
                {node.label}
              </span>
            </div>
          );
        })}

        {/* Domain labels */}
        {domainNodes.map((node) => {
          const p = pos(node);
          return (
            <span
              key={node.id}
              className="absolute text-[10px] uppercase tracking-widest text-neutral-700"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {node.label}
            </span>
          );
        })}
      </div>
    </section>
  );
}
