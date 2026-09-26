"use client";

import { useEffect } from "react";

/**
 * Article videos are rendered from Markdown as autoplaying loops. For readers
 * who ask for reduced motion, stop them on their first frame and hand over
 * the controls instead.
 */
export function ReducedMotionMedia() {
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      document.querySelectorAll<HTMLVideoElement>(".article-figure video").forEach((video) => {
        if (query.matches) {
          video.pause();
          video.currentTime = 0;
          video.controls = true;
        } else {
          video.controls = false;
          void video.play().catch(() => {});
        }
      });
    };
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  return null;
}
