"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { getArticleCover } from "@/lib/article-cover";

export type ArticleCardPost = {
  slug: string;
  title: string;
  topic: string;
  excerpt: string;
  readingTime: number;
};

function DrawnArrow({ active }: { active: boolean }) {
  const shaft = useRef<SVGPathElement>(null);
  const head = useRef<SVGPathElement>(null);
  const origin = useRef<SVGCircleElement>(null);
  const burst = useRef<SVGGElement>(null);
  const resetTimer = useRef<number | undefined>(undefined);
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);

  const reset = useCallback(() => {
    if (resetTimer.current !== undefined) window.clearTimeout(resetTimer.current);
    resetTimer.current = undefined;

    [shaft.current, head.current, origin.current, burst.current]
      .filter(Boolean)
      .forEach((element) => element?.getAnimations().forEach((animation) => animation.cancel()));

    shaft.current?.style.setProperty("stroke-dashoffset", "23");
    shaft.current?.style.setProperty("opacity", "0");
    head.current?.style.setProperty("stroke-dashoffset", "18");
    head.current?.style.setProperty("opacity", "0");
    origin.current?.style.setProperty("opacity", "0");
    burst.current?.style.setProperty("opacity", "0");
    burst.current?.style.setProperty("transform", "scale(.45)");
  }, []);

  const play = useCallback((hold: boolean) => {
    reset();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      if (hold) {
        shaft.current?.style.setProperty("stroke-dashoffset", "0");
        shaft.current?.style.setProperty("opacity", "1");
        head.current?.style.setProperty("stroke-dashoffset", "0");
        head.current?.style.setProperty("opacity", "1");
        origin.current?.style.setProperty("opacity", "1");
      }
      return;
    }

    shaft.current?.animate(
      [{ strokeDashoffset: 23, opacity: 0.24 }, { strokeDashoffset: 0, opacity: 1 }],
      { duration: 220, easing: "cubic-bezier(.16, 1, .3, 1)", fill: "forwards" },
    );
    head.current?.animate(
      [{ strokeDashoffset: 18, opacity: 0 }, { strokeDashoffset: 0, opacity: 1 }],
      { delay: 105, duration: 170, easing: "cubic-bezier(.16, 1, .3, 1)", fill: "forwards" },
    );
    origin.current?.animate(
      [{ opacity: 0, r: 1.2 }, { opacity: 1, r: 1.7 }, { opacity: 0.45, r: 1.3 }],
      { duration: 250, easing: "cubic-bezier(.16, 1, .3, 1)", fill: "forwards" },
    );
    burst.current?.animate(
      [{ opacity: 0, transform: "scale(.45)" }, { opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(1.6)" }],
      { delay: 230, duration: 210, easing: "cubic-bezier(.16, 1, .3, 1)", fill: "forwards" },
    );

    if (!hold) resetTimer.current = window.setTimeout(reset, 470);
  }, [reset]);

  useEffect(() => {
    const updateVisibility = () => setIsDocumentVisible(document.visibilityState === "visible");
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    if (active) play(true);
    else reset();
  }, [active, play, reset]);

  useEffect(() => {
    if (!active || !isDocumentVisible || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = window.setInterval(() => play(true), 5000);

    return () => window.clearInterval(interval);
  }, [active, isDocumentVisible, play]);

  useEffect(() => reset, [reset]);

  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 28 28" width="28" height="28" fill="none">
      <circle ref={origin} cx="5" cy="23" r="1.3" fill="#fe4202" opacity="0" />
      <path ref={shaft} d="M5 23L21 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="23" strokeDashoffset="23" opacity="0" />
      <path ref={head} d="M12 7H21V16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="18" strokeDashoffset="18" opacity="0" />
      <g ref={burst} stroke="#fe4202" strokeWidth="1.25" strokeLinecap="round" style={{ transformBox: "fill-box", transformOrigin: "center", opacity: 0, transform: "scale(.45)" }}>
        <circle cx="21" cy="7" r="2.3" />
        <path d="M21 1.5V3.3M26.5 7H24.7M24.9 3.1L23.6 4.4M17.1 3.1L18.4 4.4M24.9 10.9L23.6 9.6" />
      </g>
    </svg>
  );
}

export function ArticleCard({ post, related = false }: { post: ArticleCardPost; related?: boolean }) {
  const [isActive, setIsActive] = useState(false);
  const cover = getArticleCover(post.slug);

  return (
    <article
      className={`post-card${related ? " related-card" : ""}`}
      onPointerEnter={() => setIsActive(true)}
      onPointerLeave={() => setIsActive(false)}
      onFocusCapture={() => setIsActive(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsActive(false);
      }}
    >
      <Link href={`/insights/${post.slug}`} className="post-card-media" aria-label={`Read ${post.title}`}>
        <Image src={cover.src} alt={cover.alt} width={1856} height={928} sizes="(max-width: 820px) 100vw, 50vw" />
      </Link>
      <div className="card-topline"><span>{post.topic}</span><span>{post.readingTime} min read</span></div>
      <h2><Link href={`/insights/${post.slug}`}>{post.title}</Link></h2>
      <p>{post.excerpt}</p>
      <Link href={`/insights/${post.slug}`} className="read-link">Read article <DrawnArrow active={isActive} /></Link>
    </article>
  );
}
