import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getReadingTime, sortByDateDesc } from "@/lib/posts";

const labDirectory = path.join(process.cwd(), "content/lab");

export type LabPostMeta = {
  title: string;
  description: string;
  date: string;
  slug: string;
  coverImage: string;
  ogImage?: string;
  tags: string[];
  readingTime: number;
};

export type LabPost = LabPostMeta & {
  content: string;
};

function resolveLabOgImagePath(slug: string): string | undefined {
  // 1. Per-post override (rarely needed; exists for future flexibility).
  const perPostFullPath = path.join(process.cwd(), "public", "lab", slug, "og.webp");
  if (fs.existsSync(perPostFullPath)) {
    return `/lab/${slug}/og.webp`;
  }
  // 2. Shared series cover (default for Lab Day — siblings the shared lab-day-cover.webp).
  const sharedFullPath = path.join(process.cwd(), "public", "lab", "lab-day-og.webp");
  if (fs.existsSync(sharedFullPath)) {
    return "/lab/lab-day-og.webp";
  }
  // 3. Nothing — route metadata falls back to post.coverImage at 1200x800.
  return undefined;
}

export function getAllLabPosts(): LabPostMeta[] {
  if (!fs.existsSync(labDirectory)) return [];
  const files = fs.readdirSync(labDirectory).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const filePath = path.join(labDirectory, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    const meta = data as Omit<LabPostMeta, "readingTime" | "ogImage">;
    return {
      ...meta,
      readingTime: getReadingTime(content),
      ogImage: resolveLabOgImagePath(meta.slug),
    };
  });

  return posts.sort(sortByDateDesc);
}

export function getLabPostBySlug(slug: string): LabPost | undefined {
  if (!fs.existsSync(labDirectory)) return undefined;
  const files = fs.readdirSync(labDirectory).filter((f) => f.endsWith(".mdx"));

  for (const filename of files) {
    const filePath = path.join(labDirectory, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    if (data.slug === slug) {
      const meta = data as Omit<LabPostMeta, "readingTime" | "ogImage">;
      return {
        ...meta,
        readingTime: getReadingTime(content),
        ogImage: resolveLabOgImagePath(meta.slug),
        content,
      };
    }
  }

  return undefined;
}
