import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { TrackedNextLink } from "@/components/TrackedLink";
import PageShell from "@/components/PageShell";
import { getAllPosts, getPostBySlug, getReadingTime, formatDate, type PostMeta } from "@/lib/posts";
import { buildArticleSchema, buildBreadcrumbSchema } from "@/lib/schema";
import { buildArticleMetadata } from "@/lib/articleMetadata";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { ReactNode } from "react";
import ShareRow from "@/components/writing/ShareRow";
import BackLink from "@/components/writing/BackLink";
import { MdxBlockquote, MdxLink } from "@/components/writing/MdxComponents";
import { CodeBlockFigure, CodePre, InlineCode } from "@/components/writing/CodeBlock";
import MarkdownDemoServer from "@/components/writing/MarkdownDemoServer";
import rehypePrettyCode from "rehype-pretty-code";
import rehypePrettyCodeOptions from "@/lib/rehypePrettyCode";
import ReadingProgress from "@/components/writing/ReadingProgress";
import PostNavigation from "@/components/writing/PostNavigation";

/* Fix #2: Keep star + amber mono but shorten gradient line for article h2s */
function MdxH2({ children }: Readonly<{ children?: ReactNode }>) {
  return (
    <h2 className="mt-12 mb-6 flex items-start gap-2.5">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="#BA7517" className="mt-0.5 shrink-0" aria-hidden="true">
        <path d="M12 2l2.09 6.26L20.18 9l-5.09 3.74L16.18 19 12 15.77 7.82 19l1.09-6.26L3.82 9l6.09-.74z" />
      </svg>
      <span className="font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-[#BA7517]">
        {children}
      </span>
      <span className="hidden h-px w-10 bg-gradient-to-r from-[#BA7517]/30 to-transparent sm:block" />
    </h2>
  );
}

/* Fix #3: MDX images break out to full container width */
function MdxImage({ src, alt }: Readonly<{ src?: string; alt?: string }>) {
  if (!src) return null;
  return (
    <figure className="-mx-0 my-10 sm:-mx-8 lg:-mx-16">
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg">
        <Image src={src} alt={alt ?? ""} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 896px" className="object-contain" />
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

const mdxComponents = { h2: MdxH2, img: MdxImage, p: MdxParagraph, blockquote: MdxBlockquote, a: MdxLink, figure: CodeBlockFigure, pre: CodePre, code: InlineCode, MarkdownDemo: MarkdownDemoServer };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  { params }: Readonly<{ params: Promise<{ slug: string }> }>
): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return buildArticleMetadata(post, "writing", slug);
}

/* Fix #1: Single max-w-3xl container, cover breaks out with negative margins */
function PostHeader({ post }: Readonly<{ post: { date: string; title: string; description: string; coverImage: string; content: string } }>) {
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
          {post.description}
        </p>
      </header>
      <div className="relative -mx-0 mb-10 aspect-[3/2] w-[calc(100%)] overflow-hidden rounded-lg sm:-mx-8 sm:w-[calc(100%+4rem)] lg:-mx-16 lg:w-[calc(100%+8rem)]">
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
        <span className="mx-3">&middot;</span>
        <TrackedNextLink href="/lab" eventName="cta-click" eventData={{ cta: "looking for code", page: `/writing/${slug}` }} className="group relative inline-block border-b border-dashed border-[#BA7517]/40 text-[#BA7517] transition-colors hover:text-[#BA7517]/80">
          <span className="absolute inset-0 -m-4 rounded-full opacity-0 transition-opacity group-hover:opacity-100" style={{ background: "radial-gradient(circle, rgba(186,117,23,0.06) 0%, transparent 70%)" }} />
          <span className="relative">Looking for code? Try the Lab &rarr;</span>
        </TrackedNextLink>
      </p>
    </div>
  );
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildArticleSchema({ title: post.title, description: post.description, coverImage: post.coverImage, date: post.date }, "writing", slug)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema("Writing", "writing", post.title)) }} />
      <ReadingProgress />
      <PageShell>
      <main id="main" className="relative z-10 mx-auto max-w-3xl px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <BackLink href="/writing" label="Back to Writing" />

        <article className="mt-8">
          <PostHeader post={post} />
          <div className="space-y-6 text-[15px] leading-[1.8] text-neutral-300">
            <MDXRemote source={post.content} components={mdxComponents} options={{ mdxOptions: { rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]] } }} />
          </div>
        </article>

        <PostEnding title={post.title} slug={post.slug} previous={previous} next={next} />
      </main>
      </PageShell>
</>
  );
}
