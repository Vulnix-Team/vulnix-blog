"use client";

import { Rss, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { AgentMark } from "@/components/agent-mark";
import { ArticleCard, type ArticleCardPost } from "@/components/article-card";

// Same 38px, 12px-radius controls as the product header's buttons.
const CONTROL =
  "flex h-[38px] shrink-0 items-center justify-center rounded-[12px] font-[family-name:var(--font-marketing-body)] text-[13.92px] font-medium tracking-[-0.01em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fe4202]";
const CONTROL_IDLE = "bg-mk-fg/[0.08] text-mk-fg hover:bg-mk-fg/[0.14]";
const CONTROL_ACTIVE = "bg-mk-fg text-mk-page";

export function ArticleCatalog({ posts }: { posts: ArticleCardPost[] }) {
  const [topic, setTopic] = useState("All");
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const topics = ["All", ...new Set(posts.map((post) => post.topic))];
  const visiblePosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return posts.filter((post) => {
      const hasTopic = topic === "All" || post.topic === topic;
      const hasQuery =
        !normalizedQuery ||
        [post.title, post.topic, post.excerpt].some((value) => value.toLowerCase().includes(normalizedQuery));
      return hasTopic && hasQuery;
    });
  }, [posts, query, topic]);

  return (
    <section aria-label="Article catalog" className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" aria-label="Filter articles by topic">
          {topics.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={topic === item}
              onClick={() => setTopic(item)}
              className={`${CONTROL} px-4 ${topic === item ? CONTROL_ACTIVE : CONTROL_IDLE}`}
            >
              {item}
            </button>
          ))}
        </div>
        {/* On phones the row drops below the topics; the margin leaves Dot room
            to peek over the search field. */}
        <div className="mt-12 flex items-center gap-2 md:mt-0">
          <div className="relative min-w-0 flex-1 md:w-[260px] md:flex-none">
            {/* Dot peeks over the search field: the field (z-10, opaque) hides
                its lower third, and it looks down while the visitor types. */}
            <AgentMark
              typing={searching}
              typingLine={{ text: "Ooh, what are we hunting for?", mood: "happy" }}
              className="absolute -top-[40px] right-3 z-0 md:-top-[46px]"
            />
            <label className="relative z-10 flex h-[38px] items-center gap-2 rounded-[12px] bg-mk-raised px-3 text-mk-fg/50 transition-colors focus-within:bg-[#1f1f1f] light:focus-within:bg-mk-surface-2">
              <Search aria-hidden size={16} strokeWidth={1.75} />
              <span className="sr-only">Search articles</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => setSearching(true)}
                onBlur={() => setSearching(false)}
                placeholder="Search articles"
                type="search"
                className="h-full w-full bg-transparent font-[family-name:var(--font-marketing-body)] text-[14px] text-mk-fg outline-none placeholder:text-mk-fg/50"
              />
            </label>
          </div>
          <a
            href="/feed.xml"
            aria-label="Subscribe to the Vulnix Blog RSS feed"
            title="Subscribe via RSS"
            className={`${CONTROL} ${CONTROL_IDLE} w-[38px]`}
          >
            <Rss aria-hidden size={16} strokeWidth={1.75} />
          </a>
        </div>
      </div>

      {visiblePosts.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visiblePosts.map((post, index) => (
            <ArticleCard key={post.slug} post={post} eager={index === 0} />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center font-[family-name:var(--font-marketing-body)] text-[16px] text-mk-fg/60">
          No articles match that search.
        </p>
      )}
    </section>
  );
}
