import { TrackedNextLink } from "@/components/TrackedLink";

export default function BackLink({ href, label }: Readonly<{ href: string; label: string }>) {
  return (
    <TrackedNextLink
      href={href}
      eventName="back-nav"
      eventData={{ href, label }}
      className="group relative inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-neutral-500 transition-colors hover:text-[#BA7517]"
    >
      <span className="transition-transform group-hover:-translate-x-0.5">&larr;</span>
      <span>{label}</span>
    </TrackedNextLink>
  );
}
