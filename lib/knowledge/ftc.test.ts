import { describe, it, expect } from "vitest";
import { FTC_STANDARDS, FTC_STANDARDS_VERSION } from "./ftc";
import { TEARDOWN_SYSTEM } from "../prompts/teardown";

describe("FTC standards knowledge", () => {
  it("has a version set", () => {
    expect(FTC_STANDARDS_VERSION).toMatch(/\d{4}-\d{2}-\d{2}/);
  });

  it("encodes the load-bearing doctrines", () => {
    const text = FTC_STANDARDS.toLowerCase();
    expect(text).toContain("puffery"); // the calibration anchor
    expect(text).toContain("competent and reliable"); // substantiation standard
    expect(text).toContain("results not typical"); // endorsement rule
    expect(text).toContain("net impression"); // implied claims
    expect(text).toContain("affiliate"); // advertiser liability for affiliate claims
  });

  it("names puffery examples that must NOT be flagged", () => {
    // The Runna false-positive was triggered by treating these as claims.
    for (const word of ["expert", "elite", "best"]) {
      expect(FTC_STANDARDS.toLowerCase()).toContain(word);
    }
  });
});

describe("teardown prompt composition", () => {
  it("composes the FTC standards into the system prompt", () => {
    // A distinctive marker from FTC_STANDARDS must appear in the assembled prompt.
    expect(TEARDOWN_SYSTEM).toContain("PUFFERY IS NOT A VIOLATION");
  });
});
