import { GoogleGenAI } from "@google/genai";
import { vertexOptions } from "./vertex";

// SERP / page grounding. Modes, in priority order (when search is enabled):
//   1. Input is a URL              -> fetch the page, strip to text (competitor/offer grounding)
//   2. Keyword + GOOGLE_CLOUD_PROJECT -> Gemini's Google Search grounding (real live results, bills GCP)
//   3. Keyword + SERPAPI_KEY       -> pull organic results from SerpApi
//   4. Keyword, none of the above (or search toggled off) -> no grounding; model works from the keyword
//
// Returns a compact text block the model can read, plus a label describing the source
// so the UI can be honest about how grounded a given run is.

export type Grounding = {
  source: "url" | "gemini-search" | "serpapi" | "none";
  query: string;
  context: string; // may be empty when source === "none"
};

const URL_RE = /^https?:\/\//i;

export function looksLikeUrl(input: string): boolean {
  return URL_RE.test(input.trim());
}

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchPage(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0 (compatible; serp-to-spend/0.1)" },
    // Don't let a slow competitor page hang the whole request.
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) throw new Error(`Fetch failed (${res.status}) for ${url}`);
  const html = await res.text();
  return htmlToText(html).slice(0, 6_000);
}

async function fetchSerp(query: string, key: string): Promise<string> {
  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("q", query);
  url.searchParams.set("engine", "google");
  url.searchParams.set("num", "10");
  url.searchParams.set("api_key", key);

  const res = await fetch(url, { signal: AbortSignal.timeout(12_000) });
  if (!res.ok) throw new Error(`SerpApi failed (${res.status})`);
  const data = (await res.json()) as {
    organic_results?: Array<{ title?: string; snippet?: string; link?: string }>;
  };
  const rows = (data.organic_results ?? []).slice(0, 10).map((r, i) => {
    const parts = [`${i + 1}. ${r.title ?? "(no title)"}`];
    if (r.snippet) parts.push(`   ${r.snippet}`);
    if (r.link) parts.push(`   ${r.link}`);
    return parts.join("\n");
  });
  return rows.join("\n");
}

// Gemini's built-in Google Search grounding. The model runs real Google searches and
// reports back what's ranking. Kept as a SEPARATE call from the structured ad-pack
// generation, because combining the search tool with strict JSON output can conflict.
async function fetchGeminiSearch(query: string): Promise<string> {
  const ai = new GoogleGenAI(vertexOptions());
  const res = await ai.models.generateContent({
    // Flash is plenty for retrieval/summarization; keeps grounding cheap.
    model: process.env.GEMINI_GROUNDING_MODEL ?? "gemini-2.5-flash",
    contents:
      `Use Google Search to research this query: "${query}".\n` +
      `Report concisely, as plain text, to ground ad creative:\n` +
      `1) The dominant search intent behind this query.\n` +
      `2) The top organic results (title + what each one offers), up to 10.\n` +
      `3) The angles and messaging competitors already use.\n` +
      `4) Recurring language, claims, or offers that show up across results.\n` +
      `Keep it factual and tight.`,
    config: { tools: [{ googleSearch: {} }] },
  });
  const text = res.text?.trim();
  if (!text) throw new Error("Google Search grounding returned no text.");
  return text.slice(0, 6_000);
}

export async function ground(
  input: string,
  opts?: { useSearch?: boolean },
): Promise<Grounding> {
  const query = input.trim();
  const useSearch = opts?.useSearch !== false; // default on

  if (looksLikeUrl(query)) {
    const context = await fetchPage(query);
    return { source: "url", query, context };
  }

  if (useSearch && process.env.GOOGLE_CLOUD_PROJECT) {
    const context = await fetchGeminiSearch(query);
    return { source: "gemini-search", query, context };
  }

  if (useSearch && process.env.SERPAPI_KEY) {
    const context = await fetchSerp(query, process.env.SERPAPI_KEY);
    return { source: "serpapi", query, context };
  }

  return { source: "none", query, context: "" };
}
