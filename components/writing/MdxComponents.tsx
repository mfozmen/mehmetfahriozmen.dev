import type { ReactNode } from "react";
import { TrackedAnchor, TrackedNextLink } from "@/components/TrackedLink";

export function MdxBlockquote({ children }: Readonly<{ children?: ReactNode }>) {
  return (
    <blockquote
      className="my-10 space-y-4 rounded-r-lg border-l-2 border-[#BA7517]/40 py-5 pl-6 pr-6 text-xl leading-[1.6] italic text-neutral-200 sm:text-2xl"
      style={{ background: "linear-gradient(135deg, rgba(186,117,23,0.04) 0%, transparent 60%)" }}
    >
      {children}
    </blockquote>
  );
}

export function MdxTable({ children }: Readonly<{ children?: ReactNode }>) {
  return (
    <div className="my-8 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  );
}

export function MdxTh({ children }: Readonly<{ children?: ReactNode }>) {
  return <th className="border-b border-[#BA7517]/30 px-4 py-2 text-left font-mono text-xs uppercase tracking-wider text-[#BA7517]">{children}</th>;
}

export function MdxTd({ children }: Readonly<{ children?: ReactNode }>) {
  return <td className="border-b border-white/10 px-4 py-2 text-neutral-300">{children}</td>;
}

const linkClass = "border-b border-dashed border-[#BA7517]/40 text-[#BA7517] transition-colors hover:border-solid hover:border-[#BA7517] hover:text-[#BA7517]/80";

export function MdxLink({ href, children }: Readonly<{ href?: string; children?: ReactNode }>) {
  if (!href) return <span className={linkClass}>{children}</span>;
  const text = typeof children === "string" ? children : "link";
  if (href.startsWith("http")) {
    return (
      <TrackedAnchor href={href} eventName="outbound-link" eventData={{ href, text }} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {children}
      </TrackedAnchor>
    );
  }
  return (
    <TrackedNextLink href={href} eventName="internal-link" eventData={{ href, text }} className={linkClass}>
      {children}
    </TrackedNextLink>
  );
}
