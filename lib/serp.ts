import { Agent, fetch as undiciFetch } from "undici";
import type { LookupFunction } from "node:net";
import { getGeminiClient } from "./vertex";
import { resolvePublicHttpUrl, type ResolvedAddress } from "./ssrf";

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

const MAX_REDIRECTS = 5;

// A dns.lookup-compatible function that ignores the hostname it's given and
// always returns the exact addresses we already validated as public. Plain
// re-validation before each fetch is not enough: the SSRF check and fetch()'s
// own DNS resolution are two separate lookups, and a malicious DNS server can
// answer with a public IP for the first and a private one for the second
// (DNS rebinding). Pinning the connector's lookup closes that gap — the TCP
// connection can only ever reach an address this module itself validated.
function pinnedLookup(addresses: ResolvedAddress[]): LookupFunction {
  return ((_hostname: string, options: unknown, callback: (...args: unknown[]) => void) => {
    const wantsAll = typeof options === "object" && options !== null && (options as { all?: boolean }).all;
    if (wantsAll) {
      callback(null, addresses);
    } else {
      const first = addresses[0];
      callback(null, first.address, first.family);
    }
  }) as unknown as LookupFunction;
}

const FETCH_DEADLINE_MS = 12_000;

// Fetches a user-submitted URL server-side (competitor/offer grounding). Validates
// the target isn't loopback/private/link-local (SSRF guard) before every request,
// pins the actual TCP connection to the validated address (see pinnedLookup), and
// follows redirects manually — re-validating and re-pinning each hop — so neither
// a redirect nor a second DNS answer can sidestep the check. One AbortSignal is
// shared across every hop: resetting a fresh 12s timeout per hop would let up to
// MAX_REDIRECTS+1 slow hops add up to ~72s, past the route's 60s function limit.
async function fetchPage(rawUrl: string): Promise<string> {
  const deadline = AbortSignal.timeout(FETCH_DEADLINE_MS);
  let current = rawUrl;
  for (let hop = 0; ; hop++) {
    const { url, addresses } = await resolvePublicHttpUrl(current, { signal: deadline });
    // Own this hop's connection pool explicitly and close it once we're done
    // with the response — an Agent left open after fetchPage returns leaks
    // its idle sockets, and each hop gets a fresh Agent anyway (the pinned
    // addresses differ per host).
    const agent = new Agent({ connect: { lookup: pinnedLookup(addresses), timeout: FETCH_DEADLINE_MS } });
    try {
      const res = await undiciFetch(url, {
        headers: { "user-agent": "Mozilla/5.0 (compatible; serp-to-spend/0.1)" },
        // One deadline for the whole call (DNS + every hop), not reset per hop.
        signal: deadline,
        redirect: "manual",
        dispatcher: agent,
      });
      if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
        await res.body?.cancel();
        if (hop >= MAX_REDIRECTS) throw new Error("Too many redirects.");
        current = new URL(res.headers.get("location")!, url).toString();
        continue;
      }
      if (!res.ok) throw new Error(`Fetch failed (${res.status}) for ${current}`);
      const html = await res.text();
      return htmlToText(html).slice(0, 6_000);
    } finally {
      await agent.close();
    }
  }
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
  const ai = getGeminiClient();
  const res = await ai.models.generateContent({
    // Flash is plenty for retrieval/summarization; keeps grounding cheap.
    model: process.env.GEMINI_GROUNDING_MODEL ?? "gemini-2.5-flash",
    contents:
      `Use Google Search to research this query: "${query}".\n` +
      `Report briefly as plain text, to ground ad creative:\n` +
      `1) The dominant search intent.\n` +
      `2) The top 5 results (title + what each offers).\n` +
      `3) The angles and recurring claims/language competitors use.\n` +
      `Be brief and factual.`,
    config: { tools: [{ googleSearch: {} }], maxOutputTokens: 1200 },
  });
  const text = res.text?.trim();
  if (!text) throw new Error("Google Search grounding returned no text.");
  return text.slice(0, 5_000);
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
