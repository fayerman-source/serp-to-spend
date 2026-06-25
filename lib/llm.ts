// Shared LLM layer: provider selection, clients, and one generic structured-output
// call used by both flows. Keeps the Gemini/Claude branching in exactly one place.
import Anthropic from "@anthropic-ai/sdk";
import { AnthropicVertex } from "@anthropic-ai/vertex-sdk";
import { GoogleGenAI } from "@google/genai";

// Provider selection (env-driven), in precedence order:
//   1. LLM_PROVIDER if set ("gemini" | "claude")
//   2. else "gemini" when GOOGLE_CLOUD_PROJECT is set (Vertex Gemini, bills GCP credit)
//   3. else "claude" (Anthropic-on-Vertex if ANTHROPIC_VERTEX_PROJECT_ID, else first-party key)
export function provider(): "gemini" | "claude" {
  const explicit = process.env.LLM_PROVIDER?.toLowerCase();
  if (explicit === "gemini" || explicit === "claude") return explicit;
  return process.env.GOOGLE_CLOUD_PROJECT ? "gemini" : "claude";
}

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

// Models slip in asterisk/backtick emphasis despite the prompt; strip it so ad copy
// is always exactly what would appear in the live ad.
export function stripMarkdown(s: string): string {
  return s
    .replace(/[`*]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// One structured-output call for either provider. Returns the parsed JSON as T.
// The schema is the same JSON Schema for both (Gemini `responseJsonSchema`,
// Claude `output_config.format`).
export async function runStructured<T>(args: {
  system: string;
  user: string;
  schema: unknown;
  maxOutputTokens: number;
}): Promise<T> {
  const { system, user, schema, maxOutputTokens } = args;

  if (provider() === "gemini") {
    const res = await getGemini().models.generateContent({
      model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
      contents: user,
      config: {
        systemInstruction: system,
        responseMimeType: "application/json",
        responseJsonSchema: schema as Record<string, unknown>,
        maxOutputTokens,
      },
    });
    if (!res.text) {
      throw new Error("The model returned no text (response blocked or truncated).");
    }
    return JSON.parse(res.text) as T;
  }

  const response = await getClaude().messages.create({
    model: process.env.CLAUDE_MODEL ?? "claude-opus-4-8",
    // Keep non-streaming Claude requests in the safe range; Gemini gets the full cap.
    max_tokens: Math.min(maxOutputTokens, 16_000),
    system,
    output_config: { format: { type: "json_schema", schema: schema as Record<string, unknown> } },
    messages: [{ role: "user", content: user }],
  });

  if (response.stop_reason === "refusal") {
    throw new Error("The model declined this request.");
  }
  const text = response.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") {
    throw new Error("No text content returned.");
  }
  return JSON.parse(text.text) as T;
}
