import { ArticleCatalog } from "@/components/article-catalog";
import { getAllPosts } from "@/lib/posts";

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <section className="bg-mk-page pt-32 pb-16 md:pt-44 md:pb-24">
      {/* 1280px less 48px gutters = the 1184px between the frame lines. */}
      <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-[10px] md:gap-16 md:px-12">
        <header className="mx-auto flex max-w-[680px] flex-col items-center gap-4 text-center">
          <h1 className="font-[family-name:var(--font-marketing-heading)] text-[40px] leading-[1.05] font-medium tracking-[-1.6px] text-balance text-mk-fg md:text-[64px] md:tracking-[-2.56px]">
            Vulnix Blog
          </h1>
          <p className="max-w-[520px] font-[family-name:var(--font-marketing-body)] text-[16px] leading-[22.4px] text-pretty text-mk-fg/70 md:text-[18px] md:leading-[25.2px]">
            Field notes on AI pentesting, exploit validation and application security, from the team
            behind Vulnix, an AI penetration testing platform.
          </p>
        </header>
        <ArticleCatalog posts={posts} />
      </div>
    </section>
  );
}
