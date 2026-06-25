import { describe, it, expect } from "vitest";
import { buildTeardownUserPrompt } from "./teardown";

describe("buildTeardownUserPrompt", () => {
  it("includes the platform and the ad text", () => {
    const p = buildTeardownUserPrompt("Meta", "Lose 20 pounds guaranteed");
    expect(p).toContain("Platform: Meta");
    expect(p).toContain("Lose 20 pounds guaranteed");
  });
});
