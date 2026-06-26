import type { Metadata } from "next";
import type { ReactNode } from "react";
import { C, serif, sans, MAXW, Eyebrow, SiteHeader, SiteFooter } from "../ui";

export const metadata: Metadata = {
  title: "About · SERP-to-Spend",
  description: "Why this tool exists, the legal moat behind it, and the builder.",
};

function H2({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <h2
      style={{
        fontFamily: serif,
        fontWeight: 600,
        fontSize: 28,
        lineHeight: 1.15,
        color: C.ink,
        letterSpacing: "-0.01em",
        margin: "0 0 14px",
      }}
    >
      {children}
    </h2>
  );
}

function P({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <p style={{ fontSize: 16.5, lineHeight: 1.62, color: C.body, margin: "0 0 16px", maxWidth: 680 }}>{children}</p>
  );
}

function Section({ children }: Readonly<{ children: ReactNode }>) {
  return <section style={{ padding: "44px 0", borderTop: `1px solid ${C.rule}` }}>{children}</section>;
}

export default function About() {
  return (
    <>
      <SiteHeader active="/about" />
      <main style={{ maxWidth: MAXW, margin: "0 auto", padding: "44px 28px 0", fontFamily: sans }}>
        <Eyebrow>The story</Eyebrow>
        <h1
          style={{
            fontFamily: serif,
            fontWeight: 600,
            fontSize: "clamp(28px, 3.8vw, 40px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: C.ink,
            margin: "12px 0 0",
            maxWidth: 740,
          }}
        >
          Built for media buying teams: write the ad, know it passes
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.55, color: C.body, margin: "16px 0 0", maxWidth: 680 }}>
          Plenty of tools write ad copy. Almost none tell you, before you spend, whether the claims in
          that copy will survive platform review and FTC scrutiny. That gap is what this one adds.
        </p>

        <Section>
          <H2>The problem</H2>
          <P>
            Affiliate and performance teams lose real money to one thing every week: rejected ads. A
            disapproval does not just waste the creative time. It stalls the campaign, burns the ad
            account&rsquo;s standing with the platform, and on claim-heavy offers it happens constantly.
            Unprovable claims are also an FTC problem, not only a platform one, and the advertiser is
            liable even for an affiliate&rsquo;s claim.
          </P>
        </Section>

        <Section>
          <H2>Why this one</H2>
          <P>
            Another ad generator was not the goal. That space is saturated: AdCreative.ai, Jasper,
            Copy.ai, and Anyword already turn a brief into polished ad copy. So the work started with a
            systematic opportunity scan, run with{" "}
            <a
              href="https://1mil.app/github"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: C.green, fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 2 }}
            >
              1mil.app
            </a>, my own opportunity-scanner, across several market lenses and a survey of what
            already exists. The one real, unserved opening was ad disapprovals: a problem that costs media
            buyers money every week, with almost nothing checking compliance before the spend.
          </P>
          <P>
            The gap also comes with a moat that holds. The compliance engine is grounded in real, cited
            legal authority, not a prompt wrapper on a cold model. The platform policies and the FTC and
            FDA rules live in sourced, versioned modules where every rule traces to a statute, a CFR
            section, or a published policy. The tool names the exact authority behind each flag, and it
            knows the puffery line, so it does not cry wolf on a clean, already-running ad.
          </P>
        </Section>

        <Section>
          <H2>What comes next</H2>
          <P>
            Close the loop into a data moat: ground the compliance check in real submit-to-verdict
            outcomes through the Meta and Google ad APIs, so the risk model learns from actual
            disapprovals instead of policy text. Then per-advertiser calibration, a formal counsel review
            of the legal modules with case-law citations, and one-click export into the campaign. No
            generic generator can build that outcome dataset.
          </P>
        </Section>

        <Section>
          <H2>The builder</H2>
          <P>
            Built by someone with a law license, and that combination is the point. A tool that turns
            statutes and platform policy into a verdict sits where those two skills meet: reading
            regulations natively, knowing what a claim has to prove, then building the system that
            applies it. When the tool flags a claim for tripping FTC substantiation or making a product
            an unapproved drug, that is a lawyer&rsquo;s read, not a model guessing.
          </P>
          <P>
            No demos. The approach: pick a real problem, build the unglamorous part nobody wants to own,
            and ship it properly. Every change here went through a branch, continuous integration, tests,
            and review before it merged. For anyone weighing the person and not just the tool, that is the
            bet: a builder who ships and reads the law, aimed at a marketing problem that costs real
            money. This project is the proof, not a pitch deck.
          </P>
        </Section>

        <p
          style={{
            fontSize: 14,
            color: C.muted,
            margin: "44px 0 0",
            paddingTop: 24,
            borderTop: `1px solid ${C.rule}`,
            fontStyle: "italic",
          }}
        >
          Built for the{" "}
          <a
            href="https://www.itstoday.media/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: C.green, fontWeight: 600, fontStyle: "normal" }}
          >
            It&rsquo;s Today Media
          </a>{" "}
          build challenge: the push that turned a scan result into a shipped product.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
