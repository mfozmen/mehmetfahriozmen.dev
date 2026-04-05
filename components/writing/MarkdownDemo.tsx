"use client";

import { useState, type ReactNode } from "react";

function RenderedMarkdown({ html }: Readonly<{ html: string }>) {
  return (
    <div
      className="rounded-lg border border-[#BA7517]/10 bg-[#0d0d0d] p-5 text-[13px] leading-relaxed text-neutral-300 [&_h1]:mb-4 [&_h1]:text-lg [&_h1]:font-bold [&_h1]:text-white [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-white [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-white [&_li]:ml-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:mb-3 [&_strong]:font-semibold [&_strong]:text-white [&_ul]:list-disc [&_ul]:pl-4"
      dangerouslySetInnerHTML={{ __html: html }} // NOSONAR — pre-rendered markdown, no user input
    />
  );
}

export default function MarkdownDemo({ children, renderedHtml }: Readonly<{ children: ReactNode; renderedHtml: string }>) {
  const [view, setView] = useState<"source" | "rendered">("source");

  return (
    <div className="my-8">
      <div className="flex gap-1 rounded-t-lg border border-b-0 border-[#BA7517]/10 bg-[#0d0d0d] px-3 pt-2">
        <button
          onClick={() => setView("source")}
          className={`rounded-t px-3 py-1.5 font-mono text-[11px] transition-colors ${view === "source" ? "bg-[#BA7517]/10 text-[#BA7517]" : "text-neutral-500 hover:text-neutral-300"}`}
        >
          Source
        </button>
        <button
          onClick={() => setView("rendered")}
          className={`rounded-t px-3 py-1.5 font-mono text-[11px] transition-colors ${view === "rendered" ? "bg-[#BA7517]/10 text-[#BA7517]" : "text-neutral-500 hover:text-neutral-300"}`}
        >
          Rendered
        </button>
      </div>
      <div className={view === "source" ? "block [&>div]:!mt-0 [&_pre]:!rounded-t-none [&_pre]:!border-t-0" : "hidden"}>
        {children}
      </div>
      <div className={view === "rendered" ? "block" : "hidden"}>
        <RenderedMarkdown html={renderedHtml} />
      </div>
    </div>
  );
}
