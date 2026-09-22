import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { extractTextContent, footnoteIndex, headingId, splitFootnote } from "@/lib/mdxUtils";

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

describe("headingId", () => {
  it("turns a heading into a stable, URL-safe id", () => {
    expect(headingId("Written as you go")).toBe("written-as-you-go");
    expect(headingId("Abundant, scarce")).toBe("abundant-scarce");
    expect(headingId("Too much context")).toBe("too-much-context");
  });

  it("drops punctuation and accents, collapses spaces", () => {
    expect(headingId("  The  AGENTS.md  file? ")).toBe("the-agentsmd-file");
    expect(headingId("Café — déjà vu")).toBe("cafe-deja-vu");
  });
});

describe("section ids in real content", () => {
  it("never gives two h2s in one post the same id", () => {
    for (const dir of ["content/posts", "content/lab"]) {
      for (const file of readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
        // Headings inside fenced examples are code, not sections.
        const prose = readFileSync(`${dir}/${file}`, "utf8").replace(/^```[\s\S]*?^```/gm, "");
        const ids = [...prose.matchAll(/^## (.+)$/gm)].map((m) => headingId(m[1]));
        expect(new Set(ids).size, `${file}: ${ids.join(", ")}`).toBe(ids.length);
      }
    }
  });
});

describe("sources footnotes in real content", () => {
  const posts = readdirSync("content/posts").filter((f) => f.endsWith(".mdx"));
  const prose = (file: string) => readFileSync(`content/posts/${file}`, "utf8").replace(/^```[\s\S]*?^```/gm, "");

  it("uses an ordered list only for Sources, because MdxOl styles every ol as a footnote", () => {
    for (const file of posts) {
      const body = prose(file).split("_Sources_")[0];
      expect(body.match(/^\d+\. /gm), file).toBeNull();
    }
  });

  it("numbers in-text markers 1..N in order, one per source", () => {
    for (const file of posts) {
      const text = prose(file);
      const refs = [...text.matchAll(/<sup id="ref-(\d+)"[^>]*>\[(\d+)\]\(#src-(\d+)\)<\/sup>/g)];
      const sources = (text.split("_Sources_")[1] ?? "").match(/^\d+\. /gm) ?? [];
      expect(refs.map((m) => [Number(m[1]), Number(m[2]), Number(m[3])]), file).toEqual(refs.map((_, i) => [i + 1, i + 1, i + 1]));
      expect(sources.length, file).toBe(refs.length);
    }
  });
});
