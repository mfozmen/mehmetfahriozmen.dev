import PhotoCaption from "./PhotoCaption";

export default function AboutWork() {
  return (
    <section className="mb-20">
      <h2 className="mb-10 text-2xl font-semibold text-neutral-200">
        What I do
      </h2>

      {/* At work */}
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center">
        <PhotoCaption
          src="/about/at-work.webp"
          alt="At work"
          width={280}
          height={359}
          caption="Another day, another deploy"
          className="w-[280px] shrink-0"
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
          <p>
            But systems are only half the story. I also build the teams that
            build them &mdash; hiring, mentoring, planning, and shipping
            together.
          </p>
        </div>
      </div>

      {/* Quote */}
      <blockquote className="mb-12 space-y-4 border-l-2 border-neutral-700 pl-6">
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

      {/* Team & speaking photos */}
      <div className="mx-auto max-w-3xl">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <PhotoCaption
            src="/about/brew-team.webp"
            alt="Brew Interactive team"
            width={400}
            height={267}
            caption="Brew Interactive — one of my favorite places to work"
            imgClassName="w-full"
          />
          <PhotoCaption
            src="/about/devfest.webp"
            alt="Speaking at DevFest"
            width={400}
            height={267}
            caption="Speaking at Google DevFest 2022 — GDG İzmir"
            imgClassName="w-full"
          />
        </div>
      </div>
    </section>
  );
}
