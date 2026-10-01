// Covers are rendered from blog/motion/src/covers (npm run render -- covers):
// a 1600x800 image for cards and the article, and a 1200x630 link preview.
export const COVER_WIDTH = 1600;
export const COVER_HEIGHT = 800;

type ArticleCover = {
  src: string;
  og: string;
  alt: string;
};

const ALT: Record<string, string> = {
  "ai-pentesting-vs-vulnerability-scanning":
    "Dot, the Vulnix character, carries one proven finding on its head while a scanner prints a long receipt of question marks",
  "can-coding-agents-replace-a-pentest":
    "A friendly sparring match in a boxing ring: a coding-agent robot throws a jab, Dot, the Vulnix character, hops clear of it with a wink, and a second robot holds up a Round 1 card",
  "how-to-validate-a-security-fix":
    "Dot, the Vulnix character, bounces off a brick wall whose crack is sealed in orange, with a 403 tag above",
};

const FALLBACK = "ai-pentesting-vs-vulnerability-scanning";

export function getArticleCover(slug: string): ArticleCover {
  const key = slug in ALT ? slug : FALLBACK;
  return {
    src: `/illustrations/covers/${key}.webp`,
    og: `/illustrations/covers/${key}-og.png`,
    alt: ALT[key],
  };
}
