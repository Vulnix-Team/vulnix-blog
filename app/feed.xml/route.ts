import { createRssFeed } from "@/lib/rss-feed";

export const dynamic = "force-static";

export function GET() {
  return new Response(createRssFeed(), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
