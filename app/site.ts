// Shared site identity and Open Graph base. Dependency-free so layout.tsx and
// every page can import it without a circular import (mirrors theme.ts).

export const SITE = "SERP-to-Spend";
export const SITE_URL = "https://serptospend.com";
export const DESCRIPTION =
  "Stop ad disapprovals before they happen. An ad compliance checker for Meta, Google, and TikTok that names the policy, the FTC risk, and a rewrite that passes.";

// og:url is required by the Open Graph spec but has NO per-page fallback in
// Next: it is emitted only where openGraph.url is set. og:title/og:description
// do fall back to the nearest title/description, which is why those stay unset.
//
// The catch: a child segment's `openGraph` REPLACES the parent's wholesale
// (no field-level merge), and declaring one also suppresses the automatic
// app/opengraph-image.png injection. So a page cannot add just og:url without
// silently dropping og:type, og:site_name, and og:image. Every page restates
// the whole block through this helper. Relative URLs resolve via metadataBase.
export function openGraphFor(path: string) {
  return {
    type: "website" as const,
    siteName: SITE,
    url: path,
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, type: "image/png" }],
  };
}
