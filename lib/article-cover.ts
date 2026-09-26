type ArticleCover = {
  src: string;
  alt: string;
};

const covers: Record<string, ArticleCover> = {
  "ai-pentesting-vs-vulnerability-scanning": {
    src: "/illustrations/ai-pentesting-vs-scanning-cover.webp",
    alt: "Abstract Vulnix paths converging from scanning to verified exploitation",
  },
  "can-coding-agents-replace-a-pentest": {
    src: "/illustrations/coding-agents-vs-pentest-cover.webp",
    alt: "Abstract Vulnix illustration: a code blueprint on one side, live attack paths reaching a running system on the other",
  },
  "how-to-validate-a-security-fix": {
    src: "/illustrations/validate-fix-cover.webp",
    alt: "Abstract Vulnix proof loop for security-fix validation",
  },
};

export function getArticleCover(slug: string): ArticleCover {
  return covers[slug] ?? covers["ai-pentesting-vs-vulnerability-scanning"];
}
