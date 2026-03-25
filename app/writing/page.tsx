import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import NebulaGlows from "@/components/NebulaGlows";

export const metadata: Metadata = {
  title: "Writing — Mehmet Fahri Özmen",
  description:
    "Thoughts on engineering leadership, architecture, and the human side of building software.",
};

export default function WritingPage() {
  return (
    <>
      <a href="#main" className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-2 focus-visible:left-1/2 focus-visible:-translate-x-1/2 focus-visible:z-[100] focus-visible:px-4 focus-visible:py-2 focus-visible:bg-neutral-900 focus-visible:text-white focus-visible:rounded focus-visible:text-sm">
        Skip to content
      </a>
      <Navigation />
      <Starfield />
      <NebulaGlows />

      <main id="main" className="relative z-10 mx-auto max-w-3xl px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <article>
          <header className="mb-12">
            <time className="text-sm text-neutral-500">March 25, 2026</time>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              The Hardest Refactor: From Engineer to Manager
            </h1>
          </header>

          <div className="prose-custom space-y-6 text-[15px] leading-relaxed text-neutral-300">
            <p>The codebase was clean. The architecture was solid. The tests were green.</p>
            <p>Then I became a manager — and none of that mattered anymore.</p>

            <h2 className="mt-10 mb-4 text-xl font-semibold text-white">What nobody tells you upfront</h2>
            <p>The transition from engineer to manager isn&apos;t a promotion. It&apos;s a career change disguised as one.</p>
            <p>Your entire value system has to shift. As an engineer, you&apos;re measured by what you ship. As a manager, you&apos;re measured by what your team ships — and those are completely different games.</p>
            <p>I learned this the hard way. My first instinct was to keep doing both: stay hands-on and manage the team. And honestly? Staying hands-on is still something I believe in. A manager who doesn&apos;t understand the code can&apos;t make good decisions about the code. But there&apos;s a version of &quot;hands-on&quot; that&apos;s actually just control — and I had to learn the difference.</p>

            <h2 className="mt-10 mb-4 text-xl font-semibold text-white">The perfectionism trap</h2>
            <p>My biggest breakthrough wasn&apos;t learning how to run a sprint or give performance reviews. It was unlearning perfectionism.</p>
            <p>As an engineer, perfectionism is almost a virtue. You care about the details. You push back on shortcuts. You refactor because it bothers you.</p>
            <p>As a manager, perfectionism becomes a bottleneck — and worse, it spreads. I&apos;ve seen engineers stay stuck in endless refinement loops, shipping nothing, because the bar they set for themselves was impossibly high. I&apos;ve noticed this pattern repeatedly — in different teams, different companies. Smart people, talented people, paralyzed by their own standards.</p>
            <p>The shift isn&apos;t about lowering the bar. It&apos;s about knowing which bar matters and when. Good enough to ship beats perfect and stuck — every time.</p>

            <h2 className="mt-10 mb-4 text-xl font-semibold text-white">Hiring without a safety net</h2>
            <p>Hiring without a safety net means no recruiter, no HR pipeline, no buffer. Just you, the job post, and a stack of CVs to sift through while the product is waiting.</p>
            <p>You learn fast that hiring wrong costs far more time than hiring slow. The filter I developed: I wasn&apos;t just looking for technical skill. I was looking for people who could handle simplicity. The hardest engineers to work with aren&apos;t the ones who don&apos;t know enough — they&apos;re the ones who overcomplicate everything because complexity feels safer than clarity.</p>

            <h2 className="mt-10 mb-4 text-xl font-semibold text-white">The real job</h2>
            <p>Here&apos;s what I think the job actually is:</p>
            <p>Remove friction. From the team&apos;s path, from the process, from the codebase, from each other.</p>
            <p>Stay in the loop technically. Not to micromanage — to earn the trust to make good calls. An engineering manager who can&apos;t read a PR isn&apos;t managing engineering.</p>
            <p>Make the feedback loop faster. Between writing code and knowing if it works. Between a decision and its consequences. Between a person and their growth.</p>

            <h2 className="mt-10 mb-4 text-xl font-semibold text-white">What I&apos;d tell an engineer considering the switch</h2>
            <p>The skills that made you a great engineer will help — but they&apos;ll also get in your way.</p>
            <p>Your instinct to fix things yourself? Channel it into fixing systems instead of code.</p>
            <p>Your eye for quality? Use it to build review culture, not to be the last line of defense.</p>
            <p>Your love of clean architecture? Apply it to how your team works, not just what they build.</p>
            <p>The transition is worth it — if you do it consciously. Most people stumble into management and spend years recovering. You don&apos;t have to.</p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
