import { describe, it, expect } from "vitest";
import { projects } from "@/data/projects";
import { domains as domainDefs } from "@/data/domains";
import { systems, domains } from "@/data/systemsGraph";
import { ORBIT_SPEEDS } from "@/lib/galaxyLayout";
import { systemStarRadius } from "@/lib/galaxyRenderers";
import { mobileLabelAlpha } from "@/lib/galaxyMobileConfig";

describe("Hero tier — Insider One", () => {
  it("exactly one project is the hero tier and it is Insider One", () => {
    const heroes = projects.filter((p) => p.importance === "hero");
    expect(heroes.map((p) => p.id)).toEqual(["insiderone"]);
    expect(heroes[0].url).toBe("https://insiderone.com/");
  });

  it("existing primaries remain primary (none demoted/promoted by accident)", () => {
    const primaries = projects.filter((p) => p.importance === "primary").map((p) => p.id);
    expect(primaries).toEqual([
      "mobilet",
      "shubuo",
      "villasepeti",
      "magicpags",
      "beforesunset",
      "decktopus",
    ]);
  });

  it("Insider One connects to the four expected domains", () => {
    const insider = projects.find((p) => p.id === "insiderone")!;
    expect(new Set(insider.domains)).toEqual(
      new Set(["adtech", "distributed", "customer_engagement", "analytics"]),
    );
  });

  it("Insider One connects to the eight expected tech clusters", () => {
    const insider = projects.find((p) => p.id === "insiderone")!;
    expect(new Set(insider.technologyCategories)).toEqual(
      new Set(["databases", "cloud", "devops", "api", "architecture", "messaging", "frameworks", "methodologies"]),
    );
  });

  it("the two new domains exist with galaxy layout entries", () => {
    for (const id of ["customer_engagement", "analytics"]) {
      expect(domainDefs.find((d) => d.id === id), `domain def ${id}`).toBeDefined();
      expect(domains.find((d) => d.id === id), `galaxy layout for ${id}`).toBeDefined();
    }
  });

  it("hero star radius is noticeably larger than primary (>=1.4x), not a marginal bump", () => {
    const sf = 1;
    const hero = systemStarRadius("hero", sf);
    const primary = systemStarRadius("primary", sf);
    expect(hero).toBeGreaterThanOrEqual(primary * 1.4);
  });

  it("hero radius dominates every other tier at the same scale factor", () => {
    const sf = 0.8;
    const hero = systemStarRadius("hero", sf);
    for (const tier of ["primary", "secondary", "minor"] as const) {
      expect(hero).toBeGreaterThan(systemStarRadius(tier, sf));
    }
  });

  it("hero orbit speed exists, is slower than primary, and is non-zero", () => {
    expect(ORBIT_SPEEDS.hero).toBeGreaterThan(0);
    expect(ORBIT_SPEEDS.hero).toBeLessThan(ORBIT_SPEEDS.primary);
  });

  it("hero label is at least as prominent as primary on mobile", () => {
    expect(mobileLabelAlpha("hero", 0.5)).toBeGreaterThanOrEqual(mobileLabelAlpha("primary", 0.5));
    expect(mobileLabelAlpha("hero", 1.0)).toBeGreaterThanOrEqual(mobileLabelAlpha("primary", 1.0));
  });

  it("Insider One sits on the outermost ring (orbit 0)", () => {
    const insider = systems.find((s) => s.id === "insiderone")!;
    expect(insider.orbit).toBe(0);
  });
});
