"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { extractTextContent } from "@/lib/mdxUtils";

const DEFAULT_MAX_HEIGHT = 400;

function CopyButton({ code }: Readonly<{ code: string }>) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 z-10 rounded border border-[#BA7517]/20 bg-[#0d0d0d]/80 px-2 py-1 font-mono text-[10px] text-[#BA7517] opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
      aria-label="Copy code"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function LanguageBadge({ lang }: Readonly<{ lang: string }>) {
  if (!lang || lang === "text") return null;
  return (
    <span className="absolute top-3 left-4 z-10 font-mono text-[10px] uppercase tracking-wider text-[#BA7517]/60">
      {lang}
    </span>
  );
}

export function CodePre({ children, ...props }: Readonly<Record<string, unknown> & { children?: ReactNode }>) {
  const lang = (props["data-language"] as string) ?? "";
  const hasLabel = lang !== "" && lang !== "text";
  const code = extractTextContent(children);

  return (
    <pre {...props} className={`group relative overflow-x-auto rounded-lg border border-[#BA7517]/10 p-5 text-[13px] leading-relaxed ${hasLabel ? "pt-10" : ""}`}>
      <LanguageBadge lang={lang} />
      <CopyButton code={code} />
      {children}
    </pre>
  );
}

export function CodeBlockFigure({ children, ...props }: Readonly<Record<string, unknown> & { children?: ReactNode }>) {
  const ref = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [needsCollapse, setNeedsCollapse] = useState(false);

  const expandable = props["data-expandable"] !== "false";
  const maxHeight = Number(props["data-max-height"]) || DEFAULT_MAX_HEIGHT;

  useEffect(() => {
    if (!expandable || !ref.current) return;
    const height = ref.current.scrollHeight;
    setNeedsCollapse(height > maxHeight);
  }, [expandable, maxHeight]);

  const showCollapse = expandable && needsCollapse && isCollapsed;

  return (
    <div className="my-8" ref={ref} style={showCollapse ? { maxHeight, overflow: "hidden", position: "relative" } : undefined}>
      <figure {...props}>
        {children}
      </figure>
      {showCollapse && (
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-center pb-4 pt-16" style={{ background: "linear-gradient(to top, #0d0d0d 20%, transparent)" }}>
          <button
            onClick={() => setIsCollapsed(false)}
            className="rounded border border-[#BA7517]/30 bg-[#0d0d0d] px-4 py-1.5 font-mono text-[11px] text-[#BA7517] transition-colors hover:border-[#BA7517]/60 hover:text-[#BA7517]/80"
          >
            Show more
          </button>
        </div>
      )}
      {expandable && needsCollapse && !isCollapsed && (
        <div className="mt-2 text-center">
          <button
            onClick={() => setIsCollapsed(true)}
            className="font-mono text-[11px] text-neutral-500 transition-colors hover:text-[#BA7517]"
          >
            Show less
          </button>
        </div>
      )}
    </div>
  );
}

export function InlineCode({ children, ...props }: Readonly<Record<string, unknown> & { children?: ReactNode }>) {
  const hasTheme = "data-theme" in props;
  if (hasTheme) {
    return <code {...props} className="rounded border border-[#BA7517]/10 bg-[#BA7517]/[0.04] px-1.5 py-0.5 text-[13px]">{children}</code>;
  }
  return (
    <code className="rounded border border-[#BA7517]/10 bg-[#BA7517]/[0.04] px-1.5 py-0.5 font-mono text-[13px] text-[#BA7517]/80">
      {children}
    </code>
  );
}
