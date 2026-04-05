import { remark } from "remark";
import html from "remark-html";
import type { ReactNode } from "react";
import { extractTextContent } from "@/lib/mdxUtils";
import MarkdownDemo from "./MarkdownDemo";

async function renderMarkdown(source: string): Promise<string> {
  const result = await remark().use(html).process(source);
  return result.toString();
}

export default async function MarkdownDemoServer({ children }: Readonly<{ children: ReactNode }>) {
  const rawText = extractTextContent(children);
  const renderedHtml = await renderMarkdown(rawText);
  return <MarkdownDemo renderedHtml={renderedHtml}>{children}</MarkdownDemo>;
}
