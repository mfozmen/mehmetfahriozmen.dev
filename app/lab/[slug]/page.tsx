import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { TrackedNextLink } from "@/components/TrackedLink";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import NebulaGlows from "@/components/NebulaGlows";
import ShareRow from "@/components/writing/ShareRow";
import TagPill from "@/components/lab/TagPill";
import ReadingProgress from "@/components/writing/ReadingProgress";
import { getAllLabPosts, getLabPostBySlug, type LabPost } from "@/lib/lab";
import { getReadingTime, formatDate } from "@/lib/posts";
import { MdxBlockquote, MdxLink } from "@/components/writing/MdxComponents";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { ReactNode } from "react";

function LabMdxH2({ children }: Readonly<{ children?: ReactNode }>) {
  return (
    <h2 className="mt-12 mb-6 flex items-start gap-2.5">
      <span className="mt-0.5 shrink-0 font-mono text-[13px] text-[#BA7517]" aria-hidden="true">
        &gt;_
      </span>
      <span className="font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-[#BA7517]">
        {children}
      </span>
      <span className="hidden h-px w-10 bg-gradient-to-r from-[#BA7517]/30 to-transparent sm:block" />
    </h2>
  );
}

function LabMdxPre({ children }: Readonly<{ children?: ReactNode }>) {
  return (
    <pre className="my-8 overflow-x-auto rounded-lg border border-[#BA7517]/10 bg-[#0d0d0d] p-5 text-[13px] leading-relaxed">
      {children}
    </pre>
  );
}

function LabMdxCode({ children, className }: Readonly<{ children?: ReactNode; className?: string }>) {
  if (className) {
    return <code className={`${className} text-[13px]`}>{children}</code>;
  }
  return (
    <code className="rounded border border-[#BA7517]/10 bg-[#BA7517]/[0.04] px-1.5 py-0.5 font-mono text-[13px] text-[#BA7517]/80">
      {children}
    </code>
  );
}

const mdxComponents = {
  h2: LabMdxH2,
  pre: LabMdxPre,
  code: LabMdxCode,
  blockquote: MdxBlockquote,
  a: MdxLink,
};

export function generateStaticParams() {
  return getAllLabPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  { params }: Readonly<{ params: Promise<{ slug: string }> }>
): Promise<Metadata> {
  const { slug } = await params;
  const post = getLabPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/lab/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/lab/${slug}`,
      publishedTime: post.date,
      authors: ["Mehmet Fahri Özmen"],
      images: [{ url: `https://mehmetfahriozmen.dev${post.coverImage}`, width: 1200, height: 800, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [`https://mehmetfahriozmen.dev${post.coverImage}`],
    },
  };
}

function BackLink() {
  return (
    <Link
      href="/lab"
      className="group relative inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-neutral-500 transition-colors hover:text-[#BA7517]"
    >
      <span className="transition-transform group-hover:-translate-x-0.5">&larr;</span>
      <span>Back to Lab</span>
    </Link>
  );
}

function PostHeader({ post }: Readonly<{ post: LabPost }>) {
  return (
    <>
      <header className="mb-8">
        <span className="font-mono text-[11px] text-[#BA7517]/80">
          {formatDate(post.date)} · {getReadingTime(post.content)} min read
        </span>
        <h1 className="mt-2 font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-lg text-neutral-500">
          {post.description}
        </p>
        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <TagPill key={tag} tag={tag} />
            ))}
          </div>
        )}
      </header>
      <div className="relative -mx-0 mb-10 aspect-[3/2] w-[calc(100%)] overflow-hidden rounded-lg sm:-mx-8 sm:w-[calc(100%+4rem)] lg:-mx-16 lg:w-[calc(100%+8rem)]">
        <Image src={post.coverImage} alt={post.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 896px" className="object-cover" priority />
      </div>
    </>
  );
}

function PostEnding({ title, slug }: Readonly<{ title: string; slug: string }>) {
  return (
    <div className="mt-16">
      <div className="flex items-center justify-center gap-2 text-neutral-700">
        <span>*</span><span>*</span><span>*</span>
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <ShareRow title={title} slug={slug} basePath="lab" />
      </div>
      <p className="mt-12 border-t border-[#BA7517]/10 pt-8 text-center text-[13px] text-neutral-500">
        <TrackedNextLink href="/lab" eventName="cta-click" eventData={{ cta: "back to lab", page: `/lab/${slug}` }} className="group relative inline-block border-b border-dashed border-[#BA7517]/40 text-[#BA7517] transition-colors hover:text-[#BA7517]/80">
          <span className="relative">See all experiments &rarr;</span>
        </TrackedNextLink>
        <span className="mx-3">&middot;</span>
        <TrackedNextLink href="/contact" eventName="cta-click" eventData={{ cta: "want to talk about this", page: `/lab/${slug}` }} className="group relative inline-block border-b border-dashed border-[#BA7517]/40 text-[#BA7517] transition-colors hover:text-[#BA7517]/80">
          <span className="relative">Want to talk about this? &rarr;</span>
        </TrackedNextLink>
        <span className="mx-3">&middot;</span>
        <TrackedNextLink href="/writing" eventName="cta-click" eventData={{ cta: "prefer essays", page: `/lab/${slug}` }} className="group relative inline-block border-b border-dashed border-[#BA7517]/40 text-[#BA7517] transition-colors hover:text-[#BA7517]/80">
          <span className="relative">Prefer essays? Read Field Notes &rarr;</span>
        </TrackedNextLink>
      </p>
    </div>
  );
}

function buildArticleSchema(post: LabPost, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: `https://mehmetfahriozmen.dev${post.coverImage}`,
    datePublished: post.date,
    author: { "@type": "Person", name: "Mehmet Fahri Özmen", url: "https://mehmetfahriozmen.dev" },
    publisher: { "@type": "Person", name: "Mehmet Fahri Özmen" },
    url: `https://mehmetfahriozmen.dev/lab/${slug}`,
  };
}

function buildBreadcrumbSchema(title: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://mehmetfahriozmen.dev" },
      { "@type": "ListItem", position: 2, name: "Lab", item: "https://mehmetfahriozmen.dev/lab" },
      { "@type": "ListItem", position: 3, name: title },
    ],
  };
}

export default async function LabPostPage(
  { params }: Readonly<{ params: Promise<{ slug: string }> }>
) {
  const { slug } = await params;
  const post = getLabPostBySlug(slug);
  if (!post) notFound();

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

      <main id="main" className="relative z-10 mx-auto max-w-4xl px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <BackLink />

        <article className="mt-8">
          <PostHeader post={post} />
          <div className="space-y-6 text-[15px] leading-[1.8] text-neutral-300">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>
        </article>

        <PostEnding title={post.title} slug={post.slug} />
      </main>
      <Footer />
    </>
  );
}
