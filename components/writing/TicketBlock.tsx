import type { ReactNode } from "react";

/**
 * An artifact lifted out of a ticket — acceptance criteria, test cases, a task list.
 * Distinct from CodeBlock (runnable code) and MdxBlockquote (a pause in the prose):
 * this is something a reader could paste into their own backlog.
 *
 * Usage in MDX — a plain markdown list as children:
 *   <TicketBlock label="Acceptance criteria">
 *   - The export covers the selected date range and nothing outside it.
 *   </TicketBlock>
 */
const listStyles = [
  "[&_ul]:list-none [&_ul]:space-y-2 [&_ul]:pl-0",
  "[&_li]:relative [&_li]:pl-5 [&_li]:text-[15px] [&_li]:leading-relaxed [&_li]:text-neutral-300",
  "[&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:text-[#BA7517]/50 [&_li]:before:content-['▸']",
  "[&_p]:m-0 [&_p]:text-[15px] [&_p]:leading-relaxed [&_p]:text-neutral-300",
].join(" ");

export default function TicketBlock({
  label,
  children,
}: Readonly<{ label: string; children?: ReactNode }>) {
  return (
    <figure className="my-8 rounded-lg border border-[#BA7517]/20 bg-[#BA7517]/[0.03] px-5 py-4 sm:px-6 sm:py-5">
      <figcaption className="mb-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[#BA7517]/80">
        {label}
      </figcaption>
      <div className={listStyles}>{children}</div>
    </figure>
  );
}
