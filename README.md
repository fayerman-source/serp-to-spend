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

**Generate ads.** Paste a keyword or a competitor's offer page and it produces, grounded in a live Google Search (for a keyword) or the offer page itself (for a URL):
- 3 genuinely distinct angles (different psychological drivers, not reworded headlines),
- platform-native ad copy for Meta, Google, and TikTok under each angle,
- 3 audience ideas with real targeting signals,

and it scores every generated ad for per-platform disapproval risk, each with a passing rewrite. (The deeper FTC substantiation layer lives in Check an ad.)

## Why this one?

I did not want to build another ad generator. There are dozens of good ones and that space is saturated, so before writing any code I ran a systematic opportunity scan across several market lenses plus a survey of what already exists. The one real, unserved opening was the affiliate and performance-marketing problem of ad disapprovals: teams lose real money every week to rejected ads, and on claim-heavy offers it is constant, yet almost nothing checks whether an ad's claims will survive platform review and FTC scrutiny before the spend.

That gap also comes with a moat I can actually hold. The compliance engine is grounded in real, cited legal authority, not a prompt wrapper on a cold model. The platform policies and the FTC/FDA rules live in sourced, versioned knowledge modules where every rule traces to a statute, a CFR section, or a published policy (for example, 15 U.S.C. § 45, 16 C.F.R. Part 255, the FTC Health Products Compliance Guidance, and FDCA 21 U.S.C. § 321(g) for disease claims). The output names the exact authority it cites, and the tool knows the puffery line so it does not cry wolf on a clean, already-running ad. A generic generator can copy this UI in a weekend; it cannot easily copy that.

## How it works

- **Check an ad:** the pasted ad and platform go straight to the compliance engine, which returns the per-platform policy verdict, FTC risk, the offending phrases, and a passing rewrite as one validated JSON object.
- **Generate ads:** a keyword is grounded in a live Google Search (via Gemini's search tool) when that provider is configured; a URL fetches the offer page; grounding can also be toggled off, in which case the run is honestly labeled as ungrounded. The grounded context produces the angles, copy, and audiences, and each ad gets the per-platform disapproval check with a passing rewrite. The UI always labels which grounding source ran.

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
- The compliance knowledge lives in sourced, versioned modules under `lib/knowledge/` (one per reviewer: FTC, FDA, Meta, Google, TikTok), each rule tied to a real authority. Both flows compose the same modules, so they cite the same policies
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
lib/knowledge/              sourced policy modules (ftc, fda, meta, google, tiktok) + registry
```

## What I'd build next (if this were full-time)

- **Close the loop into a data moat.** Ground the compliance check in real submit-to-verdict outcomes through the Meta and Google ad APIs, so the risk model learns from actual disapprovals instead of policy text. No generic generator can build that dataset.
- **Per-advertiser calibration.** Learn which flagged patterns a specific account actually got rejected for, and tune the risk model to it.
- **Counsel-reviewed knowledge layer.** Conduct a formal attorney review pass and add the case-law citations to the already sourced and versioned legal modules, turning the moat into something defensible enough to stand behind in writing.
- **Drop straight into the campaign.** Export winning variants to CSV / Meta bulk-import.
