// "Check an ad" orchestration: paste an ad -> per-platform policy + FTC teardown.
import { type Teardown, TEARDOWN_SCHEMA } from "./schemas";
import { buildTeardownSystem, buildTeardownUserPrompt } from "./prompts/teardown";
import { runStructured, stripMarkdown } from "./llm";

export type { Teardown } from "./schemas";

export function sanitizeTeardown(t: Teardown): Teardown {
  t.safe_rewrite.headline = stripMarkdown(t.safe_rewrite.headline);
  t.safe_rewrite.primary_text = stripMarkdown(t.safe_rewrite.primary_text);
  return t;
}

export async function checkAd(
  platform: "Meta" | "Google" | "TikTok",
  adText: string,
): Promise<Teardown> {
  // platform is set from the request, not the model; the schema omits it.
  const parsed = await runStructured<Omit<Teardown, "platform">>({
    system: buildTeardownSystem(platform),
    user: buildTeardownUserPrompt(platform, adText),
    schema: TEARDOWN_SCHEMA,
    // Generous headroom. On dense, multi-violation ads the model's thinking
    // tokens and the teardown JSON share this budget; too tight a cap can cut
    // the FTC rationale ("why") mid-sentence even though the JSON stays valid.
    maxOutputTokens: 16_000,
  });
  return sanitizeTeardown({ ...parsed, platform });
}
