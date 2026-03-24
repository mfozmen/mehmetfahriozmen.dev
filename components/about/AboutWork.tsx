import SectionTitle from "@/components/SectionTitle";
import PhotoCaption from "./PhotoCaption";

export default function AboutWork() {
  return (
    <section className="mb-20">
      <SectionTitle title="What I do" />

      {/* At work */}
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center">
        <PhotoCaption
          src="/about/at-work.webp"
          alt="At work"
          width={280}
          height={359}
          caption="Another day, another deploy"
          className="w-full md:w-[280px] shrink-0"
        />
        <div className="flex-1 space-y-4 text-neutral-400">
          <p>
            Over the years, I&apos;ve worked across e-commerce, ad-tech,
            edtech, and productivity &mdash; architecting backend systems from
            scratch, scaling existing ones, and cleaning up what others left
            behind.
          </p>
          <p>
            I care about building things that last: clean architecture, reliable
            infrastructure, and codebases that the next person or even us can
            actually understand.
          </p>
        </div>
      </div>

      {/* Speaking — zigzag: text left, photo right */}
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center">
        <div className="flex-1 space-y-4 text-neutral-400">
          <p>
            But systems are only half the story. I also build the teams that
            build them &mdash; hiring, mentoring, planning, and shipping
            together. I believe in sharing what you learn openly &mdash; whether
            through mentoring, code reviews, contributing to open source, or
            speaking at events. We&apos;re living through an AI revolution, and
            it&apos;s fueled by publicly shared knowledge &mdash; open research,
            open source code, open datasets. The engineers who share what they
            know aren&apos;t just growing themselves; they&apos;re shaping the
            future we&apos;ll all build with.
          </p>
        </div>
        <PhotoCaption
          src="/about/devfest.webp"
          alt="Speaking at DevFest"
          width={280}
          height={187}
          caption="Speaking at Google DevFest 2022 — GDG İzmir"
          className="w-full md:w-[280px] shrink-0"
        />
      </div>

      {/* Quote */}
      <blockquote className="mb-12 space-y-4 rounded-r-lg border-l-2 border-[#BA7517]/40 pl-6 pr-6 py-5" style={{ background: "linear-gradient(135deg, rgba(186,117,23,0.04) 0%, transparent 60%)" }}>
        <p className="text-neutral-300">
          I&apos;ve always believed the best way to grow is to share what you
          know. Whether it&apos;s mentoring someone on the team, leading a code
          review, or stepping on a stage &mdash; teaching forces you to truly
          understand what you&apos;re talking about.
        </p>
        <p className="text-neutral-300">
          At some point in my career, I realized that software isn&apos;t really
          built with tools, frameworks, or languages &mdash; it&apos;s built
          with people. Understanding developer psychology, knowing when someone
          is stuck, when they need space, when they need a push &mdash; that
          matters just as much as knowing the right architecture pattern.
          That&apos;s why I care about sharing knowledge and creating
          environments where people can do their best work.
        </p>
      </blockquote>

      {/* Brew team — full width */}
      <PhotoCaption
        src="/about/brew-team.webp"
        alt="Brew Interactive team"
        width={900}
        height={600}
        caption="Brew Interactive — one of my favorite places to work"
        imgClassName="w-full max-h-[400px] object-cover"
      />
    </section>
  );
}
