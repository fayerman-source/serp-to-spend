import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

// Self-hosted via next/font (no render-blocking <link>, no layout shift).
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-fraunces",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const SITE = "SERP-to-Spend";
const SITE_URL = "https://serptospend.com";
const DESCRIPTION =
  "Paste an ad you are about to run. Get the platform policy it would trip, the regulatory risk, and a version that passes. Every verdict cites the real authority behind it.";

export const metadata: Metadata = {
  // Pinned to the canonical production domain on purpose (not an env var): share
  // images and canonical URLs should always resolve to serptospend.com, even from
  // preview deploys, so a preview can never leak as the canonical.
  metadataBase: new URL(SITE_URL),
  title: SITE,
  description: DESCRIPTION,
  // Title/description and og:url are intentionally NOT pinned here: Next falls
  // back to the nearest title/description and the resolved page URL, so /about
  // and /changelog emit their OWN share tags instead of the homepage's.
  openGraph: {
    type: "website",
    siteName: SITE,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body
        style={{
          margin: 0,
          fontFamily: "var(--font-inter), ui-sans-serif, system-ui, -apple-system, sans-serif",
          background: "#f6f3ec",
          color: "#3a342c",
        }}
      >
        {children}
      </body>
    </html>
  );
}
