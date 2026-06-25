# SERP-to-Spend

**The disapproval guard for paid ads.** It writes your ad creative, then catches the claims that get ads rejected, before you ever submit them.

## The problem

Affiliate and performance teams lose real money to one thing every week: **rejected ads.** A disapproval does not just waste the creative time. It stalls the campaign, burns the ad account's standing with the platform, and on claim-heavy offers it happens constantly. On top of that, unprovable claims are an FTC problem, not just a platform one.

There are already many good AI tools that write ad copy and generate creative. Almost none of them check whether the claims in that copy will survive review. That is the gap this tool is built around.

## What it does

**1. Catches risky claims (the part that matters).** It reads every generated ad and flags the claims that could get it rejected, the way a compliance reviewer would. Not just banned words. It catches claims that have to be *true and provable*: "authentic," "based in Kenya," "produces champions," "guaranteed results." For each one it names the exact phrase and tells you what you would need to prove to keep it, or how to reword it. Each ad gets a low / medium / high risk flag.

**2. Generates the creative to check.** Paste a keyword or a competitor's offer page and it produces, grounded in live search:
- 4 genuinely distinct angles (different psychological drivers, not reworded headlines)
- platform-native ad copy for Meta, Google, and TikTok under each angle
- a message-matched landing-page wireframe per angle
- 3 audience ideas with real targeting signals

## Why it's built this way

Most AI ad tools optimize for producing more creative. This one optimizes for creative that survives review. Before you spend, it tells you which claims in each ad would trip a specific Meta, Google, or TikTok policy, names that policy, and hands you a version that passes. For a team that loses real money to rejected ads and account restrictions, catching that before submission is worth more than another batch of headlines.

## How it works

1. **Ground.** A keyword runs a live Google Search (via Gemini's search tool) to see what actually ranks and how competitors message it. A URL fetches the offer page directly. You can toggle grounding off to compare. The UI always labels which source ran, so a run is never silently ungrounded.
2. **Generate.** The grounded context produces the angles, copy, landing pages, and audiences as one validated JSON object.
3. **Check.** Every ad is scored for disapproval and substantiation risk, with the exact phrase and the fix.

## Run it

```bash
npm install
cp .env.local.example .env.local   # pick a provider (see below)
npm run dev                        # http://localhost:3000
```

## Stack

- Next.js (App Router), React, TypeScript
- **Provider-agnostic** behind one interface, env-selected:
  - **Gemini on Vertex AI** (`@google/genai`, `gemini-2.5-flash`/`pro`), with live Google Search grounding
  - **Claude** (`@anthropic-ai/sdk`, `claude-opus-4-8`), first-party or on Vertex
  - Either way the output is a single **validated JSON schema**, not parsed prose, so the UI renders structured data
- All keys and credentials live only on the server (`/api/generate`); the browser never sees them

## Architecture

```
app/page.tsx              the UI: input, grounding toggle, rendered results
app/api/generate/route.ts POST: ground -> generate -> sanitize -> JSON
lib/serp.ts               grounding (Gemini Google Search | URL fetch | SerpApi | none)
lib/generate.ts           provider switch, prompt, schema, risk check, markdown strip
```

## Next steps (roadmap)

- Export winning variants to CSV / Meta bulk-import
- Per-advertiser feedback loop: learn which flagged patterns this account actually got rejected for, and tune the risk model to it
- A standalone "paste an ad, check it" mode, so the compliance check works on creative made anywhere, not just here
