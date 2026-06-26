// The API-contract types are owned by lib/schemas.ts, where the JSON Schema and
// the TypeScript type are kept in lockstep. Re-export them here (type-only, so
// nothing is added to the client bundle) and derive the sub-shapes, so the UI
// can never drift from the server contract.
import type { AdPack, Teardown } from "../lib/schemas";

export type { AdPack, Teardown };

export type Angle = AdPack["angles"][number];
export type Ad = Angle["ads"][number];
export type PolicyRisk = Ad["policy_risk"];
export type Audience = AdPack["audiences"][number];

export type ApiResult = { source: string; query: string; pack: AdPack };
export type Mode = "check" | "generate";
export type Platform = "Meta" | "Google" | "TikTok";
