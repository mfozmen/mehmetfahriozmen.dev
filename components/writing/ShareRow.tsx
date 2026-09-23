"use client";

import { useState } from "react";
import { TrackedAnchor } from "@/components/TrackedLink";

const linkClass = "cursor-pointer font-mono text-[11px] text-neutral-500 transition-colors hover:text-[#BA7517]";

export default function ShareRow({ title, slug, basePath = "writing" }: Readonly<{ title: string; slug: string; basePath?: string }>) {
  const [copied, setCopied] = useState(false);

  const url = `https://mehmetfahriozmen.dev/${basePath}/${slug}`;
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable — no false feedback */ }
  }

  return (
    <>
      <button type="button" onClick={handleCopy} className={linkClass}>
        {copied ? "Copied!" : "Copy link"}
      </button>
      <span className="text-neutral-700">&middot;</span>
      <TrackedAnchor
        eventName="share-click"
        eventData={{ platform: "linkedin", slug }}
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        LinkedIn
      </TrackedAnchor>
      <span className="text-neutral-700">&middot;</span>
      <TrackedAnchor
        eventName="share-click"
        eventData={{ platform: "x", slug }}
        href={`https://x.com/intent/tweet?url=${encoded}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        X
      </TrackedAnchor>
    </>
  );
}
