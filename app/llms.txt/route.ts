import { getAllPosts } from "@/lib/posts";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "## Articles",
    "",
    ...getAllPosts().map((post) => `- [${post.title}](${SITE_URL}/insights/${post.slug}): ${post.description}`),
    "",
    "## Related Vulnix resources",
    "",
    "- [Vulnix product](https://vulnix.dev/): AI penetration testing with exploit validation.",
    "- [Vulnix documentation](https://docs.vulnix.dev/): product concepts, findings, reports, and security.",
  ];
  return new Response(`${lines.join("\n")}\n`, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
