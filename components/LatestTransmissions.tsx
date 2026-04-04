import { TrackedNextLink } from "@/components/TrackedLink";
import SectionTitle from "@/components/SectionTitle";
import { getAllPosts, formatDate, type PostMeta } from "@/lib/posts";
import { getAllLabPosts, type LabPostMeta } from "@/lib/lab";

type TransmissionItem = {
  kind: "field-notes" | "lab-day";
  title: string;
  date: string;
  slug: string;
  excerpt: string;
  readingTime: number;
  href: string;
};

function StarIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="#BA7517" className="shrink-0" aria-hidden="true">
      <path d="M12 2l2.09 6.26L20.18 9l-5.09 3.74L16.18 19 12 15.77 7.82 19l1.09-6.26L3.82 9l6.09-.74z" />
    </svg>
  );
}

function TerminalIcon() {
  return (
    <span className="shrink-0 font-mono text-[9px] text-[#BA7517]" aria-hidden="true">
      &gt;_
    </span>
  );
}

export function getLatestTransmissions(): TransmissionItem[] {
  const writing: TransmissionItem[] = getAllPosts().map((p) => ({
    kind: "field-notes",
    title: p.title,
    date: p.date,
    slug: p.slug,
    excerpt: p.excerpt,
    readingTime: p.readingTime,
    href: `/writing/${p.slug}`,
  }));

  const lab: TransmissionItem[] = getAllLabPosts().map((p) => ({
    kind: "lab-day",
    title: p.title.replace(/^Lab Day:\s*/i, ""),
    date: p.date,
    slug: p.slug,
    excerpt: p.description,
    readingTime: p.readingTime,
    href: `/lab/${p.slug}`,
  }));

  return [...writing, ...lab]
    .sort((a, b) => (a.date === b.date ? 0 : a.date > b.date ? -1 : 1))
    .slice(0, 3);
}

function TransmissionCard({ item }: Readonly<{ item: TransmissionItem }>) {
  const isLab = item.kind === "lab-day";
  return (
    <TrackedNextLink
      href={item.href}
      eventName="latest-transmission-click"
      eventData={{ title: item.title, kind: item.kind }}
      className="group relative rounded-lg border border-[#BA7517]/[0.10] bg-[#BA7517]/[0.01] p-5 transition-colors hover:border-[#BA7517]/25 hover:bg-[#BA7517]/[0.03]"
    >
      <div className="flex items-center gap-1.5">
        {isLab ? <TerminalIcon /> : <StarIcon />}
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-500">
          {isLab ? "Lab Day" : "Field Notes"}
        </span>
        <span className="text-neutral-700">&middot;</span>
        <span className="font-mono text-[10px] text-neutral-500">
          {formatDate(item.date)}
        </span>
        <span className="text-neutral-700">&middot;</span>
        <span className="font-mono text-[10px] text-neutral-500">
          {item.readingTime} min
        </span>
      </div>
      <h3 className="mt-2 text-[15px] font-semibold text-white transition-colors group-hover:text-[#BA7517]">
        {item.title}
      </h3>
      <p className="mt-1.5 text-[12px] leading-relaxed text-[#a3a3a3]">
        {item.excerpt}
      </p>
    </TrackedNextLink>
  );
}

export default function LatestTransmissions() {
  const items = getLatestTransmissions();
  if (items.length === 0) return null;

  return (
    <section className="mt-16">
      <SectionTitle title="Latest transmissions" />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <TransmissionCard key={item.href} item={item} />
        ))}
      </div>
    </section>
  );
}
