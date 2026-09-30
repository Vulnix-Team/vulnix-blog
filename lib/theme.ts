// The site-wide light/dark theme, as on vulnix.dev (product
// apps/web/lib/marketing/theme.ts): dark by default, a visitor's choice
// restored by an inline <head> script before first paint.
//
// The choice lives in a cookie on .vulnix.dev rather than localStorage, which
// is per origin: a cookie on the parent domain is shared by vulnix.dev, the
// portal and this blog, so picking light on one applies on all of them once
// each reads it. Off vulnix.dev (localhost, previews) it is a host-only cookie.
export type MarketingTheme = "dark" | "light";

export const THEME_STORAGE_KEY = "vulnix-theme";

const ONE_YEAR = 60 * 60 * 24 * 365;

export function saveTheme(theme: MarketingTheme) {
  const host = location.hostname;
  const shared = host === "vulnix.dev" || host.endsWith(".vulnix.dev");
  document.cookie = [
    `${THEME_STORAGE_KEY}=${theme}`,
    "Path=/",
    `Max-Age=${ONE_YEAR}`,
    "SameSite=Lax",
    ...(location.protocol === "https:" ? ["Secure"] : []),
    ...(shared ? ["Domain=vulnix.dev"] : []),
  ].join("; ");
}

export const THEME_INIT_SCRIPT = `try{var m=document.cookie.match(/(?:^|; )${THEME_STORAGE_KEY}=(light|dark)(?:;|$)/);document.documentElement.dataset.theme=m&&m[1]==="light"?"light":"dark"}catch(e){document.documentElement.dataset.theme="dark"}`;
