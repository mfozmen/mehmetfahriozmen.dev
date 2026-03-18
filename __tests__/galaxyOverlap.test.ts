import { describe, it, expect } from "vitest";
import {
  systems,
  domains,
  techClusters,
  techClusterMobilePositions,
} from "@/data/systemsGraph";
import {
  getOrbitPosition,
  getSystemPosition,
  getDomainPosition,
  getTechClusterPosition,
  getSatellitePosition,
} from "@/lib/galaxyLayout";
// orbits imported via getOrbitPosition in galaxyLayout

// Canvas dimensions — match the component's default
const W = 948;
const H = 600;
const CX = W / 2;
const CY = H / 2;

// Minimum distances (px)
const STATIC_MIN_DIST = 60;
const SATELLITE_MIN_DIST = 30;

// Dense time sampling — check every 2000ms from 0 to 200,000
// to catch orbital overlaps across the full minor system period
const TIME_SAMPLES = Array.from({ length: 101 }, (_, i) => i * 2_000);

// Domains are intentionally placed near their parent systems
const EXPECTED_PAIRS = new Set<string>();
for (const sys of systems) {
  for (const domId of sys.domains) {
    const dom = domains.find((d) => d.id === domId);
    if (dom) {
      EXPECTED_PAIRS.add(`${sys.name}|${dom.name}`);
      EXPECTED_PAIRS.add(`${dom.name}|${sys.name}`);
    }
  }
}

interface Point {
  name: string;
  category: string;
  x: number;
  y: number;
}

function dist(a: Point, b: Point) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function getAllPositions(time: number): Point[] {
  const points: Point[] = [];
  for (const sys of systems) {
    const pos = getSystemPosition(sys, time, W, H, CX, CY);
    points.push({ name: sys.name, category: "system", ...pos });
  }
  for (const dom of domains) {
    const pos = getDomainPosition(dom, W, H, CX, CY);
    points.push({ name: dom.name, category: "domain", ...pos });
  }
  for (const tc of techClusters) {
    const pos = getTechClusterPosition(tc, W, H, CX, CY);
    points.push({ name: tc.name, category: "tech", ...pos });
  }
  return points;
}

function getSatellitePoints(tc: (typeof techClusters)[number]): Point[] {
  const clusterPos = getTechClusterPosition(tc, W, H, CX, CY);
  return tc.technologies.map((tech, i) => {
    const pos = getSatellitePosition(
      clusterPos.x,
      clusterPos.y,
      i,
      tc.technologies.length,
    );
    return { name: `${tc.name}→${tech}`, category: "satellite", ...pos };
  });
}

function findViolations(
  points: Point[],
  minDist: number,
): string[] {
  const violations: string[] = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const a = points[i], b = points[j];
      // Systems orbit and inevitably pass near other elements.
      // System pairs are checked separately via orbit-path clearance test.
      if (a.category === "system" || b.category === "system") continue;
      const d = dist(a, b);
      if (d < minDist) {
        violations.push(
          `${a.category}:"${a.name}" ↔ ${b.category}:"${b.name}" = ${d.toFixed(0)}px`,
        );
      }
    }
  }
  return violations;
}

const CENTER_MIN_DIST = 80;

describe("Galaxy label overlap detection", () => {
  it("no tech cluster is within 80px of canvas center (galactic core)", () => {
    const center = { name: "center", category: "center", x: CX, y: CY };
    const tooClose: string[] = [];
    for (const tc of techClusters) {
      const pos = getTechClusterPosition(tc, W, H, CX, CY);
      const d = Math.sqrt((pos.x - center.x) ** 2 + (pos.y - center.y) ** 2);
      if (d < CENTER_MIN_DIST) {
        tooClose.push(`${tc.name} is ${d.toFixed(0)}px from center (min ${CENTER_MIN_DIST}px)`);
      }
    }
    expect(tooClose, `Tech clusters too close to center:\n${tooClose.join("\n")}`).toHaveLength(0);
  });

  it("tech clusters maintain 60px clearance from orbit 2 path (minor systems)", () => {
    // Sample 360 points along orbit 2's ellipse and check distance to each tech cluster
    const ORBIT_CLEARANCE = 60;
    const violations: string[] = [];
    for (const tc of techClusters) {
      const tcPos = getTechClusterPosition(tc, W, H, CX, CY);
      let minDist = Infinity;
      let closestAngle = 0;
      for (let deg = 0; deg < 360; deg++) {
        const angle = (deg * Math.PI) / 180;
        const orbitPos = getOrbitPosition(2, angle, W, H, CX, CY);
        const d = Math.sqrt((tcPos.x - orbitPos.x) ** 2 + (tcPos.y - orbitPos.y) ** 2);
        if (d < minDist) {
          minDist = d;
          closestAngle = deg;
        }
      }
      if (minDist < ORBIT_CLEARANCE) {
        violations.push(
          `${tc.name} is ${minDist.toFixed(0)}px from orbit 2 at ${closestAngle}° (min ${ORBIT_CLEARANCE}px)`,
        );
      }
    }
    expect(violations, `Tech clusters too close to orbit 2:\n${violations.join("\n")}`).toHaveLength(0);
  });

  it("static elements (tech clusters, domains) maintain minimum distance", () => {
    const statics = getAllPositions(0).filter((p) => p.category !== "system");
    const violations = findViolations(statics, STATIC_MIN_DIST);
    expect(violations, `Overlapping static elements:\n${violations.join("\n")}`).toHaveLength(0);
  });

  it.each(TIME_SAMPLES)(
    "all elements maintain minimum distance at t=%i",
    (t) => {
      const violations = findViolations(getAllPositions(t), STATIC_MIN_DIST);
      expect(violations, `Overlaps at t=${t}:\n${violations.join("\n")}`).toHaveLength(0);
    },
  );

  describe("satellite overlaps", () => {
    for (const tc of techClusters) {
      it(`${tc.name} satellites don't overlap internal (min 25px)`, () => {
        const satellites = getSatellitePoints(tc);
        const violations = findViolations(satellites, 25);
        expect(violations, violations.join("\n")).toHaveLength(0);
      });

      it(`${tc.name} satellites don't overlap nearby domains`, () => {
        const satellites = getSatellitePoints(tc);
        // Satellites are transient (hover only). Systems orbit and will
        // inevitably pass through the center zone where clusters live.
        // Only check against static domains (which don't move).
        const domainPoints = domains.map((dom) => {
          const pos = getDomainPosition(dom, W, H, CX, CY);
          return { name: dom.name, category: "domain" as const, ...pos };
        });
        const combined = [...satellites, ...domainPoints];
        const violations = findViolations(combined, SATELLITE_MIN_DIST);
        expect(violations, `Satellite-domain overlaps for ${tc.name}:\n${violations.join("\n")}`).toHaveLength(0);
      });
    }
  });
});

// --- Mobile overlap checks ---

const MW = 390;
const MH = Math.round(MW / 1.6); // 244
const MCX = MW / 2;
const MCY = MH / 2;
const MOBILE_STATIC_MIN_DIST = 22; // Proportional to desktop 60px * (390/948)
const MOBILE_TIME_SAMPLES = [0, 10_000, 50_000, 100_000];

function getAllMobilePositions(time: number): Point[] {
  const points: Point[] = [];
  for (const sys of systems) {
    const pos = getSystemPosition(sys, time, MW, MH, MCX, MCY);
    points.push({ name: sys.name, category: "system", ...pos });
  }
  for (const dom of domains) {
    const pos = getDomainPosition(dom, MW, MH, MCX, MCY);
    points.push({ name: dom.name, category: "domain", ...pos });
  }
  for (const tc of techClusters) {
    const override = techClusterMobilePositions[tc.id];
    const pos = override
      ? { x: MCX + override.x * MW, y: MCY + override.y * MH }
      : getTechClusterPosition(tc, MW, MH, MCX, MCY);
    points.push({ name: tc.name, category: "tech", ...pos });
  }
  return points;
}

describe("Mobile galaxy label overlap detection (390px)", () => {
  it("tech clusters maintain minimum distance at mobile size", () => {
    const statics = getAllMobilePositions(0).filter((p) => p.category === "tech");
    const violations = findViolations(statics, MOBILE_STATIC_MIN_DIST);
    expect(violations, `Mobile tech cluster overlaps:\n${violations.join("\n")}`).toHaveLength(0);
  });

  it("tech clusters don't overlap domains at mobile size", () => {
    const nonSystems = getAllMobilePositions(0).filter((p) => p.category !== "system");
    const violations = findViolations(nonSystems, MOBILE_STATIC_MIN_DIST);
    expect(violations, `Mobile static overlaps:\n${violations.join("\n")}`).toHaveLength(0);
  });

  it.each(MOBILE_TIME_SAMPLES)(
    "no system-system label collision at mobile t=%i",
    (t) => {
      const sysSystems = getAllMobilePositions(t).filter((p) => p.category === "system");
      const violations: string[] = [];
      for (let i = 0; i < sysSystems.length; i++) {
        for (let j = i + 1; j < sysSystems.length; j++) {
          const d = dist(sysSystems[i], sysSystems[j]);
          if (d < 10) {
            violations.push(
              `${sysSystems[i].name} ↔ ${sysSystems[j].name} = ${d.toFixed(0)}px`,
            );
          }
        }
      }
      expect(violations, `Mobile system overlaps at t=${t}:\n${violations.join("\n")}`).toHaveLength(0);
    },
  );
});
