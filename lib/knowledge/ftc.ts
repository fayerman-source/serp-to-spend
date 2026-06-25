// Curated FTC advertising-law knowledge, grounded in verified primary sources.
// Every rule names the authority it comes from. Only authorities confirmed
// against a primary source are listed in `sources`. The puffery and platform
// calibration here is load-bearing: it is what keeps the tool from flagging a
// live, already-approved ad. Bump `version` on any change; counsel should vet
// the legal content.
//
// NOTE (pending attorney confirmation, intentionally NOT cited as authority):
// the puffery and establishment-claim case law (Pizza Hut v. Papa John's,
// 227 F.3d 489 (5th Cir. 2000); POM Wonderful v. FTC, 777 F.3d 478 (D.C. Cir.
// 2015); In re Pfizer, 81 F.T.C. 23 (1972)) could not be machine-verified
// against a primary source. The rules below stand on the verified FTC policy
// statements and guidance; the case cites will be added once confirmed.

import type { KnowledgeModule } from "./types";

const KNOWLEDGE = `FTC ADVERTISING STANDARDS. Authority: FTC Act Section 5(a) (15 U.S.C. 45(a)) bars unfair or deceptive acts. A claim is deceptive if it is likely to mislead a reasonable consumer and is material (FTC Policy Statement on Deception, 1983). The advertiser is liable for every claim, including a claim an affiliate makes on its behalf (16 C.F.R. 255.1(d)).

PUFFERY IS NOT A VIOLATION. Subjective, vague superiority or opinion that a reasonable consumer judges for themselves and would not read as a literal, testable fact is non-actionable. Treat the following as PUFFERY and do NOT flag them or demand substantiation:
- Subjective superiority: "best", "great", "amazing", "premium", "world-class".
- Vague expertise or quality: "expert", "elite", "professional", "trusted", "leading", "top".
- Self-judgable opinion: "tastes great", "looks beautiful".
An ad built only on puffery is LOW risk.

A CLAIM NEEDS SUBSTANTIATION when a reasonable consumer would read it as an objective, testable fact. Advertisers must have a reasonable basis (objective evidence) BEFORE the ad runs (FTC Policy Statement Regarding Advertising Substantiation, 1983). It is NOT puffery when the claim is:
- Specific or measurable: "25% faster", "lose 20 pounds in 30 days", "saves $500".
- Performance, safety, health, or efficacy: "reduces wrinkles", "prevents colds".
- An establishment claim invoking proof: "clinically proven", "doctor recommended", "lab tested" - requires the exact level of proof it asserts.
- A guarantee of outcome, or an income or earnings claim: "guaranteed results", "make $5,000 a month".
- Implied: judge the NET IMPRESSION of the whole ad (words, images, omissions), not only the literal words. A "results not typical" disclaimer does NOT cure a misleading impression.

HEALTH, SAFETY, WEIGHT-LOSS, AND DISEASE CLAIMS require "competent and reliable scientific evidence" - well-designed human studies, not testimonials or lab data alone (FTC Health Products Compliance Guidance, December 2022). A money-back guarantee is not a substitute for substantiation.

ENDORSEMENTS AND TESTIMONIALS (16 C.F.R. Part 255) must reflect the endorser's honest opinion (255.1) and the typical experience of users; if results are not typical, the ad must disclose the generally-expected result and substantiate it (255.2(b)). A bare "results not typical" disclaimer is NOT enough under the revised Endorsement Guides (88 Fed. Reg. 48102, eff. July 26, 2023). This applies to income and aggregate-statistic testimonials too ("our students make $10,000 a month", "100% of clients saw returns"): they imply a typical result and need substantiation that it is typical, or disclosure of what users generally achieve. Material connections (paid, free product, employee, affiliate commission) must be disclosed clearly and conspicuously (255.5).

INCOME AND EARNINGS CLAIMS need substantiation that the stated earnings are the TYPICAL result (FTC Act Section 5; 16 C.F.R. 255.2(b)). Separately, the Business Opportunity Rule (16 C.F.R. Part 437) requires a written Earnings Claim Statement - the number and percentage of prior purchasers who achieved the stated earnings (16 C.F.R. 437.4) - but ONLY when the offer is a true business opportunity: a required payment PLUS a representation that the seller will provide locations, outlets, accounts, or customers (16 C.F.R. 437.1(c)). Pure coaching, courses, or "general advice about business development and training" do NOT count (16 C.F.R. 437.1(m)). So a generic "make $X a month" course is an FTC Act Section 5 plus 255.2(b) substantiation matter, NOT a Part 437 violation, unless it also promises customers or outlets. Do not overclaim Part 437.

PLATFORM-POLICY CALIBRATION. Ordinary aspirational or benefit language ("let the experts get you there", "reach your goals", "results", "train smarter", "improve your performance") is standard advertising, NOT an implied guarantee and NOT an unrealistic-outcomes or misrepresentation violation. Reserve those for EXPLICIT guarantees ("guaranteed", "or your money back") or SPECIFIC quantified outcomes ("lose 20 pounds in 30 days", "double your income"). A live, benefit-driven ad with no explicit guarantee and no specific quantified claim is low.`;

export const FTC: KnowledgeModule = {
  name: "FTC",
  version: "2026-06-25",
  knowledge: KNOWLEDGE,
  sources: [
    {
      label: "FTC Act Section 5(a) - unfair or deceptive acts",
      citation: "15 U.S.C. § 45(a)",
      url: "https://www.law.cornell.edu/uscode/text/15/45",
    },
    {
      label: "FTC Policy Statement on Deception (1983)",
      citation: "appended to Cliffdale Associates, Inc., 103 F.T.C. 110 (1984)",
      url: "https://www.ftc.gov/public-statements/1983/10/ftc-policy-statement-deception",
    },
    {
      label: "FTC Policy Statement Regarding Advertising Substantiation (1983)",
      citation: "appended to Thompson Medical Co., 104 F.T.C. 648 (1984)",
      url: "https://www.ftc.gov/public-statements/1983/03/ftc-policy-statement-regarding-advertising-substantiation",
    },
    {
      label: "Endorsement Guides - honest opinion; advertiser liable for endorser/affiliate claims",
      citation: "16 C.F.R. § 255.1",
      url: "https://www.law.cornell.edu/cfr/text/16/255.1",
    },
    {
      label: "Endorsement Guides - typical-results requirement",
      citation: "16 C.F.R. § 255.2(b)",
      url: "https://www.law.cornell.edu/cfr/text/16/255.2",
    },
    {
      label: "Endorsement Guides - material connection disclosure",
      citation: "16 C.F.R. § 255.5",
      url: "https://www.law.cornell.edu/cfr/text/16/255.5",
    },
    {
      label: "Endorsement Guides 2023 revision - a 'results not typical' disclaimer is insufficient",
      citation: "88 Fed. Reg. 48102 (eff. July 26, 2023)",
      url: "https://www.federalregister.gov/citation/88-FR-48102",
    },
    {
      label: "Business Opportunity Rule - definition (required payment + customer/outlet/location representation)",
      citation: "16 C.F.R. § 437.1(c)",
      url: "https://www.law.cornell.edu/cfr/text/16/437.1",
    },
    {
      label: "Business Opportunity Rule - scope limit (advertising and general training is not 'providing customers/outlets')",
      citation: "16 C.F.R. § 437.1(m)",
      url: "https://www.law.cornell.edu/cfr/text/16/437.1",
    },
    {
      label: "Business Opportunity Rule - Earnings Claim Statement requirement",
      citation: "16 C.F.R. § 437.4",
      url: "https://www.law.cornell.edu/cfr/text/16/437.4",
    },
    {
      label: "FTC Health Products Compliance Guidance (December 2022) - competent and reliable scientific evidence",
      citation: "FTC Business Guidance (Dec. 2022)",
      url: "https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance",
    },
  ],
};
