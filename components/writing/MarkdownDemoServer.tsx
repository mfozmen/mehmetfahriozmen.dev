import { remark } from "remark";
import html from "remark-html";
import type { ReactNode } from "react";
import MarkdownDemo from "./MarkdownDemo";

function extractTextContent(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node) return "";
  if (Array.isArray(node)) return node.map(extractTextContent).join("");
  if (typeof node === "object" && "props" in node) {
    return extractTextContent((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

async function renderMarkdown(source: string): Promise<string> {
  const result = await remark().use(html).process(source);
  return result.toString();
}

export default async function MarkdownDemoServer({ children }: Readonly<{ children: ReactNode }>) {
  const rawText = extractTextContent(children);
  const renderedHtml = await renderMarkdown(rawText);
  return <MarkdownDemo renderedHtml={renderedHtml}>{children}</MarkdownDemo>;
}
