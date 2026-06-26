import { describe, it, expect } from "vitest";
import type { AdPack } from "./schemas";
import { sanitizeAdPack } from "./generate";

describe("sanitizeAdPack", () => {
  it("strips markdown from ad copy and the safe rewrite", () => {
    const pack: AdPack = {
      angles: [
        {
          name: "A",
          rationale: "r",
          ads: [
            {
              platform: "Meta",
              headline: "*Big* sale",
              primary_text: "buy `now`",
              policy_risk: {
                level: "medium",
                policy_area: "x",
                reasons: [],
                safe_rewrite: { headline: "Big *deal*", primary_text: "clean `copy`" },
              },
            },
          ],
        },
      ],
      audiences: [],
    };
    const ad = sanitizeAdPack(pack).angles[0].ads[0];
    expect(ad.headline).toBe("Big sale");
    expect(ad.primary_text).toBe("buy now");
    expect(ad.policy_risk.safe_rewrite.headline).toBe("Big deal");
    expect(ad.policy_risk.safe_rewrite.primary_text).toBe("clean copy");
  });
});
