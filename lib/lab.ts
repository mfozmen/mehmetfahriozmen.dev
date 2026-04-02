import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const labDirectory = path.join(process.cwd(), "content/lab");

export type LabPostMeta = {
  title: string;
  description: string;
  date: string;
  slug: string;
  coverImage: string;
  tags: string[];
  readingTime: number;
};

export type LabPost = LabPostMeta & {
  content: string;
};

function sortByDateDesc(a: { date: string }, b: { date: string }): number {
  if (a.date === b.date) return 0;
  return a.date > b.date ? -1 : 1;
}

export function getAllLabPosts(): LabPostMeta[] {
  if (!fs.existsSync(labDirectory)) return [];
  const files = fs.readdirSync(labDirectory).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const filePath = path.join(labDirectory, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    return {
      ...(data as Omit<LabPostMeta, "readingTime">),
      readingTime: getReadingTime(content),
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
      return { ...(data as LabPostMeta), content };
    }
  }

  return undefined;
}

export function getReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
}
