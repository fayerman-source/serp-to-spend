# SERP-to-Spend

**Creative + compliance, one tool.** Write ads that survive Meta, Google, and FTC review. Or paste an ad you already have and find out, before you spend, exactly what would get it rejected and how to fix it.

## The problem

Affiliate and performance teams lose real money to one thing every week: **rejected ads.** A disapproval does not just waste the creative time. It stalls the campaign, burns the ad account's standing with the platform, and on claim-heavy offers it happens constantly. On top of that, unprovable claims are an FTC problem (the advertiser is liable, even for an affiliate's claim), not only a platform one.

Plenty of AI tools write ad copy. Almost none check whether the claims in that copy will survive platform review and FTC scrutiny. That gap is what this tool is built around.

## What it does

**Check an ad (the front door).** Paste an ad you are about to run and pick the platform. You get:
- the specific Meta, Google, or TikTok policy it would trip, in that platform's own terms;
- the FTC substantiation risk (the standard a claim triggers, and who is liable);
- a rewrite that passes.

It is grounded in a curated FTC standards module that knows the **puffery line**: subjective claims like "expert," "elite," or "best" are not violations, so it does not cry wolf on clean, already-running ads. It reserves the warnings for claims that genuinely need proof: measurable, health, establishment (like "clinically proven"), guarantees, and income claims.

**Generate ads.** Paste a keyword or a competitor's offer page and it produces, grounded in live Google Search:
- 4 genuinely distinct angles (different psychological drivers, not reworded headlines),
- platform-native ad copy for Meta, Google, and TikTok under each angle,
- a message-matched landing-page wireframe per angle,
- 3 audience ideas with real targeting signals,

and it runs every generated ad through the same per-platform plus FTC check, each with a passing rewrite.

## Why it's built this way

Plenty of tools generate ad creative, often with images and video this one does not. This one is built around the job those tools do poorly: telling you, before you spend, which claims would trip a specific platform policy or carry FTC exposure, and handing you a version that ships. The FTC grounding (the puffery distinction, the substantiation standards, advertiser liability) is the part that is genuinely hard to copy, and the reason a media buyer can trust the verdict.

## How it works

- **Check an ad:** the pasted ad and platform go straight to the compliance engine, which returns the per-platform policy verdict, FTC risk, the offending phrases, and a passing rewrite as one validated JSON object.
- **Generate ads:** a keyword runs a live Google Search (via Gemini's search tool) to see what actually ranks; a URL fetches the offer page. The grounded context produces the angles, copy, landing pages, and audiences, each ad scored by the same compliance engine. The UI always labels which grounding source ran, so a run is never silently ungrounded.

## Run it

```bash
npm install
cp .env.local.example .env.local   # pick a provider (see below)
npm run dev                        # http://localhost:3000
npm test                           # vitest unit tests
```

## Stack

- Next.js (App Router), React, TypeScript
- **Provider-agnostic** behind one interface, env-selected:
  - **Gemini on Vertex AI** (`@google/genai`, `gemini-2.5-flash`/`pro`), with live Google Search grounding
  - **Claude** (`@anthropic-ai/sdk`, `claude-opus-4-8`), first-party or on Vertex
  - Either way the output is a single **validated JSON schema**, not parsed prose
- The FTC standards live in a curated, versioned module (`lib/knowledge/ftc.ts`), separate from the prompts so the legal content can be reviewed and updated on its own
- All keys and credentials live only on the server (the API routes); the browser never sees them

## Architecture

```
app/page.tsx                two modes (Check an ad / Generate ads) + rendered results
app/api/check/route.ts      POST: paste an ad -> compliance teardown
app/api/generate/route.ts   POST: ground -> generate -> sanitize -> JSON
lib/check.ts                "Check an ad" orchestration
lib/generate.ts             "Generate ads" orchestration
lib/serp.ts                 grounding (Gemini Google Search | URL fetch | SerpApi | none)
lib/llm.ts                  provider selection + one structured-output call
lib/prompts/                system prompts, version-tagged
lib/schemas.ts              output types + JSON schemas
lib/knowledge/ftc.ts        curated, versioned FTC standards
```

## Next steps (roadmap)

- Export winning variants to CSV / Meta bulk-import
- Per-advertiser feedback loop: learn which flagged patterns an account actually got rejected for, and tune the risk model to it
- Ground the compliance check in real submit-to-verdict outcomes via the Meta and Google ad APIs, the data moat a generic generator does not have
