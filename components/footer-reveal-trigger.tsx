"use client";

import { useEffect } from "react";

const HOLD_MS = 2000;
const BOTTOM_SLACK_PX = 2;

export function FooterRevealTrigger() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const page = document.querySelector<HTMLElement>(".footer-reveal-page");
    if (!page) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let open = false;
    const atBottom = () => window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - BOTTOM_SLACK_PX;
    const reveal = () => {
      if (open) return;
      open = true;
      page.classList.add("is-revealed");
      timer = setTimeout(() => { page.classList.remove("is-revealed"); open = false; }, HOLD_MS);
    };
    const onWheel = (event: WheelEvent) => { if (event.deltaY > 0 && atBottom()) reveal(); };
    let touchStartY = 0;
    const onTouchStart = (event: TouchEvent) => { touchStartY = event.touches[0]?.clientY ?? 0; };
    const onTouchMove = (event: TouchEvent) => { if (touchStartY - (event.touches[0]?.clientY ?? 0) > 12 && atBottom()) reveal(); };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      clearTimeout(timer);
      page.classList.remove("is-revealed");
    };
  }, []);
  return null;
}
