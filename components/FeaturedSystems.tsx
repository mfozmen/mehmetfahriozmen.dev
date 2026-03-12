interface FeaturedSystem {
  title: string;
  subtitle: string;
  bullets: string[];
}

const systems: FeaturedSystem[] = [
  {
    title: "Mobilet",
    subtitle: "Ticketing Platform",
    bullets: [
      "Scalable infrastructure",
      "Payment flows",
      "Large-scale ticketing operations",
    ],
  },
  {
    title: "VillaSepeti",
    subtitle: "Travel & Booking Engine",
    bullets: [
      "E-commerce engine",
      "Holiday villa inventory",
      "High volume booking backend",
    ],
  },
  {
    title: "MagicPags",
    subtitle: "Educational mobile platform for kids",
    bullets: [
      "Interactive games",
      "Audio story platform",
      "Backend infrastructure",
    ],
  },
];

export default function FeaturedSystems() {
  return (
    <section id="systems">
      <h2 className="text-2xl font-semibold text-white">Featured Systems</h2>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {systems.map((system) => (
          <div
            key={system.title}
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
