import { getAllPosts } from "@/lib/posts";

const SITE_URL = "https://mehmetfahriozmen.dev";

export function GET() {
  const posts = getAllPosts();

  const items = posts.map((post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/writing/${escapeXml(post.slug)}</link>
      <guid isPermaLink="true">${SITE_URL}/writing/${escapeXml(post.slug)}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`).join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Mehmet Fahri Özmen — Writing</title>
    <link>${SITE_URL}/writing</link>
    <description>Thoughts on engineering leadership, architecture, and the human side of building software.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}

function escapeXml(str: string): string {
  return str.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
