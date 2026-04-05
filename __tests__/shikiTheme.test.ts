import { describe, it, expect } from "vitest";
import deepSpaceTheme, { PALETTE } from "@/lib/shikiTheme";

describe("deepSpaceTheme", () => {
  it("has required theme fields", () => {
    expect(deepSpaceTheme.name).toBe("deep-space");
    expect(deepSpaceTheme.type).toBe("dark");
    expect(deepSpaceTheme.colors).toBeDefined();
    expect(deepSpaceTheme.tokenColors).toBeDefined();
  });

  it("has dark background color", () => {
    expect(deepSpaceTheme.colors?.["editor.background"]).toBe("#0d0d0d");
  });

  it("has token color definitions", () => {
    expect(Array.isArray(deepSpaceTheme.tokenColors)).toBe(true);
    expect(deepSpaceTheme.tokenColors!.length).toBeGreaterThan(5);
  });

  it("includes keyword scope with dimmed amber", () => {
    const keyword = deepSpaceTheme.tokenColors!.find(
      (t) => Array.isArray(t.scope) && t.scope.includes("keyword")
    );
    expect(keyword).toBeDefined();
    expect(keyword!.settings.foreground).toBe(PALETTE.keyword);
  });

  it("includes comment scope with muted gray", () => {
    const comment = deepSpaceTheme.tokenColors!.find(
      (t) => Array.isArray(t.scope) && t.scope.includes("comment")
    );
    expect(comment).toBeDefined();
    expect(comment!.settings.foreground).toBe(PALETTE.comment);
  });

  it("palette uses dimmed amber for keywords, not full #BA7517", () => {
    expect(PALETTE.keyword).toBe("#A06614");
    expect(PALETTE.keyword).not.toBe("#BA7517");
  });
});
