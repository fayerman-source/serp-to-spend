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
  metadataBase: new URL(SITE_URL),
  title: SITE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE,
    title: SITE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE,
    description: DESCRIPTION,
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
