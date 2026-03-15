/**
 * Hit detection and interaction logic for the galaxy visualization.
 * Pure functions — no React dependency.
 */

import {
  systems,
  domains,
  techClusters,
  type SystemNode,
  type DomainNode,
  type TechClusterNode,
} from "@/data/systemsGraph";
import {
  getSystemPosition,
  getDomainPosition,
  getTechClusterPosition,
} from "@/lib/galaxyLayout";
import { systemStarRadius } from "@/lib/galaxyRenderers";

export type HitResult =
  | { type: "system"; id: string; item: SystemNode }
  | { type: "domain"; id: string; item: DomainNode }
  | { type: "tech"; id: string; item: TechClusterNode }
  | null;

export function hitTest(opts: {
  mx: number;
  my: number;
  time: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
  sf: number;
}): HitResult {
  const { mx, my, time, w, h, cx, cy, sf } = opts;
  // Larger hit targets on small screens for fat finger tolerance
  const touchBoost = sf < 0.7 ? 1.5 : 1;

  for (const sys of systems) {
    const pos = getSystemPosition(sys, time, w, h, cx, cy);
    const hitR = (systemStarRadius(sys.importance, sf) * 3 + 10) * touchBoost;
    const dx = mx - pos.x, dy = my - pos.y;
    if (dx * dx + dy * dy < hitR * hitR) {
      return { type: "system", id: sys.id, item: sys };
    }
  }

  for (const dom of domains) {
    const pos = getDomainPosition(dom, w, h, cx, cy);
    const dx = mx - pos.x, dy = my - pos.y;
    const domHitR = 20 * touchBoost;
    if (dx * dx + dy * dy < domHitR * domHitR) {
      return { type: "domain", id: dom.id, item: dom };
    }
  }

  for (const tc of techClusters) {
    const pos = getTechClusterPosition(tc, w, h, cx, cy);
    const dx = mx - pos.x, dy = my - pos.y;
    const tcHitR = 16 * touchBoost;
    if (dx * dx + dy * dy < tcHitR * tcHitR) {
      return { type: "tech", id: tc.id, item: tc };
    }
  }

  return null;
}

export function getHighlightedIds(
  id: string,
  type: "system" | "domain" | "tech",
  domainToSystems: Map<string, string[]>,
  techToSystems: Map<string, string[]>,
): Set<string> {
  const set = new Set<string>();
  set.add(id);
  if (type === "system") {
    const sys = systems.find((s) => s.id === id);
    if (sys) {
      sys.domains.forEach((d) => set.add(d));
      sys.techClusters.forEach((t) => set.add(t));
    }
  } else if (type === "domain") {
    const connected = domainToSystems.get(id);
    if (connected) { connected.forEach((s) => set.add(s)); }
  } else {
    const connected = techToSystems.get(id);
    if (connected) { connected.forEach((s) => set.add(s)); }
  }
  return set;
}
