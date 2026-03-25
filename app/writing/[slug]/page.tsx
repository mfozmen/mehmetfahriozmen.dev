import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import NebulaGlows from "@/components/NebulaGlows";
import { getAllPosts, getPostBySlug, getReadingTime } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { ReactNode } from "react";

function MdxH2({ children }: Readonly<{ children?: ReactNode }>) {
  return (
    <h2 className="mt-12 mb-6 flex items-center gap-2.5">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="#BA7517" className="shrink-0" aria-hidden="true">
        <path d="M12 2l2.09 6.26L20.18 9l-5.09 3.74L16.18 19 12 15.77 7.82 19l1.09-6.26L3.82 9l6.09-.74z" />
      </svg>
      <span className="shrink-0 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-[#BA7517]">
        {children}
      </span>
      <span className="h-px flex-1 bg-gradient-to-r from-[#BA7517]/30 to-transparent" />
    </h2>
  );
}

const mdxComponents = { h2: MdxH2 };

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
            <span className="font-mono text-[11px] text-[#BA7517]/65">
              {post.date} · {getReadingTime(post.content)} min read
            </span>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
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

          <div className="space-y-6 text-[15px] leading-[1.8] text-neutral-300 [&_p]:max-w-[65ch] [&_img]:my-10 [&_img]:w-full [&_img]:rounded-lg">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>
        </article>

        <PostFooterCta />
      </main>
      <Footer />
    </>
  );
}
