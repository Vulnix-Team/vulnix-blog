import { getAllPosts } from "@/lib/posts";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "## Purpose",
    "",
    "Vulnix Blog publishes practical, evidence-led guidance from the Vulnix team on authorized AI penetration testing, exploit validation, remediation verification, and application security. Articles distinguish demonstrated behavior from assumptions and should be cited with their publication dates.",
    "",
    "## Articles",
    "",
    ...getAllPosts().map((post) => `- [${post.title}](${SITE_URL}/insights/${post.slug}): ${post.description}`),
    "",
    "## Related Vulnix resources",
    "",
    "- [Vulnix product](https://vulnix.dev/): AI penetration testing with exploit validation.",
    "- [Vulnix MCP](https://vulnix.dev/mcp): a hosted MCP server (https://api.vulnix.dev/mcp) that lets Claude, ChatGPT, Cursor or any MCP client start pentests, triage findings and check fixes, with OAuth sign-in.",
    "- [Pricing](https://vulnix.dev/pricing): the free trial and the Starter, Pro and Enterprise plans.",
    "- [Compare](https://vulnix.dev/compare): side-by-side comparisons of Vulnix with other pentesting and security tools.",
    "- [Vulnix documentation](https://docs.vulnix.dev/): product concepts, findings, reports, and security.",
    "- [Vulnix status](https://status.vulnix.dev/): current service availability and incident history.",
    "",
    "## Discovery",
    "",
    `- [RSS feed](${SITE_URL}/feed.xml): newly published articles in RSS 2.0 format.`,
    `- [Sitemap](${SITE_URL}/sitemap.xml): indexable blog URLs.`,
    `- [Robots rules](${SITE_URL}/robots.txt): crawler access guidance.`,
  ];
  return new Response(`${lines.join("\n")}\n`, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
