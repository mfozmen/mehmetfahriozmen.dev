import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/posts");

export type PostMeta = {
  title: string;
  date: string;
  slug: string;
  coverImage: string;
  description: string;
  readingTime: number;
};

export type Post = PostMeta & {
  content: string;
};

export function sortByDateDesc(a: { date: string }, b: { date: string }): number {
  if (a.date === b.date) return 0;
  return a.date > b.date ? -1 : 1;
}

export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    return { ...(data as Omit<PostMeta, "readingTime">), readingTime: getReadingTime(content) };
  });

  return posts.sort(sortByDateDesc);
}

export function getPostBySlug(slug: string): Post | undefined {
  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".mdx"));

  for (const filename of files) {
    const filePath = path.join(postsDirectory, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    if (data.slug === slug) {
      return { ...(data as Omit<PostMeta, "readingTime">), readingTime: getReadingTime(content), content };
    }
  }

  return undefined;
}

export function getReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
}

export function formatDate(iso: string): string {
  const date = new Date(iso + "T00:00:00");
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
