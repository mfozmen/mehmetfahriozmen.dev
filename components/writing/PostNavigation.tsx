import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import { formatDate, type PostMeta } from "@/lib/posts";

function NavCard({ post, direction }: Readonly<{ post: PostMeta; direction: "previous" | "next" }>) {
  const isPrev = direction === "previous";
  return (
    <Link
      href={`/writing/${post.slug}`}
      className="group block rounded-lg border border-[#BA7517]/[0.10] bg-[#BA7517]/[0.01] p-5 transition-colors hover:border-[#BA7517]/25 hover:bg-[#BA7517]/[0.03]"
    >
      <span className={`block font-mono text-[10px] uppercase tracking-[0.15em] text-[#BA7517]/60 ${isPrev ? "text-left" : "text-right"}`}>
        {isPrev ? "← Previous" : "Next →"}
      </span>
      <span className={`mt-2 block text-[14px] font-semibold text-white transition-colors group-hover:text-[#BA7517] ${isPrev ? "text-left" : "text-right"}`}>
        {post.title}
      </span>
      <span className={`mt-1 block font-mono text-[11px] text-[#BA7517]/80 ${isPrev ? "text-left" : "text-right"}`}>
        {formatDate(post.date)} · {post.readingTime} min read
      </span>
    </Link>
  );
}

export default function PostNavigation({ previous, next }: Readonly<{ previous?: PostMeta; next?: PostMeta }>) {
  if (!previous && !next) return null;

  return (
    <div className="mt-12">
      <SectionTitle title="Also in the Log" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {previous ? <NavCard post={previous} direction="previous" /> : <div />}
        {next ? <NavCard post={next} direction="next" /> : <div />}
      </div>
    </div>
  );
}
