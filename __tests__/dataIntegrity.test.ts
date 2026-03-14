import { describe, it, expect } from "vitest";
import {
  systems,
  domains,
  techClusters,
  orbits,
} from "@/data/systemsGraph";
import { projects } from "@/data/projects";
import { domains as domainDefs } from "@/data/domains";
import { technologyCategories } from "@/data/technologies";
import { featuredSystems } from "@/data/featuredSystems";

const domainIds = new Set(domains.map((d) => d.id));
const techClusterIds = new Set(techClusters.map((tc) => tc.id));
const systemIds = new Set(systems.map((s) => s.id));
const validOrbitIndices = new Set(orbits.map((_, i) => i));
const domainDefIds = new Set(domainDefs.map((d) => d.id));
const techCatIds = new Set(technologyCategories.map((tc) => tc.id));

describe("Data referential integrity", () => {
  describe("system references", () => {
    for (const sys of systems) {
      it(`${sys.name}: all domain refs are valid`, () => {
        const invalid = sys.domains.filter((d) => !domainIds.has(d));
        expect(
          invalid,
          `${sys.name} references non-existent domains: ${invalid.join(", ")}`,
        ).toHaveLength(0);
      });

      it(`${sys.name}: all techCluster refs are valid`, () => {
        const invalid = sys.techClusters.filter((tc) => !techClusterIds.has(tc));
        expect(
          invalid,
          `${sys.name} references non-existent tech clusters: ${invalid.join(", ")}`,
        ).toHaveLength(0);
      });

      it(`${sys.name}: orbit index is valid`, () => {
        expect(
          validOrbitIndices.has(sys.orbit),
          `${sys.name} has orbit ${sys.orbit}, valid indices are ${[...validOrbitIndices].join(", ")}`,
        ).toBe(true);
      });

      it(`${sys.name}: has at least one domain`, () => {
        expect(sys.domains.length).toBeGreaterThanOrEqual(1);
      });

      it(`${sys.name}: has at least one tech cluster`, () => {
        expect(sys.techClusters.length).toBeGreaterThanOrEqual(1);
      });
    }
  });

  describe("no duplicate IDs", () => {
    it("no duplicate system IDs", () => {
      const ids = systems.map((s) => s.id);
      const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
      expect(dupes, `Duplicate system IDs: ${dupes.join(", ")}`).toHaveLength(0);
    });

    it("no duplicate domain IDs", () => {
      const ids = domains.map((d) => d.id);
      const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
      expect(dupes, `Duplicate domain IDs: ${dupes.join(", ")}`).toHaveLength(0);
    });

    it("no duplicate tech cluster IDs", () => {
      const ids = techClusters.map((tc) => tc.id);
      const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
      expect(dupes, `Duplicate tech cluster IDs: ${dupes.join(", ")}`).toHaveLength(0);
    });
  });

  describe("no orphan domains", () => {
    for (const dom of domains) {
      it(`domain "${dom.name}" is referenced by at least one system`, () => {
        const refs = systems.filter((s) => s.domains.includes(dom.id));
        expect(
          refs.length,
          `Domain "${dom.name}" (${dom.id}) is not referenced by any system`,
        ).toBeGreaterThanOrEqual(1);
      });
    }
  });

  describe("no orphan tech clusters", () => {
    for (const tc of techClusters) {
      it(`tech cluster "${tc.name}" is referenced by at least one system`, () => {
        const refs = systems.filter((s) => s.techClusters.includes(tc.id));
        expect(
          refs.length,
          `Tech cluster "${tc.name}" (${tc.id}) is not referenced by any system`,
        ).toBeGreaterThanOrEqual(1);
      });
    }
  });

  describe("featured systems", () => {
    for (const feat of featuredSystems) {
      it(`featured "${feat.title}" references a valid system ID`, () => {
        expect(
          systemIds.has(feat.id),
          `Featured system "${feat.title}" has id "${feat.id}" which doesn't exist in systemsGraph`,
        ).toBe(true);
      });

      it(`featured "${feat.title}" name matches system name`, () => {
        const sys = systems.find((s) => s.id === feat.id);
        expect(sys, `No system with id "${feat.id}"`).toBeDefined();
        expect(
          feat.title,
          `Featured title "${feat.title}" doesn't match system name "${sys?.name}"`,
        ).toBe(sys!.name);
      });
    }
  });

  describe("cross-file consistency", () => {
    it("every project domain exists in data/domains.ts", () => {
      const invalid: string[] = [];
      for (const p of projects) {
        for (const d of p.domains) {
          if (!domainDefIds.has(d)) invalid.push(`${p.name} → ${d}`);
        }
      }
      expect(invalid, `Missing domains: ${invalid.join(", ")}`).toHaveLength(0);
    });

    it("every project technologyCategory exists in data/technologies.ts", () => {
      const invalid: string[] = [];
      for (const p of projects) {
        for (const tc of p.technologyCategories) {
          if (!techCatIds.has(tc)) invalid.push(`${p.name} → ${tc}`);
        }
      }
      expect(invalid, `Missing tech categories: ${invalid.join(", ")}`).toHaveLength(0);
    });

    it("every domain definition has a galaxy layout entry", () => {
      const missing = domainDefs.filter((d) => !domainIds.has(d.id));
      expect(
        missing.map((d) => d.id),
        `Domains without galaxy layout: ${missing.map((d) => d.id).join(", ")}`,
      ).toHaveLength(0);
    });

    it("every technology category has a galaxy position", () => {
      const missing = technologyCategories.filter((tc) => !techClusterIds.has(tc.id));
      expect(
        missing.map((tc) => tc.id),
        `Tech categories without galaxy position: ${missing.map((tc) => tc.id).join(", ")}`,
      ).toHaveLength(0);
    });

    it("every project has a galaxy layout entry", () => {
      const missing = projects.filter((p) => !systemIds.has(p.id));
      expect(
        missing.map((p) => p.id),
        `Projects without galaxy layout: ${missing.map((p) => p.id).join(", ")}`,
      ).toHaveLength(0);
    });
  });
});
