import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const VIDEO_EXTENSION = /\.(webm|mp4)$/i;

function isWhitespace(node: HastNode) {
  return node.type === "text" && !node.value?.trim();
}

/**
 * Turns a paragraph holding a single Markdown image into a figure.
 *
 * `![alt](/illustrations/x.png "Caption")` becomes an image with a
 * figcaption, and the same syntax pointing at a .webm/.mp4 file becomes a
 * muted, looping, inline video - so articles stay plain Markdown (raw HTML
 * is not enabled) while still carrying looping illustrations. Videos are
 * paused for readers who prefer reduced motion (see ReducedMotionMedia).
 */
function toFigure(image: HastNode): HastNode {
  const { src, alt, title } = (image.properties ?? {}) as { src?: string; alt?: string; title?: string };
  const media: HastNode = VIDEO_EXTENSION.test(src ?? "")
    ? {
        type: "element",
        tagName: "video",
        properties: {
          src,
          autoPlay: true,
          muted: true,
          loop: true,
          playsInline: true,
          preload: "metadata",
          ariaLabel: alt,
        },
        children: [],
      }
    : { type: "element", tagName: "img", properties: { src, alt, loading: "lazy", decoding: "async" }, children: [] };

  const children = [media];
  if (title) {
    children.push({ type: "element", tagName: "figcaption", properties: {}, children: [{ type: "text", value: title }] });
  }
  return { type: "element", tagName: "figure", properties: { className: ["article-figure"] }, children };
}

function rehypeFigures() {
  const walk = (node: HastNode) => {
    node.children = node.children?.map((child) => {
      if (child.type === "element" && child.tagName === "p") {
        const content = (child.children ?? []).filter((item) => !isWhitespace(item));
        if (content.length === 1 && content[0].tagName === "img") return toFigure(content[0]);
      }
      walk(child);
      return child;
    });
  };
  return (tree: HastNode) => walk(tree);
}

export async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeFigures)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(markdown);

  return result.toString();
}
