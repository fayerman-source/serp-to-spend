// TikTok advertising policy knowledge. Honest-limitation case: at build time
// only TikTok's "Misleading and False Content" policy was reachable from the
// published help center; the other categories (prohibited/restricted
// industries, body-image rules) returned errors and are intentionally NOT
// asserted here. Ship only what is verified. Bump `version` on any change.

import type { KnowledgeModule } from "./types";

const KNOWLEDGE = `TIKTOK ADVERTISING POLICIES (ads.tiktok.com). Judge against the TikTok policy that is verifiable from TikTok's published help center:
- Misleading and False Content: ads cannot promise or exaggerate product results, use absolute terms about performance, or make unsubstantiated claims (e.g. cures for incurable diseases). Before-and-after and comparative claims are restricted unless supported by evidence or clear disclaimers. Fake or non-functional buttons (clickbait) and unauthorized use of a public figure's likeness are prohibited. Significantly modified AI-generated content requires clear labeling.
TikTok's other policy categories (prohibited or restricted industries, body-image rules) were not publicly verifiable at build time and are intentionally not asserted; do not invent TikTok policy names. Name the verified policy in TikTok's own terms.`;

export const TIKTOK: KnowledgeModule = {
  name: "TikTok",
  version: "2026-06-25",
  knowledge: KNOWLEDGE,
  sources: [
    {
      label: "TikTok Ads Policy - Misleading and False Content",
      citation: "TikTok Advertising Policies: Misleading and False Content",
      url: "https://ads.tiktok.com/help/article/tiktok-ads-policy-misleading-and-false-content",
    },
  ],
};
