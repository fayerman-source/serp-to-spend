import type { Metadata } from "next";
import Link from "next/link";
import { C, sans, MAXW, SiteHeader, SiteFooter } from "../../ui";
import { openGraphFor } from "../../site";
import {
  Eyebrow,
  Title,
  Dek,
  H2,
  H3,
  P,
  UL,
  LI,
  Section,
  SourceNote,
  CTA,
  FaqSection,
  GuideJsonLd,
  buildArticleSchema,
  buildFaqSchema,
} from "../_components";

const PATH = "/guides/meta-ad-rejected-health-wellness";
const HEADLINE = "Why Meta Rejects Health and Wellness Ads (and How to Fix the Copy)";

export const metadata: Metadata = {
  title: `${HEADLINE} · SERP-to-Spend`,
  description:
    "Meta disapproves health and wellness ads for implied personal attributes, unrealistic outcomes, and negative self-perception. Here's the exact standard, in Meta's own terms, and how to rewrite the copy so it passes.",
  alternates: { canonical: PATH },
  openGraph: openGraphFor(PATH),
};

const FAQ = [
  {
    q: "Why does Meta keep rejecting my weight-loss or wellness ad?",
    a: "Almost always one of three things: the copy implies a personal attribute or condition (\"are you overweight?\"), it promotes an unrealistic outcome (\"lose 20 pounds in 2 weeks\"), or it could generate negative self-perception in the reader. Meta's Health and Wellness category is Restricted, not banned, so the fix is usually a rewrite, not a new product.",
  },
  {
    q: "Is 'lose weight fast' against Meta's ad standards?",
    a: "It risks two standards at once: it can read as implying a condition (that the viewer needs to lose weight), and a specific, fast timeline is the kind of unrealistic-outcome claim Meta's Health and Wellness policy restricts. Reframe around the product or the behavior, not a promised result on a body.",
  },
  {
    q: "Does a disclaimer fix an unrealistic-outcome claim?",
    a: "No. Meta judges the net impression of the ad, not whether a small-print disclaimer is attached. A bold headline promising a specific fast result reads as that promise regardless of a caveat underneath it.",
  },
];

export default function Guide() {
  return (
    <>
      <SiteHeader active="/guides" />
      <main style={{ maxWidth: MAXW, margin: "0 auto", padding: "44px 28px 0", fontFamily: sans }}>
        <Eyebrow>Guide · Meta ads</Eyebrow>
        <Title>Why Meta Rejects Health and Wellness Ads (and How to Fix the Copy)</Title>
        <Dek>
          Health and Wellness is one of Meta&rsquo;s Restricted categories, which means it is allowed, with
          conditions, and most of the rejections come from three predictable places. Here is the standard in
          Meta&rsquo;s own terms, and the rewrite pattern that keeps the hook.
        </Dek>

        <Section>
          <H2>The three ways a health or wellness ad trips Meta&rsquo;s review</H2>
          <P>
            Meta organizes its Advertising Standards into Unacceptable content (banned outright), Restricted
            goods and services (allowed with conditions), and Objectionable content. Health and Wellness ads
            usually fall foul of one of these:
          </P>
          <UL>
            <LI>
              <strong>Privacy Violations and Personal Attributes.</strong> The ad must not assert or imply a
              person&rsquo;s personal attributes or condition &mdash; health status, weight, or similar &mdash; even
              indirectly. A headline like &ldquo;Struggling to lose the weight?&rdquo; addresses the viewer&rsquo;s
              body directly, which is exactly what this standard targets.
            </LI>
            <LI>
              <strong>Health and Wellness (Restricted).</strong> Ads in this category must not imply or generate
              negative self-perception, and must not promote unrealistic outcomes. Weight-loss and cosmetic
              claims are restricted and must be targeted to audiences 18 and older.
            </LI>
            <LI>
              <strong>Fraud, Scams and Deceptive Practices.</strong> A misleading outcome claim &mdash; a specific
              result presented as the likely, ordinary outcome &mdash; falls under this standard regardless of
              category.
            </LI>
          </UL>
        </Section>

        <Section>
          <H2>Rewrite pattern: keep the hook, drop the trigger</H2>
          <P>
            The fix is rarely a new offer &mdash; it is almost always the same benefit stated without addressing
            the viewer&rsquo;s body or condition, and without a specific, fast, or guaranteed number attached to it.
          </P>
          <H3>Instead of implying a condition&hellip;</H3>
          <P>
            &ldquo;Tired of carrying extra weight?&rdquo; addresses the reader&rsquo;s body directly. Reframe around
            the product or the routine instead: &ldquo;A 20-minute routine built around real food, not
            restriction.&rdquo; Same hook, no implied attribute.
          </P>
          <H3>Instead of a specific fast outcome&hellip;</H3>
          <P>
            &ldquo;Lose 15 pounds in 2 weeks&rdquo; is a specific, fast, testable claim &mdash; the kind Meta&rsquo;s
            Health and Wellness standard restricts as an unrealistic outcome. &ldquo;Built for people who want a
            routine that actually fits their week&rdquo; keeps the promise of ease without a number or a
            timeline.
          </P>
          <H3>Instead of a bare guarantee&hellip;</H3>
          <P>
            &ldquo;Guaranteed results or your money back&rdquo; is a guarantee of outcome, which needs
            substantiation the ad copy alone cannot provide and which independently risks the Fraud, Scams and
            Deceptive Practices standard if the outcome is not ordinary. Move the guarantee to a return policy
            on the landing page, not the ad hook.
          </P>
        </Section>

        <Section>
          <H2>Check it before you spend</H2>
          <P>
            SERP-to-Spend runs this exact standard, in Meta&rsquo;s own terms, against the ad you are about to
            publish, names the specific line that would trip it, and rewrites it without losing the hook.
          </P>
          <CTA>Paste your Meta ad and see the exact standard it would trip, before you spend on it.</CTA>
        </Section>

        <FaqSection faq={FAQ} />

        <Section>
          <SourceNote>
            Grounded in Meta&rsquo;s published Advertising Standards.{" "}
            <a
              href="https://transparency.meta.com/policies/ad-standards/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: C.muted }}
            >
              transparency.meta.com/policies/ad-standards
            </a>
            . This is decision support, not legal advice &mdash; see the{" "}
            <Link href="/about" style={{ color: C.muted }}>
              full disclosure on /about
            </Link>
            .
          </SourceNote>
        </Section>

        <GuideJsonLd
          article={buildArticleSchema({ headline: HEADLINE, datePublished: "2026-08-23", dateModified: "2026-08-23" })}
          faq={buildFaqSchema(FAQ)}
        />
      </main>
      <SiteFooter />
    </>
  );
}
