import { describe, it, expect } from "vitest";
import {
  systems,
  domains,
  techClusters,
  orbits,
} from "@/data/systemsGraph";
import { featuredSystems } from "@/data/featuredSystems";

const domainIds = new Set(domains.map((d) => d.id));
const techClusterIds = new Set(techClusters.map((tc) => tc.id));
const systemIds = new Set(systems.map((s) => s.id));
const systemNames = new Set(systems.map((s) => s.name));
const validOrbitIndices = new Set(orbits.map((_, i) => i));

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
});
