import type { Metadata } from "next";
import Image from "next/image";
import { TrackedNextLink } from "@/components/TrackedLink";
import CollectionJsonLd from "@/components/CollectionJsonLd";
import PageShell from "@/components/PageShell";
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


export default function WritingPage() {
  const posts = getAllPosts();

  return (
    <>
      <CollectionJsonLd name="Writing — Mehmet Fahri Özmen" description="Thoughts on engineering leadership, architecture, and the human side of building software." basePath="writing" posts={posts} />
      <PageShell>
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
      </PageShell>
</>
  );
}
