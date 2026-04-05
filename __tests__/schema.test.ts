import { describe, it, expect } from "vitest";
import { buildArticleSchema, buildBreadcrumbSchema } from "@/lib/schema";

describe("buildArticleSchema", () => {
  const post = {
    title: "Test Post",
    description: "A test description",
    coverImage: "/images/test.webp",
    date: "2026-04-05",
  };

  it("builds valid article schema", () => {
    const schema = buildArticleSchema(post, "writing", "test-post");
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("Article");
    expect(schema.headline).toBe("Test Post");
    expect(schema.description).toBe("A test description");
    expect(schema.url).toBe("https://mehmetfahriozmen.dev/writing/test-post");
  });

  it("constructs correct image URL", () => {
    const schema = buildArticleSchema(post, "lab", "test");
    expect(schema.image).toBe("https://mehmetfahriozmen.dev/images/test.webp");
  });

  it("uses correct section in URL", () => {
    const lab = buildArticleSchema(post, "lab", "my-slug");
    const writing = buildArticleSchema(post, "writing", "my-slug");
    expect(lab.url).toContain("/lab/");
    expect(writing.url).toContain("/writing/");
  });

  it("includes author and publisher", () => {
    const schema = buildArticleSchema(post, "writing", "test");
    expect(schema.author.name).toBe("Mehmet Fahri Özmen");
    expect(schema.publisher.name).toBe("Mehmet Fahri Özmen");
  });
});

describe("buildBreadcrumbSchema", () => {
  it("builds valid breadcrumb schema", () => {
    const schema = buildBreadcrumbSchema("Lab", "lab", "My Post");
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("BreadcrumbList");
    expect(schema.itemListElement).toHaveLength(3);
  });

  it("includes correct section in breadcrumb", () => {
    const schema = buildBreadcrumbSchema("Writing", "writing", "Post Title");
    expect(schema.itemListElement[1].name).toBe("Writing");
    expect(schema.itemListElement[1].item).toBe("https://mehmetfahriozmen.dev/writing");
  });

  it("sets post title as last breadcrumb item", () => {
    const schema = buildBreadcrumbSchema("Lab", "lab", "My Title");
    expect(schema.itemListElement[2].name).toBe("My Title");
  });
});
