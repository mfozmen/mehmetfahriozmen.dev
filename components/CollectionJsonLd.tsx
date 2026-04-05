type CollectionItem = { slug: string; title: string };

type Props = {
  name: string;
  description: string;
  basePath: string;
  posts: CollectionItem[];
};

export default function CollectionJsonLd({ name, description, basePath, posts }: Readonly<Props>) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: `https://mehmetfahriozmen.dev/${basePath}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://mehmetfahriozmen.dev/${basePath}/${post.slug}`,
        name: post.title,
      })),
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
