const leftColumn = [
  "Commerce platforms",
  "Ticketing systems",
  "Marketplaces",
];

const rightColumn = [
  "Distributed & scalable backends",
  "Microservices architectures",
  "Search platforms",
  "Open source tools",
];

export default function Domains() {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-white">
        Domains I&apos;ve worked in
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <ul className="space-y-3">
          {leftColumn.map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 text-neutral-400"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-600" />
              {item}
            </li>
          ))}
        </ul>
        <ul className="space-y-3">
          {rightColumn.map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 text-neutral-400"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-600" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
