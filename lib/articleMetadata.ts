import type { Metadata } from "next";

const SITE_URL = "https://mehmetfahriozmen.dev";
const AUTHOR_NAME = "Mehmet Fahri Özmen";

type ArticleMetadataInput = {
  title: string;
  description: string;
  date: string;
  coverImage: string;
  ogImage?: string;
};

export function buildArticleMetadata(
  post: ArticleMetadataInput,
  section: string,
  slug: string,
): Metadata {
  const ogImagePath = post.ogImage ?? post.coverImage;
  const ogImageUrl = `${SITE_URL}${ogImagePath}`;
  const ogImageHeight = post.ogImage ? 630 : 800;
  const url = `/${section}/${slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.date,
      authors: [AUTHOR_NAME],
      images: [{ url: ogImageUrl, width: 1200, height: ogImageHeight, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImageUrl],
    },
  };
}
