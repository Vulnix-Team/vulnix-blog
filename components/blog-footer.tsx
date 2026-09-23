import { Bug, FileText, Radar, Wrench } from "lucide-react";
import Image from "next/image";

import { DOCS_SITE, MAIN_SITE } from "@/lib/site";

const engines = [
  { icon: Radar, label: "Recon" },
  { icon: Bug, label: "Exploit" },
  { icon: Wrench, label: "Validate-Fix" },
  { icon: FileText, label: "Report" },
];

const columns = [
  { heading: "Product", links: [
    { label: "Platform preview", href: `${MAIN_SITE}/#product-preview` },
    { label: "How it works", href: `${MAIN_SITE}/#how-it-works` },
    { label: "Pricing", href: `${MAIN_SITE}/pricing` },
  ] },
  { heading: "Resources", links: [
    { label: "Blog", href: "/" },
    { label: "Docs", href: DOCS_SITE },
    { label: "Status", href: "https://status.vulnix.dev" },
    { label: "Contact", href: "mailto:hello@vulnix.dev" },
  ] },
  { heading: "Get started", links: [
    { label: "Start a scoped trial", href: `${MAIN_SITE}/signup` },
    { label: "Log in", href: `${MAIN_SITE}/login` },
  ] },
];

const socialLinks = [
  { label: "X", slug: "x", href: "https://x.com/vulnix_dev" },
  { label: "LinkedIn", slug: "linkedin", href: "https://www.linkedin.com/company/vulnix-dev" },
  { label: "GitHub", slug: "github", href: "https://github.com/vulnixdev" },
];

export function BlogFooter() {
  return (
    <footer className="blog-footer">
      <div className="footer-top">
        <div className="footer-signoff">
          {/* eslint-disable-next-line @next/next/no-img-element -- canonical brand wordmark */}
          <img src="/vulnix-logo.svg" alt="Vulnix" />
          <p>Agentic pentesting that finds the gaps, proves the exploit, and tracks the fix.</p>
          <div className="engine-group">
            <span className="footer-label">The engines we run</span>
            <div className="engine-list">
              {engines.map(({ icon: Icon, label }) => <span key={label}><Icon aria-hidden size={14} strokeWidth={1.7} />{label}</span>)}
            </div>
          </div>
        </div>
        <div className="footer-links">
          {columns.map((column) => <div key={column.heading}><h3>{column.heading}</h3>{column.links.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}</div>)}
          <div><h3>Social</h3>{socialLinks.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noreferrer"><Image src={`/social/${link.slug}.svg`} alt="" width={14} height={14} />{link.label}</a>)}</div>
        </div>
      </div>
      <div className="footer-bottom"><span>&copy; {new Date().getFullYear()} Vulnix. All rights reserved.</span><div><a href={`${MAIN_SITE}/privacy-policy`}>Privacy</a><a href={`${MAIN_SITE}/terms-and-conditions`}>Terms</a><a className="status-link" href="https://status.vulnix.dev">System status</a></div></div>
    </footer>
  );
}
