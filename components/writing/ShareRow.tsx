"use client";

import { useState } from "react";

const linkClass = "cursor-pointer font-mono text-[11px] text-neutral-500 transition-colors hover:text-[#BA7517]";

export default function ShareRow({ title, slug }: Readonly<{ title: string; slug: string }>) {
  const [copied, setCopied] = useState(false);

  const url = `https://mehmetfahriozmen.dev/writing/${slug}`;
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
      <button onClick={handleCopy} className={linkClass}>
        {copied ? "Copied!" : "Copy link"}
      </button>
      <span className="text-neutral-700">&middot;</span>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        LinkedIn
      </a>
      <span className="text-neutral-700">&middot;</span>
      <a
        href={`https://x.com/intent/tweet?url=${encoded}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        X
      </a>
    </>
  );
}
