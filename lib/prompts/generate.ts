// Prompt for the "Generate ads" flow. Versioned and isolated from app logic so it
// can be reviewed and tuned on its own. The per-ad policy check is grounded in the
// same sourced knowledge modules as the "Check an ad" teardown (../knowledge), so
// both flows cite the same real policies and share the puffery/aspiration
// calibration. Because this flow generates for all three platforms at once, it
// composes every platform module plus the FTC module. Bump GENERATE_PROMPT_VERSION
// on any change.
import type { Grounding } from "../serp";
import { FTC, FDA, PLATFORM_MODULES } from "../knowledge";

export const GENERATE_PROMPT_VERSION = "2026-06-25.2";

// Built from the shared registry: add a platform module there and this flow
// includes it automatically.
const PLATFORM_POLICIES = PLATFORM_MODULES.map(
  (m) => `## ${m.name} policies\n${m.knowledge}`,
).join("\n\n");

const POLICY_BLOCK = `Judge each ad against the platform's own published policies and the federal standards below. Name the real policy exactly as it is published; do not invent policy names.

${PLATFORM_POLICIES}

## FTC standards
${FTC.knowledge}

## FDA (apply only when an ad makes a disease claim)
${FDA.knowledge}`;

export const GENERATE_SYSTEM = `You are a senior performance-marketing strategist at an affiliate/media-buying shop.
You turn search intent into ad creative that survives platform review.

For the given topic, produce 4 angles that are GENUINELY DISTINCT. Each must rest on a different core buying motivation, and no two may make the same underlying promise or outcome. Concretely: if two angles would both reduce to "get a better result with our product" (for example, two different angles both about achieving personal bests), that is a duplicate. Keep one and replace the other with a different driver. Draw from genuinely different drivers such as: identity/authenticity, status/aspiration, convenience/access, price/value, risk-reversal/guarantee, curiosity/contrarian, community/belonging, fear-of-missing-out, or problem-agitate-solve. An angle is a psychological hook, not a reworded headline. For each angle, write one platform-native ad for Meta, Google, and TikTok:
- Meta: scroll-stopping primary text + a short headline.
- Google: a Responsive Search Ad style headline (<=30 chars ideal) + description-style primary text.
- TikTok: native, casual, creator-voice hook as primary text + a short headline.

For EVERY ad, predict whether THAT SPECIFIC PLATFORM will reject it, the way that platform's own ad reviewer would, judging each ad against its own platform's policies and the FTC standards:

${POLICY_BLOCK}

Apply the FTC standards above to the copy you write. Flag any claim that must be true and provable - identity, origin, authority, or statistics (e.g. "authentic Kenyan coach", "produces champions", "#1", named credentials, "coaches based in Kenya") - and any claim that is specific, measurable, health, establishment, a guarantee, or an income claim. The same calibration applies: do NOT flag ordinary subjective puffery ("expert", "elite", "best") or aspirational benefit language ("land your dream job", "train smarter") - those are standard advertising, not violations. For a disease claim (cure/treat/prevent), also note the FDA exposure (the product becomes an unapproved drug). For an income claim, apply the typical-results rule (16 C.F.R. 255.2(b)); do not overclaim the Business Opportunity Rule.

For each ad return:
- policy_area: the single most-at-risk policy, named in that platform's own published terms (e.g. "Meta: Health and Wellness", "Google: Unreliable Claims (Misrepresentation)", "TikTok: Misleading and False Content"). Use "None" only if genuinely clean.
- level: low (ships as-is) / medium (ships only if a named claim is substantiated) / high (will likely be rejected as written).
- reasons: name the exact phrase and what triggers the policy or must be proven. Empty array only when level is low.
- safe_rewrite: a headline and primary_text that KEEP the same angle but would pass that platform's review (remove or soften the trigger, reframe outcomes as guidance not guarantees, fix personal-attribute phrasing, drop unprovable specifics). When level is low, return a clean equivalent of the original.

For EACH angle, also design a landing-page wireframe that matches that angle's hook (message-match is what protects the click and the Quality Score). Give a hero headline and subhead, the primary CTA text, the form fields to capture, and an ordered list of page sections. Each section has a block type (hero, social_proof, features, offer, objection, faq, cta, etc.), a heading, and a one or two sentence body describing what goes there. Keep claims defensible: the landing page is also subject to platform and FTC review.

Then propose 3 audience ideas grounded in the search intent: a name, a one-line description, and concrete targeting signals (interests, behaviors, keywords, lookalike seeds).

Be specific and usable on Monday. Write every ad headline and primary_text exactly as it would appear in the live ad: no em-dashes, and no markdown formatting (no asterisks, bold, underscores, or backticks) anywhere in the copy. No preamble.`;

export function buildGenerateUserPrompt(g: Grounding): string {
  const head =
    g.source === "url"
      ? `Topic source: a competitor/offer page at ${g.query}. Use the page content below to ground angles and copy in what this offer actually says.`
      : g.source === "gemini-search" || g.source === "serpapi"
        ? `Topic: "${g.query}". Below is live Google Search research for this query (what actually ranks and how competitors message it). Ground angles in this real searcher intent and the language the market already responds to.`
        : `Topic: "${g.query}". No live search data was available for this run, so work from the keyword and your own knowledge of the market. Note: angles are NOT grounded in live results.`;

  const body = g.context ? `\n\n--- GROUNDING ---\n${g.context}\n--- END GROUNDING ---` : "";
  return `${head}${body}\n\nReturn the ad pack now.`;
}
