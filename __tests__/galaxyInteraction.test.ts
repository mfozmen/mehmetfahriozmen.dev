import { describe, it, expect } from "vitest";
import { hitTest, getHighlightedIds } from "@/lib/galaxyInteraction";
import {
  systems,
  domains,
  techClusters,
  techClusterMobilePositions,
} from "@/data/systemsGraph";
import {
  getSystemPosition,
  getDomainPosition,
  getTechClusterPosition,
} from "@/lib/galaxyLayout";

const W = 948;
const H = 600;
const CX = W / 2;
const CY = H / 2;
const SF = 1;

// --- hitTest ---

describe("hitTest — desktop (no overrides)", () => {
  it("hits a primary system at its position", () => {
    const sys = systems.find((s) => s.importance === "primary")!;
    const pos = getSystemPosition(sys, 0, W, H, CX, CY);
    const result = hitTest({ mx: pos.x, my: pos.y, time: 0, w: W, h: H, cx: CX, cy: CY, sf: SF });
    expect(result).not.toBeNull();
    expect(result!.type).toBe("system");
    expect(result!.id).toBe(sys.id);
  });

  it("hits a domain at its position", () => {
    const dom = domains[0];
    const pos = getDomainPosition(dom, W, H, CX, CY);
    const result = hitTest({ mx: pos.x, my: pos.y, time: 0, w: W, h: H, cx: CX, cy: CY, sf: SF });
    expect(result).not.toBeNull();
    expect(result!.type).toBe("domain");
    expect(result!.id).toBe(dom.id);
  });

  it("hits a tech cluster at desktop position", () => {
    const tc = techClusters[0];
    const pos = getTechClusterPosition(tc, W, H, CX, CY);
    const result = hitTest({ mx: pos.x, my: pos.y, time: 0, w: W, h: H, cx: CX, cy: CY, sf: SF });
    expect(result).not.toBeNull();
    expect(result!.type).toBe("tech");
    expect(result!.id).toBe(tc.id);
  });

  it("returns null when clicking empty space", () => {
    const result = hitTest({ mx: 0, my: 0, time: 0, w: W, h: H, cx: CX, cy: CY, sf: SF });
    expect(result).toBeNull();
  });
});

describe("hitTest — mobile (with position overrides)", () => {
  const MW = 390;
  const MH = 244;
  const MCX = MW / 2;
  const MCY = MH / 2;
  const MSF = MW / 900; // ~0.43

  it("hits a tech cluster at mobile radial position", () => {
    const tc = techClusters[0];
    const override = techClusterMobilePositions[tc.id];
    const mobilePos = { x: MCX + override.x * MW, y: MCY + override.y * MH };
    const result = hitTest({
      mx: mobilePos.x, my: mobilePos.y, time: 0,
      w: MW, h: MH, cx: MCX, cy: MCY, sf: MSF,
      techClusterPositionOverrides: techClusterMobilePositions,
    });
    expect(result).not.toBeNull();
    expect(result!.type).toBe("tech");
    expect(result!.id).toBe(tc.id);
  });

  it("does NOT hit tech cluster at desktop position when overrides are active", () => {
    // Find a tech cluster whose desktop and mobile positions differ significantly
    const tc = techClusters.find((t) => {
      const dp = getTechClusterPosition(t, MW, MH, MCX, MCY);
      const ov = techClusterMobilePositions[t.id];
      const mp = { x: MCX + ov.x * MW, y: MCY + ov.y * MH };
      return Math.hypot(dp.x - mp.x, dp.y - mp.y) > 30;
    });
    expect(tc, "No tech cluster has significantly different desktop vs mobile positions").toBeTruthy();

    const desktopPos = getTechClusterPosition(tc!, MW, MH, MCX, MCY);
    const result = hitTest({
      mx: desktopPos.x, my: desktopPos.y, time: 0,
      w: MW, h: MH, cx: MCX, cy: MCY, sf: MSF,
      techClusterPositionOverrides: techClusterMobilePositions,
    });
    // Tapping the desktop position should not hit this cluster when mobile overrides are active
    expect(result?.id).not.toBe(tc!.id);
  });

  it("mobile touch boost increases hit radius", () => {
    // sf < 0.7 triggers 1.5x touchBoost
    const sys = systems.find((s) => s.importance === "primary")!;
    const pos = getSystemPosition(sys, 0, MW, MH, MCX, MCY);
    // Hit slightly off-center — should still register with touch boost
    const result = hitTest({
      mx: pos.x + 12, my: pos.y + 12, time: 0,
      w: MW, h: MH, cx: MCX, cy: MCY, sf: MSF,
    });
    expect(result).not.toBeNull();
    expect(result!.type).toBe("system");
  });
});

// --- getHighlightedIds ---

describe("getHighlightedIds", () => {
  const domainToSystems = new Map<string, string[]>();
  const techToSystems = new Map<string, string[]>();

  // Build lookup maps (same logic as useGalaxySetup)
  for (const sys of systems) {
    for (const domId of sys.domains) {
      if (!domainToSystems.has(domId)) domainToSystems.set(domId, []);
      domainToSystems.get(domId)!.push(sys.id);
    }
    for (const tcId of sys.techClusters) {
      if (!techToSystems.has(tcId)) techToSystems.set(tcId, []);
      techToSystems.get(tcId)!.push(sys.id);
    }
  }

  it("system highlight includes itself, its domains, and its tech clusters", () => {
    const sys = systems[0];
    const highlighted = getHighlightedIds(sys.id, "system", domainToSystems, techToSystems);
    expect(highlighted.has(sys.id)).toBe(true);
    for (const domId of sys.domains) {
      expect(highlighted.has(domId)).toBe(true);
    }
    for (const tcId of sys.techClusters) {
      expect(highlighted.has(tcId)).toBe(true);
    }
  });

  it("domain highlight includes itself and all connected systems", () => {
    const dom = domains[0];
    const connected = domainToSystems.get(dom.id) || [];
    const highlighted = getHighlightedIds(dom.id, "domain", domainToSystems, techToSystems);
    expect(highlighted.has(dom.id)).toBe(true);
    for (const sysId of connected) {
      expect(highlighted.has(sysId)).toBe(true);
    }
  });

  it("tech cluster highlight includes itself and all connected systems", () => {
    const tc = techClusters[0];
    const connected = techToSystems.get(tc.id) || [];
    const highlighted = getHighlightedIds(tc.id, "tech", domainToSystems, techToSystems);
    expect(highlighted.has(tc.id)).toBe(true);
    for (const sysId of connected) {
      expect(highlighted.has(sysId)).toBe(true);
    }
  });

  it("does not include unrelated nodes", () => {
    const sys = systems[0];
    const highlighted = getHighlightedIds(sys.id, "system", domainToSystems, techToSystems);
    // Find a system not connected to any of sys's domains or tech clusters
    const unrelated = systems.find(
      (s) =>
        s.id !== sys.id &&
        !s.domains.some((d) => sys.domains.includes(d)) &&
        !s.techClusters.some((t) => sys.techClusters.includes(t)),
    );
    if (unrelated) {
      expect(highlighted.has(unrelated.id)).toBe(false);
    }
  });
});
