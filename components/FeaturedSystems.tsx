import { featuredSystems } from "@/data/featuredSystems";

export default function FeaturedSystems() {
  return (
    <section id="systems">
      <h2 className="text-2xl font-semibold text-white">Featured Systems</h2>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {featuredSystems.map((system) => (
          <div
            key={system.id}
            className="rounded-xl border border-neutral-800 bg-neutral-900 p-6"
          >
            <h3 className="text-lg font-semibold text-white">
              {system.title}
            </h3>
            <p className="mt-1 text-sm text-neutral-400">{system.subtitle}</p>
            <ul className="mt-4 space-y-2">
              {system.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-2 text-sm text-neutral-400"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neutral-600" />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
