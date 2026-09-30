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
    <aside aria-label="Article table of contents" className="sticky top-28 hidden self-start lg:block">
      {/* Same group heading as the header's Product menu. */}
      <p className="mb-4 text-[10px] leading-3 font-semibold tracking-[0.8px] text-mk-fg/45 uppercase">On this page</p>
      <nav className="flex flex-col gap-3 border-l border-mk-fg/10">
        {headings.map((heading) => {
          const active = activeId === heading.id;
          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              aria-current={active ? "location" : undefined}
              className={`-ml-px border-l-2 pl-4 text-[13px] leading-[1.4] transition-colors ${active ? "border-[#fe4202] text-mk-fg" : "border-transparent text-mk-fg/45 hover:text-mk-fg/80"}`}
            >
              {heading.text}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
