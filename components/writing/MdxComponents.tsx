import type { ReactNode } from "react";

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

export function MdxLink({ href, children }: Readonly<{ href?: string; children?: ReactNode }>) {
  return (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className="border-b border-dashed border-[#BA7517]/40 text-[#BA7517] transition-colors hover:border-solid hover:border-[#BA7517] hover:text-[#BA7517]/80"
    >
      {children}
    </a>
  );
}
