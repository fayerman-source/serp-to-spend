// FDA drug-claim exposure, grounded in verified primary sources (US Code / CFR).
// This is a separate regulator from the FTC: a disease claim is a product-status
// and labeling problem under the FDCA, on top of any FTC advertising issue. The
// case law / enforcement templates (Warning Letters, MOUs) were not machine-
// verifiable and are intentionally NOT cited; the statutory framework is. Counsel
// should vet. Bump `version` on any change.

import type { KnowledgeModule } from "./types";

const KNOWLEDGE = `FDA DRUG-CLAIM EXPOSURE (a separate regulator from the FTC). When an ad claims a product can diagnose, cure, mitigate, treat, or prevent a DISEASE, federal law classifies that product as a "drug" regardless of its ingredients (FDCA, 21 U.S.C. 321(g)(1)(B)). That is a product-status and labeling problem under the FDA's jurisdiction, on top of any FTC advertising problem. For disease claims, surface this explicitly - it is the bigger and most-missed risk.

- DISEASE CLAIMS make it a drug: "cures arthritis", "reverses diabetes", "treats depression", "prevents cancer". An unapproved new drug may not be introduced into interstate commerce without FDA approval (21 U.S.C. 355(a)); doing so is a prohibited act and misbranding (21 U.S.C. 331(a); 352(a)). Exposure includes an FDA Warning Letter, seizure, or injunction, distinct from FTC ad enforcement.
- STRUCTURE/FUNCTION CLAIMS are different and allowed: for a dietary supplement, claims about supporting normal structure or function ("supports joint health", "promotes healthy glucose metabolism") do not require FDA pre-approval (21 U.S.C. 343(r)(6)), but they require the FDA disclaimer ("This statement has not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.") and FDA notification (21 CFR 101.93). The line: supporting a normal function is fine; naming a disease to treat converts the product to a drug.
- JURISDICTION: the FTC regulates the advertising (deception and substantiation); the FDA regulates product status and labeling. A disease claim is usually BOTH an FTC problem and an FDA problem; name the FDA exposure separately.`;

export const FDA: KnowledgeModule = {
  name: "FDA",
  version: "2026-06-25",
  knowledge: KNOWLEDGE,
  sources: [
    {
      label: "FDCA - a product marketed to treat/cure/prevent disease is a 'drug'",
      citation: "21 U.S.C. § 321(g)(1)(B)",
      url: "https://www.law.cornell.edu/uscode/text/21/321",
    },
    {
      label: "Unapproved new drug may not enter interstate commerce",
      citation: "21 U.S.C. § 355(a)",
      url: "https://www.law.cornell.edu/uscode/text/21/355",
    },
    {
      label: "Prohibited acts (introducing a misbranded/unapproved drug)",
      citation: "21 U.S.C. § 331(a)",
      url: "https://www.law.cornell.edu/uscode/text/21/331",
    },
    {
      label: "Misbranding - false or misleading labeling",
      citation: "21 U.S.C. § 352(a)",
      url: "https://www.law.cornell.edu/uscode/text/21/352",
    },
    {
      label: "DSHEA - structure/function claims allowed for supplements",
      citation: "21 U.S.C. § 343(r)(6)",
      url: "https://www.law.cornell.edu/uscode/text/21/343",
    },
    {
      label: "Structure/function claim disclaimer + FDA notification",
      citation: "21 C.F.R. § 101.93",
      url: "https://www.law.cornell.edu/cfr/text/21/101.93",
    },
  ],
};
