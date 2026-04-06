import { projects, type Project } from "@/data/projects";
import { domains } from "@/data/domains";
import SectionTitle from "@/components/SectionTitle";
import { TrackedAnchor, TrackedNextLink } from "@/components/TrackedLink";

const domainNames = new Map(domains.map((d) => [d.id, d.name]));
const primarySystems = projects.filter((p) => p.importance === "primary");

function SystemCard({ system }: Readonly<{ system: Project }>) {
  return (
    <TrackedAnchor
      href={system.url ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      eventName="featured-system-click"
      eventData={{ system: system.name }}
      className="group relative rounded-lg border border-[#BA7517]/[0.10] bg-[#BA7517]/[0.01] p-5 transition-colors hover:border-[#BA7517]/25 hover:bg-[#BA7517]/[0.03]"
    >
      <h3 className="text-[15px] font-semibold text-white transition-colors group-hover:text-[#BA7517]">
        {system.name}
      </h3>
      {system.description && (
        <p className="mt-1.5 text-[12px] leading-relaxed text-[#a3a3a3]">
          {system.description}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {system.domains.map((domId) => (
          <span
            key={domId}
            className="rounded-full border border-[#BA7517]/[0.12] bg-[#BA7517]/[0.03] px-2 py-0.5 font-mono text-[10px] text-neutral-500"
          >
            {domainNames.get(domId) ?? domId}
          </span>
        ))}
      </div>
      {system.highlights && system.highlights.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {system.highlights.map((h) => (
            <li key={h} className="flex gap-2 text-[12px] leading-[1.6] text-[#a3a3a3]">
              <span className="shrink-0 text-[#BA7517]/40">▸</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      )}
    </TrackedAnchor>
  );
}

export function DeepSpaceFooter() {
  return (
    <div className="mt-12">
      <div
        className="mb-8 h-px"
        style={{ background: "linear-gradient(90deg, transparent 5%, rgba(186,117,23,0.35) 50%, transparent 95%)" }}
      />
      <p className="text-center font-mono text-[11px] tracking-normal text-[#525252] sm:tracking-[0.12em]">
        <span className="hidden text-[#404040] sm:inline">· · ·</span>
        {" "}
        <span className="hidden animate-[pulse-signal_4s_ease-in-out_infinite] text-[#404040] sm:inline">──</span>
        {" "}there&apos;s more beyond the visible spectrum{" "}
        <span className="hidden animate-[pulse-signal_4s_ease-in-out_infinite] text-[#404040] sm:inline">──</span>
        {" "}
        <span className="hidden text-[#404040] sm:inline">· · ·</span>
      </p>
      <p className="mt-3 text-center">
        <TrackedNextLink
          href="/about"
          eventName="cta-click"
          eventData={{ cta: "follow the light", page: "/" }}
          className="group relative inline-block font-mono text-[12px] tracking-[0.12em] text-[#BA7517]/50 transition-colors hover:text-[#BA7517]/80"
        >
          <span className="absolute inset-0 -m-4 rounded-full opacity-0 transition-opacity group-hover:opacity-100" style={{ background: "radial-gradient(circle, rgba(186,117,23,0.06) 0%, transparent 70%)" }} />
          <span className="relative">follow the light →</span>
        </TrackedNextLink>
      </p>
    </div>
  );
}

export default function FeaturedSystems() {
  return (
    <section id="systems" className="mt-10">
      <SectionTitle title="What I've built" />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {primarySystems.map((system) => (
          <SystemCard key={system.id} system={system} />
        ))}
      </div>
    </section>
  );
}
