import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex flex-col items-center gap-10 md:flex-row md:justify-between md:gap-16">
      <div className="flex flex-col items-center text-center md:items-start md:text-left">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Mehmet Fahri Özmen
        </h1>
        <p className="mt-3 text-base tracking-wide text-neutral-500">
          Backend Systems Architect &middot; Engineering Leader
        </p>
        <p className="mt-8 max-w-md text-lg leading-relaxed text-neutral-400">
          I build the things you don&apos;t see &mdash; distributed
          systems, search engines, payment flows, and whatever lies
          beyond the horizon.
          <br />
          <span className="text-neutral-200">
            From hiring to shipping &mdash; I build the systems and the teams behind them.
          </span>
          <br />
          <span className="text-neutral-500">
            The galaxy below? That&apos;s my universe.
          </span>
        </p>
        <div className="mt-8 flex items-center gap-4">
          <a
            href="#systems"
            className="rounded-full border border-[#BA7517]/40 px-5 py-2 text-sm text-[#BA7517] transition-colors hover:border-[#BA7517]/70 hover:text-white"
          >
            Explore ↓
          </a>
          <Link
            href="/contact"
            className="rounded-full border border-[#BA7517]/40 px-5 py-2 text-sm text-[#BA7517] transition-colors hover:border-[#BA7517]/70 hover:text-white"
          >
            Get in touch →
          </Link>
        </div>
      </div>

      <div className="relative shrink-0">
        <div className="absolute -inset-3 rounded-full bg-gradient-to-b from-neutral-800/40 to-neutral-900/60 blur-xl" />
        <Image
          src="/fahri.jpg"
          alt="Mehmet Fahri Özmen"
          width={240}
          height={240}
          priority
          className="relative rounded-full ring-1 ring-neutral-800/50"
        />
      </div>
    </section>
  );
}
