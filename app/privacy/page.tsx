import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { C, serif, sans, MAXW, Eyebrow, SiteHeader, SiteFooter } from "../ui";
import { openGraphFor } from "../site";

export const metadata: Metadata = {
  title: "Privacy · SERP-to-Spend",
  description:
    "What SERP-to-Spend collects, what it does not, and who processes it. The ads you check are not stored, and run logs keep metadata only, never your ad copy.",
  alternates: { canonical: "/privacy" },
  openGraph: openGraphFor("/privacy"),
};

const LAST_UPDATED = "July 19, 2026";

function H2({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <h2 style={{ fontFamily: serif, fontWeight: 600, fontSize: 22, lineHeight: 1.2, color: C.ink, margin: "34px 0 10px" }}>
      {children}
    </h2>
  );
}

function P({ children }: Readonly<{ children: ReactNode }>) {
  return <p style={{ fontSize: 15.5, lineHeight: 1.62, color: C.body, margin: "0 0 12px", maxWidth: 680 }}>{children}</p>;
}

export default function Privacy() {
  return (
    <>
      <SiteHeader active="/privacy" />
      <main style={{ maxWidth: MAXW, margin: "0 auto", padding: "44px 28px 0", fontFamily: sans }}>
        <Eyebrow>Privacy</Eyebrow>
        <h1
          style={{
            fontFamily: serif,
            fontWeight: 600,
            fontSize: "clamp(26px, 3.6vw, 38px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: C.ink,
            margin: "12px 0 0",
          }}
        >
          Privacy Policy
        </h1>
        <p style={{ fontSize: 14, color: C.muted, margin: "10px 0 0" }}>Last updated: {LAST_UPDATED}</p>

        <P>
          SERP-to-Spend (&ldquo;we&rdquo;) helps advertisers check and generate ad copy against platform and FTC
          rules. This policy explains what we collect and how it is handled. It is a general privacy notice, not
          legal advice.
        </P>

        <H2>What we collect</H2>
        <P>
          <strong>Account information.</strong> Signing in is handled by Clerk. When you sign in with Google,
          GitHub, or email, we receive your email address and basic profile (such as your name) to create and
          secure your account.
        </P>
        <P>
          <strong>What you paste into the tool.</strong> The ad text, keywords, or URLs you submit are sent to
          our AI provider to produce the compliance verdict or generated ads, and the result is returned to you.
          We do <strong>not</strong> store the content of what you paste; we retain only non-content metadata (see
          below).
        </P>
        <P>
          <strong>Usage metadata.</strong> For each run we log operational data (which feature was used, the
          platform, timing, success or failure, and your account identifier). This is to monitor reliability,
          control cost, and improve the service. It does not include the content you paste.
        </P>
        <P>
          <strong>Analytics.</strong> We use Microsoft Clarity to understand how the site is used (aggregate
          heatmaps and session activity), which may set cookies.
        </P>
        <P>
          <strong>Contact form.</strong> If you contact us, we receive the name, email, and message you send so we
          can reply.
        </P>

        <H2>How we use it</H2>
        <P>
          To provide and secure the service, run and improve the compliance and generation features, monitor
          performance and cost, and respond to your messages. We do not sell your personal information.
        </P>

        <H2>Who processes it</H2>
        <P>
          We rely on a small set of service providers that process data on our behalf: <strong>Clerk</strong>{" "}
          (authentication), <strong>Vercel</strong> (hosting), <strong>Google</strong> and <strong>GitHub</strong>{" "}
          (sign-in you choose), <strong>Microsoft Clarity</strong> (analytics), and{" "}
          <strong>Google Vertex AI (Gemini)</strong>, which processes the content you paste to generate results.
          Each handles data under its own terms.
        </P>

        <H2>Retention</H2>
        <P>
          Account data is kept while your account exists. Usage metadata and contact messages are kept for a
          limited period for operations and support. Content you paste is not retained beyond the request that
          produces your result.
        </P>

        <H2>Your choices</H2>
        <P>
          You can sign out at any time. To access or delete your account data, contact us and we will act on your
          request. You can also limit analytics cookies through your browser settings.
        </P>

        <H2>Changes</H2>
        <P>We may update this policy; the date above reflects the latest version.</P>

        <H2>Contact</H2>
        <P>
          Questions about privacy? Reach us through the{" "}
          <Link href="/contact" style={{ color: C.green, fontWeight: 600 }}>
            contact page
          </Link>
          .
        </P>
        <div style={{ height: 8 }} />
      </main>
      <SiteFooter />
    </>
  );
}
