import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import { getAllLabPosts, getLabPostBySlug } from "@/lib/lab";

describe("getAllLabPosts", () => {
  it("returns an array of posts", () => {
    const posts = getAllLabPosts();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
  });

  it("returns posts sorted by date descending", () => {
    const posts = getAllLabPosts();
    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1].date >= posts[i].date).toBe(true);
    }
  });

  it("each post has required metadata fields", () => {
    const posts = getAllLabPosts();
    for (const post of posts) {
      expect(post.title).toBeDefined();
      expect(post.description).toBeDefined();
      expect(post.date).toBeDefined();
      expect(post.slug).toBeDefined();
      expect(post.coverImage).toBeDefined();
      expect(post.tags).toBeDefined();
      expect(Array.isArray(post.tags)).toBe(true);
      expect(post.readingTime).toBeDefined();
      expect(post.readingTime).toBeGreaterThan(0);
    }
  });
});

describe("getLabPostBySlug", () => {
  it("returns a post for a valid slug", () => {
    const post = getLabPostBySlug("building-skills-for-ai-coding-agents");
    expect(post).toBeDefined();
    expect(post!.title).toBe("Lab Day: Building Skills for AI Coding Agents");
    expect(post!.content).toBeDefined();
    expect(post!.content.length).toBeGreaterThan(0);
  });

  it("returns a numeric readingTime", () => {
    const post = getLabPostBySlug("building-skills-for-ai-coding-agents");
    expect(post).toBeDefined();
    expect(typeof post!.readingTime).toBe("number");
    expect(post!.readingTime).toBeGreaterThan(0);
  });

  it("returns undefined for an invalid slug", () => {
    const post = getLabPostBySlug("nonexistent-post");
    expect(post).toBeUndefined();
  });
});

describe("ogImage fallback", () => {
  const testSlug = "building-skills-for-ai-coding-agents";
  const ogPath = path.join(process.cwd(), "public", "lab", testSlug, "og.webp");

  function withoutOgFile<T>(fn: () => T): T {
    const backup = fs.existsSync(ogPath) ? fs.readFileSync(ogPath) : null;
    if (backup !== null) fs.unlinkSync(ogPath);
    try {
      return fn();
    } finally {
      if (backup !== null) fs.writeFileSync(ogPath, backup);
    }
  }

  function withOgFile<T>(fn: () => T): T {
    const backup = fs.existsSync(ogPath) ? fs.readFileSync(ogPath) : null;
    fs.writeFileSync(ogPath, Buffer.from([0]));
    try {
      return fn();
    } finally {
      if (backup !== null) {
        fs.writeFileSync(ogPath, backup);
      } else {
        fs.unlinkSync(ogPath);
      }
    }
  }

  it("getLabPostBySlug returns ogImage=undefined when no og.webp exists", () => {
    withoutOgFile(() => {
      const post = getLabPostBySlug(testSlug);
      expect(post).toBeDefined();
      expect(post!.ogImage).toBeUndefined();
    });
  });

  it("getLabPostBySlug returns the og path when og.webp exists", () => {
    withOgFile(() => {
      const post = getLabPostBySlug(testSlug);
      expect(post).toBeDefined();
      expect(post!.ogImage).toBe(`/lab/${testSlug}/og.webp`);
    });
  });

  it("getAllLabPosts propagates ogImage=undefined when no og.webp exists", () => {
    withoutOgFile(() => {
      const posts = getAllLabPosts();
      const found = posts.find((p) => p.slug === testSlug);
      expect(found).toBeDefined();
      expect(found!.ogImage).toBeUndefined();
    });
  });

  it("getAllLabPosts propagates the og path when og.webp exists", () => {
    withOgFile(() => {
      const posts = getAllLabPosts();
      const found = posts.find((p) => p.slug === testSlug);
      expect(found).toBeDefined();
      expect(found!.ogImage).toBe(`/lab/${testSlug}/og.webp`);
    });
  });
});
