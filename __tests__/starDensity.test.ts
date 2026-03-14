import { describe, it, expect } from "vitest";
import { generateBgStars, applyStarDrift } from "@/lib/galaxyStars";

const W = 948;
const H = 600;
const CX = W / 2;
const CY = H / 2;
const STAR_COUNT = 1200;

function countInCircle(
  positions: { x: number; y: number }[],
  cx: number,
  cy: number,
  radius: number,
) {
  return positions.filter((s) => {
    const dx = s.x - cx;
    const dy = s.y - cy;
    return Math.sqrt(dx * dx + dy * dy) < radius;
  }).length;
}

function densityInCircle(
  positions: { x: number; y: number }[],
  cx: number,
  cy: number,
  radius: number,
) {
  const count = countInCircle(positions, cx, cy, radius);
  return count / (Math.PI * radius * radius);
}

function edgeBandDensity(
  positions: { x: number; y: number }[],
  w: number,
  h: number,
  bandWidth: number,
) {
  const count = positions.filter(
    (s) => s.x > w - bandWidth && s.y > h / 2 - 100 && s.y < h / 2 + 100,
  ).length;
  return count / (bandWidth * 200);
}

describe("Star density distribution", () => {
  const stars = generateBgStars(W, H, STAR_COUNT);

  it("generates the expected number of stars", () => {
    expect(stars.length).toBe(STAR_COUNT);
  });

  it("center region (100px radius) has 3x+ density vs edge band at t=0", () => {
    const centerD = densityInCircle(stars, CX, CY, 100);
    const edgeD = edgeBandDensity(stars, W, H, 100);
    const ratio = centerD / Math.max(edgeD, 0.001);
    expect(ratio, `Got ${ratio.toFixed(1)}x`).toBeGreaterThanOrEqual(3);
  });

  it("at least 15% of all stars are within 100px of center", () => {
    const count = countInCircle(stars, CX, CY, 100);
    expect(count / stars.length).toBeGreaterThanOrEqual(0.15);
  });
});

describe("Star drift behavior", () => {
  const stars = generateBgStars(W, H, STAR_COUNT);

  it("stars have measurable linear displacement over time", () => {
    // After 10 seconds of drift, average star should have moved noticeably
    const t = 10; // seconds (time is already in seconds in the component)
    const drifted = stars.map((s) => applyStarDrift(s, t, W, H));

    let totalDisplacement = 0;
    for (let i = 0; i < stars.length; i++) {
      const dx = drifted[i].x - stars[i].x;
      const dy = drifted[i].y - stars[i].y;
      // Account for wrapping — if displacement > half canvas, star wrapped
      const absDx = Math.abs(dx) > W / 2 ? W - Math.abs(dx) : Math.abs(dx);
      const absDy = Math.abs(dy) > H / 2 ? H - Math.abs(dy) : Math.abs(dy);
      totalDisplacement += Math.sqrt(absDx * absDx + absDy * absDy);
    }
    const avgDisplacement = totalDisplacement / stars.length;

    // After 10s at driftSpeed=3, near-layer stars should move ~39px
    // Average across layers should be at least 10px
    expect(
      avgDisplacement,
      `Average displacement after 10s should be >10px, got ${avgDisplacement.toFixed(1)}px`,
    ).toBeGreaterThan(10);
  });

  describe("center density maintained during drift", () => {
    const driftTimes = [0, 30, 60, 120, 200];

    it.each(driftTimes)(
      "center has 2x+ edge density at t=%is",
      (t) => {
        const drifted = stars.map((s) => applyStarDrift(s, t, W, H));
        const centerD = densityInCircle(drifted, CX, CY, 100);
        const edgeD = edgeBandDensity(drifted, W, H, 100);
        const ratio = centerD / Math.max(edgeD, 0.001);
        expect(
          ratio,
          `At t=${t}s: center/edge ratio = ${ratio.toFixed(1)}x`,
        ).toBeGreaterThanOrEqual(2);
      },
    );
  });
});
