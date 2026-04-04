import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { TrackedNextLink } from "@/components/TrackedLink";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import NebulaGlows from "@/components/NebulaGlows";
import SectionTitle from "@/components/SectionTitle";
import { getAllPosts, formatDate, type PostMeta } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Writing",
  description: "Thoughts on engineering leadership, architecture, and the human side of building software.",
  alternates: { canonical: "/writing" },
  openGraph: { type: "website", title: "Writing — Mehmet Fahri Özmen", description: "Thoughts on engineering leadership, architecture, and the human side of building software.", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

function PostCard({ post }: Readonly<{ post: PostMeta }>) {
  return (
    <TrackedNextLink
      href={`/writing/${post.slug}`}
      eventName="post-card-click"
      eventData={{ title: post.title, section: "writing" }}
      className="group block overflow-hidden rounded-lg border border-[#BA7517]/[0.10] bg-[#BA7517]/[0.01] transition-colors hover:border-[#BA7517]/25 hover:bg-[#BA7517]/[0.03]"
    >
      <div className="relative aspect-[3/2] w-full overflow-hidden">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 100vw, 480px"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div className="p-5">
        <span className="font-mono text-[11px] text-[#BA7517]/80">{formatDate(post.date)} · {post.readingTime} min read</span>
        <h3 className="mt-1.5 text-[15px] font-semibold text-white transition-colors group-hover:text-[#BA7517]">
          {post.title}
        </h3>
        <p className="mt-2 text-[12px] leading-relaxed text-[#a3a3a3]">
          {post.excerpt}
        </p>
      </div>
    </TrackedNextLink>
  );
}

function CollectionJsonLd({ posts }: Readonly<{ posts: PostMeta[] }>) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Writing — Mehmet Fahri Özmen",
    description: "Thoughts on engineering leadership, architecture, and the human side of building software.",
    url: "https://mehmetfahriozmen.dev/writing",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://mehmetfahriozmen.dev/writing/${post.slug}`,
        name: post.title,
      })),
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default function WritingPage() {
  const posts = getAllPosts();

  return (
    <>
      <CollectionJsonLd posts={posts} />
      <a href="#main" className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-2 focus-visible:left-1/2 focus-visible:-translate-x-1/2 focus-visible:z-[100] focus-visible:px-4 focus-visible:py-2 focus-visible:bg-neutral-900 focus-visible:text-white focus-visible:rounded focus-visible:text-sm">
        Skip to content
      </a>
      <Navigation />
      <Starfield />
      <NebulaGlows />

      <main id="main" className="relative z-10 mx-auto max-w-4xl px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <section className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Field Notes
          </h1>
          <p className="mt-4 text-lg italic text-neutral-500">
            Explore first. Document later. Share everything.
          </p>
        </section>
        <SectionTitle title="Latest" />
        <div className={`grid gap-6 ${posts.length < 3 ? "mx-auto max-w-lg grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
        <p className="mt-16 border-t border-[#BA7517]/10 pt-8 text-center text-[13px] text-neutral-500">
          <TrackedNextLink href="/lab" eventName="cta-click" eventData={{ cta: "try the lab", page: "/writing" }} className="group relative inline-block border-b border-dashed border-[#BA7517]/40 text-[#BA7517] transition-colors hover:text-[#BA7517]/80">
            <span className="absolute inset-0 -m-4 rounded-full opacity-0 transition-opacity group-hover:opacity-100" style={{ background: "radial-gradient(circle, rgba(186,117,23,0.06) 0%, transparent 70%)" }} />
            <span className="relative">Want code instead? Try the Lab &rarr;</span>
          </TrackedNextLink>
        </p>
      </main>
      <Footer />
    </>
  );
}
