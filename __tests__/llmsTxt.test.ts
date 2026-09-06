import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { buildLlmsTxt, getLlmsTxt } from "@/lib/llmsTxt";
import { getAllPosts } from "@/lib/posts";
import { getAllLabPosts } from "@/lib/lab";
import { projects } from "@/data/projects";

const SITE = "https://mehmetfahriozmen.dev";

describe("buildLlmsTxt", () => {
  const posts = [
    { title: "The First Button", slug: "the-first-button", description: "Planning, skipped.", date: "2026-09-06" },
    { title: "The Ant Colony", slug: "the-ant-colony", description: "Two floors, two of everything.", date: "2026-06-14" },
  ];
  const lab = [{ title: "Lab Day: HTTP QUERY Method", slug: "http-query-method", description: "A body on GET.", date: "2026-05-01" }];

  it("lists every writing post as a markdown link with its description", () => {
    const txt = buildLlmsTxt(posts, lab);
    expect(txt).toContain(`- [The First Button](${SITE}/writing/the-first-button): Planning, skipped.`);
    expect(txt).toContain(`- [The Ant Colony](${SITE}/writing/the-ant-colony): Two floors, two of everything.`);
  });

  it("lists lab posts under their own section", () => {
    const txt = buildLlmsTxt(posts, lab);
    const labIdx = txt.indexOf("## Lab Day");
    expect(labIdx).toBeGreaterThan(-1);
    expect(txt.indexOf(`${SITE}/lab/http-query-method`)).toBeGreaterThan(labIdx);
  });

  it("keeps the static identity block and points at feed and sitemap", () => {
    const txt = buildLlmsTxt(posts, lab);
    expect(txt.startsWith("# mehmetfahriozmen.dev")).toBe(true);
    expect(txt).toContain("## Author");
    expect(txt).toContain(`${SITE}/feed.xml`);
    expect(txt).toContain(`${SITE}/sitemap.xml`);
  });

  it("escapes a closing bracket in a title so the markdown link survives", () => {
    const txt = buildLlmsTxt([{ title: "Lab Day: Arrays [1]", slug: "arrays", description: "d", date: "2026-01-01" }], []);
    expect(txt).toContain(`- [Lab Day: Arrays [1\\]](${SITE}/writing/arrays): d`);
  });

  it("puts newest writing first", () => {
    const txt = buildLlmsTxt([...posts].reverse(), lab);
    expect(txt.indexOf("the-first-button")).toBeLessThan(txt.indexOf("the-ant-colony"));
  });
});

describe("getLlmsTxt (real content)", () => {
  const txt = getLlmsTxt();

  it("mentions every published writing and lab post, so the file can never go stale", () => {
    for (const post of getAllPosts()) expect(txt).toContain(`${SITE}/writing/${post.slug}`);
    for (const post of getAllLabPosts()) expect(txt).toContain(`${SITE}/lab/${post.slug}`);
  });

  it("lists hero and primary systems from data/projects.ts, never a hand-written copy", () => {
    for (const p of projects.filter((p) => p.importance === "hero" || p.importance === "primary")) {
      expect(txt).toContain(`- [${p.name}](`);
    }
  });

  it("is not shadowed by a static public/llms.txt", () => {
    // Next serves public/ before app routes; a leftover static file would silently win.
    expect(existsSync("public/llms.txt")).toBe(false);
  });
});
