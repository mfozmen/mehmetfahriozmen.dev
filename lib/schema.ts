const SITE_URL = "https://mehmetfahriozmen.dev";
const AUTHOR = { "@type": "Person" as const, name: "Mehmet Fahri Özmen", url: SITE_URL };

type ArticleInput = {
  title: string;
  description: string;
  coverImage: string;
  date: string;
};

export function buildArticleSchema(post: ArticleInput, section: string, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: `${SITE_URL}${post.coverImage}`,
    datePublished: post.date,
    author: AUTHOR,
    publisher: AUTHOR,
    url: `${SITE_URL}/${section}/${slug}`,
  };
}

export function buildBreadcrumbSchema(sectionName: string, sectionPath: string, title: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: sectionName, item: `${SITE_URL}/${sectionPath}` },
      { "@type": "ListItem", position: 3, name: title },
    ],
  };
}
