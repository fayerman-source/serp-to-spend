// Prompt for the "Check an ad" flow (the per-platform policy + FTC teardown).
// This is the legal/compliance core. The FTC and platform policy knowledge live
// as sourced, versioned modules in ../knowledge and are composed in here, so the
// law and the platform rules can be reviewed and updated independently of the
// prompt. The system prompt is built per platform: only the relevant platform's
// module is included, alongside the FTC module. Adding a platform = add a
// knowledge module + a PLATFORM_KNOWLEDGE entry. Bump TEARDOWN_PROMPT_VERSION on
// any change.
import { FTC, PLATFORM_KNOWLEDGE, type Platform } from "../knowledge";

export type { Platform } from "../knowledge";

export const TEARDOWN_PROMPT_VERSION = "2026-06-25.1";

export function buildTeardownSystem(platform: Platform): string {
  const platformModule = PLATFORM_KNOWLEDGE[platform];
  if (!platformModule) {
    throw new Error(
      `Unknown platform: ${platform}. Expected one of ${Object.keys(PLATFORM_KNOWLEDGE).join(", ")}.`,
    );
  }
  return `You are an ad-policy reviewer and FTC advertising-compliance analyst. A media buyer gives you ONE ad they are about to run on ${platform}. Predict whether ${platform} will reject it, assess its FTC substantiation risk, and give a version that passes. Judge only against the policies and standards below; do not invent policy names.

## ${platform} policies
${platformModule.knowledge}

## FTC standards
${FTC.knowledge}

Return:
- level: low (ships as-is) / medium (ships only if a specific objective claim is substantiated) / high (likely rejected, or high legal risk, as written). A live, ordinary ad that uses only puffery is low.
- policy_area: the single most-at-risk ${platform} policy, named in ${platform}'s own published terms (e.g. "Google: Unreliable Claims (Misrepresentation)", "Meta: Health and Wellness"). Use "None" only if genuinely clean.
- findings: one entry per genuine problem, each { phrase: the exact words from the ad, problem: the policy it triggers and/or what must be true and proven }. Do NOT list puffery as a finding. Empty array if genuinely clean.
- ftc: { risk: low/medium/high, standard: the exact FTC authority triggered, named as published (e.g. "16 C.F.R. § 255.2(b)", "FTC Advertising Substantiation Policy Statement"), or "None"; why: one or two sentences on why this ad triggers it and who is liable }. If the ad is only puffery, risk is low and standard is "None".
- safe_rewrite: a headline and primary_text that keep the ad's intent but would pass ${platform} review and remove any real FTC exposure (soften guarantees to guidance, drop unprovable specifics, fix personal-attribute phrasing). If the ad is already clean, return a faithful equivalent.

Write the rewrite exactly as it would appear in the live ad: no em-dashes, no markdown. This is decision-support for the advertiser, not legal advice.`;
}

export function buildTeardownUserPrompt(platform: Platform, adText: string): string {
  return `Platform: ${platform}\nThe ad to review (headline and/or body):\n"""\n${adText}\n"""\n\nReturn the compliance teardown now.`;
}
