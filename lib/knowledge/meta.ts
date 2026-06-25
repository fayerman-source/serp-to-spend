// Meta advertising policy knowledge, sourced from Meta's published Advertising
// Standards (transparency.meta.com/policies/ad-standards). Policy names are
// quoted as Meta publishes them. Bump `version` on any change.

import type { KnowledgeModule } from "./types";

const KNOWLEDGE = `META ADVERTISING STANDARDS (transparency.meta.com). Judge against Meta's published Advertising Standards:
- Privacy Violations and Personal Attributes: ads must not assert or imply a person's personal attributes or condition - race, religion, age, health or medical conditions, financial status, and similar. Avoid implied-attribute hooks like "are you overweight?" or "struggling with debt?".
- Fraud, Scams and Deceptive Practices: no deceptive or misleading practices, including misleading outcome claims.
- Health and Wellness (a Restricted category): ads must not imply or generate negative self-perception, or promote unrealistic outcomes; weight-loss and cosmetic claims are restricted and must target audiences 18+.
Meta organizes its standards as Unacceptable content (banned), Restricted goods and services (allowed with conditions), and Objectionable content. Name the specific standard a finding triggers in Meta's own terms.`;

export const META: KnowledgeModule = {
  name: "Meta",
  version: "2026-06-25",
  knowledge: KNOWLEDGE,
  sources: [
    {
      label: "Meta Advertising Standards - Privacy Violations and Personal Attributes",
      citation: "Meta Advertising Standards",
      url: "https://transparency.meta.com/policies/ad-standards/",
    },
    {
      label: "Meta Advertising Standards - Fraud, Scams and Deceptive Practices",
      citation: "Meta Advertising Standards",
      url: "https://transparency.meta.com/policies/ad-standards/",
    },
    {
      label: "Meta Advertising Standards - Health and Wellness (Restricted)",
      citation: "Meta Advertising Standards",
      url: "https://transparency.meta.com/policies/ad-standards/",
    },
  ],
};
