import { getAllPosts } from "@/lib/posts";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&apos;");
}

function rssDate(value: string) {
  return new Date(`${value}T00:00:00Z`).toUTCString();
}

/** Builds the public RSS 2.0 document served from /feed.xml. */
export function createRssFeed() {
  const posts = getAllPosts();
  const items = posts.map((post) => {
    const url = `${SITE_URL}/insights/${post.slug}`;

    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${rssDate(post.publishedAt)}</pubDate>
      <dc:creator>Vulnix Team</dc:creator>
      <category>${escapeXml(post.topic)}</category>
    </item>`;
  }).join("");

  const lastBuildDate = posts[0] ? rssDate(posts[0].updatedAt || posts[0].publishedAt) : new Date().toUTCString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;
}
