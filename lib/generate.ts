// "Generate ads" orchestration: ground -> structured generation -> sanitize.
import type { Grounding } from "./serp";
import { type AdPack, AD_PACK_SCHEMA } from "./schemas";
import { GENERATE_SYSTEM, buildGenerateUserPrompt } from "./prompts/generate";
import { runStructured, stripMarkdown } from "./llm";

export type { AdPack } from "./schemas";

function sanitizeAdPack(pack: AdPack): AdPack {
  for (const angle of pack.angles) {
    for (const ad of angle.ads) {
      ad.headline = stripMarkdown(ad.headline);
      ad.primary_text = stripMarkdown(ad.primary_text);
      ad.policy_risk.safe_rewrite.headline = stripMarkdown(ad.policy_risk.safe_rewrite.headline);
      ad.policy_risk.safe_rewrite.primary_text = stripMarkdown(
        ad.policy_risk.safe_rewrite.primary_text,
      );
    }
  }
  return pack;
}

export async function generateAdPack(g: Grounding): Promise<AdPack> {
  const pack = await runStructured<AdPack>({
    system: GENERATE_SYSTEM,
    user: buildGenerateUserPrompt(g),
    schema: AD_PACK_SCHEMA,
    maxOutputTokens: 32_000,
  });
  return sanitizeAdPack(pack);
}
