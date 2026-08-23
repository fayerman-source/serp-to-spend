import type { Metadata } from "next";
import Link from "next/link";
import { C, sans, MAXW, SiteHeader, SiteFooter } from "../../ui";
import { jsonLdScript } from "../../../lib/json-ld";
import { openGraphFor } from "../../site";
import { Eyebrow, Title, Dek, H2, H3, P, UL, LI, Section, SourceNote, CTA } from "../_components";

const PATH = "/guides/ftc-advertising-substantiation-standard";

export const metadata: Metadata = {
  title: "The FTC Substantiation Standard for Ad Claims, Explained · SERP-to-Spend",
  description:
    "Which ad claims need proof before they run, which ones are puffery, and what \"competent and reliable\" evidence means under FTC guidance — with the actual citations, not a paraphrase.",
  alternates: { canonical: PATH },
  openGraph: openGraphFor(PATH),
};

const FAQ = [
  {
    q: "What is the FTC substantiation standard?",
    a: "Under the FTC's 1983 Policy Statement Regarding Advertising Substantiation, an advertiser must have a reasonable basis — objective evidence — for a claim BEFORE the ad runs, not after a challenge. The required level of proof scales with the claim: a specific, measurable, or health-related claim needs stronger evidence than a general one.",
  },
  {
    q: "Is 'best' or 'expert' a claim that needs substantiation?",
    a: "No. Subjective superiority language and vague expertise claims — best, great, premium, expert, trusted, leading — are puffery: opinion a reasonable consumer judges for themselves, not a testable fact. An ad built only on puffery is low FTC risk. Substantiation is for specific, measurable, or health/safety/efficacy claims.",
  },
  {
    q: "Does a 'results not typical' disclaimer protect a testimonial claim?",
    a: "No, and this changed with the 2023 revision to the FTC's Endorsement Guides. A bare 'results not typical' disclaimer is no longer sufficient. If the advertised result is not what a typical user experiences, the ad must disclose the result users generally do achieve, and that generally-expected result must itself be substantiated.",
  },
  {
    q: "Who is liable if an affiliate makes the unsubstantiated claim, not the brand?",
    a: "The advertiser is. Under 16 C.F.R. § 255.1(d), the advertiser is liable for a claim an affiliate or endorser makes on its behalf, even if the brand's own ad copy never states it.",
  },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const ARTICLE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "The FTC Substantiation Standard for Ad Claims, Explained",
  author: { "@type": "Organization", name: "SERP-to-Spend" },
  publisher: { "@type": "Organization", name: "SERP-to-Spend" },
  datePublished: "2026-08-23",
  dateModified: "2026-08-23",
};

export default function Guide() {
  return (
    <>
      <SiteHeader active="/guides" />
      <main style={{ maxWidth: MAXW, margin: "0 auto", padding: "44px 28px 0", fontFamily: sans }}>
        <Eyebrow>Guide · FTC compliance</Eyebrow>
        <Title>The FTC Substantiation Standard for Ad Claims, Explained</Title>
        <Dek>
          Most ad claims are fine. The FTC's own rule is narrower than most media buyers assume &mdash; but the
          claims that do trigger it need real evidence in hand before the ad runs, not after someone files a
          complaint.
        </Dek>

        <Section>
          <H2>The rule, not a paraphrase</H2>
          <P>
            FTC Act Section 5(a) (15 U.S.C. § 45(a)) bars unfair or deceptive acts. A claim is deceptive if it
            is likely to mislead a reasonable consumer and is material to their decision (FTC Policy Statement
            on Deception, 1983). Separately, the 1983 Policy Statement Regarding Advertising Substantiation
            requires advertisers to have a reasonable basis &mdash; objective evidence &mdash; for a claim{" "}
            <em>before</em> the ad runs.
          </P>
        </Section>

        <Section>
          <H2>Puffery vs. a claim that needs proof</H2>
          <P>
            The FTC does not require proof for subjective opinion a reasonable consumer would judge for
            themselves. Draw the line here:
          </P>
          <H3>Puffery &mdash; no substantiation required</H3>
          <UL>
            <LI>Subjective superiority: &ldquo;best,&rdquo; &ldquo;great,&rdquo; &ldquo;amazing,&rdquo; &ldquo;premium,&rdquo; &ldquo;world-class.&rdquo;</LI>
            <LI>Vague expertise or quality: &ldquo;expert,&rdquo; &ldquo;elite,&rdquo; &ldquo;professional,&rdquo; &ldquo;trusted,&rdquo; &ldquo;leading,&rdquo; &ldquo;top.&rdquo;</LI>
            <LI>Self-judgable opinion: &ldquo;tastes great,&rdquo; &ldquo;looks beautiful.&rdquo;</LI>
          </UL>
          <H3>Needs substantiation before the ad runs</H3>
          <UL>
            <LI>Specific or measurable: &ldquo;25% faster,&rdquo; &ldquo;lose 20 pounds in 30 days,&rdquo; &ldquo;saves $500.&rdquo;</LI>
            <LI>Performance, safety, health, or efficacy claims: &ldquo;reduces wrinkles,&rdquo; &ldquo;prevents colds.&rdquo;</LI>
            <LI>Establishment claims invoking proof: &ldquo;clinically proven,&rdquo; &ldquo;doctor recommended,&rdquo; &ldquo;lab tested&rdquo; &mdash; each requires the exact level of proof it asserts.</LI>
            <LI>A guarantee of outcome, or an income/earnings claim.</LI>
            <LI>The implied net impression of the whole ad &mdash; words, images, and omissions together, not just the literal text.</LI>
          </UL>
          <P>
            Health, safety, weight-loss, and disease claims sit at the top of the evidence bar: the FTC&rsquo;s
            Health Products Compliance Guidance (December 2022) requires &ldquo;competent and reliable
            scientific evidence&rdquo; &mdash; well-designed human studies, not testimonials or lab data alone.
          </P>
        </Section>

        <Section>
          <H2>Testimonials and income claims: the 2023 update that changes things</H2>
          <P>
            Endorsements and testimonials (16 C.F.R. Part 255) must reflect the endorser&rsquo;s honest opinion
            and the <em>typical</em> experience of users. If results are not typical, the ad must disclose the
            generally-expected result &mdash; and that result must itself be substantiated. The revised
            Endorsement Guides (88 Fed. Reg. 48102, effective July 26, 2023) made explicit that a bare
            &ldquo;results not typical&rdquo; disclaimer is not enough on its own. This applies to income and
            aggregate-statistic testimonials too: &ldquo;our students make $10,000 a month&rdquo; or &ldquo;100%
            of clients saw returns&rdquo; imply a typical result and need the same substantiation or
            disclosure.
          </P>
          <P>
            Separately, income claims can trigger the Business Opportunity Rule (16 C.F.R. Part 437) &mdash; but
            only when the offer is a true business opportunity: a required payment <em>plus</em> a
            representation that the seller will provide locations, outlets, accounts, or customers. Pure
            coaching, courses, or general business-development training do not count. A generic &ldquo;make $X a
            month&rdquo; course is a Section 5 and § 255.2(b) substantiation matter, not automatically a Part
            437 violation &mdash; unless it also promises customers or outlets.
          </P>
        </Section>

        <Section>
          <H2>Who is liable</H2>
          <P>
            The advertiser is liable for every claim made in its name, including a claim an affiliate makes on
            its behalf (16 C.F.R. § 255.1(d)). Running an offer through affiliates does not move the
            substantiation burden off the brand.
          </P>
        </Section>

        <Section>
          <H2>Check a claim before you spend on it</H2>
          <P>
            SERP-to-Spend flags exactly which claims in your ad need substantiation, names the FTC standard
            each one triggers, and rewrites the claim to keep the persuasion while clearing the bar.
          </P>
          <CTA>Paste your ad and see which claims need proof before you spend on it.</CTA>
        </Section>

        <Section>
          <H2>Common questions</H2>
          {FAQ.map(({ q, a }) => (
            <div key={q} style={{ margin: "0 0 22px" }}>
              <H3>{q}</H3>
              <P>{a}</P>
            </div>
          ))}
        </Section>

        <Section>
          <SourceNote>
            Sources: FTC Act{" "}
            <a href="https://www.law.cornell.edu/uscode/text/15/45" target="_blank" rel="noopener noreferrer" style={{ color: C.muted }}>
              15 U.S.C. § 45(a)
            </a>
            ; FTC{" "}
            <a
              href="https://www.ftc.gov/public-statements/1983/03/ftc-policy-statement-regarding-advertising-substantiation"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: C.muted }}
            >
              Policy Statement Regarding Advertising Substantiation (1983)
            </a>
            ; Endorsement Guides{" "}
            <a href="https://www.law.cornell.edu/cfr/text/16/255.2" target="_blank" rel="noopener noreferrer" style={{ color: C.muted }}>
              16 C.F.R. § 255.2(b)
            </a>{" "}
            and{" "}
            <a
              href="https://www.federalregister.gov/citation/88-FR-48102"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: C.muted }}
            >
              88 Fed. Reg. 48102
            </a>
            ; FTC{" "}
            <a
              href="https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: C.muted }}
            >
              Health Products Compliance Guidance (Dec. 2022)
            </a>
            ; Business Opportunity Rule{" "}
            <a href="https://www.law.cornell.edu/cfr/text/16/437.1" target="_blank" rel="noopener noreferrer" style={{ color: C.muted }}>
              16 C.F.R. § 437.1
            </a>
            . This is decision support, not legal advice &mdash; see the{" "}
            <Link href="/about" style={{ color: C.muted }}>
              full disclosure on /about
            </Link>
            .
          </SourceNote>
        </Section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(ARTICLE_SCHEMA) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(FAQ_SCHEMA) }} />
      </main>
      <SiteFooter />
    </>
  );
}
