// "Check an ad" orchestration: paste an ad -> per-platform policy + FTC teardown.
import { type Teardown, TEARDOWN_SCHEMA } from "./schemas";
import { TEARDOWN_SYSTEM, buildTeardownUserPrompt } from "./prompts/teardown";
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
    system: TEARDOWN_SYSTEM,
    user: buildTeardownUserPrompt(platform, adText),
    schema: TEARDOWN_SCHEMA,
    maxOutputTokens: 8_000,
  });
  return sanitizeTeardown({ ...parsed, platform });
}
