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
  Ul,
  Li,
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
    "Which ad claims need proof before they run, which ones are puffery, and what \"competent and reliable\" evidence means under FTC guidance: the actual citations, not a paraphrase.",
  alternates: { canonical: PATH },
  openGraph: openGraphFor(PATH),
};

const FAQ = [
  {
    q: "What is the FTC substantiation standard?",
    a: "Under the FTC's 1983 Policy Statement Regarding Advertising Substantiation, an advertiser must have a reasonable basis (objective evidence) for a claim before the ad runs, not after a challenge. The required level of proof scales with the claim: a specific, measurable, or health-related claim needs stronger evidence than a general one.",
  },
  {
    q: "Is 'best' or 'expert' a claim that needs substantiation?",
    a: "As a vague, self-descriptive word (\"our expert team,\" \"expert-grade formula\"), no: that's puffery, opinion a reasonable consumer judges for themselves. It's different when the ad presents a person or persona as an expert endorser (\"our expert recommends...\"). The Endorsement Guides (16 C.F.R. § 255.3) then require that endorser to in fact hold the claimed qualifications and to have exercised that expertise in evaluating the product. Subjective superiority language like best, great, premium, trusted, and leading stays puffery either way.",
  },
  {
    q: "Does a 'results not typical' disclaimer protect a testimonial claim?",
    a: "A bare disclaimer alone, no. The FTC eliminated that safe harbor in the 2009 revision to the Endorsement Guides. An atypical result is still fine to advertise; the ad just has to clearly disclose the result users generally do achieve, and that generally expected result must itself be substantiated.",
  },
  {
    q: "Who is liable if an affiliate makes the unsubstantiated claim, not the brand?",
    a: "The advertiser is. Under 16 C.F.R. § 255.1(d), an advertiser is liable for a misleading or unsubstantiated statement an affiliate or endorser makes on its behalf. It is also liable for failing to disclose an unexpected material connection. That holds even if the brand's own ad copy never states it. A truthful, substantiated, properly disclosed affiliate claim doesn't trigger this on its own; the exposure is for the noncompliant ones.",
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
          Most ad claims are fine. The FTC's own rule is narrower than most media buyers assume. But the
          claims that do trigger it need real evidence in hand before the ad runs, not after someone files a
          complaint.
        </Dek>

        <Section>
          <H2>The rule, not a paraphrase</H2>
          <P>
            FTC Act Section 5(a) (15 U.S.C. § 45(a)) bars unfair or deceptive acts. A claim is deceptive if it
            is likely to mislead a reasonable consumer and is material to their decision (FTC Policy Statement
            on Deception, 1983). Separately, the 1983 Policy Statement Regarding Advertising Substantiation
            requires advertisers to have a reasonable basis (objective evidence) for a claim{" "}
            <em>before</em> the ad runs.
          </P>
        </Section>

        <Section>
          <H2>Puffery vs. a claim that needs proof</H2>
          <P>
            The FTC does not require proof for subjective opinion a reasonable consumer would judge for
            themselves. Draw the line here:
          </P>
          <H3>Puffery: no substantiation required</H3>
          <Ul>
            <Li>Subjective superiority: &ldquo;best,&rdquo; &ldquo;great,&rdquo; &ldquo;amazing,&rdquo; &ldquo;premium,&rdquo; &ldquo;world-class.&rdquo;</Li>
            <Li>Vague expertise or quality: &ldquo;expert,&rdquo; &ldquo;elite,&rdquo; &ldquo;professional,&rdquo; &ldquo;trusted,&rdquo; &ldquo;leading,&rdquo; &ldquo;top.&rdquo;</Li>
            <Li>Self-judgable opinion: &ldquo;tastes great,&rdquo; &ldquo;looks beautiful.&rdquo;</Li>
          </Ul>
          <H3>Needs substantiation before the ad runs</H3>
          <Ul>
            <Li>Specific or measurable: &ldquo;25% faster,&rdquo; &ldquo;lose 20 pounds in 30 days,&rdquo; &ldquo;saves $500.&rdquo;</Li>
            <Li>Performance, safety, health, or efficacy claims: &ldquo;reduces wrinkles,&rdquo; &ldquo;prevents colds.&rdquo;</Li>
            <Li>Establishment claims invoking proof: &ldquo;clinically proven,&rdquo; &ldquo;doctor recommended,&rdquo; &ldquo;lab tested&rdquo;: each requires the exact level of proof it asserts.</Li>
            <Li>A guarantee of outcome, or an income/earnings claim.</Li>
            <Li>The implied net impression of the whole ad: words, images, and omissions together, not just the literal text.</Li>
          </Ul>
          <P>
            Health, safety, weight-loss, and disease claims sit at the top of the evidence bar. The FTC&rsquo;s
            Health Products Compliance Guidance (December 2022) requires &ldquo;competent and reliable
            scientific evidence,&rdquo; not testimonials alone. For a health-benefit, efficacy, weight-loss, or
            disease claim that generally means well-designed human clinical studies. Some safety claims cannot
            ethically be tested on people. Those are ordinarily evaluated through toxicology or analytical
            testing, and they are held to the same competent-and-reliable standard, not to a literal
            human-study requirement. The right evidence is field- and claim-specific.
          </P>
        </Section>

        <Section>
          <H2>Testimonials and income claims</H2>
          <P>
            Endorsements and testimonials (16 C.F.R. Part 255) must reflect the endorser&rsquo;s honest opinion.
            A genuine but atypical experience is not itself off-limits. But unless it also reflects the
            <em>typical</em> experience of users, the ad must clearly and conspicuously disclose the
            generally expected result. That result must itself be substantiated. The FTC eliminated
            the old blanket &ldquo;results not typical&rdquo; safe harbor in the 2009 revision to the
            Endorsement Guides (74 Fed. Reg. 53124, effective December 1, 2009). A bare disclaimer has not been
            enough on its own since. The 2023 revision (88 Fed. Reg. 48102, effective July 26, 2023)
            modernized the Guides for social media, influencers, and fake reviews, but left this disclosure
            requirement in place. This applies to income and aggregate-statistic testimonials too.
            &ldquo;Our students make $10,000 a month&rdquo; or &ldquo;100% of clients saw returns&rdquo; imply a
            typical result and need the same substantiation or disclosure.
          </P>
          <P>
            Separately, income claims can trigger the Business Opportunity Rule (16 C.F.R. Part 437). That
            rule applies only to a true business opportunity, which has three elements: the seller solicits
            the purchaser to enter a <em>new</em> business; the purchaser makes a required payment; and the
            seller represents that it will do at least one of the following:
          </P>
          <Ul>
            <Li>The seller will provide locations for equipment or displays.</Li>
            <Li>The seller will provide outlets, accounts, or customers.</Li>
            <Li>The seller will buy back the goods or services the purchaser produces.</Li>
          </Ul>
          <P>
            An ordinary B2B service contract with an already-operating business fails the &ldquo;new
            business&rdquo; element. A vendor selling lead-generation services to an existing company, say,
            still promises customers, but that alone does not make it a business opportunity.
          </P>
          <P>
            Pure coaching, courses, or general business-development training do not count on their own. But
            specific advice or training on how to obtain accounts or customers does. The rule treats that as
            &ldquo;providing&rdquo; customers, even without directly furnishing them.
          </P>
          <P>
            A generic, seller-authored &ldquo;make $X a month&rdquo; claim with no consumer endorsement
            attached is a Section 5 substantiation matter. It is not a Part 437 matter unless the offer also
            meets all three elements above.
          </P>
          <P>
            Section 255.2(b) applies once the claim is framed as a consumer&rsquo;s endorsement
            or testimonial (&ldquo;our students make $10,000 a month&rdquo;). It does not apply to every
            generic earnings statement the seller makes on its own behalf.
          </P>
        </Section>

        <Section>
          <H2>Who is liable</H2>
          <P>
            The advertiser is liable for a misleading or unsubstantiated claim made in its name, including one
            an affiliate makes on its behalf. It is also liable for failing to disclose an unexpected material
            connection (16 C.F.R. § 255.1(d)). Running an offer through affiliates does not move the
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
            This is decision support, not legal advice: see the{" "}
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
