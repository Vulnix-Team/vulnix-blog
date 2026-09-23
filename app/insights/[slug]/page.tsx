import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatDate } from "@/lib/format";
import { getArticleCover } from "@/lib/article-cover";
import { ArticleCard } from "@/components/article-card";
import { ArticleToc } from "@/components/article-toc";
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
  const image = `${SITE_URL}${cover.src}`;
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: post.title, description: post.description, publishedTime: post.publishedAt, modifiedTime: post.updatedAt, authors: ["Vulnix Team"], images: [{ url: image, alt: cover.alt }] },
    twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [image] },
  };
}

function getHeadings(markdown: string) {
  return [...markdown.matchAll(/^##\s+(.+)$/gm)].map((match) => ({
    text: match[1],
    id: match[1].toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  }));
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

  return (
    <>
      <section className="article-header">
        <div className="article-heading-wrap">
          <Link href="/" className="back-link">← All articles</Link>
          <h1>{post.title}</h1>
          <p className="article-dek">{post.description}</p>
          <div className="article-meta"><span>{post.topic}</span><span>By Vulnix Team</span><span>{formatDate(post.publishedAt)}</span><span>{post.readingTime} min read</span></div>
        </div>
      </section>

      <article className="article-layout">
        <div className="article-body prose">
          <div dangerouslySetInnerHTML={{ __html: openingHtml }} />
          <figure className="article-inline-cover">
            <Image src={cover.src} alt={cover.alt} width={1672} height={941} sizes="(max-width: 820px) calc(100vw - 48px), 720px" />
          </figure>
          <div dangerouslySetInnerHTML={{ __html: remainderHtml }} />
        </div>
        <ArticleToc headings={headings} />
      </article>

      <section className="related-section">
        <div className="related-heading"><h2>Continue reading</h2><Link href="/" className="read-link">See all articles <b aria-hidden>↗</b></Link></div>
        <div className="related-grid">
          {getAllPosts().filter((item) => item.slug !== post.slug).slice(0, 3).map((item) => <ArticleCard key={item.slug} post={item} related />)}
        </div>
      </section>

      <section className="article-cta">
        <h2>Test your real attack surface.</h2>
        <p>Vulnix connects evidence, remediation, and verification in one continuous testing loop.</p>
        <a className="cta-link" href={`${MAIN_SITE}/signup`}>Start a scoped trial <span aria-hidden>↗</span></a>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.description,
        datePublished: post.publishedAt, dateModified: post.updatedAt, mainEntityOfPage: url, image: `${SITE_URL}${cover.src}`,
        author: { "@type": "Organization", name: "Vulnix Team", url: MAIN_SITE },
        publisher: { "@id": "https://vulnix.dev/#organization" }, isPartOf: { "@id": `${SITE_URL}/#blog` }, keywords: post.keywords.join(", "),
      }) }} />
    </>
  );
}
