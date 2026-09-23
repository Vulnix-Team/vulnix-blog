"use client";

import { Brain, ChevronDown, Compass, Radar, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { DOCS_SITE, MAIN_SITE } from "@/lib/site";

const groups = [
  { heading: "The platform", items: [
    { icon: Compass, title: "What it does", subtitle: "Recon to validated proof", href: `${MAIN_SITE}/#how-it-works` },
    { icon: Radar, title: "Engines we run", subtitle: "Recon, exploit, fix, report", href: `${MAIN_SITE}/#how-it-works` },
  ] },
  { heading: "Proof", items: [
    { icon: Brain, title: "Real exploits", subtitle: "Not pattern matches", href: `${MAIN_SITE}/#how-it-works` },
    { icon: ShieldCheck, title: "Security & trust", subtitle: "Tenant isolation, audit logs", href: `${MAIN_SITE}/#how-it-works` },
  ] },
];

const moreLinks = [
  { label: "Pricing", href: `${MAIN_SITE}/pricing` }, { label: "Docs", href: DOCS_SITE },
  { label: "Log in", href: `${MAIN_SITE}/login` }, { label: "Sign up", href: `${MAIN_SITE}/signup` },
  { label: "Status", href: "https://status.vulnix.dev" }, { label: "Contact", href: "mailto:hello@vulnix.dev" },
];

export function ProductMenu({ inline = false, onNavigate }: { inline?: boolean; onNavigate?: () => void }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open || inline) return;
    const closeOutside = (event: MouseEvent) => { if (!menuRef.current?.contains(event.target as Node)) setOpen(false); };
    const closeEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", closeOutside); document.addEventListener("keydown", closeEscape);
    return () => { document.removeEventListener("mousedown", closeOutside); document.removeEventListener("keydown", closeEscape); };
  }, [inline, open]);

  if (inline) return (
    <div className="mobile-product">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>Product <ChevronDown aria-hidden size={14} /></button>
      <div className="mobile-product-content" data-open={open} aria-hidden={!open}><div>
        {groups.map((group) => <section key={group.heading}><p>{group.heading}</p>{group.items.map(({ icon: Icon, title, subtitle, href }) => <a key={title} href={href} onClick={onNavigate}><span><Icon aria-hidden size={15} /></span><strong>{title}<small>{subtitle}</small></strong></a>)}</section>)}
        <section><p>More</p>{moreLinks.filter((link) => !["Pricing", "Docs", "Log in"].includes(link.label)).map((link) => <a key={link.label} href={link.href} onClick={onNavigate}><strong>{link.label}</strong></a>)}</section>
      </div></div>
    </div>
  );

  return (
    <div ref={menuRef} className="product-menu" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>Product <ChevronDown aria-hidden size={12} /></button>
      <div className="product-panel" data-open={open} aria-hidden={!open}>
        <div className="product-groups">{groups.map((group) => <section key={group.heading}><p>{group.heading}</p><div>{group.items.map(({ icon: Icon, title, subtitle, href }) => <a key={title} href={href} onClick={() => setOpen(false)}><span><Icon aria-hidden size={16} /></span><strong>{title}<small>{subtitle}</small></strong></a>)}</div></section>)}</div>
        <section className="product-more"><p>Get started</p>{moreLinks.map((link) => <a key={link.label} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>)}</section>
      </div>
    </div>
  );
}
