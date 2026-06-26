// Structured-output schemas and their TypeScript types, kept in one place so the
// JSON Schema (Gemini `responseJsonSchema` / Claude `output_config.format`) and the
// type the rest of the app consumes never drift apart.
//
// JSON Schema limits to respect: no minLength/maxLength, no numeric constraints,
// `additionalProperties: false` on every object. Keep it plain.

// ---------------------------------------------------------------------------
// Ad pack (the "Generate ads" flow)
// ---------------------------------------------------------------------------

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
  }>;
  audiences: Array<{
    name: string;
    description: string;
    targeting_signals: string[];
  }>;
};

export const AD_PACK_SCHEMA = {
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
        },
        required: ["name", "rationale", "ads"],
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

// ---------------------------------------------------------------------------
// Teardown (the "Check an ad" flow)
// ---------------------------------------------------------------------------

export type Teardown = {
  platform: "Meta" | "Google" | "TikTok";
  level: "low" | "medium" | "high";
  policy_area: string;
  findings: Array<{ phrase: string; problem: string }>;
  ftc: { risk: "low" | "medium" | "high"; standard: string; why: string };
  safe_rewrite: { headline: string; primary_text: string };
};

export const TEARDOWN_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    level: { type: "string", enum: ["low", "medium", "high"] },
    policy_area: { type: "string" },
    findings: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          phrase: { type: "string" },
          problem: { type: "string" },
        },
        required: ["phrase", "problem"],
      },
    },
    ftc: {
      type: "object",
      additionalProperties: false,
      properties: {
        risk: { type: "string", enum: ["low", "medium", "high"] },
        standard: { type: "string" },
        why: { type: "string" },
      },
      required: ["risk", "standard", "why"],
    },
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
  required: ["level", "policy_area", "findings", "ftc", "safe_rewrite"],
} as const;
