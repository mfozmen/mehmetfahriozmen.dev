import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { TrackedNextLink } from "@/components/TrackedLink";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import NebulaGlows from "@/components/NebulaGlows";
import { getAllPosts, getPostBySlug, getReadingTime, formatDate, type Post, type PostMeta } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { ReactNode } from "react";
import ShareRow from "@/components/writing/ShareRow";
import ReadingProgress from "@/components/writing/ReadingProgress";
import PostNavigation from "@/components/writing/PostNavigation";

/* Fix #2: Keep star + amber mono but shorten gradient line for article h2s */
function MdxH2({ children }: Readonly<{ children?: ReactNode }>) {
  return (
    <h2 className="mt-12 mb-6 flex items-center gap-2.5">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="#BA7517" className="shrink-0" aria-hidden="true">
        <path d="M12 2l2.09 6.26L20.18 9l-5.09 3.74L16.18 19 12 15.77 7.82 19l1.09-6.26L3.82 9l6.09-.74z" />
      </svg>
      <span className="shrink-0 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-[#BA7517]">
        {children}
      </span>
      <span className="h-px w-10 bg-gradient-to-r from-[#BA7517]/30 to-transparent" />
    </h2>
  );
}

/* Fix #3: MDX images break out to full container width */
function MdxImage({ src, alt }: Readonly<{ src?: string; alt?: string }>) {
  if (!src) return null;
  return (
    <figure className="-mx-0 my-10 sm:-mx-8 lg:-mx-16">
      <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg">
        <Image src={src} alt={alt ?? ""} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 896px" className="object-cover" />
      </div>
      {alt && alt !== "" && (
        <figcaption className="mt-2 px-0 text-xs text-neutral-500 sm:px-8 lg:px-16">{alt}</figcaption>
      )}
    </figure>
  );
}

function MdxParagraph({ children }: Readonly<{ children?: ReactNode }>) {
  const childArray = Array.isArray(children) ? children : [children];
  const hasImage = childArray.some(
    (child) => typeof child === "object" && child !== null && "type" in child && (child as { type: unknown }).type === MdxImage
  );
  if (hasImage) return <>{children}</>;
  return <p>{children}</p>;
}

function MdxBlockquote({ children }: Readonly<{ children?: ReactNode }>) {
  return (
    <blockquote className="my-10 space-y-4 rounded-r-lg border-l-2 border-[#BA7517]/40 py-5 pl-6 pr-6 text-xl leading-[1.6] italic text-neutral-200 sm:text-2xl" style={{ background: "linear-gradient(135deg, rgba(186,117,23,0.04) 0%, transparent 60%)" }}>
      {children}
    </blockquote>
  );
}

const mdxComponents = { h2: MdxH2, img: MdxImage, p: MdxParagraph, blockquote: MdxBlockquote };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  { params }: Readonly<{ params: Promise<{ slug: string }> }>
): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const ogImage = `https://mehmetfahriozmen.dev${post.coverImage}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/writing/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/writing/${slug}`,
      publishedTime: post.date,
      authors: ["Mehmet Fahri Özmen"],
      images: [{ url: ogImage, width: 1200, height: 800, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
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

/* Fix #1: Single max-w-3xl container, cover breaks out with negative margins */
function PostHeader({ post }: Readonly<{ post: { date: string; title: string; excerpt: string; coverImage: string; content: string } }>) {
  return (
    <>
      <header className="mb-8">
        <span className="font-mono text-[11px] text-[#BA7517]/80">
          {formatDate(post.date)} · {getReadingTime(post.content)} min read
        </span>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-3 text-lg italic text-neutral-500">
          {post.excerpt}
        </p>
      </header>
      <div className="relative -mx-0 mb-10 aspect-[2/1] w-[calc(100%)] overflow-hidden rounded-lg sm:-mx-8 sm:w-[calc(100%+4rem)] lg:-mx-16 lg:w-[calc(100%+8rem)]">
        <Image src={post.coverImage} alt={post.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 896px" className="object-cover" priority />
      </div>
    </>
  );
}

/* Fix #4: Merge about prompt into share row, add space before contact CTA */
/* Fix #6: Add end-of-article divider */
function PostEnding({ title, slug, previous, next }: Readonly<{ title: string; slug: string; previous?: PostMeta; next?: PostMeta }>) {
  return (
    <div className="mt-16">
      <div className="flex items-center justify-center gap-2 text-neutral-700">
        <span>*</span><span>*</span><span>*</span>
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <ShareRow title={title} slug={slug} />
      </div>
      <PostNavigation previous={previous} next={next} />
      <p className="mt-12 border-t border-[#BA7517]/10 pt-8 text-center text-[13px] text-neutral-500">
        <TrackedNextLink href="/about" eventName="cta-click" eventData={{ cta: "curious who wrote this", page: `/writing/${slug}` }} className="group relative inline-block border-b border-dashed border-[#BA7517]/40 text-[#BA7517] transition-colors hover:text-[#BA7517]/80">
          <span className="absolute inset-0 -m-4 rounded-full opacity-0 transition-opacity group-hover:opacity-100" style={{ background: "radial-gradient(circle, rgba(186,117,23,0.06) 0%, transparent 70%)" }} />
          <span className="relative">Curious who wrote this? &rarr;</span>
        </TrackedNextLink>
        <span className="mx-3">&middot;</span>
        <TrackedNextLink href="/contact" eventName="cta-click" eventData={{ cta: "want to talk about this", page: `/writing/${slug}` }} className="group relative inline-block border-b border-dashed border-[#BA7517]/40 text-[#BA7517] transition-colors hover:text-[#BA7517]/80">
          <span className="absolute inset-0 -m-4 rounded-full opacity-0 transition-opacity group-hover:opacity-100" style={{ background: "radial-gradient(circle, rgba(186,117,23,0.06) 0%, transparent 70%)" }} />
          <span className="relative">Want to talk about this? &rarr;</span>
        </TrackedNextLink>
      </p>
    </div>
  );
}

function buildArticleSchema(post: Post, slug: string) {
  return {
    "@context": "https://schema.org", "@type": "Article",
    headline: post.title, description: post.excerpt,
    image: `https://mehmetfahriozmen.dev${post.coverImage}`,
    datePublished: post.date,
    author: { "@type": "Person", name: "Mehmet Fahri Özmen", url: "https://mehmetfahriozmen.dev" },
    publisher: { "@type": "Person", name: "Mehmet Fahri Özmen" },
    url: `https://mehmetfahriozmen.dev/writing/${slug}`,
  };
}

function buildBreadcrumbSchema(title: string) {
  return {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://mehmetfahriozmen.dev" },
      { "@type": "ListItem", position: 2, name: "Writing", item: "https://mehmetfahriozmen.dev/writing" },
      { "@type": "ListItem", position: 3, name: title },
    ],
  };
}

export default async function PostPage(
  { params }: Readonly<{ params: Promise<{ slug: string }> }>
) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const previous = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : undefined;
  const next = currentIndex > 0 ? allPosts[currentIndex - 1] : undefined;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildArticleSchema(post, slug)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema(post.title)) }} />
      <ReadingProgress />
      <a href="#main" className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-2 focus-visible:left-1/2 focus-visible:-translate-x-1/2 focus-visible:z-[100] focus-visible:px-4 focus-visible:py-2 focus-visible:bg-neutral-900 focus-visible:text-white focus-visible:rounded focus-visible:text-sm">
        Skip to content
      </a>
      <Navigation />
      <Starfield />
      <NebulaGlows />

      {/* Fix #1 & #5: Single max-w-3xl, no per-paragraph max-w */}
      <main id="main" className="relative z-10 mx-auto max-w-3xl px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <BackLink />

        <article className="mt-8">
          <PostHeader post={post} />
          <div className="space-y-6 text-[15px] leading-[1.8] text-neutral-300">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>
        </article>

        <PostEnding title={post.title} slug={post.slug} previous={previous} next={next} />
      </main>
      <Footer />
    </>
  );
}
