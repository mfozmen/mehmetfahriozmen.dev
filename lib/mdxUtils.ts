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
