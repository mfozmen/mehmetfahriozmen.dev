import PhotoCaption from "./PhotoCaption";

export default function AboutLife() {
  return (
    <section>
      <h2 className="mb-10 text-2xl font-semibold text-neutral-200">
        When I&apos;m not coding
      </h2>

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
          caption="Exploring new places with family"
          imgClassName="w-full"
        />
      </div>

      {/* Three portrait photos */}
      <div className="mx-auto mb-12 grid max-w-3xl grid-cols-3 gap-3">
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
          caption="Solo wandering"
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
          className="w-[280px] shrink-0"
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
          className="w-[280px] shrink-0"
        />
      </div>
    </section>
  );
}
