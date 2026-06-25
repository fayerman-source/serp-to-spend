// Public API of the compliance knowledge layer. Both flows consume from here:
// the "Check an ad" teardown (one platform per check) and the "Generate ads"
// flow (all platforms at once) share the same sourced modules and registry, so
// they cite the same real policies and apply the same calibration.

export type { KnowledgeModule, Source } from "./types";
export { FTC } from "./ftc";
export { FDA } from "./fda";
export { META } from "./meta";
export { GOOGLE } from "./google";
export { TIKTOK } from "./tiktok";

import type { KnowledgeModule } from "./types";
import { META } from "./meta";
import { GOOGLE } from "./google";
import { TIKTOK } from "./tiktok";

export type Platform = "Meta" | "Google" | "TikTok";

// Single source of truth for platform -> knowledge module.
export const PLATFORM_KNOWLEDGE: Record<Platform, KnowledgeModule> = {
  Meta: META,
  Google: GOOGLE,
  TikTok: TIKTOK,
};

// The platform modules as a list (derived from the registry, not a second
// hand-maintained copy), for flows that judge against all platforms.
export const PLATFORM_MODULES: KnowledgeModule[] = Object.values(PLATFORM_KNOWLEDGE);
