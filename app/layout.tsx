import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";

import { BlogFooter } from "@/components/blog-footer";
import { FooterRevealTrigger } from "@/components/footer-reveal-trigger";
import { FooterWordmarkReveal } from "@/components/footer-wordmark-reveal";
import { SiteHeader } from "@/components/site-header";
import { MAIN_SITE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-marketing-body",
  subsets: ["latin"],
});

const SOCIAL_IMAGE_URL = `${SITE_URL}/opengraph-image.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Vulnix Blog | Security field notes", template: "%s | Vulnix Blog" },
  description: SITE_DESCRIPTION,
  keywords: [
    "Vulnix Blog",
    "AI penetration testing",
    "AI pentesting",
    "continuous security testing",
    "exploit validation",
    "security fix validation",
    "application security",
  ],
  authors: [{ name: "Vulnix Team", url: MAIN_SITE }],
  creator: "Vulnix",
  publisher: "Vulnix",
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
    images: [{ url: SOCIAL_IMAGE_URL, alt: "Vulnix Blog" }],
  },
  twitter: { card: "summary_large_image", title: "Vulnix Blog", description: SITE_DESCRIPTION, images: [SOCIAL_IMAGE_URL] },
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
                {
                  "@type": "Organization",
                  "@id": `${MAIN_SITE}/#organization`,
                  name: "Vulnix",
                  url: MAIN_SITE,
                  logo: `${MAIN_SITE}/vulnix-logo.png`,
                  description: "Vulnix is an AI penetration testing platform with continuous exploit validation.",
                  sameAs: ["https://docs.vulnix.dev", "https://status.vulnix.dev"],
                  contactPoint: [
                    { "@type": "ContactPoint", contactType: "sales", email: "hello@vulnix.dev" },
                    { "@type": "ContactPoint", contactType: "customer support", email: "support@vulnix.dev" },
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  name: SITE_NAME,
                  url: SITE_URL,
                  description: SITE_DESCRIPTION,
                  publisher: { "@id": `${MAIN_SITE}/#organization` },
                },
                {
                  "@type": "Blog",
                  "@id": `${SITE_URL}/#blog`,
                  name: SITE_NAME,
                  url: SITE_URL,
                  description: SITE_DESCRIPTION,
                  isPartOf: { "@id": `${SITE_URL}/#website` },
                  publisher: { "@id": `${MAIN_SITE}/#organization` },
                },
              ],
            }),
          }}
        />
        <SiteHeader />
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
