import { ArticleCatalog } from "@/components/article-catalog";
import { BlogAmbientField } from "@/components/blog-ambient-field";
import { getAllPosts } from "@/lib/posts";

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <section className="blog-index">
      <BlogAmbientField />
      <header className="blog-index-title"><h1>Blog</h1></header>
      <ArticleCatalog posts={posts} />
    </section>
  );
}
