"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Activity,
  Brain,
  ChevronDown,
  Compass,
  Mail,
  Radar,
  ShieldCheck,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

import { DOCS_SITE, MAIN_SITE } from "@/lib/site";

// Port of the product's marketing header
// (product/apps/web/components/marketing/site-header.tsx). Differences: links
// point at vulnix.dev, "Blog" is this site, and there is no announcement strip
// or theme toggle (the blog is dark only for now).

const EASE = "cubic-bezier(0.22,1,0.36,1)";

type MenuItem = { icon: LucideIcon; title: string; href: string; external?: boolean };

const productGroups: { heading: string; items: MenuItem[] }[] = [
  {
    heading: "The platform",
    items: [
      { icon: Compass, title: "What it does", href: `${DOCS_SITE}/getting-started` },
      { icon: Radar, title: "Blackbox & whitebox", href: `${DOCS_SITE}/concepts/blackbox-vs-whitebox` },
    ],
  },
  {
    heading: "Proof",
    items: [
      { icon: Brain, title: "Findings & reports", href: `${DOCS_SITE}/findings-and-reports` },
      { icon: ShieldCheck, title: "Security & trust", href: `${DOCS_SITE}/security-and-trust` },
    ],
  },
  {
    heading: "Get started",
    items: [
      { icon: UserPlus, title: "Sign up", href: `${MAIN_SITE}/signup` },
      { icon: Activity, title: "Status", href: "https://status.vulnix.dev", external: true },
      { icon: Mail, title: "Contact", href: "mailto:hello@vulnix.dev", external: true },
    ],
  },
];

const navLinks = [
  { label: "Pricing", href: `${MAIN_SITE}/pricing` },
  { label: "Compare", href: `${MAIN_SITE}/compare` },
  { label: "MCP", href: `${MAIN_SITE}/mcp` },
  { label: "Docs", href: DOCS_SITE },
  { label: "Blog", href: "/" },
];

// The demo button lives on the product's /login page.
const DEMO_HREF = `${MAIN_SITE}/login`;

const BUTTON =
  "flex h-[38px] shrink-0 items-center justify-center rounded-[12px] border-[0.8px] border-transparent px-4 py-2 font-[family-name:var(--font-marketing-body)] text-[13.92px] font-medium tracking-[-0.01em] transition-colors";
const BUTTON_SECONDARY = `${BUTTON} bg-mk-fg/[0.08] text-mk-fg hover:bg-mk-fg/[0.14]`;
const BUTTON_PRIMARY = `${BUTTON} bg-[#fe4202] text-black hover:bg-[#ff5a24]`;

function MenuLink({ item, onNavigate }: { item: MenuItem; onNavigate: () => void }) {
  const Icon = item.icon;
  return (
    <Link
      prefetch={false}
      href={item.href}
      target={item.external && item.href.startsWith("http") ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      onClick={onNavigate}
      className="group/item flex items-center gap-2 py-[5px]"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-[8px] border-[0.8px] border-mk-fg/[0.08] bg-mk-fg/[0.06] text-mk-fg/80 transition-colors group-hover/item:border-[#fe4202]/40 group-hover/item:text-[#fe4202]">
        <Icon size={18} strokeWidth={1.75} />
      </span>
      <span className="font-[family-name:var(--font-marketing-body)] text-[14px] leading-[19.6px] font-[550] tracking-[-0.14px] text-mk-fg transition-opacity group-hover/item:opacity-70">
        {item.title}
      </span>
    </Link>
  );
}

function GroupHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-[family-name:var(--font-marketing-body)] text-[10px] leading-3 font-semibold tracking-[0.8px] text-mk-fg/45 uppercase">
      {children}
    </p>
  );
}

// The Product menu's featured card: Vulnix MCP, with a tray of AI-app logos
// floating above the label.
const MCP_CLIENTS = [
  { name: "Claude", src: "/marketing/agents/claude.svg" },
  { name: "ChatGPT", src: "/marketing/agents/openai.svg" },
  { name: "Cursor", src: "/marketing/agents/cursor.svg" },
];

function FeatureCard({ onNavigate }: { onNavigate: () => void }) {
  return (
    <Link
      prefetch={false}
      href={`${MAIN_SITE}/mcp`}
      onClick={onNavigate}
      className="group/card relative flex h-[224px] w-[295px] shrink-0 flex-col justify-end overflow-hidden rounded-[16px] bg-[linear-gradient(160deg,#fe4202_0%,#a82a00_55%,#3d1000_100%)] p-4"
    >
      <div
        aria-hidden
        className="absolute inset-x-4 top-5 flex justify-center gap-2 rounded-[14px] border-[0.8px] border-white/25 bg-white/15 p-2.5 backdrop-blur-sm transition-transform duration-500 group-hover/card:-translate-y-1"
        style={{ transitionTimingFunction: EASE }}
      >
        {MCP_CLIENTS.map((client) => (
          <span
            key={client.name}
            className="flex size-12 items-center justify-center rounded-[10px] bg-white shadow-[0_4px_10px_-6px_rgba(0,0,0,0.5)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={client.src} alt="" width={24} height={24} className="size-6" />
          </span>
        ))}
      </div>
      <p className="mb-0.5 font-[family-name:var(--font-marketing-body)] text-[12px] leading-[14.4px] font-semibold tracking-[1.08px] text-white uppercase">
        Vulnix MCP
      </p>
      <p className="font-[family-name:var(--font-marketing-body)] text-[16px] leading-[19.2px] font-medium text-white">
        Run your pentests from the AI tools you already use
      </p>
    </Link>
  );
}

export function SiteHeader() {
  const [productOpen, setProductOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeAll = () => {
    setProductOpen(false);
    setMobileOpen(false);
  };

  // Hover only for a real mouse: on a touch screen a tap fires pointerenter
  // and then click, so hover-open followed by click-toggle would shut the
  // panel the instant it opened.
  const openProduct = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setProductOpen(true);
  };
  const scheduleClose = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setProductOpen(false), 120);
  };

  useEffect(() => {
    if (!productOpen && !mobileOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") closeAll();
    }
    function onPointer(event: MouseEvent) {
      if (!headerRef.current?.contains(event.target as Node)) closeAll();
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [productOpen, mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const scrollY = window.scrollY;
    const previous = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    const desktop = window.matchMedia("(min-width: 768px)");
    const onDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileOpen(false);
    };
    desktop.addEventListener("change", onDesktop);
    return () => {
      desktop.removeEventListener("change", onDesktop);
      Object.assign(document.body.style, previous);
      window.scrollTo(0, scrollY);
    };
  }, [mobileOpen]);

  const expanded = productOpen || mobileOpen;

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 mx-auto flex w-[calc(100%-20px)] flex-col md:w-[95%]"
    >
      {expanded ? (
        <div aria-hidden className="fixed inset-0 -z-10 bg-black/30 md:bg-black/20" onClick={closeAll} />
      ) : null}

      {/* One opaque surface for both the bar and its dropdown: the panel grows
          out of the bar instead of floating beneath it. */}
      <div className="overflow-hidden rounded-b-[24px] border-x-[0.8px] border-b-[0.8px] border-mk-fg/10 bg-mk-page shadow-[0px_24px_60px_-24px_rgba(0,0,0,0.6)]">
        <nav
          className={`grid grid-cols-[1fr_auto] items-center border-b-[0.8px] px-4 pt-[7.52px] pb-[8.48px] transition-colors duration-[250ms] md:grid-cols-[auto_1fr_auto] md:px-6 ${expanded ? "border-mk-fg/10" : "border-transparent"}`}
        >
          <Link prefetch={false} href={MAIN_SITE} onClick={closeAll} className="flex h-[42px] items-center">
            {/* eslint-disable-next-line @next/next/no-img-element -- brand logo, not an optimizable content image */}
            <img src="/vulnix-logo.svg" alt="Vulnix" loading="eager" className="h-[18px] w-auto" />
          </Link>

          <ul className="ml-[17px] hidden items-center md:flex">
            <li onPointerEnter={openProduct} onPointerLeave={scheduleClose}>
              <button
                type="button"
                aria-expanded={productOpen}
                aria-controls="product-panel"
                onClick={() => setProductOpen((open) => !open)}
                className={`flex items-center gap-1 px-2 py-[10.4px] font-[family-name:var(--font-marketing-body)] text-[16px] leading-[21px] transition-colors ${productOpen ? "text-mk-fg/50" : "text-mk-fg hover:text-mk-fg/50"}`}
              >
                Product
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${productOpen ? "rotate-180" : ""}`}
                />
              </button>
            </li>
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  prefetch={false}
                  href={link.href}
                  className="block px-2 py-[10.4px] font-[family-name:var(--font-marketing-body)] text-[16px] leading-[21px] text-mk-fg transition-colors hover:text-mk-fg/50"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-self-end gap-2">
            <Link
              prefetch={false}
              href={`${MAIN_SITE}/login`}
              className="hidden px-3 font-[family-name:var(--font-marketing-body)] text-[12.8px] leading-8 font-medium text-mk-fg transition-opacity hover:opacity-70 md:block"
            >
              Log in
            </Link>
            <Link prefetch={false} href={DEMO_HREF} className={BUTTON_SECONDARY}>
              Try a demo
            </Link>
            <Link prefetch={false} href={`${MAIN_SITE}/signup`} className={`${BUTTON_PRIMARY} hidden md:flex`}>
              Start free trial
            </Link>
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
              className="flex size-[38px] items-center justify-center rounded-[12px] bg-mk-fg/[0.08] text-mk-fg md:hidden"
            >
              <span className="relative flex h-3 w-4 flex-col justify-between">
                <span className={`block h-[1.5px] w-full bg-current transition-transform duration-300 ${mobileOpen ? "translate-y-[5.25px] rotate-45" : ""}`} />
                <span className={`block h-[1.5px] w-full bg-current transition-opacity duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
                <span className={`block h-[1.5px] w-full bg-current transition-transform duration-300 ${mobileOpen ? "-translate-y-[5.25px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </nav>

        {/* Desktop mega panel. grid-rows 0fr -> 1fr animates to the content's
            own height; `invisible` keeps closed links out of the tab order. */}
        <div
          id="product-panel"
          onPointerEnter={openProduct}
          onPointerLeave={scheduleClose}
          aria-hidden={!productOpen}
          className={`hidden transition-[grid-template-rows,opacity] duration-[250ms] md:grid ${productOpen ? "opacity-100" : "invisible opacity-0"}`}
          style={{ gridTemplateRows: productOpen ? "1fr" : "0fr", transitionTimingFunction: EASE }}
        >
          <div className="overflow-hidden">
            <div className="flex px-[22px] pt-[22px] pb-6">
              {productGroups.map((group) => (
                <div key={group.heading} className="flex w-[216px] flex-col gap-2.5">
                  <GroupHeading>{group.heading}</GroupHeading>
                  <div className="flex flex-col">
                    {group.items.map((item) => (
                      <MenuLink key={item.title} item={item} onNavigate={closeAll} />
                    ))}
                  </div>
                </div>
              ))}
              <div className="ml-auto">
                <FeatureCard onNavigate={closeAll} />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu: the same surface, grown to fill the screen. */}
        <div
          aria-hidden={!mobileOpen}
          className={`grid transition-[grid-template-rows,opacity] duration-[250ms] md:hidden ${mobileOpen ? "opacity-100" : "invisible opacity-0"}`}
          style={{ gridTemplateRows: mobileOpen ? "1fr" : "0fr", transitionTimingFunction: EASE }}
        >
          <div className="overflow-hidden">
            <div className="flex max-h-[calc(100dvh-80px)] flex-col gap-6 overflow-y-auto px-5 pt-5 pb-5">
              {productGroups.map((group) => (
                <div key={group.heading} className="flex flex-col gap-2.5">
                  <GroupHeading>{group.heading}</GroupHeading>
                  <div className="flex flex-col">
                    {group.items.map((item) => (
                      <MenuLink key={item.title} item={item} onNavigate={closeAll} />
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex flex-col gap-2.5">
                <GroupHeading>More</GroupHeading>
                <div className="flex flex-col">
                  {navLinks.map((link) => (
                    <Link
                      prefetch={false}
                      key={link.label}
                      href={link.href}
                      onClick={closeAll}
                      className="py-2 font-[family-name:var(--font-marketing-body)] text-[16px] text-mk-fg"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 border-t-[0.8px] border-mk-fg/10 pt-4">
                <Link prefetch={false} href={`${MAIN_SITE}/signup`} onClick={closeAll} className={`${BUTTON_PRIMARY} w-full`}>
                  Start free trial
                </Link>
                <Link prefetch={false} href={`${MAIN_SITE}/login`} onClick={closeAll} className={`${BUTTON_SECONDARY} w-full`}>
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
