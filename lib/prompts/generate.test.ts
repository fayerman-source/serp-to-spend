import { describe, it, expect } from "vitest";
import type { Grounding } from "../serp";
import { buildGenerateUserPrompt } from "./generate";

describe("buildGenerateUserPrompt", () => {
  it("includes the grounding block when context is present", () => {
    const g: Grounding = {
      source: "gemini-search",
      query: "kenyan running coach",
      context: "TOP RESULTS: runna, online coaching ...",
    };
    const p = buildGenerateUserPrompt(g);
    expect(p).toContain("--- GROUNDING ---");
    expect(p).toContain("TOP RESULTS");
    expect(p).toContain("live Google Search");
  });

  it("flags ungrounded runs and omits the grounding block when source is none", () => {
    const g: Grounding = { source: "none", query: "crm software", context: "" };
    const p = buildGenerateUserPrompt(g);
    expect(p).toContain("NOT grounded");
    expect(p).not.toContain("--- GROUNDING ---");
  });

  it("uses competitor/offer-page framing for a URL source", () => {
    const g: Grounding = { source: "url", query: "https://example.com/offer", context: "page text" };
    const p = buildGenerateUserPrompt(g);
    expect(p).toContain("competitor/offer page");
  });
});
