type ArticleCover = {
  src: string;
  alt: string;
};

const covers: Record<string, ArticleCover> = {
  "ai-pentesting-vs-vulnerability-scanning": {
    src: "/illustrations/ai-pentesting-vs-scanning-cover.webp",
    alt: "Abstract Vulnix paths converging from scanning to verified exploitation",
  },
  "how-to-validate-a-security-fix": {
    src: "/illustrations/validate-fix-cover.webp",
    alt: "Abstract Vulnix proof loop for security-fix validation",
  },
};

export function getArticleCover(slug: string): ArticleCover {
  return covers[slug] ?? covers["ai-pentesting-vs-vulnerability-scanning"];
}
