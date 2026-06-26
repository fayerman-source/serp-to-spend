// The API-contract types are owned by lib/schemas.ts, where the JSON Schema and
// the TypeScript type are kept in lockstep. Alias them here (type-only, so nothing
// is added to the client bundle) and derive the UI sub-shapes, so the UI can never
// drift from the server contract.
import type * as Schema from "../lib/schemas";

export type AdPack = Schema.AdPack;
export type Teardown = Schema.Teardown;

export type Angle = Schema.AdPack["angles"][number];
export type Ad = Angle["ads"][number];
export type PolicyRisk = Ad["policy_risk"];
export type Audience = Schema.AdPack["audiences"][number];

export type ApiResult = { source: string; query: string; pack: Schema.AdPack };
export type Mode = "check" | "generate";
export type Platform = "Meta" | "Google" | "TikTok";
