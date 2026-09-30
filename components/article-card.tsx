import Image from "next/image";
import Link from "next/link";

import { LineLink } from "@/components/line-link";
import { getArticleCover } from "@/lib/article-cover";

export type ArticleCardPost = {
  slug: string;
  title: string;
  topic: string;
  excerpt: string;
  readingTime: number;
};

// The product's article card (learn-more.tsx on vulnix.dev): a cream card,
// the cover on top, an Ember topic eyebrow and a line link. The whole card is
// one link, so hovering anywhere plays the line link's animation.
export function ArticleCard({
  post,
  headingLevel = 2,
  eager = false,
}: {
  post: ArticleCardPost;
  headingLevel?: 2 | 3;
  eager?: boolean;
}) {
  const cover = getArticleCover(post.slug);
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <Link
      href={`/insights/${post.slug}`}
      className="group/link relative flex flex-col overflow-hidden rounded-[24px] bg-mk-surface text-[#0e1815] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fe4202]"
    >
      <div className="relative aspect-[2/1] shrink-0 overflow-hidden rounded-[24px] bg-ink">
        <Image
          src={cover.src}
          alt={cover.alt}
          width={1856}
          height={928}
          loading={eager ? "eager" : "lazy"}
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 400px"
          className="size-full object-cover object-left-top transition-transform duration-500 ease-out group-hover/link:scale-[1.02]"
        />
      </div>
      <div className="flex flex-1 flex-col items-start gap-[14px] p-6 pb-8 md:pb-6">
        <p className="font-[family-name:var(--font-marketing-body)] text-[12px] leading-[14.4px] font-semibold tracking-[1.08px] text-[#fe4202] uppercase">
          {post.topic}
        </p>
        <Heading className="font-[family-name:var(--font-marketing-body)] text-[24px] leading-[31.2px] font-normal text-balance">
          {post.title}
        </Heading>
        <p className="font-[family-name:var(--font-marketing-body)] text-[16px] leading-6 text-[#0e1815]/70">
          {post.excerpt}
        </p>
        <div className="mt-auto flex w-full items-center justify-between gap-4 pt-2">
          <LineLink label="Read article" />
          <span className="font-[family-name:var(--font-marketing-body)] text-[14px] text-[#0e1815]/55">
            {post.readingTime} min read
          </span>
        </div>
      </div>
    </Link>
  );
}
