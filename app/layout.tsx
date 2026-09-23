import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";

import { BlogFooter } from "@/components/blog-footer";
import { FooterRevealTrigger } from "@/components/footer-reveal-trigger";
import { FooterWordmarkReveal } from "@/components/footer-wordmark-reveal";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-marketing-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Vulnix Blog | Security field notes", template: "%s | Vulnix Blog" },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "Vulnix Blog RSS" }],
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: "Vulnix Blog | Security field notes",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image", title: "Vulnix Blog", description: SITE_DESCRIPTION },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} ${inter.variable}`}
      style={{ "--font-marketing-mono": "var(--font-geist-mono)" } as React.CSSProperties}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                { "@type": "Organization", "@id": "https://vulnix.dev/#organization", name: "Vulnix", url: "https://vulnix.dev", logo: "https://vulnix.dev/vulnix-logo.png" },
                { "@type": "Blog", "@id": `${SITE_URL}/#blog`, name: SITE_NAME, url: SITE_URL, description: SITE_DESCRIPTION, publisher: { "@id": "https://vulnix.dev/#organization" } },
              ],
            }),
          }}
        />
        <FooterWordmarkReveal />
        <div className="footer-reveal-page">
          <main>{children}</main>
          <BlogFooter />
        </div>
        <FooterRevealTrigger />
      </body>
    </html>
  );
}
