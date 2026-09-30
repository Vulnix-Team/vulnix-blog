"use client";

import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";

import { saveTheme, type MarketingTheme } from "@/lib/theme";

// Light/dark switch - a copy of vulnix.dev's (product
// apps/web/components/marketing/theme-toggle.tsx), identical in look and
// motion; only the saving differs (a shared cookie, see lib/theme.ts). The
// theme lives on <html data-theme>, set before first paint by the layout's
// inline script, so this component only reads it and flips it.
//
// The switch is a View Transition: the browser snapshots the old theme, and
// the new one is revealed as a circle growing from the button until it covers
// the farthest corner of the viewport. Browsers without View Transitions, and
// anyone who prefers reduced motion, get an instant switch.

function readTheme(): MarketingTheme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

// Re-read whenever the attribute changes, from this or any other toggle.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function applyTheme(theme: MarketingTheme) {
  document.documentElement.dataset.theme = theme;
  try {
    saveTheme(theme);
  } catch {
    // Blocked cookies: the switch still works for this visit.
  }
}

/** The live theme, for code that can't style through CSS tokens (chart options). */
export function useTheme(): MarketingTheme {
  return useSyncExternalStore(subscribe, readTheme, () => "dark" as const);
}

// `marketing` sits on the themed page; `shell` sits in the portals' top bar,
// which stays Ink in both themes.
const TONES = {
  marketing:
    "size-[38px] rounded-[12px] bg-mk-fg/[0.08] text-mk-fg hover:bg-mk-fg/[0.14]",
  shell: "size-8 rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground",
} as const;

export function ThemeToggle({
  className = "",
  tone = "marketing",
}: {
  className?: string;
  tone?: keyof typeof TONES;
}) {
  // The server renders the default (dark) icon; the client corrects it after
  // hydration if a saved light theme is active.
  const theme = useTheme();
  const next: MarketingTheme = theme === "dark" ? "light" : "dark";

  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduced) {
      applyTheme(next);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    const root = document.documentElement;
    root.dataset.themeSwitching = "";
    const transition = document.startViewTransition(() => {
      flushSync(() => applyTheme(next));
    });
    transition.ready
      .then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 600, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {});
    transition.finished.finally(() => delete root.dataset.themeSwitching);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={`relative flex shrink-0 items-center justify-center overflow-hidden transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fe4202] ${TONES[tone]} ${className}`}
    >
      {/* Both icons stay mounted and trade places with a turn, so the swap
          animates even without View Transitions. */}
      <Sun
        aria-hidden
        className={`absolute ${tone === "shell" ? "size-4" : "size-[18px]"} transition-all duration-500 ${theme === "light" ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`}
        strokeWidth={1.75}
      />
      <Moon
        aria-hidden
        className={`absolute ${tone === "shell" ? "size-4" : "size-[18px]"} transition-all duration-500 ${theme === "dark" ? "rotate-0 opacity-100" : "rotate-90 opacity-0"}`}
        strokeWidth={1.75}
      />
    </button>
  );
}
