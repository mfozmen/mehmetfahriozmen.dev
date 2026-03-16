import { describe, it, expect } from "vitest";
import {
  mobileLabelSize,
  mobileLabelAlpha,
  mobileCenterGlowScale,
  mobileDriftSpeed,
} from "@/lib/galaxyMobileConfig";

describe("Mobile label sizing", () => {
  it("enforces system label minimum 11px at small sf", () => {
    // 13 * 0.4 = 5.2 → floor to 11
    expect(mobileLabelSize(13, 0.4, 11)).toBe(11);
  });

  it("uses normal scaling when above minimum", () => {
    // 13 * 1.0 = 13 → above 11 floor
    expect(mobileLabelSize(13, 1.0, 11)).toBe(13);
  });

  it("enforces domain/tech label minimum 8px", () => {
    // 9 * 0.4 = 3.6 → floor to 8
    expect(mobileLabelSize(9, 0.4, 8)).toBe(8);
  });

  it("domain/tech label scales normally when large enough", () => {
    // 9 * 1.0 = 9 → above 8 floor
    expect(mobileLabelSize(9, 1.0, 8)).toBe(9);
  });

  it("secondary system label (base 11) at small sf floors to 11", () => {
    // 11 * 0.5 = 5.5 → floor to 11
    expect(mobileLabelSize(11, 0.5, 11)).toBe(11);
  });
});

describe("Mobile label alpha boost", () => {
  it("primary system label is 0.9 on mobile (sf < 0.7)", () => {
    expect(mobileLabelAlpha("primary", 0.5)).toBe(0.9);
  });

  it("secondary system label is 0.65 on mobile", () => {
    expect(mobileLabelAlpha("secondary", 0.5)).toBe(0.65);
  });

  it("minor system label is 0.4 on mobile", () => {
    expect(mobileLabelAlpha("minor", 0.5)).toBe(0.4);
  });

  it("returns desktop defaults when sf >= 0.7", () => {
    expect(mobileLabelAlpha("primary", 1.0)).toBe(0.8);
    expect(mobileLabelAlpha("secondary", 1.0)).toBe(0.55);
    expect(mobileLabelAlpha("minor", 1.0)).toBe(0.3);
  });
});

describe("Mobile center glow", () => {
  it("returns 0.6 scale on mobile (40% reduction)", () => {
    expect(mobileCenterGlowScale(0.5)).toBe(0.6);
  });

  it("returns 1.0 on desktop", () => {
    expect(mobileCenterGlowScale(1.0)).toBe(1);
  });
});

describe("Mobile drift speed", () => {
  it("returns 0.5 multiplier on mobile", () => {
    expect(mobileDriftSpeed(0.5)).toBe(0.5);
  });

  it("returns 1.0 on desktop", () => {
    expect(mobileDriftSpeed(1.0)).toBe(1);
  });
});
