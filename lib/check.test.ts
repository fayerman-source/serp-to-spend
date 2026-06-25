import { describe, it, expect } from "vitest";
import type { Teardown } from "./schemas";
import { sanitizeTeardown } from "./check";

describe("sanitizeTeardown", () => {
  it("strips markdown from the safe rewrite", () => {
    const t: Teardown = {
      platform: "Meta",
      level: "high",
      policy_area: "Meta: Unrealistic Outcomes",
      findings: [],
      ftc: { risk: "low", standard: "None", why: "" },
      safe_rewrite: { headline: "*Bold* headline", primary_text: "text with `code` here" },
    };
    const out = sanitizeTeardown(t);
    expect(out.safe_rewrite.headline).toBe("Bold headline");
    expect(out.safe_rewrite.primary_text).toBe("text with code here");
  });
});
