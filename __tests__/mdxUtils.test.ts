import { describe, it, expect } from "vitest";
import { extractTextContent } from "@/lib/mdxUtils";

describe("extractTextContent", () => {
  it("extracts plain string", () => {
    expect(extractTextContent("hello")).toBe("hello");
  });

  it("extracts number as string", () => {
    expect(extractTextContent(42)).toBe("42");
  });

  it("returns empty for null/undefined", () => {
    expect(extractTextContent(null)).toBe("");
    expect(extractTextContent(undefined)).toBe("");
  });

  it("joins array of strings", () => {
    expect(extractTextContent(["hello", " ", "world"])).toBe("hello world");
  });

  it("extracts from nested props structure", () => {
    const node = { props: { children: "nested text" } };
    expect(extractTextContent(node)).toBe("nested text");
  });

  it("extracts from deeply nested structure", () => {
    const node = {
      props: {
        children: [
          { props: { children: "line 1" } },
          "\n",
          { props: { children: "line 2" } },
        ],
      },
    };
    expect(extractTextContent(node)).toBe("line 1\nline 2");
  });

  it("handles mixed content types", () => {
    const node = { props: { children: ["text", 42, null, "more"] } };
    expect(extractTextContent(node)).toBe("text42more");
  });
});
