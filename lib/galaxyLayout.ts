/**
 * Shared galaxy layout calculations.
 * Used by both SystemsGalaxy.tsx (rendering) and tests (overlap checking).
 */

import {
  orbits,
  SystemNode,
  DomainNode,
  TechClusterNode,
  SystemImportance,
} from "@/data/systemsGraph";

export const ORBIT_SPEEDS: Record<SystemImportance, number> = {
  primary: 0.015,
  secondary: 0.010,
  minor: 0.008,
};

export const SATELLITE_ORBIT_BASE = 55;
export const SATELLITE_ORBIT_PER_TECH = 7;

export function satelliteOrbitRadius(techCount: number): number {
  return SATELLITE_ORBIT_BASE + techCount * SATELLITE_ORBIT_PER_TECH;
}

export function getOrbitPosition(
  orbitIndex: number,
  angle: number,
  w: number,
  h: number,
  cx: number,
  cy: number,
) {
  const orbit = orbits[orbitIndex];
  const rx = orbit.rx * w;
  const ry = orbit.ry * h;
  const cosA = Math.cos(angle),
    sinA = Math.sin(angle);
  const cosR = Math.cos(orbit.rotation),
    sinR = Math.sin(orbit.rotation);
  const ox = rx * cosA,
    oy = ry * sinA;
  return {
    x: cx + ox * cosR - oy * sinR,
    y: cy + ox * sinR + oy * cosR,
  };
}

export function getSystemPosition(
  sys: SystemNode,
  time: number,
  w: number,
  h: number,
  cx: number,
  cy: number,
) {
  const angle = sys.angle + time * ORBIT_SPEEDS[sys.importance] * 0.001;
  return getOrbitPosition(sys.orbit, angle, w, h, cx, cy);
}

export function getDomainPosition(
  dom: DomainNode,
  w: number,
  h: number,
  cx: number,
  cy: number,
) {
  const base = getOrbitPosition(dom.orbit, dom.angle, w, h, cx, cy);
  return {
    x: base.x + dom.offset.x * w,
    y: base.y + dom.offset.y * h,
  };
}

export function getTechClusterPosition(
  tc: TechClusterNode,
  w: number,
  h: number,
  cx: number,
  cy: number,
) {
  return {
    x: cx + tc.position.x * w,
    y: cy + tc.position.y * h,
  };
}

export function getSatellitePosition(
  clusterX: number,
  clusterY: number,
  techIndex: number,
  totalTechs: number,
) {
  const baseAngle = (Math.PI * 2 / totalTechs) * techIndex - Math.PI / 2;
  const orbitRadius = satelliteOrbitRadius(totalTechs);
  return {
    x: clusterX + Math.cos(baseAngle) * orbitRadius,
    y: clusterY + Math.sin(baseAngle) * orbitRadius,
  };
}
