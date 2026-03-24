import SectionTitle from "@/components/SectionTitle";
import PhotoCaption from "./PhotoCaption";

export default function AboutOrigins() {
  return (
    <section className="mb-20">
      <SectionTitle title="Where it started" />

      {/* Childhood */}
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center">
        <div className="flex-1 space-y-4 text-neutral-400">
          <p>
            I was about four years old when my dad brought home a Commodore 64.
            At home, I&apos;d spend hours typing things on the screen, mesmerized
            by the idea that I could make a machine do something. At my
            dad&apos;s office, I&apos;d play games on the PCs whenever I got the
            chance. I think that&apos;s where it all began &mdash; not with a
            specific moment, but with a growing obsession that never really went
            away.
          </p>
          <p>
            Later, I got a Windows 95 machine. No internet &mdash; just the OS,
            a stack of books, and endless curiosity. The books I could find were
            mostly about Windows, MS-DOS, and Office programs &mdash; I wish
            there had been a programming book among them, that would have given
            me a serious head start. But I made do with what I had. I explored
            every corner of Windows, figured out what every setting did, and MS
            Paint became my graphic design studio.
          </p>
        </div>
        <PhotoCaption
          src="/about/childhood.webp"
          alt="Early school years"
          width={280}
          height={375}
          caption="Early school years — around the time it all began"
          className="w-[280px] shrink-0"
        />
      </div>

      {/* PowerPoint story */}
      <p className="mb-12 text-neutral-400">
        I remember discovering PowerPoint and starting to build slides with
        buttons, animations, and links between pages &mdash; basically
        interactive experiences. I had no idea at the time, but I was building
        websites before I even knew what a website was. Single-visitor traffic,
        sure &mdash; but sometimes I&apos;d copy them onto floppy disks and
        trade them with a friend, so maybe I had a small user base after all.
      </p>

      {/* Graduation */}
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center">
        <PhotoCaption
          src="/about/graduation.webp"
          alt="Graduation day"
          width={280}
          height={210}
          caption="Graduation day with my little brother, Yaşar University — 2011"
          className="w-[280px] shrink-0"
        />
        <div className="flex-1 space-y-4 text-neutral-400">
          <p>
            I studied Computer Engineering at Yaşar University in İzmir &mdash;
            the field I&apos;d been dreaming about since those Commodore 64
            days. Getting to study what I was already passionate about felt like
            everything was falling into place.
          </p>
        </div>
      </div>

      {/* Early career */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="flex-1 space-y-4 text-neutral-400">
          <p>
            Those early days in the industry were something special. Walking
            into your first office, writing your first real production code,
            seeing something you built actually being used &mdash; there&apos;s
            nothing quite like it.
          </p>
          <p>
            And now, with the AI revolution unfolding, that same excitement is
            back. It feels like being a beginner again &mdash; in the best
            possible way.
          </p>
        </div>
        <PhotoCaption
          src="/about/early-career.webp"
          alt="One of my first offices"
          width={280}
          height={373}
          caption="One of my first offices — 2012"
          className="w-[280px] shrink-0"
        />
      </div>
    </section>
  );
}
