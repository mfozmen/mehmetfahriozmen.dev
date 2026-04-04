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
    const post = getLabPostBySlug("writing-custom-skills-for-ai-coding-agents");
    expect(post).toBeDefined();
    expect(post!.title).toBe("Lab Day: Writing Custom Skills for AI Coding Agents");
    expect(post!.content).toBeDefined();
    expect(post!.content.length).toBeGreaterThan(0);
  });

  it("returns undefined for an invalid slug", () => {
    const post = getLabPostBySlug("nonexistent-post");
    expect(post).toBeUndefined();
  });
});
