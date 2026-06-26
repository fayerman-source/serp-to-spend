// Shared types for the tool UI and its result components.

export type PolicyRisk = {
  level: "low" | "medium" | "high";
  policy_area: string;
  reasons: string[];
  safe_rewrite: { headline: string; primary_text: string };
};
export type Ad = {
  platform: string;
  headline: string;
  primary_text: string;
  policy_risk: PolicyRisk;
};
export type Angle = { name: string; rationale: string; ads: Ad[] };
export type Audience = { name: string; description: string; targeting_signals: string[] };
export type AdPack = { angles: Angle[]; audiences: Audience[] };
export type ApiResult = { source: string; query: string; pack: AdPack };

export type Teardown = {
  platform: "Meta" | "Google" | "TikTok";
  level: "low" | "medium" | "high";
  policy_area: string;
  findings: Array<{ phrase: string; problem: string }>;
  ftc?: { risk: "low" | "medium" | "high"; standard: string; why: string };
  safe_rewrite: { headline: string; primary_text: string };
};

export type Mode = "check" | "generate";
export type Platform = "Meta" | "Google" | "TikTok";
