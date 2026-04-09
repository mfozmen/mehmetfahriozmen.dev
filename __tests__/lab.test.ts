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

  it("each post description is between 100 and 160 characters", () => {
    const posts = getAllLabPosts();
    for (const post of posts) {
      expect(
        post.description.length,
        `${post.slug} description is too short (${post.description.length} chars, minimum 100)`,
      ).toBeGreaterThanOrEqual(100);
      expect(
        post.description.length,
        `${post.slug} description is too long (${post.description.length} chars, maximum 160)`,
      ).toBeLessThanOrEqual(160);
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
  const perPostOgPath = path.join(process.cwd(), "public", "lab", testSlug, "og.webp");
  const sharedOgPath = path.join(process.cwd(), "public", "lab", "lab-day-og.webp");

  function backupFile(p: string): Buffer | null {
    return fs.existsSync(p) ? fs.readFileSync(p) : null;
  }

  function restoreFile(p: string, backup: Buffer | null): void {
    if (backup !== null) {
      fs.writeFileSync(p, backup);
    } else if (fs.existsSync(p)) {
      fs.unlinkSync(p);
    }
  }

  function withOgState<T>(state: { perPost: boolean; shared: boolean }, fn: () => T): T {
    const perPostBackup = backupFile(perPostOgPath);
    const sharedBackup = backupFile(sharedOgPath);

    if (state.perPost) {
      fs.writeFileSync(perPostOgPath, Buffer.from([0]));
    } else if (perPostBackup !== null) {
      fs.unlinkSync(perPostOgPath);
    }

    if (state.shared) {
      fs.writeFileSync(sharedOgPath, Buffer.from([0]));
    } else if (sharedBackup !== null) {
      fs.unlinkSync(sharedOgPath);
    }

    try {
      return fn();
    } finally {
      restoreFile(perPostOgPath, perPostBackup);
      restoreFile(sharedOgPath, sharedBackup);
    }
  }

  it("getLabPostBySlug returns ogImage=undefined when neither per-post nor shared exists", () => {
    withOgState({ perPost: false, shared: false }, () => {
      const post = getLabPostBySlug(testSlug);
      expect(post).toBeDefined();
      expect(post!.ogImage).toBeUndefined();
    });
  });

  it("getLabPostBySlug returns per-slug og path when only per-post og.webp exists", () => {
    withOgState({ perPost: true, shared: false }, () => {
      const post = getLabPostBySlug(testSlug);
      expect(post).toBeDefined();
      expect(post!.ogImage).toBe(`/lab/${testSlug}/og.webp`);
    });
  });

  it("getAllLabPosts propagates ogImage=undefined when neither file exists", () => {
    withOgState({ perPost: false, shared: false }, () => {
      const posts = getAllLabPosts();
      const found = posts.find((p) => p.slug === testSlug);
      expect(found).toBeDefined();
      expect(found!.ogImage).toBeUndefined();
    });
  });

  it("getAllLabPosts propagates per-slug og path when only per-post og.webp exists", () => {
    withOgState({ perPost: true, shared: false }, () => {
      const posts = getAllLabPosts();
      const found = posts.find((p) => p.slug === testSlug);
      expect(found).toBeDefined();
      expect(found!.ogImage).toBe(`/lab/${testSlug}/og.webp`);
    });
  });

  it("getLabPostBySlug returns shared og path when only lab-day-og.webp exists", () => {
    withOgState({ perPost: false, shared: true }, () => {
      const post = getLabPostBySlug(testSlug);
      expect(post).toBeDefined();
      expect(post!.ogImage).toBe("/lab/lab-day-og.webp");
    });
  });

  it("getLabPostBySlug prefers per-slug og.webp over shared lab-day-og.webp", () => {
    withOgState({ perPost: true, shared: true }, () => {
      const post = getLabPostBySlug(testSlug);
      expect(post).toBeDefined();
      expect(post!.ogImage).toBe(`/lab/${testSlug}/og.webp`);
    });
  });

  it("getAllLabPosts propagates shared og path when only lab-day-og.webp exists", () => {
    withOgState({ perPost: false, shared: true }, () => {
      const posts = getAllLabPosts();
      const found = posts.find((p) => p.slug === testSlug);
      expect(found).toBeDefined();
      expect(found!.ogImage).toBe("/lab/lab-day-og.webp");
    });
  });
});
