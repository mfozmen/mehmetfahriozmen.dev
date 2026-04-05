import type { Metadata } from "next";
import { TrackedNextLink } from "@/components/TrackedLink";
import CollectionJsonLd from "@/components/CollectionJsonLd";
import PageShell from "@/components/PageShell";
import SectionTitle from "@/components/SectionTitle";
import TagPill from "@/components/lab/TagPill";
import { getAllLabPosts, type LabPostMeta } from "@/lib/lab";
import { formatDate } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Lab",
  description: "Practical technical guides — step-by-step walkthroughs, code-heavy tutorials, and hands-on experiments.",
  alternates: { canonical: "/lab" },
  openGraph: {
    type: "website",
    title: "Lab Day — Mehmet Fahri Özmen",
    description: "Practical technical guides — step-by-step walkthroughs, code-heavy tutorials, and hands-on experiments.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

function LabPostCard({ post }: Readonly<{ post: LabPostMeta }>) {
  return (
    <TrackedNextLink
      href={`/lab/${post.slug}`}
      eventName="post-card-click"
      eventData={{ title: post.title, section: "lab" }}
      className="group block rounded-lg border-l-2 border-[#BA7517]/20 bg-[#BA7517]/[0.01] py-5 pr-5 pl-5 transition-colors hover:border-[#BA7517]/60 hover:bg-[#BA7517]/[0.03]"
    >
      <span className="font-mono text-[11px] text-[#BA7517]/60">
        {formatDate(post.date)} · {post.readingTime} min read
      </span>
      <h3 className="mt-1.5 font-mono text-[15px] font-semibold text-white transition-colors group-hover:text-[#BA7517]">
        {post.title.replace(/^Lab Day:\s*/i, "")}
      </h3>
      <p className="mt-2 text-[13px] leading-relaxed text-[#a3a3a3]">
        {post.description}
      </p>
      {post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
      )}
    </TrackedNextLink>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-[#BA7517]/15 px-8 py-16 text-center">
      <span className="font-mono text-2xl text-[#BA7517]/30" aria-hidden="true">
        &gt;_
      </span>
      <p className="mt-4 font-mono text-sm text-neutral-500">
        No experiments yet. First post incoming.
      </p>
    </div>
  );
}

export default function LabPage() {
  const posts = getAllLabPosts();

  return (
    <>
      <CollectionJsonLd name="Lab Day — Mehmet Fahri Özmen" description="Practical technical guides — step-by-step walkthroughs, code-heavy tutorials, and hands-on experiments." basePath="lab" posts={posts} />
      <PageShell>
      <main id="main" className="relative z-10 mx-auto max-w-3xl px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <section className="mb-16">
          <h1 className="font-mono text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Lab Day
          </h1>
          <p className="mt-4 text-lg text-neutral-500">
            Tried it. It worked. Here's how.
          </p>
        </section>
        <SectionTitle title="Experiments" icon={<span className="shrink-0 font-mono text-[13px] text-[#BA7517]" aria-hidden="true">&gt;_</span>} />
        {posts.length > 0 ? (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <LabPostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
        <p className="mt-16 border-t border-[#BA7517]/10 pt-8 text-center text-[13px] text-neutral-500">
          <TrackedNextLink href="/writing" eventName="cta-click" eventData={{ cta: "read field notes", page: "/lab" }} className="group relative inline-block border-b border-dashed border-[#BA7517]/40 text-[#BA7517] transition-colors hover:text-[#BA7517]/80">
            <span className="absolute inset-0 -m-4 rounded-full opacity-0 transition-opacity group-hover:opacity-100" style={{ background: "radial-gradient(circle, rgba(186,117,23,0.06) 0%, transparent 70%)" }} />
            <span className="relative">Want essays instead? Read Field Notes &rarr;</span>
          </TrackedNextLink>
        </p>
      </main>
      </PageShell>
    </>
  );
}
