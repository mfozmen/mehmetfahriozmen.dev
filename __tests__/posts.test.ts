import { describe, it, expect } from "vitest";
import { getAllPosts, getPostBySlug, getReadingTime, formatDate, sortByDateDesc } from "@/lib/posts";

describe("getAllPosts", () => {
  it("returns an array of posts", () => {
    const posts = getAllPosts();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
  });

  it("returns posts sorted by date descending", () => {
    const posts = getAllPosts();
    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1].date >= posts[i].date).toBe(true);
    }
  });

  it("each post has required metadata fields", () => {
    const posts = getAllPosts();
    for (const post of posts) {
      expect(post.title).toBeDefined();
      expect(post.date).toBeDefined();
      expect(post.slug).toBeDefined();
      expect(post.coverImage).toBeDefined();
      expect(post.excerpt).toBeDefined();
      expect(post.readingTime).toBeDefined();
      expect(post.readingTime).toBeGreaterThan(0);
    }
  });
});

describe("getPostBySlug", () => {
  it("returns a post for a valid slug", () => {
    const post = getPostBySlug("hardest-refactor");
    expect(post).toBeDefined();
    expect(post!.title).toBe("The Hardest Refactor: From Engineer to Manager");
    expect(post!.content).toBeDefined();
    expect(post!.content.length).toBeGreaterThan(0);
  });

  it("returns undefined for an invalid slug", () => {
    const post = getPostBySlug("nonexistent-post");
    expect(post).toBeUndefined();
  });
});

describe("getReadingTime", () => {
  it("calculates reading time based on word count", () => {
    const words200 = Array(200).fill("word").join(" ");
    expect(getReadingTime(words200)).toBe(1);
  });

  it("rounds up partial minutes", () => {
    const words201 = Array(201).fill("word").join(" ");
    expect(getReadingTime(words201)).toBe(2);
  });

  it("handles short content", () => {
    expect(getReadingTime("hello world")).toBe(1);
  });

  it("returns correct time for the actual blog post", () => {
    const post = getPostBySlug("hardest-refactor");
    expect(post).toBeDefined();
    const time = getReadingTime(post!.content);
    expect(time).toBeGreaterThanOrEqual(3);
    expect(time).toBeLessThanOrEqual(10);
  });
});

describe("sortByDateDesc", () => {
  it("returns -1 when first date is newer", () => {
    expect(sortByDateDesc({ date: "2026-03-25" }, { date: "2026-01-01" })).toBe(-1);
  });

  it("returns 1 when first date is older", () => {
    expect(sortByDateDesc({ date: "2025-01-01" }, { date: "2026-03-25" })).toBe(1);
  });

  it("returns 1 when dates are equal", () => {
    expect(sortByDateDesc({ date: "2026-03-25" }, { date: "2026-03-25" })).toBe(1);
  });
});

describe("formatDate", () => {
  it("formats ISO date to human-readable", () => {
    expect(formatDate("2026-03-25")).toBe("March 25, 2026");
  });

  it("formats different months correctly", () => {
    expect(formatDate("2025-01-01")).toBe("January 1, 2025");
    expect(formatDate("2024-12-31")).toBe("December 31, 2024");
  });
});
