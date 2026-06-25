import Anthropic from "@anthropic-ai/sdk";
import { AnthropicVertex } from "@anthropic-ai/vertex-sdk";
import { GoogleGenAI } from "@google/genai";
import type { Grounding } from "./serp";

// The structured shape we force the model to return. Structured-output JSON Schema
// has limits (no minLength/maxLength, additionalProperties:false required, no
// numeric constraints) — keep it plain.
export type AdPack = {
  angles: Array<{
    name: string;
    rationale: string;
    ads: Array<{
      platform: "Meta" | "Google" | "TikTok";
      headline: string;
      primary_text: string;
      policy_risk: {
        level: "low" | "medium" | "high";
        policy_area: string;
        reasons: string[];
        safe_rewrite: { headline: string; primary_text: string };
      };
    }>;
    landing_page: {
      hero_headline: string;
      hero_subhead: string;
      primary_cta: string;
      form_fields: string[];
      sections: Array<{ block: string; heading: string; body: string }>;
    };
  }>;
  audiences: Array<{
    name: string;
    description: string;
    targeting_signals: string[];
  }>;
};

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    angles: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          rationale: { type: "string" },
          ads: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                platform: { type: "string", enum: ["Meta", "Google", "TikTok"] },
                headline: { type: "string" },
                primary_text: { type: "string" },
                policy_risk: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    level: { type: "string", enum: ["low", "medium", "high"] },
                    policy_area: { type: "string" },
                    reasons: { type: "array", items: { type: "string" } },
                    safe_rewrite: {
                      type: "object",
                      additionalProperties: false,
                      properties: {
                        headline: { type: "string" },
                        primary_text: { type: "string" },
                      },
                      required: ["headline", "primary_text"],
                    },
                  },
                  required: ["level", "policy_area", "reasons", "safe_rewrite"],
                },
              },
              required: ["platform", "headline", "primary_text", "policy_risk"],
            },
          },
          landing_page: {
            type: "object",
            additionalProperties: false,
            properties: {
              hero_headline: { type: "string" },
              hero_subhead: { type: "string" },
              primary_cta: { type: "string" },
              form_fields: { type: "array", items: { type: "string" } },
              sections: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    block: { type: "string" },
                    heading: { type: "string" },
                    body: { type: "string" },
                  },
                  required: ["block", "heading", "body"],
                },
              },
            },
            required: ["hero_headline", "hero_subhead", "primary_cta", "form_fields", "sections"],
          },
        },
        required: ["name", "rationale", "ads", "landing_page"],
      },
    },
    audiences: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          targeting_signals: { type: "array", items: { type: "string" } },
        },
        required: ["name", "description", "targeting_signals"],
      },
    },
  },
  required: ["angles", "audiences"],
} as const;

const SYSTEM = `You are a senior performance-marketing strategist at an affiliate/media-buying shop.
You turn search intent into ad creative that survives platform review.

For the given topic, produce 4 angles that are GENUINELY DISTINCT. Each must rest on a different core buying motivation, and no two may make the same underlying promise or outcome. Concretely: if two angles would both reduce to "get a better result with our product" (for example, two different angles both about achieving personal bests), that is a duplicate. Keep one and replace the other with a different driver. Draw from genuinely different drivers such as: identity/authenticity, status/aspiration, convenience/access, price/value, risk-reversal/guarantee, curiosity/contrarian, community/belonging, fear-of-missing-out, or problem-agitate-solve. An angle is a psychological hook, not a reworded headline. For each angle, write one platform-native ad for Meta, Google, and TikTok:
- Meta: scroll-stopping primary text + a short headline.
- Google: a Responsive Search Ad style headline (<=30 chars ideal) + description-style primary text.
- TikTok: native, casual, creator-voice hook as primary text + a short headline.

For EVERY ad, predict whether THAT SPECIFIC PLATFORM will reject it, the way that platform's own ad reviewer would. The platforms have different policies, so judge each ad against its own:
- Meta (Facebook/Instagram): Personal Attributes (must not assert or imply the reader's characteristics or condition, e.g. "are you struggling with...", "tired of being slow"), Unrealistic Outcomes (no implied guarantee of results), Health/before-after claims, sensational or misleading content.
- Google: Misrepresentation (unrealistic or guaranteed results, clickbait), Unverifiable claims, Editorial (no gimmicky caps or punctuation), restricted categories, trademark misuse.
- TikTok: Exaggerated or misleading claims, before/after, shocking or fear-based content, restricted-industry rules.
On EVERY platform also flag any claim that must be TRUE and provable: identity/origin/authority/statistics (e.g. "authentic Kenyan coach", "produces champions", "#1", "guaranteed", named credentials, "coaches based in Kenya"). If the advertiser cannot prove it, it is misrepresentation to the platform and deceptive under FTC rules. Flag these even when the ad otherwise reads clean.

For each ad return:
- policy_area: the single most-at-risk policy, named in that platform's own terms (e.g. "Meta: Personal Attributes", "Google: Misrepresentation (unrealistic claims)", "TikTok: Exaggerated claims"). Use "None" only if genuinely clean.
- level: low (ships as-is) / medium (ships only if a named claim is substantiated) / high (will likely be rejected as written).
- reasons: name the exact phrase and what triggers the policy or must be proven. Empty array only when level is low.
- safe_rewrite: a headline and primary_text that KEEP the same angle but would pass that platform's review (remove or soften the trigger, reframe outcomes as guidance not guarantees, fix personal-attribute phrasing, drop unprovable specifics). When level is low, return a clean equivalent of the original.

For EACH angle, also design a landing-page wireframe that matches that angle's hook (message-match is what protects the click and the Quality Score). Give a hero headline and subhead, the primary CTA text, the form fields to capture, and an ordered list of page sections. Each section has a block type (hero, social_proof, features, offer, objection, faq, cta, etc.), a heading, and a one or two sentence body describing what goes there. Keep claims defensible: the landing page is also subject to platform and FTC review.

Then propose 3 audience ideas grounded in the search intent: a name, a one-line description, and concrete targeting signals (interests, behaviors, keywords, lookalike seeds).

Be specific and usable on Monday. Write every ad headline and primary_text exactly as it would appear in the live ad: no em-dashes, and no markdown formatting (no asterisks, bold, underscores, or backticks) anywhere in the copy. No preamble.`;

function buildUserPrompt(g: Grounding): string {
  const head =
    g.source === "url"
      ? `Topic source: a competitor/offer page at ${g.query}. Use the page content below to ground angles and copy in what this offer actually says.`
      : g.source === "gemini-search" || g.source === "serpapi"
        ? `Topic: "${g.query}". Below is live Google Search research for this query (what actually ranks and how competitors message it). Ground angles in this real searcher intent and the language the market already responds to.`
        : `Topic: "${g.query}". No live search data was available for this run, so work from the keyword and your own knowledge of the market. Note: angles are NOT grounded in live results.`;

  const body = g.context ? `\n\n--- GROUNDING ---\n${g.context}\n--- END GROUNDING ---` : "";
  return `${head}${body}\n\nReturn the ad pack now.`;
}

// Provider selection (env-driven), in precedence order:
//   1. LLM_PROVIDER if set ("gemini" | "claude")
//   2. else "gemini" when GOOGLE_CLOUD_PROJECT is set (Vertex Gemini, bills GCP credit)
//   3. else "claude" (Anthropic-on-Vertex if ANTHROPIC_VERTEX_PROJECT_ID, else first-party key)
function provider(): "gemini" | "claude" {
  const explicit = process.env.LLM_PROVIDER?.toLowerCase();
  if (explicit === "gemini" || explicit === "claude") return explicit;
  return process.env.GOOGLE_CLOUD_PROJECT ? "gemini" : "claude";
}

// ---- Gemini on Vertex (Google GenAI SDK) ----
let gemini: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!gemini) {
    gemini = new GoogleGenAI({
      vertexai: true,
      project: process.env.GOOGLE_CLOUD_PROJECT,
      location: process.env.GOOGLE_CLOUD_LOCATION ?? "us-central1",
    });
  }
  return gemini;
}

async function generateWithGemini(g: Grounding): Promise<AdPack> {
  const res = await getGemini().models.generateContent({
    model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
    contents: buildUserPrompt(g),
    config: {
      systemInstruction: SYSTEM,
      responseMimeType: "application/json",
      // The same JSON Schema we use for Claude; Gemini 2.5 accepts it directly.
      responseJsonSchema: SCHEMA as unknown as Record<string, unknown>,
      // Generous cap so thinking + the JSON body don't truncate (billed on actual use).
      maxOutputTokens: 32_768,
    },
  });
  const text = res.text;
  if (!text) {
    throw new Error("Gemini returned no text (response blocked or truncated).");
  }
  return JSON.parse(text) as AdPack;
}

// ---- Claude (first-party Anthropic, or Anthropic-on-Vertex) ----
type ClaudeClient = Anthropic | AnthropicVertex;
let claude: ClaudeClient | null = null;
function getClaude(): ClaudeClient {
  if (claude) return claude;
  const vertexProject = process.env.ANTHROPIC_VERTEX_PROJECT_ID;
  claude = vertexProject
    ? new AnthropicVertex({
        projectId: vertexProject,
        region: process.env.CLOUD_ML_REGION ?? "global",
      })
    : new Anthropic(); // reads ANTHROPIC_API_KEY from env
  return claude;
}

async function generateWithClaude(g: Grounding): Promise<AdPack> {
  const response = await getClaude().messages.create({
    model: process.env.CLAUDE_MODEL ?? "claude-opus-4-8",
    max_tokens: 16_000,
    system: SYSTEM,
    output_config: { format: { type: "json_schema", schema: SCHEMA } },
    messages: [{ role: "user", content: buildUserPrompt(g) }],
  });

  if (response.stop_reason === "refusal") {
    throw new Error("The model declined to generate for this topic.");
  }
  const text = response.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") {
    throw new Error("No text content returned.");
  }
  return JSON.parse(text.text) as AdPack;
}

// The prompt asks the model to avoid markdown in ad copy, but it slips in
// asterisk/backtick emphasis occasionally. Strip it deterministically so the
// ad copy is always exactly what would appear in the live ad.
function stripMarkdown(s: string): string {
  return s
    .replace(/[`*]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

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
  const pack =
    provider() === "gemini" ? await generateWithGemini(g) : await generateWithClaude(g);
  return sanitizeAdPack(pack);
}
