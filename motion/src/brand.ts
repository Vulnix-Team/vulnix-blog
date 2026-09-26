import { continueRender, delayRender, staticFile } from "remotion";

// Live Vulnix identity (PRODUCT.md): Ink, Cream, Ember.
export const INK = "#010101";
export const CREAM = "#f2f3ee";
export const EMBER = "#fe4202";
export const EMBER_SOFT = "#ff7a45";
export const MUTED = "rgba(242, 243, 238, 0.52)";
export const LINE = "rgba(242, 243, 238, 0.12)";
export const SUCCESS = "#10b981";

export const FONT_HEADING = "Satoshi, ui-sans-serif, system-ui, sans-serif";
export const FONT_MONO = "'Geist Mono', ui-monospace, Consolas, monospace";

// Frames render in headless Chrome; block until the brand fonts are loaded,
// or early frames fall back to a system serif.
const FONTS = [
  { family: "Satoshi", file: "fonts/Satoshi-Regular.woff2", weight: "400" },
  { family: "Satoshi", file: "fonts/Satoshi-Bold.woff2", weight: "700" },
  { family: "Geist Mono", file: "fonts/GeistMono-latin.woff2", weight: "400 600" },
];

let requested = false;

export function loadBrandFonts() {
  if (requested || typeof document === "undefined") return;
  requested = true;
  const handle = delayRender("brand fonts");
  Promise.all(
    FONTS.map(async ({ family, file, weight }) => {
      const face = new FontFace(family, `url(${staticFile(file)})`, { weight });
      await face.load();
      document.fonts.add(face);
    }),
  ).then(
    () => continueRender(handle),
    () => continueRender(handle),
  );
}

/** The dotted ground every Vulnix illustration sits on. */
export const DOT_GRID = {
  backgroundColor: INK,
  backgroundImage: "radial-gradient(circle at 1px 1px, rgba(242,243,238,0.07) 1px, transparent 0)",
  backgroundSize: "22px 22px",
} as const;
