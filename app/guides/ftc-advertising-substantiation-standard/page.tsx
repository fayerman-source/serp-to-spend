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
  SourceLink,
  CTA,
  FaqSection,
  GuideJsonLd,
  buildArticleSchema,
  buildFaqSchema,
} from "../_components";

const PATH = "/guides/ftc-advertising-substantiation-standard";
const HEADLINE = "The FTC Substantiation Standard for Ad Claims, Explained";

export const metadata: Metadata = {
  title: `${HEADLINE} · SERP-to-Spend`,
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
    a: "As a vague, self-descriptive word — \"our expert team,\" \"expert-grade formula\" — no: that's puffery, opinion a reasonable consumer judges for themselves. It's different when the ad presents an actual person or persona AS an expert endorser (\"our expert recommends...\"): the Endorsement Guides (16 C.F.R. § 255.3) then require that endorser to genuinely hold the claimed qualifications and to have actually evaluated the product to the depth that expertise implies. Subjective superiority language like best, great, premium, trusted, and leading stays puffery either way.",
  },
  {
    q: "Does a 'results not typical' disclaimer protect a testimonial claim?",
    a: "A bare disclaimer alone, no — the FTC eliminated that safe harbor in the 2009 revision to the Endorsement Guides. An atypical result is still fine to advertise; the ad just has to clearly disclose the result users generally do achieve, and that generally-expected result must itself be substantiated.",
  },
  {
    q: "Who is liable if an affiliate makes the unsubstantiated claim, not the brand?",
    a: "The advertiser is. Under 16 C.F.R. § 255.1(d), an advertiser is liable for a misleading or unsubstantiated statement an affiliate or endorser makes on its behalf (or for failing to disclose an unexpected material connection) — even if the brand's own ad copy never states it. A truthful, substantiated, properly disclosed affiliate claim doesn't trigger this on its own; the exposure is for the noncompliant ones.",
  },
];

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
            scientific evidence,&rdquo; not testimonials alone. For a health-benefit, efficacy, weight-loss, or
            disease claim that generally means well-designed human clinical studies. A safety claim ordinarily
            evaluated through toxicology or analytical testing &mdash; where testing on people would be
            unethical &mdash; is held to the same competent-and-reliable standard, not literally a human-study
            requirement; the right evidence is field- and claim-specific.
          </P>
        </Section>

        <Section>
          <H2>Testimonials and income claims</H2>
          <P>
            Endorsements and testimonials (16 C.F.R. Part 255) must reflect the endorser&rsquo;s honest opinion.
            A genuine but atypical experience is not itself off-limits &mdash; but unless it also reflects the
            <em>typical</em> experience of users, the ad must clearly and conspicuously disclose the
            generally-expected result, and that result must itself be substantiated. The FTC eliminated
            the old blanket &ldquo;results not typical&rdquo; safe harbor in the 2009 revision to the
            Endorsement Guides (74 Fed. Reg. 53124, effective December 1, 2009); a bare disclaimer has not been
            enough on its own since. The 2023 revision (88 Fed. Reg. 48102, effective July 26, 2023)
            modernized the Guides for social media, influencers, and fake reviews, but left this disclosure
            requirement in place. This applies to income and aggregate-statistic testimonials too:
            &ldquo;our students make $10,000 a month&rdquo; or &ldquo;100% of clients saw returns&rdquo; imply a
            typical result and need the same substantiation or disclosure.
          </P>
          <P>
            Separately, income claims can trigger the Business Opportunity Rule (16 C.F.R. Part 437) &mdash; but
            only when the offer is a true business opportunity: the seller solicits the purchaser to enter a{" "}
            <em>new</em> business, a required payment is involved, <em>plus</em> a representation that the
            seller will (i) provide locations for equipment or displays, (ii) provide outlets, accounts, or
            customers, or (iii) buy back the goods or services the purchaser produces. An ordinary B2B service
            contract with an already-operating business &mdash; a vendor selling lead-generation services to an
            existing company, say &mdash; fails the &ldquo;new business&rdquo; element even if it happens to
            also promise customers. Pure coaching, courses, or general business-development training do not
            count on their own &mdash; but specific advice or training on how to obtain accounts or customers
            does; the rule treats that as &ldquo;providing&rdquo; customers even without directly furnishing
            them. A generic, seller-authored &ldquo;make $X a month&rdquo; claim with no consumer endorsement attached is
            a Section 5 substantiation matter, not automatically a Part 437 violation &mdash; unless it also
            makes one of those three representations. Section 255.2(b) specifically applies once the claim is
            framed as a consumer&rsquo;s endorsement or testimonial (&ldquo;our students make $10,000 a
            month&rdquo;), not to every generic earnings statement the seller makes on its own behalf.
          </P>
        </Section>

        <Section>
          <H2>Who is liable</H2>
          <P>
            The advertiser is liable for a misleading or unsubstantiated claim made in its name, including one
            an affiliate makes on its behalf, or for failing to disclose an unexpected material connection
            (16 C.F.R. § 255.1(d)) &mdash; running an offer through affiliates does not move the substantiation
            burden off the brand.
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

        <FaqSection faq={FAQ} />

        <Section>
          <SourceNote>
            Sources: FTC Act <SourceLink href="https://www.law.cornell.edu/uscode/text/15/45">15 U.S.C. § 45(a)</SourceLink>; FTC{" "}
            <SourceLink href="https://www.ftc.gov/public-statements/1983/03/ftc-policy-statement-regarding-advertising-substantiation">
              Policy Statement Regarding Advertising Substantiation (1983)
            </SourceLink>
            ; Endorsement Guides <SourceLink href="https://www.law.cornell.edu/cfr/text/16/255.2">16 C.F.R. § 255.2(b)</SourceLink>,{" "}
            <SourceLink href="https://www.law.cornell.edu/cfr/text/16/255.3">§ 255.3 (expert endorsements)</SourceLink>,{" "}
            <SourceLink href="https://www.federalregister.gov/documents/2009/10/15/E9-24646/guides-concerning-the-use-of-endorsements-and-testimonials-in-advertising">
              74 Fed. Reg. 53124 (2009)
            </SourceLink>{" "}
            and <SourceLink href="https://www.federalregister.gov/citation/88-FR-48102">88 Fed. Reg. 48102 (2023)</SourceLink>; FTC{" "}
            <SourceLink href="https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance">
              Health Products Compliance Guidance (Dec. 2022)
            </SourceLink>
            ; Business Opportunity Rule <SourceLink href="https://www.law.cornell.edu/cfr/text/16/437.1">16 C.F.R. § 437.1</SourceLink>.
            This is decision support, not legal advice &mdash; see the{" "}
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
