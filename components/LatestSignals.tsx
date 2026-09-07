import Image from "next/image";
import { TrackedNextLink } from "@/components/TrackedLink";
import SectionTitle from "@/components/SectionTitle";
import { getAllPosts, formatDate, sortByDateDesc } from "@/lib/posts";
import { getAllLabPosts } from "@/lib/lab";

type SignalItem = {
  kind: "field-notes" | "lab-day";
  title: string;
  date: string;
  slug: string;
  description: string;
  readingTime: number;
  href: string;
  coverImage: string;
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

export function getLatestSignals(): SignalItem[] {
  const writing: SignalItem[] = getAllPosts().map((p) => ({
    kind: "field-notes",
    title: p.title,
    date: p.date,
    slug: p.slug,
    description: p.description,
    readingTime: p.readingTime,
    href: `/writing/${p.slug}`,
    coverImage: p.coverImage,
  }));

  const lab: SignalItem[] = getAllLabPosts().map((p) => ({
    kind: "lab-day",
    title: p.title.replace(/^Lab Day:\s*/i, ""),
    date: p.date,
    slug: p.slug,
    description: p.description,
    readingTime: p.readingTime,
    href: `/lab/${p.slug}`,
    coverImage: p.coverImage,
  }));

  return [...writing, ...lab]
    .sort(sortByDateDesc)
    .slice(0, 3);
}

function SignalText({ item }: Readonly<{ item: SignalItem }>) {
  const isLab = item.kind === "lab-day";
  return (
    <div className="min-w-0 flex-1">
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
        {item.description}
      </p>
    </div>
  );
}

const CARD_CLASS =
  "group relative overflow-hidden rounded-lg border border-[#BA7517]/[0.10] bg-[#BA7517]/[0.01] transition-colors hover:border-[#BA7517]/25 hover:bg-[#BA7517]/[0.03]";

function SignalCard({ item }: Readonly<{ item: SignalItem }>) {
  return (
    <TrackedNextLink
      href={item.href}
      eventName="latest-signal-click"
      eventData={{ title: item.title, kind: item.kind }}
      className={`${CARD_CLASS} block`}
    >
      <div className="relative hidden aspect-[3/2] w-full overflow-hidden lg:block">
        <Image
          src={item.coverImage}
          alt=""
          fill
          sizes="(max-width: 1023px) 0px, 400px"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div className="p-5">
        <SignalText item={item} />
      </div>
    </TrackedNextLink>
  );
}

export default function LatestSignals() {
  const items = getLatestSignals();
  if (items.length === 0) return null;

  return (
    <section className="mt-16">
      <SectionTitle title="Latest signals" />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <SignalCard key={item.href} item={item} />
        ))}
      </div>
    </section>
  );
}
