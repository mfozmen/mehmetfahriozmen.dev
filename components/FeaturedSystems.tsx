import { projects } from "@/data/projects";
import { domains } from "@/data/domains";
import SectionTitle from "@/components/SectionTitle";

const domainNames = new Map(domains.map((d) => [d.id, d.name]));
const primarySystems = projects.filter((p) => p.importance === "primary");

export default function FeaturedSystems() {
  return (
    <section id="systems" className="mt-16">
      <SectionTitle title="What I've built" />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {primarySystems.map((system) => (
          <div
            key={system.id}
            className="rounded-xl border border-[#BA7517]/[0.10] bg-[#BA7517]/[0.02] p-5"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-base font-medium text-white">
                {system.name}
              </h3>
              {system.url && (
                <a
                  href={system.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-xs text-neutral-600 transition-colors hover:text-neutral-400"
                >
                  ↗
                </a>
              )}
            </div>
            {system.description && (
              <p className="mt-1 text-sm text-neutral-500">
                {system.description}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {system.domains.map((domId) => (
                <span
                  key={domId}
                  className="rounded-full border border-[#BA7517]/[0.12] bg-[#BA7517]/[0.03] px-2.5 py-0.5 text-xs text-neutral-500"
                >
                  {domainNames.get(domId) ?? domId}
                </span>
              ))}
            </div>
            {system.highlights && system.highlights.length > 0 && (
              <ul className="mt-3 space-y-1">
                {system.highlights.map((h) => (
                  <li key={h} className="text-xs leading-relaxed text-neutral-500">
                    <span className="text-[#BA7517]/40">▸</span> {h}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
