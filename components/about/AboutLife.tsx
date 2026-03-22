import PhotoCaption from "./PhotoCaption";

export default function AboutLife() {
  return (
    <section>
      <h2 className="mb-10 text-2xl font-semibold text-neutral-200">
        When I&apos;m not coding
      </h2>

      <p className="mb-10 text-neutral-400">
        I love spending time with my family, traveling to new places, and
        discovering things together. There&apos;s a whole world out there full
        of incredible places, and experiencing them with the people you love is
        what it&apos;s really all about.
      </p>

      {/* Travel photos */}
      <div className="mx-auto mb-12 max-w-lg space-y-3">
        <PhotoCaption
          src="/about/travel-landscape.webp"
          alt="Travel landscape"
          width={512}
          height={290}
          imgClassName="w-full"
        />
        <div className="grid grid-cols-2 gap-3">
          <PhotoCaption
            src="/about/family-travel.webp"
            alt="Family travel"
            width={250}
            height={200}
            imgClassName="w-full"
          />
          <PhotoCaption
            src="/about/family-adventure.webp"
            alt="Family adventure"
            width={250}
            height={200}
            imgClassName="w-full"
          />
        </div>
      </div>

      {/* Fishing */}
      <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-center">
        <PhotoCaption
          src="/about/fishing.webp"
          alt="Fishing"
          width={240}
          height={320}
          caption="Not always feeding them, but sometimes I catch the unlucky ones"
          className="shrink-0"
        />
        <p className="flex-1 text-neutral-400">
          I also fish &mdash; not always successfully, to be honest. I
          wouldn&apos;t call myself a great angler, but I do manage to catch
          some. More importantly, there&apos;s nothing quite like it for
          clearing your head. Just you, the water, and absolutely no pull
          requests.
        </p>
      </div>

      {/* Cat */}
      <div className="flex flex-col gap-8 md:flex-row md:items-center">
        <p className="flex-1 text-neutral-400">
          Every home office needs a good architect. Mine comes with fur, zero
          respect for personal space, and a habit of attending every video call
          uninvited. Honestly, the best coworker I&apos;ve ever had.
        </p>
        <PhotoCaption
          src="/about/cat.webp"
          alt="Home office supervisor"
          width={200}
          height={280}
          caption="Home office supervisor"
          className="shrink-0"
        />
      </div>
    </section>
  );
}
