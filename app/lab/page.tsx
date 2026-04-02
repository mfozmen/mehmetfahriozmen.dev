import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import NebulaGlows from "@/components/NebulaGlows";
import LabSectionTitle from "@/components/lab/LabSectionTitle";
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

function TagPill({ tag }: Readonly<{ tag: string }>) {
  return (
    <span className="rounded-full border border-[#BA7517]/15 bg-[#BA7517]/[0.04] px-2.5 py-0.5 font-mono text-[10px] text-[#BA7517]/70">
      {tag}
    </span>
  );
}

function LabPostCard({ post }: Readonly<{ post: LabPostMeta }>) {
  return (
    <Link
      href={`/lab/${post.slug}`}
      className="group block rounded-lg border-l-2 border-[#BA7517]/20 bg-[#BA7517]/[0.01] py-5 pr-5 pl-5 transition-colors hover:border-[#BA7517]/60 hover:bg-[#BA7517]/[0.03]"
    >
      <span className="font-mono text-[11px] text-[#BA7517]/60">
        {formatDate(post.date)} · {post.readingTime} min read
      </span>
      <h3 className="mt-1.5 font-mono text-[15px] font-semibold text-white transition-colors group-hover:text-[#BA7517]">
        {post.title}
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
    </Link>
  );
}

function CollectionJsonLd({ posts }: Readonly<{ posts: LabPostMeta[] }>) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Lab Day — Mehmet Fahri Özmen",
    description: "Practical technical guides — step-by-step walkthroughs, code-heavy tutorials, and hands-on experiments.",
    url: "https://mehmetfahriozmen.dev/lab",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://mehmetfahriozmen.dev/lab/${post.slug}`,
        name: post.title,
      })),
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
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
      <CollectionJsonLd posts={posts} />
      <a href="#main" className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-2 focus-visible:left-1/2 focus-visible:-translate-x-1/2 focus-visible:z-[100] focus-visible:px-4 focus-visible:py-2 focus-visible:bg-neutral-900 focus-visible:text-white focus-visible:rounded focus-visible:text-sm">
        Skip to content
      </a>
      <Navigation />
      <Starfield />
      <NebulaGlows />

      <main id="main" className="relative z-10 mx-auto max-w-3xl px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <section className="mb-16">
          <h1 className="font-mono text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Lab Day
          </h1>
          <p className="mt-4 text-lg text-neutral-500">
            Tried it. It worked. Here's how.
          </p>
        </section>
        <LabSectionTitle title="Experiments" />
        {posts.length > 0 ? (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <LabPostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </main>
      <Footer />
    </>
  );
}
