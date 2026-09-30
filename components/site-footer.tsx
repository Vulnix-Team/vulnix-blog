"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Strands from "@/components/effects/Strands";
import { DOCS_SITE as DOCS, MAIN_SITE } from "@/lib/site";
import { useLowPowerMode } from "@/lib/use-low-power-mode";
import { useMediaQuery } from "@/lib/use-media-query";

// Mirrors the reference's footer: a closing call to action over a full-bleed
// scene, and a cream card rising over the scene with the link columns and a
// credit bar (logo, copyright, socials). The reference's scene is a looping
// 3D video; ours is the same strands as the hero, on an ember glow.

// Port of the product's marketing footer
// (product/apps/web/components/marketing/site-footer.tsx). Product pages link
// to vulnix.dev; the Blog column links within this site.

// The first five of the product's COMPARISONS (lib/marketing/comparisons.ts).
const COMPETITORS = [
  { slug: "xbow", name: "XBOW" },
  { slug: "penligent", name: "Penligent" },
  { slug: "depthfirst", name: "depthfirst" },
  { slug: "cobalt", name: "Cobalt" },
  { slug: "astra", name: "Astra Security" },
];

type FooterLink = { label: string; href: string };
type Column = { title: string; links: FooterLink[]; className?: string };

const COLUMNS: Column[] = [
  {
    title: "Product",
    links: [
      { label: "What it does", href: `${DOCS}/getting-started` },
      { label: "Blackbox & whitebox", href: `${DOCS}/concepts/blackbox-vs-whitebox` },
      { label: "PR reviews", href: `${DOCS}/integrations/github` },
      { label: "Findings & reports", href: `${DOCS}/findings-and-reports` },
      { label: "Vulnix MCP", href: `${MAIN_SITE}/mcp` },
      { label: "Pricing", href: `${MAIN_SITE}/pricing` },
    ],
  },
  {
    title: "Compare",
    links: [
      ...COMPETITORS.map((competitor) => ({
        label: `Vulnix vs ${competitor.name}`,
        href: `${MAIN_SITE}/compare/${competitor.slug}`,
      })),
      { label: "All comparisons", href: `${MAIN_SITE}/compare` },
    ],
  },
  {
    title: "Blog",
    links: [
      { label: "How to validate a security fix", href: "/insights/how-to-validate-a-security-fix" },
      { label: "AI pentesting vs. scanning", href: "/insights/ai-pentesting-vs-vulnerability-scanning" },
      { label: "All articles", href: "/" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: DOCS },
      { label: "API reference", href: `${DOCS}/api/getting-started` },
      { label: "Security & trust", href: `${DOCS}/security-and-trust` },
      { label: "FAQ", href: `${DOCS}/faq` },
      { label: "System status", href: "https://status.vulnix.dev" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact sales", href: "mailto:hello@vulnix.dev" },
      { label: "Support", href: "mailto:support@vulnix.dev" },
      { label: "Log in", href: `${MAIN_SITE}/login` },
      { label: "Start a scoped trial", href: `${MAIN_SITE}/signup` },
    ],
  },
  {
    // Under Company, as the reference stacks Legal in its last column.
    title: "Legal",
    className: "lg:col-start-5",
    links: [
      { label: "Privacy policy", href: `${MAIN_SITE}/privacy-policy` },
      { label: "Terms and conditions", href: `${MAIN_SITE}/terms-and-conditions` },
    ],
  },
];

const SOCIALS = [
  {
    label: "X",
    href: "https://x.com/vulnix_dev",
    path: "M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/vulnix-dev",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "GitHub",
    href: "https://github.com/Vulnix-Team",
    path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  },
];

const BUTTON =
  "group flex h-[42px] items-center gap-2 rounded-[12px] px-4 font-[family-name:var(--font-marketing-body)] text-[16px] leading-6 font-medium tracking-[-0.16px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fe4202]";

// The reference's button arrow: slides out on hover as a fresh one slides in.
function ButtonArrow() {
  return (
    <span aria-hidden className="relative size-4 overflow-hidden">
      <ArrowRight className="absolute inset-0 size-4 transition-transform duration-300 ease-out group-hover:translate-x-4" strokeWidth={2} />
      <ArrowRight className="absolute inset-0 size-4 -translate-x-4 transition-transform duration-300 ease-out group-hover:translate-x-0" strokeWidth={2} />
    </span>
  );
}

function FooterAnchor({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  // Internal routes go through next/link; docs, blog, status and mail don't.
  return href.startsWith("/") ? (
    <Link prefetch={false} href={href} className={className}>
      {children}
    </Link>
  ) : (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

export function SiteFooter() {
  const reducedMotion = useLowPowerMode();
  // A live WebGL canvas - desktop only, as in the hero.
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <footer className="relative flex flex-col overflow-clip bg-mk-page text-mk-fg">
      {/* Hangs over the scene: the negative margin lets the glow rise
          behind the buttons instead of starting under them. */}
      <div className="relative z-10 -mb-24 flex flex-col items-center px-7 pt-12 text-center md:-mb-12 md:pt-20">
        <h2 className="mb-4 max-w-[448px] font-[family-name:var(--font-marketing-heading)] text-[32px] leading-[35.2px] font-medium tracking-[-0.64px] text-balance md:max-w-[640px] md:text-[44px] md:leading-[48.4px] md:tracking-[-0.88px]">
          Find what an attacker would, before they do
        </h2>
        <p className="mb-4 max-w-[320px] font-[family-name:var(--font-marketing-body)] text-[16px] leading-[22.4px] text-mk-fg/80 md:max-w-none">
          Start with a scoped trial. No credit card required.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Link prefetch={false} href={`${MAIN_SITE}/signup`} className={`${BUTTON} bg-mk-fg text-mk-page hover:bg-mk-fg/85`}>
            Start a scoped trial
            <ButtonArrow />
          </Link>
          <Link
            prefetch={false}
            href={`${MAIN_SITE}/login`}
            className={`${BUTTON} border border-mk-fg/25 text-mk-fg hover:border-mk-fg/50 hover:bg-mk-fg/[0.06]`}
          >
            Try a demo
            <ButtonArrow />
          </Link>
        </div>
      </div>

      <div className="relative flex flex-col">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {/* Ember glow under the scene - all phones and reduced motion get. */}
          <div className="absolute inset-x-0 top-0 h-[640px] bg-[radial-gradient(60%_55%_at_50%_45%,rgba(254,66,2,0.28),rgba(254,66,2,0.08)_55%,transparent_80%)]" />
          {isDesktop && !reducedMotion && (
            // `screen` and the top/bottom mask: see the hero's strands.
            // Lifted 96px so the strands sit nearer the buttons than the card.
            <div className="absolute inset-x-0 -top-24 h-[640px] mix-blend-screen [mask-image:linear-gradient(transparent,black_25%,black_70%,transparent)]">
              <Strands
                className="h-full w-full"
                colors={["#f39c7e", "#fe4202", "#6b2913"]}
                count={3}
                speed={0.4}
                amplitude={1}
                waviness={1}
                thickness={0.7}
                glow={2.6}
                taper={3}
                spread={1}
                intensity={0.6}
                saturation={1.5}
                opacity={0.85}
                scale={1.5}
              />
            </div>
          )}
        </div>

        {/* The scene's open stretch between the call to action and the card. */}
        <div className="relative min-h-[19rem] pt-[24%] md:min-h-[24rem]" />

        {/* Measured on the reference: the card is 95% of the page up to
            1280px, padded and rounded 28px on phones, 40px on tablets and
            48px from 992px. */}
        <div className="relative mx-auto w-[95%] max-w-[1280px]">
          <div className="flex flex-col gap-12 rounded-t-[28px] bg-mk-surface px-7 pt-7 text-[#0e1815] md:gap-16 md:rounded-t-[40px] md:px-10 md:pt-10 lg:rounded-t-[48px] lg:px-12 lg:pt-12">
            <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-3 md:gap-y-8 lg:grid-cols-5 lg:gap-x-10 lg:gap-y-6">
              {COLUMNS.map((column) => (
                <div key={column.title} className={`flex flex-col gap-4 ${column.className ?? ""}`}>
                  <h3 className="font-[family-name:var(--font-marketing-body)] text-[12px] leading-[13.2px] font-semibold tracking-[1.44px] uppercase">
                    {column.title}
                  </h3>
                  <ul className="flex flex-col gap-[10px]">
                    {column.links.map((link) => (
                      <li key={link.label} className="leading-[1.1]">
                        <FooterAnchor
                          href={link.href}
                          className="font-[family-name:var(--font-marketing-body)] text-[14px] text-[#0e1815]/65 transition-colors duration-100 hover:text-[#0e1815] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fe4202]"
                        >
                          {link.label}
                        </FooterAnchor>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>

            <div className="grid grid-cols-1 items-center justify-items-center gap-6 border-t border-[#d1cdc7]/50 py-8 md:grid-cols-[1fr_1.75fr_1fr] md:gap-4 md:py-12">
              <Link
                prefetch={false}
                href={MAIN_SITE}
                className="w-32 md:justify-self-start focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fe4202]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- static SVG wordmark */}
                <img src="/vulnix-logo.svg" alt="Vulnix" loading="lazy" className="w-full" />
              </Link>
              <p className="font-[family-name:var(--font-marketing-body)] text-[16px] leading-[22.4px]">
                © {new Date().getFullYear()} Vulnix
              </p>
              <ul className="flex gap-2 md:justify-self-end">
                {SOCIALS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex size-10 items-center justify-center rounded-[10px] bg-[#d1cdc7] transition-colors hover:bg-[#c4bfb8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fe4202]"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden className="size-5 fill-current">
                        <path d={social.path} />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
