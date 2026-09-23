import type { MetadataRoute } from "next";

import { getAllPosts } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  return [
    { url: SITE_URL, lastModified: posts[0]?.updatedAt, changeFrequency: "weekly", priority: 1 },
    ...posts.map((post) => ({ url: `${SITE_URL}/insights/${post.slug}`, lastModified: post.updatedAt, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
