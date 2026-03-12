const mainSystems = ["Mobilet", "VillaSepeti", "MagicPags"];

const secondarySystems = [
  "Decktopus",
  "BeforeSunset",
  "FoodServiceDirect",
  "Internal Tools",
];

const domains = ["Commerce", "Search", "Distributed Systems", "Microservices"];

// Fixed positions for the constellation — deterministic, no randomness
const mainPositions = [
  { x: 20, y: 30 },
  { x: 55, y: 60 },
  { x: 80, y: 25 },
];

const secondaryPositions = [
  { x: 10, y: 70 },
  { x: 40, y: 15 },
  { x: 70, y: 75 },
  { x: 90, y: 50 },
];

const domainPositions = [
  { x: 35, y: 48 },
  { x: 65, y: 42 },
  { x: 15, y: 48 },
  { x: 85, y: 68 },
];

// Lines connecting nodes to create constellation effect
const connections = [
  { from: mainPositions[0], to: secondaryPositions[1] },
  { from: mainPositions[0], to: mainPositions[1] },
  { from: mainPositions[1], to: mainPositions[2] },
  { from: mainPositions[2], to: secondaryPositions[3] },
  { from: mainPositions[1], to: secondaryPositions[2] },
  { from: secondaryPositions[0], to: mainPositions[0] },
  { from: secondaryPositions[1], to: mainPositions[2] },
];

export default function SystemsGalaxy() {
  return (
    <section className="py-20">
      <div className="relative mx-auto aspect-[2/1] w-full max-w-4xl">
        {/* Connection lines */}
        <svg className="absolute inset-0 h-full w-full">
          {connections.map((conn, i) => (
            <line
              key={i}
              x1={`${conn.from.x}%`}
              y1={`${conn.from.y}%`}
              x2={`${conn.to.x}%`}
              y2={`${conn.to.y}%`}
              stroke="rgba(115, 115, 115, 0.15)"
              strokeWidth="1"
            />
          ))}
        </svg>

        {/* Main system nodes */}
        {mainSystems.map((name, i) => (
          <div
            key={name}
            className="absolute flex flex-col items-center"
            style={{
              left: `${mainPositions[i].x}%`,
              top: `${mainPositions[i].y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="h-3 w-3 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.3)]" />
            <span className="mt-2 text-sm font-medium text-neutral-200">
              {name}
            </span>
          </div>
        ))}

        {/* Secondary system nodes */}
        {secondarySystems.map((name, i) => (
          <div
            key={name}
            className="absolute flex flex-col items-center"
            style={{
              left: `${secondaryPositions[i].x}%`,
              top: `${secondaryPositions[i].y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="h-2 w-2 rounded-full bg-neutral-500" />
            <span className="mt-1.5 text-xs text-neutral-500">{name}</span>
          </div>
        ))}

        {/* Domain labels */}
        {domains.map((label, i) => (
          <span
            key={label}
            className="absolute text-[10px] uppercase tracking-widest text-neutral-700"
            style={{
              left: `${domainPositions[i].x}%`,
              top: `${domainPositions[i].y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}
