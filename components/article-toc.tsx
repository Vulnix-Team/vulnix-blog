"use client";

import { useEffect, useState } from "react";

type Heading = { id: string; text: string };

export function ArticleToc({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    const elements = headings.map((heading) => document.getElementById(heading.id)).filter((element): element is HTMLElement => Boolean(element));
    if (!elements.length) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]?.target.id) setActiveId(visible[0].target.id);
    }, { rootMargin: "-18% 0px -68% 0px", threshold: [0, 1] });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings]);

  return (
    <aside className="article-sidebar" aria-label="Article table of contents">
      <p>On this page</p>
      <nav>{headings.map((heading) => <a key={heading.id} href={`#${heading.id}`} data-active={activeId === heading.id}>{heading.text}</a>)}</nav>
    </aside>
  );
}
