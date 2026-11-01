import { describe, it, expect } from "vitest";
import { projects, cardProjects } from "@/data/projects";
import { cvExperience } from "@/data/cvData";
import { domains as domainDefs } from "@/data/domains";
import { systems, domains } from "@/data/systemsGraph";
import { ORBIT_SPEEDS, getDomainPosition, getOrbitPosition } from "@/lib/galaxyLayout";
import { systemStarRadius } from "@/lib/galaxyRenderers";
import { mobileLabelAlpha } from "@/lib/galaxyMobileConfig";

describe("Hero tier — invent.ai", () => {
  it("exactly one project is the hero tier and it is invent.ai", () => {
    const heroes = projects.filter((p) => p.importance === "hero");
    expect(heroes.map((p) => p.id)).toEqual(["inventai"]);
    expect(heroes[0].url).toBe("https://www.invent.ai/");
  });

  it("invent.ai is the current Staff Software Engineer role", () => {
    const invent = projects.find((p) => p.id === "inventai")!;
    expect(invent.role).toBe("STAFF SOFTWARE ENGINEER · NOV 2026 → PRESENT");
  });

  it("invent.ai connects to the retail and analytics domains and the AI cluster", () => {
    const invent = projects.find((p) => p.id === "inventai")!;
    expect(new Set(invent.domains)).toEqual(new Set(["retail", "analytics"]));
    expect(invent.technologyCategories).toEqual(["ai"]);
  });

  it("the retail domain exists with a galaxy layout entry", () => {
    expect(domainDefs.find((d) => d.id === "retail")).toBeDefined();
    expect(domains.find((d) => d.id === "retail")).toBeDefined();
  });

  it("the retail label sits clear of every orbit path, so no star ever parks on it", () => {
    const W = 948, H = 600;
    const p = getDomainPosition(domains.find((d) => d.id === "retail")!, W, H, W / 2, H / 2);
    let minDist = Infinity;
    for (const orbit of [0, 1, 2]) {
      for (let deg = 0; deg < 360; deg++) {
        const q = getOrbitPosition(orbit, (deg * Math.PI) / 180, W, H, W / 2, H / 2);
        minDist = Math.min(minDist, Math.hypot(p.x - q.x, p.y - q.y));
      }
    }
    expect(minDist).toBeGreaterThanOrEqual(45);
  });

  it("invent.ai sits on the outermost ring (orbit 0)", () => {
    expect(systems.find((s) => s.id === "inventai")!.orbit).toBe(0);
  });

  it("invent.ai has featured-card content (description + highlights)", () => {
    const invent = projects.find((p) => p.id === "inventai")!;
    expect(invent.description!.length).toBeGreaterThan(40);
    expect(invent.highlights?.length).toBe(3);
  });

  it("Insider One steps down to primary, first in line; other primaries unchanged", () => {
    const primaries = projects.filter((p) => p.importance === "primary").map((p) => p.id);
    expect(primaries).toEqual([
      "insiderone",
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
      new Set(["ai", "databases", "cloud", "devops", "api", "architecture", "frameworks", "methodologies"]),
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

  it("Insider One keeps its card content as a primary system", () => {
    const insider = projects.find((p) => p.id === "insiderone")!;
    expect(insider.description!.length).toBeGreaterThan(40);
    expect(insider.highlights?.length).toBe(3);
  });

  it("MagicPags stays in the galaxy but its dead link is gone everywhere", () => {
    expect(systems.find((s) => s.id === "magicpags")).toBeDefined();
    expect(projects.find((p) => p.id === "magicpags")!.url).toBeUndefined();
    const cvProjects = cvExperience.flatMap((e) => e.projects ?? []);
    expect(cvProjects.find((p) => p.name === "MagicPags")!.url).toBeUndefined();
  });

  it("homepage cards are links, so only linked primaries get one — six cards, two even rows", () => {
    expect(cardProjects.map((p) => p.id)).toEqual([
      "insiderone",
      "mobilet",
      "shubuo",
      "villasepeti",
      "beforesunset",
      "decktopus",
    ]);
  });
});
