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
