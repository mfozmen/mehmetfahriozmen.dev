import { describe, it, expect } from "vitest";
import { domainFade } from "@/lib/galaxyLayout";

const dom = { x: 400, y: 300 };

describe("domainFade — domain labels yield to passing stars", () => {
  it("is fully visible when no star is near", () => {
    expect(domainFade(dom, [{ x: 100, y: 100 }], 1)).toBe(1);
  });

  it("is hidden when a star sits on the label row (wide horizontal reach)", () => {
    // VillaSepeti ↔ Non-Profit on desktop: 58px apart horizontally, same row
    expect(domainFade(dom, [{ x: 342, y: 302 }], 1)).toBe(0);
  });

  it("fades partially in the transition band", () => {
    const f = domainFade(dom, [{ x: 400, y: 330 }], 1);
    expect(f).toBeGreaterThan(0);
    expect(f).toBeLessThan(1);
  });

  it("uses the nearest star", () => {
    expect(domainFade(dom, [{ x: 100, y: 100 }, { x: 400, y: 300 }], 1)).toBe(0);
  });

  it("scales its reach with the canvas scale factor", () => {
    const star = [{ x: 342, y: 302 }];
    expect(domainFade(dom, star, 0.5)).toBe(1);
  });
});
