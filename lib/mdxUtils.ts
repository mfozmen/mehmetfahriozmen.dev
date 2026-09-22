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
