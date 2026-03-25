import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import NebulaGlows from "@/components/NebulaGlows";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Mehmet Fahri Özmen`,
    description: post.excerpt,
  };
}

function BackLink() {
  return (
    <Link
      href="/writing"
      className="group relative inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-neutral-500 transition-colors hover:text-[#BA7517]"
    >
      <span className="transition-transform group-hover:-translate-x-0.5">&larr;</span>
      <span>Back to Writing</span>
    </Link>
  );
}

function PostFooterCta() {
  return (
    <div className="mt-16 border-t border-[#BA7517]/10 pt-8 text-center">
      <Link
        href="/contact"
        className="group relative inline-block border-b border-dashed border-[#BA7517]/40 text-[#BA7517] transition-colors hover:text-[#BA7517]/80"
      >
        <span className="absolute inset-0 -m-4 rounded-full opacity-0 transition-opacity group-hover:opacity-100" style={{ background: "radial-gradient(circle, rgba(186,117,23,0.06) 0%, transparent 70%)" }} />
        <span className="relative">Want to talk about this? &rarr;</span>
      </Link>
    </div>
  );
}

export default async function PostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <a href="#main" className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-2 focus-visible:left-1/2 focus-visible:-translate-x-1/2 focus-visible:z-[100] focus-visible:px-4 focus-visible:py-2 focus-visible:bg-neutral-900 focus-visible:text-white focus-visible:rounded focus-visible:text-sm">
        Skip to content
      </a>
      <Navigation />
      <Starfield />
      <NebulaGlows />

      <main id="main" className="relative z-10 mx-auto max-w-3xl px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <BackLink />

        <article className="mt-8">
          <header className="mb-8">
            <span className="font-mono text-[11px] text-[#BA7517]/65">{post.date}</span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {post.title}
            </h1>
          </header>

          <div className="relative mb-10 aspect-[2/1] w-full overflow-hidden rounded-lg">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-6 text-[15px] leading-[1.8] text-neutral-300 [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_p]:max-w-[65ch] [&_img]:my-10 [&_img]:w-full [&_img]:rounded-lg">
            <MDXRemote source={post.content} />
          </div>
        </article>

        <PostFooterCta />
      </main>
      <Footer />
    </>
  );
}
