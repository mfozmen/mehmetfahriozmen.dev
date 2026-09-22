import type { ReactNode } from "react";

export function extractTextContent(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node) return "";
  if (Array.isArray(node)) return node.map(extractTextContent).join("");
  if (typeof node === "object" && "props" in node) {
    return extractTextContent((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

// "#src-3" → 3; anything else (back-links, section anchors) → null.
export function footnoteIndex(href: string): number | null {
  const m = /^#src-(\d+)$/.exec(href);
  return m ? Number(m[1]) : null;
}

// A Sources item reads "N. Title — note". Keep only the note.
export function splitFootnote(text: string, title: string): string {
  const after = text.slice(text.indexOf(title) + title.length);
  return after.replace(/^\s*—\s*/, "").trim();
}

// "Abundant, scarce" → "abundant-scarce". Stable, so a link to a section keeps working.
// ponytail: two identical headings in one post would share an id; add a counter if that ever happens.
export function headingId(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-");
}
