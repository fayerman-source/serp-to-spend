// Google Ads policy knowledge, sourced from Google's published Advertising
// Policies (support.google.com/adspolicy). Policy names are quoted as Google
// publishes them - note the real policy is "Unreliable Claims", not the
// "Unverifiable claims" the earlier hand-written prompt invented. Bump
// `version` on any change.

import type { KnowledgeModule } from "./types";

const KNOWLEDGE = `GOOGLE ADS POLICIES (support.google.com/adspolicy). Judge against Google's published policies:
- Misrepresentation, and its sub-policies:
  - Unreliable Claims: inaccurate claims, or enticing the user with an improbable result as the likely outcome, is not allowed. This is the policy for unrealistic or "guaranteed" results (there is no Google policy named "unverifiable claims").
  - Unacceptable Business Practices: scamming users by hiding or misrepresenting info about the business, product, or service.
  - Misleading Representation: misleading statements, or omitting material info about identity, affiliations, or qualifications.
  - Clickbait Ads: clickbait or sensationalist text or imagery, or exploiting negative life events to induce fear or guilt.
  - Misleading Ad Design: making it difficult for the user to understand they are interacting with an ad.
- Editorial: incorrect or gimmicky capitalization, punctuation, symbols, spacing, or repetition is not allowed.
- Restricted content: Healthcare and medicines; Financial products and services (e.g. APR and term disclosures, prohibited products).
Name the specific policy a finding triggers in Google's own terms (e.g. "Google: Unreliable Claims (Misrepresentation)").`;

export const GOOGLE: KnowledgeModule = {
  name: "Google",
  version: "2026-06-25",
  knowledge: KNOWLEDGE,
  sources: [
    {
      label: "Google Ads - Misrepresentation (Unreliable Claims, Unacceptable Business Practices, Clickbait, Misleading Ad Design)",
      citation: "Google Ads Policies: Misrepresentation",
      url: "https://support.google.com/adspolicy/answer/6020955",
    },
    {
      label: "Google Ads - Editorial and technical",
      citation: "Google Ads Policies: Editorial",
      url: "https://support.google.com/adspolicy/answer/6021546",
    },
    {
      label: "Google Ads - Healthcare and medicines (Restricted)",
      citation: "Google Ads Policies: Healthcare and medicines",
      url: "https://support.google.com/adspolicy/answer/176031",
    },
    {
      label: "Google Ads - Financial products and services (Restricted)",
      citation: "Google Ads Policies: Financial products and services",
      url: "https://support.google.com/adspolicy/answer/2464998",
    },
  ],
};
