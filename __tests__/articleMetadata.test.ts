import { describe, it, expect } from "vitest";
import { buildArticleMetadata } from "@/lib/articleMetadata";

type OgImage = { url: string; width: number; height: number; alt: string };

const basePost = {
  title: "Test Post",
  description: "Test description for a blog post",
  date: "2026-04-10",
  coverImage: "/writing/test-post/cover.webp",
};

describe("buildArticleMetadata", () => {
  describe("without ogImage", () => {
    it("uses coverImage URL with 800 height", () => {
      const meta = buildArticleMetadata(basePost, "writing", "test-post");
      const images = meta.openGraph?.images as OgImage[];
      expect(images).toHaveLength(1);
      expect(images[0].url).toBe("https://mehmetfahriozmen.dev/writing/test-post/cover.webp");
      expect(images[0].width).toBe(1200);
      expect(images[0].height).toBe(800);
      expect(images[0].alt).toBe("Test Post");
    });

    it("twitter images use the same coverImage URL", () => {
      const meta = buildArticleMetadata(basePost, "writing", "test-post");
      expect(meta.twitter?.images).toEqual(["https://mehmetfahriozmen.dev/writing/test-post/cover.webp"]);
    });
  });

  describe("with ogImage", () => {
    const postWithOg = { ...basePost, ogImage: "/writing/test-post/og.webp" };

    it("uses ogImage URL with 630 height", () => {
      const meta = buildArticleMetadata(postWithOg, "writing", "test-post");
      const images = meta.openGraph?.images as OgImage[];
      expect(images).toHaveLength(1);
      expect(images[0].url).toBe("https://mehmetfahriozmen.dev/writing/test-post/og.webp");
      expect(images[0].width).toBe(1200);
      expect(images[0].height).toBe(630);
      expect(images[0].alt).toBe("Test Post");
    });

    it("twitter images use the same ogImage URL", () => {
      const meta = buildArticleMetadata(postWithOg, "writing", "test-post");
      expect(meta.twitter?.images).toEqual(["https://mehmetfahriozmen.dev/writing/test-post/og.webp"]);
    });

    it("falls back from empty-string ogImage to coverImage", () => {
      // ogImage is string | undefined — an empty string is falsy, so the
      // ternary picks 800 not 630. Verifies the truthiness check, not just
      // the nullish coalescing.
      const postWithEmptyOg = { ...basePost, ogImage: "" };
      const meta = buildArticleMetadata(postWithEmptyOg, "writing", "test-post");
      const images = meta.openGraph?.images as OgImage[];
      expect(images[0].height).toBe(800);
    });
  });

  describe("section + slug in URLs", () => {
    it("writing section uses /writing/${slug}", () => {
      const meta = buildArticleMetadata(basePost, "writing", "hardest-refactor");
      expect(meta.alternates?.canonical).toBe("/writing/hardest-refactor");
      expect(meta.openGraph?.url).toBe("/writing/hardest-refactor");
    });

    it("lab section uses /lab/${slug}", () => {
      const meta = buildArticleMetadata(basePost, "lab", "building-skills-for-ai-coding-agents");
      expect(meta.alternates?.canonical).toBe("/lab/building-skills-for-ai-coding-agents");
      expect(meta.openGraph?.url).toBe("/lab/building-skills-for-ai-coding-agents");
    });
  });

  describe("common fields", () => {
    it("sets title and description at every level", () => {
      const meta = buildArticleMetadata(basePost, "writing", "test-post");
      expect(meta.title).toBe("Test Post");
      expect(meta.description).toBe("Test description for a blog post");
      expect(meta.openGraph?.title).toBe("Test Post");
      expect(meta.openGraph?.description).toBe("Test description for a blog post");
      expect(meta.twitter?.title).toBe("Test Post");
      expect(meta.twitter?.description).toBe("Test description for a blog post");
    });

    it("sets openGraph type to article", () => {
      const meta = buildArticleMetadata(basePost, "writing", "test-post");
      expect(meta.openGraph?.type).toBe("article");
    });

    it("sets publishedTime from post.date", () => {
      const meta = buildArticleMetadata(basePost, "writing", "test-post");
      // The openGraph type is a union; publishedTime only exists on the article variant.
      expect((meta.openGraph as { publishedTime?: string }).publishedTime).toBe("2026-04-10");
    });

    it("sets author", () => {
      const meta = buildArticleMetadata(basePost, "writing", "test-post");
      expect((meta.openGraph as { authors?: string[] }).authors).toEqual(["Mehmet Fahri Özmen"]);
    });

    it("sets twitter card to summary_large_image", () => {
      const meta = buildArticleMetadata(basePost, "writing", "test-post");
      expect(meta.twitter?.card).toBe("summary_large_image");
    });
  });
});
