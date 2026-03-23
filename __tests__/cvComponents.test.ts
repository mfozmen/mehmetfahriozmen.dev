import { describe, it, expect } from "vitest";

// CV data-driven tests (no DOM required)
import { cvExperience, cvSkills, cvCoordinates } from "@/data/cvData";

describe("CV Experience data", () => {
  it("has main experience entries", () => {
    expect(cvExperience.length).toBeGreaterThanOrEqual(5);
  });

  it("each entry has role, company, and date", () => {
    for (const entry of cvExperience) {
      expect(entry.role).toBeTruthy();
      expect(entry.company).toBeTruthy();
      expect(entry.date).toBeTruthy();
    }
  });

  it("Mayadem and Brew have nested projects", () => {
    const mayadem = cvExperience.find((e) => e.company === "Mayadem");
    const brew = cvExperience.find((e) => e.company === "Brew Interactive");
    expect(mayadem?.projects?.length).toBeGreaterThanOrEqual(2);
    expect(brew?.projects?.length).toBeGreaterThanOrEqual(3);
  });

  it("entries with descriptions have tech chips", () => {
    const withDesc = cvExperience.filter((e) => e.description);
    for (const entry of withDesc) {
      expect(entry.chips?.length).toBeGreaterThan(0);
    }
  });
});

describe("CV Skills data", () => {
  it("has 4 skill categories", () => {
    expect(cvSkills.length).toBe(4);
  });

  it("each category has label and items", () => {
    for (const cat of cvSkills) {
      expect(cat.label).toBeTruthy();
      expect(cat.items.length).toBeGreaterThan(0);
    }
  });
});

describe("CV Coordinates data", () => {
  it("has 5 coordinate entries", () => {
    expect(cvCoordinates.length).toBe(5);
  });

  it("each entry has label and value", () => {
    for (const coord of cvCoordinates) {
      expect(coord.label).toBeTruthy();
      expect(coord.value).toBeTruthy();
    }
  });
});
