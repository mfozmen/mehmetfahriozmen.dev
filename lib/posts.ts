import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/posts");

export type PostMeta = {
  title: string;
  date: string;
  slug: string;
  coverImage: string;
  excerpt: string;
};

export type Post = PostMeta & {
  content: string;
};

export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    return data as PostMeta;
  });

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPostBySlug(slug: string): Post | undefined {
  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".mdx"));

  for (const filename of files) {
    const filePath = path.join(postsDirectory, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    if (data.slug === slug) {
      return { ...(data as PostMeta), content };
    }
  }

  return undefined;
}
