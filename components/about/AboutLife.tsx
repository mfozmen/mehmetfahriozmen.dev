import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import PhotoCaption from "./PhotoCaption";

export default function AboutLife() {
  return (
    <section>
      <SectionTitle title="When I'm not coding" />

      <p className="mb-8 text-neutral-400">
        I love spending time with my family, traveling to new places, and
        discovering things together. There&apos;s a whole world out there full
        of incredible places, and experiencing them with the people you love is
        what it&apos;s really all about.
      </p>

      {/* Landscape travel photo */}
      <div className="mx-auto mb-6 max-w-3xl">
        <PhotoCaption
          src="/about/travel-landscape.webp"
          alt="Travel"
          width={800}
          height={600}
          caption="New places, new perspectives"
          imgClassName="w-full"
        />
      </div>

      {/* Three portrait photos */}
      <div className="mx-auto mb-12 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">
        <PhotoCaption
          src="/about/family-adventure.webp"
          alt="Family adventure"
          width={600}
          height={800}
          caption="Sümela Monastery — a mindblowing place"
          imgClassName="w-full"
        />
        <PhotoCaption
          src="/about/travel-alone.webp"
          alt="Solo travel"
          width={600}
          height={800}
          caption="Curiosity doesn't stop at code"
          imgClassName="w-full"
        />
        <PhotoCaption
          src="/about/family-travel.webp"
          alt="Family travel"
          width={600}
          height={800}
          caption="On the road to ancient times"
          imgClassName="w-full"
        />
      </div>

      {/* Fishing */}
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center">
        <PhotoCaption
          src="/about/fishing.webp"
          alt="Fishing"
          width={280}
          height={280}
          caption="Not always feeding them, but sometimes I catch the unlucky ones"
          className="w-full md:w-[280px] shrink-0"
        />
        <p className="flex-1 text-neutral-400">
          I also fish &mdash; it&apos;s one of the best ways I know to slow
          down and recharge. There&apos;s something meditative about being out
          on the water, waiting for a bite. No screens, no notifications, no
          deployments. Just patience, fresh air, and the occasional lucky
          catch.
        </p>
      </div>

      {/* Cat */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <p className="flex-1 text-neutral-400">
          Every home office needs a good architect. Mine comes with fur, zero
          respect for personal space, and a habit of attending every video call
          uninvited. Honestly, the best coworker I&apos;ve ever had.
        </p>
        <PhotoCaption
          src="/about/cat.webp"
          alt="Home office supervisor"
          width={280}
          height={373}
          caption="Home office supervisor"
          className="w-full md:w-[280px] shrink-0"
        />
      </div>

      {/* CTAs */}
      <p className="mt-16 text-center text-[13px] text-neutral-500">
        <Link href="/cv" className="group relative inline-block border-b border-dashed border-[#BA7517]/40 text-[#BA7517] transition-colors hover:text-[#BA7517]/80">
          <span className="absolute inset-0 -m-4 rounded-full opacity-0 transition-opacity group-hover:opacity-100" style={{ background: "radial-gradient(circle, rgba(186,117,23,0.06) 0%, transparent 70%)" }} />
          <span className="relative">Curious about my work? →</span>
        </Link>
        <span className="mx-3">·</span>
        <Link href="/contact" className="group relative inline-block border-b border-dashed border-[#BA7517]/40 text-[#BA7517] transition-colors hover:text-[#BA7517]/80">
          <span className="absolute inset-0 -m-4 rounded-full opacity-0 transition-opacity group-hover:opacity-100" style={{ background: "radial-gradient(circle, rgba(186,117,23,0.06) 0%, transparent 70%)" }} />
          <span className="relative">Want to get in touch? →</span>
        </Link>
      </p>
    </section>
  );
}
