"use client";

import { Rss, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { ArticleCard, type ArticleCardPost } from "@/components/article-card";

export function ArticleCatalog({ posts }: { posts: ArticleCardPost[] }) {
  const [topic, setTopic] = useState("All");
  const [query, setQuery] = useState("");
  const topics = ["All", ...new Set(posts.map((post) => post.topic))];
  const visiblePosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return posts.filter((post) => {
      const hasTopic = topic === "All" || post.topic === topic;
      const hasQuery = !normalizedQuery || [post.title, post.topic, post.excerpt].some((value) => value.toLowerCase().includes(normalizedQuery));
      return hasTopic && hasQuery;
    });
  }, [posts, query, topic]);

  return (
    <section className="article-catalog" aria-label="Article catalog">
      <div className="catalog-controls">
        <div className="catalog-topics">
          <a className="feed-link" href="/feed.xml" aria-label="Subscribe to the Vulnix Blog RSS feed" title="Subscribe via RSS">
            <Rss aria-hidden size={15} />
          </a>
          <div className="topic-list" aria-label="Filter articles by topic">
            {topics.map((item) => <button key={item} type="button" aria-pressed={topic === item} onClick={() => setTopic(item)}>{item}</button>)}
          </div>
        </div>
        <label className="search-field"><Search aria-hidden size={15} /><span className="sr-only">Search articles</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search articles" type="search" /></label>
      </div>
      <div className="catalog-rule" />
      {visiblePosts.length ? (
        <div className="post-grid">
          {visiblePosts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      ) : <p className="catalog-empty">No articles match that search.</p>}
    </section>
  );
}
