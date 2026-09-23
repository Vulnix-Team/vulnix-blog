import { ArticleCatalog } from "@/components/article-catalog";
import { getAllPosts } from "@/lib/posts";

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <section className="blog-index">
      <header className="blog-index-title"><h1>Vulnix Blog</h1></header>
      <ArticleCatalog posts={posts} />
    </section>
  );
}
