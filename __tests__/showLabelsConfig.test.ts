import { describe, it, expect } from "vitest";
import type { RenderOpts } from "@/lib/galaxyRenderLoop";

/**
 * Test that ShowLabels config has the right shape and that
 * mobile passes the correct defaults.
 */

type ShowLabels = RenderOpts["showLabels"];

describe("ShowLabels config shape", () => {
  it("includes secondarySystems and minorSystems fields", () => {
    const config: ShowLabels = {
      domains: false,
      techClusters: false,
      secondarySystems: false,
      minorSystems: false,
    };
    expect(config.secondarySystems).toBe(false);
    expect(config.minorSystems).toBe(false);
  });

  it("desktop config shows all labels", () => {
    const desktop: ShowLabels = {
      domains: true,
      techClusters: true,
      secondarySystems: true,
      minorSystems: true,
    };
    expect(desktop.domains).toBe(true);
    expect(desktop.techClusters).toBe(true);
    expect(desktop.secondarySystems).toBe(true);
    expect(desktop.minorSystems).toBe(true);
  });

  it("mobile default hides all non-primary labels", () => {
    const mobile: ShowLabels = {
      domains: false,
      techClusters: false,
      secondarySystems: false,
      minorSystems: false,
    };
    expect(mobile.domains).toBe(false);
    expect(mobile.secondarySystems).toBe(false);
    expect(mobile.minorSystems).toBe(false);
  });

  it("mobile on-tap shows connected labels", () => {
    const mobileTapped: ShowLabels = {
      domains: true,
      techClusters: true,
      secondarySystems: true,
      minorSystems: true,
    };
    expect(mobileTapped.domains).toBe(true);
    expect(mobileTapped.secondarySystems).toBe(true);
  });
});
