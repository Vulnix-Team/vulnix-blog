import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { formatDate } from "@/lib/format";
import { COVER_HEIGHT, COVER_WIDTH, getArticleCover } from "@/lib/article-cover";
import { ArticleCard } from "@/components/article-card";
import { ArticleToc } from "@/components/article-toc";
import { LineLink } from "@/components/line-link";
import { ReducedMotionMedia } from "@/components/reduced-motion-media";
import { markdownToHtml } from "@/lib/markdown";
import { getAllPosts, getPost } from "@/lib/posts";
import { MAIN_SITE, SITE_NAME, SITE_URL } from "@/lib/site";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const url = `${SITE_URL}/insights/${post.slug}`;
  const cover = getArticleCover(post.slug);
  const image = `${SITE_URL}${cover.og}`;
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    category: post.topic,
    authors: [{ name: "Vulnix Team", url: MAIN_SITE }],
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: post.title, description: post.description, publishedTime: post.publishedAt, modifiedTime: post.updatedAt, authors: ["Vulnix Team"], images: [{ url: image, width: 1200, height: 630, alt: cover.alt }] },
    twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [image] },
  };
}

function getHeadings(markdown: string) {
  return [...markdown.matchAll(/^##\s+(.+)$/gm)].map((match) => ({
    text: match[1],
    id: match[1].toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  }));
}

/**
 * Questions and answers from an article's "## Frequently asked questions"
 * section (each question an `###` heading, its answer the text below), for
 * FAQPage structured data. The visible FAQ stays in the Markdown, so the two
 * cannot drift apart.
 */
function getFaq(markdown: string) {
  const section = markdown.match(/^## Frequently asked questions\s*$([\s\S]*?)(?=^## |(?![\s\S]))/m)?.[1];
  if (!section) return [];
  return [...section.matchAll(/^###\s+(.+)\s*$([\s\S]*?)(?=^### |(?![\s\S]))/gm)]
    .map((match) => ({
      question: match[1].trim(),
      answer: match[2]
        .trim()
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/[`*_]/g, "")
        .replace(/\s+/g, " "),
    }))
    .filter((item) => item.answer);
}

function splitOpeningSection(markdown: string) {
  const sections = [...markdown.matchAll(/^##\s+/gm)];
  const splitAt = sections[1]?.index;
  if (splitAt === undefined) return { opening: markdown, remainder: "" };
  return { opening: markdown.slice(0, splitAt), remainder: markdown.slice(splitAt) };
}

export default async function InsightPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const { opening, remainder } = splitOpeningSection(post.content);
  const [openingHtml, remainderHtml, headings] = await Promise.all([
    markdownToHtml(opening),
    markdownToHtml(remainder),
    Promise.resolve(getHeadings(post.content)),
  ]);
  const url = `${SITE_URL}/insights/${post.slug}`;
  const cover = getArticleCover(post.slug);
  const image = `${SITE_URL}${cover.src}`;
  const wordCount = post.content.trim().split(/\s+/).filter(Boolean).length;
  const faq = getFaq(post.content);
  const related = getAllPosts().filter((item) => item.slug !== post.slug).slice(0, 3);
  const articleSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        url,
        headline: post.title,
        description: post.description,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        image: { "@type": "ImageObject", url: image, caption: cover.alt },
        author: { "@id": "https://vulnix.dev/#organization" },
        publisher: { "@id": "https://vulnix.dev/#organization" },
        isPartOf: { "@id": `${SITE_URL}/#blog` },
        articleSection: post.topic,
        inLanguage: "en-US",
        wordCount,
        keywords: post.keywords.join(", "),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Vulnix Blog", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: post.topic, item: `${SITE_URL}/#${post.topic.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
      ...(faq.length
        ? [
            {
              "@type": "FAQPage",
              "@id": `${url}#faq`,
              mainEntity: faq.map(({ question, answer }) => ({
                "@type": "Question",
                name: question,
                acceptedAnswer: { "@type": "Answer", text: answer },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      {/* 1280px less 48px gutters = the 1184px between the frame lines. The
          reading column and the contents rail share one grid from lg up. */}
      <div className="mx-auto max-w-[1280px] px-5 pt-32 pb-20 md:px-12 md:pt-40 md:pb-28">
        <div className="mx-auto grid max-w-[720px] grid-cols-1 lg:max-w-none lg:grid-cols-[minmax(0,720px)_200px] lg:justify-center lg:gap-x-16">
          <header className="flex flex-col items-start">
            <Link
              href="/"
              className="group/back mb-10 flex items-center gap-1.5 text-[14px] font-medium text-mk-fg/60 transition-colors hover:text-mk-fg"
            >
              <ArrowLeft aria-hidden className="size-4 transition-transform duration-300 group-hover/back:-translate-x-0.5" strokeWidth={2} />
              All articles
            </Link>
            <p className="text-[12px] leading-[14.4px] font-semibold tracking-[1.08px] text-[#fe4202] uppercase">{post.topic}</p>
            <h1 className="mt-4 font-[family-name:var(--font-marketing-heading)] text-[34px] leading-[1.1] font-medium tracking-[-1.2px] text-balance text-mk-fg md:text-[48px] md:tracking-[-1.9px]">
              {post.title}
            </h1>
            <p className="mt-5 text-[17px] leading-[1.55] text-pretty text-mk-fg/70 md:text-[18px]">{post.description}</p>
            <p className="mt-6 flex flex-wrap gap-x-2 text-[14px] text-mk-fg/50">
              <span>By Vulnix Team</span>
              <span aria-hidden>·</span>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              <span aria-hidden>·</span>
              <span>{post.readingTime} min read</span>
            </p>
          </header>

          <article className="prose mt-12 lg:col-start-1">
            <div dangerouslySetInnerHTML={{ __html: openingHtml }} />
            <figure className="article-figure">
              <Image src={cover.src} alt={cover.alt} width={COVER_WIDTH} height={COVER_HEIGHT} loading="eager" sizes="(max-width: 767px) calc(100vw - 40px), 720px" />
            </figure>
            <div dangerouslySetInnerHTML={{ __html: remainderHtml }} />
            <ReducedMotionMedia />
          </article>
          <div className="hidden lg:col-start-2 lg:row-start-2 lg:mt-12 lg:block">
            <ArticleToc headings={headings} />
          </div>
        </div>
      </div>

      <section className="bg-mk-page pb-8 md:pb-16">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-[10px] md:px-12">
          <div className="flex flex-wrap items-end justify-between gap-4 px-[10px] md:px-0">
            <h2 className="font-[family-name:var(--font-marketing-heading)] text-[32px] leading-[32px] font-medium tracking-[-1.28px] text-mk-fg md:text-[40px] md:leading-[40px] md:tracking-[-1.6px]">
              Continue reading
            </h2>
            <Link href="/" className="group/link text-mk-fg">
              <LineLink label="All articles" tone="light" />
            </Link>
          </div>
          <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${related.length > 2 ? "lg:grid-cols-3" : ""}`}>
            {related.map((item) => (
              <ArticleCard key={item.slug} post={item} headingLevel={3} />
            ))}
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    </>
  );
}
