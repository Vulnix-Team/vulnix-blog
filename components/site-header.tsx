"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ProductMenu } from "@/components/product-menu";
import { MarketingCtaLink, MARKETING_CTA_OUTLINE } from "@/components/marketing-cta";
import { DOCS_SITE, MAIN_SITE } from "@/lib/site";

const EASE = "cubic-bezier(0.22,1,0.36,1)";

const navLinks = [
  { label: "Pricing", href: `${MAIN_SITE}/pricing` },
  { label: "Compare", href: `${MAIN_SITE}/compare` },
  { label: "Docs", href: DOCS_SITE },
  { label: "Blog", href: "/", current: true },
];

/** Standalone-repository port of the product marketing SiteHeader. */
export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const scrollY = window.scrollY;
    const previous = { overflow: document.body.style.overflow, position: document.body.style.position, top: document.body.style.top, width: document.body.style.width };
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setMobileMenuOpen(false); };
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = (event: MediaQueryListEvent) => { if (event.matches) setMobileMenuOpen(false); };
    document.addEventListener("keydown", closeOnEscape);
    desktopQuery.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      desktopQuery.removeEventListener("change", closeOnDesktop);
      Object.assign(document.body.style, previous);
      window.scrollTo(0, scrollY);
    };
  }, [mobileMenuOpen]);

  return (
    <header className="site-header">
      {mobileMenuOpen ? <button type="button" className="mobile-menu-scrim" aria-label="Close menu" onClick={() => setMobileMenuOpen(false)} /> : null}
      <div className="nav-shell" style={{ transitionTimingFunction: EASE }}>
        <Link prefetch={false} href="/" className="brand" aria-label="Vulnix Blog home">
          {/* eslint-disable-next-line @next/next/no-img-element -- canonical brand asset */}
          <img src="/vulnix-logo.svg" alt="Vulnix" loading="eager" />
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <ProductMenu />
          {navLinks.map((link) => link.current ? <Link prefetch={false} key={link.label} href={link.href} className="current">{link.label}</Link> : <a key={link.label} href={link.href}>{link.label}</a>)}
        </nav>
        <div className="desktop-actions">
          <MarketingCtaLink href={`${MAIN_SITE}/login`} className={`nav-button ${MARKETING_CTA_OUTLINE.dark}`}>Log In</MarketingCtaLink>
          <MarketingCtaLink href={`${MAIN_SITE}/signup`} className={`nav-button ${MARKETING_CTA_OUTLINE.dark}`}>Try a Demo</MarketingCtaLink>
        </div>
        <button type="button" className="menu-button" aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((value) => !value)}><span><i /><i /><i /></span></button>
      </div>
      {mobileMenuOpen ? (
        <div className="mobile-menu">
          <ProductMenu inline onNavigate={() => setMobileMenuOpen(false)} />
          {navLinks.map((link) => link.current ? <Link prefetch={false} key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)}>{link.label}</Link> : <a key={link.label} href={link.href}>{link.label}</a>)}
          <div className="mobile-menu-actions"><a className={`nav-button ${MARKETING_CTA_OUTLINE.dark}`} href={`${MAIN_SITE}/login`}>Log In</a><a className={`nav-button ${MARKETING_CTA_OUTLINE.dark}`} href={`${MAIN_SITE}/signup`}>Try a Demo</a></div>
        </div>
      ) : null}
    </header>
  );
}
