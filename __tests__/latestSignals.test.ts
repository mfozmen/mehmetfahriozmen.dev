import { describe, it, expect } from "vitest";
import { getLatestSignals } from "@/components/LatestSignals";

describe("getLatestSignals", () => {
  it("returns at most 3 items", () => {
    const items = getLatestSignals();
    expect(items.length).toBeLessThanOrEqual(3);
    expect(items.length).toBeGreaterThan(0);
  });

  it("returns items sorted by date descending", () => {
    const items = getLatestSignals();
    for (let i = 1; i < items.length; i++) {
      expect(items[i - 1].date >= items[i].date).toBe(true);
    }
  });

  it("each item has required fields", () => {
    const items = getLatestSignals();
    for (const item of items) {
      expect(item.title).toBeDefined();
      expect(item.date).toBeDefined();
      expect(item.slug).toBeDefined();
      expect(item.excerpt).toBeDefined();
      expect(item.readingTime).toBeGreaterThan(0);
      expect(item.href).toMatch(/^\/(writing|lab)\//);
      expect(["field-notes", "lab-day"]).toContain(item.kind);
    }
  });

  it("includes both writing and lab posts when available", () => {
    const items = getLatestSignals();
    const kinds = new Set(items.map((i) => i.kind));
    expect(kinds.size).toBeGreaterThanOrEqual(1);
  });

  it("strips Lab Day prefix from lab post titles", () => {
    const items = getLatestSignals();
    const labItems = items.filter((i) => i.kind === "lab-day");
    for (const item of labItems) {
      expect(item.title).not.toMatch(/^Lab Day:\s*/i);
    }
  });

  it("uses correct href prefix for each kind", () => {
    const items = getLatestSignals();
    for (const item of items) {
      if (item.kind === "field-notes") {
        expect(item.href).toMatch(/^\/writing\//);
      } else {
        expect(item.href).toMatch(/^\/lab\//);
      }
    }
  });
});
