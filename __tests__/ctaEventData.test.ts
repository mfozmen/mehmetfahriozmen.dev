import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("CTA event data", () => {
  it("blog post CTAs include the slug in page path, not a static /writing", () => {
    const source = readFileSync(
      join(process.cwd(), "app/writing/[slug]/page.tsx"),
      "utf-8",
    );

    // Find all eventData page values in PostEnding
    const pageValues = [...source.matchAll(/page:\s*["'`]([^"'`]+)["'`]/g)].map(
      (m) => m[1],
    );

    // None of the page values should be the static "/writing" — they should include the slug
    for (const page of pageValues) {
      expect(page).not.toBe("/writing");
    }
  });

  it("blog post CTAs use template literal with slug variable for page path", () => {
    const source = readFileSync(
      join(process.cwd(), "app/writing/[slug]/page.tsx"),
      "utf-8",
    );

    // The PostEnding component should use backtick template with slug
    expect(source).toContain("page: `/writing/${slug}`");
  });
});
