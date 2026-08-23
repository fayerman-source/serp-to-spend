import type { Metadata } from "next";
import Link from "next/link";
import { C, serif, sans, MAXW, SiteHeader, SiteFooter } from "../ui";
import { openGraphFor } from "../site";
import { Eyebrow, Title, Dek } from "./_components";

const PATH = "/guides";

export const metadata: Metadata = {
  title: "Guides · SERP-to-Spend",
  description:
    "Platform ad policy and FTC compliance, explained with the actual cited standard, not a paraphrase. Guides for media buyers who want to know why an ad gets rejected before it runs.",
  alternates: { canonical: PATH },
  openGraph: openGraphFor(PATH),
};

const GUIDES = [
  {
    href: "/guides/meta-ad-rejected-health-wellness",
    title: "Why Meta Rejects Health and Wellness Ads (and How to Fix the Copy)",
    dek: "The three standards behind almost every Health and Wellness disapproval, and the rewrite pattern that keeps the hook.",
  },
  {
    href: "/guides/ftc-advertising-substantiation-standard",
    title: "The FTC Substantiation Standard for Ad Claims, Explained",
    dek: "Which claims need proof before the ad runs, which are puffery, and what actually changed in the 2009 and 2023 Endorsement Guides revisions.",
  },
];

export default function Guides() {
  return (
    <>
      <SiteHeader active="/guides" />
      <main style={{ maxWidth: MAXW, margin: "0 auto", padding: "44px 28px 0", fontFamily: sans }}>
        <Eyebrow>Guides</Eyebrow>
        <Title>Platform ad policy and FTC compliance, cited</Title>
        <Dek>
          Not a paraphrase of what a platform&rsquo;s policy probably means. The actual standard, in its
          own terms, with the rewrite pattern that clears it.
        </Dek>

        <div style={{ marginTop: 36, display: "grid", gap: 20, paddingBottom: 60 }}>
          {GUIDES.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              style={{
                display: "block",
                textDecoration: "none",
                border: `1px solid ${C.rule}`,
                borderRadius: 12,
                padding: "24px 26px",
                background: C.card,
              }}
            >
              <h2
                style={{
                  fontFamily: serif,
                  fontWeight: 600,
                  fontSize: 21,
                  lineHeight: 1.25,
                  color: C.ink,
                  margin: "0 0 8px",
                }}
              >
                {g.title}
              </h2>
              <p style={{ fontSize: 15.5, lineHeight: 1.55, color: C.muted, margin: 0 }}>{g.dek}</p>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
