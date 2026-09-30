import localFont from "next/font/local";

// Same self-hosted Satoshi setup as the product (apps/web/app/fonts/satoshi.ts):
// build-time-hashed and preloaded instead of a public/ @font-face.
export const satoshi = localFont({
  src: [
    { path: "./satoshi/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "./satoshi/Satoshi-Medium.woff2", weight: "500", style: "normal" },
    { path: "./satoshi/Satoshi-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});
