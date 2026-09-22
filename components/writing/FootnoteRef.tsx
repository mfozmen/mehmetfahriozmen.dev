"use client";

import { useState, type ReactNode } from "react";
import { TrackedAnchor } from "@/components/TrackedLink";
import { splitFootnote } from "@/lib/mdxUtils";

type Source = { title: string; url: string; note: string };

// Reads the source from the #src-N item already on the page, so the list stays the only copy.
function readSource(n: number): Source | null {
  const li = document.getElementById(`src-${n}`);
  const a = li?.querySelector<HTMLAnchorElement>('a[href^="http"]');
  if (!li || !a) return null;
  const title = a.textContent ?? "";
  return { title, url: a.href, note: splitFootnote(li.textContent ?? "", title) };
}

export function FootnoteRef({ n, href, children }: Readonly<{ n: number; href: string; children?: ReactNode }>) {
  const [source, setSource] = useState<Source | null>(null);
  const open = () => setSource(readSource(n));
  const close = () => setSource(null);

  return (
    <span className="relative" onMouseEnter={open} onMouseLeave={close} onFocus={open} onBlur={close}>
      <TrackedAnchor href={href} eventName="footnote-jump" eventData={{ href, text: String(n) }} className="text-[#BA7517] no-underline hover:text-[#BA7517]/80">
        {children}
      </TrackedAnchor>
      {source && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 z-20 hidden w-72 -translate-x-1/2 pb-2 text-left align-baseline text-[13px] font-normal leading-snug [@media(hover:hover)]:block"
        >
          <span className="block rounded-lg border border-[#BA7517]/20 bg-[#0d0d0d] px-4 py-3 shadow-md shadow-black/60">
            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.15em] text-[#BA7517]/60">Source {n}</span>
            <TrackedAnchor href={source.url} eventName="outbound-link" eventData={{ href: source.url, text: source.title, via: "footnote-tooltip" }} target="_blank" rel="noopener noreferrer" className="border-b border-dashed border-[#BA7517]/40 text-neutral-200 transition-colors hover:border-solid hover:border-[#BA7517] hover:text-[#BA7517]">
              {source.title}
            </TrackedAnchor>
            {source.note && <span className="mt-1.5 block text-[12px] text-neutral-400">{source.note}</span>}
          </span>
        </span>
      )}
    </span>
  );
}
