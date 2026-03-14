import { describe, it, expect } from "vitest";

/**
 * To test star density, we need access to generateBgStars().
 * Currently it's a private function inside the component.
 * We'll extract it to lib/galaxyStars.ts so both the component
 * and tests can import it.
 */
import { generateBgStars } from "@/lib/galaxyStars";

const W = 948;
const H = 600;
const CX = W / 2;
const CY = H / 2;
const STAR_COUNT = 1200;

describe("Star density distribution", () => {
  const stars = generateBgStars(W, H, STAR_COUNT);

  it("generates the expected number of stars", () => {
    expect(stars.length).toBe(STAR_COUNT);
  });

  it("center region (100px radius) has 3x+ density vs edge band", () => {
    const centerRadius = 100;
    const edgeBandWidth = 100;

    // Count stars within 100px of center
    const centerStars = stars.filter((s) => {
      const dx = s.x - CX;
      const dy = s.y - CY;
      return Math.sqrt(dx * dx + dy * dy) < centerRadius;
    });

    // Count stars in a 100px band at the right edge (W-100 to W)
    const edgeStars = stars.filter(
      (s) => s.x > W - edgeBandWidth && s.y > CY - centerRadius && s.y < CY + centerRadius,
    );

    // Area of center circle: π * 100² ≈ 31,416 px²
    // Area of edge band (100 x 200 strip): 20,000 px²
    // Normalize to density (stars per 10,000 px²)
    const centerArea = Math.PI * centerRadius * centerRadius;
    const edgeArea = edgeBandWidth * (centerRadius * 2);

    const centerDensity = centerStars.length / centerArea;
    const edgeDensity = edgeStars.length / edgeArea;

    const ratio = centerDensity / Math.max(edgeDensity, 0.001);

    expect(
      ratio,
      `Center density should be 3x+ edge density. Got ${ratio.toFixed(1)}x ` +
        `(center: ${centerStars.length} stars in ${Math.round(centerArea)}px², ` +
        `edge: ${edgeStars.length} stars in ${Math.round(edgeArea)}px²)`,
    ).toBeGreaterThanOrEqual(3);
  });

  it("at least 15% of all stars are within 100px of center", () => {
    const centerRadius = 100;
    const centerStars = stars.filter((s) => {
      const dx = s.x - CX;
      const dy = s.y - CY;
      return Math.sqrt(dx * dx + dy * dy) < centerRadius;
    });

    const ratio = centerStars.length / stars.length;
    expect(
      ratio,
      `Expected 15%+ of stars near center, got ${(ratio * 100).toFixed(1)}%`,
    ).toBeGreaterThanOrEqual(0.15);
  });
});
