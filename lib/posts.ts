import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIRECTORY = path.join(process.cwd(), "content", "posts");

export type PostFrontmatter = {
  title: string;
  description: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  topic: string;
  keywords: string[];
};

export type Post = PostFrontmatter & {
  slug: string;
  content: string;
  readingTime: number;
};

function readTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function toPost(filename: string): Post {
  const slug = filename.replace(/\.md$/, "");
  const source = fs.readFileSync(path.join(POSTS_DIRECTORY, filename), "utf8");
  const { data, content } = matter(source);
  const frontmatter = data as PostFrontmatter;

  return { ...frontmatter, slug, content, readingTime: readTime(content) };
}

export function getAllPosts(): Post[] {
  return fs
    .readdirSync(POSTS_DIRECTORY)
    .filter((filename) => filename.endsWith(".md"))
    .map(toPost)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPost(slug: string): Post | undefined {
  const filename = `${slug}.md`;
  if (!fs.existsSync(path.join(POSTS_DIRECTORY, filename))) return undefined;
  return toPost(filename);
}
