import { describe, it, expect } from "vitest";
import { extractTextContent, footnoteIndex, splitFootnote } from "@/lib/mdxUtils";

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

describe("extractTextContent fallbacks", () => {
  it("returns empty for an object without props", () => {
    expect(extractTextContent({} as never)).toBe("");
  });
});

describe("splitFootnote", () => {
  it("drops the number and the title, keeps the note", () => {
    expect(splitFootnote("2. SWE-Bench Pro — Scale AI, 2025. Dropped to 8.2%.", "SWE-Bench Pro")).toBe("Scale AI, 2025. Dropped to 8.2%.");
  });

  it("returns empty when the item is only a title", () => {
    expect(splitFootnote("5. Effective context engineering", "Effective context engineering")).toBe("");
  });
});

describe("footnoteIndex", () => {
  it("reads the number from a footnote href and ignores other anchors", () => {
    expect(footnoteIndex("#src-3")).toBe(3);
    expect(footnoteIndex("#ref-3")).toBeNull();
    expect(footnoteIndex("#intro")).toBeNull();
  });
});
